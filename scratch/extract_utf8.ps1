# Save with UTF-8 encoding (PowerShell will run this script and read files using UTF8)
$files = @(
    "lvnmag-news-lvn-magazinenews-1663.html",
    "pick-hp-pickform.html",
    "tsukuru-ai-deve-navi-use-case-jr-kyushu.html",
    "tsukuru-ai-use-case-triad.html",
    "tsukuru-ai-use-case-ratel-partners.html",
    "tsukuru-ai-use-case-n-jk.html",
    "tasukicorp-news-15975.html",
    "tasukicorp-news-15794.html",
    "tasukicorp-news-13851.html",
    "forest-openrm-interviews-inaa.html"
)

$cases_dir = Join-Path $PSScriptRoot "..\cases"

# Use UTF-8 console output encoding to print Japanese correctly
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

foreach ($f in $files) {
    $path = Join-Path $cases_dir $f
    $content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
    
    # Extract Title or Company
    # \u306e = の, \u4e0d\u52d5\u7523 = 不動産, \u30c6\u30c3\u30af = テック
    $title = ""
    if ($content -match "<h1>\s*(.*?)\s*\u306e\u4e0d\u52d5\u7523\u30c6\u30c3\u30af") {
        $title = $Matches[1].Trim()
    }
    
    # Extract Service Name
    # \u5c0e\u5165 = 導入, \u30b5\u30fc\u30d3\u30b9 = サービス
    $service = ""
    if ($content -match "<h2>\u5c0e\u5165\u30b5\u30fc\u30d3\u30b9[\s\S]*?<h2>(.*?)</h2>") {
        $service = $Matches[1].Trim()
    }
    
    # Extract Summary
    # \u516c\u958b\u4e8b\u4f8b = 公開事例
    $summary = ""
    if ($content -match "<h3>\u516c\u958b\u4e8b\u4f8b[\s\S]*?<p>([\s\S]*?)</p>") {
        $summary = $Matches[1].Trim()
    }
    
    # Extract Official Link
    $official_link = ""
    if ($content -match 'class="btn-official" href="(.*?)"' -or $content -match 'href="(.*?)" class="btn-official"') {
        $official_link = $Matches[1]
    }
    
    # Extract Tasks
    # \u95a2\u9023 = 関連
    $tasks = ""
    if ($content -match '<h2>\u95a2\u9023[\s\S]*?<div class="service-meta">([\s\S]*?)</div>') {
        $tasks_raw = $Matches[1]
        $tasks = ($tasks_raw -replace "<.*?>", " ").Trim()
    }
    
    Write-Host "File: $f"
    Write-Host "Company: $title"
    Write-Host "Service: $service"
    Write-Host "Summary: $summary"
    Write-Host "Link: $official_link"
    Write-Host "Tasks: $tasks"
    Write-Host "----------------------------------"
}
