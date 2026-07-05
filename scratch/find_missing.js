const fs = require('fs');

const detail = JSON.parse(fs.readFileSync('data/companies-detail.json', 'utf8'));
const existing = new Set(detail.map(c => c.company));

const csvContent = fs.readFileSync('data/cases.csv', 'utf8');
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

const missing = [];
const missingSet = new Set();
for (let i = 1; i < lines.length; i++) {
  const cells = parseCsvLine(lines[i]);
  if (cells.length > 3) {
    const adopter = cells[3];
    if (adopter && !existing.has(adopter) && !missingSet.has(adopter)) {
      missingSet.add(adopter);
      missing.push({
        company: adopter,
        service: cells[4],
        provider: cells[5],
        url: cells[7]
      });
    }
  }
}

console.log('Total missing companies:', missing.length);
console.log(JSON.stringify(missing, null, 2));
