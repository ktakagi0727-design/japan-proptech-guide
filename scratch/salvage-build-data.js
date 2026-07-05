const fs = require('fs');
const path = require('path');
const logPath = 'C:/Users/ktaka/.gemini/antigravity/brain/758b9831-3653-4914-be5c-dad512c8dbb1/.system_generated/logs/transcript.jsonl';
const targetFilePath = path.join(__dirname, '..', 'scripts', 'build-data.mjs');

const lines = fs.readFileSync(logPath, 'utf8').split('\n');

const codeLines = {};

// Parse Step 508, 512, 514 to extract code
const targetViews = [508, 512, 514];

lines.forEach(line => {
  if (!line.trim()) return;
  const step = JSON.parse(line);
  if (step.type === 'VIEW_FILE' && targetViews.includes(step.step_index) && step.content && step.content.includes('build-data.mjs')) {
    console.log(`Parsing Step ${step.step_index} view...`);
    const contentLines = step.content.split('\n');
    contentLines.forEach(cl => {
      const match = cl.match(/^\s*(\d+): (.*)$/);
      if (match) {
        const lineNum = parseInt(match[1]);
        const lineCode = match[2];
        codeLines[lineNum] = lineCode;
      }
    });
  }
});

// Reconstruct code from line map
const maxLine = Math.max(...Object.keys(codeLines).map(Number));
console.log(`Reconstructed line count: ${maxLine}`);

let codeArr = [];
for (let i = 1; i <= maxLine; i++) {
  codeArr.push(codeLines[i] !== undefined ? codeLines[i] : '');
}
let code = codeArr.join('\n');

// Now apply any operations after Step 514
lines.forEach(line => {
  if (!line.trim()) return;
  const step = JSON.parse(line);
  if (step.step_index > 514 && step.tool_calls) {
    step.tool_calls.forEach(tc => {
      let targetFile = tc.args.TargetFile || '';
      if (typeof targetFile === 'string') {
        targetFile = targetFile.replace(/"/g, '');
      }
      if (targetFile.includes('build-data.mjs') && tc.name === 'replace_file_content') {
        console.log(`Applying post-view operation from Step ${step.step_index}...`);
        
        const normalize = (str) => str.replace(/\r\n/g, '\n');
        code = normalize(code);
        const target = normalize(tc.args.TargetContent);
        const replacement = normalize(tc.args.ReplacementContent);
        
        if (code.includes(target)) {
          code = code.replace(target, replacement);
          console.log(`  Successfully applied replace_file_content!`);
        } else {
          console.error(`  ERROR: Target for Step ${step.step_index} not found!`);
          console.error(`  Snippet: ${target.slice(0, 100)}...`);
        }
      }
    });
  }
});

fs.writeFileSync(targetFilePath, code, 'utf8');
console.log(`Successfully salvaged and wrote ${targetFilePath}!`);
