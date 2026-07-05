const processes = [
  "すべて",
  "不動産売却",
  "不動産仲介",
  "不動産購入",
  "不動産開発/不動産運用",
];

const services = [
  {
    process: "不動産売却",
    service: "スマサテ",
    company: "リーウェイズ株式会社",
    tags: ["査定", "収益価格", "売却提案"],
    description: "売買価格や賃料、収益価格を把握し、売却提案や価格説明を支援する不動産会社向けクラウド。",
    url: "https://sumasate.jp/",
  },
  {
    process: "不動産売却",
    service: "SRE AI査定CLOUD",
    company: "SRE AI Partners株式会社",
    tags: ["AI査定", "査定書", "売却媒介"],
    description: "AIで売買価格を査定し、査定書作成や価格根拠の提示を支援。",
    url: "https://sre-ai-partners.co.jp/service/cloud/ai-assessment.html",
  },
  {
    process: "不動産売却",
    service: "TAS-MAP",
    company: "株式会社タス",
    tags: ["評価", "賃料査定", "市場分析"],
    description: "収益不動産の評価、賃料査定、空室率などの分析に使われるデータサービス。",
    url: "https://corporate.tas-japan.com/service/tas-map/",
  },
  {
    process: "不動産売却",
    service: "東京カンテイ 市場データ",
    company: "株式会社東京カンテイ",
    tags: ["価格データ", "マンション", "レポート"],
    description: "マンション価格、賃料、流通データなど、売却価格の説明材料に使える調査情報を提供。",
    url: "https://www.kantei.ne.jp/",
  },
  {
    process: "不動産売却",
    service: "REINS Market Information",
    company: "公益財団法人不動産流通推進センター",
    tags: ["成約相場", "売買相場", "公開情報"],
    description: "指定流通機構の成約情報を一般向けに公開し、売却価格の相場確認に使えるサービス。",
    url: "https://www.contract.reins.or.jp/",
  },
  {
    process: "不動産売却",
    service: "HOME4U",
    company: "株式会社NTTデータ・スマートソーシング",
    tags: ["一括査定", "売却相談", "集客"],
    description: "不動産売却の一括査定依頼を受け付け、売主と不動産会社をつなぐサービス。",
    url: "https://www.home4u.jp/",
  },
  {
    process: "不動産売却",
    service: "イエウール",
    company: "株式会社Speee",
    tags: ["一括査定", "売却集客", "媒介獲得"],
    description: "全国対応の不動産売却一括査定サービス。売却見込み顧客の獲得導線として使われる。",
    url: "https://ieul.jp/",
  },
  {
    process: "不動産売却",
    service: "マンションナビ",
    company: "マンションリサーチ株式会社",
    tags: ["マンション査定", "売却相場", "媒介獲得"],
    description: "マンション売却に特化し、価格相場や査定依頼導線を提供。",
    url: "https://t23m-navi.jp/",
  },
  {
    process: "不動産仲介",
    service: "Facilo",
    company: "株式会社Facilo",
    tags: ["売買仲介", "顧客共有", "追客"],
    description: "売買仲介の物件提案、顧客との情報共有、追客、営業活動報告を支援するコミュニケーションクラウド。",
    url: "https://www.facilo.jp/",
  },
  {
    process: "不動産仲介",
    service: "いえらぶCLOUD",
    company: "株式会社いえらぶGROUP",
    tags: ["物件管理", "反響管理", "仲介業務"],
    description: "物件管理、集客、反響、契約、業務管理を扱う不動産会社向けクラウド。",
    url: "https://ielove-cloud.jp/",
  },
  {
    process: "不動産仲介",
    service: "いい生活 売買クラウド",
    company: "株式会社いい生活",
    tags: ["売買仲介", "物件管理", "顧客管理"],
    description: "売買仲介会社向けに物件管理、顧客管理、Web掲載を支援。",
    url: "https://www.es-service.net/",
  },
  {
    process: "不動産仲介",
    service: "ノマドクラウド",
    company: "イタンジ株式会社",
    tags: ["顧客管理", "追客", "LINE連携"],
    description: "不動産仲介向けの顧客管理、追客、LINE連携を支援。",
    url: "https://nomad-cloud.jp/",
  },
  {
    process: "不動産仲介",
    service: "Digima",
    company: "株式会社コンベックス",
    tags: ["MA", "反響対応", "追客"],
    description: "不動産・住宅業界向けに反響対応、追客、マーケティングオートメーションを提供。",
    url: "https://digima.com/",
  },
  {
    process: "不動産仲介",
    service: "Musubell",
    company: "デジタルガレージグループ",
    tags: ["契約書作成", "電子契約", "重説"],
    description: "不動産売買契約書、重要事項説明書などの文書作成・電子契約を支援。",
    url: "https://www.musubell.com/",
  },
  {
    process: "不動産仲介",
    service: "PICKFORM",
    company: "株式会社PICK",
    tags: ["電子契約", "本人確認", "案件管理"],
    description: "不動産・建築領域に特化した電子契約、本人確認、案件管理を提供。",
    url: "https://pick-hp.com/pickform",
  },
  {
    process: "不動産仲介",
    service: "ア・ソコ",
    company: "株式会社レックアイ",
    tags: ["物件調査", "役所調査", "現地調査"],
    description: "不動産仲介における役所調査や現地調査の負担を軽くする物件調査支援サービス。",
    url: "https://evort.jp/idea-log/product/asoko",
  },
  {
    process: "不動産仲介",
    service: "登記情報提供サービス",
    company: "一般財団法人民事法務協会",
    tags: ["登記情報", "公図", "物件調査"],
    description: "登記簿、公図、地積測量図などの登記情報をオンラインで確認できるサービス。",
    url: "https://www1.touki.or.jp/",
  },
  {
    process: "不動産仲介",
    service: "登記簿図書館",
    company: "株式会社情報通信ネットワーク",
    tags: ["登記簿", "図面", "ブルーマップ"],
    description: "登記簿、図面、ブルーマップなどの取得・閲覧を支援。",
    url: "https://登記簿図書館.com/",
  },
  {
    process: "不動産仲介",
    service: "DX Suite",
    company: "AI inside株式会社",
    tags: ["AI OCR", "帳票", "書類読取"],
    description: "紙書類、帳票、申込書などをAI OCRでデータ化し、入力作業を削減。",
    url: "https://inside.ai/products/dx-suite/",
  },
  {
    process: "不動産仲介",
    service: "CLOVA OCR",
    company: "LINE WORKS株式会社",
    tags: ["AI OCR", "本人確認書類", "非定型書類"],
    description: "定型・非定型書類の文字認識、本人確認書類読取などに利用できるAI OCR。",
    url: "https://www.lycbiz.com/jp/service/clova-ocr/",
  },
  {
    process: "不動産購入",
    service: "SUUMO",
    company: "株式会社リクルート",
    tags: ["物件ポータル", "購入検討", "集客"],
    description: "新築、中古、土地などの購入検討者向け物件情報を掲載する大手ポータル。",
    url: "https://suumo.jp/",
  },
  {
    process: "不動産購入",
    service: "LIFULL HOME'S",
    company: "株式会社LIFULL",
    tags: ["物件ポータル", "購入検討", "集客"],
    description: "売買、賃貸、注文住宅などを扱う総合不動産ポータル。",
    url: "https://www.homes.co.jp/",
  },
  {
    process: "不動産購入",
    service: "at home",
    company: "アットホーム株式会社",
    tags: ["物件流通", "購入検討", "業者ネットワーク"],
    description: "加盟店ネットワークと物件流通を持つ不動産情報サービス。",
    url: "https://www.athome.co.jp/",
  },
  {
    process: "不動産購入",
    service: "カウカモ",
    company: "株式会社ツクルバ",
    tags: ["中古住宅", "リノベーション", "購入体験"],
    description: "中古・リノベーション住宅の購入体験をオンラインで支援。",
    url: "https://cowcamo.jp/",
  },
  {
    process: "不動産購入",
    service: "FLIE",
    company: "株式会社FLIE",
    tags: ["中古住宅", "直接販売", "購入体験"],
    description: "中古住宅の直接販売を軸に、購入時の情報収集や比較を支援。",
    url: "https://flie.jp/",
  },
  {
    process: "不動産購入",
    service: "ROOV",
    company: "株式会社スタイルポート",
    tags: ["新築販売", "3D", "オンライン接客"],
    description: "新築マンション販売向けに3D、VR、オンライン接客を支援。",
    url: "https://roov.jp/",
  },
  {
    process: "不動産購入",
    service: "スペースリー",
    company: "株式会社スペースリー",
    tags: ["VR内見", "3Dツアー", "オンライン接客"],
    description: "VR内見、3Dツアー、オンライン接客で購入検討者の物件確認体験を支援。",
    url: "https://spacely.co.jp/",
  },
  {
    process: "不動産購入",
    service: "Matterport",
    company: "Matterport, Inc.",
    tags: ["3Dスキャン", "デジタルツイン", "物件確認"],
    description: "3Dスキャンで物件の空間情報を可視化し、遠隔での確認体験を支援。",
    url: "https://matterport.com/ja",
  },
  {
    process: "不動産開発/不動産運用",
    service: "REMETIS",
    company: "株式会社REMETIS",
    tags: ["市場調査", "投資判断", "開発判断"],
    description: "不動産投資・開発判断向けのマーケットリサーチ、物件分析、調査支援。",
    url: "https://www.remetis.jp/",
  },
  {
    process: "不動産開発/不動産運用",
    service: "OFFICE RESEARCH",
    company: "株式会社ボルテックス",
    tags: ["オフィス市場", "賃料", "空室"],
    description: "オフィスビル市場の物件、賃料、空室などを調査する事業用不動産データサービス。",
    url: "https://www.vortex-net.com/service/officeresearch/",
  },
  {
    process: "不動産開発/不動産運用",
    service: "CBRE 物件検索",
    company: "シービーアールイー株式会社",
    tags: ["事業用不動産", "オフィス", "物流施設"],
    description: "オフィス、物流施設、店舗など事業用不動産の検索・市況情報を提供。",
    url: "https://www.cbre-propertysearch.jp/",
  },
  {
    process: "不動産開発/不動産運用",
    service: "JLL 物件検索",
    company: "ジョーンズ ラング ラサール株式会社",
    tags: ["事業用不動産", "物流", "マーケットレポート"],
    description: "オフィス、物流、商業施設などの不動産情報とマーケットレポートを提供。",
    url: "https://www.jllproperty.jp/",
  },
  {
    process: "不動産開発/不動産運用",
    service: "不動産情報ライブラリ",
    company: "国土交通省",
    tags: ["価格情報", "地価", "都市計画"],
    description: "価格、地価、防災、都市計画など、不動産調査に必要な公的情報を確認できる。",
    url: "https://www.reinfolib.mlit.go.jp/",
  },
  {
    process: "不動産開発/不動産運用",
    service: "地価マップ",
    company: "一般財団法人資産評価システム研究センター",
    tags: ["路線価", "地価", "固定資産税"],
    description: "路線価、固定資産税路線価、地価公示などを地図で確認できる。",
    url: "https://www.chikamap.jp/",
  },
  {
    process: "不動産開発/不動産運用",
    service: "WealthPark Business",
    company: "WealthPark株式会社",
    tags: ["不動産管理", "オーナー対応", "運用報告"],
    description: "管理会社とオーナーの報告、収支、承認、コミュニケーションをデジタル化。",
    url: "https://wealth-park.com/ja/business/",
  },
  {
    process: "不動産開発/不動産運用",
    service: "CREAL",
    company: "クリアル株式会社",
    tags: ["クラウドファンディング", "投資商品", "運用"],
    description: "不動産クラウドファンディングで個人投資家に物件投資機会を提供。",
    url: "https://creal.jp/",
  },
  {
    process: "不動産開発/不動産運用",
    service: "COZUCHI",
    company: "LAETOLI株式会社",
    tags: ["クラウドファンディング", "投資案件", "運用"],
    description: "不動産投資型クラウドファンディングサービス。",
    url: "https://cozuchi.com/",
  },
];

