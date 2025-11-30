# Start both backend and frontend servers in new PowerShell windows

$repoRoot = "c:\Users\Dell\ShareCart"
$serverDir = Join-Path $repoRoot 'server'
$clientDir = Join-Path $repoRoot 'client'

# Start backend
Start-Process -FilePath "powershell.exe" -ArgumentList @('-NoExit', "-Command cd '$serverDir'; node server.js") -WindowStyle Normal

# Start frontend
Start-Process -FilePath "powershell.exe" -ArgumentList @('-NoExit', "-Command cd '$clientDir'; node server.js") -WindowStyle Normal

Write-Output "Started backend on port 5000 and frontend on port 3000 (if Node available)."