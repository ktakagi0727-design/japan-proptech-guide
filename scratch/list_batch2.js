const fs = require('fs');

const missing = JSON.parse(fs.readFileSync('scratch/missing_companies.json', 'utf8'));
const batch2 = missing.slice(0, 20);

console.log('Batch 2 Companies:');
batch2.forEach((c, idx) => {
  console.log(`${idx + 1}. ${c.company} (Tool: ${c.service}, URL: ${c.url})`);
});
