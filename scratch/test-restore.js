const fs = require('fs');
const path = require('path');

const logPath = 'C:/Users/ktaka/.gemini/antigravity/brain/758b9831-3653-4914-be5c-dad512c8dbb1/.system_generated/logs/transcript.jsonl';

const lines = fs.readFileSync(logPath, 'utf8').split('\n');

lines.forEach(line => {
  if (!line.trim()) return;
  const step = JSON.parse(line);
  if (step.tool_calls) {
    step.tool_calls.forEach(tc => {
      if (tc.name === 'replace_file_content' || tc.name === 'multi_replace_file_content') {
        console.log(`Step ${step.step_index}: name=${tc.name}`);
        console.log(`  TargetFile type=${typeof tc.args.TargetFile} val=${tc.args.TargetFile}`);
      }
    });
  }
});
