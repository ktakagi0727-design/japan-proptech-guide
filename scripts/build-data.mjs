import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dataDir = join(root, "data");
const siteUrl = "https://japan-proptech-guide.com";
const today = new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
const processOrder = ["不動産売却", "不動産仲介", "不動産購入", "不動産開発/不動産運用"];
const processLabels = {
  "不動産売却": "売却",
  "不動産仲介": "仲介",
  "不動産購入": "購入",
  "不動産開発/不動産運用": "開発/運用"
};

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
  "comparisonPoints",
  "body",
  "flowSteps",
  "keywords",
  "relatedServices",
  "sourceUrls"
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
  const normalizedHeaders = headers.map((header) => header.replace(/^\uFEFF/, ""));
  return rows.map((row) => {
    const item = {};
    normalizedHeaders.forEach((header, index) => {
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
  cases: await readCsv("cases.csv"),
  columns: await readCsv("columns.csv"),
  columnSources: await readCsv("column-sources.csv")
};

const escapeHtml = (value = "") => value.toString()
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#39;");

const escapeAttr = escapeHtml;
const slug = (value) => value.toLowerCase().replace(/[^a-z0-9ぁ-んァ-ヶ一-龠]+/g, "-").replace(/^-|-$/g, "");
const listItems = (items = []) => items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
const pillList = (items = [], className = "pill") => items.map((item) => `<span class="${className}">${escapeHtml(item)}</span>`).join("");
const serviceUrl = (item) => `services/${slug(item.service)}/`;
const columnUrl = (item) => `columns/${slug(item.title)}/`;
const serviceByName = (name) => data.services.find((service) => service.service === name);
const serviceCases = (service) => data.cases.filter((item) => item.service === service.service || item.provider === service.company);
const columnSourcesFor = (column) => data.columnSources.filter((source) => source.process === column.process && source.task === column.task);
const sourceLinksFor = (column) => {
  const sources = columnSourcesFor(column);
  const byUrl = new Map(sources.map((source) => [source.url, source]));
  return [...new Set([...(column.sourceUrls || []), ...sources.map((source) => source.url)])]
    .map((url) => byUrl.get(url) || { title: url.replace(/^https?:\/\//, ""), source: "参考リンク", url });
};

function fieldChecklist(item) {
  const checks = {
    "売却目的整理": ["売却理由、希望時期、手残り、社内意思決定者を最初に分けて整理する", "価格優先、スピード優先、秘匿性優先など、譲れない条件を明文化する", "検討中に条件が変わった場合の承認ルートと判断基準を決めておく"],
    "物件情報整理": ["登記、図面、賃貸借、修繕、遵法性、収支資料の所在を一覧化する", "確認済み、未確認、追加取得が必要な資料を分けて管理する", "買主や仲介会社へ出す資料と社内限りの資料を分ける"],
    "権利関係確認": ["所有者、共有者、抵当権、仮登記、差押えなど権利部の論点を一覧化する", "境界標、越境、私道、通行掘削承諾など登記に表れにくい論点を現地で確認する", "抹消、承諾取得、覚書締結など決済前に必要な手続きを逆算する"],
    "売却価格査定": ["売出価格、成約想定価格、早期売却価格を分けて管理する", "取引事例比較、収益還元、原価、AI査定などの根拠を使ったか明示する", "価格改定の条件を、期間、反響、買付状況、競合状況で決めておく"],
    "物件概要書作成": ["面積、価格、法令制限、収益情報は根拠資料と照合してから記載する", "確認済み事項と確認中事項を分け、後続DDで争点化しそうな事項を隠さない", "価格変更や空室状況変更に備えて版管理と更新日を残す"],
    "販売資料作成": ["買主属性ごとに、収益、開発余地、利用条件、立地訴求の優先順位を変える", "広告表示や取引条件、根拠のない表現が混ざっていないか確認する", "共通資料、NDA後資料、追加DD資料を分けて開示する"],
    "媒介契約": ["契約形態だけでなく、広告可否、NDA、買主候補の重複管理を決める", "活動報告の項目と頻度を媒介契約前にすり合わせる", "価格改定や販売先変更の判断タイミングを事前に置く"],
    "売却活動管理": ["資料請求、NDA、内覧、買付、辞退理由を買主候補ごとに残す", "辞退理由を価格、収支、権利、融資、用途、社内判断に分類する", "売主報告では活動量だけでなく次の打ち手を明記する"],
    "初回ヒアリング": ["表面的な希望条件だけでなく、背景、期限、資金、意思決定者を確認する", "必須条件と希望条件を分け、譲れる条件を明確にする", "次回提案で使う資料、査定、個別物件、確認事項へ落とし込む"],
    "物件調査": ["登記、現地、役所調査の差分を一覧化する", "境界、越境、接道、インフラ、法令制限、ハザードを根拠資料と紐づける", "事実、判断、未確認事項を分け、重説や買主質問へ転用しやすくする"],
    "重要事項説明": ["説明事項の根拠資料を案件フォルダ内で追える状態にする", "越境、境界、法令制限、インフラ、契約制限など紛争化しやすい事項を重点確認する", "IT重説では承諾、本人確認、通信状態、質疑応答の記録を残す"],
    "売買契約": ["DDや調査で見つかった論点が特約、表明保証、前提条件に反映されているか確認する", "境界、越境、通行、配管承諾、期限、賃貸借承継を容認事項として整理する", "決済時に必要な抹消、承諾、引渡書類、精算項目を逆算する"],
    "ソーシング": ["情報源、紹介者、接触履歴、断られた理由を案件ごとに記録する", "取得方針に合わない理由も残し、再接触や条件変更時に使える情報にする", "登記簿異動、建築計画、既存オーナー情報など複数の入口を組み合わせる"],
    "価格妥当性確認": ["売主提示価格をNOI、Cap Rate、空室、修繕、出口価格に分解する", "価格調整が必要なリスクと、契約条件で処理すべきリスクを分ける", "標準、保守、上振れ価格のレンジで買付判断を説明できるようにする"],
    "DD管理": ["未提出資料、未回答質問、専門家コメント、契約反映状況を一つの論点表で追う", "法務、物理、経済、環境、テナントDDの担当と期限を明確にする", "リスクを発見しただけで止めず、価格、条件、撤退判断へ反映する"],
    "買付提出": ["買付価格だけでなく、DD期間、融資、契約希望日、前提条件を明記する", "社内承認の範囲を確認し、買付後に条件変更が多発しないようにする", "売主が見る実行確度、決済時期、条件の少なさも意識する"],
    "事業収支作成": ["賃料、工事費、金利、出口Cap Rateなど感度の高い前提を分ける", "前提の出典、取得日、更新責任者を残す", "標準、保守、楽観ケースを作り、投資判断が変わる条件を確認する"],
    "PM/BM管理": ["クレーム、修繕、滞納、入退去をNOIや出口価格に影響する情報として管理する", "月次レポートでは前月差異、判断事項、未解決リスクを明確にする", "PM、BM、AM、所有者、会計の役割分担を文書化する"],
    "修繕計画": ["法定点検、現地報告、修繕履歴、保証書、写真をまとめて管理する", "計画修繕と突発修繕を分け、CAPEXとNOIへの影響を確認する", "売却やリファイナンス時に説明できるよう、実施理由と効果を残す"]
  };
  return checks[item.task] || ["後続工程で使う判断材料を意識して資料を残す", "確認済み、未確認、専門家確認待ちを分ける", "価格、契約条件、説明資料へ反映する論点を明確にする"];
}

function caseInsight(service, relatedCases) {
  if (!relatedCases.length) {
    return "公開されている導入事例は確認できていません。導入検討時は、提供会社へ同種業務や同規模企業での利用実績を確認してください。";
  }
  const adopters = relatedCases.slice(0, 4).map((item) => item.adopter).join("、");
  return `${adopters}${relatedCases.length > 4 ? "など" : ""}の公開事例があり、${service.service}は${service.processes.join("、")}の業務で使われています。`;
}

function sectionParts(section) {
  const [heading, ...rest] = section.split("::");
  return { heading: heading || "本文", body: rest.join("::") || section };
}

function pageShell({ title, description, canonical, body, structuredData = [] }) {
  return `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeAttr(description)}">
    <meta name="robots" content="index,follow,max-image-preview:large">
    <meta property="og:title" content="${escapeAttr(title)}">
    <meta property="og:description" content="${escapeAttr(description)}">
    <meta property="og:type" content="article">
    <meta property="og:image" content="../../assets/proptech-hero.png">
    <meta property="og:url" content="${escapeAttr(canonical)}">
    <link rel="canonical" href="${escapeAttr(canonical)}">
    <link rel="icon" href="../../assets/favicon.svg" type="image/svg+xml">
    <link rel="stylesheet" href="../../style.css">
    ${structuredData.map((item) => `<script type="application/ld+json">${JSON.stringify(item)}</script>`).join("\n    ")}
  </head>
  <body class="detail-page">
    <header class="site-header scrolled">
      <a class="brand" href="../../index.html#top" aria-label="不動産売買向けプロップテックガイド">
        <span class="brand-mark">RE</span>
        <span>売買PropTech Guide</span>
      </a>
      <nav class="nav" aria-label="主要ナビゲーション">
        <a href="../../index.html#services">業務プロセス</a>
        <a href="../../index.html#cases">導入事例</a>
        <a href="../../index.html#columns">業務コラム</a>
        <a href="../../index.html#news">ニュース</a>
      </nav>
    </header>
    <main class="detail-main">
      <section class="section detail-section">
        ${body}
      </section>
    </main>
    <footer class="footer">
      <p>不動産売買向けプロップテックサービスガイド</p>
      <p>掲載内容は公開情報をもとにした調査メモです。導入判断では各社の最新条件を確認してください。</p>
    </footer>
  </body>
</html>
`;
}

function servicePage(service) {
  const relatedCases = serviceCases(service);
  const canonical = `${siteUrl}/${serviceUrl(service)}`;
  const title = `${service.service} | ${service.company} | 不動産売買向けプロップテックガイド`;
  const description = `${service.service}は${service.company}が提供する法人向け不動産テックサービスです。対象業務、主なターゲット、課題、機能、導入事例を整理。`;
  const caseLinks = relatedCases.slice(0, 10).map((item) => `<a href="${escapeAttr(item.url)}" target="_blank" rel="noreferrer">${escapeHtml(item.adopter)}の導入事例</a>`).join("");
  const body = `
    <a class="back-link" href="../../index.html#services">Service Directoryへ戻る</a>
    <article class="service-detail-card">
      <div class="detail-hero compact">
        <div class="logo-badge">${escapeHtml(service.logoText || service.service.slice(0, 2))}</div>
        <div>
          <p class="eyebrow">Service Detail</p>
          <h1>${escapeHtml(service.service)}</h1>
          <p class="provider">提供会社：${escapeHtml(service.company)}</p>
          <p>${escapeHtml(service.description)}</p>
          <a class="primary-action" href="${escapeAttr(service.url)}" target="_blank" rel="noreferrer">公式サイト</a>
        </div>
      </div>
      <section class="detail-block">
        <h2>サマリー</h2>
        <p>${escapeHtml(service.summary || service.description)}</p>
      </section>
      <section class="detail-block">
        <h2>主なターゲット</h2>
        <div class="detail-grid">
          <div><h3>業種・職種</h3><ul>${listItems([...(service.targetIndustries || []), ...(service.targetRoles || [])])}</ul></div>
          <div><h3>対象業務</h3><ul>${listItems([...(service.processes || []), ...(service.tasks || [])])}</ul></div>
          <div><h3>分類・アセット</h3><div class="service-meta">${pillList([...(service.tags || []), ...(service.assetTypes || [])])}</div></div>
        </div>
      </section>
      <section class="detail-block"><h2>課題</h2><ul>${listItems(service.painPoints)}</ul></section>
      <section class="detail-block"><h2>解決策・提供機能</h2><ul>${listItems(service.solutions)}</ul></section>
      <section class="detail-block"><h2>導入後の効果</h2><ul>${listItems(service.effects)}</ul></section>
      <section class="detail-block">
        <h2>導入事例から見える使われ方</h2>
        <p>${escapeHtml(caseInsight(service, relatedCases))}</p>
        <div class="case-link-list">${caseLinks || "<span>公開導入事例は未確認です。</span>"}</div>
      </section>
    </article>`;
  return pageShell({
    title,
    description,
    canonical,
    body,
    structuredData: [{
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: service.service,
      applicationCategory: "BusinessApplication",
      description,
      url: service.url,
      provider: { "@type": "Organization", name: service.company }
    }]
  });
}

function columnPage(column) {
  const canonical = `${siteUrl}/${columnUrl(column)}`;
  const title = `${column.title} | 業務コラム | 不動産売買向けプロップテックガイド`;
  const description = `${column.task}に関する不動産会社向け実務コラム。業務の流れ、確認ポイント、関連する不動産テックサービスを整理。`;
  const sections = (column.body || []).map(sectionParts);
  const relatedLinks = (column.relatedServices || []).map((name) => {
    const service = serviceByName(name);
    return service ? `<a class="column-service-link" href="../../${serviceUrl(service)}index.html">${escapeHtml(service.service)}</a>` : "";
  }).filter(Boolean).join("");
  const sources = sourceLinksFor(column);
  const body = `
    <a class="back-link" href="../../index.html#columns">業務コラムへ戻る</a>
    <article class="column-detail-article">
      <div class="column-detail-hero">
        <div class="column-hero-copy">
          <p class="eyebrow">Business Column</p>
          <div class="column-card-head">
            <span class="pill process-pill">${escapeHtml(processLabels[column.process] || column.process)}</span>
            <span class="pill task-pill">${escapeHtml(column.task)}</span>
          </div>
          <h1>${escapeHtml(column.title)}</h1>
          <p class="detail-lead">${escapeHtml(column.lead)}</p>
        </div>
      </div>
      <section class="column-message"><p>${escapeHtml(column.message || column.lead)}</p></section>
      <section class="field-checklist">
        <p class="eyebrow">Field Checklist</p>
        <h2>確認ポイント</h2>
        <ul>${listItems(fieldChecklist(column))}</ul>
      </section>
      <section class="column-flow">
        <div class="section-heading"><p class="eyebrow">Workflow</p><h2>本業務の流れ</h2></div>
        <ol class="flow-diagram">${(column.flowSteps || []).map((step, index) => `<li><span>${String(index + 1).padStart(2, "0")}</span><strong>${escapeHtml(step)}</strong></li>`).join("")}</ol>
      </section>
      <section class="column-detail-body">
        <div class="section-heading"><p class="eyebrow">Guide</p><h2>手順ごとの進め方</h2></div>
        ${sections.map((section, index) => `<section class="column-step-section"><div class="step-number">${String(index + 1).padStart(2, "0")}</div><div><h3>${escapeHtml(section.heading)}</h3><p>${escapeHtml(section.body)}</p></div></section>`).join("")}
      </section>
      <section class="column-detail-tools">
        <h2>この業務で役に立ちそうなサービス</h2>
        <div>${relatedLinks || "<span>関連サービス未設定</span>"}</div>
      </section>
      <section class="column-detail-sources">
        <h2>参考リンク</h2>
        <ul>${sources.map((source) => `<li><a href="${escapeAttr(source.url)}" target="_blank" rel="noreferrer">${escapeHtml(source.title)}</a><span>${escapeHtml(source.source || "")}</span></li>`).join("")}</ul>
      </section>
    </article>`;
  return pageShell({
    title,
    description,
    canonical,
    body,
    structuredData: [{
      "@context": "https://schema.org",
      "@type": "Article",
      headline: column.title,
      description: column.lead,
      inLanguage: "ja",
      about: [column.process, column.task, ...(column.keywords || [])],
      mainEntityOfPage: canonical
    }]
  });
}

function sitemapXml() {
  const urls = [
    { loc: `${siteUrl}/`, priority: "1.0" },
    { loc: `${siteUrl}/tools.html`, priority: "0.9" },
    { loc: `${siteUrl}/band-tool.html`, priority: "0.9" },
    { loc: `${siteUrl}/noi-calculator.html`, priority: "0.8" },
    { loc: `${siteUrl}/dd-checklist.html`, priority: "0.8" },
    ...data.services.map((service) => ({ loc: `${siteUrl}/${serviceUrl(service)}`, priority: "0.8" })),
    ...data.columns.map((column) => ({ loc: `${siteUrl}/${columnUrl(column)}`, priority: "0.8" }))
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${today}</lastmod>
    <priority>${url.priority}</priority>
  </url>`).join("\n")}
</urlset>
`;
}

await writeFile(
  join(dataDir, "data.js"),
  `window.proptechData = ${JSON.stringify(data, null, 2)};\n`,
  "utf8"
);

for (const service of data.services) {
  const dir = join(root, "services", slug(service.service));
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, "index.html"), servicePage(service), "utf8");
}

for (const column of data.columns) {
  const dir = join(root, "columns", slug(column.title));
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, "index.html"), columnPage(column), "utf8");
}

await writeFile(join(root, "sitemap.xml"), sitemapXml(), "utf8");
