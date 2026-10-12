<#
.SYNOPSIS
  Aplica un archivo SQL de migracion al proyecto Supabase usando la Management API.
  No necesita Supabase CLI, psql ni la contrasena de la base de datos.

.EXAMPLE
  powershell -ExecutionPolicy Bypass -File scripts\supabase-migrate.ps1

.EXAMPLE
  powershell -ExecutionPolicy Bypass -File scripts\supabase-migrate.ps1 -File supabase\migrations\002_algo.sql

.NOTES
  El token (PAT) se pide en pantalla de forma oculta. Tambien puede venir en
  la variable de entorno SUPABASE_ACCESS_TOKEN o en el parametro -Token.
  Crear/borrar tokens: https://supabase.com/dashboard/account/tokens
#>
param(
  [string]$ProjectRef = "pjyaqjjpmjesjwbbmifz",
  [string]$File = "supabase\migrations\001_initial_schema.sql",
  [string]$Token = $env:SUPABASE_ACCESS_TOKEN
)

$ErrorActionPreference = "Stop"
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$root = Split-Path -Parent $PSScriptRoot
$sqlPath = Join-Path $root $File
if (-not (Test-Path $sqlPath)) { throw "No existe el archivo de migracion: $sqlPath" }

if (-not $Token) {
  $secure = Read-Host "Pega tu Supabase PAT (sbp_...)" -AsSecureString
  $bstr = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
  $Token = [Runtime.InteropServices.Marshal]::PtrToStringBSTR($bstr)
  [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)
}
if (-not $Token) { throw "No se recibio ningun token." }

function Invoke-SupabaseSql {
  param([string]$Query)
  $uri = "https://api.supabase.com/v1/projects/$ProjectRef/database/query"
  $json = @{ query = $Query } | ConvertTo-Json -Compress
  $body = [Text.Encoding]::UTF8.GetBytes($json)
  try {
    return Invoke-RestMethod -Method Post -Uri $uri `
      -Headers @{ Authorization = "Bearer $Token" } `
      -ContentType "application/json; charset=utf-8" `
      -Body $body
  } catch {
    $msg = $_.Exception.Message
    if ($_.Exception.Response) {
      $reader = New-Object IO.StreamReader($_.Exception.Response.GetResponseStream())
      $msg = $reader.ReadToEnd()
    }
    throw "Supabase respondio con error: $msg"
  }
}

Write-Host ""
Write-Host "Aplicando $File al proyecto $ProjectRef ..." -ForegroundColor Cyan
$sql = [IO.File]::ReadAllText($sqlPath, [Text.Encoding]::UTF8)
Invoke-SupabaseSql -Query $sql | Out-Null
Write-Host "Migracion aplicada." -ForegroundColor Green

Write-Host ""
Write-Host "Tablas en el esquema public:" -ForegroundColor Cyan
Invoke-SupabaseSql -Query @"
select t.table_name,
       (select count(*) from pg_policies p where p.tablename = t.table_name) as policies,
       (select count(*) from pg_trigger tr join pg_class c on c.oid = tr.tgrelid
         where c.relname = t.table_name and not tr.tgisinternal) as triggers
from information_schema.tables t
where t.table_schema = 'public'
order by 1
"@ | Format-Table -AutoSize

Write-Host "Seed de wedding_settings:" -ForegroundColor Cyan
Invoke-SupabaseSql -Query "select couple_name, venue_name, wedding_date from wedding_settings" | Format-Table -AutoSize
