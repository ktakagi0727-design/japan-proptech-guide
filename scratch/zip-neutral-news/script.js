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

const serviceRows = `
REMETIS	マーケット情報	不動産投資・開発判断向けのマーケットリサーチ、物件分析、調査支援。	売買調査	https://www.remetis.jp/
OFFICE RESEARCH	事業用・物流	オフィスビル市場の物件・賃料・空室などを調査する事業用不動産データサービス。	オフィス	https://www.vortex-net.com/service/officeresearch/
スマサテ	売却査定	賃料・売買査定、収益価格の把握に使える不動産会社向けクラウド。	査定	https://sumasate.jp/
ア・ソコ	物件調査	不動産仲介向けに役所調査や現地調査の負担を減らす物件調査支援。	調査	https://evort.jp/idea-log/product/asoko
SRE AI査定CLOUD	売却査定	AIで売買価格を査定し、査定書作成や根拠提示を支援。	AI査定	https://sre-ai-partners.co.jp/service/cloud/ai-assessment.html
TAS-MAP	マーケット情報	不動産評価、賃料査定、空室率などの分析に使われる不動産データサービス。	評価	https://corporate.tas-japan.com/service/tas-map/
不動産情報ライブラリ	マーケット情報	価格、地価、防災、都市計画などの不動産関連情報。	公的情報	https://www.reinfolib.mlit.go.jp/
REINS Market Information	マーケット情報	指定流通機構の成約情報を一般向けに公開する売買相場確認サービス。	成約相場	https://www.contract.reins.or.jp/
東京カンテイ	マーケット情報	マンション価格、賃料、流通データなどの調査・レポートを提供。	市場分析	https://www.kantei.ne.jp/
マンションレビュー	マーケット情報	マンション相場、口コミ、売却査定導線を持つマンション情報サービス。	相場	https://www.mansion-review.jp/
住まいサーフィン	マーケット情報	マンション価格、資産価値情報を提供。	マンション	https://www.sumai-surfin.com/
土地総合情報システム	マーケット情報	土地取引価格や地価公示などを確認できる国土交通省の情報サイト。	土地価格	https://www.land.mlit.go.jp/webland/
地価マップ	マーケット情報	路線価、固定資産税路線価、地価公示などを地図で確認。	地価	https://www.chikamap.jp/
J-REIT DB	マーケット情報	J-REIT銘柄、物件、利回り、開示情報の確認に使える情報サービス。	投資情報	https://j-reit.jp/
GEEO	マーケット情報	地価や周辺環境などから不動産価格の推定・分析を行うサービス。	価格推定	https://geeo.otani.co/
SUUMO	物件ポータル	売買物件、新築、中古、土地などを横断して探せる大手ポータル。	集客	https://suumo.jp/
LIFULL HOME'S	物件ポータル	売買・賃貸・注文住宅などを扱う総合不動産ポータル。	集客	https://www.homes.co.jp/
at home	物件ポータル	加盟店ネットワークと物件流通を持つ不動産情報サービス。	集客	https://www.athome.co.jp/
Yahoo!不動産	物件ポータル	中古マンション、戸建て、土地などを探せる不動産情報サービス。	集客	https://realestate.yahoo.co.jp/
ニフティ不動産	物件ポータル	複数ポータルの物件情報を横断検索できる不動産検索サービス。	横断検索	https://myhome.nifty.com/
オウチーノ	物件ポータル	購入、売却、リフォームなど住まいの情報を扱うポータル。	集客	https://www.o-uccino.com/
カウカモ	買取再販	中古・リノベーション住宅の購入体験をオンラインで支援。	中古住宅	https://cowcamo.jp/
FLIE	買取再販	中古住宅の直接販売を軸に、手数料を抑えた購入体験を提供。	中古住宅	https://flie.jp/
リノベる。	買取再販	中古購入とリノベーションを一体で支援する住まいサービス。	リノベ	https://www.renoveru.jp/
RENOSY	投資・クラファン	不動産投資、購入後管理、売却までを支援するオンラインサービス。	投資	https://www.renosy.com/
HOME4U	売却査定	不動産売却一括査定の老舗サービス。	一括査定	https://www.home4u.jp/
イエウール	売却査定	全国対応の不動産売却一括査定サービス。	一括査定	https://ieul.jp/
すまいステップ	売却査定	優良会社に絞った売却査定依頼を訴求するサービス。	一括査定	https://sumai-step.com/
おうちクラベル	売却査定	AI査定と不動産会社査定を組み合わせた売却支援。	AI査定	https://realestate-od.jp/
リビンマッチ	売却査定	不動産売却、土地活用、賃貸管理などの比較サービス。	比較	https://www.lvnmatch.jp/
マンションナビ	売却査定	マンション売却に特化した価格相場・査定サービス。	マンション	https://t23m-navi.jp/
いえカツLIFE	売却査定	売却、買取、リースバックなど複数の出口を比較。	売却比較	https://iekatu-life.com/
イエイ	売却査定	不動産売却の一括査定、会社比較を行うサービス。	一括査定	https://sell.yeay.jp/
RE-Guide	売却査定	不動産売却査定や投資物件情報を扱う比較サービス。	比較	https://www.re-guide.jp/
IESHIL	売却査定	マンション参考相場や売却相談を提供するマンション情報サービス。	相場	https://www.ieshil.com/
HowMa	売却査定	AIで住宅価格を推定し、売却相談につなげるサービス。	AI査定	https://www.how-ma.com/
10秒でDo	売却査定	ハウスドゥが提供する不動産価格査定アプリ。	査定	https://www.housedo.com/
Gate.	売却査定	不動産投資向けのAI査定・シミュレーション。	投資査定	https://gate.estate/
Facilo	CRM・営業支援	売買仲介の顧客提案、物件共有、追客を一元化する営業支援。	仲介DX	https://www.facilo.jp/
Digima	CRM・営業支援	不動産・住宅業界向けの反響対応、追客、MA、CRM。	追客	https://digima.com/
KASIKA	CRM・営業支援	住宅・不動産向けの顧客育成、営業活動可視化、追客支援。	MA	https://www.kasika.io/
いえらぶCLOUD	CRM・営業支援	物件管理、集客、反響、契約、業務管理を扱う不動産業務クラウド。	業務基盤	https://ielove-cloud.jp/
いい生活 売買クラウド	CRM・営業支援	売買仲介会社向けの物件管理、顧客管理、Web掲載支援。	仲介業務	https://www.es-service.net/
ノマドクラウド	CRM・営業支援	不動産仲介向けの顧客管理、追客、LINE連携。	反響対応	https://nomad-cloud.jp/
売買革命	CRM・営業支援	不動産売買仲介向けの物件・顧客・営業支援システム。	売買業務	https://www.n-create.co.jp/
みらいえ	CRM・営業支援	不動産会社向けホームページ、物件管理、営業支援サービス。	集客	https://miraie-net.com/
Musubell	電子契約	不動産売買契約書、重要事項説明書などの文書作成・電子契約を支援。	契約DX	https://www.musubell.com/
PICKFORM	電子契約	不動産・建築領域に特化した電子契約、本人確認、案件管理。	電子契約	https://pick-hp.com/pickform
クラウドサイン	電子契約	契約締結、保管、ワークフローをオンライン化する電子契約サービス。	電子署名	https://www.cloudsign.jp/
GMOサイン	電子契約	電子署名、契約管理、本人確認と連携しやすい電子契約サービス。	電子署名	https://www.gmosign.com/
Hubble	電子契約	契約書レビュー、管理、ナレッジ共有を支援する契約業務クラウド。	契約管理	https://hubble-docs.com/
LegalForce	電子契約	AI契約書レビューと契約リスク管理を支援。	契約審査	https://legalforce-cloud.com/
DX Suite	AI OCR	紙書類、帳票、申込書などをAI OCRでデータ化。	書類読取	https://inside.ai/products/dx-suite/
SmartRead	AI OCR	さまざまな帳票をOCRし、取引書類や社内文書のデータ化を支援。	帳票	https://www.crestec.co.jp/smartread/
AIよみとーる	AI OCR	NTT東日本のAI OCR。紙帳票をデータ化し業務入力を削減。	帳票	https://business.ntt-east.co.jp/service/aiocr/
CLOVA OCR	AI OCR	定型・非定型書類の文字認識、本人確認書類読取などに利用可能。	本人確認	https://www.lycbiz.com/jp/service/clova-ocr/
Tegaki	AI OCR	手書き文字を含む帳票読取に強いAI OCRサービス。	手書き	https://www.tegaki.ai/
AnyForm OCR	AI OCR	非定型帳票の文字読取とデータ化を支援。	非定型	https://www.hammock.jp/anyform/
登記情報提供サービス	登記情報	登記簿、公図、地積測量図などの登記情報をオンラインで確認。	登記	https://www1.touki.or.jp/
登記簿図書館	登記情報	登記簿、図面、ブルーマップなどの取得・閲覧を支援。	登記	https://登記簿図書館.com/
GVA 法人登記	登記情報	法人登記の手続きをオンラインで支援するリーガルテック。	法人登記	https://corporate.ai-con.lawyer/
Graffer法人証明書請求	登記情報	登記事項証明書など行政手続きのオンライン請求を支援。	証明書	https://graffer.jp/
ブルーマップ	登記情報	住居表示、地番、用途地域など物件調査に使う地図情報。	地番	https://www.zenrin.co.jp/product/category/residentialmap/bluemap/
JTNマップ	登記情報	不動産調査で使う地番、登記、住宅地図系情報の確認に活用。	地図	https://www.jtn-map.com/
役所調査ドットコム	物件調査	用途地域、道路、ライフラインなど役所調査の外注・代行。	役所調査	https://yakusho-chosa.com/
スペースリー	物件調査	VR内見、3Dツアー、オンライン接客で売買・賃貸の内見体験を支援。	VR	https://spacely.co.jp/
ROOV	物件調査	新築マンション販売向けの3D、VR、オンライン接客支援。	3D販売	https://roov.jp/
ナーブクラウド	物件調査	VR内見、遠隔接客、オンライン商談を支援。	VR	https://www.nurve.jp/
Matterport	物件調査	3Dスキャンで物件の空間情報を可視化。	3D	https://matterport.com/ja
THETA 360.biz	物件調査	360度画像を使った物件内見コンテンツを制作・公開。	360画像	https://www.theta360.biz/
ITANDI BB	賃貸・管理	不動産会社間流通、内見予約、申込、契約をオンライン化。	業者間流通	https://itandibb.com/
申込受付くん	賃貸・管理	賃貸入居申込をオンライン化し、管理会社と仲介会社の連携を効率化。	申込	https://lp.itandibb.com/moushikomi-uketsukekun/
電子契約くん	賃貸・管理	賃貸借契約の電子契約を支援するITANDI系サービス。	賃貸契約	https://lp.itandibb.com/denshikeiyaku-kun/
OHEYAGO	賃貸・管理	セルフ内見、オンライン申込に対応した賃貸検索サービス。	内見	https://oheyago.jp/
WealthPark Business	賃貸・管理	管理会社とオーナーの報告、収支、承認、コミュニケーションをデジタル化。	オーナー対応	https://wealth-park.com/ja/business/
GMO賃貸DX	賃貸・管理	賃貸管理会社向けにオーナー・入居者アプリや業務DXを提供。	管理DX	https://chintaidx.com/
管理ロイド	賃貸・管理	建物管理、点検、報告、写真台帳など現場業務をクラウド化。	建物管理	https://kanri-roid.app/
totono	賃貸・管理	入居者対応、問い合わせ、修繕受付を効率化する管理会社向けサービス。	入居者対応	https://totono.app/
CREAL	投資・クラファン	不動産クラウドファンディングで個人投資家に物件投資機会を提供。	クラファン	https://creal.jp/
COZUCHI	投資・クラファン	不動産投資クラウドファンディングサービス。	クラファン	https://cozuchi.com/
OwnersBook	投資・クラファン	不動産担保ローンやエクイティ型案件を扱う投資サービス。	投資	https://www.ownersbook.jp/
Rimple	投資・クラファン	不動産投資型クラウドファンディング。	クラファン	https://funding.propertyagent.co.jp/
property+	投資・クラファン	不動産投資クラウドファンディングの案件掲載・運用。	クラファン	https://propertyplus.jp/
TECROWD	投資・クラファン	国内外の不動産投資案件を扱うクラウドファンディング。	海外案件	https://tecrowd.jp/
利回り不動産	投資・クラファン	不動産クラウドファンディングと投資情報を提供。	クラファン	https://rimawari.co.jp/
TSON FUNDING	投資・クラファン	不動産投資型クラウドファンディング。	クラファン	https://tson-funding.jp/
FANTAS funding	投資・クラファン	不動産小口投資のクラウドファンディングサービス。	クラファン	https://www.fantas-funding.com/
Jointo α	投資・クラファン	穴吹興産系の不動産クラウドファンディング。	クラファン	https://join-to.jp/
ASSECLI	投資・クラファン	不動産投資型クラウドファンディング。	クラファン	https://assecli.com/
Bit Realty	投資・クラファン	プロ向け不動産投資案件を小口化する投資プラットフォーム。	投資	https://www.bit-realty.com/
CBRE 物件検索	事業用・物流	オフィス、物流施設、店舗など事業用不動産の検索・市況情報。	事業用	https://www.cbre-propertysearch.jp/
JLL 物件検索	事業用・物流	オフィス、物流、商業施設などの不動産情報とマーケットレポート。	事業用	https://www.jllproperty.jp/
TRUSTDOCK	電子契約	本人確認、eKYC、確認業務のデジタル化を支援。	本人確認	https://biz.trustdock.io/
LIQUID eKYC	電子契約	本人確認、顔認証、身分証読取に対応するeKYCサービス。	本人確認	https://liquidinc.asia/liquid-ekyc/
akisol	空き家・相続	空き家の利活用、流通、管理に関するサービス。	空き家	https://www.akisol.jp/
空き家活用株式会社	空き家・相続	空き家相談、流通、活用提案を行う空き家関連サービス。	空き家	https://aki-katsu.co.jp/
AGE technologies	空き家・相続	相続手続きや不動産名義変更に関わる手続き支援。	相続	https://age-technologies.co.jp/
そうぞくドットコム不動産	空き家・相続	相続不動産の手続き、名義変更、売却相談を支援。	相続不動産	https://so-zo-ku.com/
`;

