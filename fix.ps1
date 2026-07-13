Remove-Item -Recurse -Force "node_modules\es-toolkit" -ErrorAction SilentlyContinue
npm install es-toolkit
npm run build
