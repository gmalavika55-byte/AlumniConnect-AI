# 1. Log in as Student 33
$loginBody = '{"email":"diagtest_1786379010@test.ac.in","password":"Test@1234"}'
$loginRes = Invoke-WebRequest -Method POST -Uri "http://localhost:8080/auth/login" -Body $loginBody -ContentType "application/json" -UseBasicParsing
$loginData = $loginRes.Content | ConvertFrom-Json
$TOKEN = $loginData.token
$STUDENT_ID = $loginData.user.studentId

Write-Host "=== TEST 1: LOGGED IN ==="
Write-Host "studentId: $STUDENT_ID"
Write-Host "Token: $($TOKEN.Substring(0, 40))..."
Write-Host ""

# 2. Get profile of Student 33
$headers = @{ Authorization = "Bearer $TOKEN" }
$profileRes = Invoke-WebRequest -Method GET -Uri "http://localhost:8080/student/get/$STUDENT_ID" -Headers $headers -UseBasicParsing
$profile = $profileRes.Content | ConvertFrom-Json
Write-Host "=== TEST 2: GET PROFILE ==="
Write-Host "Name: $($profile.name)"
Write-Host "Notification Preferences: $($profile.notificationPref)"
Write-Host ""

# 3. Update notificationPref to {"mentorship":false,"events":true,"career":false}
$profile.notificationPref = '{"mentorship":false,"events":true,"career":false}'
$updateBody = $profile | ConvertTo-Json -Depth 5
try {
    $updateRes = Invoke-WebRequest -Method PUT -Uri "http://localhost:8080/student/update" -Headers $headers -Body $updateBody -ContentType "application/json" -UseBasicParsing -ErrorAction Stop
    $updatedProfile = $updateRes.Content | ConvertFrom-Json
    Write-Host "=== TEST 3: UPDATE PREFERENCES ==="
    Write-Host "Status: $($updateRes.StatusCode)"
    Write-Host "Updated Preferences: $($updatedProfile.notificationPref)"
    Write-Host ""
} catch {
    Write-Host "UPDATE FAILED: $_"
    exit 1
}

# 4. Get profile of Student 33 again to check persistence
$profileRes2 = Invoke-WebRequest -Method GET -Uri "http://localhost:8080/student/get/$STUDENT_ID" -Headers $headers -UseBasicParsing
$profile2 = $profileRes2.Content | ConvertFrom-Json
Write-Host "=== TEST 4: GET UPDATED PROFILE ==="
Write-Host "Notification Preferences after fetch: $($profile2.notificationPref)"
Write-Host ""

# 5. Attempt to update Student 1's profile using Student 33's token
Write-Host "=== TEST 5: SECURITY OWNERSHIP VALIDATION (UPDATE OTHER STUDENT) ==="
# Get student 1 details (without auth header, or let's use it, but wait, does GET /student/get/1 block it?)
# We block it! So let's craft a fake update payload for student 1
$fakeStudentObj = @{
    studentId = 1
    registerNo = "REG123"
    name = "Malavika G"
    email = "malavika@gmail.com"
    notificationPref = '{"mentorship":false,"events":false,"career":false}'
}
$fakeBody = $fakeStudentObj | ConvertTo-Json
try {
    $fakeUpdateRes = Invoke-WebRequest -Method PUT -Uri "http://localhost:8080/student/update" -Headers $headers -Body $fakeBody -ContentType "application/json" -UseBasicParsing -ErrorAction Stop
    Write-Host "UNEXPECTED SUCCESS: Modifying another student's preferences succeeded!" -ForegroundColor Red
} catch {
    Write-Host "BLOCKED AS EXPECTED (HTTP $($_.Exception.Response.StatusCode))" -ForegroundColor Green
    $errStream = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
    $errText = $errStream.ReadToEnd()
    Write-Host "Error message: $errText"
}
Write-Host ""

# 6. Attempt to get Student 1's profile using Student 33's token
Write-Host "=== TEST 6: SECURITY OWNERSHIP VALIDATION (GET OTHER STUDENT) ==="
try {
    $fakeGetRes = Invoke-WebRequest -Method GET -Uri "http://localhost:8080/student/get/1" -Headers $headers -UseBasicParsing -ErrorAction Stop
    Write-Host "UNEXPECTED SUCCESS: Accessing another student's profile succeeded!" -ForegroundColor Red
} catch {
    Write-Host "BLOCKED AS EXPECTED (HTTP $($_.Exception.Response.StatusCode))" -ForegroundColor Green
    $errStream = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
    $errText = $errStream.ReadToEnd()
    Write-Host "Error message: $errText"
}
Write-Host ""
