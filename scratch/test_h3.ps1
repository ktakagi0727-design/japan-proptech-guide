$path = Join-Path $PSScriptRoot "..\cases\lvnmag-news-lvn-magazinenews-1663.html"
$bytes = [System.IO.File]::ReadAllBytes($path)
# Search for the bytes corresponding to "<h3>" (3C 68 33 3E)
for ($i = 0; $i -lt $bytes.Length - 4; $i++) {
    if ($bytes[$i] -eq 0x3C -and $bytes[$i+1] -eq 0x68 -and $bytes[$i+2] -eq 0x33 -and $bytes[$i+3] -eq 0x3E) {
        # Print the next 50 bytes as hex and as chars
        $chunk = $bytes[$i..($i+60)]
        $hex = ($chunk | ForEach-Object { '{0:X2}' -f $_ }) -join ' '
        $chars = ""
        foreach ($b in $chunk) {
            if ($b -ge 32 -and $b -le 126) { $chars += [char]$b } else { $chars += "." }
        }
        Write-Host "Position: $i"
        Write-Host "Hex:   $hex"
        Write-Host "Chars: $chars"
        Write-Host ""
    }
}
