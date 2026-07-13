@echo off
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del /q package-lock.json
call npm install
call npm run build
