param(
  [Parameter(Mandatory = $true)]
  [string]$SiteUrl
)

$ErrorActionPreference = 'Stop'

$site = $null
if (-not [Uri]::TryCreate($SiteUrl, [UriKind]::Absolute, [ref]$site) -or $site.Scheme -ne 'https' -or $site.IsLoopback) {
  throw 'SiteUrl must be the public HTTPS origin of the Cloudflare Pages site, such as https://veralyx.pages.dev.'
}
if ($site.AbsolutePath -ne '/' -or $site.Query -or $site.Fragment) {
  throw 'SiteUrl must be an origin only, without a path, query, or fragment.'
}

$repoRoot = Split-Path -Parent $PSScriptRoot
$secretsFile = Join-Path $repoRoot 'backend/.cloudflare.secrets'
if (-not (Test-Path -LiteralPath $secretsFile -PathType Leaf)) {
  throw 'Create backend/.cloudflare.secrets with MONGODB_URI and SESSION_SECRET before deploying. Copy backend/.cloudflare.secrets.example and fill in real values locally.'
}

function Invoke-Wrangler([string[]]$Arguments) {
  $localWrangler = Join-Path $repoRoot 'node_modules/.bin/wrangler.CMD'
  if (Test-Path -LiteralPath $localWrangler -PathType Leaf) {
    & $localWrangler @Arguments
  }
  elseif (Get-Command npx -ErrorAction SilentlyContinue) {
    & npx --yes wrangler@4 @Arguments
  }
  elseif (Get-Command pnpm -ErrorAction SilentlyContinue) {
    & pnpm dlx wrangler@4 @Arguments
  }
  else {
    throw 'Install Node.js with npm, or install pnpm, to run Wrangler.'
  }
  if ($LASTEXITCODE -ne 0) { throw 'Wrangler command failed.' }
}

Push-Location $repoRoot
$previousApiBaseUrl = $env:VITE_API_BASE_URL
$previousSiteUrl = $env:VITE_SITE_URL
$previousCfPages = $env:CF_PAGES
try {
  # Same-origin Pages Function routes /api/* through the VERALYX_API service binding.
  $env:VITE_API_BASE_URL = '/api/v1'
  $env:VITE_SITE_URL = $site.GetLeftPart([UriPartial]::Authority)
  $env:CF_PAGES = '1'

  Write-Host 'Deploying API Worker and uploading the ignored local secrets file as encrypted Worker secrets.'
  Invoke-Wrangler @('deploy', '--config', 'backend/wrangler.jsonc', '--secrets-file', $secretsFile, '--var', "CLIENT_ORIGIN:$($env:VITE_SITE_URL)")

  if (Get-Command npm -ErrorAction SilentlyContinue) {
    npm run build -w frontend
    if ($LASTEXITCODE -ne 0) { throw 'Frontend build failed; Pages deployment was skipped.' }
  }
  else {
    Push-Location (Join-Path $repoRoot 'frontend')
    try {
      & .\node_modules\.bin\vite.CMD build
      if ($LASTEXITCODE -ne 0) { throw 'Frontend build failed; Pages deployment was skipped.' }
    }
    finally {
      Pop-Location
    }
  }

  Push-Location (Join-Path $repoRoot 'frontend')
  try {
    Invoke-Wrangler @('pages', 'deploy', 'dist', '--config', 'wrangler.jsonc')
  }
  finally {
    Pop-Location
  }
}
finally {
  $env:VITE_API_BASE_URL = $previousApiBaseUrl
  $env:VITE_SITE_URL = $previousSiteUrl
  $env:CF_PAGES = $previousCfPages
  Pop-Location
}
