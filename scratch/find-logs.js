const fs = require('fs');
const path = require('path');
const logPath = 'C:/Users/ktaka/.gemini/antigravity/brain/758b9831-3653-4914-be5c-dad512c8dbb1/.system_generated/logs/transcript.jsonl';

const lines = fs.readFileSync(logPath, 'utf8').split('\n');
const targetSteps = [459, 493, 555, 557, 559];
lines.forEach((line, idx) => {
  if (!line.trim()) return;
  const step = JSON.parse(line);
  if (targetSteps.includes(step.step_index)) {
    console.log(`Line ${idx}: step_index=${step.step_index}, type=${step.type}, source=${step.source}`);
    if (step.tool_calls) {
      step.tool_calls.forEach(tc => {
        console.log(`  tool_call: ${tc.name} for ${tc.args.TargetFile || tc.args.AbsolutePath}`);
        if (tc.name === 'write_to_file') {
          console.log(`    IsArtifact: ${tc.args.IsArtifact}`);
        }
      });
    }
  }
});

