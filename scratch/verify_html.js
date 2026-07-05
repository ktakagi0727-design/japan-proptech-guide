const fs = require('fs');
const path = require('path');

const fileToCheck = 'cases/jukobo-style.html';
if (fs.existsSync(fileToCheck)) {
  const content = fs.readFileSync(fileToCheck, 'utf8');
  console.log(`Checking ${fileToCheck}:`);
  const keywords = ["plantable", "KASIKA", "Patio"];
  keywords.forEach(kw => {
    if (content.includes(kw)) {
      console.log(`  Found: "${kw}"`);
    } else {
      console.log(`  MISSING: "${kw}"`);
    }
  });
  
  // Also print the section where they should appear
  const startIdx = content.indexOf('当サイト未掲載の他ツール導入情報');
  if (startIdx !== -1) {
    console.log('\nHTML section snippet:');
    console.log(content.substring(startIdx - 100, startIdx + 400));
  } else {
    console.log('\n"当サイト未掲載の他ツール導入情報" heading NOT found!');
  }
} else {
  console.error(`${fileToCheck} does not exist!`);
}
