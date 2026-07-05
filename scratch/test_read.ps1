$path = Join-Path $PSScriptRoot "..\cases\lvnmag-news-lvn-magazinenews-1663.html"
$content = Get-Content -Path $path -Raw -Encoding utf8
Write-Host "Raw content length: $($content.Length)"
Write-Host "First 200 chars:"
Write-Host $content.Substring(0, [Math]::Min(200, $content.Length))
if ($content -match "<h1>(.*?)の不動産テック導入事例</h1>") {
    Write-Host "Matched company: $($Matches[1])"
} else {
    Write-Host "Match failed"
}
