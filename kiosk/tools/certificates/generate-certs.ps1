# 1. Setup - Variables & OpenSSL Path
$caName = "kioskca"  # Change this to rename your CA files (e.g., "CompanyRoot")
$openssl = "openssl"

if (!(Get-Command openssl -ErrorAction SilentlyContinue)) {
    $gitPath = "C:\Program Files\Git\usr\bin\openssl.exe"
    if (Test-Path $gitPath) { $openssl = $gitPath }
    else { Write-Error "OpenSSL not found. Please install Git for Windows."; return }
}

# 2. Check for External v3.ext
if (!(Test-Path "v3.ext")) {
    Write-Error "Configuration file 'v3.ext' not found! Please ensure it exists in this directory."
    return
}

# 3. Create Directory Structure
$baseDir = "result"
$serverDir = "$baseDir\for_server"
$browserDir = "$baseDir\for_browsers"

if (!(Test-Path $baseDir)) { New-Item -ItemType Directory -Path $baseDir }
if (!(Test-Path $serverDir)) { New-Item -ItemType Directory -Path $serverDir }
if (!(Test-Path $browserDir)) { New-Item -ItemType Directory -Path $browserDir }

Write-Host "`n--- Kiosk Certificate Manager (Stable Config Mode) ---" -ForegroundColor Cyan

# 4. Handle Root CA
$caKey = "$baseDir\$caName.key"
$caCrt = "$browserDir\$caName.crt"
$caDer = "$browserDir\$caName.der"
$caSrl = "$baseDir\$caName.srl"

if (Test-Path $caKey) {
    Write-Host "[!] Existing Root CA found. Using saved $caName.key." -ForegroundColor Gray
} else {
    Write-Host "[+] Generating NEW 10-Year Root CA ($caName)..." -ForegroundColor Yellow
    $env:DN_SECTION = "ca_dn"
    & $openssl genrsa -out $caKey 4096
    & $openssl req -x509 -new -nodes -key $caKey -sha256 -days 3650 -out $caCrt `
        -config v3.ext -extensions v3_ca

    Write-Host "[+] Creating Android-compatible (DER) Root CA..." -ForegroundColor Green
    & $openssl x509 -in $caCrt -outform DER -out $caDer
}

# 5. Generate fresh Server Identity (CSR)
Write-Host "[+] Creating fresh Server Certificate (730 days)..." -ForegroundColor Yellow
$env:DN_SECTION = "server_dn"
& $openssl req -nodes -newkey rsa:2048 -keyout "$serverDir\server.key" -out "$baseDir\server.csr" `
    -config v3.ext

# 6. Sign the Server Certificate with the Root CA
Write-Host "[+] Signing Server Certificate with SANs..." -ForegroundColor Yellow
& $openssl x509 -req -in "$baseDir\server.csr" -CA $caCrt -CAkey $caKey `
    -CAserial $caSrl -CAcreateserial `
    -out "$serverDir\server.crt" -days 730 -sha256 -extfile v3.ext -extensions v3_server

# 7. Final Sanity Check & Cleanup
Write-Host "`n--- Verification Details ---" -ForegroundColor Cyan
if (Test-Path "$serverDir\server.crt") {
    $subj = & $openssl x509 -in "$serverDir\server.crt" -noout -subject
    Write-Host "Subject:  $subj" -ForegroundColor Gray

    $expiry = & $openssl x509 -in "$serverDir\server.crt" -noout -enddate
    Write-Host "Expiry:   $expiry" -ForegroundColor Gray

    $sans = & $openssl x509 -in "$serverDir\server.crt" -noout -ext subjectAltName
    if ($sans) {
        Write-Host "Alt Names: $($sans.Replace('subjectAltName=', '').Trim())" -ForegroundColor Green
    }

    Remove-Item "$baseDir\server.csr"
} else {
    Write-Error "CRITICAL: Server certificate was not generated."
}

$env:DN_SECTION = ""
Write-Host "`nDONE. Files generated with prefix: $caName" -ForegroundColor Cyan