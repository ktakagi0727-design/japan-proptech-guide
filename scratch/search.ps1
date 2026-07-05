$companies = Get-Content -Path "scratch/companies.txt" -Encoding UTF8
$detailJson = Get-Content -Path "data/companies-detail.json" -Raw -Encoding utf8
foreach ($comp in $companies) {
    if ([string]::IsNullOrEmpty($comp)) { continue }
    if ($detailJson.Contains($comp)) {
        Write-Output ($comp + " found in companies-detail.json")
    } else {
        Write-Output ($comp + " NOT found")
    }
}