const newsItems = [
  ["2025-08-26", "不動産テックカオスマップ第11版が発表", "最新版のカオスマップについて、528サービス掲載と市場拡大が報じられました。", "リビンマガジンBiz", "https://www.lvnmag.jp/news/lvn_magazinenews/31265/"],
  ["2025-08-22", "不動産テック協会、カオスマップ最新版を公表", "業界団体の発表として、カテゴリ横断のサービス整理が紹介されました。", "東京都宅建協会 / R.E.port転載", "https://www.tokyo-takken.or.jp/re-port/79643"],
  ["2025-08-18", "不動産営業支援と地図・登記情報連携が専門紙で紹介", "外回り営業、ブルーマップ、登記情報取得など、営業現場のデータ活用が取り上げられました。", "全国賃貸住宅新聞", "https://corp.upward.jp/info/20250818"],
  ["2025-07-07", "賃貸管理システムと業界団体連携が専門紙で掲載", "管理業務のデジタル化や業界団体との連携が賃貸住宅専門紙で紹介されました。", "全国賃貸住宅新聞", "https://simple-up.jp/blog/5239/"],
  ["2025-03-17", "住宅・不動産領域でAIを活用した業務効率化の提携", "住宅・不動産業界向けのAI活用、採用支援、業務効率化に関する提携が報じられました。", "住宅新報", "https://www.arsaga.jp/news/jyutaku-shinpou-20250317/"],
  ["2025-03-04", "不動産営業支援ツールの新機能が住宅専門紙で紹介", "買主追客や顧客リスト活用など、仲介営業のデータ活用が取り上げられました。", "住宅新報", "https://www.estate-tech.co.jp/news/34382/"],
  ["2025-02-13", "不動産ビッグデータを使った空き家予備群分析が掲載", "未登記不動産や空き家発生リスクの分析など、社会課題に関わる不動産データ活用が紹介されました。", "住宅新報", "https://www.trustart.co.jp/news/20250213-jutaku-shimpo/"],
  ["2025-01-28", "不動産・建設領域のセンシング活用が専門紙で紹介", "防災・減災や現場データ取得に関わる技術活用が不動産関連紙で取り上げられました。", "住宅新報", "https://www.saaf-hd.co.jp/news/20250129_02"],
  ["2025-01-20", "BIM対応積算システム連携が住宅専門紙で掲載", "建築・不動産周辺業務でのBIM、積算、データ連携の動きが紹介されました。", "住宅新報Web", "https://gacci.co.jp/news/20250121/"],
  ["2024-12-25", "R.E.portが流通・住宅・管理領域のニュースを継続配信", "流通、住宅、開発、管理などの業界動向を追うニュースソースとして参照。", "R.E.port", "https://www.re-port.net/"],
  ["2024-10-14", "家賃保証・賃貸業務のデジタル化が専門紙で紹介", "賃貸管理や保証業務のDXに関わる動向が専門紙面で扱われました。", "住宅新報", "https://www.j-lease.jp/files/uploads/251014_Jyutakushinpou.pdf"],
  ["2024-08-01", "スマートホーム領域のカオスマップが公開", "居住体験や住宅設備連携など、不動産テックと隣接するリビングテック領域を整理。", "LIVING TECH協会", "https://www.livingtech.or.jp/assets/library/2025/08/smart-home-chaos-map-2025-v3.pdf"],
].map(([date, title, summary, source, url]) => ({ date, title, summary, source, url }));

