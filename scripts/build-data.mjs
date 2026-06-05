import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
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
  "providers",
  "sourceUrls"
]);
const optionalFields = new Set(["operatorNote"]);
const comparisonOptionalFields = new Set(["seoTitle", "heroImage", "heroAlt"]);

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
      } else if (optionalFields.has(header) || comparisonOptionalFields.has(header)) {
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
  columnSources: await readCsv("column-sources.csv"),
  serviceComparisons: await readCsv("service-comparisons.csv")
};

const escapeHtml = (value = "") => value.toString()
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#39;");

const escapeAttr = escapeHtml;
const asciiSlug = (value = "") => value
  .toString()
  .normalize("NFKD")
  .toLowerCase()
  .replace(/&/g, " and ")
  .replace(/@/g, " at ")
  .replace(/\+/g, " plus ")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "")
  .replace(/-{2,}/g, "-");
const slugFromUrl = (value = "") => {
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "").replace(/\.(co\.)?jp$/, "").replace(/\.(com|net|app|estate)$/, "");
    const path = url.pathname.replace(/\/index\.(html?|php)$/i, "").replace(/\.(html?|php|pdf)$/i, "");
    return asciiSlug(`${host} ${path}`);
  } catch {
    return "";
  }
};
const uniqueSlug = (base, used, fallback) => {
  const rootSlug = asciiSlug(base) || fallback;
  let candidate = rootSlug;
  let index = 2;
  while (used.has(candidate)) {
    candidate = `${rootSlug}-${index}`;
    index += 1;
  }
  used.add(candidate);
  return candidate;
};
const columnSlugBases = [
  "corporate-real-estate-sale-purpose",
  "property-information-checklist",
  "sale-price-appraisal-methods",
  "brokerage-contract-types",
  "property-due-diligence-points",
  "digital-important-matters-explanation",
  "sale-contract-key-terms",
  "real-estate-sourcing-process",
  "real-estate-dd-management",
  "business-plan-sensitivity-analysis",
  "pm-bm-reporting",
  "property-summary-sheet",
  "sale-activity-management",
  "price-validity-check",
  "rights-registration-check",
  "sales-materials-creation",
  "purchase-offer-submission",
  "first-client-interview",
  "repair-plan",
  "sales-proposal-ai-ads",
  "ad-compliance-check",
  "private-road-excavation-consent",
  "real-estate-business-efficiency",
  "building-code-special-exception-2025",
  "inquiry-response-follow-up",
  "seller-address-registration-check",
  "generative-ai-real-estate-use",
  "energy-performance-label",
  "identity-verification-before-contract"
];
const comparisonSlugBases = [
  "property-management-system-comparison",
  "needs-matching-service-comparison",
  "ai-appraisal-service-comparison",
  "volume-check-service-comparison",
  "real-estate-crm-comparison",
  "real-estate-electronic-contract-comparison",
  "real-estate-appraisal-system-comparison",
  "real-estate-property-research-tool-comparison",
  "real-estate-lead-follow-up-tool-comparison",
  "it-subsidy-real-estate-tech-services-comparison"
];
const serviceSlugOverrides = new Map([
  ["レリーズプラットフォーム", "release-platform"],
  ["RESPORTクラウド", "resport-cloud"],
  ["インデックスマップ＠クラウド", "index-map-cloud"],
  ["ナーブVRクラウド", "nurve-vr-cloud"],
  ["不動産チェッカー", "real-estate-checker"],
  ["SRE AI査定CLOUD", "sre-ai-appraisal-cloud"],
  ["スマサテ", "sumasate"],
  ["デベNAVI", "deve-navi"],
  ["マンション査定システム", "mansion-appraisal-system"],
  ["土地査定システム", "land-appraisal-system"],
  ["カタログコピーサービス", "catalog-copy-service"],
  ["マンション相場Plus", "mansion-market-plus"],
  ["土地相場Plus", "land-market-plus"],
  ["フォレストPRO", "forest-pro"],
  ["いえらぶCLOUD", "ielove-cloud"],
  ["いい生活 売買クラウド", "e-seikatsu-baibai-cloud"],
  ["スマート契約", "smart-contract"],
  ["ア・ソコ", "a-soko"],
  ["登記簿図書館", "toukibo-library"],
  ["スペースリー", "spacely"],
  ["GMO賃貸DX", "gmo-chintai-dx"],
  ["管理ロイド", "kanri-roid"],
  ["VCプロ", "vc-pro"]
]);
const serviceSlugs = new Set();
data.services.forEach((item, index) => {
  const base = serviceSlugOverrides.get(item.service) || asciiSlug(item.service) || slugFromUrl(item.url);
  item.slug = uniqueSlug(base, serviceSlugs, `service-${index + 1}`);
});
const columnSlugs = new Set();
data.columns.forEach((item, index) => {
  item.slug = uniqueSlug(columnSlugBases[index], columnSlugs, `column-${index + 1}`);
});
const comparisonSlugs = new Set();
data.serviceComparisons.forEach((item, index) => {
  item.slug = uniqueSlug(comparisonSlugBases[index], comparisonSlugs, `comparison-${index + 1}`);
});
const listItems = (items = []) => items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
const pillList = (items = [], className = "pill") => items.map((item) => `<span class="${className}">${escapeHtml(item)}</span>`).join("");
const serviceUrl = (item) => `services/${item.slug}/`;
const columnUrl = (item) => `columns/${item.slug}/`;
const comparisonUrl = (item) => `comparisons/${item.slug}/`;
const serviceByName = (name) => data.services.find((service) => service.service === name);
const serviceCases = (service) => data.cases.filter((item) => item.service === service.service || item.provider === service.company);
const columnSourcesFor = (column) => data.columnSources.filter((source) => source.process === column.process && source.task === column.task);
const uniqueItems = (items = []) => [...new Set(items.filter(Boolean))];
const trimSentence = (value = "") => value.replace(/。+$/g, "");
const shortList = (items = [], limit = 4) => {
  const values = uniqueItems(items).slice(0, limit);
  if (!values.length) return "";
  const suffix = uniqueItems(items).length > limit ? "など" : "";
  return `${values.join("、")}${suffix}`;
};
const truncate = (value = "", limit = 155) => {
  const text = value.toString().replace(/\s+/g, " ").trim();
  return text.length > limit ? `${text.slice(0, limit - 1)}…` : text;
};
const serviceHeroImages = {
  REMETIS: {
    src: "https://www.remetis.jp/web/wp-content/uploads/2023/07/fnc2.png",
    alt: "REMETISの地図と物件情報を表示したプロダクト画面"
  },
  "T2TR ComFort": {
    src: "https://cdn.sanity.io/images/fpbv56x9/development/2cf68e8f4b8233215d433fac539820db8fffc569-1440x696.png",
    alt: "T2TR ComFortの投資家向け情報開示サイト管理画面"
  },
  "インデックスマップ＠クラウド": {
    src: "https://www.jon.co.jp/lp/index-map-cloud/assets/img/main_pc.png",
    alt: "インデックスマップ＠クラウドの地図情報画面"
  },
  "ナーブVRクラウド": {
    src: "https://www.nurve.jp/wp/wp-content/uploads/2025/07/vrnaiken.jpg",
    alt: "ナーブVRクラウドのVR内見イメージ"
  },
  "不動産チェッカー": {
    src: "https://www.torus.co.jp/img/pc-checker-img.png",
    alt: "不動産チェッカーの物件調査画面"
  },
  "SRE AI査定CLOUD": {
    src: "https://sre-ai-partners.co.jp/service/srecloud/aisateicloud/images/index/mv_pc.png",
    alt: "SRE AI査定CLOUDの査定サービス画面"
  },
  "スマサテ": {
    src: "https://sumasate.jp/assets/images/mv-screen.png",
    alt: "スマサテの賃料査定画面"
  },
  "Gate.": {
    src: "https://ai.gate.estate/wp-content/uploads/Gate_eyeCatch.png",
    alt: "Gate.の不動産AI査定サービス画面"
  },
  "デベNAVI": {
    src: "https://ferret-one.akamaized.net/images/67e255f736c6ad0df0bdaf66/large.png?utime=1742886391",
    alt: "デベNAVIの開発用地検討サービス画面"
  },
  "TASUKI TECH LAND": {
    src: "https://tasukicorp.co.jp/wp/wp-content/uploads/2022/05/TASUKITECHLAND.png",
    alt: "TASUKI TECH LANDのサービス紹介ビジュアル"
  },
  "マンション査定システム": {
    src: "https://www.hp.kantei.ne.jp/img/mv-pc.jpg?20220614",
    alt: "東京カンテイのマンション査定システム紹介ビジュアル"
  },
  "土地査定システム": {
    src: "https://www.hp.kantei.ne.jp/lp/estate_assessment_tochi/01/img/mv-pc.jpg?20220614",
    alt: "東京カンテイの土地査定システム紹介ビジュアル"
  },
  Facilo: {
    src: "https://www.facilo.jp/media/CcMzwLwRPjlaxEuo7yE9HioQB2jM1Ooxm1rp33WV.png",
    alt: "Faciloのサービス紹介ビジュアル"
  },
  "フォレストPRO": {
    src: "https://forest.openrm.jp/assets/images/products/pro-cut.webp",
    alt: "フォレストPROの物件資料作成画面"
  },
  "いえらぶCLOUD": {
    src: "https://ielove-cloud.jp/images/img_hp_top.png",
    alt: "いえらぶCLOUDの不動産業務クラウド画面"
  },
  ATBB: {
    src: "https://business.athome.jp/wordpress/wp-content/service/atbb/images/top-img.svg",
    alt: "ATBBの不動産業務支援サービス紹介ビジュアル"
  },
  "スマート契約": {
    src: "https://business.athome.jp/wordpress/wp-content/service/smart_keiyaku/images/header/img.png?1",
    alt: "スマート契約の電子契約サービス画面"
  },
  Digima: {
    src: "https://digima.com/hs-fs/hubfs/raw_assets/public/comvex-service/2026-renewal/images/hero_section_visual.png?width=600&height=665&name=hero_section_visual.png",
    alt: "Digimaのオンライン営業支援サービス画面"
  },
  KASIKA: {
    src: "https://cocolive.co.jp/newsite/wp-content/themes/kasika/dist/img/top/fv.webp",
    alt: "KASIKAの顧客管理・追客サービス画面"
  },
  PICKFORM: {
    src: "https://storage.googleapis.com/production-os-assets/assets/50f92995-a670-45ec-bf6f-2ff9780f9c61",
    alt: "PICKFORMの不動産電子契約サービス紹介ビジュアル"
  },
  "ア・ソコ": {
    src: "https://www.a-soko.jp/p/img/BukkenManagement$Images$asoko3_2.png?637695691385121667",
    alt: "ア・ソコの物件管理画面"
  },
  ROOV: {
    src: "https://styleport.co.jp/roov/admin/wp-content/themes/corporate.styleport.services/assets/img/top/top_product_walk_slide_01.jpg",
    alt: "ROOVの3D空間内覧サービス画面"
  },
  "OFFICE RESEARCH": {
    src: "https://www.vortex-net.com/wp/resource/images/service/officeresearch/mv_im01.jpg",
    alt: "OFFICE RESEARCHのオフィス情報サービス紹介ビジュアル"
  },
  "WealthPark Business": {
    src: "https://wealth-park.com/wp-content/themes/wp-next-landing-page/business/img/hero_kv_001.png",
    alt: "WealthPark Businessのオーナーアプリ画面"
  },
  "GMO賃貸DX": {
    src: "https://chintaidx.com/wp-content/themes/chintaidx/assets/images/top/kv-slider03.png",
    alt: "GMO賃貸DXの賃貸管理アプリ画面"
  },
  ANDPAD: {
    src: "https://d9dr9gbu0pyck.cloudfront.net/wp-content/uploads/OGP_top.jpg",
    alt: "ANDPADの施工管理クラウド紹介ビジュアル"
  },
  SPIDERPLUS: {
    src: "https://spiderplus.co.jp/wp/wp-content/uploads/2020/10/services_img01-1.png",
    alt: "SPIDERPLUSの図面・現場管理画面"
  },
  Musubell: {
    src: "https://www.musubell.com/ogp/og-image.jpg",
    alt: "Musubellの不動産販売・契約支援サービス紹介ビジュアル"
  }
};
const serviceFeatureOverrides = {
  REMETIS: [
    ["社内情報データベース", "物件概要書などのPDFから物件情報を読み取り、地図に紐づいた社内データベースとして案件情報、過去の検討案件、成約情報などを蓄積できます。"],
    ["ニーズマッチング", "売却物件と購入ニーズを自動で照合し、マッチ度合いの高い情報を確認できます。顧客の希望エリアを地図上で管理し、条件に合う物件情報を担当者へ通知できます。"],
    ["物件情報外部共有", "登録した物件情報や添付資料をURLで顧客・取引先へ共有できます。共有先をメールアドレスで制限し、紹介先や閲覧履歴を物件ごとに管理できます。"],
    ["外部情報リサーチ", "マーケットデータ、地理情報、用途地域、ハザードマップ、公図、住宅地図、ストリートビューなどを地図上で確認し、対象地や周辺環境の調査に使えます。"],
    ["情報分析・資料作成", "地図上の不動産情報を抽出してチャートや比較表に可視化できます。登録した物件情報から自社フォーマットの概要書や稟議資料を出力できます。"]
  ],
  "D-NET": [
    ["土木工事情報検索", "全国の土木工事情報を検索し、開発予定地周辺の公共工事やインフラ整備の動きを確認できます。"],
    ["営業先探索", "工事情報をもとに、建設会社、設備会社、不動産開発会社などの営業候補先を探せます。"],
    ["市場・周辺動向確認", "対象エリアで進んでいる工事や整備計画を確認し、開発・営業判断の材料として使えます。"]
  ],
  "KJ-NET": [
    ["建築計画情報検索", "全国の建築計画情報を検索し、用途、規模、所在地、事業主などの情報を確認できます。"],
    ["新規営業先探索", "建築予定案件をもとに、建材、設備、管理、リーシングなどの営業先候補を抽出できます。"],
    ["開発・市場調査", "周辺の建築計画や用途傾向を把握し、開発エリアや事業企画の検討に活用できます。"]
  ],
  "レリーズプラットフォーム": [
    ["売買契約業務管理", "売買契約に必要な書類、依頼、確認事項、進捗をクラウド上で管理できます。"],
    ["本人確認・書類回収", "契約当事者の本人確認や必要書類の回収状況をオンラインで確認できます。"],
    ["電子契約連携", "不動産売買に関わる契約手続きの電子化により、紙、郵送、押印を前提とした業務を削減できます。"],
    ["進捗可視化", "社内外の関係者ごとに契約準備の進み具合を把握し、抜け漏れを防げます。"]
  ],
  "RESPORTクラウド": [
    ["AMレポート作成", "不動産運用レポートの作成に必要な収支、稼働、KPI情報を集約できます。"],
    ["運用データ管理", "物件ごとの収支、契約、修繕、運用状況をクラウドで管理できます。"],
    ["投資家向け報告", "投資家やオーナーに提出する月次・期次レポートの作成を支援します。"]
  ],
  "R.E.DATA": [
    ["不動産データ収集", "登記や不動産に関する公開情報をもとに、調査対象の物件・所有者情報を整理できます。"],
    ["所有者・物件リスト作成", "営業やソーシングに使う所有者リスト、物件リストを作成できます。"],
    ["データベース化", "収集した不動産情報を社内で検索・再利用しやすい形で管理できます。"]
  ],
  "R.E.REPO": [
    ["不動産調査レポート", "調査対象物件の周辺情報、登記関連情報、マーケット情報をレポート化できます。"],
    ["地図・周辺情報整理", "対象地の位置、周辺施設、用途、取引情報などをまとめて確認できます。"],
    ["資料作成支援", "投資判断、仕入検討、営業提案に使う調査資料の作成を効率化できます。"]
  ],
  "T2TR ComFort": [
    ["投資法人サイト運用", "J-REITや不動産ファンド向けのWebサイト、IRページ、物件情報ページの運用を支援します。"],
    ["開示資料管理", "決算資料、プレスリリース、運用レポートなどの開示資料を掲載・管理できます。"],
    ["物件情報掲載", "保有物件の概要、写真、稼働状況、ポートフォリオ情報をWeb上で整理できます。"]
  ],
  "インデックスマップ＠クラウド": [
    ["地番地図閲覧", "地番地図をクラウド上で確認し、対象地や周辺筆の位置関係を把握できます。"],
    ["路線価図・公図確認", "路線価図、公図、地積測量図などの調査資料を確認できます。"],
    ["登記情報取得支援", "調査対象地に紐づく登記関連情報の確認・取得を効率化できます。"]
  ],
  "ナーブVRクラウド": [
    ["VR内見コンテンツ", "物件の室内やモデルルームをVRコンテンツ化し、来店前や遠隔地の顧客に案内できます。"],
    ["オンライン接客", "VR画像を使いながら、営業担当がオンラインで物件説明や内見案内を行えます。"],
    ["来店・内見前提案", "来店前に物件理解を深めてもらい、内見候補の絞り込みや接客効率化に使えます。"]
  ],
  "不動産チェッカー": [
    ["登記簿取得", "物件調査に必要な登記簿情報をオンラインで取得・確認できます。"],
    ["所有者調査", "土地や建物の所有者情報を確認し、営業・仕入れ・調査業務に活用できます。"],
    ["地図検索", "地図上から調査対象を探し、周辺の不動産情報とあわせて確認できます。"]
  ],
  "SRE AI査定CLOUD": [
    ["AI売買価格査定", "AIがマンション、土地、戸建などの売買価格を自動査定し、査定業務を短時間で進められます。"],
    ["査定書作成", "査定価格、地図、周辺相場、類似事例を含む査定書を作成できます。"],
    ["マンション検索・自動入力", "分譲マンションデータから対象物件を検索し、住所や建物情報を自動入力できます。"],
    ["登記簿PDF読み取り", "土地・戸建査定で登記簿謄本PDFから必要情報を読み取り、入力負担を減らせます。"],
    ["収益物件査定", "オプションで収益還元法による区分・一棟収益物件の査定にも対応できます。"]
  ],
  "スマサテ": [
    ["AI賃料査定", "賃貸住宅のデータをもとに、対象物件の適正賃料を短時間で査定できます。"],
    ["近隣事例比較", "成約済み事例を含む周辺賃料データを確認し、査定根拠として使えます。"],
    ["査定書ダウンロード", "査定結果を提案資料や融資相談に使える資料として出力できます。"],
    ["市場データ分析", "広告費、AD、建築計画などの市場データを確認し、賃料提案や管理受託に活用できます。"]
  ],
  "Gate.": [
    ["AI価格査定", "不動産価格や収益性をAIで推定し、投資・仕入れ判断の初期検討に使えます。"],
    ["収益シミュレーション", "賃料、利回り、運用コストなどの前提を置き、収益不動産の投資判断を支援します。"],
    ["マーケット分析", "周辺相場や取引データを確認し、価格妥当性や出口戦略の検討に活用できます。"]
  ],
  "デベNAVI": [
    ["開発用地検索", "開発候補地を地図上で探し、用途や立地条件を確認できます。"],
    ["法規制・用途確認", "対象地の用途地域、建ぺい率、容積率など開発検討に必要な条件を確認できます。"],
    ["ボリューム検討", "敷地条件から建築可能性や事業規模の初期検討を行えます。"]
  ],
  "TASUKI TECH LAND": [
    ["用地仕入れ支援", "開発候補地の情報収集、比較、管理を支援します。"],
    ["AIボリュームチェック", "敷地条件から建築ボリュームや事業可能性を短時間で確認できます。"],
    ["事業収支検討", "取得価格、建築費、販売価格などの前提を置いて開発収支の検討に使えます。"]
  ],
  "VCプロ": [
    ["AIボリューム図面作成", "敷地や用途などの基本情報を入力し、AIが設計のたたき台となるボリューム図面を作成できます。"],
    ["3D鳥かご図", "建築可能範囲を3Dで確認し、敷地条件に対する建物ボリュームの初期検討に使えます。"],
    ["図面・データ出力", "検討結果をPDFやCAD編集に使うデータとして出力し、設計会社への確認や社内検討につなげられます。"]
  ],
  "ROOK2": [
    ["建築ボリューム自動算出", "敷地を設定し、断面計画などの条件から建築ボリュームを自動で算出できます。"],
    ["斜線・日影・天空率チェック", "斜線、日影、天空率などの規制を確認し、建築可能性の初期判断に使えます。"],
    ["概算見積・収支計画", "ボリューム検討から概算見積、収支計画、提案帳票の作成までつなげられます。"]
  ],
  "TAS-MAP": [
    ["賃料・マーケット分析", "賃料相場、空室、周辺マーケットを地図やデータで確認できます。"],
    ["エリアレポート", "人口、世帯、賃貸需要などの地域情報をレポートとして整理できます。"],
    ["投資・運用判断支援", "賃貸住宅や投資用不動産の取得、運用、売却判断に必要な市場データを確認できます。"]
  ],
  "マンション査定システム": [
    ["マンション価格査定", "東京カンテイのデータをもとに、マンションの売買価格査定を行えます。"],
    ["査定書作成", "査定根拠や周辺事例を含む提案資料を作成できます。"],
    ["相場情報確認", "対象マンションや周辺エリアの価格相場を確認できます。"]
  ],
  "土地査定システム": [
    ["土地価格査定", "土地の所在、面積、接道、用途地域などをもとに価格査定を行えます。"],
    ["査定書作成", "土地査定の根拠情報を整理し、売主提案や買付検討用の資料を作成できます。"],
    ["周辺事例確認", "周辺の土地取引や相場情報を確認できます。"]
  ],
  "カタログコピーサービス": [
    ["マンション情報取得", "マンションの分譲時情報、建物概要、カタログ情報を確認できます。"],
    ["販売資料補完", "中古マンションの販売資料や調査資料を作る際の参考情報として使えます。"],
    ["物件調査支援", "建物仕様や過去情報を確認し、査定・販売前の調査に活用できます。"]
  ],
  "マンション相場Plus": [
    ["マンション相場確認", "マンションごとの価格相場や周辺相場を確認できます。"],
    ["売却提案資料", "売主に提示する価格提案や相場説明の資料作成に使えます。"],
    ["取引事例確認", "周辺の取引事例を確認し、価格妥当性の検討に活用できます。"]
  ],
  "土地相場Plus": [
    ["土地相場確認", "土地の価格相場や周辺取引の傾向を確認できます。"],
    ["査定根拠整理", "土地査定や買付検討時に、周辺相場を根拠として整理できます。"],
    ["営業提案支援", "土地所有者への売却提案や仕入れ検討資料に活用できます。"]
  ],
  Facilo: [
    ["物件提案サポート機能", "検索条件の読み込み、新着物件の確認、価格改定物件の把握、販売図面の帯替え、コメント追加をクラウド上で行えます。"],
    ["お客様マイページ機能", "顧客ごとの専用マイページで提案物件、地図、周辺情報、内見候補をまとめて比較・検討できます。"],
    ["販売活動報告", "売主向けに反響、内見、提案状況などの販売活動をクラウドで共有できます。"],
    ["顧客ログ・ダッシュボード", "顧客の閲覧状況や反応を確認し、次に連絡すべき顧客や提案内容の判断に使えます。"]
  ],
  "フォレストPRO": [
    ["物件取込", "レインズやATBBなどから物件情報を取り込み、営業資料作成に使えます。"],
    ["販売図面編集・帯替え", "販売図面の編集、帯替え、レイアウト調整を効率化できます。"],
    ["AI-OCR", "資料から物件情報を読み取り、入力や転記の負担を減らせます。"],
    ["顧客向け共有", "顧客マイページなどを通じて物件情報や提案資料を共有できます。"]
  ],
  "いえらぶCLOUD": [
    ["物件管理", "賃貸・売買物件の登録、更新、公開、社内共有を一元管理できます。"],
    ["ポータルサイト連動", "登録した物件情報を複数ポータルへ出稿し、掲載情報の更新を効率化できます。"],
    ["反響取込・顧客管理", "ポータル反響を取り込み、顧客情報、希望条件、追客状況を管理できます。"],
    ["広告表示チェック", "物件情報の入力不備や広告掲載上の注意点を確認し、掲載ミスを防ぎます。"]
  ],
  "いい生活 売買クラウド": [
    ["売買物件管理", "売買物件の登録、公開、更新、社内共有をクラウドで管理できます。"],
    ["顧客管理", "購入検討者や売却相談者の情報、希望条件、対応履歴を管理できます。"],
    ["広告出稿", "物件情報をポータルや自社サイトへ出稿し、掲載業務を効率化できます。"],
    ["店舗間情報共有", "複数店舗・複数担当者で物件や顧客情報を共有できます。"]
  ],
  ATBB: [
    ["物件情報登録・公開", "加盟店向けに物件情報を登録し、BtoB流通やエンドユーザー向け公開に使えます。"],
    ["物件検索・入手", "アットホームの不動産情報ネットワーク上で流通物件を検索・入手できます。"],
    ["不動産データ活用", "不動産調査や査定に役立つ各種データを取得し、営業・提案に活用できます。"],
    ["接客・追客支援", "顧客への物件提案、比較、共有などの接客業務を支援します。"]
  ],
  "スマート契約": [
    ["電子契約", "賃貸借契約や売買関連書類の契約手続きをオンラインで進められます。"],
    ["IT重説対応", "重要事項説明のオンライン化に必要な契約者対応や書類展開を支援します。"],
    ["契約書類管理", "契約書、添付書類、関連書面をクラウド上で保管・確認できます。"]
  ],
  Digima: [
    ["オンライン営業AI", "反響後の顧客対応や来場促進をAIが自動で行い、成約に近い接点づくりを支援します。"],
    ["反響自動取込", "ポータルサイトなどから届く反響情報を取り込み、顧客データを更新できます。"],
    ["自動追客", "顧客の検討状況に合わせてメール、SMS、LINEなどで追客できます。"],
    ["ホットリード抽出", "顧客の反応や行動をもとに、優先対応すべき見込み客を把握できます。"]
  ],
  KASIKA: [
    ["顧客管理", "買主・売主の顧客情報、希望条件、対応履歴を管理できます。"],
    ["自動追客", "中長期顧客にメールやコンテンツを自動配信し、継続接点を作れます。"],
    ["見込み顧客抽出", "Web閲覧や反応データから、今アプローチすべき顧客を抽出できます。"],
    ["AIレコメンド", "顧客の行動履歴をもとに、追客文面や提案内容の作成を支援します。"]
  ],
  PICKFORM: [
    ["電子契約", "不動産取引に関わる契約書類の締結をオンラインで行えます。"],
    ["本人確認", "契約前後の本人確認や当事者確認をオンラインで進められます。"],
    ["契約管理", "契約書、締結状況、関連書類をクラウド上で管理できます。"]
  ],
  "ア・ソコ": [
    ["空き家・空き地情報管理", "空き家や空き地の候補情報を登録し、地図やリストで管理できます。"],
    ["所有者アプローチ支援", "所有者調査や営業候補の整理に使えます。"],
    ["案件管理", "仕入れ・媒介獲得に向けた接触履歴や進捗を管理できます。"]
  ],
  "登記簿図書館": [
    ["登記情報取得", "不動産登記情報をオンラインで取得・確認できます。"],
    ["図面情報取得", "公図、地積測量図、建物図面などの図面情報を取得できます。"],
    ["物件調査支援", "登記と図面をまとめて確認し、売買前の物件調査に活用できます。"]
  ],
  ROOV: [
    ["3D空間コンテンツ", "モデルルームや住戸を3Dで再現し、オンライン上で体験できるコンテンツを提供できます。"],
    ["オンライン接客", "顧客が遠隔から住戸や間取りを確認でき、営業担当の説明にも使えます。"],
    ["検討ログ活用", "顧客の閲覧状況や関心を把握し、次回提案や接客に活用できます。"]
  ],
  "スペースリー": [
    ["VRコンテンツ作成", "360度画像やVRコンテンツを作成し、物件案内に利用できます。"],
    ["オンライン内見", "来店前や遠隔地の顧客に、オンラインで物件の室内を案内できます。"],
    ["VR研修・共有", "物件情報や現場情報をVRで共有し、接客や社内教育にも活用できます。"]
  ],
  "OFFICE RESEARCH": [
    ["オフィス物件検索", "オフィスビルや事業用不動産の物件情報を検索できます。"],
    ["マーケット情報確認", "賃料、空室、立地などのオフィスマーケット情報を確認できます。"],
    ["営業提案資料", "移転提案やリーシング提案に使う物件・市場情報を整理できます。"]
  ],
  "WealthPark Business": [
    ["オーナーアプリ", "不動産オーナー向けに収支、報告、契約、連絡をアプリで共有できます。"],
    ["収支・レポート共有", "月次収支や運用レポートをオーナーへオンラインで提供できます。"],
    ["問い合わせ・承認管理", "修繕承認や問い合わせ対応をアプリ上で管理できます。"],
    ["資産管理ダッシュボード", "複数物件の収益や稼働状況をまとめて確認できます。"]
  ],
  "GMO賃貸DX": [
    ["オーナーアプリ", "賃貸オーナーとの連絡、収支共有、報告業務をアプリで行えます。"],
    ["入居者アプリ", "入居者からの問い合わせ、申請、連絡をアプリで受け付けられます。"],
    ["電子契約・申込連携", "賃貸契約や申込手続きのオンライン化により、紙と郵送の業務を減らせます。"],
    ["管理会社向け業務連携", "賃貸管理会社の基幹業務とオーナー・入居者対応をつなげます。"]
  ],
  "管理ロイド": [
    ["建物点検管理", "点検項目、写真、報告内容を現場で入力し、建物管理業務を標準化できます。"],
    ["報告書作成", "現場で登録した写真やコメントから点検・清掃・巡回報告書を作成できます。"],
    ["修繕・是正管理", "不具合や修繕依頼を登録し、対応状況を追跡できます。"]
  ],
  ANDPAD: [
    ["施工管理", "工事写真、図面、工程、検査、報告をクラウドで管理できます。"],
    ["工程管理", "工事の進捗、担当、期限を可視化し、関係者間で共有できます。"],
    ["図面・資料共有", "現場関係者が最新の図面や資料を確認できます。"],
    ["チャット・掲示板", "現場ごとの連絡や確認事項を一元化できます。"]
  ],
  KANNA: [
    ["案件管理", "工事、修繕、点検などの案件情報をクラウドで管理できます。"],
    ["写真・報告管理", "現場写真や作業報告をスマートフォンから登録できます。"],
    ["工程・タスク管理", "作業予定、担当者、進捗を見える化できます。"],
    ["協力会社共有", "社内外の関係者と案件情報、写真、資料を共有できます。"]
  ],
  SPIDERPLUS: [
    ["図面管理", "現場図面をタブレットで確認し、位置情報と紐づけて記録できます。"],
    ["写真管理", "施工写真や検査写真を図面上の位置とあわせて管理できます。"],
    ["検査・帳票作成", "配筋検査、仕上検査、設備検査などの記録と帳票作成を支援します。"]
  ],
  Musubell: [
    ["契約書類作成機能", "ブラウザ上で契約書類を作成・保存・送信できます。"],
    ["書類管理", "契約書類や関連データをカテゴリ分けしてクラウド上で一元管理できます。"],
    ["電子契約", "重説、売買契約、媒介契約、覚書などの電子契約依頼を送信できます。"],
    ["社内承認フロー設定", "契約送信前の社内承認フローを設定し、承認後に契約手続きを進められます。"],
    ["マイページ機能", "契約者ごとにマイページを発行し、書類原本データをダウンロードできるようにします。"],
    ["CRMツール連携", "外部CRMと連携し、顧客管理と契約管理を分けて運用できます。"]
  ]
};
const sourceLinksFor = (column) => {
  const sources = columnSourcesFor(column);
  const byUrl = new Map(sources.map((source) => [source.url, source]));
  return [...new Set([...(column.sourceUrls || []), ...sources.map((source) => source.url)])]
    .map((url) => byUrl.get(url) || { title: url.replace(/^https?:\/\//, ""), source: "参考リンク", url });
};

function serviceHeroHtml(service) {
  const hero = serviceHeroImages[service.service];
  if (!hero) return "";
  return `
      <figure class="service-key-visual">
        <img src="${escapeAttr(hero.src)}" alt="${escapeAttr(hero.alt)}" loading="eager">
      </figure>`;
}

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

function featureOverview(feature, service, relatedCases) {
  const matchedCase = relatedCases.find((item) => (item.tasks || []).includes(feature) || (item.summary || "").includes(feature));
  if (matchedCase) {
    return `${matchedCase.adopter}の公開導入事例では、${trimSentence(matchedCase.summary)}。${feature}を実務で使う場面を確認できます。`;
  }

  if ((service.tasks || []).includes(feature) || (service.targetUseCases || []).includes(feature)) {
    const processText = shortList(service.processes, 2);
    const effectText = service.effects?.[0] ? `導入後は${trimSentence(service.effects[0])}ことが期待されます。` : "";
    return `${processText ? `${processText}の` : ""}${feature}業務で、情報整理、判断材料の確認、担当者間の共有を支援します。${effectText}`;
  }

  if ((service.tags || []).includes(feature)) {
    const painText = service.painPoints?.[0] ? `特に「${trimSentence(service.painPoints[0])}」という課題に対応します。` : "";
    return `${service.service}の公式情報で確認できる中核領域です。${painText || trimSentence(service.summary || service.description)}。`;
  }

  return `${service.service}のサービス説明と公開情報から整理した提供内容です。${trimSentence(service.summary || service.description)}。`;
}

function serviceFeatureRows(service, relatedCases) {
  if (serviceFeatureOverrides[service.service]) {
    return serviceFeatureOverrides[service.service].map(([name, overview]) => ({ name, overview }));
  }

  return uniqueItems([...(service.solutions || []), ...(service.tags || []), ...(service.targetUseCases || [])])
    .slice(0, 10)
    .map((feature) => ({ name: feature, overview: featureOverview(feature, service, relatedCases) }));
}

function featureTable(service, relatedCases) {
  const rows = serviceFeatureRows(service, relatedCases);
  if (!rows.length) return "<p>公式サイト上で確認できる主な機能は未整理です。導入検討時は提供会社に詳細を確認してください。</p>";

  return `
        <div class="feature-table-wrap">
          <table class="feature-table">
            <thead>
              <tr>
                <th scope="col">主な機能名</th>
                <th scope="col">概要</th>
              </tr>
            </thead>
            <tbody>
              ${rows.map((feature) => `
                <tr>
                  <th scope="row">${escapeHtml(feature.name)}</th>
                  <td>${escapeHtml(feature.overview)}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>`;
}

function caseInsightHtml(service, relatedCases) {
  if (service.service === "REMETIS") {
    return `
        <p>不動産開発、売買仲介、総合商社、建設・開発など様々な業種にまたがって導入されており、物件情報整理、DD管理、事業企画、事業収支作成、売却提案、買主探索、ソーシングなど幅広い業務で使われているようです。単にツールを入れるというより、既存のExcel、紙、個別連絡、属人的な進捗管理を置き換え、案件や顧客、物件、契約、修繕などの情報をチームで扱える状態にする用途が多く見られます。</p>`;
  }

  if (!relatedCases.length) {
    return `
        <p>公開されている導入事例は確認できていません。公式サイトで示されている対象業務や提供機能を見る限り、${shortList(service.targetUseCases || service.tasks, 5) || "対象業務"}の標準化や情報共有に使うサービスとして検討できます。</p>
        <p>導入前には、提供会社へ同種業務、同規模企業、同じアセットタイプでの利用実績を確認し、初期設定、データ移行、運用定着の支援範囲まで確認してください。</p>`;
  }

  const adopters = shortList(relatedCases.map((item) => item.adopter), 5);
  const industries = shortList(relatedCases.map((item) => item.industry), 4);
  const tasks = shortList(relatedCases.flatMap((item) => item.tasks || []), 7);

  return `
        <p>${industries || "複数業種"}などの導入事例が公開されており、${tasks || shortList(service.targetUseCases || service.tasks, 7)}などの業務で使われているようです。${adopters}などの事例を見ると、既存のExcel、紙、個別連絡、属人的な進捗管理を置き換え、関係者が同じ情報を見ながら業務を進める用途が多く見られます。</p>`;
}

function caseLinksHtml(relatedCases) {
  if (!relatedCases.length) return "<span class=\"empty-case-note\">公開導入事例は未確認です。</span>";
  return relatedCases.slice(0, 10).map((item) => `
          <a href="${escapeAttr(item.url)}" target="_blank" rel="noreferrer">
            <span>${escapeHtml(item.adopter)}</span>
            <small>${escapeHtml([item.industry, shortList(item.tasks, 3)].filter(Boolean).join(" / "))}</small>
          </a>
        `).join("");
}

function sectionParts(section) {
  const [heading, ...rest] = section.split("::");
  return { heading: heading || "本文", body: rest.join("::") || section };
}

function pageShell({ title, description, canonical, body, structuredData = [], ogImage = "../../assets/proptech-hero.png" }) {
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
    <meta property="og:image" content="${escapeAttr(ogImage)}">
    <meta property="og:url" content="${escapeAttr(canonical)}">
    <link rel="canonical" href="${escapeAttr(canonical)}">
    <link rel="icon" href="../../assets/favicon.svg" type="image/svg+xml">
    <link rel="stylesheet" href="../../style.css">
    <script src="/analytics.js" defer></script>
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
      ${serviceHeroHtml(service)}
      <section class="detail-block">
        <h2>サマリー</h2>
        <p>${escapeHtml(service.summary || service.description)}</p>
      </section>
      <section class="detail-block">
        <h2>主なターゲット</h2>
        <div class="detail-grid">
          <div><h3>業種・職種</h3><div class="service-meta">${pillList([...(service.targetIndustries || []), ...(service.targetRoles || [])])}</div></div>
          <div><h3>対象業務</h3><div class="service-meta">${pillList([...(service.processes || []), ...(service.tasks || [])])}</div></div>
          <div><h3>分類・アセット</h3><div class="service-meta">${pillList([...(service.tags || []), ...(service.assetTypes || [])])}</div></div>
        </div>
      </section>
      <section class="detail-block"><h2>課題</h2><ul>${listItems(service.painPoints)}</ul></section>
      <section class="detail-block feature-block"><h2>主な機能・提供内容</h2>${featureTable(service, relatedCases)}</section>
      <section class="detail-block"><h2>導入後の効果</h2><ul>${listItems(service.effects)}</ul></section>
      <section class="detail-block case-insight-block">
        <h2>導入事例から見える使われ方</h2>
        ${caseInsightHtml(service, relatedCases)}
        <div class="case-link-list">${caseLinksHtml(relatedCases)}</div>
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

const itSubsidyAnnouncementLinks = new Map([
  ["いえらぶCLOUD", "https://www.ielove-group.jp/news/detail-1098"],
  ["いい生活 売買クラウド", "https://prtimes.jp/main/html/rd/p/000000160.000003214.html"],
  ["Facilo", "https://www.facilo.jp/campaign/it_hojo"],
  ["PICKFORM", "https://prtimes.jp/main/html/rd/p/000000051.000097941.html"],
  ["REMETIS", "https://www.restar-inc.com/news/news-1517/"]
]);

function comparisonTable(services, comparison) {
  if (!services.length) return "";
  const comparisonFeatures = (service) => serviceFeatureRows(service, serviceCases(service));
  const featureNames = (service) => comparisonFeatures(service).map((feature) => feature.name).join("、");
  const featureDigest = (service) => comparisonFeatures(service)
    .slice(0, 3)
    .map((feature) => `${feature.name}：${feature.overview}`)
    .join(" ");
  const rows = [
    ["提供会社", (service) => service.company],
    ["概要", (service) => service.summary || service.description],
    ["主な機能", featureNames],
    ["できること", featureDigest],
    ["対象プロセス", (service) => (service.processes || []).join("、")],
    ["対応業務", (service) => (service.tasks || []).join("、")],
    ["アセットタイプ", (service) => (service.assetTypes || []).join("、")]
  ];
  if ((comparison.title || "").includes("IT導入補助金")) {
    rows.push(["IT導入補助金対応の公表ページ", (service) => {
      const url = itSubsidyAnnouncementLinks.get(service.service);
      return url
        ? `<a href="${escapeAttr(url)}" target="_blank" rel="noreferrer">${escapeHtml(service.service)}の公表ページ</a>`
        : "公表ページ未確認";
    }, true]);
  }
  return `
    <section class="comparison-table-section">
      <div class="section-heading">
        <p class="eyebrow">Comparison Table</p>
        <h2>サービス比較表</h2>
      </div>
      <div class="comparison-table-wrap" role="region" aria-label="サービス比較表" tabindex="0">
        <table class="comparison-table">
          <thead>
            <tr>
              <th scope="col">比較項目</th>
              ${services.map((service) => `<th scope="col"><a href="../../${serviceUrl(service)}index.html">${escapeHtml(service.service)}</a></th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${rows.map(([label, getter, allowHtml]) => `
              <tr>
                <th scope="row">${escapeHtml(label)}</th>
                ${services.map((service) => {
                  const value = getter(service) || "要確認";
                  return `<td>${allowHtml ? value : escapeHtml(value)}</td>`;
                }).join("")}
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function sourceLinksFromUrls(urls = []) {
  const sourceLabels = new Map([
    ["https://it-shien.smrj.go.jp/about", "デジタル化・AI導入補助金制度概要"],
    ["https://it-shien.smrj.go.jp/itvendor/about", "IT導入支援事業者とは"],
    ["https://it-shien.smrj.go.jp/itvendor/procedure/ittool", "ITツールの登録申請"],
    ["https://it-shien.smrj.go.jp/applicant/subsidy/normal", "通常枠"],
    ["https://it-shien.smrj.go.jp/applicant/subsidy/digitalbase", "インボイス枠（インボイス対応類型）"],
    ["https://it-shien.smrj.go.jp/faq", "よくあるご質問"],
    ["https://it-shien.smrj.go.jp/contact", "お問い合わせ・相談窓口"]
  ]);
  return uniqueItems(urls).map((url) => {
    const key = url.replace(/\/$/, "");
    return {
      url,
      title: sourceLabels.get(key) || url.replace(/^https?:\/\//, "").replace(/\/$/, "")
    };
  });
}

function comparisonPage(comparison) {
  const canonical = `${siteUrl}/${comparisonUrl(comparison)}`;
  const articleTitle = comparison.seoTitle || comparison.title;
  const title = `${articleTitle} | 業務別サービス比較 | 不動産売買向けプロップテックガイド`;
  const description = truncate(`${articleTitle}。${comparison.lead || comparison.summary || "不動産会社向けに主要サービスの違い、選定ポイント、導入前の注意点を整理。"}`, 155);
  const sections = (comparison.body || []).map(sectionParts);
  const relatedServices = (comparison.relatedServices || [])
    .map(serviceByName)
    .filter(Boolean)
    .filter((service) => !(comparison.title || "").includes("IT導入補助金") || itSubsidyAnnouncementLinks.has(service.service));
  const sourceLinks = sourceLinksFromUrls(comparison.sourceUrls);
  const heroImage = comparison.heroImage || "../../assets/proptech-hero.png";
  const heroAlt = comparison.heroAlt || `${articleTitle}のキービジュアル`;
  const body = `
    <a class="back-link" href="../../index.html#services">業務別サービス比較へ戻る</a>
    <article class="comparison-detail-article">
      <div class="column-detail-hero">
        <div class="column-hero-copy">
          <p class="eyebrow">Comparison Column</p>
          <div class="column-card-head">
            ${(comparison.processes || []).map((process) => `<span class="pill process-pill">${escapeHtml(processLabels[process] || process)}</span>`).join("")}
          </div>
          <h1>${escapeHtml(articleTitle)}</h1>
          <p class="detail-lead">${escapeHtml(comparison.lead)}</p>
        </div>
        <figure class="comparison-key-visual">
          <img src="${escapeAttr(heroImage)}" alt="${escapeAttr(heroAlt)}" loading="eager">
        </figure>
      </div>
      <section class="column-message"><p>${escapeHtml(comparison.summary || comparison.lead)}</p></section>
      ${comparisonTable(relatedServices, comparison)}
      <section class="column-detail-body">
        <div class="section-heading"><p class="eyebrow">Guide</p><h2>比較の観点</h2></div>
        ${sections.map((section, index) => `<section class="column-step-section"><div class="step-number">${String(index + 1).padStart(2, "0")}</div><div><h3>${escapeHtml(section.heading)}</h3><p>${escapeHtml(section.body)}</p></div></section>`).join("")}
      </section>
      ${sourceLinks.length ? `<section class="column-detail-sources">
        <h2>参考リンク</h2>
        <ul>${sourceLinks.map((source) => `<li><a href="${escapeAttr(source.url)}" target="_blank" rel="noreferrer">${escapeHtml(source.title)}</a><span>参考リンク</span></li>`).join("")}</ul>
      </section>` : ""}
    </article>`;
  return pageShell({
    title,
    description,
    canonical,
    body,
    ogImage: heroImage,
    structuredData: [{
      "@context": "https://schema.org",
      "@type": "Article",
      headline: articleTitle,
      description: comparison.lead,
      inLanguage: "ja",
      about: [
        ...(comparison.processes || []),
        ...(comparison.tasks || []),
        ...(comparison.tags || [])
      ],
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
    ...data.columns.map((column) => ({ loc: `${siteUrl}/${columnUrl(column)}`, priority: "0.8" })),
    ...data.serviceComparisons.map((comparison) => ({ loc: `${siteUrl}/${comparisonUrl(comparison)}`, priority: "0.8" }))
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

await Promise.all([
  rm(join(root, "services"), { recursive: true, force: true }),
  rm(join(root, "columns"), { recursive: true, force: true }),
  rm(join(root, "comparisons"), { recursive: true, force: true })
]);

for (const service of data.services) {
  const dir = join(root, "services", service.slug);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, "index.html"), servicePage(service), "utf8");
}

for (const column of data.columns) {
  const dir = join(root, "columns", column.slug);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, "index.html"), columnPage(column), "utf8");
}

for (const comparison of data.serviceComparisons) {
  const dir = join(root, "comparisons", comparison.slug);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, "index.html"), comparisonPage(comparison), "utf8");
}

await writeFile(join(root, "sitemap.xml"), sitemapXml(), "utf8");
