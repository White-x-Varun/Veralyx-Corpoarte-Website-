param(
  [Parameter(Mandatory = $true)]
  [string]$ApiBaseUrl,

  [Parameter(Mandatory = $true)]
  [string]$SiteUrl,

  [ValidatePattern('^[a-z0-9][a-z0-9-]{0,62}$')]
  [string]$ProjectName = 'veralyx'
)

$ErrorActionPreference = 'Stop'

function Assert-HttpsUrl([string]$Value, [string]$Label) {
  $parsed = $null
  if (-not [Uri]::TryCreate($Value, [UriKind]::Absolute, [ref]$parsed) -or $parsed.Scheme -ne 'https') {
    throw "$Label must be a full public HTTPS URL."
  }
  if ($parsed.IsLoopback -or $parsed.Host -eq 'localhost') {
    throw "$Label cannot point to localhost for a Cloudflare deployment."
  }
}

Assert-HttpsUrl $ApiBaseUrl 'ApiBaseUrl'
Assert-HttpsUrl $SiteUrl 'SiteUrl'

if ($ApiBaseUrl.TrimEnd('/') -notmatch '/api/v1$') {
  throw "ApiBaseUrl must end with /api/v1."
}

$repoRoot = Split-Path -Parent $PSScriptRoot
Push-Location $repoRoot
$previousApiBaseUrl = $env:VITE_API_BASE_URL
$previousSiteUrl = $env:VITE_SITE_URL
try {
  $env:VITE_API_BASE_URL = $ApiBaseUrl.TrimEnd('/')
  $env:VITE_SITE_URL = $SiteUrl.TrimEnd('/')

  npm run build -w frontend
  if ($LASTEXITCODE -ne 0) {
    throw 'Frontend build failed; Pages upload was skipped.'
  }

  npx --yes wrangler@4 pages deploy frontend/dist --project-name $ProjectName
  if ($LASTEXITCODE -ne 0) {
    throw 'Cloudflare Pages deployment failed.'
  }
}
finally {
  $env:VITE_API_BASE_URL = $previousApiBaseUrl
  $env:VITE_SITE_URL = $previousSiteUrl
  Pop-Location
<<<<<<< HEAD
}
=======
}
>>>>>>> 87302d045bec07cfb2e2996b09d26b2a88dcb31e
