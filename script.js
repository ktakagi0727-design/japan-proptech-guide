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
const columnLimit = 6;
const processOrder = ["不動産売却", "不動産仲介", "不動産購入", "不動産開発/不動産運用"];
const processLabels = {
  "不動産売却": "売却",
  "不動産仲介": "仲介",
  "不動産購入": "購入",
  "不動産開発/不動産運用": "開発/運用"
};

const { services, newsItems, cases, columns = [], columnSources = [] } = window.proptechData;




let activeProcess = ALL;
let activeTask = ALL;
let activeProvider = ALL;
let activeAsset = ALL;
let activeIndustry = ALL;
let activeCaseTask = ALL;
let activeAdopter = ALL;
let activeColumnProcess = ALL;
let activeColumnTask = ALL;
let newsPage = 1;
let serviceExpanded = false;
let caseExpanded = false;
let columnExpanded = false;

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
const columnTabs = document.querySelector("[data-column-tabs]");
const columnTaskTabs = document.querySelector("[data-column-task-tabs]");
const columnGrid = document.querySelector("[data-column-grid]");
const columnMore = document.querySelector("[data-column-more]");
const columnResultCount = document.querySelector("[data-column-result-count]");
const detailTarget = document.querySelector("[data-service-detail]");
const columnDetailTarget = document.querySelector("[data-column-detail]");

const normalize = (value) => value.toString().trim().toLowerCase();
const uniqueSorted = (items) => [...new Set(items)].sort((a, b) => a.localeCompare(b, "ja"));
const slug = (value) => value.toLowerCase().replace(/[^a-z0-9ぁ-んァ-ヶ一-龠]+/g, "-").replace(/^-|-$/g, "");
const companySortName = (value) => value.replace(/^株式会社/, "").replace(/株式会社$/, "").trim();
const serviceByName = (name) => services.find((service) => service.service === name);
const columnUrl = (item) => `column.html?id=${slug(item.title)}`;
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
columns.sort((a, b) => processOrder.indexOf(a.process) - processOrder.indexOf(b.process) || a.task.localeCompare(b.task, "ja") || a.title.localeCompare(b.title, "ja"));

