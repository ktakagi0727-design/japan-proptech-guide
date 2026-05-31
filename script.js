const ALL = "すべて";

const knowledgeMap = {
  "不動産売却": ["売却目的整理", "物件情報整理", "権利関係確認", "売却価格査定", "物件概要書作成", "帯替え", "仲介会社選定", "媒介契約", "売却活動管理", "契約・決済"],
  "不動産仲介": ["リード獲得", "初回ヒアリング", "売却提案", "物件調査", "物件概要書作成", "帯替え", "販売資料作成", "買主探索", "内見・案内", "重要事項説明", "売買契約", "決済・引渡し"],
  "不動産購入": ["取得方針策定", "ソーシング", "初期スクリーニング", "価格妥当性確認", "DD管理", "融資・稟議", "買付提出", "契約・クロージング"],
  "不動産開発/不動産運用": ["事業企画", "用途検討", "事業収支作成", "許認可・設計", "建設・改修管理", "リーシング", "PM/BM管理", "賃貸借契約管理", "修繕計画", "レポーティング", "売却出口戦略"]
};

const processes = [ALL, ...Object.keys(knowledgeMap)];
const allTasks = [...new Set(Object.values(knowledgeMap).flat())];
const serviceLimit = 8;
const caseLimit = 9;
const processOrder = ["不動産売却", "不動産仲介", "不動産購入", "不動産開発/不動産運用"];
const processLabels = {
  "不動産売却": "売却",
  "不動産仲介": "仲介",
  "不動産購入": "購入",
  "不動産開発/不動産運用": "開発/運用"
};

const { services, newsItems, cases } = window.proptechData;




let activeProcess = ALL;
let activeTask = ALL;
let activeProvider = ALL;
let activeAsset = ALL;
let activeIndustry = ALL;
let activeCaseTask = ALL;
let activeAdopter = ALL;
let newsPage = 1;
let serviceExpanded = false;
let caseExpanded = false;

const pageSize = 10;
const header = document.querySelector("[data-header]");
const processTabs = document.querySelector("[data-process-tabs]");
const taskTabs = document.querySelector("[data-task-tabs]");
const serviceGrid = document.querySelector("[data-service-grid]");
const searchInput = document.querySelector("[data-search]");
const providerFilter = document.querySelector("[data-provider-filter]");
const assetFilter = document.querySelector("[data-asset-filter]");
const operatorExclude = document.querySelector("[data-operator-exclude]");
const resultCount = document.querySelector("[data-result-count]");
const newsList = document.querySelector("[data-news-list]");
const newsPagination = document.querySelector("[data-news-pagination]");
const caseTabs = document.querySelector("[data-case-tabs]");
const caseTaskTabs = document.querySelector("[data-case-task-tabs]");
const adopterFilter = document.querySelector("[data-adopter-filter]");
const caseGrid = document.querySelector("[data-case-grid]");
const serviceMore = document.querySelector("[data-service-more]");
const caseMore = document.querySelector("[data-case-more]");
const caseResultCount = document.querySelector("[data-case-result-count]");
const detailTarget = document.querySelector("[data-service-detail]");

const normalize = (value) => value.toString().trim().toLowerCase();
const uniqueSorted = (items) => [...new Set(items)].sort((a, b) => a.localeCompare(b, "ja"));
const slug = (value) => value.toLowerCase().replace(/[^a-z0-9ぁ-んァ-ヶ一-龠]+/g, "-").replace(/^-|-$/g, "");
const companySortName = (value) => value.replace(/^株式会社/, "").replace(/株式会社$/, "").trim();
const orderedProcesses = (item) => processOrder.filter((process) => item.processes.includes(process));
const processTagHtml = (item) => orderedProcesses(item)
  .map((process) => `<span class="pill process-pill">${processLabels[process]}</span>`)
  .join("");
const operatorInfoLabel = "提供会社またはグループ会社が不動産実業を行っています";
const operatorInfoBadge = (item) => item.operatorNote
  ? `<span class="operator-info-badge" aria-label="${operatorInfoLabel}" title="${item.operatorNote}"><span class="operator-info-icon">i</span><span>不動産実業あり</span></span>`
  : "";
