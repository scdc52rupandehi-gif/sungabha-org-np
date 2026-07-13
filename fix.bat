@echo off
if exist "node_modules\es-toolkit" rmdir /s /q "node_modules\es-toolkit"
call npm install es-toolkit
call npm run build
