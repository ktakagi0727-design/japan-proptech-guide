import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CSV_PATH = path.join(__dirname, '../data/cases.csv');
const SAVE_DIR = path.join(__dirname, '../cases/raw_sources');
const ERROR_LOG_PATH = path.join(SAVE_DIR, 'download_error.log');

// CSVパース関数（簡易的なもの。カンマとダブルクォートを適切に処理する）
function parseCSV(csvText) {
  const lines = csvText.split(/\r?\n/);
  if (lines.length === 0) return [];
  
  // ヘッダーの解析（BOMを除去）
  const firstLine = lines[0].replace(/^\uFEFF/, '');
  const headers = parseCSVLine(firstLine);
  const result = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const values = parseCSVLine(line);
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    result.push(row);
  }
  return result;
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  
  // ダブルクォートを除去
  return result.map(val => {
    if (val.startsWith('"') && val.endsWith('"')) {
      return val.slice(1, -1).replace(/""/g, '"');
    }
    return val;
  });
}

function cleanHTML(htmlContent) {
  // 不要なタグとその中身を除去
  let text = htmlContent;
  text = text.replace(/<script[\s\S]*?<\/script>/gi, '');
  text = text.replace(/<style[\s\S]*?<\/style>/gi, '');
  text = text.replace(/<header[\s\S]*?<\/header>/gi, '');
  text = text.replace(/<footer[\s\S]*?<\/footer>/gi, '');
  text = text.replace(/<nav[\s\S]*?<\/nav>/gi, '');
  
  // すべてのタグを除去
  text = text.replace(/<[\s\S]*?>/g, ' ');
  
  // 実体参照のデコード（簡易的なもの）
  text = text.replace(/&nbsp;/g, ' ');
  text = text.replace(/&lt;/g, '<');
  text = text.replace(/&gt;/g, '>');
  text = text.replace(/&amp;/g, '&');
  text = text.replace(/&quot;/g, '"');
  
  // 連続する空白・改行の整理
  text = text.replace(/\r/g, '');
  text = text.replace(/\n\s*\n/g, '\n\n');
  text = text.replace(/[ \t]+/g, ' ');
  text = text.trim();
  return text;
}

function downloadUrl(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: 15000,
      rejectUnauthorized: false // 証明書エラーを回避
    };
    
    const req = client.get(url, options, (res) => {
      // リダイレクトの処理
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const redirectUrl = new URL(res.headers.location, url).toString();
        resolve(downloadUrl(redirectUrl));
        return;
      }
      
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP status ${res.statusCode}`));
        return;
      }
      
      const contentType = res.headers['content-type'] || '';
      const isPdf = contentType.includes('application/pdf') || url.toLowerCase().endsWith('.pdf');
      
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve({ buffer, isPdf });
      });
    });
    
    req.on('error', (err) => reject(err));
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
  });
}

async function run() {
  if (!fs.existsSync(SAVE_DIR)) {
    fs.mkdirSync(SAVE_DIR, { recursive: true });
  }
  
  if (!fs.existsSync(CSV_PATH)) {
    console.error(`Error: CSV not found at ${CSV_PATH}`);
    return;
  }
  
  const csvText = fs.readFileSync(CSV_PATH, 'utf-8');
  const rows = parseCSV(csvText);
  console.log(`Total cases to check: ${rows.length}`);
  
  for (let i = 0; i < rows.length; i++) {
    const idx = i + 1;
    const row = rows[i];
    const adopter = row.adopter;
    const service = row.service;
    const url = row.url;
    
    if (!url || !url.startsWith('http')) {
      console.log(`[${idx}/${rows.length}] Skipped (Invalid URL): ${url}`);
      continue;
    }
    
    const safeAdopter = adopter.replace(/[\\/*?:"<>|]/g, '_');
    const safeService = service.replace(/[\\/*?:"<>|]/g, '_');
    const filename = `${String(idx).padStart(3, '0')}_${safeAdopter}_${safeService}.txt`;
    const filepath = path.join(SAVE_DIR, filename);
    
    // すでにファイルが存在する場合はスキップ
    if (fs.existsSync(filepath) && fs.statSync(filepath).size > 100) {
      console.log(`[${idx}/${rows.length}] Skipped (already exists): ${filename}`);
      continue;
    }
    
    console.log(`[${idx}/${rows.length}] Downloading: ${url} -> ${filename}`);
    
    try {
      const { buffer, isPdf } = await downloadUrl(url);
      
      if (isPdf) {
        const pdfFilepath = filepath.replace('.txt', '.pdf');
        fs.writeFileSync(pdfFilepath, buffer);
        fs.writeFileSync(filepath, `[PDF FILE DOWNLOADED: ${pdfFilepath}]\nURL: ${url}`);
        console.log(`  Saved as PDF: ${pdfFilepath}`);
      } else {
        const html = buffer.toString('utf-8');
        const text = cleanHTML(html);
        fs.writeFileSync(filepath, `URL: ${url}\n\n${text}`);
        console.log(`  Successfully saved ${text.length} chars.`);
      }
    } catch (err) {
      console.error(`  [ERROR] ${err.message}`);
      fs.appendFileSync(ERROR_LOG_PATH, `${String(idx).padStart(3, '0')} | ${adopter} | ${service} | ${url} | ${err.message}\n`);
    }
    
    // 3秒スリープ
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  console.log("Done downloading all cases.");
}

run();
