const fs = require('fs');
const logPath = 'C:/Users/ktaka/.gemini/antigravity/brain/758b9831-3653-4914-be5c-dad512c8dbb1/.system_generated/logs/transcript.jsonl';
const log = fs.readFileSync(logPath, 'utf8').split('\n');

const step = JSON.parse(log.find(l => {
  if (!l.trim()) return false;
  const s = JSON.parse(l);
  return s.step_index === 508;
}));

const contentLines = step.content.split('\n');
console.log("Lines 25-45 from Step 508 content:");
for (let i = 20; i < 50 && i < contentLines.length; i++) {
  console.log(`${i}: ${contentLines[i]}`);
}
