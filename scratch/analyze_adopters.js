const fs = require('fs');
const path = require('path');

const content = fs.readFileSync('data/cases.csv', 'utf8');
const lines = content.split('\n').filter(l => l.trim());

// Parse CSV lines properly handling quotes
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
  return cells;
}

const uniqueAdopters = new Set();
const records = [];

for (let i = 1; i < lines.length; i++) {
  const cells = parseCsvLine(lines[i]);
  if (cells.length > 3) {
    const adopter = cells[3];
    if (adopter) {
      uniqueAdopters.add(adopter);
      records.push({
        industry: cells[0],
        process: cells[1],
        tasks: cells[2],
        adopter: cells[3],
        service: cells[4],
        provider: cells[5],
        summary: cells[6],
        url: cells[7]
      });
    }
  }
}

console.log('Total case records in CSV:', records.length);
console.log('Unique adopter companies in CSV:', uniqueAdopters.size);
console.log('List of unique adopter companies:');
console.log(JSON.stringify(Array.from(uniqueAdopters), null, 2));
