import os
import csv
import urllib.request
import urllib.error
import re
import time
import ssl

# SSL証明書のエラーを回避するためのダミーコンテキスト
ssl_context = ssl._create_unverified_context()

# スクリプトは scripts/ フォルダ内に配置されるため、相対パスで1階層上を指定
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(SCRIPT_DIR, '../data/cases.csv')
SAVE_DIR = os.path.join(SCRIPT_DIR, '../cases/raw_sources')
ERROR_LOG_PATH = os.path.join(SAVE_DIR, 'download_error.log')

def clean_html(html_content):
    # 不要なタグとその中身を除去
    html_content = re.sub(r'<script[\s\S]*?</script>', '', html_content, flags=re.IGNORECASE)
    html_content = re.sub(r'<style[\s\S]*?</style>', '', html_content, flags=re.IGNORECASE)
    html_content = re.sub(r'<header[\s\S]*?</header>', '', html_content, flags=re.IGNORECASE)
    html_content = re.sub(r'<footer[\s\S]*?</footer>', '', html_content, flags=re.IGNORECASE)
    html_content = re.sub(r'<nav[\s\S]*?</nav>', '', html_content, flags=re.IGNORECASE)
    
    # すべてのタグを除去
    text = re.sub(r'<[\s\S]*?>', '', html_content)
    
    # 連続する改行や空白を整理
    text = re.sub(r'\n\s*\n', '\n\n', text)
    text = text.strip()
    return text

def download_cases():
    os.makedirs(SAVE_DIR, exist_ok=True)
    
    if not os.path.exists(CSV_PATH):
        print(f"Error: CSV file not found at {CSV_PATH}")
        return
        
    with open(CSV_PATH, mode='r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        rows = list(reader)
        
    print(f"Total cases to check: {len(rows)}")
    
    for idx, row in enumerate(rows, start=1):
        adopter = row['adopter']
        service = row['service']
        url = row['url']
        
        # ファイル名に使えない文字を除去
        safe_adopter = re.sub(r'[\\/*?:"<>|]', '_', adopter)
        safe_service = re.sub(r'[\\/*?:"<>|]', '_', service)
        
        filename = f"{idx:03d}_{safe_adopter}_{safe_service}.txt"
        filepath = os.path.join(SAVE_DIR, filename)
        
        # すでにダウンロード済みのデータがある場合はスキップ
        if os.path.exists(filepath) and os.path.getsize(filepath) > 100:
            print(f"[{idx}/{len(rows)}] Skipped (already exists): {filename}")
            continue
            
        if not url or not url.startswith('http'):
            print(f"[{idx}/{len(rows)}] Skipped (Invalid URL): {url}")
            continue
            
        print(f"[{idx}/{len(rows)}] Downloading: {url} -> {filename}")
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
        req = urllib.request.Request(url, headers=headers)
        
        try:
            with urllib.request.urlopen(req, timeout=10, context=ssl_context) as response:
                content_type = response.headers.get('Content-Type', '')
                
                # PDFの場合はバイナリでそのまま保存
                if 'application/pdf' in content_type or url.lower().endswith('.pdf'):
                    pdf_filepath = filepath.replace('.txt', '.pdf')
                    with open(pdf_filepath, 'wb') as out_f:
                        out_f.write(response.read())
                    print(f"  Saved as PDF: {pdf_filepath}")
                    with open(filepath, 'w', encoding='utf-8') as out_f:
                        out_f.write(f"[PDF FILE DOWNLOADED: {pdf_filepath}]\nURL: {url}")
                else:
                    charset = 'utf-8'
                    if 'charset=' in content_type.lower():
                        parts = content_type.split('charset=')
                        if len(parts) > 1:
                            charset = parts[-1].strip().split(';')[0]
                    
                    html_bytes = response.read()
                    try:
                        html_content = html_bytes.decode(charset, errors='replace')
                    except Exception:
                        html_content = html_bytes.decode('utf-8', errors='replace')
                        
                    clean_text = clean_html(html_content)
                    
                    with open(filepath, 'w', encoding='utf-8') as out_f:
                        out_f.write(f"URL: {url}\n\n" + clean_text)
                    print(f"  Successfully saved {len(clean_text)} chars.")
                    
        except Exception as e:
            err_msg = f"Error downloading {url}: {str(e)}"
            print(f"  [ERROR] {err_msg}")
            with open(ERROR_LOG_PATH, 'a', encoding='utf-8') as err_f:
                err_f.write(f"{idx:03d} | {adopter} | {service} | {url} | {str(e)}\n")
                
        # 相手サーバー負荷軽減のための3秒スリープ
        time.sleep(3)

if __name__ == '__main__':
    download_cases()
