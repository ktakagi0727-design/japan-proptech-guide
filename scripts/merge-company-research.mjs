import { readFile, readdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dataDir = join(root, "data");
const scratchDir = join(root, "scratch");
const companiesPath = join(dataDir, "companies-detail.json");

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (quoted) {
      if (char === '"' && next === '"') {
        value += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        value += char;
      }
    } else if (char === '"') {
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

async function readJson(path) {
  return JSON.parse((await readFile(path, "utf8")).replace(/^\uFEFF/, ""));
}

async function readCases() {
  const rows = parseCsv((await readFile(join(dataDir, "cases.csv"), "utf8")).replace(/^\uFEFF/, ""));
  const [headers, ...values] = rows;
  return values.map((row) => Object.fromEntries(
    headers.map((header, index) => [header, row[index] || ""])
  ));
}

const scratchFiles = await readdir(scratchDir);
const researchFiles = scratchFiles
  .filter((name) => /^batch\d+_[a-z]\.json$/i.test(name))
  .sort();
const otherToolsFiles = scratchFiles
  .filter((name) => /^other_tools_batch\d+\.json$/i.test(name))
  .sort();

const companies = await readJson(companiesPath);
const companyBySlug = new Map(companies.map((company) => [company.slug, company]));
let addedCompanies = 0;
let updatedCompanies = 0;

for (const file of researchFiles) {
  const researchItems = await readJson(join(scratchDir, file));
  for (const research of researchItems) {
    const existing = companyBySlug.get(research.slug);
    const merged = {
      ...(existing || {}),
      ...research,
      tools: existing?.tools || research.tools || [],
      related_companies: existing?.related_companies || research.related_companies
    };

    if (existing) {
      Object.assign(existing, merged);
      updatedCompanies += 1;
    } else {
      companies.push(merged);
      companyBySlug.set(merged.slug, merged);
      addedCompanies += 1;
    }
  }
}

const otherToolsBySlug = new Map();
for (const file of otherToolsFiles) {
  const items = await readJson(join(scratchDir, file));
  items.forEach((item) => otherToolsBySlug.set(item.slug, item.other_tools || []));
}

for (const company of companies) {
  if (otherToolsBySlug.has(company.slug)) {
    company.other_tools = otherToolsBySlug.get(company.slug);
  }
}

const cases = await readCases();
const casesByCompany = new Map();
for (const item of cases) {
  if (!casesByCompany.has(item.adopter)) casesByCompany.set(item.adopter, []);
  casesByCompany.get(item.adopter).push(item);
}

let addedToolRelations = 0;
let enrichedToolRelations = 0;

for (const company of companies) {
  const companyCases = casesByCompany.get(company.company) || [];
  company.tools ||= [];

  for (const item of companyCases) {
    let tool = company.tools.find((candidate) => candidate.name === item.service);
    if (!tool) {
      tool = {
        name: item.service,
        intro_date: "要確認",
        official_url: item.url
      };
      company.tools.push(tool);
      addedToolRelations += 1;
    }

    Object.assign(tool, {
      provider: item.provider,
      process: item.process,
      tasks: item.tasks ? item.tasks.split("|").filter(Boolean) : [],
      summary: item.summary,
      official_url: tool.official_url || item.url
    });
    enrichedToolRelations += 1;
  }
}

await writeFile(companiesPath, `${JSON.stringify(companies, null, 2)}\n`, "utf8");

console.log(JSON.stringify({
  researchFiles,
  otherToolsFiles,
  totalCompanies: companies.length,
  addedCompanies,
  updatedCompanies,
  addedToolRelations,
  enrichedToolRelations
}, null, 2));
