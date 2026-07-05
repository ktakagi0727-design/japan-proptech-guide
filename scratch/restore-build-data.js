const fs = require('fs');
const path = require('path');

const logPath = 'C:/Users/ktaka/.gemini/antigravity/brain/758b9831-3653-4914-be5c-dad512c8dbb1/.system_generated/logs/transcript.jsonl';
const targetFilePath = path.join(__dirname, '..', 'scripts', 'build-data.mjs');

// Read current build-data.mjs (which is restored to 1111 lines)
let code = fs.readFileSync(targetFilePath, 'utf8');

// Parse transcript.jsonl
const lines = fs.readFileSync(logPath, 'utf8').split('\n');
const replacements = [];

lines.forEach(line => {
  if (!line.trim()) return;
  const step = JSON.parse(line);
  if (step.tool_calls) {
    step.tool_calls.forEach(tc => {
      if (tc.name === 'replace_file_content' && tc.args.TargetFile && tc.args.TargetFile.endsWith('build-data.mjs')) {
        replacements.push({
          step: step.step_index,
          target: tc.args.TargetContent,
          replacement: tc.args.ReplacementContent
        });
      }
    });
  }
});

console.log(`Found ${replacements.length} replacements for build-data.mjs in previous conversation.`);

// Sort by step index to ensure chronological application
replacements.sort((a, b) => a.step - b.step);

// Apply replacements
replacements.forEach(r => {
  console.log(`Applying replacement from step ${r.step}...`);
  
  // Normalize newlines for match robustness
  const normalizedCode = code.replace(/\r\n/g, '\n');
  const normalizedTarget = r.target.replace(/\r\n/g, '\n');
  const normalizedReplacement = r.replacement.replace(/\r\n/g, '\n');
  
  if (!normalizedCode.includes(normalizedTarget)) {
    console.error(`ERROR: Target content for step ${r.step} NOT found in code!`);
    
    // Let's dump a small snippet of the target to see why it failed
    console.error(`Target snippet: ${normalizedTarget.slice(0, 100)}...`);
    process.exit(1);
  }
  
  // Verify uniqueness of target
  const firstIndex = normalizedCode.indexOf(normalizedTarget);
  const lastIndex = normalizedCode.lastIndexOf(normalizedTarget);
  if (firstIndex !== lastIndex) {
    console.error(`ERROR: Target content for step ${r.step} is NOT unique!`);
    process.exit(1);
  }
  
  code = normalizedCode.replace(normalizedTarget, normalizedReplacement);
});

// Write the restored code back
fs.writeFileSync(targetFilePath, code, 'utf8');
console.log('Successfully restored scripts/build-data.mjs to its final state from the previous conversation!');