const caseInsight = (item, relatedCases) => {
  if (!relatedCases.length) return "";
  const tasks = uniqueSorted(relatedCases.flatMap((caseItem) => caseItem.tasks)).slice(0, 6).join("、");
  const industries = uniqueSorted(relatedCases.map((caseItem) => caseItem.industry)).slice(0, 4).join("、");
  return `主な用途は${tasks}です。${industries}の現場で、業務の標準化、情報共有、説明資料作成、確認工数の削減に使われています。`;
};
const listItems = (items) => (items || []).filter(Boolean).map((item) => `<li>${item}</li>`).join("");
const pillItems = (items, className = "") => (items || []).filter(Boolean).map((item) => `<span class="pill ${className}">${item}</span>`).join("");
const detailBlock = (title, items) => `
  <article class="detail-block">
    <h2>${title}</h2>
    <ul>${listItems(items)}</ul>
  </article>
`;
const targetBlock = (item) => `
  <article class="detail-block target-block">
    <h2>主なターゲット</h2>
    <h3>対象プロセス</h3>
    <div class="service-meta compact-meta">${processTagHtml(item)}</div>
    <h3>業種</h3>
    <div class="service-meta compact-meta">${pillItems(item.targetIndustries)}</div>
    <h3>職種</h3>
    <div class="service-meta compact-meta">${pillItems(item.targetRoles)}</div>
    <h3>業務</h3>
    <div class="service-meta compact-meta">${pillItems(item.targetUseCases, "task-pill")}</div>
    <h3>分類タグ</h3>
    <div class="service-meta compact-meta">${pillItems(item.tags)}</div>
    <h3>アセットタイプ</h3>
    <div class="service-meta compact-meta">${pillItems(item.assetTypes || [], "asset-pill")}</div>
  </article>
`;
const caseStudyBlock = (relatedCases, insight) => {
  if (!relatedCases.length) return "";
  return `
    <article class="detail-block case-insight-block">
      <h2>導入事例から見える使われ方</h2>
      ${insight ? `<p>${insight}</p>` : ""}
      <ul class="case-link-list">
        ${relatedCases.slice(0, 10).map((caseItem) => `<li><a href="${caseItem.url}" target="_blank" rel="noreferrer">${caseItem.adopter} / ${caseItem.service}</a></li>`).join("")}
      </ul>
    </article>
  `;
};

services.sort((a, b) => b.processes.length - a.processes.length || a.service.localeCompare(b.service, "ja"));
cases.sort((a, b) => companySortName(a.adopter).localeCompare(companySortName(b.adopter), "ja"));

function renderDetailPage() {
  if (!detailTarget) return false;
  const id = new URLSearchParams(window.location.search).get("id");
  const item = services.find((service) => slug(service.service) === id) || services[0];
  const relatedCases = cases.filter((caseItem) => caseItem.service === item.service || caseItem.provider === item.company);
  const insight = caseInsight(item, relatedCases);
  const summaryText = item.summary || item.description;
  document.title = `${item.service} | サービス詳細`;
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute("content", `${item.service}は${item.company}が提供する法人向け不動産テックサービスです。対象業務、タグ、導入事例、公式サイトを整理しています。`);
  }
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) {
    canonical.setAttribute("href", `https://japan-proptech-guide.netlify.app/service.html?id=${slug(item.service)}`);
  }
  detailTarget.innerHTML = `
    <a class="back-link" href="index.html#services">Service Directoryへ戻る</a>
    <div class="detail-hero">
      <span class="logo-badge detail-logo" aria-hidden="true">${item.logoText}</span>
      <div>
        <p class="eyebrow">Service Detail</p>
        <h1>${item.service} ${operatorInfoBadge(item)}</h1>
        <p class="provider">提供会社：${item.company}</p>
      </div>
    </div>
    <section class="decision-summary" aria-label="サービス概要">
      <div>
        <p class="eyebrow">Summary</p>
        <p class="detail-lead">${summaryText}</p>
      </div>
      <div class="summary-actions">
        <a class="primary-action detail-action" href="${item.url}" target="_blank" rel="noreferrer">公式サイトを開く</a>
      </div>
    </section>
    <div class="decision-grid">
      ${targetBlock(item)}
      ${detailBlock("よくある課題", item.painPoints)}
      ${detailBlock("解決策・主な機能", item.solutions)}
      ${detailBlock("導入後に期待できる効果", item.effects)}
      ${caseStudyBlock(relatedCases, insight)}
    </div>
    ${item.operatorNote ? `<p class="operator-note"><span class="operator-info-icon" aria-hidden="true">i</span>${item.operatorNote}</p>` : ""}
    <script type="application/ld+json">
      ${JSON.stringify({
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: item.service,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        provider: {
          "@type": "Organization",
          name: item.company
        },
        description: item.description,
        url: item.url
      })}
    </script>
  `;
  return true;
}

if (!renderDetailPage()) {

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 20);
});

function option(value) {
  return `<option value="${value}">${value}</option>`;
}

function button(label, active, className, dataName) {
  return `<button class="${className}${active ? " active" : ""}" type="button" data-${dataName}="${label}">${label}</button>`;
}

