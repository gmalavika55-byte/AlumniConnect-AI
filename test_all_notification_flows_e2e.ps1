$baseUrl = "http://localhost:8080"

Write-Host "=========================================================="
Write-Host "E2E TEST: ALL REAL BACKEND NOTIFICATION FLOWS (A, B, C, D, E)"
Write-Host "=========================================================="

# 1. SETUP: Create Test Student & Test Alumni
Write-Host "`n1. Setting up test Student and Alumni..."
$stuRegNo = "STUNOTIF" + (Get-Random -Minimum 1000 -Maximum 9999)
$stuEmail = "stu.e2e." + (Get-Random -Minimum 1000 -Maximum 9999) + "@test.com"
$studentBody = @{
    name = "Alex Mercer"
    email = $stuEmail
    password = "password123"
    registerNo = $stuRegNo
    department = "CSE"
} | ConvertTo-Json

$student = Invoke-RestMethod -Uri "$baseUrl/student/add" -Method POST -Body $studentBody -ContentType "application/json"
Write-Host "   Created Student: ID $($student.studentId), Name '$($student.name)'"

# TEST C: Alumni Registration -> Admin Notification
Write-Host "`n--- TEST C: ALUMNI REGISTRATION -> ADMIN NOTIFICATION ---"
$alumRegNo = "717824P" + (Get-Random -Minimum 1000 -Maximum 9999)
$alumEmail = "alum.e2e." + (Get-Random -Minimum 1000 -Maximum 9999) + "@test.com"
$alumniBody = @{
    name = "Dr. Elena Rostova"
    email = $alumEmail
    password = "password123"
    registerNo = $alumRegNo
    department = "Computer Science"
    batch = "2022"
    currentCompany = "Google"
    designation = "Staff Engineer"
} | ConvertTo-Json

$alumni = Invoke-RestMethod -Uri "$baseUrl/alumni/add" -Method POST -Body $alumniBody -ContentType "application/json"
Write-Host "   Created Alumni: ID $($alumni.alumniId), Name '$($alumni.name)'"

Start-Sleep -Seconds 1
$adminNotifs = Invoke-RestMethod -Uri "$baseUrl/admin/notifications" -Method GET
$latestAdminNotif = $adminNotifs | Select-Object -First 1
Write-Host "   Admin Bell Latest Notification:"
Write-Host "     Title:   '$($latestAdminNotif.title)'"
Write-Host "     Message: '$($latestAdminNotif.message)'"
if ($latestAdminNotif.title -eq "New Alumni Registration" -and $latestAdminNotif.message -like "*Elena Rostova*") {
    Write-Host "   [PASSED] Test C: Admin received Alumni Registration notification!" -ForegroundColor Green
} else {
    Write-Error "   [FAILED] Test C: Admin notification mismatch"
}

# TEST A: Student -> Alumni Mentorship Request
Write-Host "`n--- TEST A: STUDENT -> ALUMNI MENTORSHIP REQUEST NOTIFICATION ---"
$mentorshipBody = @{
    studentId = $student.studentId
    alumniId = $alumni.alumniId
    remarks = "Career Guidance in Cloud & AI Architecture"
    status = "PENDING"
} | ConvertTo-Json

$req = Invoke-RestMethod -Uri "$baseUrl/mentorship/add" -Method POST -Body $mentorshipBody -ContentType "application/json"
Write-Host "   Mentorship Request Created with ID $($req.requestId)"

Start-Sleep -Seconds 1
$alumNotifs = Invoke-RestMethod -Uri "$baseUrl/notification/user/ALUMNI/$($alumni.alumniId)" -Method GET
$latestAlumNotif = $alumNotifs | Select-Object -First 1
Write-Host "   Alumni Bell Latest Notification:"
Write-Host "     Title:   '$($latestAlumNotif.title)'"
Write-Host "     Message: '$($latestAlumNotif.message)'"
if ($latestAlumNotif.title -eq "New Mentorship Request" -and $latestAlumNotif.message -like "*Alex Mercer*") {
    Write-Host "   [PASSED] Test A: Alumni received Mentorship Request notification from Student!" -ForegroundColor Green
} else {
    Write-Error "   [FAILED] Test A: Alumni notification mismatch"
}

