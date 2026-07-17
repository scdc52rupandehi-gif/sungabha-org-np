const fs = require('fs');
const path = require('path');

const srcApp = path.join(__dirname, 'src', 'app');
const localeApp = path.join(srcApp, '[locale]');

if (!fs.existsSync(localeApp)) {
  fs.mkdirSync(localeApp);
}

const ignore = ['[locale]', 'actions', 'globals.css', 'robots.ts', 'sitemap.ts', 'fonts', 'api'];

const items = fs.readdirSync(srcApp);

for (const item of items) {
  if (ignore.includes(item)) continue;
  
  const oldPath = path.join(srcApp, item);
  const newPath = path.join(localeApp, item);
  
  fs.renameSync(oldPath, newPath);
  console.log(`Moved ${item} to [locale]`);
}

// Update layout.tsx import
const layoutPath = path.join(localeApp, 'layout.tsx');
if (fs.existsSync(layoutPath)) {
  let content = fs.readFileSync(layoutPath, 'utf8');
  content = content.replace('import "./globals.css";', 'import "../globals.css";');
  fs.writeFileSync(layoutPath, content);
  console.log('Updated globals.css import in layout.tsx');
}
