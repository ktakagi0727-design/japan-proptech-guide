const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '..', 'data', 'companies-detail.json');
const companies = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const updates = {
  "anabuki-kosan": {
    page_summary: "中四国エリア大手のあなぶき興産は、契約電子化ツール『レリーズ』を全物件へ順次導入。対面・紙ベースの手続きをデジタル化することで、印紙税や事務コストを削減しつつ、顧客が24時間手続きできるハイブリッド販売体制を確立しています。",
    dx_policy_source_url: "https://www.anabuki.ne.jp/ir/library/",
    financials_source_url: "https://www.buffett-code.com/company/8928/"
  },
  "jukobo-style": {
    page_summary: "千葉県の地域密着型ビルダー。MAツール『KASIKA』の導入により、休眠顧客への自動追客やWeb行動ログの可視化を実現。限られた営業体制でありながら、モデルハウスへの来場数を200%（2倍）に向上させています。",
    dx_policy_source_url: "http://jukobo.jp/",
    financials_source_url: "http://jukobo.jp/"
  },
  "a-shin": {
    page_summary: "福井県No.1クラスのビルダー。MAツール『KASIKA』を活用し、資料請求後の自動メール送信や休眠顧客への一斉メルマガ配信を仕組み化。顧客の熱量が高まった最適なタイミングでの追客により、来場者数300%を実現しました。",
    dx_policy_source_url: "https://www.eshin-home.com/",
    financials_source_url: "https://www.eshin-home.com/"
  },
  "mitsubishi-jisho-residence": {
    page_summary: "大手デベロッパーとして売買契約DXツール『Musubell』を導入し、顧客が紙と電子契約を自由に選べる体制を整備。印紙代削減による顧客満足度（NPS）向上や、覚書締結の最短1日化などの成果を上げています。",
    dx_policy_source_url: "https://www.mec.co.jp/ir/library/",
    financials_source_url: "https://www.mecsumai.com/"
  },
  "rim-real-estate": {
    page_summary: "大阪の仲介会社。日常的に使い慣れている『ATBB』の見積作成支援機能を徹底活用。追加コストをかけずに見積作成時間を5分の1に圧縮し、ヒューマンエラーのゼロ化と顧客対応スピードの向上を達成しました。",
    dx_policy_source_url: "https://rem-realestate.co.jp/",
    financials_source_url: "https://rem-realestate.co.jp/"
  },
  "misawa-home-estate": {
    page_summary: "ミサワホームグループのストック中核企業。契約書類作成支援『Musubell』の導入からわずか1.5ヶ月で、独自の複雑な特約ひな形のテンプレート化に成功。営業現場の書類作成時間を短縮し、審査部門のチェック負荷を軽減しました。",
    dx_policy_source_url: "https://www.misawa-mrd.co.jp/",
    financials_source_url: "https://www.misawa.co.jp/ir/"
  },
  "wada-corporation": {
    page_summary: "中四国で分譲マンションを展開。契約業務のクラウド一元管理ツール『Musubell』の導入により、重要書類作成・チェックバック時間の大幅な短縮と品質の平準化を達成。事業規模拡大に伴う人件費の抑制に繋げています。",
    dx_policy_source_url: "https://www.wada-corporation.co.jp/",
    financials_source_url: "https://www.wada-corporation.co.jp/company/"
  },
  "miyoshi-fudosan": {
    page_summary: "福岡の地場大手不動産会社。契約管理DXツール『Musubell』の導入により、契約書類の印刷・郵送等のバックオフィス業務を大幅に効率化し、顧客手続きの電子化を推進しています。",
    dx_policy_source_url: "https://www.miyoshi.co.jp/",
    financials_source_url: "https://www.miyoshi.co.jp/company/"
  },
  "sogo-system-kanri": {
    page_summary: "福岡のマンション・ビル管理会社。契約管理DXツール『Musubell』の導入により、承認・決裁のオンライン化を推進し、現場での迅速な書類作成と管理体制の強化を実現しています。",
    dx_policy_source_url: "https://www.bm-ssk.co.jp/",
    financials_source_url: "https://www.bm-ssk.co.jp/"
  },
  "tc-shinko-estate-service": {
    page_summary: "神戸製鋼グループの総合不動産会社。契約管理DXツール『Musubell』の導入により、電子承認・電子契約プロセスを確立し、現場とバックオフィスの業務連携の効率化を図っています。",
    dx_policy_source_url: "https://tc-s-estate-service.co.jp/",
    financials_source_url: "https://tc-s-estate-service.co.jp/"
  },
  "tokyu-fudosan": {
    page_summary: "東急不動産HDの中核企業。契約業務DXツール『Musubell』を新築マンション販売に導入し、顧客が非対面で安全かつ低コスト（印紙代不要）に契約できる体制の構築に貢献しています。",
    dx_policy_source_url: "https://www.tokyu-fudosan-hd.co.jp/dx/",
    financials_source_url: "https://www.buffett-code.com/company/3289/"
  },
  "nomura-real-estate": {
    page_summary: "野村不動産グループの中核デベロッパー。電子契約ツール『Musubell』や3D/VR空間内覧『ROOV』の導入により、分譲マンション販売プロセスのデジタル化を進め、顧客利便性と営業生産性の双方を向上させています。",
    dx_policy_source_url: "https://www.nomura-re-hd.co.jp/dx/",
    financials_source_url: "https://www.buffett-code.com/company/3231/"
  },
  "create-estate": {
    page_summary: "事業用・投資用不動産の売買仲介会社。アットホームの『ATBB』見積作成機能を活用し、追加投資を極小化させたまま、転記ミスのない正確な見積書・資金計画書を迅速に顧客提示できる体制を構築しました。",
    dx_policy_source_url: "https://create-estate.jp/",
    financials_source_url: "https://create-estate.jp/"
  },
  "zin-realty": {
    page_summary: "港区の少数精鋭不動産エージェント。物件提案DXツール『Facilo』のフル活用により、対話型デジタル提案シートでお客様と物件情報をスマートに共有。資料作成時間を大幅に削減し、成約率の向上を実現しています。",
    dx_policy_source_url: "https://zin-realty.co.jp/",
    financials_source_url: "https://zin-realty.co.jp/"
  },
  "living-gallery": {
    page_summary: "新潟トップシェアの賃貸管理会社。オーナー・入居者向けアプリ『GMO賃貸DX』の導入により、連絡・修繕見積承認などを完全デジタル化。またTHETAでの360度内覧による非対面接客プロセスを確立しています。",
    dx_policy_source_url: "https://www.living-gallery.co.jp/",
    financials_source_url: "https://www.living-gallery.co.jp/corporate/"
  },
  "nihon-kanzai": {
    page_summary: "施設・建物管理の大手。工事現場DXアプリ『KANNA』の導入により施工写真や日報をデジタル化し、年間700時間の時間削減を達成。また、施設管理NK Connectや独自AI NK-AIbotなど多角的なDXを推進。",
    dx_policy_source_url: "https://www.nkanzai.co.jp/",
    financials_source_url: "https://www.buffett-code.com/company/9728/"
  },
  "space-agency": {
    page_summary: "熊本の地域密着ビルダー。顧客管理・追客自動化ツール『Digima』の導入により、限られた人員で反響への迅速な初動対応と追客プロセスの仕組み化を達成し、モデルハウスへの来場促進を強化しています。",
    dx_policy_source_url: "https://www.space-agency.jp/",
    financials_source_url: "https://www.space-agency.jp/"
  },
  "kurashi-works": {
    page_summary: "清瀬・ひばりヶ丘エリアの不動産会社。物件提案ツール『Facilo』の導入により、営業スタッフがお客様に最適な物件をオンライン提案シートで即座に提示でき、顧客対応スピードと提案の質を高めています。",
    dx_policy_source_url: "http://www.nps-tokyodo.co.jp/",
    financials_source_url: "http://www.nps-tokyodo.co.jp/"
  },
  "joytech": {
    page_summary: "東京の不動産売買会社。オーナー向けアプリ『GMO賃貸DX』の導入により、受託オーナーとの修繕・見積もりのやり取りや報告業務を完全電子化し、郵送手間の削減とオーナー対応の迅速化を実現しています。",
    dx_policy_source_url: "https://www.joytech.co.jp/",
    financials_source_url: "https://www.joytech.co.jp/"
  },
  "pacific-real-estate": {
    page_summary: "湘南エリアの不動産会社。物件提案ツール『Facilo』の導入により、購入希望のお客様に対して複数の物件情報をスピーディーにオンライン共有し、チャットによる密な追客で成約率の向上を図っています。",
    dx_policy_source_url: "https://www.d-comm.jp/",
    financials_source_url: "https://www.d-comm.jp/"
  },
  "mitsui-fudosan-realty": {
    page_summary: "『三井のリハウス』を展開する最大手仲介会社。現場DXアプリ『KANNA』の導入により、インスペクションなどの建物調査業務における報告プロセスをデジタル化し、現場の負担軽減とデータ品質向上を達成しました。",
    dx_policy_source_url: "https://www.mf-realty.jp/",
    financials_source_url: "https://www.mf-realty.jp/company/outline/"
  },
  "keio-real-estate": {
    page_summary: "京王グループの総合不動産会社。オーナーアプリ『WealthParkビジネス』の導入により、管理オーナーへの収支報告明細を電子化し、紙郵送コストの削減とオーナーコミュニケーションの迅速化を推進しています。",
    dx_policy_source_url: "https://www.keio-fudosan.co.jp/",
    financials_source_url: "https://www.keio-fudosan.co.jp/company/"
  },
  "utoc": {
    page_summary: "港湾運送・プラント輸送の大手。現場DXアプリ『KANNA』をプラント施工部門に導入し、施工写真や図面をクラウドで一元共有。日報作成や報告の移動時間を削減し、大幅な業務効率化を実現しました。",
    dx_policy_source_url: "https://www.utoc.co.jp/",
    financials_source_url: "https://www.utoc.co.jp/ir/"
  },
  "appartement-agent": {
    page_summary: "全国でサブリース等を展開。オーナー向けアプリ『GMO賃貸DX』の導入により、月次収支報告や修繕見積もりのやり取りを完全デジタル化。印刷・郵送コストの削減とオーナー対応の迅速化を実現しています。",
    dx_policy_source_url: "https://www.appartement.co.jp/",
    financials_source_url: "https://www.appartement.co.jp/"
  },
  "hirata-fudosan": {
    page_summary: "福井県小浜市の地場賃賃管理会社。オーナーアプリ『WealthParkビジネス』の導入にあたり、社長室直下に専用チームを設けて高齢オーナーへの対面サポートを徹底。収支報告のペーパーレス化と定着に成功しました。",
    dx_policy_source_url: "https://www.hirata-fudousan.co.jp/",
    financials_source_url: "https://www.hirata-fudousan.co.jp/"
  },
  "tokyu-community": {
    page_summary: "マンション・ビル管理大手。現場DXアプリ『KANNA』の導入により、修繕・工事進捗の写真共有や報告業務をデジタル化し、関係者への迅速な情報共有と管理員の業務負担軽減を達成しました。",
    dx_policy_source_url: "https://www.tokyu-com.co.jp/",
    financials_source_url: "https://www.tokyu-com.co.jp/company/about/"
  },
  "sanken-home": {
    page_summary: "千葉県の地域密着ビルダー。顧客管理・自動追客SaaS『Digima』の導入により、見込み顧客に対するメール・電話のアプローチ履歴を一元化。初動対応の高速化とナーチャリングによるモデルハウス来場率の向上を実現。",
    dx_policy_source_url: "https://www.ee-sumai.com",
    financials_source_url: "https://www.ee-sumai.com"
  },
  "leben-corporation": {
    page_summary: "埼玉中心の賃貸管理会社。オーナー向けアプリ『GMO賃貸DX』を導入し、定期点検や修繕報告、オーナーとの意思決定のやり取りをオンライン化。管理体制の高度化とペーパーレス化を両立しています。",
    dx_policy_source_url: "https://leben-kanri.co.jp/",
    financials_source_url: "https://leben-kanri.co.jp/"
  },
  "relation-real-estate": {
    page_summary: "福岡の地場不動産会社。物件提案SaaS『Facilo』を導入し、購入検討のお客様ごとに専用の物件紹介シートをWeb上で作成・共有。提案スピードの向上と、LINE連携による密な追客で成約率を高めています。",
    dx_policy_source_url: "https://relation-fukuoka.com/",
    financials_source_url: "https://relation-fukuoka.com/"
  },
  "alphas": {
    page_summary: "愛知県の不動産仲介・リフォーム会社。物件提案ツール『Facilo』の導入により、お客様にマッチする物件情報をスマートにWeb紹介する体制を整備。営業スタッフの資料作成時間を短縮し、提案品質を平準化しています。",
    dx_policy_source_url: "https://alphas-group.jp/",
    financials_source_url: "https://alphas-group.jp/"
  },
  "tokyo-tatemono": {
    page_summary: "日本最古の総合デベロッパー。マンション売買電子契約『レリーズ』やビル管理アプリ『管理ロイド』の導入により、複雑な契約・点検手続きのペーパーレス化と、各アセットにおけるデータ連携を推進しています。",
    dx_policy_source_url: "https://www.tatemono.com/",
    financials_source_url: "https://www.buffett-code.com/company/8804/"
  },
  "tokyo-tatemono-rim": {
    page_summary: "東京建物グループのAM会社。不動産ファンド管理システム『T2TR ComFort』を導入し、工事稟議の決裁ワークフローや収支管理をデジタル化。PM会社との意思決定を高速化し、運用管理品質を向上させました。",
    dx_policy_source_url: "https://www.tt-rim.co.jp/",
    financials_source_url: "https://www.tt-rim.co.jp/"
  }
};

companies.forEach(company => {
  const update = updates[company.slug];
  if (update) {
    company.page_summary = update.page_summary;
    company.dx_policy_source_url = update.dx_policy_source_url;
    company.financials_source_url = update.financials_source_url;
  }
});

fs.writeFileSync(jsonPath, JSON.stringify(companies, null, 2), 'utf8');
console.log('Successfully updated companies-detail.json with summaries and reference links!');
