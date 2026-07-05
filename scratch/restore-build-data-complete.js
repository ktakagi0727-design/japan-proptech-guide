const fs = require('fs');
const path = require('path');

const logPath = 'C:/Users/ktaka/.gemini/antigravity/brain/758b9831-3653-4914-be5c-dad512c8dbb1/.system_generated/logs/transcript.jsonl';
const targetFilePath = path.join(__dirname, '..', 'scripts', 'build-data.mjs');

let code = fs.readFileSync(targetFilePath, 'utf8');

const lines = fs.readFileSync(logPath, 'utf8').split('\n');
const operations = [];

lines.forEach(line => {
  if (!line.trim()) return;
  let step;
  try {
    step = JSON.parse(line);
  } catch (e) {
    return;
  }
  if (step.tool_calls) {
    step.tool_calls.forEach(tc => {
      let targetFile = tc.args.TargetFile || tc.args.AbsolutePath || '';
      if (typeof targetFile === 'string') {
        targetFile = targetFile.replace(/"/g, '');
      }
      if (targetFile.includes('build-data.mjs')) {
        if (tc.name === 'replace_file_content') {
          operations.push({
            step: step.step_index,
            type: 'replace',
            target: tc.args.TargetContent,
            replacement: tc.args.ReplacementContent
          });
        } else if (tc.name === 'multi_replace_file_content') {
          operations.push({
            step: step.step_index,
            type: 'multi_replace',
            chunks: tc.args.ReplacementChunks
          });
        } else if (tc.name === 'write_to_file' || tc.name === 'write_file') {
          operations.push({
            step: step.step_index,
            type: 'write',
            content: tc.args.CodeContent
          });
        }
      }
    });
  }
});

console.log(`Found ${operations.length} operations for build-data.mjs.`);

operations.sort((a, b) => a.step - b.step);

operations.forEach(op => {
  console.log(`Applying step ${op.step} (${op.type})...`);
  
  const normalize = (str) => {
    if (typeof str !== 'string') return '';
    return str.replace(/\r\n/g, '\n');
  };
  
  code = normalize(code);
  
  if (op.type === 'write') {
    code = op.content;
    return;
  }
  
  if (op.type === 'replace') {
    const target = normalize(op.target);
    const replacement = normalize(op.replacement);
    
    if (!code.includes(target)) {
      console.error(`ERROR: Target for step ${op.step} not found!`);
      console.error(`Target snippet: ${target.slice(0, 100)}...`);
      process.exit(1);
    }
    
    code = code.replace(target, replacement);
  } else if (op.type === 'multi_replace') {
    // Sort chunks in descending order of StartLine to apply from bottom to top
    const sortedChunks = [...op.chunks].sort((a, b) => b.StartLine - a.StartLine);
    
    sortedChunks.forEach((chunk, idx) => {
      const target = normalize(chunk.TargetContent);
      const replacement = normalize(chunk.ReplacementContent);
      
      if (!code.includes(target)) {
        console.error(`ERROR: Chunk target in step ${op.step} (idx ${idx}) not found!`);
        console.error(`Target snippet: ${target.slice(0, 100)}...`);
        process.exit(1);
      }
      code = code.replace(target, replacement);
    });
  }
});

fs.writeFileSync(targetFilePath, code, 'utf8');
console.log('Successfully restored build-data.mjs!');
