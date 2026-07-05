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
const detailJsonPath = path.join(dataDir, 'companies-detail.json');

if (fs.existsSync(detailJsonPath)) {
  const content = fs.readFileSync(detailJsonPath, 'utf-8');
  const detailData = JSON.parse(content);
  companies.forEach(company => {
    const cleanName = company.replace(/株式会社|合同会社/g, '');
    const found = detailData.find(item => item.company.includes(cleanName) || cleanName.includes(item.company));
    if (found) {
      console.log(`Found clean match for ${company}: ${found.company}`);
    }
  });
} else {
  console.log('detail.json not found');
}