function renderDetailPage() {
  if (!detailTarget) return false;
  const id = new URLSearchParams(window.location.search).get("id");
  const item = services.find((service) => slug(service.service) === id) || services[0];
  const relatedCases = cases.filter((caseItem) => caseItem.service === item.service || caseItem.provider === item.company);
  const insight = caseInsight(item, relatedCases);
  const summaryText = item.summary || item.description;
  document.title = `${item.service} | ${item.company} | 不動産売買向けプロップテックガイド`;
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute("content", `${item.service}は${item.company}が提供する法人向け不動産テックサービスです。対象業務、タグ、導入事例、公式サイトを整理しています。`);
  }
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) {
    ogTitle.setAttribute("content", `${item.service} | ${item.company} | 不動産売買向けプロップテックガイド`);
  }
  const ogDescription = document.querySelector('meta[property="og:description"]');
  if (ogDescription) {
    ogDescription.setAttribute("content", `${item.service}の対象業務、主なターゲット、課題、機能、導入事例を整理。`);
  }
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) {
    canonical.setAttribute("href", `https://japan-proptech-guide.com/service.html?id=${slug(item.service)}`);
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

function columnSourcesFor(item) {
  return columnSources.filter((source) => source.process === item.process && source.task === item.task);
}

function relatedServiceLinks(item) {
  return (item.relatedServices || []).map((name) => {
    const service = serviceByName(name);
    if (!service) return "";
    return `<a class="column-service-link" href="service.html?id=${slug(service.service)}">${service.service}</a>`;
  }).filter(Boolean).join("");
}

function sourceLinksFor(item) {
  const sources = columnSourcesFor(item);
  const byUrl = new Map(sources.map((source) => [source.url, source]));
  const urls = [...new Set([...(item.sourceUrls || []), ...sources.map((source) => source.url)])];
  return urls.map((url) => byUrl.get(url) || {
    title: url.replace(/^https?:\/\//, ""),
    source: "参考リンク",
    url
  });
}

function sectionParts(section) {
  const [heading, ...rest] = section.split("::");
  return {
    heading: heading || "本文",
    body: rest.join("::") || section
  };
}

function visualTitle(item) {
  const titles = {
    "売却目的整理": "売却方針メモ",
    "物件情報整理": "資料台帳",
    "権利関係確認": "権利確認シート",
    "売却価格査定": "査定レンジ表",
    "物件概要書作成": "物件概要書",
    "販売資料作成": "販売図面",
    "媒介契約": "媒介・活動管理",
    "売却活動管理": "買主候補リスト",
    "仲介会社選定": "比較評価シート",
    "物件調査": "物件調査メモ",
    "初回ヒアリング": "ヒアリングシート",
    "重要事項説明": "重説準備リスト",
    "売買契約": "契約条件表",
    "ソーシング": "案件発掘マップ",
    "価格妥当性確認": "価格検証シート",
    "DD管理": "DD論点管理表",
    "買付提出": "買付条件書",
    "事業収支作成": "事業収支モデル",
    "PM/BM管理": "月次運用レポート",
    "修繕計画": "修繕計画表"
  };
  return titles[item.task] || "業務成果物";
}

function visualKind(item) {
  if (["物件情報整理", "権利関係確認", "物件調査", "ソーシング"].includes(item.task)) return "map";
  if (["売却価格査定", "価格妥当性確認", "事業収支作成", "PM/BM管理"].includes(item.task)) return "dashboard";
  if (["媒介契約", "売買契約", "重要事項説明", "買付提出"].includes(item.task)) return "contract";
  if (["売却活動管理", "仲介会社選定"].includes(item.task)) return "board";
  if (["初回ヒアリング"].includes(item.task)) return "interview";
  if (["修繕計画"].includes(item.task)) return "maintenance";
  return "document";
}

function visualArt(kind, item) {
  const keywords = (item.keywords || []).slice(0, 4);
  const labelHtml = keywords.map((keyword) => `<span>${keyword}</span>`).join("");
  const variants = {
    document: `
      <div class="mock-page">
        <div class="mock-hero"></div>
        <div class="mock-lines"><span></span><span></span><span></span></div>
        <div class="mock-grid"><span></span><span></span><span></span><span></span></div>
      </div>
      <div class="mock-caption">${labelHtml}</div>
    `,
    map: `
      <div class="mock-map">
        <span class="road a"></span><span class="road b"></span><span class="road c"></span>
        <span class="pin p1"></span><span class="pin p2"></span><span class="pin p3"></span>
      </div>
      <div class="mock-side-panel">
        <b>${item.task}</b>
        <span></span><span></span><span></span>
      </div>
    `,
    dashboard: `
      <div class="mock-kpis"><span></span><span></span><span></span></div>
      <div class="mock-chart"><i></i><i></i><i></i><i></i><i></i></div>
      <div class="mock-caption">${labelHtml}</div>
    `,
    contract: `
      <div class="mock-contract">
        <span></span><span></span><span></span><span></span>
        <strong></strong>
      </div>
      <div class="mock-stamp">済</div>
      <div class="mock-caption">${labelHtml}</div>
    `,
    board: `
      <div class="mock-board">
        <section><b>候補</b><span></span><span></span></section>
        <section><b>確認中</b><span></span><span></span></section>
        <section><b>判断</b><span></span><span></span></section>
      </div>
      <div class="mock-caption">${labelHtml}</div>
    `,
    interview: `
      <div class="mock-profile"></div>
      <div class="mock-bubbles"><span></span><span></span><span></span></div>
      <div class="mock-caption">${labelHtml}</div>
    `,
    maintenance: `
      <div class="mock-building">
        <span></span><span></span><span></span><span></span><span></span><span></span>
      </div>
      <div class="mock-timeline"><i></i><i></i><i></i><i></i></div>
      <div class="mock-caption">${labelHtml}</div>
    `
  };
  return variants[kind] || variants.document;
}

function columnVisual(item) {
  return "";
}

function expertInsight(item) {
  const notes = {
    "売却目的整理": "売却目的が曖昧な案件ほど、買付が入ってから社内判断が止まりやすくなります。高く売りたい、早く売りたい、秘密に進めたい、既存テナントへ配慮したいという希望は、実務ではしばしば衝突します。最初の段階で、経営上の目的、会計・税務上の制約、売却期限、許容できる情報開示範囲を整理しておくと、仲介会社の提案や買主候補の絞り込みも具体的になります。",
    "物件情報整理": "資料整理で大切なのは、資料を集めることそのものではなく、資料間の不整合を見つけることです。登記、図面、固定資産税資料、賃貸借契約、レントロール、修繕履歴は、それぞれ作成目的も更新時点も異なります。面積、用途、賃料、契約期間、修繕履歴の数字がずれている場合は、売却資料に載せる前に根拠を確認しておく必要があります。",
    "権利関係確認": "権利関係は、契約直前に見つかると最も痛い論点の一つです。抵当権や共有だけでなく、私道、通行承諾、越境、未登記建物、借地借家関係などは、価格交渉や決済条件に直結します。登記上の情報と現地利用の実態を分けて確認し、専門家へ渡す論点を早めに一覧化しておくことが、後工程の手戻りを減らします。",
    "売却価格査定": "査定額は高ければよいわけではありません。確認すべきなのは、査定額の根拠、売出価格と成約想定価格の違い、価格改定のタイミングです。特に収益不動産では、表面利回りだけでなく、NOI、空室率、修繕見込み、テナント契約の安定性を見ないと、買主側の価格目線とずれます。",
    "物件概要書作成": "物件概要書は営業資料であると同時に、買主の初期DDの入口です。見栄えを優先して不利な情報を薄めると、後で買主からの信頼を落とします。価格、面積、権利、法令制限、収益情報、特記事項は、根拠資料を確認したうえで、確認済みと確認中を分けて記載するのが実務上は扱いやすいです。",
    "販売資料作成": "販売資料は、買主ごとに刺さる情報が変わります。デベロッパーには容積や用途、投資家にはNOIや賃貸借契約、事業会社には立地や利用条件が重要になります。一枚の資料に全情報を詰め込むより、共通資料と追加資料を分け、相手に応じて見せる順番を設計する方が商談は進みます。",
    "仲介会社選定": "仲介会社選びでは、査定額よりも売り方の解像度を見ます。誰に売るのか、どの順番で打診するのか、情報管理をどうするのか、断られた理由をどう報告するのか。ここまで語れる会社は、売却活動中の改善提案も具体的です。法人売却では、買主ネットワークと守秘対応の両方を確認することが重要です。",
    "媒介契約": "媒介契約は形式だけで選ぶものではありません。一般媒介で広く動かすのか、専任で情報管理と販売戦略を一本化するのかは、物件の性質と売主の事情で変わります。契約前に、広告可否、NDA、買主候補の重複管理、報告項目、価格改定の考え方まで決めておくと、媒介後の運用が安定します。",
    "売却活動管理": "売却活動は、問い合わせ件数を眺めるだけでは改善できません。どの買主に資料を出したか、どこで検討が止まったか、価格なのか、収支なのか、権利関係なのか、融資なのかを分類して残す必要があります。断られた理由こそ、価格改定や資料改善、ターゲット変更の材料になります。",
    "初回ヒアリング": "初回ヒアリングでは、顧客が最初に言う希望条件だけを信じすぎないことが大切です。背景、期限、資金、意思決定者、過去に検討した物件、嫌だった対応を聞くと、本当の制約が見えてきます。特に法人顧客では、相談者と決裁者が違うことが多いため、誰が最後に判断するのかを早めに確認します。",
    "物件調査": "物件調査では、資料、現地、役所の三つを突き合わせる姿勢が重要です。登記や図面だけで完結させると、現地の越境、道路扱い、増改築、利用実態を見落とします。調査結果は、事実、根拠資料、判断、未確認事項を分けて記録すると、重説作成や買主質問への対応がしやすくなります。",
    "重要事項説明": "重要事項説明は、書類を読む場ではなく、取引判断に影響する重要な事実を相手方が理解できるように説明する場です。電子化しても、調査根拠、説明資料、承諾、本人確認、質疑応答の記録は必要です。説明した事実だけでなく、なぜその説明に至ったかの根拠を残すことが重要です。",
    "売買契約": "売買契約では、調査で見つかった論点を契約条件に落とし込めているかが肝です。契約不適合責任、境界、越境、土壌、賃貸借承継、表明保証、解除条件は、後から揉めやすい項目です。口頭合意やメールのまま残さず、契約書、覚書、引渡書類にどう反映するかを確認します。",
    "ソーシング": "ソーシングは、案件数よりも記録の質がものを言います。誰が、いつ、どの所有者に、どの条件で接触し、なぜ見送ったのかが残っていれば、時間が経ってから再検討できます。属人的な人脈情報を組織の案件データに変えることが、継続的な仕入れ力につながります。",
    "価格妥当性確認": "価格妥当性を見るときは、売主希望価格を否定する材料探しにならないよう注意します。買主側としては、自社の投資基準、資金調達、保有方針、出口価格に照らして説明できる価格かを確認します。NOI、Cap Rate、修繕、空室、テナント退去リスクを一つずつ分解すると、交渉すべき条件が見えてきます。",
    "DD管理": "DDはチェックリストを埋める作業ではありません。発見したリスクを、価格調整、契約条項、引渡条件、買付撤回判断のどこに反映するかまで管理して初めて意味があります。未回答事項、専門家コメント、売主回答、契約反映状況を一つの論点表で追うと、投資委員会や稟議で説明しやすくなります。",
    "買付提出": "買付はスピードが大事ですが、軽く出すと信用を失います。価格、支払条件、融資、DD期間、契約希望日、前提条件を整理し、社内承認の範囲を確認してから出すべきです。売主は価格だけでなく、実行確度、決済時期、条件の少なさも見ています。",
    "事業収支作成": "事業収支は、楽観ケースを作るための表ではなく、どの前提が崩れると投資判断が変わるかを見る道具です。賃料、工事費、空室、金利、出口Cap Rateは特に感度が高い項目です。前提の出典と更新日を残しておくと、市況が変わったときにどこを直せばよいか分かります。",
    "PM/BM管理": "PM/BM管理では、現場対応と投資判断をつなぐことが重要です。クレーム、修繕、点検、入退去、滞納は、単なる管理記録ではなく、NOIや売却価格に影響する情報です。月次レポートでは、数字の羅列より、前月から変わったこと、判断が必要なこと、未解決リスクを明確にします。",
    "修繕計画": "修繕計画は、費用を先送りするかどうかの議論ではなく、建物価値と収益をどう維持するかの投資判断です。法定点検や現場報告だけでなく、修繕履歴、テナント影響、賃料維持、売却時の説明力まで見ます。計画修繕と突発修繕を分け、保有方針に合わせて優先順位を付けることが大切です。"
  };
  return notes[item.task] || "この業務では、手順をこなすだけでなく、後続工程で何の判断材料として使われるかを意識することが重要です。資料、判断、未確認事項を分けて残すと、担当者が変わっても業務品質を保ちやすくなります。";
}

function fieldChecklist(item) {
  const checks = {
    "売却目的整理": ["売却理由を、資金化、資産入替、撤退、ポートフォリオ見直しなどに分けて記録する", "価格最大化、早期成約、秘匿性、既存関係者への配慮の優先順位を決める", "社内承認者、税務・会計確認者、テナント対応者を早い段階で洗い出す"],
    "物件情報整理": ["登記、図面、税務資料、賃貸借契約、修繕履歴の作成日と出典を残す", "レントロールと契約書、PMレポート、入金実績の数字が一致しているか確認する", "買主開示用資料と社内確認用資料を分け、秘匿情報の混入を防ぐ"],
    "権利関係確認": ["所有者、共有者、抵当権、仮登記、差押えなど権利部の論点を一覧化する", "境界標、越境、私道、通行・掘削承諾など登記に表れにくい論点を現地で確認する", "抹消、承諾取得、覚書締結など決済前に必要な手続きを逆算する"],
    "売却価格査定": ["売出価格、成約想定価格、早期売却価格を分けて管理する", "取引事例比較、収益還元、原価、AI査定のどの根拠を使ったか明示する", "価格改定の条件を、期間、反響、買付状況、競合状況で決めておく"],
    "物件概要書作成": ["面積、価格、法令制限、収益情報は根拠資料と照合してから記載する", "確認済み事項と確認中事項を分け、後続DDで争点化しそうな事項を隠さない", "価格変更や空室状況変更に備えて版管理と更新日を残す"],
    "販売資料作成": ["買主属性ごとに、収益、開発余地、利用条件、立地訴求の優先順位を変える", "広告表示や取引態様、根拠のない表現が混ざっていないか確認する", "共通資料、NDA後資料、追加DD資料を分けて開示する"],
    "媒介契約": ["契約形態だけでなく、広告可否、NDA、買主候補の重複管理を決める", "活動報告の項目と頻度を媒介契約前にすり合わせる", "価格改定や販売先変更の判断タイミングを事前に置く"],
    "売却活動管理": ["資料請求、NDA、内覧、買付、辞退理由を買主候補ごとに残す", "辞退理由を価格、収支、権利、融資、用途、社内判断に分類する", "売主報告では活動量だけでなく次の打ち手を明記する"],
    "初回ヒアリング": ["表面的な希望条件だけでなく、背景、期限、資金、意思決定者を確認する", "必須条件と希望条件を分け、譲れる条件を明確にする", "次回提案で使う資料、査定、候補物件、確認事項へ落とし込む"],
    "物件調査": ["登記、現地、役所調査の差分を一覧化する", "境界、越境、道路、インフラ、法令制限、ハザードを根拠資料と紐づける", "事実、判断、未確認事項を分け、重説や買主質問へ転用しやすくする"],
    "重要事項説明": ["説明事項の根拠資料を案件フォルダ内で追える状態にする", "越境、境界、法令制限、インフラ、契約制限など紛争化しやすい事項を重点確認する", "IT重説では承諾、本人確認、通信状態、質疑応答の記録を残す"],
    "売買契約": ["DDや調査で見つかった論点が特約、表明保証、前提条件に反映されているか確認する", "境界、越境、通行・配管承諾、土壌、賃貸借承継を容認事項として整理する", "決済時に必要な抹消、承諾、引渡書類、精算項目を逆算する"],
    "ソーシング": ["情報源、紹介者、接触履歴、断られた理由を案件ごとに記録する", "取得方針に合わない理由も残し、再接触や条件変更時に使える情報にする", "登記異動、建築計画、既存オーナー情報など複数の入口を組み合わせる"],
    "価格妥当性確認": ["売主提示価格を、NOI、Cap Rate、空室、修繕、出口価格に分解する", "価格調整が必要なリスクと、契約条件で処理すべきリスクを分ける", "標準、保守、上限価格のレンジで買付判断を説明できるようにする"],
    "DD管理": ["未提出資料、未回答質問、専門家コメント、契約反映状況を一つの論点表で追う", "法務、物理、経済、環境、テナントDDの担当と期限を明確にする", "リスクを発見しただけで止めず、価格、条件、撤退判断へ反映する"],
    "買付提出": ["買付価格だけでなく、DD期間、融資、契約希望日、前提条件を明記する", "社内承認の範囲を確認し、買付後に条件変更が多発しないようにする", "売主が見る実行確度、決済時期、条件の少なさも意識する"],
    "事業収支作成": ["賃料、工事費、金利、出口Cap Rateなど感度の高い前提を分ける", "前提の出典、取得日、更新責任者を残す", "標準、保守、楽観ケースを作り、投資判断が変わる条件を確認する"],
    "PM/BM管理": ["クレーム、修繕、滞納、入退去をNOIや出口価格に影響する情報として管理する", "月次レポートでは前月差異、判断事項、未解決リスクを明確にする", "PM、BM、AM、所有者、会計の役割分担を文書化する"],
    "修繕計画": ["法定点検、現地報告、修繕履歴、保証書、写真をまとめて管理する", "計画修繕と突発修繕を分け、CAPEXとNOIへの影響を確認する", "売却やリファイナンス時に説明できるよう、実施理由と効果を残す"]
  };
  return checks[item.task] || ["後続工程で使う判断材料を意識して資料を残す", "確認済み、未確認、専門家確認待ちを分ける", "価格、契約条件、説明資料へ反映する論点を明確にする"];
}

function renderColumnDetailPage() {
  if (!columnDetailTarget) return false;
  const id = new URLSearchParams(window.location.search).get("id");
  const item = columns.find((column) => slug(column.title) === id) || columns[0];
  const sources = sourceLinksFor(item);
  const relatedLinks = relatedServiceLinks(item);
  const sections = (item.body || []).map(sectionParts);
  document.title = `${item.title} | 業務コラム | 不動産売買向けプロップテックガイド`;
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute("content", `${item.task}に関する実務コラム。不動産売買の業務フロー、注意点、関連するプロップテックサービスを整理。`);
  }
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) {
    ogTitle.setAttribute("content", `${item.title} | 業務コラム`);
  }
  const ogDescription = document.querySelector('meta[property="og:description"]');
  if (ogDescription) {
    ogDescription.setAttribute("content", item.lead);
  }
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) {
    canonical.setAttribute("href", `https://japan-proptech-guide.com/column.html?id=${slug(item.title)}`);
  }
  columnDetailTarget.innerHTML = `
    <a class="back-link" href="index.html#columns">業務コラムへ戻る</a>
    <article class="column-detail-article">
      <div class="column-detail-hero">
        <div class="column-hero-copy">
          <p class="eyebrow">Business Column</p>
          <div class="column-card-head">
            <span class="pill process-pill">${processLabels[item.process] || item.process}</span>
            <span class="pill task-pill">${item.task}</span>
          </div>
          <h1>${item.title}</h1>
          <p class="detail-lead">${item.lead}</p>
        </div>
      </div>

      <section class="column-message">
        <p>${item.message || item.lead}</p>
      </section>

      <section class="veteran-note">
        <p class="eyebrow">Practitioner View</p>
        <h2>実務の勘所</h2>
        <p>${expertInsight(item)}</p>
      </section>

      <section class="field-checklist">
        <p class="eyebrow">Field Checklist</p>
        <h2>確認ポイント</h2>
        <ul>${listItems(fieldChecklist(item))}</ul>
      </section>

      <section class="column-flow">
        <div class="section-heading">
          <p class="eyebrow">Workflow</p>
          <h2>本業務の流れ</h2>
        </div>
        <ol class="flow-diagram">
          ${(item.flowSteps || []).map((step, index) => `
            <li>
              <span>${String(index + 1).padStart(2, "0")}</span>
              <strong>${step}</strong>
            </li>
          `).join("")}
        </ol>
      </section>

      <section class="column-detail-body">
        <div class="section-heading">
          <p class="eyebrow">Guide</p>
          <h2>手順ごとの進め方</h2>
        </div>
        ${sections.map((section, index) => `
          <section class="column-step-section">
            <div class="step-number">${String(index + 1).padStart(2, "0")}</div>
            <div>
              <h3>${section.heading}</h3>
              <p>${section.body}</p>
            </div>
          </section>
        `).join("")}
      </section>

      <section class="column-detail-tools">
        <h2>この業務で役に立ちそうなサービス</h2>
        <div>${relatedLinks || "<span>関連サービス未設定</span>"}</div>
      </section>

      <section class="column-reference-list">
        <h2>参考リンク</h2>
        <ul>
          ${sources.map((source) => `<li><a href="${source.url}" target="_blank" rel="noreferrer">${source.title}</a><span>${source.source}</span></li>`).join("")}
        </ul>
      </section>
    </article>
    <script type="application/ld+json">
      ${JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        headline: item.title,
        description: item.lead,
        inLanguage: "ja",
        about: [item.process, item.task, ...(item.keywords || [])],
        mainEntityOfPage: `https://japan-proptech-guide.com/column.html?id=${slug(item.title)}`
      })}
    </script>
  `;
  return true;
}

if (!renderColumnDetailPage() && !renderDetailPage()) {

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
  resultCount.textContent = `${filtered.length}件の法人向け民間プロップテックサービスを表示中`;
  serviceGrid.innerHTML = filtered.map((item, index) => {
    const card = serviceCard(item);
    return !serviceExpanded && index >= serviceLimit
      ? card.replace('class="service-card"', 'class="service-card collapsed-extra"')
      : card;
  }).join("") || `<p class="empty">条件に一致するサービスがありません。</p>`;
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

function renderColumnTabs() {
  if (!columnTabs) return;
  const columnProcesses = [ALL, ...processOrder.filter((process) => columns.some((item) => item.process === process))];
  if (!columnProcesses.includes(activeColumnProcess)) activeColumnProcess = ALL;
  columnTabs.innerHTML = columnProcesses.map((process) => button(process, process === activeColumnProcess, "case-tab", "column-process")).join("");
}

function renderColumnTaskTabs() {
  if (!columnTaskTabs) return;
  const availableTasks = new Set(columns
    .filter((item) => activeColumnProcess === ALL || item.process === activeColumnProcess)
    .map((item) => item.task));
  const orderedTasks = (activeColumnProcess === ALL ? allTasks : knowledgeMap[activeColumnProcess] || [])
    .filter((task) => availableTasks.has(task));
  const tasks = [ALL, ...orderedTasks];
  if (!tasks.includes(activeColumnTask)) activeColumnTask = ALL;
  columnTaskTabs.innerHTML = tasks.map((task) => button(task, task === activeColumnTask, "case-tab task-filter", "column-task")).join("");
}

function caseCard(item) {
  return `
    <a class="case-card" href="${item.url}" target="_blank" rel="noreferrer">
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