const cases = [
  ["売買仲介", "三井不動産リアルティ株式会社", "Facilo", "個人向け不動産仲介事業で、顧客との情報共有や提案体験の改善に活用。", "https://facilo.jp/case/06"],
  ["売買仲介", "東海住宅株式会社", "Facilo", "遠方顧客対応や再面談率改善など、売買仲介の営業プロセスで活用。", "https://www.facilo.jp/case"],
  ["売買仲介", "株式会社ES&Company", "Facilo", "タワーマンション特化の売買仲介で、問い合わせ対応や提案スピード改善に活用。", "https://facilo.jp/case/escompany"],
  ["売買仲介", "株式会社永大ハウス工業", "Facilo", "複数店舗での売買仲介営業における顧客共有、追客、営業報告に活用。", "https://www.facilo.jp/case"],
  ["売買仲介", "パシフィック不動産株式会社", "Facilo", "売却仲介での営業活動報告や売主コミュニケーションに活用。", "https://www.facilo.jp/case"],
  ["不動産管理", "株式会社レオパレス21", "WealthPark Business", "多数のオーナーとの接点再構築、収支明細、報告、チャットに活用。", "https://wealth-park.com/business/case-study/"],
  ["不動産管理", "旭化成不動産レジデンス株式会社", "WealthPark Business", "試験導入を経て、オーナーアプリの全面導入を決定した事例。", "https://wealth-park.com/business/case-study/"],
  ["不動産管理", "株式会社コスギ不動産", "WealthPark Business", "送金明細の電子化やオーナー対応の効率化に活用。", "https://wealth-park.com/tc/business/case-study/kosugi/"],
  ["不動産管理", "ミノラス不動産株式会社", "WealthPark Business", "オーナーの世代交代を見据えたコミュニケーション基盤として活用。", "https://wealth-park.com/business/case-study/"],
  ["開発・販売", "新築マンション販売会社", "ROOV", "新築マンション販売で、3D・オンライン接客を活用した購入検討体験を提供。", "https://roov.jp/case"],
  ["物件案内", "不動産仲介・住宅会社", "スペースリー", "VR内見や3Dツアーを活用し、遠隔での物件案内や営業支援に活用。", "https://spacely.co.jp/case/"],
  ["投資・運用", "不動産管理会社・AM会社", "REMETIS", "投資判断や物件調査におけるマーケットリサーチ活用を想定。", "https://www.remetis.jp/"],
];

