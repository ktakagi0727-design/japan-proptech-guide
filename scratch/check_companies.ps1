$path = Join-Path (Get-Location) "data\companies-detail.json"
$content = [System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8)
$json = ConvertFrom-Json $content

$lines = @()
$lines += "Total empty other_tools companies: "
$emptyCount = 0

$listLines = @()
foreach ($c in $json) {
    if ($c.other_tools -eq $null -or $c.other_tools.Count -eq 0) {
        $emptyCount++
        $listLines += "  - $($c.company) ($($c.slug))"
    }
}

$lines[0] = "Total empty other_tools companies: $emptyCount"
$lines += $listLines

$outputPath = Join-Path (Get-Location) "scratch\empty_companies.txt"
[System.IO.File]::WriteAllLines($outputPath, $lines, [System.Text.Encoding]::UTF8)
Write-Output "Written to $outputPath"
