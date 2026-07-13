const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes("import { supabase } from '@/lib/supabase'")) {
        // Replace import
        content = content.replace(
          "import { supabase } from '@/lib/supabase';", 
          "import { createClient } from '@/lib/supabase/client';"
        );
        
        // Find the component function to inject the createClient call
        // Most of them look like: export default function Something() {
        const componentRegex = /(export default function [a-zA-Z0-9_]+\([^)]*\)\s*\{)/g;
        if (componentRegex.test(content)) {
          content = content.replace(componentRegex, `$1\n  const supabase = createClient();`);
        } else {
          // If it's a utility like api.ts
          content = content + "\nconst supabase = createClient();";
        }
        
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log("Fixed: " + fullPath);
      }
    }
  }
}

processDir(path.join(__dirname, '../src'));
