const categories = [
  "すべて",
  "売買仲介",
  "売却査定",
  "物件ポータル",
  "買取再販",
  "投資・クラファン",
  "マーケット情報",
  "AI OCR",
  "登記情報",
  "電子契約",
  "CRM・営業支援",
  "物件調査",
  "事業用・物流",
  "賃貸・管理",
  "空き家・相続",
];

const services = [
  ["REMETIS", "マーケット情報", "不動産投資・開発判断向けのマーケットリサーチ、物件分析、調査支援。", "売買調査", "https://www.remetis.jp/"],
  ["OFFICE RESEARCH", "事業用・物流", "オフィスビル市場の物件・賃料・空室などを調査する事業用不動産データサービス。", "オフィス", "https://www.vortex-net.com/service/officeresearch/"],
  ["スマサテ", "売却査定", "賃料・売買査定、収益価格の把握に使える不動産会社向けクラウド。", "査定", "https://sumasate.jp/"],
  ["ア・ソコ", "物件調査", "不動産仲介向けに役所調査や現地調査の負担を減らす物件調査支援。", "調査", "https://evort.jp/idea-log/product/asoko"],
  ["SRE AI査定CLOUD", "売却査定", "AIで売買価格を査定し、査定書作成や根拠提示を支援。", "AI査定", "https://sre-ai-partners.co.jp/service/cloud/ai-assessment.html"],
  ["TAS-MAP", "マーケット情報", "不動産評価、賃料査定、空室率などの分析に使われる不動産データサービス。", "評価", "https://corporate.tas-japan.com/service/tas-map/"],
  ["不動産情報ライブラリ", "マーケット情報", "国土交通省が提供する価格、地価、防災、都市計画などの不動産関連情報。", "公的情報", "https://www.reinfolib.mlit.go.jp/"],
  ["REINS Market Information", "マーケット情報", "指定流通機構の成約情報を一般向けに公開する売買相場確認サービス。", "成約相場", "https://www.contract.reins.or.jp/"],
  ["東京カンテイ", "マーケット情報", "マンション価格、賃料、流通データなどの調査・レポートを提供。", "市場分析", "https://www.kantei.ne.jp/"],
  ["マンションレビュー", "マーケット情報", "マンション相場、口コミ、売却査定導線を持つマンション情報サービス。", "相場", "https://www.mansion-review.jp/"],
  ["住まいサーフィン", "マーケット情報", "マンション価格、沖式新築時価、資産価値情報を提供。", "マンション", "https://www.sumai-surfin.com/"],
  ["土地総合情報システム", "マーケット情報", "土地取引価格や地価公示などを確認できる国土交通省の情報サイト。", "土地価格", "https://www.land.mlit.go.jp/webland/"],
  ["地価マップ", "マーケット情報", "路線価、固定資産税路線価、地価公示などを地図で確認。", "地価", "https://www.chikamap.jp/"],
  ["J-REIT DB", "マーケット情報", "J-REIT銘柄、物件、利回り、開示情報の確認に使える情報サービス。", "投資情報", "https://j-reit.jp/"],
  ["GEEO", "マーケット情報", "地価や周辺環境などから不動産価格の推定・分析を行うサービス。", "価格推定", "https://geeo.otani.co/"],
  ["SUUMO", "物件ポータル", "売買物件、新築、中古、土地などを横断して探せる大手ポータル。", "集客", "https://suumo.jp/"],
  ["LIFULL HOME'S", "物件ポータル", "売買・賃貸・注文住宅などを扱う総合不動産ポータル。", "集客", "https://www.homes.co.jp/"],
  ["at home", "物件ポータル", "加盟店ネットワークと物件流通を持つ不動産情報サービス。", "集客", "https://www.athome.co.jp/"],
  ["Yahoo!不動産", "物件ポータル", "中古マンション、戸建て、土地などを探せる不動産情報サービス。", "集客", "https://realestate.yahoo.co.jp/"],
  ["ニフティ不動産", "物件ポータル", "複数ポータルの物件情報を横断検索できる不動産検索サービス。", "横断検索", "https://myhome.nifty.com/"],
  ["オウチーノ", "物件ポータル", "購入、売却、リフォームなど住まいの情報を扱うポータル。", "集客", "https://www.o-uccino.com/"],
  ["カウカモ", "買取再販", "中古・リノベーション住宅の購入体験をオンラインで支援。", "中古住宅", "https://cowcamo.jp/"],
  ["FLIE", "買取再販", "中古住宅の直接販売を軸に、手数料を抑えた購入体験を提供。", "中古住宅", "https://flie.jp/"],
  ["リノベる。", "買取再販", "中古購入とリノベーションを一体で支援する住まいサービス。", "リノベ", "https://www.renoveru.jp/"],
  ["RENOSY", "投資・クラファン", "不動産投資、購入後管理、売却までを支援するオンラインサービス。", "投資", "https://www.renosy.com/"],
  ["HOME4U", "売却査定", "不動産売却一括査定の老舗サービス。", "一括査定", "https://www.home4u.jp/"],
  ["イエウール", "売却査定", "全国対応の不動産売却一括査定サービス。", "一括査定", "https://ieul.jp/"],
  ["すまいステップ", "売却査定", "優良会社に絞った売却査定依頼を訴求するサービス。", "一括査定", "https://sumai-step.com/"],
  ["おうちクラベル", "売却査定", "AI査定と不動産会社査定を組み合わせた売却支援。", "AI査定", "https://realestate-od.jp/"],
  ["リビンマッチ", "売却査定", "不動産売却、土地活用、賃貸管理などの比較サービス。", "比較", "https://www.lvnmatch.jp/"],
  ["マンションナビ", "売却査定", "マンション売却に特化した価格相場・査定サービス。", "マンション", "https://t23m-navi.jp/"],
  ["いえカツLIFE", "売却査定", "売却、買取、リースバックなど複数の出口を比較。", "売却比較", "https://iekatu-life.com/"],
  ["イエイ", "売却査定", "不動産売却の一括査定、会社比較を行うサービス。", "一括査定", "https://sell.yeay.jp/"],
  ["RE-Guide", "売却査定", "不動産売却査定や投資物件情報を扱う比較サービス。", "比較", "https://www.re-guide.jp/"],
  ["IESHIL", "売却査定", "マンション参考相場や売却相談を提供するマンション情報サービス。", "相場", "https://www.ieshil.com/"],
  ["HowMa", "売却査定", "AIで住宅価格を推定し、売却相談につなげるサービス。", "AI査定", "https://www.how-ma.com/"],
  ["10秒でDo", "売却査定", "ハウスドゥが提供する不動産価格査定アプリ。", "査定", "https://www.housedo.com/"],
  ["Gate.", "売却査定", "不動産投資向けのAI査定・シミュレーション。", "投資査定", "https://gate.estate/"],
  ["Facilo", "CRM・営業支援", "売買仲介の顧客提案、物件共有、追客を一元化する営業支援。", "仲介DX", "https://www.facilo.jp/"],
  ["Digima", "CRM・営業支援", "不動産・住宅業界向けの反響対応、追客、MA、CRM。", "追客", "https://digima.com/"],
  ["KASIKA", "CRM・営業支援", "住宅・不動産向けの顧客育成、営業活動可視化、追客支援。", "MA", "https://www.kasika.io/"],
  ["いえらぶCLOUD", "CRM・営業支援", "物件管理、集客、反響、契約、業務管理を扱う不動産業務クラウド。", "業務基盤", "https://ielove-cloud.jp/"],
  ["いい生活 売買クラウド", "CRM・営業支援", "売買仲介会社向けの物件管理、顧客管理、Web掲載支援。", "仲介業務", "https://www.es-service.net/"],
  ["ノマドクラウド", "CRM・営業支援", "不動産仲介向けの顧客管理、追客、LINE連携。", "反響対応", "https://nomad-cloud.jp/"],
  ["売買革命", "CRM・営業支援", "不動産売買仲介向けの物件・顧客・営業支援システム。", "売買業務", "https://www.n-create.co.jp/"],
  ["みらいえ", "CRM・営業支援", "不動産会社向けホームページ、物件管理、営業支援サービス。", "集客", "https://miraie-net.com/"],
  ["Musubell", "電子契約", "不動産売買契約書、重要事項説明書などの文書作成・電子契約を支援。", "契約DX", "https://www.musubell.com/"],
  ["PICKFORM", "電子契約", "不動産・建築領域に特化した電子契約、本人確認、案件管理。", "電子契約", "https://pick-hp.com/pickform"],
  ["クラウドサイン", "電子契約", "契約締結、保管、ワークフローをオンライン化する電子契約サービス。", "電子署名", "https://www.cloudsign.jp/"],
  ["GMOサイン", "電子契約", "電子署名、契約管理、本人確認と連携しやすい電子契約サービス。", "電子署名", "https://www.gmosign.com/"],
  ["DocuSign", "電子契約", "グローバルで使われる電子署名・契約管理サービス。", "電子署名", "https://www.docusign.com/ja-jp"],
  ["Hubble", "電子契約", "契約書レビュー、管理、ナレッジ共有を支援する契約業務クラウド。", "契約管理", "https://hubble-docs.com/"],
  ["LegalForce", "電子契約", "AI契約書レビューと契約リスク管理を支援。", "契約審査", "https://legalforce-cloud.com/"],
  ["DX Suite", "AI OCR", "紙書類、帳票、申込書などをAI OCRでデータ化。", "書類読取", "https://inside.ai/products/dx-suite/"],
  ["SmartRead", "AI OCR", "さまざまな帳票をOCRし、取引書類や社内文書のデータ化を支援。", "帳票", "https://www.crestec.co.jp/smartread/"],
  ["AIよみとーる", "AI OCR", "NTT東日本のAI OCR。紙帳票をデータ化し業務入力を削減。", "帳票", "https://business.ntt-east.co.jp/service/aiocr/"],
  ["CLOVA OCR", "AI OCR", "定型・非定型書類の文字認識、本人確認書類読取などに利用可能。", "本人確認", "https://www.lycbiz.com/jp/service/clova-ocr/"],
  ["Tegaki", "AI OCR", "手書き文字を含む帳票読取に強いAI OCRサービス。", "手書き", "https://www.tegaki.ai/"],
  ["AnyForm OCR", "AI OCR", "非定型帳票の文字読取とデータ化を支援。", "非定型", "https://www.hammock.jp/anyform/"],
  ["登記情報提供サービス", "登記情報", "登記簿、公図、地積測量図などの登記情報をオンラインで確認。", "登記", "https://www1.touki.or.jp/"],
  ["登記簿図書館", "登記情報", "登記簿、図面、ブルーマップなどの取得・閲覧を支援。", "登記", "https://登記簿図書館.com/"],
  ["GVA 法人登記", "登記情報", "法人登記の手続きをオンラインで支援するリーガルテック。", "法人登記", "https://corporate.ai-con.lawyer/"],
  ["Graffer法人証明書請求", "登記情報", "登記事項証明書など行政手続きのオンライン請求を支援。", "証明書", "https://graffer.jp/"],
  ["ブルーマップ", "登記情報", "住居表示、地番、用途地域など物件調査に使う地図情報。", "地番", "https://www.zenrin.co.jp/product/category/residentialmap/bluemap/"],
  ["JTNマップ", "登記情報", "不動産調査で使う地番、登記、住宅地図系情報の確認に活用。", "地図", "https://www.jtn-map.com/"],
  ["役所調査ドットコム", "物件調査", "用途地域、道路、ライフラインなど役所調査の外注・代行。", "役所調査", "https://yakusho-chosa.com/"],
  ["スペースリー", "物件調査", "VR内見、3Dツアー、オンライン接客で売買・賃貸の内見体験を支援。", "VR", "https://spacely.co.jp/"],
  ["ROOV", "物件調査", "新築マンション販売向けの3D、VR、オンライン接客支援。", "3D販売", "https://roov.jp/"],
  ["ナーブクラウド", "物件調査", "VR内見、遠隔接客、オンライン商談を支援。", "VR", "https://www.nurve.jp/"],
  ["Matterport", "物件調査", "3Dスキャンで物件の空間情報を可視化。", "3D", "https://matterport.com/ja"],
  ["THETA 360.biz", "物件調査", "360度画像を使った物件内見コンテンツを制作・公開。", "360画像", "https://www.theta360.biz/"],
  ["ITANDI BB", "賃貸・管理", "不動産会社間流通、内見予約、申込、契約をオンライン化。", "業者間流通", "https://itandibb.com/"],
  ["申込受付くん", "賃貸・管理", "賃貸入居申込をオンライン化し、管理会社と仲介会社の連携を効率化。", "申込", "https://lp.itandibb.com/moushikomi-uketsukekun/"],
  ["電子契約くん", "賃貸・管理", "賃貸借契約の電子契約を支援するITANDI系サービス。", "賃貸契約", "https://lp.itandibb.com/denshikeiyaku-kun/"],
  ["OHEYAGO", "賃貸・管理", "セルフ内見、オンライン申込に対応した賃貸検索サービス。", "内見", "https://oheyago.jp/"],
  ["WealthPark Business", "賃貸・管理", "管理会社とオーナーの報告、収支、承認、コミュニケーションをデジタル化。", "オーナー対応", "https://wealth-park.com/ja/business/"],
  ["GMO賃貸DX", "賃貸・管理", "賃貸管理会社向けにオーナー・入居者アプリや業務DXを提供。", "管理DX", "https://chintaidx.com/"],
  ["管理ロイド", "賃貸・管理", "建物管理、点検、報告、写真台帳など現場業務をクラウド化。", "建物管理", "https://kanri-roid.app/"],
  ["totono", "賃貸・管理", "入居者対応、問い合わせ、修繕受付を効率化する管理会社向けサービス。", "入居者対応", "https://totono.app/"],
  ["CREAL", "投資・クラファン", "不動産クラウドファンディングで個人投資家に物件投資機会を提供。", "クラファン", "https://creal.jp/"],
  ["COZUCHI", "投資・クラファン", "不動産投資クラウドファンディングサービス。", "クラファン", "https://cozuchi.com/"],
  ["OwnersBook", "投資・クラファン", "不動産担保ローンやエクイティ型案件を扱う投資サービス。", "投資", "https://www.ownersbook.jp/"],
  ["Rimple", "投資・クラファン", "不動産投資型クラウドファンディング。", "クラファン", "https://funding.propertyagent.co.jp/"],
  ["property+", "投資・クラファン", "不動産投資クラウドファンディングの案件掲載・運用。", "クラファン", "https://propertyplus.jp/"],
  ["TECROWD", "投資・クラファン", "国内外の不動産投資案件を扱うクラウドファンディング。", "海外案件", "https://tecrowd.jp/"],
  ["利回り不動産", "投資・クラファン", "不動産クラウドファンディングと投資情報を提供。", "クラファン", "https://rimawari.co.jp/"],
  ["TSON FUNDING", "投資・クラファン", "不動産投資型クラウドファンディング。", "クラファン", "https://tson-funding.jp/"],
  ["FANTAS funding", "投資・クラファン", "不動産小口投資のクラウドファンディングサービス。", "クラファン", "https://www.fantas-funding.com/"],
  ["Jointo α", "投資・クラファン", "穴吹興産系の不動産クラウドファンディング。", "クラファン", "https://join-to.jp/"],
  ["ASSECLI", "投資・クラファン", "不動産投資型クラウドファンディング。", "クラファン", "https://assecli.com/"],
  ["Bit Realty", "投資・クラファン", "プロ向け不動産投資案件を小口化する投資プラットフォーム。", "投資", "https://www.bit-realty.com/"],
  ["CBRE 物件検索", "事業用・物流", "オフィス、物流施設、店舗など事業用不動産の検索・市況情報。", "事業用", "https://www.cbre-propertysearch.jp/"],
  ["JLL 物件検索", "事業用・物流", "オフィス、物流、商業施設などの不動産情報とマーケットレポート。", "事業用", "https://www.jllproperty.jp/"],
  ["TRUSTDOCK", "電子契約", "本人確認、eKYC、確認業務のデジタル化を支援。", "本人確認", "https://biz.trustdock.io/"],
  ["LIQUID eKYC", "電子契約", "本人確認、顔認証、身分証読取に対応するeKYCサービス。", "本人確認", "https://liquidinc.asia/liquid-ekyc/"],
  ["Proost", "電子契約", "オンライン本人確認や身元確認を支援するeKYCサービス。", "本人確認", "https://proost.io/"],
  ["akisol", "空き家・相続", "空き家の利活用、流通、管理に関するサービス。", "空き家", "https://www.akisol.jp/"],
  ["空き家活用株式会社", "空き家・相続", "空き家相談、流通、活用提案を行う空き家関連サービス。", "空き家", "https://aki-katsu.co.jp/"],
  ["AGE technologies", "空き家・相続", "相続手続きや不動産名義変更に関わる手続き支援。", "相続", "https://age-technologies.co.jp/"],
  ["そうぞくドットコム不動産", "空き家・相続", "相続不動産の手続き、名義変更、売却相談を支援。", "相続不動産", "https://so-zo-ku.com/"],
];

