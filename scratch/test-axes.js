import { readFile } from "node:fs/promises";
import { join } from "node:path";

const companies = JSON.parse(await readFile(join("data", "companies-detail.json"), "utf8"));

function parseSales(salesStr) {
  if (!salesStr) return null;
  const clean = salesStr.replace(/,/g, "").match(/\d+/);
  return clean ? parseInt(clean[0], 10) : null;
}

companies.forEach(company => {
  const dataPoints = company.financials.map(f => {
    const sales = parseSales(f.sales);
    const profit = parseSales(f.profit);
    const profitRate = (sales && profit) ? parseFloat(((profit / sales) * 100).toFixed(1)) : null;
    return {
      year: f.year,
      sales: sales,
      profitRate: profitRate
    };
  }).filter(d => d.sales !== null && d.profitRate !== null);

  if (dataPoints.length < 2) {
    console.log(`${company.company} (${company.slug}): 非公開/データ不足`);
    return;
  }

  const maxSales = Math.max(...dataPoints.map(d => d.sales));
  const rawLeftMax = maxSales * 1.15;
  const stepsLeft = [
    1, 2, 5, 10, 25, 50, 100, 250, 500, 1000, 1250, 1500, 2000, 2500, 5000,
    10000, 12500, 15000, 20000, 25000, 50000, 100000, 125000, 150000, 200000, 250000, 500000, 1000000
  ];
  let leftStep = 100000;
  for (let s of stepsLeft) {
    if (s * 4 >= rawLeftMax) {
      leftStep = s;
      break;
    }
  }
  const yLeftMax = leftStep * 4;

  const maxRate = Math.max(...dataPoints.map(d => d.profitRate));
  const rawRightMax = maxRate * 1.15;
  const rightCandidates = [4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 48, 60, 80, 100];
  let yRightMax = 20;
  for (let c of rightCandidates) {
    if (c >= rawRightMax) {
      yRightMax = c;
      break;
    }
  }

  console.log(`${company.company} (${company.slug}):`);
  console.log(`  Max Sales: ${maxSales} -> Left Max: ${yLeftMax} (Step: ${leftStep})`);
  console.log(`  Max Rate: ${maxRate}% -> Right Max: ${yRightMax}%`);
});
