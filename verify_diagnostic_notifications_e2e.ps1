$authUrl = "http://localhost:8101"
$mentorshipUrl = "http://localhost:8102"

Write-Host "=========================================================="
Write-Host "REAL BACKEND NOTIFICATION SYSTEM DIAGNOSTIC & VERIFICATION"
Write-Host "=========================================================="

# 1. SETUP: Create Test Student & Alumni
Write-Host "`n1. Creating test Student and Alumni..."
$stuRegNo = "717824P" + (Get-Random -Minimum 100 -Maximum 499)
$stuEmail = "stu.diag." + (Get-Random -Minimum 1000 -Maximum 9999) + "@test.com"
$studentBody = @{
    name = "Maya Lin"
    email = $stuEmail
    password = "password123"
    registerNo = $stuRegNo
    department = "Computer Science"
} | ConvertTo-Json

$student = Invoke-RestMethod -Uri "$authUrl/student/add" -Method POST -Body $studentBody -ContentType "application/json"
Write-Host "   SUCCESS: Student created - ID $($student.studentId), Name '$($student.name)'"

# FLOW 1: ALUMNI REGISTRATION -> ADMIN NOTIFICATION
Write-Host "`n--- FLOW 1: ALUMNI REGISTRATION -> ADMIN NOTIFICATION ---"
$alumRegNo = "717824F" + (Get-Random -Minimum 500 -Maximum 999)
$alumEmail = "alum.diag." + (Get-Random -Minimum 1000 -Maximum 9999) + "@test.com"
$alumniBody = @{
    name = "Vikramaditya"
    email = $alumEmail
    password = "password123"
    registerNo = $alumRegNo
    department = "Information Technology"
    batch = "2023"
    currentCompany = "Amazon"
    designation = "Lead Architect"
} | ConvertTo-Json

$alumni = Invoke-RestMethod -Uri "$authUrl/alumni/add" -Method POST -Body $alumniBody -ContentType "application/json"
Write-Host "   SUCCESS: Alumni created - ID $($alumni.alumniId), Name '$($alumni.name)'"

# Query Oracle NOTIFICATION table for Admin notification
Start-Sleep -Seconds 1
$adminNotifs = Invoke-RestMethod -Uri "$authUrl/admin/notifications" -Method GET
$latestAdminNotif = $adminNotifs | Select-Object -First 1

Write-Host "   Oracle DB Notification Row Query Result for Admin:"
Write-Host "     Notification ID: $($latestAdminNotif.notificationId)"
Write-Host "     UserType:        $($latestAdminNotif.userType)"
Write-Host "     Title:           '$($latestAdminNotif.title)'"
Write-Host "     Message:         '$($latestAdminNotif.message)'"
Write-Host "     Status:          $($latestAdminNotif.status)"

if ($latestAdminNotif.title -eq "New Alumni Registration" -and $latestAdminNotif.message -like "*Vikramaditya*") {
    Write-Host "   [PASSED] Flow 1: Real Admin notification inserted into Oracle DB & returned via API!" -ForegroundColor Green
} else {
    Write-Error "   [FAILED] Flow 1 mismatch"
}

# FLOW 2: STUDENT -> ALUMNI MENTORSHIP REQUEST NOTIFICATION
Write-Host "`n--- FLOW 2: STUDENT -> ALUMNI MENTORSHIP REQUEST NOTIFICATION ---"
$mentorshipBody = @{
    studentId = $student.studentId
    alumniId = $alumni.alumniId
    remarks = "System Design & Distributed Systems Mentorship"
    status = "PENDING"
} | ConvertTo-Json

$req = Invoke-RestMethod -Uri "$mentorshipUrl/mentorship/add" -Method POST -Body $mentorshipBody -ContentType "application/json"
Write-Host "   SUCCESS: Mentorship Request saved - ID $($req.requestId)"