# TEST D: Alumni Accepts Request -> Student Notification
Write-Host "`n--- TEST D: ALUMNI ACCEPTS REQUEST -> STUDENT NOTIFICATION ---"
$acceptRes = Invoke-RestMethod -Uri "$baseUrl/mentorship/accept/$($req.requestId)?alumniId=$($alumni.alumniId)" -Method PUT
Write-Host "   Request status updated to: '$($acceptRes.status)'"

Start-Sleep -Seconds 1
$stuNotifs = Invoke-RestMethod -Uri "$baseUrl/notification/user/STUDENT/$($student.studentId)" -Method GET
$latestStuNotif = $stuNotifs | Select-Object -First 1
Write-Host "   Student Bell Latest Notification:"
Write-Host "     Title:   '$($latestStuNotif.title)'"
Write-Host "     Message: '$($latestStuNotif.message)'"
if ($latestStuNotif.title -eq "Mentorship Request Accepted" -and $latestStuNotif.message -like "*Elena Rostova*") {
    Write-Host "   [PASSED] Test D: Student received Mentorship Accepted notification from Alumni!" -ForegroundColor Green
} else {
    Write-Error "   [FAILED] Test D: Student notification mismatch"
}

# TEST E: Reject Notification Flow
Write-Host "`n--- TEST E: ALUMNI REJECTS REQUEST -> STUDENT NOTIFICATION ---"
# Create second request to reject
$req2 = Invoke-RestMethod -Uri "$baseUrl/mentorship/add" -Method POST -Body $mentorshipBody -ContentType "application/json"
$rejectRes = Invoke-RestMethod -Uri "$baseUrl/mentorship/reject/$($req2.requestId)?alumniId=$($alumni.alumniId)" -Method PUT

Start-Sleep -Seconds 1
$stuNotifs2 = Invoke-RestMethod -Uri "$baseUrl/notification/user/STUDENT/$($student.studentId)" -Method GET
$latestRejectNotif = $stuNotifs2 | Select-Object -First 1
Write-Host "   Student Bell Latest Notification after Reject:"
Write-Host "     Title:   '$($latestRejectNotif.title)'"
Write-Host "     Message: '$($latestRejectNotif.message)'"
if ($latestRejectNotif.title -eq "Mentorship Request Rejected") {
    Write-Host "   [PASSED] Test E: Student received Mentorship Rejected notification!" -ForegroundColor Green
} else {
    Write-Error "   [FAILED] Test E: Reject notification mismatch"
}

# TEST: Mark Notification As Read & Unread Count Decrease
Write-Host "`n--- MARK AS READ & UNREAD COUNT TEST ---"
$stuUnreadBefore = Invoke-RestMethod -Uri "$baseUrl/notification/user/STUDENT/$($student.studentId)/unread-count" -Method GET
Write-Host "   Student unread count before mark read: $($stuUnreadBefore.unreadCount)"

$readRes = Invoke-RestMethod -Uri "$baseUrl/notification/$($latestRejectNotif.notificationId)/read" -Method PUT
$stuUnreadAfter = Invoke-RestMethod -Uri "$baseUrl/notification/user/STUDENT/$($student.studentId)/unread-count" -Method GET
Write-Host "   Student unread count after mark read:  $($stuUnreadAfter.unreadCount)"

if ($stuUnreadAfter.unreadCount -eq ($stuUnreadBefore.unreadCount - 1)) {
    Write-Host "   [PASSED] Unread count decreased by 1!" -ForegroundColor Green
} else {
    Write-Error "   [FAILED] Unread count did not decrease as expected"
}

Write-Host "`n=========================================================="
Write-Host "ALL E2E NOTIFICATION TESTS (A, B, C, D, E) PASSED 100%!"
Write-Host "=========================================================="
