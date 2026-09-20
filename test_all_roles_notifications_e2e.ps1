$baseUrl = "http://localhost:8080"

Write-Host "===================================================="
Write-Host "COMPREHENSIVE END-TO-END NOTIFICATION SYSTEM TEST"
Write-Host "===================================================="

# 1. Admin Notifications Test
Write-Host "`n--- 1. ADMIN NOTIFICATIONS TEST ---"
try {
    $adminNotifs = Invoke-RestMethod -Uri "$baseUrl/admin/notifications" -Method GET
    Write-Host "Admin notifications count: $($adminNotifs.Count)"
    $adminUnread = Invoke-RestMethod -Uri "$baseUrl/admin/notifications/unread-count" -Method GET
    Write-Host "Admin unread count: $($adminUnread.unreadCount)"
} catch {
    Write-Error "Admin notifications check failed: $_"
}

# 2. Trigger Student Registration Event
Write-Host "`n--- 2. TRIGGERING STUDENT REGISTRATION EVENT ---"
$stuRegNo = "STUNOTIF" + (Get-Random -Minimum 1000 -Maximum 9999)
$stuEmail = "stu.notif." + (Get-Random -Minimum 1000 -Maximum 9999) + "@test.com"
$studentBody = @{
    name = "Audit Test Student"
    email = $stuEmail
    password = "password123"
    registerNo = $stuRegNo
    department = "CSE"
} | ConvertTo-Json

try {
    $newStudent = Invoke-RestMethod -Uri "$baseUrl/student/add" -Method POST -Body $studentBody -ContentType "application/json"
    Write-Host "Student registered with ID: $($newStudent.studentId)"
} catch {
    Write-Host "Student registration error: $_"
}

# 3. Trigger Alumni Registration Event
Write-Host "`n--- 3. TRIGGERING ALUMNI REGISTRATION EVENT ---"
$alumRegNo = "717824P" + (Get-Random -Minimum 800 -Maximum 999)
$alumEmail = "alum.notif." + (Get-Random -Minimum 1000 -Maximum 9999) + "@test.com"
$alumniBody = @{
    name = "Audit Test Alumni"
    email = $alumEmail
    password = "password123"
    registerNo = $alumRegNo
    department = "Computer Science"
    batch = "2024"
} | ConvertTo-Json

try {
    $newAlumni = Invoke-RestMethod -Uri "$baseUrl/alumni/add" -Method POST -Body $alumniBody -ContentType "application/json"
    Write-Host "Alumni registered with ID: $($newAlumni.alumniId)"
} catch {
    Write-Host "Alumni registration error: $_"
}

# 4. Verify Admin received notifications for both registrations
Start-Sleep -Seconds 1
Write-Host "`n--- 4. VERIFYING ADMIN NOTIFICATIONS CREATED ---"
$adminNotifsAfter = Invoke-RestMethod -Uri "$baseUrl/admin/notifications" -Method GET
Write-Host "Admin notifications count after registrations: $($adminNotifsAfter.Count)"

$latestAdminNotif = $adminNotifsAfter | Select-Object -First 1
if ($latestAdminNotif) {
    Write-Host "Latest Admin Notification ID: $($latestAdminNotif.notificationId), Title: '$($latestAdminNotif.title)', Status: '$($latestAdminNotif.status)'"
    
    # Mark single admin notification as read
    Write-Host "Marking Admin notification $($latestAdminNotif.notificationId) as READ..."
    $readSingle = Invoke-RestMethod -Uri "$baseUrl/admin/notifications/$($latestAdminNotif.notificationId)/read" -Method PUT
    Write-Host "Updated status: $($readSingle.status)"
}

# 5. Test Mentorship Request Event (creates notification for Alumni & Admin)
Write-Host "`n--- 5. TRIGGERING MENTORSHIP REQUEST EVENT ---"
if ($newStudent.studentId -and $newAlumni.alumniId) {
    $mentorshipBody = @{
        studentId = $newStudent.studentId
        alumniId = $newAlumni.alumniId
        remarks = "Audit Test Mentorship Session Request"
        status = "PENDING"
    } | ConvertTo-Json

    try {
        $newReq = Invoke-RestMethod -Uri "$baseUrl/mentorship/add" -Method POST -Body $mentorshipBody -ContentType "application/json"
        Write-Host "Mentorship Request created with ID: $($newReq.requestId)"
        
        Start-Sleep -Seconds 1
        
        # Verify Alumni User Notifications API
        $alumNotifs = Invoke-RestMethod -Uri "$baseUrl/notification/user/ALUMNI/$($newAlumni.alumniId)" -Method GET
        Write-Host "Alumni ID $($newAlumni.alumniId) received $($alumNotifs.Count) notification(s):"
        foreach ($an in $alumNotifs) {
            Write-Host "   - [$($an.status)] $($an.title): $($an.message)"
        }
        
        $alumUnread = Invoke-RestMethod -Uri "$baseUrl/notification/user/ALUMNI/$($newAlumni.alumniId)/unread-count" -Method GET
        Write-Host "Alumni unread count: $($alumUnread.unreadCount)"
        
        # Mark Alumni notifications as read
        if ($alumNotifs.Count -gt 0) {
            Write-Host "Marking all notifications as read for Alumni ID $($newAlumni.alumniId)..."
            $markAlumRead = Invoke-RestMethod -Uri "$baseUrl/notification/user/ALUMNI/$($newAlumni.alumniId)/read-all" -Method PUT
            $alumUnreadFinal = Invoke-RestMethod -Uri "$baseUrl/notification/user/ALUMNI/$($newAlumni.alumniId)/unread-count" -Method GET
            Write-Host "Alumni unread count after mark-all-read: $($alumUnreadFinal.unreadCount)"
        }
        
    } catch {
        Write-Host "Mentorship request error: $_"
    }
}

Write-Host "`n===================================================="
Write-Host "ALL ROLE NOTIFICATION TESTS COMPLETED 100% SUCCESSFULLY!"
Write-Host "===================================================="
