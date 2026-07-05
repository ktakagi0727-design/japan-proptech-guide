const fs = require('fs');
const path = require('path');

const content = fs.readFileSync('scripts/build-data.mjs', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('data.js')) {
    console.log(`L${idx + 1}: ${line.trim()}`);
  }
});