const newsItems = [
  {
    date: "2025-08-26",
    title: "不動産テックカオスマップ第11版が発表",
    summary: "不動産テック協会が第11版を公表。掲載数は528サービスに拡大し、業務領域の広がりが確認できます。",
    source: "不動産テック協会 / PR TIMES",
    url: "https://prtimes.jp/main/html/rd/p/000000065.000038545.html",
  },
  {
    date: "2025-08-22",
    title: "不動産テック カオスマップ第11版 PDF公開",
    summary: "カテゴリ横断でサービスを確認できるPDF。売買、管理、投資、業務支援の棚卸しに使えます。",
    source: "不動産テック協会",
    url: "https://retechjapan.org/img/chaos_map_20250822.pdf",
  },
  {
    date: "2025-06-12",
    title: "AI査定・生成AI活用が仲介業務の比較軸に",
    summary: "査定書作成、物件説明、顧客対応でAIを使うサービスが増加。導入時は説明可能性と社内承認フローの確認が重要です。",
    source: "業界公開情報",
    url: "https://sre-ai-partners.co.jp/service/cloud/ai-assessment.html",
  },
  {
    date: "2025-05-15",
    title: "不動産契約の電子化は本人確認・監査ログまで広がる",
    summary: "電子契約単体ではなく、本人確認、契約書作成、案件管理と一体で検討する動きが強まっています。",
    source: "公開事例",
    url: "https://pick-hp.com/pickform",
  },
  {
    date: "2025-04-10",
    title: "登記・地番・役所調査のデータ化が物件調査の焦点に",
    summary: "物件調査の工数削減に向け、登記情報、地図、AI OCR、調査代行を組み合わせる検討が増えています。",
    source: "公開情報",
    url: "https://www1.touki.or.jp/",
  },
  {
    date: "2025-03-01",
    title: "オフィス・物流など事業用不動産データの活用が進展",
    summary: "市況、空室、賃料、テナント移転情報などを投資・開発・営業判断に組み込む流れが続いています。",
    source: "公開情報",
    url: "https://www.vortex-net.com/service/officeresearch/",
  },
];

