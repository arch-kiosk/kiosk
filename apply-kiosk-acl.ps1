$config_path=".\config"
$file_repository=".\sync\sync\file_repository"
$temp_dir=".\temp"
$log_dir=".\log"
$filemaker_path=".\sync\sync\filemaker"
$custom_dir=".\custom"
$custom_sync_dir=".\sync\sync\custom"
$reporting=".\reporting"
$reset_file=".\reset.yml"

$exists = Test-Path -Path $config_path
if (-not $exists) {
	"Config Path does not exist under $config_path"
	exit
}
$exists = Test-Path -Path $file_repository
if (-not $exists) {
	"file repository does not exist under $file_repository"
	exit
}
$exists = Test-Path -Path $temp_dir
if (-not $exists) {
	"temporary directory does not exist under $temp_dir"
	exit
}
$exists = Test-Path -Path $filemaker_path
if (-not $exists) {
	"filemaker path does not exist under $filemaker_path"
	exit
}

$exists = Test-Path -Path $custom_dir
if (-not $exists) {
	"kiosk custom directory does not exist under $custom_dir"
	exit
}

$exists = Test-Path -Path $custom_sync_dir
if (-not $exists) {
	"custom_sync_dir does not exist under $custom_sync_dir"
	exit
}

$exists = Test-Path -Path $reporting
if (-not $exists) {
	"reporting does not exist under $reporting"
	exit
}

$exists = Test-Path -Path $reset_file
if (-not $exists) {
	echo " " > $reset_file
}

"All path do exists, access rules will be applied"

$AccessRule=New-Object System.Security.AccessControl.FileSystemAccessRule("BUILTIN\IIS_IUSRS","Modify","ContainerInherit,ObjectInherit", "None","Allow")


$path=$config_path
$acl=Get-Acl $path
$acl.SetAccessRule($AccessRule)
$acl | Set-Acl $path
"access rule for $path applied"

$path=$file_repository
$acl=Get-Acl $path
$acl.SetAccessRule($AccessRule)
$acl | Set-Acl $path
"access rule for $path applied"

$path=$temp_dir
$acl=Get-Acl $path
$acl.SetAccessRule($AccessRule)
$acl | Set-Acl $path
"access rule for $path applied"

$path=$log_dir
$acl=Get-Acl $path
$acl.SetAccessRule($AccessRule)
$acl | Set-Acl $path
"access rule for $path applied"

$path=$filemaker_path
$acl=Get-Acl $path
$acl.SetAccessRule($AccessRule)
$acl | Set-Acl $path
"access rule for $path applied"

$path=$custom_dir
$acl=Get-Acl $path
$acl.SetAccessRule($AccessRule)
$acl | Set-Acl $path
"access rule for $path applied"

$path=$custom_sync_dir
$acl=Get-Acl $path
$acl.SetAccessRule($AccessRule)
$acl | Set-Acl $path
"access rule for $path applied"

$path=$reporting
$acl=Get-Acl $path
$acl.SetAccessRule($AccessRule)
$acl | Set-Acl $path
"access rule for $path applied"

$AccessRule2 = New-Object System.Security.AccessControl.FileSystemAccessRule("BUILTIN\IIS_IUSRS","FullControl","Allow")
$path=$reset_file
$acl=Get-Acl $path
$acl.SetAccessRule($AccessRule2)
$acl | Set-Acl $path
"access rule for $path applied"
