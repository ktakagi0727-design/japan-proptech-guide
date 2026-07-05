const fs = require('fs');

const data = JSON.parse(fs.readFileSync('data/companies-detail.json', 'utf8'));

// 1. Modify parent company (tokyo-tatemono)
const tokyoTatemono = data.find(c => c.slug === 'tokyo-tatemono');
if (tokyoTatemono) {
  // Remove T2TR ComFort from parent
  tokyoTatemono.tools = tokyoTatemono.tools.filter(t => t.name !== 'T2TR ComFort');
  tokyoTatemono.related_companies = [
    {
      "company": "株式会社東京建物リアルティ・インベストメント・マネジメント",
      "slug": "tokyo-tatemono-rim",
      "relationship": "グループ会社（不動産ファンド運用）"
    }
  ];
  tokyoTatemono.financial_status_change = "2020年12月期から2024年12月期にかけて売上高は3,200億円規模から4,100億円超へと右肩上がりで成長し、営業利益も500億円規模から760億円超に増加しています。特に分譲マンション「Brillia」事業やビル事業の好調が寄与しています。プロップテック導入との関連では、2021年に不動産売買契約の電子化ツール「レリーズプラットフォーム」を導入し、年間約3,000件の契約・覚書の電子化による印紙代・事務コストの削減と契約期間短縮に成功。また、建物管理品質の向上・点検効率化のために「管理ロイド」を導入し、紙ベースの巡回報告をデータ化することで現場管理の無駄を徹底的に排除しました。これらの業務効率化が、事業規模拡大下での販管費の抑制と利益率の向上（営業利益率15%以上の維持）を後押ししています。";
}

// 2. Add subsidiary company (tokyo-tatemono-rim)
const tokyoTatemonoRim = {
  "company": "株式会社東京建物リアルティ・インベストメント・マネジメント",
  "slug": "tokyo-tatemono-rim",
  "business_summary": "東京建物グループの不動産投資顧問・アセットマネジメント会社。私募ファンドやJ-REIT（東京建物プライベートREIT等）の資産運用業務を受託・運営しています。",
  "asset_scale": "運用資産残高（AUM）は数千億円規模。主にオフィスビル、物流施設、賃貸住宅などを運用アセットとして取り扱っています。",
  "main_area": "首都圏中心、および全国主要都市",
  "financials": [
    {
      "year": "近年の業績",
      "sales": "非上場のため非公開",
      "profit": "非公開。グループのAM事業として安定推移"
    }
  ],
  "financial_status_change": "非上場のため詳細な財務推移は非公開ですが、東京建物グループの安定した受託資産とファンド組成力のもとで、ストックビジネスとして堅調な運用報酬収入を得ています。2021年頃に不動産ファンド・AM業務に特化した「T2TR ComFort」を導入。従来エクセルと紙の稟議書で行われていた工事申請・決裁ワークフローをシステム化し、物件ごとの契約・収支データを一元管理することで、AM業務の処理スピードを向上させ、運用ミスの防止と業務効率化を達成しています。",
  "related_companies": [
    {
      "company": "東京建物株式会社",
      "slug": "tokyo-tatemono",
      "relationship": "親会社（総合デベロッパー）"
    }
  ],
  "tools": [
    {
      "name": "T2TR ComFort",
      "intro_date": "2021年頃",
      "official_url": "https://service.proptech.plus/case-studies/case-8462f0567450",
      "challenge": "グループ内の不動産ファンド運用（AM）において、各ファンドの保有物件から届く紙やエクセルベースの工事申請・承認・稟議プロセスが分断されており、決裁や進捗管理に多大な時間がかかっていた。また、契約データや収支管理、投資家向け報告（レポーティング）が個別のエクセルシートに依存し、データの集約や異常検知に時間がかかっていた。",
      "reason": "不動産ファンド・AM業務に特化しており、物件ごとの契約・収支情報、工事・稟議承認ワークフローがスマートに統合されている点。また、投資法人・ファンド運用に必要なレポーティング機能やセキュリティ基準を満たしていた点。",
      "process": "AM業務のプラットフォームとして「T2TR ComFort」を導入。工事の申請・稟議決裁ワークフローをシステム化し、物件ごとの稼働率や収支データを一元管理する体制を構築した。",
      "effect": "工事申請や決裁のプロセスが大幅にスピードアップし、紙の稟議書の回覧や郵送の手間が消滅。物件収支や稼働実績のデータが自動集約されることで、投資家やアセットオーナー向けの情報開示・レポーティング資料の作成時間が劇的に短縮され、運用管理のミスも極小化された。",
      "eval_onboarding": {
        "stars": 2,
        "desc": "承認権限やファンドごとの複雑なルール設定などの初期構築に時間は要したものの、業務が定型化され、運用はスムーズに安定している。"
      },
      "eval_cost_performance": {
        "stars": 2,
        "desc": "AM/PM間のやり取りにおける無駄な時間と手戻りが解消され、ファンド運用チームの生産性が高まり、管理コストの削減に繋がっている。"
      },
      "eval_scope": {
        "stars": 3,
        "desc": "工事の起案・決裁ワークフロー、物件データベース、収支管理から、投資法人向けディスクロージャー・レポーティング支援までAM業務全般をカバーしている。"
      },
      "our_analysis": "東京建物グループ（東京建物リアルティ・インベストメント・マネジメント）の事例は、不動産ファンド（AM）の実務において、ボトルネックとなりがちな「関係会社間の意思決定（工事稟議等）の遅れ」と「手作業による報告書作成」をデジタルプラットフォームで解決した好例です。AM業務では、PM会社から送られてくる大量の修繕・バリューアップ工事の承認を適時かつ正確に行う必要がありますが、これをシステム化することで承認プロセスを可視化・高速化しています。投資法人としてのガバナンスとディスクロージャーの迅速化を支えるための基盤として、極めて有効に機能しています。"
    }
  ]
};

if (!data.some(c => c.slug === 'tokyo-tatemono-rim')) {
  data.push(tokyoTatemonoRim);
}

fs.writeFileSync('data/companies-detail.json', JSON.stringify(data, null, 2), 'utf8');
console.log('Split tokyo-tatemono successfully! New total companies:', data.length);
