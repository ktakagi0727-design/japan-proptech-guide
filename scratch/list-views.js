const fs = require('fs');
const path = require('path');
const logPath = 'C:/Users/ktaka/.gemini/antigravity/brain/758b9831-3653-4914-be5c-dad512c8dbb1/.system_generated/logs/transcript.jsonl';

const lines = fs.readFileSync(logPath, 'utf8').split('\n');
lines.forEach((line, idx) => {
  if (!line.trim()) return;
  const step = JSON.parse(line);
  if (step.type === 'VIEW_FILE' && step.content && step.content.includes('build-data.mjs')) {
    const match = step.content.match(/Showing lines (\d+) to (\d+)/);
    if (match) {
      console.log(`Step ${step.step_index}: Lines ${match[1]} to ${match[2]}`);
    } else {
      console.log(`Step ${step.step_index}: VIEW_FILE but no lines match`);
    }
  }
});
