# Stop any process listening on ports 5000 and 3000 (backend and frontend)
$ports = @(5000, 3000)
foreach ($p in $ports) {
    $conn = Get-NetTCPConnection -LocalPort $p -State Listen -ErrorAction SilentlyContinue
    if ($conn) {
        $pid = $conn.OwningProcess
        try {
            Stop-Process -Id $pid -Force -ErrorAction Stop
            Write-Output "Stopped process on port $p (PID $pid)"
        } catch {
            Write-Output "Failed to stop process $pid on port $p: $_"
        }
    } else {
        Write-Output "No listener on port $p"
    }
}

# Additionally stop any Node.js processes (optional)
$nodeProcs = Get-Process -Name node -ErrorAction SilentlyContinue
if ($nodeProcs) {
    foreach ($np in $nodeProcs) {
        try {
            Stop-Process -Id $np.Id -Force -ErrorAction Stop
            Write-Output "Stopped Node process: $($np.Id)"
        } catch {
            Write-Output "Failed to stop Node process $($np.Id): $_"
        }
    }
} else {
    Write-Output "No Node processes found"
}