function columnCard(item) {
  const sources = columnSourcesFor(item);
  return `
    <a class="column-card" href="${columnUrl(item)}">
      <div class="column-card-head">
        <span class="pill process-pill">${processLabels[item.process] || item.process}</span>
        <span class="pill task-pill">${item.task}</span>
      </div>
      <h3>${item.title}</h3>
      <div class="column-card-keywords">
        ${(item.keywords || []).slice(0, 4).map((keyword) => `<span>${keyword}</span>`).join("")}
      </div>
      <p class="column-card-meta">参考リンク ${sources.length}件</p>
    </a>
  `;
}

function filteredColumns() {
  return columns.filter((item) => {
    const processMatch = activeColumnProcess === ALL || item.process === activeColumnProcess;
    const taskMatch = activeColumnTask === ALL || item.task === activeColumnTask;
    const sources = columnSourcesFor(item);
    const queryMatch = matchesQuery([item.title, item.process, item.task, item.lead, item.body, item.keywords, item.relatedServices, sources.map((source) => [source.title, source.source, source.summary])]);
    return processMatch && taskMatch && queryMatch;
  });
}

function renderColumns() {
  if (!columnGrid) return;
  const filtered = filteredColumns();
  if (columnResultCount) {
    columnResultCount.textContent = `${filtered.length}件の業務コラムを表示中`;
  }
  columnGrid.innerHTML = filtered.map((item, index) => {
    const card = columnCard(item);
    return !columnExpanded && index >= columnLimit
      ? card.replace('class="column-card"', 'class="column-card collapsed-extra"')
      : card;
  }).join("") || `<p class="empty">条件に一致する業務コラムがありません。</p>`;
  if (columnMore) {
    columnMore.hidden = filtered.length <= columnLimit;
    columnMore.textContent = columnExpanded ? "閉じる" : "もっと見る";
  }
}

