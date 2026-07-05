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
  const lines = content.split('\n');
  const header = lines[0];
  console.log('Header:', header);
  
  lines.forEach((line, index) => {
    if (index === 0) return;
    companies.forEach(company => {
      const cleanName = company.replace(/株式会社|合同会社/g, '');
      if (line.includes(cleanName) || line.includes(company)) {
        console.log(`Line ${index + 1}: ${line.substring(0, 150)}...`);
      }
    });
  });
} else {
  console.log('cases.csv not found');
}
