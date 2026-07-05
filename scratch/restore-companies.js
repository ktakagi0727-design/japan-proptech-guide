const fs = require('fs');

const window = {};
const dataJsContent = fs.readFileSync('data/data.js', 'utf8');
eval(dataJsContent);

const companies = window.proptechData.companies;
fs.writeFileSync('data/companies-detail.json', JSON.stringify(companies, null, 2), 'utf8');
console.log('Restored companies count:', companies.length);