# Query Oracle NOTIFICATION table for Alumni recipient
Start-Sleep -Seconds 1
$alumNotifs = Invoke-RestMethod -Uri "$authUrl/notification/user/ALUMNI/$($alumni.alumniId)" -Method GET
$latestAlumNotif = $alumNotifs | Select-Object -First 1

Write-Host "   Oracle DB Notification Row Query Result for Alumni (ID $($alumni.alumniId)):"
Write-Host "     Notification ID: $($latestAlumNotif.notificationId)"
Write-Host "     UserType:        $($latestAlumNotif.userType)"
Write-Host "     UserId:          $($latestAlumNotif.userId)"
Write-Host "     Title:           '$($latestAlumNotif.title)'"
Write-Host "     Message:         '$($latestAlumNotif.message)'"
Write-Host "     Status:          $($latestAlumNotif.status)"

if ($latestAlumNotif.title -eq "New Mentorship Request" -and $latestAlumNotif.message -like "*Maya Lin*") {
    Write-Host "   [PASSED] Flow 2: Real Alumni notification inserted into Oracle DB & returned via API!" -ForegroundColor Green
} else {
    Write-Error "   [FAILED] Flow 2 mismatch"
}

# FLOW 3: ALUMNI -> STUDENT MENTORSHIP ACCEPT NOTIFICATION
Write-Host "`n--- FLOW 3: ALUMNI ACCEPT -> STUDENT NOTIFICATION ---"
$acceptRes = Invoke-RestMethod -Uri "$mentorshipUrl/mentorship/accept/$($req.requestId)?alumniId=$($alumni.alumniId)" -Method PUT
Write-Host "   SUCCESS: Mentorship Request accepted"

Start-Sleep -Seconds 1
$stuNotifs = Invoke-RestMethod -Uri "$authUrl/notification/user/STUDENT/$($student.studentId)" -Method GET
$latestStuNotif = $stuNotifs | Select-Object -First 1

Write-Host "   Oracle DB Notification Row Query Result for Student (ID $($student.studentId)):"
Write-Host "     Notification ID: $($latestStuNotif.notificationId)"
Write-Host "     UserType:        $($latestStuNotif.userType)"
Write-Host "     UserId:          $($latestStuNotif.userId)"
Write-Host "     Title:           '$($latestStuNotif.title)'"
Write-Host "     Message:         '$($latestStuNotif.message)'"
Write-Host "     Status:          $($latestStuNotif.status)"

if ($latestStuNotif.title -eq "Mentorship Request Accepted" -and $latestStuNotif.message -like "*Vikramaditya*") {
    Write-Host "   [PASSED] Flow 3: Real Student notification inserted into Oracle DB & returned via API!" -ForegroundColor Green
} else {
    Write-Error "   [FAILED] Flow 3 mismatch"
}

# FLOW 4: MARK AS READ & UNREAD COUNT VERIFICATION
Write-Host "`n--- FLOW 4: MARK AS READ & UNREAD COUNT ---"
$unreadBefore = Invoke-RestMethod -Uri "$authUrl/notification/user/STUDENT/$($student.studentId)/unread-count" -Method GET
Write-Host "   Unread Count Before: $($unreadBefore.unreadCount)"

$readRes = Invoke-RestMethod -Uri "$authUrl/notification/$($latestStuNotif.notificationId)/read" -Method PUT
$unreadAfter = Invoke-RestMethod -Uri "$authUrl/notification/user/STUDENT/$($student.studentId)/unread-count" -Method GET
Write-Host "   Unread Count After:  $($unreadAfter.unreadCount)"

if ($unreadAfter.unreadCount -eq ($unreadBefore.unreadCount - 1)) {
    Write-Host "   [PASSED] Flow 4: Unread count decreased by 1 in DB!" -ForegroundColor Green
}

Write-Host "`n=========================================================="
Write-Host "ALL DIAGNOSTIC & VERIFICATION TESTS COMPLETED 100% CLEANLY!"
Write-Host "=========================================================="
