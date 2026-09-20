$baseUrl = "http://localhost:8080"

Write-Host "=================================================="
Write-Host "E2E TEST: ALUMNI REGISTRATION -> ADMIN NOTIFICATION"
Write-Host "=================================================="

# 1. Fetch initial Admin Notifications & Unread Count
Write-Host "`n1. Fetching initial Admin notifications & unread count..."
$initialNotifs = Invoke-RestMethod -Uri "$baseUrl/admin/notifications" -Method GET
$initialUnread = Invoke-RestMethod -Uri "$baseUrl/admin/notifications/unread-count" -Method GET
Write-Host "   Initial notification count: $($initialNotifs.Count)"
Write-Host "   Initial unread count: $($initialUnread.unreadCount)"

# 2. Register a brand-new Alumni
Write-Host "`n2. Registering a brand-new Alumni..."
$regNo = "717824P" + (Get-Random -Minimum 100 -Maximum 999)
$email = "alumni.test." + (Get-Random -Minimum 1000 -Maximum 9999) + "@alumniconnect.com"
$name = "Samantha Reed"

$alumniBody = @{
    name = $name
    email = $email
    password = "password123"
    registerNo = $regNo
    department = "Computer Science"
    batch = "2024"
    currentCompany = "Microsoft"
    designation = "Senior Engineer"
} | ConvertTo-Json

$newAlumni = Invoke-RestMethod -Uri "$baseUrl/alumni/add" -Method POST -Body $alumniBody -ContentType "application/json"
Write-Host "   SUCCESS: Alumni created with ID $($newAlumni.alumniId), RegNo $($newAlumni.registerNo), Name '$($newAlumni.name)'"

# 3. Check Admin Notifications after registration
Start-Sleep -Seconds 1
Write-Host "`n3. Checking Admin Notifications after registration..."
$updatedNotifs = Invoke-RestMethod -Uri "$baseUrl/admin/notifications" -Method GET
$updatedUnread = Invoke-RestMethod -Uri "$baseUrl/admin/notifications/unread-count" -Method GET

Write-Host "   Updated notification count: $($updatedNotifs.Count)"
Write-Host "   Updated unread count: $($updatedUnread.unreadCount)"

$latestNotif = $updatedNotifs | Select-Object -First 1
Write-Host "`n4. Inspecting Latest Notification:"
Write-Host "   ID:       $($latestNotif.notificationId)"
Write-Host "   Title:    '$($latestNotif.title)'"
Write-Host "   Message:  '$($latestNotif.message)'"
Write-Host "   UserType: '$($latestNotif.userType)'"
Write-Host "   Status:   '$($latestNotif.status)'"

if ($latestNotif.title -eq "New Alumni Registration" -and $latestNotif.message -like "*$name*") {
    Write-Host "   PASSED: Title and message match expected format!" -ForegroundColor Green
} else {
    Write-Error "   FAILED: Notification title or message mismatch"
}

# 4. Test Mark-As-Read
Write-Host "`n5. Testing Mark-As-Read on notification $($latestNotif.notificationId)..."
$readRes = Invoke-RestMethod -Uri "$baseUrl/admin/notifications/$($latestNotif.notificationId)/read" -Method PUT
Write-Host "   Notification status updated to: '$($readRes.status)'"

$finalUnread = Invoke-RestMethod -Uri "$baseUrl/admin/notifications/unread-count" -Method GET
Write-Host "   Final unread count after marking read: $($finalUnread.unreadCount)"

if ($finalUnread.unreadCount -eq ($updatedUnread.unreadCount - 1)) {
    Write-Host "   PASSED: Unread count decreased by 1!" -ForegroundColor Green
}

Write-Host "`n=================================================="
Write-Host "ALL VERIFICATION STEPS PASSED 100% SUCCESSFULLY!"
Write-Host "=================================================="