const header = document.querySelector("[data-header]");
const processTabs = document.querySelector("[data-process-tabs]");
const serviceGrid = document.querySelector("[data-service-grid]");
const searchInput = document.querySelector("[data-search]");
const resultCount = document.querySelector("[data-result-count]");
const newsList = document.querySelector("[data-news-list]");
const newsPagination = document.querySelector("[data-news-pagination]");
const caseTabs = document.querySelector("[data-case-tabs]");
const caseGrid = document.querySelector("[data-case-grid]");

let activeProcess = "すべて";
let activeIndustry = "すべて";
let currentNewsPage = 1;
const newsPerPage = 10;

function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 40);
}

function renderProcessTabs() {
  processTabs.innerHTML = processes.map((process) => `
    <button class="filter${process === activeProcess ? " active" : ""}" type="button" data-process="${process}">
      ${process}
    </button>
  `).join("");
}

function serviceCard(service) {
  return `
    <article class="service-card">
      <div class="card-top">
        <span class="tag">${service.process}</span>
        <a class="card-link" href="${service.url}" target="_blank" rel="noreferrer">開く</a>
      </div>
      <h3>${service.service}</h3>
      <p class="provider">提供会社: ${service.company}</p>
      <p>${service.description}</p>
      <div class="service-meta">
        ${service.tags.map((tag) => `<span class="pill">${tag}</span>`).join("")}
      </div>
    </article>
  `;
}

