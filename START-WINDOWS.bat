@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
 echo Install Node.js 22 or newer, then run this file again.
 pause
 exit /b 1
)
if not exist .env copy .env.example .env >nul
if not exist node_modules (
 call npm ci --ignore-scripts
 if errorlevel 1 (
  pause
  exit /b 1
 )
)
echo Open http://localhost:3000 after the server starts.
echo Configure a NEW SMTP_PASSWORD in .env to enable email submissions.
call npm start
pause
