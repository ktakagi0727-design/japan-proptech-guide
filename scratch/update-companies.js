const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '..', 'data', 'companies-detail.json');
const companies = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const updates = {
  "anabuki-kosan": {
    homepage_url: "https://www.anabuki.ne.jp/",
    dx_policy: {
      challenges: "不動産業界特有の「対面・オフライン中心の業務プロセス」からの脱却、および顧客データの分断（サイロ化）や属人化の解消。",
      goals: "顧客の生涯価値を高めるための商品・サービスの付加価値向上と、業務効率化・生産性向上による筋肉質な経営体質の構築。",
      policy_or_goals: "ビジネスDX、コーポレートDX、デジタルIT基盤の3本柱で推進。2023年9月に経済産業省の「DX認定事業者」に認定。"
    },
    other_tools: [
      "INTEGRAL-CORE (CDPによる顧客データ統合)",
      "P-Pointer File Security (個人情報セキュリティ)",
      "スマートホーム「eLife」"
    ]
  },
  "jukobo-style": {
    homepage_url: "http://jukobo.jp/",
    dx_policy: {
      challenges: "Webサイトからの資料請求等はあるものの、営業担当者が多忙なためフォローアップが属人化し、追客漏れが発生していた点。",
      goals: "見込み客に対する自動追客の仕組み化と、Web行動ログデータに基づく成約確度の高いお客様の絞り込み。",
      policy_or_goals: "3D CADを用いた設計・施工管理のデジタル化や、自然素材・ZEH基準に対応する住宅工法の積極的な導入。"
    },
    other_tools: []
  },
  "a-shin": {
    homepage_url: "https://www.eshin-home.com/",
    dx_policy: {
      challenges: "資料請求や反響への初動対応の遅れ、および経年による休眠顧客リストに対する架電アプローチの非効率性。",
      goals: "反響直後の自動対応化、および顧客のWeb行動履歴（閲覧ログ）の可視化による最適なタイミングでのアプローチ確立。",
      policy_or_goals: "自社メディアやSNS（YouTube等）とWebサイトを連携させた反響獲得およびデジタル追客プロセスの自動化。"
    },
    other_tools: []
  },
  "mitsubishi-jisho-residence": {
    homepage_url: "https://www.mec-r.com/",
    dx_policy: {
      challenges: "契約からお引き渡しまでの長期にわたる顧客コミュニケーションの分断、および紙を中心とした売買契約手続きの煩雑さ。",
      goals: "オンライン・オフラインを融合させた顧客体験（OMO）の再構築と、データ一元管理によるバリューチェーン全体の変革。",
      policy_or_goals: "「三菱地所デジタルビジョン」に基づき、現場の生産性を最大化させつつ、顧客にとって利便性の高いデジタル契約の選択肢を提供する。"
    },
    other_tools: [
      "Front Agent (商談音声AI解析)",
      "Matterport (3Dバーチャル内覧)",
      "CITRUS (自社住宅販売管理の基幹システム)"
    ]
  },
  "rim-real-estate": {
    homepage_url: "https://rem-realestate.co.jp/",
    dx_policy: {
      challenges: "Excel手入力による見積書・資金計画書作成の負担と、転記・計算ミスなどのヒューマンエラーのリスク。",
      goals: "既存の業務インフラを活用して追加投資を極小化しつつ、見積作成等の日々発生する定型事務をデジタル化する。",
      policy_or_goals: "日常的に使い慣れているATBBなどの標準機能を徹底的に使いこなし、追加コストをかけずに業務時間を短縮する実用的なDXを推進。"
    },
    other_tools: []
  },
  "misawa-home-estate": {
    homepage_url: "https://www.misawa-mrd.co.jp/",
    dx_policy: {
      challenges: "法令改正に伴う契約特約・雛形の肥大化と、現場営業担当者のスキル差による契約・重説書類作成の品質ばらつき。",
      goals: "クラウドテンプレート化による書類の統一感と品質の均一化、および管理・審査部門のチェック確認工数の大幅削減。",
      policy_or_goals: "親会社ミサワホームのSDGsおよびDX戦略のもと、ストック事業（賃貸管理・仲介）における電子契約・モバイル化を推進し、業務効率と生産性を向上させる。"
    },
    other_tools: [
      "Google Workspace / LINE WORKS (社内外コミュニケーション)",
      "ぷれなび (iPad営業提案アプリ)",
      "Wrap (安全管理リモートアクセス)",
      "スマートロック (賃貸管理物件のIoT化)"
    ]
  },
  "wada-corporation": {
    homepage_url: "https://www.wada-corporation.co.jp/",
    dx_policy: {
      challenges: "契約書や重要事項説明書などの各種重要書類作成とチェックバックに要する多大な時間・工数、および属人化の解消。",
      goals: "入力ミスの根絶による企業安全性の向上、および限られた営業事務人員でも分譲プロジェクトを円滑に回せる体制構築。",
      policy_or_goals: "SaaS（Musubell等）による契約業務のクラウド一元管理を推進するとともに、分譲マンション「ロイヤルガーデン」のIoT化や顔認証解錠システム等の標準導入による高付加価値化を図る。"
    },
    other_tools: [
      "eLife (HomeLinkアプリによるスマートホームIoT)",
      "FreeiD (顔認証解錠プラットフォーム)"
    ],
    financials: [
      {
        year: "2026年2月期",
        sales: "15,173百万円",
        profit: "671百万円 (当期純利益)"
      }
    ]
  },
  "miyoshi-fudosan": {
    homepage_url: "https://www.miyoshi.co.jp/",
    dx_policy: {
      challenges: "賃貸・売買・管理業務に伴う膨大な契約・手続き関連の紙書類と、関係者間での捺印・郵送の手間。",
      goals: "業務の完全ペーパーレス化、および顧客や物件オーナーに対する迅速なデジタルコミュニケーションの定着。",
      policy_or_goals: "福岡最大の地場管理会社として、電子契約や各種SaaSの全社導入を推進。賃貸入居から売買、管理に至る全プロセスのペーパーレス化とデジタル体験向上を目指す。"
    },
    other_tools: [
      "いい生活クラウドシリーズ",
      "IT重説システム"
    ],
    financials: [
      {
        year: "近年の業績",
        sales: "非上場のため非公開",
        profit: "非公開。福岡県内トップクラスの管理戸数を背景に安定収益"
      }
    ]
  },
  "sogo-system-kanri": {
    homepage_url: "https://www.bm-ssk.co.jp/",
    dx_policy: {
      challenges: "マンションやビルの管理メンテナンス業務における現場スタッフの移動・報告工数、およびアナログな報告・請求手続きによるタイムラグ。",
      goals: "現場スタッフの負担軽減、およびテレワーク等の柔軟な働き方の定着による人手不足対策と業務の正確性向上。",
      policy_or_goals: "モバイル端末の貸与による現場報告のデジタル化や、Web請求システムの導入による事務プロセスのWeb化を推進。"
    },
    other_tools: [
      "Web請求システム",
      "テレワーク環境（VPN/クラウドツール）の整備",
      "スタッフ用PC・iPhoneなどのモバイル端末"
    ]
  },
  "tc-shinko-estate-service": {
    homepage_url: "https://tc-s-estate-service.co.jp/",
    dx_policy: {
      challenges: "紙ベースで行っていた点検業務や手続きによる非効率性、および古い社内ITインフラの老朽化とセキュリティ対策。",
      goals: "RPAや電子承認、電子契約の全社導入によるバックオフィス業務の高度化、および点検現場のモバイル端末によるデジタル運用移行。",
      policy_or_goals: "「IT推進部」を中心にクラウドインフラへの完全移行を推進し、現場業務のモバイル化、電子署名や承認ワークフローの全社展開により働き方改革とDXを加速。"
    },
    other_tools: [
      "電子契約・電子請求書システム",
      "電子承認ワークフロー",
      "RPA (業務自動化)"
    ]
  },
  "tokyu-fudosan": {
    homepage_url: "https://www.tokyu-land.co.jp/",
    dx_policy: {
      challenges: "開発・管理・運営・仲介という各バリューチェーン間で情報がサイロ化していたこと。また、現場での手作業の多さと人手不足の解消。",
      goals: "デジタルの力であらゆる境界を取り除き、オンラインとオフラインの融合（OMO）、グループ連携を最大化させる。",
      policy_or_goals: "「Digital Fusion」を掲げ、全社データ分析プラットフォームの構築、生成AIの自社システム組み込み、顧客向けデジタル体験（OMO）の最大化を推進。DX認定事業者。"
    },
    other_tools: [
      "Dr.Sum Cloud / MotionBoard Cloud (BIデータ分析)",
      "BizForecast (収支・資金管理)",
      "intra-mart (決裁基盤)",
      "TFHD Chat (独自生成AI)"
    ]
  },
  "nomura-real-estate": {
    homepage_url: "https://www.nomura-re.co.jp/",
    dx_policy: {
      challenges: "多様な物件・アセットの供給増加に伴う営業効率の向上と、ペーパーレス推進やIT統制・セキュリティの維持。",
      goals: "RPAやAIによる「時間の創出」と、データ活用に基づく経営判断の高度化、顧客QOL向上のための空間デジタル化。",
      policy_or_goals: "「デジタルドリームの実現」により、個に寄り添う姿勢をデジタル技術で深化させ、新たな空間価値とQOL向上を創出。DX認定事業者。"
    },
    other_tools: [
      "ROOV (空間デジタル内覧)",
      "ノムコムAIアドバイザー (生成AI対話)",
      "Robo-Pat AI (RPA)",
      "Keyspider (クラウドID管理)",
      "ConforMeeting SaaS (ペーパーレス会議)"
    ]
  },
  "create-estate": {
    homepage_url: "https://create-estate.jp/",
    dx_policy: {
      challenges: "投資用物件仲介における顧客への初期提案スピードアップと、手入力作業に伴う誤記などの計算ミスの防止。",
      goals: "既存の不動産情報ネットワークの機能を徹底活用し、余計なIT投資を抑えたまま営業活動の省力化を図る。",
      policy_or_goals: "ATBBなどの既存システムに標準搭載された見積機能を活用し、追加費用なしで日常的な事務を効率化するコストパフォーマンス重視 of DX。"
    },
    other_tools: []
  },
  "zin-realty": {
    homepage_url: "https://zin-realty.co.jp/",
    dx_policy: {
      challenges: "個人エージェントとしての少人数体制における顧客対応力の最大化と、魅力的な物件提案資料作成の効率化。",
      goals: "お客様へのスピーディーな物件紹介、およびYouTube等を含む自社デジタルメディアからの反響のシームレスな追客。",
      policy_or_goals: "YouTube等の自社メディア発信と、不動産仲介DXプラットフォーム「Facilo」のフル活用による、一気通貫型のデジタル顧客コミュニケーション。"
    },
    other_tools: []
  },
  "living-gallery": {
    homepage_url: "https://www.living-gallery.co.jp/",
    dx_policy: {
      challenges: "遠隔地顧客とのオンライン契約完結の手間の解消、および管理オーナーへの定期報告・修繕承認プロセスの迅速化。",
      goals: "物理的な来店が難しい顧客でも部屋探しから契約完了までを非対面で完結できる仕組みの構築と、オーナー連携の強化。",
      policy_or_goals: "非対面お部屋探しのパイオニアとして、オンライン内覧・電子契約を推進。GMO賃貸DX等のオーナー・入居者向けアプリを通じたデジタルコミュニケーションを確立。"
    },
    other_tools: [
      "GMO賃貸DX (オーナー/入居者アプリ)",
      "THETA 360.biz (360度ツアー)",
      "Zoom等のオンライン接客・IT重説システム"
    ],
    financials: [
      {
        year: "2025年8月期",
        sales: "4,872百万円",
        profit: "408百万円 (経常利益)"
      }
    ]
  },
  "nihon-kanzai": {
    homepage_url: "https://www.nkanzai.co.jp/",
    dx_policy: {
      challenges: "建物管理（BM）における深刻な人手不足と属人化の解消、および建物ライフサイクルコストの最適化や資産価値向上のための提案力強化。",
      goals: "属人的な管理業務を排除し、デジタル化による業務の平準化と可視化を図り、蓄積されたナレッジを組織的に知的財産として活用する。",
      policy_or_goals: "中期成長戦略の柱として「DXの推進」を掲げ、施設管理のWeb化、工事管理の現場アプリ化、独自AIの導入などを統合的に進める。"
    },
    other_tools: [
      "NK Connect (自社独自の施設管理Webシステム)",
      "KANNA (現場DXアプリ。写真・チャットでの工事管理効率化)",
      "NK-AIbot (Azure OpenAIを活用した独自マニュアル学習型AI)",
      "W@FMシステム (24時間365日のフルタイム遠隔監視・省人化)"
    ]
  },
  "space-agency": {
    homepage_url: "https://www.space-agency.jp/",
    dx_policy: {
      challenges: "地域での新築・不動産仲介の反響から契約までの営業リードタイム短縮と、顧客コミュニケーションの見える化。",
      goals: "Web集客とITツールの活用による営業・施工プロセスの可視化と効率化。",
      policy_or_goals: "熊本の地域ビルダーとして、デジタルマーケティングと顧客管理SaaS（Digima等）を活用し、少人数での反響営業をシステム化。"
    },
    other_tools: [
      "SUMiTASシステム（フランチャイズWeb）"
    ]
  },
  "kurashi-works": {
    homepage_url: "http://www.nps-tokyodo.co.jp/",
    dx_policy: {
      challenges: "少人数の営業担当における提案資料作成の負担軽減と、お客様へのスピード提案、追客漏れの解消。",
      goals: "お客様へのスピーディーな物件情報の紹介・提案、および活動履歴の一元管理による営業品質の均一化。",
      policy_or_goals: "地域密着の顧客接点を重視しつつ、Facilo等の不動産仲介専用DXツールを導入して物件紹介や追客をデジタル化・高速化。"
    },
    other_tools: []
  },
  "joytech": {
    homepage_url: "https://www.joytech.co.jp/",
    dx_policy: {
      challenges: "収益不動産売買におけるオーナー折衝や情報整理の効率化、および管理物件オーナーとの書類送付・連絡の負担軽減。",
      goals: "土地・物件オーナーとのシームレスなコミュニケーションの確立と、ペーパーレスによる業務削減。",
      policy_or_goals: "投資用土地・新築分譲売買におけるデータ管理と、GMO賃貸DX等の活用による土地・物件オーナーとのコミュニケーションデジタル化。"
    },
    other_tools: []
  },
  "pacific-real-estate": {
    homepage_url: "https://www.d-comm.jp/",
    dx_policy: {
      challenges: "逗子・鎌倉など広域のお客様に対する迅速なマッチング物件の紹介と、手作業による提案資料作成・内覧スケジュールの煩雑さ。",
      goals: "顧客への提案スピードの極大化と、チャットを活用したノンストレスな顧客とのやり取りの実現。",
      policy_or_goals: "湘南エリアでの中古・新築の仲介において、Facilo等を駆使したオンライン提案と物件情報のスマート共有を推進。"
    },
    other_tools: []
  },
  "mitsui-fudosan-realty": {
    homepage_url: "https://www.mf-realty.jp/",
    dx_policy: {
      challenges: "全国ネットワークでの契約・管理プロセスの標準化と、IT資産の利用実態のブラックボックス化の解消、問い合わせによるバックオフィス工数の抑制。",
      goals: "リアル店舗とデジタルを融合させた顧客体験（&Customer）、社内システムのクラウド化（&Platform）によるIT統制・コスト最適化。",
      policy_or_goals: "三井不動産グループの「DX VISION 2030」に基づき、顧客体験の変革、社内システムのクラウド化、およびDXビジネス人材（&Crew）の育成を推進。"
    },
    other_tools: [
      "WalkMe Discovery (IT資産分析)",
      "PKSHA AIヘルプデスク (社内AIボット)",
      "FastAPP (アプリ内製開発基盤)",
      "イタンジシステム (賃貸内見/申込自動化)"
    ],
    financials: [
      {
        year: "2025年3月期",
        sales: "199,950百万円",
        profit: "31,946百万円 (営業利益)"
      }
    ]
  },
  "keio-real-estate": {
    homepage_url: "https://www.keio-fudosan.co.jp/",
    dx_policy: {
      challenges: "アナログな紙書類作成や電話確認による業務の非効率性、およびオーナーや顧客とのコミュニケーションのタイムラグの解消。",
      goals: "ペーパーレス化の促進、データ一元管理による業務の正確性向上、およびオーナー・顧客等の関係者の利便性向上。",
      policy_or_goals: "京王電鉄グループの総合不動産として、いい生活シリーズなどの不動産SaaSの全社的・一気通貫での導入を推進し、仲介・管理業務の生産性を劇的に高める。"
    },
    other_tools: [
      "いい生活クラウドシリーズ（ESいい物件One等）",
      "AI査定プロ (売買査定自動化)"
    ],
    financials: [
      {
        year: "2025年3月期",
        sales: "非開示（親会社連結）",
        profit: "1,177百万円 (当期純利益)"
      }
    ]
  },
  "utoc": {
    homepage_url: "https://www.utoc.co.jp/",
    dx_policy: {
      challenges: "大量の港湾物流手続書類の処理や、プラント工事現場における報告・写真共有・工程管理などの属人化と手間の削減。",
      goals: "港湾物流手続きの完全電子化と、現場における情報共有・ペーパーレス化による業務負荷・残業時間の削減。",
      policy_or_goals: "国交省の「サイバーポート」を活用した電子手続き化や、現場管理アプリ「KANNA」の導入による施工プロセスのペーパーレス化と残業削減を強力に推進。"
    },
    other_tools: [
      "サイバーポート (物流プラットフォーム)"
    ]
  },
  "appartement-agent": {
    homepage_url: "https://www.appartement.co.jp/",
    dx_policy: {
      challenges: "管理受託戸数の増加に伴うオーナー対応工数の増大と、それに伴う月次収支報告書の郵送・印刷等のコスト。",
      goals: "オーナーアプリの導入による報告プロセスのデジタル化と、ペーパーレス・対応のスピードアップ。",
      policy_or_goals: "アパルトマングループとして、GMO賃貸DX等のオーナーアプリをフル活用し、管理受託オーナーとのコミュニケーション迅速化とペーパーレス化を推進。"
    },
    other_tools: []
  },
  "hirata-fudosan": {
    homepage_url: "https://www.hirata-fudousan.co.jp/",
    dx_policy: {
      challenges: "地域の賃貸管理において高齢の管理オーナーが多く、紙文化からデジタルコミュニケーションへの移行に抵抗感があったこと。",
      goals: "オーナーアプリの導入による収支報告書のデジタル配信移行、およびそれに伴う配送手間の削減とオーナーとのコミュニケーション密接化。",
      policy_or_goals: "地方の地場賃貸管理においてオーナーアプリの定着を図るため、社長室直下に専用チームを立ち上げて若手社員が直接対面でレクチャーを行うなど徹底した定着化を推進。"
    },
    other_tools: []
  },
  "tokyu-community": {
    homepage_url: "https://www.tokyu-com.co.jp/",
    dx_policy: {
      challenges: "管理員や技術職の高齢化と人手不足に伴う、現場の入力ミス防止や安全・健康管理の高度化、および業務報告の効率化。",
      goals: "管理員・技術スタッフの負担軽減と、デジタル化による業務の可視化、安全で働きやすい環境づくり。",
      policy_or_goals: "「課題起点」のデジタル化を推進し、自社開発アプリやSaaSを積極的に導入。現場の働きやすさ（健康管理DX含む）とデジタル活用度（デジタルアダプション）を高める。"
    },
    other_tools: [
      "Volt MXによる自社開発「管理員日誌アプリ」",
      "Box (全社セキュアコンテンツ管理)",
      "Pendo (ITツールの定着化・利用分析)",
      "AYUMI Scan/AYUMI Board (管理員向けの健康管理DX)",
      "DIGGLE (予実管理)"
    ]
  },
  "sanken-home": {
    homepage_url: "https://www.ee-sumai.com",
    dx_policy: {
      challenges: "Webやポータルから入る見込み顧客（リード）に対するフォロー漏れの解消と、モデルハウス来場率の向上。",
      goals: "反響直後の迅速な自動追客、および中長期的な定期メルマガ等を通じた見込み客の育成（ナーチャリング）の仕組み化。",
      policy_or_goals: "千葉の地場ハウスビルダーとして、顧客管理・MAツールを活用し、顧客ごとの状況に合わせたデジタルアプローチ体制の整備。"
    },
    other_tools: []
  },
  "leben-corporation": {
    homepage_url: "https://leben-kanri.co.jp/",
    dx_policy: {
      challenges: "埼玉中心の賃貸管理において、管理戸数拡大に伴うバックオフィス工数の肥大化と、オーナーとの書類郵送・電話連絡の負担。",
      goals: "オーナーとの連絡をチャットやアプリに集約し、定期報告や修繕見積もりの承認プロセスをオンライン化・ペーパーレス化すること。",
      policy_or_goals: "賃貸管理の付加価値向上と業務効率化のため、GMO賃貸DX等のオーナーアプリを積極的に導入・定着させる。"
    },
    other_tools: []
  },
  "relation-real-estate": {
    homepage_url: "https://relation-fukuoka.com/",
    dx_policy: {
      challenges: "限られた営業人員での迅速な購入・売却希望者への対応と、お客様に納得してもらえる物件提案資料作成のスピードアップ。",
      goals: "お客様へのスピーディーな物件紹介、およびLINE連携等を通じたノンストレスで親密な追客・提案フローの構築。",
      policy_or_goals: "福岡の地場不動産会社として、Facilo等の不動産仲介専用DXツールをフル活用し、物件提案のデジタル化・高速化を推進。"
    },
    other_tools: []
  },
  "alphas": {
    homepage_url: "https://alphas-group.jp/",
    dx_policy: {
      challenges: "お客様の希望に合ったマッチング物件の迅速な紹介、および提案資料作成に伴うデスクワークの省力化。",
      goals: "営業担当者の経験やリテラシーに依存しない高品質かつスマートな顧客提案プロセスの平準化。",
      policy_or_goals: "愛知県での不動産仲介（ハウスドゥ等）において、Faciloなどの先進的な紹介・追客ツールを導入し、顧客提案の質を平準化し、成約率の向上を図る。"
    },
    other_tools: []
  },
  "tokyo-tatemono": {
    homepage_url: "https://www.tatemono.com/",
    dx_policy: {
      challenges: "大規模再開発や物件供給の増加に伴う、不動産契約関連事務のペーパーレス化と建物管理・ファンド管理の品質向上・高速化。",
      goals: "分譲マンション販売における非対面電子契約の確立、および建物点検等の現場業務の完全モバイル化・データ連携。",
      policy_or_goals: "総合デベロッパーとして、物件開発・ビル管理・マンション販売等の全領域でDXを推進。電子契約（レリーズ）や建物管理アプリ（管理ロイド）等の導入を積極的に進める。"
    },
    other_tools: []
  },
  "tokyo-tatemono-rim": {
    homepage_url: "https://www.tt-rim.co.jp/",
    dx_policy: {
      challenges: "不動産ファンド（AM）の実務において、PM会社との意思決定プロセス（工事承認等）の遅れと、手作業による報告書作成の非効率性。",
      goals: "工事の起案・決裁ワークフロー、物件データベース、収支管理の一元化による承認プロセスの可視化・高速化と、ディスクロージャーの迅速化。",
      policy_or_goals: "AM業務全般をカバーするデジタルプラットフォーム（T2TR ComFort）の導入を通じて、関係会社間の意思決定の遅れを解消し、ガバナンスとディスクロージャーを迅速化。"
    },
    other_tools: []
  }
};

// Merge updates into companies-detail.json
companies.forEach(company => {
  const update = updates[company.slug];
  if (update) {
    if (update.homepage_url) company.homepage_url = update.homepage_url;
    if (update.dx_policy) company.dx_policy = update.dx_policy;
    if (update.other_tools) company.other_tools = update.other_tools;
    if (update.financials) {
      update.financials.forEach(newF => {
        const exists = company.financials.find(f => f.year === newF.year);
        if (exists) {
          exists.sales = newF.sales;
          exists.profit = newF.profit;
        } else {
          company.financials.unshift(newF);
        }
      });
    }
  }
});

fs.writeFileSync(jsonPath, JSON.stringify(companies, null, 2), 'utf8');
console.log('Successfully updated companies-detail.json with researched data!');
