const fs = require('fs');
const path = require('path');

const emptySlugs = [
  "jukobo-style", "a-shin", "rim-real-estate", "create-estate", "zin-realty",
  "kurashi-works", "joytech", "pacific-real-estate", "appartement-agent",
  "hirata-fudosan", "sanken-home", "leben-corporation", "relation-real-estate",
  "alphas", "tokyo-tatemono", "tokyo-tatemono-rim", "toyoshiki-realestate",
  "mori-trust", "misawa-home", "mitsubishi-jisho-housenet", "tokai-jutaku",
  "isshin-estate", "kosugi-fudosan", "asahi-kasei-real-estate-residence",
  "leopalace21", "minorasu-fudosan", "nitoh", "pm-labo", "maruyoshi",
  "urbanlife", "inizio-life", "property-wako", "jaamenityhouse",
  "nomura-pt-pm", "mitsui-designtec", "howseek", "asproperty", "kw-tokyo",
  "kizuna-factory", "kansai-fudosan-hanbai", "sankei-jisho",
  "mitsubishi-ufj-real-estate-sales", "sora-home", "myhome-group"
];

const batchFiles = [
  'batch1_a.json', 'batch1_b.json',
  'batch2_a.json', 'batch2_b.json',
  'batch3_a.json', 'batch3_b.json',
  'batch4_b.json'
];

emptySlugs.forEach(slug => {
  let found = [];
  batchFiles.forEach(bf => {
    const p = path.join(__dirname, '..', 'scratch', bf);
    if (fs.existsSync(p)) {
      const data = JSON.parse(fs.readFileSync(p, 'utf8'));
      const item = data.find(c => c.slug === slug);
      if (item && item.other_tools && item.other_tools.length > 0) {
        found.push(`${bf} (${JSON.stringify(item.other_tools)})`);
      }
    }
  });
  if (found.length > 0) {
    console.log(`Company ${slug} found in batches with other_tools:`, found);
  }
});
