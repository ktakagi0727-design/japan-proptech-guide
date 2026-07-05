import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const rawDataPath = join(root, "data", "companies-raw-data.json");
const top30Path = join(root, "top30.json");
const outputPath = join(root, "data", "companies-detail.json");

// Helper to extract star rating and description
function extractEvaluation(html, title) {
  // Account for potential whitespace differences
  const regex = new RegExp(
    `<div class="evaluation-title">\\s*${title}\\s*</div>\\s*<div class="stars">([\\s\\S]*?)</div>\\s*<p class="evaluation-desc">([\\s\\S]*?)</p>`,
    "i"
  );
  const match = html.match(regex);
  if (!match) return { stars: 0, desc: "" };
  const starsHtml = match[1];
  const desc = match[2].trim();
  
  // Count solid stars (not containing class="star-empty")
  const starEmptyCount = (starsHtml.match(/class="star-empty"[^>]*>★/g) || []).length;
  const totalStars = (starsHtml.match(/★/g) || []).length;
  const stars = totalStars - starEmptyCount;
  
  return { stars, desc };
}

// Helper to extract content from framework cards
function extractFrameworkCard(html, title) {
  const regex = new RegExp(`<h3>\\s*${title}\\s*</h3>\\s*<p>([\\s\\S]*?)</p>`, "i");
  const match = html.match(regex);
  return match ? match[1].trim() : "";
}

// Helper to extract our analysis
function extractOurAnalysis(html) {
  const regex = /<div class="our-analysis-content">([\s\S]*?)<\/div>/i;
  const match = html.match(regex);
  if (!match) return "";
  const pMatches = match[1].match(/<p>([\s\S]*?)<\/p>/gi);
  if (!pMatches) return match[1].replace(/<[^>]*>/g, "").trim();
  return pMatches.map(p => p.replace(/<\/?p>/gi, "").trim()).join("\n\n");
}

async function run() {
  console.log("Reading raw data and top30 files...");
  const rawDataText = await readFile(rawDataPath, "utf8");
  const rawData = JSON.parse(rawDataText.replace(/^\uFEFF/, ""));
  const top30Text = await readFile(top30Path, "utf8");
  const top30 = JSON.parse(top30Text.replace(/^\uFEFF/, ""));

  const companiesMap = new Map();
  for (const c of rawData) {
    companiesMap.set(c.company, c);
  }

  console.log(`Processing ${top30.length} case studies...`);
  
  for (const item of top30) {
    const company = companiesMap.get(item.Adopter);
    if (!company) {
      console.warn(`Warning: Company '${item.Adopter}' not found in raw data.`);
      continue;
    }

    const htmlPath = join(root, "cases", `case-${item.Index}.html`);
    console.log(`Parsing: case-${item.Index}.html for ${item.Adopter}`);
    
    let html;
    try {
      html = await readFile(htmlPath, "utf8");
    } catch (err) {
      console.error(`Error reading ${htmlPath}:`, err.message);
      continue;
    }

    // Extract evaluations
    const evalOnboarding = extractEvaluation(html, "現場の運用定着難易度");
    const evalCostPerf = extractEvaluation(html, "コストパフォーマンス");
    const evalScope = extractEvaluation(html, "業務効率化の幅");

    // Extract framework details
    const challenge = extractFrameworkCard(html, "導入前の課題");
    const reason = extractFrameworkCard(html, "選定理由");
    const process = extractFrameworkCard(html, "実施内容・プロセス");
    const effect = extractFrameworkCard(html, "得られた効果");
    
    // Extract site analysis
    const analysis = extractOurAnalysis(html);

    // Update the tool details in companies data
    if (!company.tools) company.tools = [];
    
    const toolIndex = company.tools.findIndex(t => t.name === item.Service);
    const toolDetails = {
      name: item.Service,
      intro_date: toolIndex !== -1 ? company.tools[toolIndex].intro_date : "要確認",
      official_url: item.Url,
      case_index: item.Index,
      challenge,
      reason,
      process,
      effect,
      eval_onboarding: evalOnboarding,
      eval_cost_performance: evalCostPerf,
      eval_scope: evalScope,
      our_analysis: analysis
    };

    if (toolIndex !== -1) {
      // Merge properties if already defined
      company.tools[toolIndex] = { ...company.tools[toolIndex], ...toolDetails };
    } else {
      company.tools.push(toolDetails);
    }
  }

  // Double check and populate default empty fields
  for (const c of rawData) {
    if (!c.tools) c.tools = [];
  }

  await writeFile(outputPath, JSON.stringify(rawData, null, 2), "utf8");
  console.log(`Successfully merged data and saved to ${outputPath}`);
}

run().catch(console.error);
