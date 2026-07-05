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
const detailJsonPath = path.join(dataDir, 'companies-detail.json');
const rawJsonPath = path.join(dataDir, 'companies-raw-data.json');

console.log('--- Checking cases.csv ---');
if (fs.existsSync(casesCsvPath)) {
  const content = fs.readFileSync(casesCsvPath, 'utf-8');
  companies.forEach(company => {
    const cleanName = company.replace(/株式会社|合同会社/g, '');
    if (content.includes(cleanName) || content.includes(company)) {
      console.log(`Found in cases.csv: ${company}`);
    }
  });
}

console.log('--- Checking companies-detail.json ---');
if (fs.existsSync(detailJsonPath)) {
  const content = fs.readFileSync(detailJsonPath, 'utf-8');
  companies.forEach(company => {
    if (content.includes(company)) {
      console.log(`Found in companies-detail.json: ${company}`);
    }
  });
}

console.log('--- Checking companies-raw-data.json ---');
if (fs.existsSync(rawJsonPath)) {
  const content = fs.readFileSync(rawJsonPath, 'utf-8');
  companies.forEach(company => {
    if (content.includes(company)) {
      console.log(`Found in companies-raw-data.json: ${company}`);
    }
  });
}