function matchesQuery(fields) {
  const query = normalize(searchInput.value || "");
  if (!query) return true;
  return normalize(fields.flat().join(" ")).includes(query);
}

const initialQuery = new URLSearchParams(window.location.search).get("q");
if (initialQuery && searchInput) {
  searchInput.value = initialQuery;
}

function renderProviderFilter() {
  providerFilter.innerHTML = [ALL, ...uniqueSorted(services.map((service) => service.company))].map(option).join("");
}

function renderAssetFilter() {
  assetFilter.innerHTML = [ALL, ...uniqueSorted(services.flatMap((service) => service.assetTypes || []))].map(option).join("");
}

function renderAdopterFilter() {
  adopterFilter.innerHTML = [ALL, ...uniqueSorted(cases.map((item) => item.adopter))].map(option).join("");
}

function tasksForActiveProcess() {
  return activeProcess === ALL ? allTasks : knowledgeMap[activeProcess] || [];
}

function renderProcessTabs() {
  processTabs.innerHTML = processes.map((process) => button(process, process === activeProcess, "filter", "process")).join("");
}

function renderTaskTabs() {
  const tasks = [ALL, ...tasksForActiveProcess()];
  if (!tasks.includes(activeTask)) activeTask = ALL;
  taskTabs.innerHTML = tasks.map((task) => button(task, task === activeTask, "filter task-filter", "task")).join("");
}

function serviceCard(item) {
  const detailUrl = `service.html?id=${slug(item.service)}`;
  const isLocalTool = item.url && ["tools.html", "band-tool.html", "noi-calculator.html", "dd-checklist.html"].some((path) => item.url.startsWith(path));
  const cardUrl = isLocalTool ? item.url : detailUrl;
  return `
    <a class="service-card" href="${cardUrl}">
      <div class="card-top">
        <div class="service-title">
          <span class="logo-badge" aria-hidden="true">${item.logoText}</span>
          <h3>${item.service}</h3>
        </div>
        ${operatorInfoBadge(item)}
      </div>
      <p class="provider">提供会社：${item.company}</p>
      <p>${item.description}</p>
      <div class="service-meta">
        ${processTagHtml(item)}
      </div>
    </a>
  `;
}

function filteredServices() {
  return services.filter((item) => {
    const processMatch = activeProcess === ALL || item.processes.includes(activeProcess);
    const taskMatch = activeTask === ALL || item.tasks.includes(activeTask);
    const providerMatch = activeProvider === ALL || item.company === activeProvider;
    const assetMatch = activeAsset === ALL || (item.assetTypes || []).includes(activeAsset);
    const operatorMatch = !operatorExclude?.checked || !item.operatorNote;
    const queryMatch = matchesQuery([item.service, item.company, item.processes, item.tasks, item.tags, item.assetTypes || [], item.description, item.operatorNote || ""]);
    return processMatch && taskMatch && providerMatch && assetMatch && operatorMatch && queryMatch;
  });
}

function renderServices() {
  const filtered = filteredServices();
  const visible = serviceExpanded ? filtered : filtered.slice(0, serviceLimit);
  resultCount.textContent = `${filtered.length}件の法人向け民間プロップテックサービスを表示中`;
  serviceGrid.innerHTML = visible.map(serviceCard).join("") || `<p class="empty">条件に一致するサービスがありません。</p>`;
  serviceMore.hidden = filtered.length <= serviceLimit;
  serviceMore.textContent = serviceExpanded ? "閉じる" : "もっと見る";
}

function filteredNewsItems() {
  return newsItems.filter((item) => matchesQuery([item.title, item.source, item.summary]));
}

function renderNews() {
  const sorted = [...filteredNewsItems()].sort((a, b) => b.date.localeCompare(a.date));
  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  newsPage = Math.min(newsPage, pageCount);
  const current = sorted.slice((newsPage - 1) * pageSize, newsPage * pageSize);

  newsList.innerHTML = current.map((item) => `
    <li class="news-item">
      <time datetime="${item.date}">${item.date}</time>
      <div>
        <h3><a href="${item.url}" target="_blank" rel="noreferrer">${item.title}</a></h3>
        <p>${item.summary}</p>
      </div>
      <span class="news-source">${item.source}</span>
    </li>
  `).join("") || `<li class="empty">条件に一致するニュースがありません。</li>`;

  newsPagination.innerHTML = Array.from({ length: pageCount }, (_, index) => {
    const page = index + 1;
    return `<button class="page-button${page === newsPage ? " active" : ""}" type="button" data-news-page="${page}">${page}</button>`;
  }).join("");
}

function renderCaseTabs() {
  caseTabs.innerHTML = processes.map((process) => button(process, process === activeIndustry, "case-tab", "industry")).join("");
}

