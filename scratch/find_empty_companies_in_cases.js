const fs = require('fs');
const path = require('path');

const emptySlugs = [
  "jukobo-style", "a-shin", "rim-real-estate", "create-estate", "zin-realty",
  "kurashi-works", "joytech", "pacific-real-estate", "appartement-agent",
  "hirata-fudosan", "sanken-home", "leben-corporation", "relation-real-estate",
  "alphas", "tokyo-tatemono", "tokyo-tatemono-rim", "toyoshiki-realestate",
  "mori-trust", "misawa-home", "mitsubishi-jisho-housenet", "tokai-jutaku",
  "isshin-estate", "kosugi-fudosan", "asahi-kasei-real-estate-residence",
  "leopalace21", "minorasu-fudosan", "nitoh", "pm-labo", "maruyoshi",
  "urbanlife", "inizio-life", "property-wako", "jaamenityhouse",
  "nomura-pt-pm", "mitsui-designtec", "howseek", "asproperty", "kw-tokyo",
  "kizuna-factory", "kansai-fudosan Hanbai", "sankei-jisho",
  "mitsubishi-ufj-real-estate-sales", "sora-home", "myhome-group"
];

// Load companies detail
const detailPath = 'data/companies-detail.json';
const companiesDetail = JSON.parse(fs.readFileSync(detailPath, 'utf8'));

// Make a map of company name to slug
const nameToSlug = new Map(companiesDetail.map(c => [c.company, c.slug]));
const slugToName = new Map(companiesDetail.map(c => [c.slug, c.company]));

const csvPath = 'data/cases.csv';
const csvContent = fs.readFileSync(csvPath, 'utf8');
const lines = csvContent.split('\n').filter(l => l.trim());

function parseCsvLine(line) {
  const cells = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      cells.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  cells.push(current.trim());
  return cells.map(val => {
    if (val.startsWith('"') && val.endsWith('"')) {
      return val.slice(1, -1).replace(/""/g, '"');
    }
    return val;
  });
}

console.log('Total cases in CSV:', lines.length - 1);

const results = {};
emptySlugs.forEach(slug => {
  results[slug] = [];
});

for (let i = 1; i < lines.length; i++) {
  const cells = parseCsvLine(lines[i]);
  if (cells.length > 4) {
    const adopter = cells[3]; // Adopter/company name
    const service = cells[4]; // Service/tool name
    const slug = nameToSlug.get(adopter);
    if (slug && emptySlugs.includes(slug)) {
      results[slug].push(service);
    }
  }
}

emptySlugs.forEach(slug => {
  const name = slugToName.get(slug);
  console.log(`${name} (${slug}):`, results[slug]);
});
