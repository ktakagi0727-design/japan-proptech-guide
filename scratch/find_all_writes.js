const fs = require('fs');
const logPath = "C:\\Users\\ktaka\\.gemini\\antigravity\\brain\\84e148cc-373c-4548-852a-007d471eb1dc\\.system_generated\\logs\\transcript.jsonl";

if (fs.existsSync(logPath)) {
  const content = fs.readFileSync(logPath, 'utf8');
  const lines = content.split('\n').filter(l => l.trim());
  lines.forEach(line => {
    try {
      const data = JSON.parse(line);
      if (data.tool_calls) {
        data.tool_calls.forEach(tc => {
          if (tc.name === 'write_to_file' || tc.name === 'replace_file_content') {
            console.log(`Step ${data.step_index}: ${tc.name} target: ${tc.args.TargetFile || tc.args.Target || tc.args.TargetFile}`);
            console.log('Args:', JSON.stringify(tc.args).substring(0, 300));
          }
        });
      }
    } catch (e) {}
  });
} else {
  console.log('Log file not found');
}
