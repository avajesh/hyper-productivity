const fs = require('fs');
const path = require('path');
function walk(dir) {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (!['node_modules', '.git', '.tmp', 'dist', 'build'].includes(file)) walk(fullPath);
        } else if (fullPath.match(/\.(json|yaml|yml|md|ts|html|js|sh)$/)) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let newContent = content
                .replace(/avajesh\/hyperproductivity/g, 'avajesh/hyper-productivity')
                .replace(/techeia\.com\/hyperproductivity/g, 'techeia.com/hyper-productivity')
                .replace(/"name":\s*"hyperproductivity"/g, '"name": "hyper-productivity"')
                .replace(/hyper-productivity-bin/g, 'hyper-productivity-bin');
            if (content !== newContent) {
                fs.writeFileSync(fullPath, newContent, 'utf8');
                console.log('Updated:', fullPath);
            }
        }
    });
}
walk('.');

// Explicitly handle build/linux wrapper since we skipped 'build' directory
const linuxWrapper = 'build/linux/snap-wrapper.sh';
if(fs.existsSync(linuxWrapper)) {
    let content = fs.readFileSync(linuxWrapper, 'utf8');
    let newContent = content.replace(/hyper-productivity-bin/g, 'hyper-productivity-bin');
    if(content !== newContent) {
        fs.writeFileSync(linuxWrapper, newContent, 'utf8');
        console.log('Updated:', linuxWrapper);
    }
}
