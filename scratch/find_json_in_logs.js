const fs = require('fs');

const logPath = "C:\\Users\\ktaka\\.gemini\\antigravity\\brain\\84e148cc-373c-4548-852a-007d471eb1dc\\.system_generated\\logs\\transcript.jsonl";

if (!fs.existsSync(logPath)) {
  console.log('Log file does not exist');
  process.exit(1);
}

const content = fs.readFileSync(logPath, 'utf8');
const lines = content.split('\n').filter(l => l.trim());

lines.forEach((line, idx) => {
  try {
    const data = JSON.parse(line);
    // Print steps where model makes tool calls to write_to_file
    if (data.tool_calls && data.tool_calls.length > 0) {
      data.tool_calls.forEach(tc => {
        if (tc.name === 'write_to_file') {
          console.log(`Step ${data.step_index}: write_to_file to ${tc.args.TargetFile || tc.args.Target}`);
          console.log('Content snippet:', JSON.stringify(tc.args).substring(0, 500));
        }
      });
    }
    // Also look at model message content for json block
    if (data.source === 'MODEL' && data.content && data.content.includes('```json')) {
      console.log(`Step ${data.step_index}: Contains json block`);
      const start = data.content.indexOf('```json');
      console.log('Snippet:', data.content.substring(start, start + 500));
    }
  } catch (e) {}
});