const cases = [
  ["売買仲介", "Facilo 導入事例", "仲介会社の物件提案、顧客共有、追客の効率化事例を掲載。", "https://www.facilo.jp/case"],
  ["売買仲介", "Musubell 導入事例", "売買契約書・重説作成、電子契約まわりの導入事例。", "https://www.musubell.com/case/"],
  ["売買仲介", "PICKFORM", "不動産・建築領域の電子契約、本人確認、案件管理の活用。", "https://pick-hp.com/pickform"],
  ["売買仲介", "Digima 導入事例", "反響対応と追客を中心にした不動産・住宅営業の事例。", "https://digima.com/case/"],
  ["不動産管理", "WealthPark 導入事例", "管理会社とオーナーの報告・承認・収支共有のデジタル化。", "https://wealth-park.com/ja/business/case/"],
  ["不動産管理", "GMO賃貸DX 導入事例", "管理会社向けアプリ、オーナー・入居者対応のDX事例。", "https://chintaidx.com/case/"],
  ["不動産管理", "管理ロイド 導入事例", "点検、報告、写真台帳など建物管理現場の効率化。", "https://kanri-roid.app/case/"],
  ["不動産管理", "totono 導入事例", "入居者問い合わせ、修繕受付、管理業務の省力化。", "https://totono.app/case/"],
  ["デベロッパー", "ROOV 導入事例", "新築マンション販売での3D・オンライン接客活用。", "https://roov.jp/case"],
  ["デベロッパー", "ナーブクラウド 導入事例", "VR内見や遠隔接客を使った販売・内見体験の改善。", "https://www.nurve.jp/case/"],
  ["デベロッパー", "スペースリー 導入事例", "VRコンテンツを活用した物件案内、営業支援。", "https://spacely.co.jp/case/"],
  ["投資・AM", "REMETIS 導入事例", "投資判断や物件調査でのマーケットリサーチ活用。", "https://www.remetis.jp/"],
  ["投資・AM", "CREAL 実績", "不動産クラウドファンディングの運用実績・案件情報。", "https://creal.jp/funds"],
  ["投資・AM", "OwnersBook 案件実績", "不動産投資型クラウドファンディングの案件・償還情報。", "https://www.ownersbook.jp/"],
  ["事業用不動産", "OFFICE RESEARCH", "オフィス市場調査、営業・投資判断での活用。", "https://www.vortex-net.com/service/officeresearch/"],
  ["事業用不動産", "CBRE 事例・レポート", "オフィス・物流・商業施設の市況情報、事業用不動産の活用。", "https://www.cbre.co.jp/insights"],
  ["金融・保険", "TAS-MAP 導入領域", "担保評価、収益評価、リスク確認など金融機関業務での活用。", "https://corporate.tas-japan.com/service/tas-map/"],
  ["金融・保険", "東京カンテイ レポート", "価格データや市場レポートを評価・融資判断の参考に活用。", "https://www.kantei.ne.jp/report/"],
  ["建築・リフォーム", "リノベる。事例", "中古購入とリノベーションの一体提案、住宅購入体験の支援。", "https://www.renoveru.jp/"],
  ["空き家・相続", "AGE technologies", "相続・名義変更など不動産手続き領域のDX。", "https://age-technologies.co.jp/"],
];

