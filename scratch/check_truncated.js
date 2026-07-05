const fs = require('fs');
const path = require('path');

const companies = [
  "株式会社フジタ",
  "株式会社豊四季不動産",
  "森トラスト株式会社"
];

const dataDir = 'c:/Users/ktaka/OneDrive/ドキュメント/会社/japan-proptech-guide/data';
const casesCsvPath = path.join(dataDir, 'cases.csv');

if (fs.existsSync(casesCsvPath)) {
  const content = fs.readFileSync(casesCsvPath, 'utf-8');
  const lines = content.split('\n');
  companies.forEach(company => {
    const cleanName = company.replace(/株式会社|合同会社/g, '');
    lines.forEach((line, idx) => {
      if (line.includes(cleanName) || line.includes(company)) {
        console.log(`${company} (Line ${idx+1}): ${line}`);
      }
    });
  });
}
