Write-Host "=========================================================="
Write-Host "VERIFYING EXACT SINGLE CORS RESPONSE HEADER FROM API GATEWAY"
Write-Host "=========================================================="

Start-Sleep -Seconds 3

try {
    $req1 = [System.Net.HttpWebRequest]::Create("http://localhost:8080/notification/getall")
    $req1.Method = "GET"
    $req1.Headers.Add("Origin", "http://localhost:5173")
    $resp1 = $req1.GetResponse()
    $corsHeader1 = $resp1.Headers["Access-Control-Allow-Origin"]
    Write-Host "`n1. GET http://localhost:8080/notification/getall"
    Write-Host "   Status Code: $($resp1.StatusCode)"
    Write-Host "   Access-Control-Allow-Origin: '$corsHeader1'"
    
    if ($corsHeader1 -eq "http://localhost:5173") {
        Write-Host "   [PASSED] Exactly ONE Access-Control-Allow-Origin header matching 'http://localhost:5173'!" -ForegroundColor Green
    } else {
        Write-Error "   [FAILED] Invalid CORS header: $corsHeader1"
    }
} catch {
    Write-Host "Req 1 Error: $_"
}

try {
    $req2 = [System.Net.HttpWebRequest]::Create("http://localhost:8080/admin/notifications/unread-count")
    $req2.Method = "GET"
    $req2.Headers.Add("Origin", "http://localhost:5173")
    $resp2 = $req2.GetResponse()
    $corsHeader2 = $resp2.Headers["Access-Control-Allow-Origin"]
    Write-Host "`n2. GET http://localhost:8080/admin/notifications/unread-count"
    Write-Host "   Status Code: $($resp2.StatusCode)"
    Write-Host "   Access-Control-Allow-Origin: '$corsHeader2'"
    
    if ($corsHeader2 -eq "http://localhost:5173") {
        Write-Host "   [PASSED] Exactly ONE Access-Control-Allow-Origin header matching 'http://localhost:5173'!" -ForegroundColor Green
    } else {
        Write-Error "   [FAILED] Invalid CORS header: $corsHeader2"
    }
} catch {
    Write-Host "Req 2 Error: $_"
}

Write-Host "`n=========================================================="
Write-Host "CORS HEADER VERIFICATION COMPLETED!"
Write-Host "=========================================================="