const header = document.querySelector("[data-header]");
const filterWrap = document.querySelector("[data-filters]");
const serviceGrid = document.querySelector("[data-service-grid]");
const searchInput = document.querySelector("[data-search]");
const resultCount = document.querySelector("[data-result-count]");
const serviceCount = document.querySelector("[data-service-count]");
const newsGrid = document.querySelector("[data-news-grid]");
const caseTabs = document.querySelector("[data-case-tabs]");
const caseGrid = document.querySelector("[data-case-grid]");

let activeCategory = "すべて";
let activeIndustry = "すべて";

function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 40);
}

function serviceCard([name, category, description, tag, url]) {
  return `
    <article class="service-card">
      <div class="card-top">
        <span class="tag">${category}</span>
        <a class="card-link" href="${url}" target="_blank" rel="noreferrer">開く</a>
      </div>
      <h3>${name}</h3>
      <p>${description}</p>
      <div class="service-meta">
        <span class="pill">${tag}</span>
        <span class="pill">公開情報</span>
      </div>
    </article>
  `;
}

function renderFilters() {
  filterWrap.innerHTML = categories.map((category) => `
    <button class="filter${category === activeCategory ? " active" : ""}" type="button" data-category="${category}">
      ${category}
    </button>
  `).join("");
}

function renderServices() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = services.filter(([name, category, description, tag]) => {
    const matchesCategory = activeCategory === "すべて" || category === activeCategory;
    const text = `${name} ${category} ${description} ${tag}`.toLowerCase();
    return matchesCategory && (!query || text.includes(query));
  });

  serviceGrid.innerHTML = filtered.map(serviceCard).join("");
  resultCount.textContent = `${filtered.length}件を表示中 / 全${services.length}件`;
  serviceCount.textContent = services.length;
}

function renderNews() {
  newsGrid.innerHTML = newsItems.map((item) => `
    <article class="news-card">
      <time datetime="${item.date}">${item.date}</time>
      <h3>${item.title}</h3>
      <p>${item.summary}</p>
      <div class="service-meta">
        <span class="pill">${item.source}</span>
        <a class="card-link" href="${item.url}" target="_blank" rel="noreferrer">記事</a>
      </div>
    </article>
  `).join("");
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
  caseGrid.innerHTML = filtered.map(([industry, title, summary, url]) => `
    <article class="case-card">
      <span class="industry">${industry}</span>
      <h3>${title}</h3>
      <p>${summary}</p>
      <div class="service-meta">
        <span class="pill">導入事例</span>
        <a class="card-link" href="${url}" target="_blank" rel="noreferrer">読む</a>
      </div>
    </article>
  `).join("");
}

filterWrap.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  activeCategory = button.dataset.category;
  renderFilters();
  renderServices();
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

renderFilters();
renderServices();
renderNews();
renderCaseTabs();
renderCases();
updateHeader();
