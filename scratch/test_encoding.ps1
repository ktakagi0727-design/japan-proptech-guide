$path = Join-Path $PSScriptRoot "..\cases\lvnmag-news-lvn-magazinenews-1663.html"
$bytes = [System.IO.File]::ReadAllBytes($path)
$hex = ($bytes[0..15] | ForEach-Object { '{0:X2}' -f $_ }) -join ' '
Write-Host "Hex: $hex"

# Try decoding with UTF8, Unicode, Default, OEM, etc.
$encodings = @("utf-8", "shift-jis", "euc-jp", "utf-16")
foreach ($encName in $encodings) {
    $enc = [System.Text.Encoding]::GetEncoding($encName)
    $str = $enc.GetString($bytes)
    $hasPana = $str.Contains("パナソニック")
    Write-Host "$encName contains 'パナソニック': $hasPana"
    if ($hasPana) {
        Write-Host "Sample: $($str.Substring($str.IndexOf('パナソニック'), 30))"
    }
}
