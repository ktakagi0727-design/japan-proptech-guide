const fs = require('fs');

const logPath = 'C:\\\\Users\\\\ktaka\\\\.gemini\\\\antigravity\\\\brain\\\\2d5327b3-08e7-49e0-b297-f601bd0f4bf6\\\\.system_generated\\\\logs\\\\transcript.jsonl';

if (fs.existsSync(logPath)) {
  const lines = fs.readFileSync(logPath, 'utf8').split('\n').filter(l => l.trim());
  console.log('3-B Total steps:', lines.length);
  if (lines.length > 0) {
    const lastLine = JSON.parse(lines[lines.length - 1]);
    console.log('3-B Last Step Index:', lastLine.step_index, 'Type:', lastLine.type, 'Content:', lastLine.content ? lastLine.content.substring(0, 150) : 'none');
  }
} else {
  console.log('3-B Log file not found');
}
