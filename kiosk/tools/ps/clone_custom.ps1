$project_id=$args[0]
if ($project_id -eq $null) {
    Write-Host "Please state the project id!"
	exit
}
if (-not (Test-Path "./kiosk")) {
  Write-Host "Please copy this script to the parent directory of the kiosk path"
  exit
}
if (Test-Path ./custom) {
  Write-Host "Path ./custom already exists. Please delete a former clone or just use update_custom.ps1"
  exit
}


git clone "https://github.com/arch-kiosk/$project_id.git" custom
.\update_custom.ps1 $project_id
