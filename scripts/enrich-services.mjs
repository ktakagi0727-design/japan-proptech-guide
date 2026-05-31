import { readFile, writeFile } from "node:fs/promises";
import { dirname, join as joinPath } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dataDir = joinPath(root, "data");

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

    if (char === '"') quoted = true;
    else if (char === ",") {
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

const quote = (value) => {
  const text = String(value ?? "");
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
};

const splitList = (value) => value ? value.split("|").filter(Boolean) : [];
const uniq = (items) => [...new Set(items.filter(Boolean))];
const join = (items) => uniq(items).join("|");

function rolesFor(row) {
  const processes = splitList(row.processes);
  const tasks = splitList(row.tasks);
  const roles = [];
  if (processes.includes("不動産売却")) roles.push("売却担当", "媒介獲得担当", "アセット売却担当");
  if (processes.includes("不動産仲介")) roles.push("売買仲介営業", "営業企画", "契約担当");
  if (processes.includes("不動産購入")) roles.push("仕入担当", "投資検討担当", "審査担当");
  if (processes.includes("不動産開発/不動産運用")) roles.push("開発担当", "AM担当", "PM担当", "運用管理担当");
  if (tasks.some((task) => task.includes("契約"))) roles.push("契約事務", "法務・コンプライアンス担当");
  if (tasks.some((task) => task.includes("建設") || task.includes("修繕"))) roles.push("工事管理担当");
  return roles.length ? roles : ["不動産DX推進担当", "事業企画担当"];
}

function industriesFor(row) {
  const processes = splitList(row.processes);
  const assets = splitList(row.assetTypes);
  const industries = [];
  if (processes.includes("不動産仲介")) industries.push("売買仲介会社");
  if (processes.includes("不動産売却")) industries.push("不動産保有会社", "デベロッパー");
  if (processes.includes("不動産購入")) industries.push("買取再販会社", "不動産投資会社");
  if (processes.includes("不動産開発/不動産運用")) industries.push("AM会社", "PM会社", "不動産ファンド");
  if (assets.includes("物流施設")) industries.push("物流不動産会社");
  if (assets.includes("オフィス")) industries.push("オフィス仲介・管理会社");
  if (assets.includes("建設/工事")) industries.push("建設会社");
  return industries;
}

function painPointsFor(row) {
  const tasks = splitList(row.tasks);
  const tags = splitList(row.tags);
  const points = [];
  if (tasks.some((task) => task.includes("物件情報") || task.includes("ソーシング"))) points.push("物件情報や候補案件が分散し、検索・共有に時間がかかる");
  if (tasks.some((task) => task.includes("査定") || task.includes("価格"))) points.push("価格や収支の根拠を短時間で説明しづらい");
  if (tasks.some((task) => task.includes("契約") || task.includes("重要事項"))) points.push("契約書類、確認依頼、進捗管理が紙・メールに依存しやすい");
  if (tasks.some((task) => task.includes("販売資料") || task.includes("内見") || task.includes("帯替え"))) points.push("提案資料や内見準備が属人化し、顧客対応の品質に差が出る");
  if (tasks.some((task) => task.includes("PM") || task.includes("賃貸借") || task.includes("修繕"))) points.push("管理・工事・契約情報が分断され、二重入力や確認工数が発生する");
  if (tags.some((tag) => tag.includes("登記") || tag.includes("調査"))) points.push("登記・権利・周辺情報の調査に手作業が多く、抜け漏れ確認が重い");
  return points.length ? points : ["情報収集、社内共有、判断資料作成に手間がかかる", "担当者ごとに業務品質や判断基準がばらつきやすい"];
}

function effectsFor(row) {
  const tasks = splitList(row.tasks);
  const effects = ["情報共有と進捗確認をしやすくする", "判断材料を整理し、説明品質を高める"];
  if (tasks.some((task) => task.includes("契約"))) effects.push("紙・郵送・印紙・確認依頼に関わる負荷を減らす");
  if (tasks.some((task) => task.includes("査定") || task.includes("価格"))) effects.push("査定・価格検討のスピードと根拠説明を強化する");
  if (tasks.some((task) => task.includes("販売資料") || task.includes("物件概要書"))) effects.push("資料作成や提案準備を標準化する");
  if (tasks.some((task) => task.includes("PM") || task.includes("レポーティング"))) effects.push("運用データを蓄積し、レポーティングや改善検討に活用しやすくする");
  return effects;
}

function comparisonPointsFor(row) {
  const points = ["対象アセットと対応エリア", "既存CRM・物件管理・契約管理との連携可否", "データ更新頻度と出典", "料金体系とアカウント権限管理"];
  if (row.operatorNote) points.push("提供会社またはグループ会社の不動産実業との関係");
  return points;
}

function enriched(row) {
  const tasks = splitList(row.tasks);
  const tags = splitList(row.tags);
  return {
    ...row,
    summary: row.summary || row.description,
    targetIndustries: row.targetIndustries || join(industriesFor(row)),
    targetRoles: row.targetRoles || join(rolesFor(row)),
    targetUseCases: row.targetUseCases || join(tasks.slice(0, 8)),
    painPoints: row.painPoints || join(painPointsFor(row)),
    solutions: row.solutions || join([...tags.slice(0, 5), ...tasks.slice(0, 4)]),
    effects: row.effects || join(effectsFor(row)),
    comparisonPoints: row.comparisonPoints || join(comparisonPointsFor(row))
  };
}

const servicesPath = joinPath(dataDir, "services.csv");
const text = await readFile(servicesPath, "utf8");
const [headers, ...rows] = parseCsv(text);
const extraHeaders = [
  "summary",
  "targetIndustries",
  "targetRoles",
  "targetUseCases",
  "painPoints",
  "solutions",
  "effects",
  "comparisonPoints"
];
const nextHeaders = [...headers, ...extraHeaders.filter((header) => !headers.includes(header))];
const records = rows.map((row) => Object.fromEntries(headers.map((header, index) => [header, row[index] || ""]))).map(enriched);
const csv = [
  nextHeaders.join(","),
  ...records.map((record) => nextHeaders.map((header) => quote(record[header])).join(","))
].join("\n");

await writeFile(servicesPath, `${csv}\n`, "utf8");