const services = serviceRows.trim().split("\n").map((row) => {
  const [name, category, description, tag, url] = row.split("\t");
  return { name, category, description, tag, url };
});

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
  ["売買仲介", "株式会社スペースリー", "仲介・住宅会社のVR活用、物件案内、営業支援の導入事例を会社単位で掲載。", "https://spacely.co.jp/case/"],
  ["売買仲介", "株式会社Facilo", "売買仲介会社の物件提案、顧客共有、追客効率化の導入事例を会社単位で確認。", "https://www.facilo.jp/case"],
  ["売買仲介", "ミカタ株式会社", "不動産会社向け営業・業務支援領域の事例を会社単位で確認。", "https://f-mikata.jp/"],
  ["不動産管理", "WealthPark株式会社", "管理会社とオーナーの報告、承認、収支共有のデジタル化事例を会社単位で掲載。", "https://wealth-park.com/ja/business/case/"],
  ["不動産管理", "GMO ReTech株式会社", "賃貸管理会社向けアプリ、オーナー・入居者対応のDX事例を会社単位で整理。", "https://chintaidx.com/case/"],
  ["不動産管理", "株式会社THIRD", "建物管理、点検、報告、写真台帳など現場業務の導入事例を会社単位で確認。", "https://kanri-roid.app/case/"],
  ["デベロッパー", "株式会社スタイルポート", "新築マンション販売での3D・オンライン接客活用事例を会社単位で掲載。", "https://roov.jp/case"],
  ["デベロッパー", "ナーブ株式会社", "VR内見や遠隔接客を使った販売・内見体験の改善事例を会社単位で確認。", "https://www.nurve.jp/case/"],
  ["投資・AM", "株式会社REMETIS", "投資判断や物件調査でのマーケットリサーチ活用を会社単位で掲載。", "https://www.remetis.jp/"],
  ["投資・AM", "クリアル株式会社", "不動産クラウドファンディングの案件実績、投資家向け情報を会社単位で確認。", "https://creal.jp/funds"],
  ["事業用不動産", "株式会社ボルテックス", "OFFICE RESEARCHを含むオフィス市場調査、営業・投資判断の活用を会社単位で確認。", "https://www.vortex-net.com/service/officeresearch/"],
  ["事業用不動産", "シービーアールイー株式会社", "オフィス、物流、商業施設の市況情報や事業用不動産の知見を会社単位で掲載。", "https://www.cbre.co.jp/insights"],
  ["金融・保険", "株式会社タス", "不動産評価、担保評価、収益評価、リスク確認などの活用領域を会社単位で整理。", "https://corporate.tas-japan.com/service/tas-map/"],
  ["金融・保険", "株式会社東京カンテイ", "価格データや市場レポートを評価・融資判断の参考情報として会社単位で確認。", "https://www.kantei.ne.jp/report/"],
  ["建築・リフォーム", "リノベる株式会社", "中古購入とリノベーションの一体提案、住宅購入体験の事例を会社単位で掲載。", "https://www.renoveru.jp/"],
  ["空き家・相続", "株式会社AGE technologies", "相続・名義変更など不動産手続き領域のDXを会社単位で整理。", "https://age-technologies.co.jp/"],
];

