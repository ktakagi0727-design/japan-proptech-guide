const fs = require('fs');
const logPath = "C:\\Users\\ktaka\\.gemini\\antigravity\\brain\\fe1f9e73-1ba7-401b-a074-18a7e0cf1aad\\.system_generated\\logs\\transcript.jsonl";

if (fs.existsSync(logPath)) {
  const content = fs.readFileSync(logPath, 'utf8');
  const lines = content.split('\n').filter(l => l.trim());
  console.log('Total steps:', lines.length);
  const lastThree = lines.slice(-3);
  lastThree.forEach((line, idx) => {
    const data = JSON.parse(line);
    console.log(`\n--- Line ${idx + 1} (Step ${data.step_index}, Source: ${data.source}, Type: ${data.type}) ---`);
    console.log('Content snippet:', data.content ? data.content.substring(0, 500) : 'no content');
    if (data.tool_calls) {
      console.log('Tool calls:', JSON.stringify(data.tool_calls));
    }
  });
} else {
  console.log('Log file not found');
}
