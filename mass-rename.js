const fs = require('fs');
const path = require('path');

const excludeDirs = [
  'node_modules',
  'dist',
  '.git',
  '.tmp',
  '.angular',
  'dist-electron',
  'build',
];
const excludeFiles = ['package-lock.json', 'yarn.lock', 'icon-mac.svg', 'ico.svg'];

const replacements = [
  [/Super Productivity/g, 'Hyper Productivity'],
  [/Super-Productivity/g, 'Hyper-Productivity'],
  [/super-productivity/g, 'hyper-productivity'],
  [/super_productivity/g, 'hyper_productivity'],
  [/SuperProductivity/g, 'HyperProductivity'],
  [/superProductivity/g, 'hyperProductivity'],
  [/Super productivity/g, 'Hyper productivity'],
  [/super productivity/g, 'hyper productivity'],
];

function processFile(fullPath) {
  try {
    const content = fs.readFileSync(fullPath, 'utf8');
    let changed = false;
    let newContent = content;
    for (const [regex, replacement] of replacements) {
      if (regex.test(newContent)) {
        newContent = newContent.replace(regex, replacement);
        changed = true;
      }
    }
    if (changed) {
      fs.writeFileSync(fullPath, newContent, 'utf8');
      console.log('Updated: ' + fullPath);
    }
  } catch (e) {
    // skip binary files or permission issues
  }
}

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    let stat;
    try {
      stat = fs.statSync(fullPath);
    } catch (e) {
      continue;
    }

    if (stat.isDirectory()) {
      if (!excludeDirs.some((ex) => fullPath.includes(ex))) {
        processDir(fullPath);
      }
    } else {
      if (!excludeFiles.includes(file)) {
        processFile(fullPath);
      }
    }
  }
}

const targets = [
  'src',
  'electron',
  'angular.json',
  'package.json',
  'packages',
  'e2e',
  'docs',
];

for (const target of targets) {
  const fullPath = path.join(process.cwd(), target);
  if (fs.existsSync(fullPath)) {
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else {
      processFile(fullPath);
    }
  }
}
console.log('Done.');