function renderServices() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = services.filter((service) => {
    const haystack = `${service.process} ${service.service} ${service.company} ${service.description} ${service.tags.join(" ")}`.toLowerCase();
    const matchesProcess = activeProcess === "すべて" || service.process === activeProcess;
    return matchesProcess && (!query || haystack.includes(query));
  });
  serviceGrid.innerHTML = filtered.map(serviceCard).join("");
  resultCount.textContent = `${filtered.length}件を表示中 / 全${services.length}件`;
}

function renderNews() {
  const sortedNews = [...newsItems].sort((a, b) => b.date.localeCompare(a.date));
  const pageCount = Math.ceil(sortedNews.length / newsPerPage);
  const start = (currentNewsPage - 1) * newsPerPage;
  const pageItems = sortedNews.slice(start, start + newsPerPage);

  newsList.innerHTML = pageItems.map((item) => `
    <li class="news-item">
      <time datetime="${item.date}">${item.date}</time>
      <div>
        <h3>${item.title}</h3>
        <p>${item.summary}</p>
        <span class="news-source">${item.source}</span>
      </div>
      <div>
        <a class="card-link" href="${item.url}" target="_blank" rel="noreferrer">記事</a>
      </div>
    </li>
  `).join("");

  newsPagination.innerHTML = Array.from({ length: pageCount }, (_, index) => {
    const page = index + 1;
    return `<button class="page-button${page === currentNewsPage ? " active" : ""}" type="button" data-news-page="${page}">${page}</button>`;
  }).join("");
}

function renderCaseTabs() {
  const industries = ["すべて", ...new Set(cases.map(([industry]) => industry))];
  caseTabs.innerHTML = industries.map((industry) => `
    <button class="case-tab${industry === activeIndustry ? " active" : ""}" type="button" data-industry="${industry}">
      ${industry}
    </button>
  `).join("");
}

function renderCases() {
  const filtered = cases.filter(([industry]) => activeIndustry === "すべて" || industry === activeIndustry);
  caseGrid.innerHTML = filtered.map(([industry, adopter, service, summary, url]) => `
    <article class="case-card">
      <span class="industry">${industry}</span>
      <h3>${adopter}</h3>
      <p class="provider">導入サービス: ${service}</p>
      <p>${summary}</p>
      <div class="service-meta">
        <span class="pill">導入会社別</span>
        <a class="card-link" href="${url}" target="_blank" rel="noreferrer">読む</a>
      </div>
    </article>
  `).join("");
}

processTabs.addEventListener("click", (event) => {
  const button = event.target.closest("[data-process]");
  if (!button) return;
  activeProcess = button.dataset.process;
  renderProcessTabs();
  renderServices();
});

newsPagination.addEventListener("click", (event) => {
  const button = event.target.closest("[data-news-page]");
  if (!button) return;
  currentNewsPage = Number(button.dataset.newsPage);
  renderNews();
});

caseTabs.addEventListener("click", (event) => {
  const button = event.target.closest("[data-industry]");
  if (!button) return;
  activeIndustry = button.dataset.industry;
  renderCaseTabs();
  renderCases();
});

searchInput.addEventListener("input", renderServices);
window.addEventListener("scroll", updateHeader, { passive: true });

renderProcessTabs();
renderServices();
renderNews();
renderCaseTabs();
renderCases();
updateHeader();
