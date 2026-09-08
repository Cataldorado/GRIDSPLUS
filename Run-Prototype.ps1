# Start GRIDS+ prototype dev server (portable Node)
$ErrorActionPreference = 'Stop'

$nodeBin = Join-Path $env:LOCALAPPDATA 'grids-plus-tools\node\node-v22.22.1-win-x64'
$nodeExe = Join-Path $nodeBin 'node.exe'
$appDir = $PSScriptRoot

if (-not (Test-Path -LiteralPath $nodeExe)) {
    Write-Host "Portable Node not found at $nodeBin"
    Write-Host 'See PREVIEW.md for StackBlitz, Mac, or Vercel options.'
    exit 1
}

$env:PATH = $nodeBin + ';' + $env:PATH
Set-Location -LiteralPath $appDir

if (-not (Test-Path -LiteralPath 'node_modules')) {
    Write-Host 'Installing dependencies...'
    npm install
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
}

Write-Host 'Starting dev server at http://localhost:5173'
npm run dev
