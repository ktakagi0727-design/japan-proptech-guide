const fs = require('fs');
const logPath = 'C:/Users/ktaka/.gemini/antigravity/brain/758b9831-3653-4914-be5c-dad512c8dbb1/.system_generated/logs/transcript.jsonl';
const log = fs.readFileSync(logPath, 'utf8').split('\n');

const stepIndex = 113;
const stepLine = log.find(l => {
  if (!l.trim()) return false;
  try {
    const s = JSON.parse(l);
    return s.step_index === stepIndex;
  } catch (e) {
    return false;
  }
});

if (stepLine) {
  const step = JSON.parse(stepLine);
  console.log(`Step ${stepIndex}:`);
  console.log(JSON.stringify(step.tool_calls, null, 2));
} else {
  console.log(`Step ${stepIndex} not found`);
}
