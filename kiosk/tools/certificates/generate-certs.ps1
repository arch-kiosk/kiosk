# 1. Setup - Find OpenSSL
$openssl = "openssl"
if (!(Get-Command openssl -ErrorAction SilentlyContinue)) {
    $gitPath = "C:\Program Files\Git\usr\bin\openssl.exe"
    if (Test-Path $gitPath) { $openssl = $gitPath } 
    else { Write-Error "OpenSSL not found."; return }
}

# 2. Check for External v3.ext
if (!(Test-Path "v3.ext")) {
    Write-Error "Configuration file 'v3.ext' not found!"
    return
}

# 3. Create Directory Structure
$baseDir = "result"
$serverDir = "$baseDir\for_server"
$browserDir = "$baseDir\for_browsers"

if (!(Test-Path $baseDir)) { New-Item -ItemType Directory -Path $baseDir }
if (!(Test-Path $serverDir)) { New-Item -ItemType Directory -Path $serverDir }
if (!(Test-Path $browserDir)) { New-Item -ItemType Directory -Path $browserDir }

Write-Host "`n--- Kiosk Certificate Manager ---" -ForegroundColor Cyan

# 4. Handle Root CA (Check if it exists first!)
if (Test-Path "$baseDir\ca.key") {
    Write-Host "[!] Existing Root CA found. Using saved ca.key." -ForegroundColor Gray
} else {
    Write-Host "[+] Generating NEW 10-Year Root CA..." -ForegroundColor Yellow
    & $openssl genrsa -out "$baseDir\ca.key" 4096
    # Changed extension from .pem to .crt
    & $openssl req -x509 -new -nodes -key "$baseDir\ca.key" -sha256 -days 3650 -out "$browserDir\ca.crt" `
        -subj "/CN=MyKioskRootCA/O=FieldTech/C=US"
    
    # Create the DER version for Android compatibility from the .crt
    Write-Host "[+] Creating Android-compatible (DER) Root CA..." -ForegroundColor Green
    & $openssl x509 -in "$browserDir\ca.crt" -outform DER -out "$browserDir\ca.der"
}

# 5. Always Generate a fresh Server Identity (The 2-Year Cert)
Write-Host "[+] Creating fresh Server Certificate (730 days)..." -ForegroundColor Yellow
& $openssl req -nodes -newkey rsa:2048 -keyout "$serverDir\server.key" -out "$baseDir\server.csr" -subj "/CN=x1lk.lan"

# 6. Sign with the Root CA (Using .crt instead of .pem)
& $openssl x509 -req -in "$baseDir\server.csr" -CA "$browserDir\ca.crt" -CAkey "$baseDir\ca.key" `
    -CAserial "$baseDir\ca.srl" -CAcreateserial `
    -out "$serverDir\server.crt" -days 730 -sha256 -extfile v3.ext -extensions EXT

# 7. Verification Step
Write-Host "`n--- Verification Details ---" -ForegroundColor Cyan
$expiry = & $openssl x509 -enddate -noout -in "$serverDir\server.crt"
$subject = & $openssl x509 -subject -noout -in "$serverDir\server.crt"
Write-Host "Subject: $subject" -ForegroundColor Gray
Write-Host "Expiry:  $expiry" -ForegroundColor Green

# 8. Cleanup temp CSR
Remove-Item "$baseDir\server.csr"

Write-Host "`nDONE." -ForegroundColor Cyan
Write-Host "For Server:   ./result/for_server (server.crt, server.key)" -ForegroundColor Gray
Write-Host "For Browsers: ./result/for_browsers (ca.crt for PC/iOS, ca.der for Android)" -ForegroundColor Gray