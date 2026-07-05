const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '..', 'data', 'companies-detail.json');
const companies = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

console.log('Total companies:', companies.length);

const emptyOrMissing = [];
const populated = [];

companies.forEach(c => {
  if (!c.other_tools || c.other_tools.length === 0) {
    emptyOrMissing.push(c.company + ' (' + c.slug + ')');
  } else {
    populated.push(c.company + ' (' + c.slug + '): ' + JSON.stringify(c.other_tools));
  }
});

console.log('Populated other_tools companies count:', populated.length);
console.log('Empty or missing other_tools companies count:', emptyOrMissing.length);
console.log('\n--- Empty or Missing Companies ---');
emptyOrMissing.forEach(c => console.log(c));
