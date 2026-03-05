@echo off
setlocal

set "ROOT=%~dp0"
set "NO_PAUSE=0"
if /I "%~1"=="--no-pause" set "NO_PAUSE=1"

where npm >nul 2>&1
if errorlevel 1 (
  echo [ERROR] npm no esta instalado o no esta en PATH.
  if "%NO_PAUSE%"=="0" pause
  exit /b 1
)

if not exist "%ROOT%backend\package.json" (
  echo [ERROR] No se encontro backend\package.json en %ROOT%
  if "%NO_PAUSE%"=="0" pause
  exit /b 1
)

if not exist "%ROOT%frontend\package.json" (
  echo [ERROR] No se encontro frontend\package.json en %ROOT%
  if "%NO_PAUSE%"=="0" pause
  exit /b 1
)

echo Limpiando puertos 5000 y 4200...
for %%P in (5000 4200) do (
  for /f "tokens=5" %%A in ('netstat -ano ^| findstr /R /C:":%%P .*LISTENING"') do (
    taskkill /PID %%A /F >nul 2>&1
  )
)

echo Iniciando backend en una nueva ventana...
start "Backend Server" cmd /k "cd /d ""%ROOT%backend"" && npm start"

echo Iniciando frontend en una nueva ventana...
start "Frontend Server" cmd /k "cd /d ""%ROOT%frontend"" && npm start"

echo.
echo Listo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:4200
echo.
echo Puedes cerrar esta ventana.
if "%NO_PAUSE%"=="0" pause
