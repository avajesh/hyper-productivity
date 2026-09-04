const fs = require('fs');
const path = require('path');

function walk(dir) {
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (!['node_modules', '.git', '.tmp', 'dist', 'build'].includes(file)) {
        walk(fullPath);
      }
    } else {
      if (fullPath.match(/\.(ts|html|json|yaml|yml|md|js|scss)$/)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        let newContent = content
          .replace(/avajesh\/hyperproductivity/g, 'avajesh/hyper-productivity')
          .replace(/techeia\.com\/hyperproductivity/g, 'techeia.com/hyper-productivity')
          .replace(/com\.hyperproductivity\.app/g, 'com.hyperproductivity.app')
          .replace(/Hyper Productivity/g, 'Hyper Productivity')
          .replace(/hyperproductivity/g, 'hyperproductivity');

        if (content !== newContent) {
          fs.writeFileSync(fullPath, newContent, 'utf8');
          console.log('Updated:', fullPath);
        }
      }
    }
  });
}

walk('.');