const header = document.querySelector("[data-header]");
const filterWrap = document.querySelector("[data-filters]");
const serviceGrid = document.querySelector("[data-service-grid]");
const searchInput = document.querySelector("[data-search]");
const resultCount = document.querySelector("[data-result-count]");
const serviceCount = document.querySelector("[data-service-count]");
const newsList = document.querySelector("[data-news-list]");
const newsPagination = document.querySelector("[data-news-pagination]");
const caseTabs = document.querySelector("[data-case-tabs]");
const caseGrid = document.querySelector("[data-case-grid]");

let activeCategory = "すべて";
let activeIndustry = "すべて";
let currentNewsPage = 1;
const newsPerPage = 10;

function updateHeader() {
  header.classList.toggle("scrolled", window.scrollY > 40);
}

function getCategories(service) {
  const text = `${service.name} ${service.category} ${service.description} ${service.tag}`;
  const related = new Set([service.category]);
  if (/査定|価格|相場|売却/.test(text)) related.add("売却査定");
  if (/市場|相場|地価|賃料|J-REIT|データ|マーケット|レポート/.test(text)) related.add("マーケット情報");
  if (/OCR|帳票|書類|読取|手書き/.test(text)) related.add("AI OCR");
  if (/登記|地番|公図|ブルーマップ|証明書|法人登記/.test(text)) related.add("登記情報");
  if (/契約|署名|本人確認|eKYC|重説/.test(text)) related.add("電子契約");
  if (/CRM|追客|反響|営業|顧客|仲介/.test(text)) related.add("CRM・営業支援");
  if (/調査|内見|VR|3D|360|用途地域|ハザード|役所/.test(text)) related.add("物件調査");
  if (/投資|クラファン|REIT|AM|利回り/.test(text)) related.add("投資・クラファン");
  if (/オフィス|物流|事業用|商業施設/.test(text)) related.add("事業用・物流");
  if (/賃貸|管理|オーナー|入居者/.test(text)) related.add("賃貸・管理");
  if (/空き家|相続|名義変更/.test(text)) related.add("空き家・相続");
  if (/ポータル|検索|集客/.test(text)) related.add("物件ポータル");
  if (/買取|リノベ|中古住宅/.test(text)) related.add("買取再販");
  return [...related].filter((item) => categories.includes(item));
}

