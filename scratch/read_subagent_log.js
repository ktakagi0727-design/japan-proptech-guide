const fs = require('fs');
const path = require('path');

const logPath = "C:\\Users\\ktaka\\.gemini\\antigravity\\brain\\84e148cc-373c-4548-852a-007d471eb1dc\\.system_generated\\logs\\transcript.jsonl";

if (!fs.existsSync(logPath)) {
  console.log('Log file does not exist at:', logPath);
  process.exit(1);
}

const content = fs.readFileSync(logPath, 'utf8');
const lines = content.split('\n').filter(l => l.trim());

console.log('Total steps in log:', lines.length);

// Let's search for model responses that contain JSON-like structures or compiled data,
// or search for the searches performed.
lines.forEach((line, idx) => {
  try {
    const data = JSON.parse(line);
    if (data.source === 'MODEL' && data.content && (data.content.includes('{') || data.content.includes('['))) {
      console.log(`Step ${data.step_index}: content length: ${data.content.length}`);
      console.log(data.content.substring(0, 300));
    }
  } catch (e) {}
});
