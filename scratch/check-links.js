const fs = require('fs');
const html = fs.readFileSync('cases/index.html', 'utf8');

// Find all anchor tags containing "東京建物"
const regex = /<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
let match;
console.log("Found links:");
while ((match = regex.exec(html)) !== null) {
  const [fullTag, href, content] = match;
  if (content.includes("東京建物")) {
    console.log(`Href: ${href} | Content: ${content.trim().replace(/\s+/g, ' ').slice(0, 100)}`);
  }
}
