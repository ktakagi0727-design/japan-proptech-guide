const fs = require('fs');
const path = require('path');

const companies = [
  "株式会社フジタ",
  "株式会社豊四季不動産",
  "森トラスト株式会社",
  "住友商事株式会社",
  "清水建設株式会社",
  "ミサワホーム株式会社",
  "三菱地所ハウスネット株式会社",
  "株式会社ES&Company",
  "株式会社アークレスト",
  "株式会社永大ハウス工業",
  "一心エステート株式会社",
  "株式会社コスギ不動産",
  "旭化成不動産レジデンス株式会社",
  "株式会社レオパレス21",
  "ミノラス不動産株式会社",
  "NITOH株式会社",
  "株式会社PM Labo",
  "株式会社マルヨシ",
  "アセットテクノロジー株式会社",
  "株式会社不動産SHOPナカジツ"
];

const dataDir = 'c:/Users/ktaka/OneDrive/ドキュメント/会社/japan-proptech-guide/data';
const casesCsvPath = path.join(dataDir, 'cases.csv');

if (fs.existsSync(casesCsvPath)) {
  const content = fs.readFileSync(casesCsvPath, 'utf-8');
  // Simple CSV parser that handles quotes
  const lines = [];
  let currentLine = '';
  let inQuotes = false;
  
  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    if (char === '"') {
      inQuotes = !inQuotes;
      currentLine += char;
    } else if (char === '\n' && !inQuotes) {
      lines.push(currentLine.trim());
      currentLine = '';
    } else {
      currentLine += char;
    }
  }
  if (currentLine) lines.push(currentLine.trim());

  const header = lines[0];
  console.log('Total lines parsed:', lines.length);
  
  companies.forEach(company => {
    const cleanName = company.replace(/株式会社|合同会社/g, '');
    const matches = lines.filter(line => line.includes(cleanName) || line.includes(company));
    console.log(`\n=== Matches for ${company} ===`);
    matches.forEach(m => {
      console.log(m);
    });
  });
}
