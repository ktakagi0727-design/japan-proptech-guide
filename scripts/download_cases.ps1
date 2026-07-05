# download_cases.ps1
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$csvPath = Join-Path $scriptDir "../data/cases.csv"
$saveDir = Join-Path $scriptDir "../cases/raw_sources"
$errorLogPath = Join-Path $saveDir "download_error.log"

if (-not (Test-Path $saveDir)) {
    New-Item -ItemType Directory -Path $saveDir | Out-Null
}

if (-not (Test-Path $csvPath)) {
    Write-Error "CSV file not found at $csvPath"
    exit
}

$rows = Import-Csv -Path $csvPath -Encoding utf8

Write-Host "Total cases to check: $($rows.Count)"

[Net.ServicePointManager]::ServerCertificateValidationCallback = {$true}
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$idx = 1
foreach ($row in $rows) {
    $adopter = $row.adopter
    $service = $row.service
    $url = $row.url

    if (-not $url -or -not $url.StartsWith("http")) {
        Write-Host "[$idx/$($rows.Count)] Skipped (Invalid URL): $url"
        $idx++
        continue
    }

    $safeAdopter = $adopter -replace '[\\/*?:"<>|]', '_'
    $safeService = $service -replace '[\\/*?:"<>|]', '_'
    $filename = "{0:D3}_{1}_{2}.txt" -f $idx, $safeAdopter, $safeService
    $filepath = Join-Path $saveDir $filename

    if (Test-Path $filepath) {
        $fileSize = (Get-Item $filepath).Length
        if ($fileSize -gt 100) {
            Write-Host "[$idx/$($rows.Count)] Skipped (already exists): $filename"
            $idx++
            continue
        }
    }

    Write-Host "[$idx/$($rows.Count)] Downloading: $url -> $filename"

    try {
        $webClient = New-Object System.Net.WebClient
        $webClient.Headers.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
        $webClient.Encoding = [System.Text.Encoding]::UTF8
        
        $html = $webClient.DownloadString($url)

        # Sanitization logic (using lazy matching to avoid wiping entire body)
        $html = $html -replace '(?is)<script.*?>.*?</script>', ''
        $html = $html -replace '(?is)<style.*?>.*?</style>', ''
        $html = $html -replace '(?is)<header.*?>.*?</header>', ''
        $html = $html -replace '(?is)<footer.*?>.*?</footer>', ''
        $html = $html -replace '(?is)<nav.*?>.*?</nav>', ''
        
        # Strip all HTML tags
        $text = $html -replace '<[^>]*>', ' '
        
        # Decode HTML entities
        $text = $text -replace '&nbsp;', ' '
        $text = $text -replace '&lt;', '<'
        $text = $text -replace '&gt;', '>'
        $text = $text -replace '&amp;', '&'
        $text = $text -replace '&quot;', '"'

        # Trim spaces and duplicate newlines
        $text = $text -replace '(?m)^\s+$', ''
        $text = $text -replace '\n{3,}', "`n`n"
        $text = $text.Trim()

        $content = "URL: $url`n`n$text"
        [System.IO.File]::WriteAllText($filepath, $content, [System.Text.Encoding]::UTF8)

        Write-Host "  Successfully saved $($text.Length) chars."
    }
    catch {
        $errMsg = $_.Exception.Message
        Write-Host "  [ERROR] $errMsg"
        $logLine = "{0:D3} | {1} | {2} | {3} | {4}`n" -f $idx, $adopter, $service, $url, $errMsg
        [System.IO.File]::AppendAllText($errorLogPath, $logLine, [System.Text.Encoding]::UTF8)
    }

    $idx++
    Start-Sleep -Seconds 3
}

Write-Host "Done downloading all cases."
