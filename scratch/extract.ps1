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

foreach ($f in $files) {
    $path = Join-Path $cases_dir $f
    $content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::GetEncoding("shift-jis"))
    
    # Extract Title or Company
    $title = ""
    if ($content -match "<h1>(.*?)の不動産テック導入事例</h1>") {
        $title = $Matches[1]
    }
    
    # Extract Service Name
    $service = ""
    if ($content -match "<h2>導入サービスと活用内容</h2>[\s\S]*?<h2>(.*?)</h2>") {
        $service = $Matches[1]
    }
    
    # Extract Summary
    $summary = ""
    if ($content -match "<h3>公開事例で確認できる内容</h3>[\s\S]*?<p>([\s\S]*?)</p>") {
        $summary = $Matches[1].Trim()
    }
    
    # Extract Official Link
    $official_link = ""
    if ($content -match 'class="btn-official" href="(.*?)"' -or $content -match 'href="(.*?)" class="btn-official"') {
        $official_link = $Matches[1]
    }
    
    # Extract Tasks
    $tasks = ""
    if ($content -match '<h2>関連する業務</h2>[\s\S]*?<div class="service-meta">([\s\S]*?)</div>') {
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
