const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '..', 'data', 'companies-detail.json');
const companies = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const batchFiles = [
  'other_tools_batch1.json',
  'other_tools_batch2.json',
  'other_tools_batch3.json',
  'other_tools_batch4.json'
];

// Combine all batch updates into a single map by slug
const updatesMap = new Map();

batchFiles.forEach(bf => {
  const p = path.join(__dirname, '..', 'scratch', bf);
  if (fs.existsSync(p)) {
    const data = JSON.parse(fs.readFileSync(p, 'utf8'));
    data.forEach(item => {
      updatesMap.set(item.slug, item.other_tools);
    });
  } else {
    console.error(`Batch file not found: ${bf}`);
  }
});

console.log(`Loaded updates for ${updatesMap.size} companies from batch files.`);

let updatedCount = 0;
companies.forEach(c => {
  if (updatesMap.has(c.slug)) {
    const newTools = updatesMap.get(c.slug);
    // Ensure other_tools is set
    c.other_tools = newTools || [];
    updatedCount++;
    console.log(`Updated ${c.company} (${c.slug}) -> ${JSON.stringify(c.other_tools)}`);
  }
});

fs.writeFileSync(jsonPath, JSON.stringify(companies, null, 2), 'utf8');
console.log(`Finished merging. Updated ${updatedCount} companies in companies-detail.json.`);