function renderCases() {
  const filtered = filteredCases();
  if (caseResultCount) {
    caseResultCount.textContent = `${filtered.length}件の導入事例を表示中`;
  }
  caseGrid.innerHTML = filtered.map((item, index) => {
    const card = caseCard(item);
    return !caseExpanded && index >= caseLimit
      ? card.replace('class="case-card"', 'class="case-card collapsed-extra"')
      : card;
  }).join("") || `<p class="empty">条件に一致する導入事例がありません。</p>`;
  if (caseMore) {
    caseMore.hidden = filtered.length <= caseLimit;
    caseMore.textContent = caseExpanded ? "閉じる" : "もっと見る";
  }
}

function renderAll() {
  renderServices();
  renderCases();
  renderColumns();
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
  columnExpanded = false;
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

columnMore?.addEventListener("click", () => {
  columnExpanded = !columnExpanded;
  renderColumns();
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

columnTabs?.addEventListener("click", (event) => {
  const buttonEl = event.target.closest("[data-column-process]");
  if (!buttonEl) return;
  activeColumnProcess = buttonEl.dataset.columnProcess;
  activeColumnTask = ALL;
  columnExpanded = false;
  renderColumnTabs();
  renderColumnTaskTabs();
  renderColumns();
});

columnTaskTabs?.addEventListener("click", (event) => {
  const buttonEl = event.target.closest("[data-column-task]");
  if (!buttonEl) return;
  activeColumnTask = buttonEl.dataset.columnTask;
  columnExpanded = false;
  renderColumnTaskTabs();
  renderColumns();
});

renderProviderFilter();
renderAssetFilter();
renderAdopterFilter();
renderProcessTabs();
renderTaskTabs();
renderCaseTabs();
renderCaseTaskTabs();
renderColumnTabs();
renderColumnTaskTabs();
renderAll();
}
