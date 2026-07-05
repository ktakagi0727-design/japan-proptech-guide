const fs = require('fs');
const path = require('path');

function searchInFile(filePath, keyword) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  if (content.includes(keyword)) {
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
      if (line.includes(keyword)) {
        console.log(`${path.basename(filePath)}:L${idx + 1} - ${line.trim()}`);
      }
    });
  }
}

function walkDir(dir, keyword) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const p = path.join(dir, file);
    if (fs.statSync(p).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git' && file !== 'scratch') {
        walkDir(p, keyword);
      }
    } else {
      if (file.endsWith('.js') || file.endsWith('.mjs') || file.endsWith('.html') || file.endsWith('.css')) {
        searchInFile(p, keyword);
      }
    }
  });
}

console.log('Searching for "other_tools"...');
walkDir('.', 'other_tools');
