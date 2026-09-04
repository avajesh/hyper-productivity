const fs = require('fs');
const path = require('path');
function walk(dir) {
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (!['node_modules', '.git', '.tmp', 'dist', 'build'].includes(file))
        walk(fullPath);
    } else if (fullPath.match(/\.(json|yaml|yml|md|ts|html)$/)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let newContent = content.replace(
        /super-productivity\/super-productivity/g,
        'avajesh/hyper-productivity',
      );
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log('Updated:', fullPath);
      }
    }
  });
}
walk('.');
