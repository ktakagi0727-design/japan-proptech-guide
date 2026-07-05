$batches = Get-ChildItem -Path "scratch\batch*.json"

foreach ($b in $batches) {
    $content = [System.IO.File]::ReadAllText($b.FullName, [System.Text.Encoding]::UTF8)
    $json = ConvertFrom-Json $content
    Write-Output "File: $($b.Name) - Count: $($json.Count)"
    foreach ($item in $json) {
        $otherTools = "none"
        if ($item.other_tools -ne $null -and $item.other_tools.Count -gt 0) {
            $otherTools = $item.other_tools -join ", "
        }
        Write-Output "  - $($item.company) (other_tools: $otherTools)"
    }
}
