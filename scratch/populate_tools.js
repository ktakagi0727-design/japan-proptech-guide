const fs = require('fs');
const path = require('path');

const csvPath = 'data/cases.csv';
const jsonPath = 'data/companies-detail.json';

if (!fs.existsSync(csvPath) || !fs.existsSync(jsonPath)) {
  console.error('Data files not found');
  process.exit(1);
}

const companies = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

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

// Map of company name -> array of tools from CSV
const csvToolsMap = new Map();

for (let i = 1; i < lines.length; i++) {
  const cells = parseCsvLine(lines[i]);
  if (cells.length > 4) {
    const adopter = cells[3];
    const service = cells[4];
    const url = cells[7];
    
    if (adopter && service) {
      if (!csvToolsMap.has(adopter)) {
        csvToolsMap.set(adopter, []);
      }
      csvToolsMap.get(adopter).push({ name: service, url: url });
    }
  }
}

let updatedCount = 0;

companies.forEach(c => {
  if (!c.tools) {
    c.tools = [];
  }
  
  const csvTools = csvToolsMap.get(c.company) || [];
  csvTools.forEach(ct => {
    const exists = c.tools.some(t => t.name === ct.name);
    if (!exists) {
      c.tools.push({
        name: ct.name,
        intro_date: '要確認',
        official_url: ct.url
      });
      updatedCount++;
    }
  });
});

fs.writeFileSync(jsonPath, JSON.stringify(companies, null, 2), 'utf8');
console.log(`Successfully populated tools. Added ${updatedCount} tool relations to companies.`);
