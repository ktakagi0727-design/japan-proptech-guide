const fs = require('fs');

const missing = JSON.parse(fs.readFileSync('scratch/missing_companies.json', 'utf8'));
const batch3 = missing.slice(0, 20);

console.log('Batch 3 Companies:');
batch3.forEach((c, idx) => {
  console.log(`${idx + 1}. ${c.company} (Tool: ${c.service}, URL: ${c.url})`);
});
