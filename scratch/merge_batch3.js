const fs = require('fs');

const originalPath = 'data/companies-detail.json';
const batchAPath = 'scratch/batch3_a.json';
const batchBPath = 'scratch/batch3_b.json';

if (!fs.existsSync(originalPath)) {
  console.error('Original companies-detail.json not found');
  process.exit(1);
}

const originalData = JSON.parse(fs.readFileSync(originalPath, 'utf8'));
const map = new Map(originalData.map(c => [c.company, c]));

console.log('Existing companies count:', originalData.length);

let addedCount = 0;

function mergeFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    return;
  }
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  console.log(`Reading ${filePath}, items: ${data.length}`);
  
  data.forEach(c => {
    if (map.has(c.company)) {
      console.log(`Overwriting existing company info for: ${c.company}`);
      map.set(c.company, { ...map.get(c.company), ...c });
    } else {
      map.set(c.company, c);
      addedCount++;
    }
  });
}

mergeFile(batchAPath);
mergeFile(batchBPath);

const mergedList = Array.from(map.values());

fs.writeFileSync(originalPath, JSON.stringify(mergedList, null, 2), 'utf8');

console.log(`Successfully merged. Added: ${addedCount} companies. Total now: ${mergedList.length}`);
