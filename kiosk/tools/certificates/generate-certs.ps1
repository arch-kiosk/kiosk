# 1. Setup - Find OpenSSL
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

# 4. Handle Root CA (Check if it exists first!)
if (Test-Path "$baseDir\ca.key") {
    Write-Host "[!] Existing Root CA found. Using saved ca.key." -ForegroundColor Gray
} else {
    Write-Host "[+] Generating NEW 10-Year Root CA..." -ForegroundColor Yellow
    $env:DN_SECTION = "ca_dn"  # Tells OpenSSL to use [ca_dn] in v3.ext
    & $openssl genrsa -out "$baseDir\ca.key" 4096
    & $openssl req -x509 -new -nodes -key "$baseDir\ca.key" -sha256 -days 3650 -out "$browserDir\ca.crt" `
        -config v3.ext -extensions v3_ca

    # Create the DER version for Android compatibility
    Write-Host "[+] Creating Android-compatible (DER) Root CA..." -ForegroundColor Green
    & $openssl x509 -in "$browserDir\ca.crt" -outform DER -out "$browserDir\ca.der"
}

# 5. Generate fresh Server Identity (CSR)
Write-Host "[+] Creating fresh Server Certificate (730 days)..." -ForegroundColor Yellow
$env:DN_SECTION = "server_dn" # Tells OpenSSL to use [server_dn] in v3.ext
& $openssl req -nodes -newkey rsa:2048 -keyout "$serverDir\server.key" -out "$baseDir\server.csr" `
    -config v3.ext

# 6. Sign the Server Certificate with the Root CA
Write-Host "[+] Signing Server Certificate with SANs..." -ForegroundColor Yellow
& $openssl x509 -req -in "$baseDir\server.csr" -CA "$browserDir\ca.crt" -CAkey "$baseDir\ca.key" `
    -CAserial "$baseDir\ca.srl" -CAcreateserial `
    -out "$serverDir\server.crt" -days 730 -sha256 -extfile v3.ext -extensions v3_server

# 7. Final Sanity Check & Cleanup
Write-Host "`n--- Verification Details ---" -ForegroundColor Cyan
if (Test-Path "$serverDir\server.crt") {
    # Extract Subject
    $subj = & $openssl x509 -in "$serverDir\server.crt" -noout -subject
    Write-Host "Subject:  $subj" -ForegroundColor Gray

    # Extract Expiry
    $expiry = & $openssl x509 -in "$serverDir\server.crt" -noout -enddate
    Write-Host "Expiry:   $expiry" -ForegroundColor Gray

    # Extract SANs (DNS and IP entries)
    $sans = & $openssl x509 -in "$serverDir\server.crt" -noout -ext subjectAltName
    if ($sans) {
        Write-Host "Alt Names: $($sans.Replace('subjectAltName=', '').Trim())" -ForegroundColor Green
    } else {
        Write-Warning "No Subject Alternative Names (SANs) found!"
    }

    # Cleanup temp CSR
    Remove-Item "$baseDir\server.csr"
} else {
    Write-Error "CRITICAL: Server certificate was not generated."
}

# Reset the environment variable
$env:DN_SECTION = ""

Write-Host "`nDONE. Ready for deployment." -ForegroundColor Cyan