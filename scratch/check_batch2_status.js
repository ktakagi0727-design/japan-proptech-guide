const fs = require('fs');

const logs = {
  '2-A': 'C:\\\\Users\\\\ktaka\\\\.gemini\\\\antigravity\\\\brain\\\\6d33d6b8-f86d-4925-be60-e18ba5d36ed5\\\\.system_generated\\\\logs\\\\transcript.jsonl',
  '2-B': 'C:\\\\Users\\\\ktaka\\\\.gemini\\\\antigravity\\\\brain\\\\dccb5b01-56ba-4a1b-a6af-46b3a4837f7a\\\\.system_generated\\\\logs\\\\transcript.jsonl'
};

for (const [name, logPath] of Object.entries(logs)) {
  if (fs.existsSync(logPath)) {
    const lines = fs.readFileSync(logPath, 'utf8').split('\n').filter(l => l.trim());
    console.log(`${name} Total steps:`, lines.length);
    if (lines.length > 0) {
      const lastLine = JSON.parse(lines[lines.length - 1]);
      console.log(`${name} Last Step Index:`, lastLine.step_index, 'Type:', lastLine.type, 'Content:', lastLine.content ? lastLine.content.substring(0, 150) : 'none');
    }
  } else {
    console.log(`${name} Log file not found`);
  }
}
