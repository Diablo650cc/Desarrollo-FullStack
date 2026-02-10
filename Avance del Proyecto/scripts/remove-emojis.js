const fs = require('fs');
const path = require('path');

const root = process.cwd();
const skipDirs = new Set(['node_modules', '.git']);

// Matches most common emoji codepoint ranges
const emojiRegex = /[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;

const modifiedFiles = [];

function isBinary(contents) {
  // simple heuristic: presence of a null byte
  return contents.includes('\0');
}

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    if (skipDirs.has(ent.name)) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      walk(full);
    } else if (ent.isFile()) {
      try {
        let content = fs.readFileSync(full, 'utf8');
        if (isBinary(content)) continue;
        if (emojiRegex.test(content)) {
          const newContent = content.replace(emojiRegex, '');
          fs.writeFileSync(full, newContent, 'utf8');
          modifiedFiles.push(full);
          console.log('Cleaned:', full);
        }
      } catch (err) {
        // skip files that can't be read as utf8
      }
    }
  }
}

console.log('Scanning from', root);
walk(root);
console.log('Done. Files modified:', modifiedFiles.length);
if (modifiedFiles.length) console.log(modifiedFiles.join('\n'));