function renderCaseTaskTabs() {
  const tasks = [ALL, ...(activeIndustry === ALL ? allTasks : knowledgeMap[activeIndustry] || [])];
  if (!tasks.includes(activeCaseTask)) activeCaseTask = ALL;
  caseTaskTabs.innerHTML = tasks.map((task) => button(task, task === activeCaseTask, "case-tab task-filter", "case-task")).join("");
}

function caseCard(item) {
  return `
    <a class="case-card" href="${item.url}" target="_blank" rel="noreferrer">
      <div class="card-top">
        <span class="tag">${item.industry}</span>
      </div>
      <h3>${item.adopter}</h3>
      <p class="provider">導入サービス：${item.service}</p>
      <p class="provider">提供会社：${item.provider}</p>
      <p>${item.summary}</p>
      <div class="service-meta">
        <span class="pill">${item.process}</span>
        ${item.tasks.map((task) => `<span class="pill task-pill">${task}</span>`).join("")}
      </div>
    </a>
  `;
}

function filteredCases() {
  return cases.filter((item) => {
    const industryMatch = activeIndustry === ALL || item.process === activeIndustry;
    const taskMatch = activeCaseTask === ALL || item.tasks.includes(activeCaseTask);
    const adopterMatch = activeAdopter === ALL || item.adopter === activeAdopter;
    const queryMatch = matchesQuery([item.industry, item.adopter, item.service, item.provider, item.process, item.tasks, item.summary]);
    return industryMatch && taskMatch && adopterMatch && queryMatch;
  });
}

function renderCases() {
  const filtered = filteredCases();
  const visible = caseExpanded ? filtered : filtered.slice(0, caseLimit);
  if (caseResultCount) {
    caseResultCount.textContent = `${filtered.length}件の導入事例を表示中`;
  }
  caseGrid.innerHTML = visible.map(caseCard).join("") || `<p class="empty">条件に一致する導入事例がありません。</p>`;
  if (caseMore) {
    caseMore.hidden = filtered.length <= caseLimit;
    caseMore.textContent = caseExpanded ? "閉じる" : "もっと見る";
  }
}

function renderAll() {
  renderServices();
  renderCases();
  renderNews();
}

processTabs.addEventListener("click", (event) => {
  const buttonEl = event.target.closest("[data-process]");
  if (!buttonEl) return;
  activeProcess = buttonEl.dataset.process;
  activeTask = ALL;
  serviceExpanded = false;
  renderProcessTabs();
  renderTaskTabs();
  renderServices();
});

taskTabs.addEventListener("click", (event) => {
  const buttonEl = event.target.closest("[data-task]");
  if (!buttonEl) return;
  activeTask = buttonEl.dataset.task;
  serviceExpanded = false;
  renderTaskTabs();
  renderServices();
});

searchInput.addEventListener("input", () => {
  newsPage = 1;
  serviceExpanded = false;
  caseExpanded = false;
  renderAll();
});

providerFilter.addEventListener("change", (event) => {
  activeProvider = event.target.value;
  serviceExpanded = false;
  renderServices();
});

assetFilter.addEventListener("change", (event) => {
  activeAsset = event.target.value;
  serviceExpanded = false;
  renderServices();
});

operatorExclude?.addEventListener("change", () => {
  serviceExpanded = false;
  renderServices();
});

serviceMore.addEventListener("click", () => {
  serviceExpanded = !serviceExpanded;
  renderServices();
});

caseMore?.addEventListener("click", () => {
  caseExpanded = !caseExpanded;
  renderCases();
});

newsPagination.addEventListener("click", (event) => {
  const buttonEl = event.target.closest("[data-news-page]");
  if (!buttonEl) return;
  newsPage = Number(buttonEl.dataset.newsPage);
  renderNews();
});

caseTabs.addEventListener("click", (event) => {
  const buttonEl = event.target.closest("[data-industry]");
  if (!buttonEl) return;
  activeIndustry = buttonEl.dataset.industry;
  activeCaseTask = ALL;
  caseExpanded = false;
  renderCaseTabs();
  renderCaseTaskTabs();
  renderCases();
});

caseTaskTabs.addEventListener("click", (event) => {
  const buttonEl = event.target.closest("[data-case-task]");
  if (!buttonEl) return;
  activeCaseTask = buttonEl.dataset.caseTask;
  caseExpanded = false;
  renderCaseTaskTabs();
  renderCases();
});

adopterFilter.addEventListener("change", (event) => {
  activeAdopter = event.target.value;
  caseExpanded = false;
  renderCases();
});

renderProviderFilter();
renderAssetFilter();
renderAdopterFilter();
renderProcessTabs();
renderTaskTabs();
renderCaseTabs();
renderCaseTaskTabs();
renderAll();
}
