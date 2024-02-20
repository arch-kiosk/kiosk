$project_id=$args[0]
if ($project_id -eq $null) {
    Write-Host "Please state the project id!"
	exit
}
if (-not (Test-Path "./kiosk")) {
  Write-Host "Please copy this script to the parent directory of the kiosk path"
  exit
}

cd .\custom

$src_path=".\kiosk\custom\kiosk_custom\$project_id"
if (-not (Test-Path $src_path)) { 
  $src_path=".\kiosk\custom\$project_id"
  if (-not (Test-Path $src_path)) { 
    Write-Host "Path $src_path does not exist"
    cd ..
    exit
  }
}

if (-not (Test-Path "..\kiosk\custom")) { 
  Write-Host "The path ..\kiosk\custom does not exist"
  cd..
  exit
}

Write-Host "copying  $src_path to ..\kiosk\custom"
git pull
xcopy $src_path ..\kiosk\custom\$project_id /s
cd ..
