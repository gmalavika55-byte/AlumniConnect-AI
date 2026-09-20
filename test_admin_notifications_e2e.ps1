$baseUrl = "http://localhost:8080"

Write-Host "=== TESTING ADMIN NOTIFICATIONS END-TO-END ==="

# 1. Fetch initial admin notifications
Write-Host "1. Fetching initial Admin Notifications..."
try {
    $initialNotifs = Invoke-RestMethod -Uri "$baseUrl/admin/notifications" -Method GET
    Write-Host "   Initial notifications count: $($initialNotifs.Count)"
} catch {
    Write-Error "Failed to fetch admin notifications: $_"
}

# 2. Fetch unread count
Write-Host "2. Fetching unread count..."
try {
    $unreadRes = Invoke-RestMethod -Uri "$baseUrl/admin/notifications/unread-count" -Method GET
    Write-Host "   Initial unread count: $($unreadRes.unreadCount)"
} catch {
    Write-Error "Failed to fetch unread count: $_"
}

# 3. Test Student Registration event notification
Write-Host "3. Triggering Student Registration event..."
$regNo = "STUNOTIF" + (Get-Random -Minimum 1000 -Maximum 9999)
$email = "student.notif." + (Get-Random -Minimum 1000 -Maximum 9999) + "@test.com"
$studentBody = @{
    name = "Test Notif Student"
    email = $email
    password = "password123"
    registerNo = $regNo
    department = "CSE"
} | ConvertTo-Json

try {
    $newStudent = Invoke-RestMethod -Uri "$baseUrl/student/add" -Method POST -Body $studentBody -ContentType "application/json"
    Write-Host "   Student registered with ID: $($newStudent.studentId)"
} catch {
    Write-Host "   Student registration error: $_"
}

# 4. Check if Admin notification was generated
Start-Sleep -Seconds 1
$updatedNotifs = Invoke-RestMethod -Uri "$baseUrl/admin/notifications" -Method GET
Write-Host "4. Updated notifications count: $($updatedNotifs.Count)"

$latestNotif = $updatedNotifs | Select-Object -First 1
if ($latestNotif) {
    Write-Host "   Latest Notification ID: $($latestNotif.notificationId)"
    Write-Host "   Title: $($latestNotif.title)"
    Write-Host "   Message: $($latestNotif.message)"
    Write-Host "   Status: $($latestNotif.status)"

    # 5. Mark single notification as read
    Write-Host "5. Marking notification $($latestNotif.notificationId) as READ..."
    $readRes = Invoke-RestMethod -Uri "$baseUrl/admin/notifications/$($latestNotif.notificationId)/read" -Method PUT
    Write-Host "   Updated status: $($readRes.status)"

    # 6. Mark all notifications as read
    Write-Host "6. Marking ALL admin notifications as READ..."
    $readAllRes = Invoke-RestMethod -Uri "$baseUrl/admin/notifications/read-all" -Method PUT
    Write-Host "   Message: $($readAllRes.message)"

    # 7. Confirm unread count is 0
    $finalUnread = Invoke-RestMethod -Uri "$baseUrl/admin/notifications/unread-count" -Method GET
    Write-Host "7. Final unread count: $($finalUnread.unreadCount)"
}

Write-Host "=== END-TO-END VERIFICATION COMPLETE ==="
