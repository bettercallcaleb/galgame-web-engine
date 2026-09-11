@echo off
set PORT=8000
if not "%~1"=="" set PORT=%~1
echo Open: http://127.0.0.1:%PORT%
py -m http.server %PORT% --bind 127.0.0.1