function serviceCard(service) {
  const categoryLabels = getCategories(service);
  return `
    <article class="service-card">
      <div class="card-top">
        <span class="tag">${service.category}</span>
        <a class="card-link" href="${service.url}" target="_blank" rel="noreferrer">開く</a>
      </div>
      <h3>${service.name}</h3>
      <p>${service.description}</p>
      <div class="service-meta">
        <span class="pill">${service.tag}</span>
        ${categoryLabels.slice(1).map((item) => `<span class="pill">${item}</span>`).join("")}
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
  const filtered = services.filter((service) => {
    const serviceCategories = getCategories(service);
    const text = `${service.name} ${service.category} ${service.description} ${service.tag} ${serviceCategories.join(" ")}`.toLowerCase();
    const matchesCategory = activeCategory === "すべて" || serviceCategories.includes(activeCategory);
    return matchesCategory && (!query || text.includes(query));
  });
  serviceGrid.innerHTML = filtered.map(serviceCard).join("");
  resultCount.textContent = `${filtered.length}件を表示中 / 全${services.length}件`;
  serviceCount.textContent = services.length;
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
  caseGrid.innerHTML = filtered.map(([industry, company, summary, url]) => `
    <article class="case-card">
      <span class="industry">${industry}</span>
      <h3>${company}</h3>
      <p>${summary}</p>
      <div class="service-meta">
        <span class="pill">会社単位</span>
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

renderFilters();
renderServices();
renderNews();
renderCaseTabs();
renderCases();
updateHeader();
