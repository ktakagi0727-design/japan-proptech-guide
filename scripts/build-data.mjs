import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dataDir = join(root, "data");

const listFields = new Set([
  "processes",
  "assetTypes",
  "tasks",
  "tags",
  "targetIndustries",
  "targetRoles",
  "targetUseCases",
  "painPoints",
  "solutions",
  "effects",
  "comparisonPoints"
]);
const optionalFields = new Set(["operatorNote"]);

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = "";
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (quoted) {
      if (char === '"' && next === '"') {
        value += '"';
        i += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        value += char;
      }
      continue;
    }

    if (char === '"') {
      quoted = true;
    } else if (char === ",") {
      row.push(value);
      value = "";
    } else if (char === "\n") {
      row.push(value);
      rows.push(row);
      row = [];
      value = "";
    } else if (char !== "\r") {
      value += char;
    }
  }

  if (value || row.length) {
    row.push(value);
    rows.push(row);
  }

  return rows.filter((items) => items.some((item) => item.trim()));
}

async function readCsv(name) {
  const text = await readFile(join(dataDir, name), "utf8");
  const [headers, ...rows] = parseCsv(text);
  return rows.map((row) => {
    const item = {};
    headers.forEach((header, index) => {
      const value = row[index] || "";
      if (listFields.has(header)) {
        item[header] = value ? value.split("|").filter(Boolean) : [];
      } else if (optionalFields.has(header)) {
        if (value) item[header] = value;
      } else {
        item[header] = value;
      }
    });
    return item;
  });
}

const data = {
  services: await readCsv("services.csv"),
  newsItems: await readCsv("news.csv"),
  cases: await readCsv("cases.csv")
};

await writeFile(
  join(dataDir, "data.js"),
  `window.proptechData = ${JSON.stringify(data, null, 2)};\n`,
  "utf8"
);
