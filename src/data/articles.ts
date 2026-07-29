import type { Article } from "@/lib/types";

export const articles: Article[] = [
  {
    id: "a001", slug: "costco-trust-and-scale", publishedAt: "2026-07-29",
    title: "好市多、唐太宗與《航海王》：信任如何成為複利",
    excerpt: "從低毛利會員制、貞觀用人，到草帽一夥的共同承諾，拆解信任如何由個人品格沉澱為可複製的制度。",
    company: { name: "Costco 好市多", industry: "會員制零售", foundingBackground: "1976 年 Price Club 的倉儲會員制，後與 Costco 合併。", timeline: ["1976 Price Club 成立", "1983 Costco 開業", "1993 合併擴張", "全球會員制規模化"], firstDividend: "郊區大店與家庭大量採購需求", core: "用有限品項、低加價率換取會員長期信任", flywheel: "低價 → 續會 → 規模採購 → 更低成本", revenue: ["商品銷售", "會員費"], fragileRevenue: "高續會率支撐的會員費", organizationLevel: "高度標準化", singlePointFailure: "價格可信度", trustCrisisPath: "品質或低價承諾失守 → 續會下降 → 飛輪降速", successForces: { 制度: 45, 規模: 30, 品牌: 15, 時機: 10 }, organizationType: "制度型組織" },
    leader: { name: "唐太宗李世民", regime: "唐朝", era: "貞觀初年", dilemma: "戰後政權需由軍事勝利轉成穩定治理", breakthrough: "納諫、減賦與整合敵對人才", institution: "諫官制度與三省協作", talentStrategy: "用人不拘舊怨，讓魏徵等人持續糾偏", tradeoff: "以皇權自我節制換制度可信度", historicalCost: "接班安排與晚年征伐仍暴露個人決策邊界", sources: ["《貞觀政要》", "《資治通鑑》"] },
    ip: { name: "航海王 ONE PIECE", type: "漫畫／動畫 IP", origin: "1997 年《週刊少年 Jump》連載", narrative: "追尋自由與大秘寶的長程冒險", characters: "互補能力、各自創傷、共享承諾", emotionalHook: "夥伴之間不背叛的信任", worldview: "島嶼式世界容納無限支線", symbols: "草帽、海賊旗、D 之名", community: "伏筆考據與角色應援", platformDividend: "週刊連載與跨媒體全球發行", monetization: "出版、動畫、電影、遊戲、授權商品", longevity: "主線終局牽引與持續擴張的世界觀", backlashRisk: "篇幅過長與節奏疲勞", successForces: "敘事 40%／角色 30%／世界觀 20%／平台 10%" },
    stratagem: { title: "上下同欲者勝", source: "《孫子兵法．謀攻篇》", interpretation: "共同承諾不是口號，而是利益、制度與行為的一致。" },
    ymosLayers: [{ layer: "觀耳辨證", insight: "辨識信任危機的早期訊號。" }, { layer: "余氏生命系統學", insight: "將信任視為系統能量，而非單次交易。" }, { layer: "YMOS", insight: "把承諾轉譯成可稽核的營運規則。" }],
    actions: ["列出一項不可犧牲的顧客承諾", "建立承諾失守的領先指標", "讓團隊獎酬與長期續約率連動"], risks: ["過度依賴創辦人信用", "短期促銷侵蝕價格可信度"],
    sources: [{ label: "Costco Annual Reports", url: "https://investor.costco.com/financials/annual-reports-and-proxy-statements/default.aspx" }, { label: "《貞觀政要》", url: "https://ctext.org/wiki.pl?if=gb&res=812163" }], tags: ["信任", "會員制", "組織化", "長青 IP"]
  },
  {
    id: "a002", slug: "nintendo-constraint-and-innovation", publishedAt: "2026-07-28",
    title: "任天堂、劉邦與寶可夢：限制如何催生創新",
    excerpt: "資源不必最多，關鍵是把限制轉成選擇原則，形成不同於競爭者的長期路線。",
    company: { name: "任天堂", industry: "互動娛樂", foundingBackground: "由花札製造起家，跨越百年轉型為遊戲公司。", timeline: ["1889 花札", "1983 紅白機", "2006 Wii", "2017 Switch"], firstDividend: "家用遊戲普及", core: "以玩法創新優先於規格競賽", flywheel: "獨特硬體 → 第一方內容 → 玩家規模 → 開發者投入", revenue: ["硬體", "軟體", "IP 授權"], fragileRevenue: "主機世代轉換", organizationLevel: "高", singlePointFailure: "第一方內容節奏", trustCrisisPath: "硬體定位模糊 → 內容不足 → 生態衰退", successForces: { 內容: 40, 產品: 30, 品牌: 20, 時機: 10 }, organizationType: "創意平台型" },
    leader: { name: "漢高祖劉邦", regime: "漢朝", era: "秦末漢初", dilemma: "資源與個人軍事能力弱於項羽", breakthrough: "聚合蕭何、韓信、張良的互補能力", institution: "分工授權與戰後封賞", talentStrategy: "承認自身邊界，讓專業人才掌握實權", tradeoff: "以利益聯盟換取擴張速度", historicalCost: "建國後異姓王清洗造成信任代價", sources: ["《史記．高祖本紀》"] },
    ip: { name: "寶可夢", type: "遊戲 IP", origin: "1996 年 Game Boy 遊戲", narrative: "蒐集、培育、交換與對戰", characters: "大量可辨識生物與夥伴關係", emotionalHook: "發現與陪伴", worldview: "可持續新增區域與物種", symbols: "精靈球、皮卡丘", community: "交換、對戰、卡牌賽事", platformDividend: "掌機連線交換", monetization: "遊戲、卡牌、動畫、商品、活動", longevity: "核心循環穩定、內容模組化更新", backlashRisk: "品質與創新速度不符期待", successForces: "機制 35%／角色 30%／社群 25%／平台 10%" },
    stratagem: { title: "避實擊虛", source: "《孫子兵法．虛實篇》", interpretation: "不在對手最強處比規格，而在未被滿足的使用情境建立優勢。" },
    ymosLayers: [{ layer: "觀耳辨證", insight: "分辨真正限制與自我設限。" }, { layer: "耳林高手", insight: "從弱訊號找到非主流需求。" }, { layer: "理解生命．理解系統．理解世界運行", insight: "以生態位置取代單點勝負。" }],
    actions: ["寫下目前資源限制", "把一項限制改寫為設計原則", "選擇競爭者忽略的使用情境"], risks: ["差異化被誤讀為落後", "過度依賴少數核心 IP"], sources: [{ label: "Nintendo History", url: "https://www.nintendo.co.jp/corporate/en/history/" }], tags: ["創新", "限制", "平台", "IP 生態"]
  },
  {
    id:"a003",slug:"toyota-system-and-resilience",publishedAt:"2026-07-27",title:"豐田、曾國藩與哆啦 A 夢：慢系統如何累積韌性",excerpt:"真正可靠的成長，往往不是追求單次最快，而是讓問題被看見、知識能沉澱、系統可以持續修正。",
    company:{name:"Toyota 豐田汽車",industry:"汽車製造",foundingBackground:"由豐田自動織機事業延伸至汽車製造，以現場改善建立生產體系。",timeline:["1937 公司成立","戰後精實生產成形","全球化設廠","油電與多動力布局"],firstDividend:"戰後日本資源稀缺帶來的效率需求",core:"消除浪費並讓品質問題在現場即時浮現",flywheel:"問題可視化 → 持續改善 → 品質提升 → 信任與規模",revenue:["整車銷售","金融服務","零組件"],fragileRevenue:"景氣循環中的整車需求",organizationLevel:"高度制度化",singlePointFailure:"供應鏈同步能力",trustCrisisPath:"品質異常未被揭露 → 召回擴大 → 品牌可信度受損",successForces:{制度:45,製造:30,人才:15,品牌:10},organizationType:"學習型製造組織"},
    leader:{name:"曾國藩",regime:"清朝",era:"晚清內亂",dilemma:"以地方力量重建軍事與治理能力",breakthrough:"以笨功夫建立湘軍組織與人才網絡",institution:"營制、糧餉與幕府分工",talentStrategy:"識人、耐心磨練並容納互補人才",tradeoff:"以較慢的穩定推進換取組織可控",historicalCost:"地方軍事化加深中央權力結構改變",sources:["《曾國藩家書》","《清史稿》"]},
    ip:{name:"哆啦 A 夢",type:"漫畫／動畫 IP",origin:"1969 年開始連載",narrative:"未來機器人陪伴普通孩子面對日常困境",characters:"缺點鮮明、關係穩定、易於代入",emotionalHook:"補救遺憾與被陪伴的安全感",worldview:"日常生活連接無限未來道具",symbols:"四次元口袋、任意門、竹蜻蜓",community:"跨世代共同記憶",platformDividend:"兒童雜誌與電視動畫長期播放",monetization:"出版、動畫、電影、授權商品",longevity:"固定角色關係加上無限道具變奏",backlashRisk:"公式化與價值觀時代落差",successForces:"角色 35%／情緒 30%／機制 25%／平台 10%"},
    stratagem:{title:"先為不可勝",source:"《孫子兵法．軍形篇》",interpretation:"先降低自身失誤與脆弱性，再等待可擴張的機會。"},ymosLayers:[{layer:"余氏生命系統學",insight:"韌性來自持續代謝問題的能力。"},{layer:"醫生醫世小方茶",insight:"以小改善處理大系統的日常耗損。"},{layer:"YMOS",insight:"把現場經驗沉澱成組織規則。"}],actions:["建立問題可視化看板","每週固定完成一項小改善","將異常處理寫成可複用標準"],risks:["改善流程僵化成形式","過度效率化犧牲探索"],sources:[{label:"Toyota Production System",url:"https://global.toyota/en/company/vision-and-philosophy/production-system/"}],tags:["韌性","精實管理","持續改善"]
  },
  {
    id:"a004",slug:"patagonia-purpose-and-boundaries",publishedAt:"2026-07-26",title:"Patagonia、王安石與宮崎駿：使命如何約束成長",excerpt:"使命若不能限制企業不該做什麼，就只是行銷語言；真正的使命會改變產品、資本與作品的選擇。",
    company:{name:"Patagonia",industry:"戶外服飾",foundingBackground:"由攀岩裝備起家，逐步將環境責任納入產品與治理。",timeline:["1973 品牌成立","推動有機棉","Worn Wear 維修再用","所有權轉入公益架構"],firstDividend:"戶外運動與環境意識上升",core:"以耐用產品與環境承諾建立價值共同體",flywheel:"使命一致 → 顧客認同 → 品牌溢價 → 環境投入",revenue:["服飾","裝備","直營與電商"],fragileRevenue:"價值認同支撐的品牌溢價",organizationLevel:"使命制度化",singlePointFailure:"言行一致性",trustCrisisPath:"供應鏈承諾落差 → 被指漂綠 → 社群反噬",successForces:{使命:35,產品:30,社群:20,品牌:15},organizationType:"使命驅動型"},
    leader:{name:"王安石",regime:"北宋",era:"神宗朝財政與邊防壓力",dilemma:"國家財政、軍備與地方治理積弊",breakthrough:"以成套新法重塑國家資源配置",institution:"青苗、募役、保甲等制度改革",talentStrategy:"建立改革團隊並快速推進",tradeoff:"以改革速度換取既有利益結構的強烈反彈",historicalCost:"政策執行落差與黨爭加劇",sources:["《宋史．王安石傳》"]},
    ip:{name:"吉卜力工作室",type:"動畫品牌 IP",origin:"1985 年成立",narrative:"以自然、成長、勞動與反戰觀看現代世界",characters:"不完美但具行動力的普通人",emotionalHook:"童年感、失落與溫柔的抵抗",worldview:"現實與奇幻自然相接",symbols:"龍貓、飛行器、森林與風",community:"作品重看與跨世代分享",platformDividend:"院線動畫與家庭影音",monetization:"電影、授權、展覽、主題園區",longevity:"作者性、美術辨識度與普世情感",backlashRisk:"核心創作者接班",successForces:"美學 35%／敘事 30%／情感 25%／品牌 10%"},
    stratagem:{title:"有所不為",source:"《孟子．離婁下》",interpretation:"清楚拒絕短期利益，才能讓長期定位具有可信度。"},ymosLayers:[{layer:"觀耳辨證",insight:"辨別使命與包裝語言的差異。"},{layer:"YMOS",insight:"使命必須進入資源配置與否決規則。"},{layer:"理解生命．理解系統．理解世界運行",insight:"成長需要邊界才不會反噬自身。"}],actions:["寫下三件即使賺錢也不做的事","稽核品牌承諾與供應鏈落差","為使命設定可量測指標"],risks:["使命被個人化","高價格排除部分顧客"],sources:[{label:"Patagonia Ownership",url:"https://www.patagonia.com/ownership/"}],tags:["使命","治理","品牌邊界"]
  },
  {
    id:"a005",slug:"ikea-standardization-and-imagination",publishedAt:"2026-07-25",title:"IKEA、秦始皇與 LEGO：標準化如何釋放想像",excerpt:"標準不是創意的敵人；好的模組與共同語言，反而能讓更多人參與組合並擴大系統。",
    company:{name:"IKEA",industry:"家居零售",foundingBackground:"從郵購商店發展出平板包裝與自助式家居零售。",timeline:["1943 創立","1956 平板包裝","全球展店","全通路轉型"],firstDividend:"戰後大眾住宅與平價設計需求",core:"以設計、規模與顧客自助降低價格",flywheel:"標準設計 → 平板物流 → 低成本 → 全球規模",revenue:["家具家飾","餐飲","服務"],fragileRevenue:"大型門市帶來的固定成本",organizationLevel:"高度模組化",singlePointFailure:"全球供應與庫存協調",trustCrisisPath:"品質或永續承諾落差 → 價值感下降",successForces:{系統:40,設計:25,規模:25,品牌:10},organizationType:"全球模組型"},
    leader:{name:"秦始皇嬴政",regime:"秦朝",era:"戰國末至統一初期",dilemma:"將多國疆域整合為單一治理系統",breakthrough:"統一法制、度量衡、文字與交通規格",institution:"郡縣制與中央官僚體系",talentStrategy:"以軍功與官僚能力配置人才",tradeoff:"以高度一致性換取快速整合",historicalCost:"壓力過度集中，缺乏緩衝與糾錯",sources:["《史記．秦始皇本紀》"]},
    ip:{name:"LEGO 樂高",type:"玩具／內容 IP",origin:"丹麥木製玩具公司發展為積木系統",narrative:"透過組合創造自己的世界",characters:"由通用人偶延伸至原創與聯名角色",emotionalHook:"創造、掌控與共同完成",worldview:"所有場景都可由相容模組重建",symbols:"凸點積木與黃色人偶",community:"玩家創作、收藏與提案平台",platformDividend:"標準積木的跨套組相容性",monetization:"套組、授權、影視、遊戲、樂園",longevity:"底層標準穩定，上層題材無限",backlashRisk:"過度授權與價格上升",successForces:"系統 40%／創造力 30%／社群 20%／授權 10%"},
    stratagem:{title:"形人而我無形",source:"《孫子兵法．虛實篇》",interpretation:"底層規則一致，上層組合保持彈性，才能兼具規模與變化。"},ymosLayers:[{layer:"耳林高手",insight:"聽見使用者如何自行改造產品。"},{layer:"YMOS",insight:"建立最小共同標準與模組介面。"},{layer:"理解生命．理解系統．理解世界運行",insight:"秩序與自由需在不同層次共存。"}],actions:["找出可共用的最小模組","允許使用者重新組合","檢查標準化是否保留回饋通道"],risks:["標準變成僵化控制","規模擴張造成單點壓力"],sources:[{label:"IKEA History",url:"https://www.ikea.com/global/en/our-business/how-we-work/the-ikea-history/"}],tags:["標準化","模組","規模"]
  },
  {
    id:"a006",slug:"spotify-discovery-and-attention",publishedAt:"2026-07-24",title:"Spotify、曹操與初音未來：平台如何分配注意力",excerpt:"平台真正稀缺的不是內容，而是被看見的機會；推薦、用人與二次創作都在回答同一個分配問題。",
    company:{name:"Spotify",industry:"音訊串流平台",foundingBackground:"以合法、即時的串流體驗回應數位音樂盜版。",timeline:["2006 成立","2008 上線","個人化推薦擴張","Podcast 與有聲內容布局"],firstDividend:"寬頻普及與音樂數位化",core:"降低聆聽摩擦並以推薦提升發現效率",flywheel:"內容供給 → 使用資料 → 推薦改善 → 時數與訂閱",revenue:["訂閱","廣告"],fragileRevenue:"授權成本下的訂閱毛利",organizationLevel:"平台化",singlePointFailure:"推薦與授權關係",trustCrisisPath:"推薦偏差或創作者分潤爭議 → 平台信任下降",successForces:{產品:30,資料:30,授權:25,規模:15},organizationType:"雙邊內容平台"},
    leader:{name:"曹操",regime:"東漢末曹魏政權",era:"群雄割據",dilemma:"人才分散、糧秣不足與政治正統競爭",breakthrough:"奉天子以令不臣、屯田並廣納人才",institution:"屯田制與軍政人才體系",talentStrategy:"唯才是舉，跨越名望與出身限制",tradeoff:"以能力與效率優先，承擔道德形象爭議",historicalCost:"高壓政治與權力猜疑留下反噬",sources:["《三國志．武帝紀》"]},
    ip:{name:"初音未來",type:"虛擬歌手／UGC IP",origin:"以 Vocaloid 語音合成軟體角色推出",narrative:"由創作者共同填寫、沒有唯一正史",characters:"穩定視覺符號與開放人格",emotionalHook:"任何人都能讓角色唱出自己的作品",worldview:"由歌曲、插畫與演出不斷生成",symbols:"藍綠雙馬尾、01 編號",community:"作曲、繪圖、翻唱與二次創作",platformDividend:"影音平台與創作工具普及",monetization:"軟體、演唱會、授權、商品",longevity:"開放創作權與社群接力",backlashRisk:"平台依賴與創作者回報不均",successForces:"社群 40%／工具 25%／符號 20%／平台 15%"},
    stratagem:{title:"求之於勢，不責於人",source:"《孫子兵法．勢篇》",interpretation:"設計讓好內容與人才更容易被發現的機制，而非只期待個人突破。"},ymosLayers:[{layer:"觀耳辨證",insight:"辨認注意力被演算法放大的偏差。"},{layer:"耳林高手",insight:"讓弱小但有價值的訊號被聽見。"},{layer:"YMOS",insight:"設計透明且可修正的分配機制。"}],actions:["盤點誰決定內容曝光","加入探索性推薦比例","公開創作者回饋與申訴路徑"],risks:["演算法同質化","平台與創作者利益失衡"],sources:[{label:"Spotify Company Info",url:"https://newsroom.spotify.com/company-info/"}],tags:["平台","注意力","創作者經濟"]
  },
  {
    id:"a007",slug:"muji-subtraction-and-clarity",publishedAt:"2026-07-23",title:"無印良品、諸葛亮與《灌籃高手》：減法如何留下核心",excerpt:"成熟策略不是不斷增加，而是知道哪些元素一旦拿掉，價值反而會更清楚。",
    company:{name:"無印良品 MUJI",industry:"生活用品零售",foundingBackground:"以「有理由的便宜」反思過度品牌化與包裝。",timeline:["1980 品牌誕生","獨立展店","海外擴張","生活方式品牌化"],firstDividend:"消費者對過度包裝與名牌溢價的反思",core:"刪除非必要裝飾，保留材料與使用本質",flywheel:"簡化設計 → 成本與辨識度 → 跨品類一致 → 生活方式信任",revenue:["家居用品","服飾","食品"],fragileRevenue:"審美一致性帶來的品牌吸引力",organizationLevel:"設計原則化",singlePointFailure:"簡約理念被稀釋",trustCrisisPath:"品類膨脹 → 品質不一 → 無品牌反成品牌套路",successForces:{設計:35,商品:30,系統:20,時代:15},organizationType:"理念型零售"},
    leader:{name:"諸葛亮",regime:"蜀漢",era:"三國鼎立",dilemma:"國力與人口弱於曹魏，需維持政權與聯盟",breakthrough:"整飭內政、聯吳並以組織紀律補資源不足",institution:"賞罰分明與行政責任制",talentStrategy:"重視品行與執行可靠性",tradeoff:"以高控制與勤政換穩定，卻降低接班彈性",historicalCost:"事必躬親形成組織依賴",sources:["《三國志．諸葛亮傳》","《出師表》"]},
    ip:{name:"灌籃高手 SLAM DUNK",type:"漫畫／動畫 IP",origin:"1990 年開始漫畫連載",narrative:"問題少年因籃球與團隊逐步成長",characters:"動機單純、缺點清楚、互補而衝突",emotionalHook:"青春、挫敗與未完成感",worldview:"聚焦校園籃球，刻意不無限擴張",symbols:"紅色球衣、籃球鞋、終場擊掌",community:"賽事回憶、角色認同與世代共鳴",platformDividend:"少年漫畫與電視動畫",monetization:"出版、動畫、電影、授權",longevity:"克制的結局保留想像與情感峰值",backlashRisk:"新內容稀少與世代距離",successForces:"角色 35%／節奏 30%／情感 25%／題材 10%"},
    stratagem:{title:"兵貴勝，不貴久",source:"《孫子兵法．作戰篇》",interpretation:"策略需要終止條件；無止境延伸會耗損最初的價值。"},ymosLayers:[{layer:"觀耳辨證",insight:"分辨真正需要與被製造的複雜。"},{layer:"醫生醫世小方茶",insight:"用小而準確的方案減少系統負擔。"},{layer:"理解生命．理解系統．理解世界運行",insight:"懂得結束也是系統智慧。"}],actions:["刪除一項無法解釋價值的功能","為專案寫下結束條件","找出不可被刪除的核心體驗"],risks:["減法變成缺乏創新","過度依賴單一審美"],sources:[{label:"MUJI About",url:"https://www.muji.com/tw/about/"}],tags:["減法","聚焦","品牌哲學"]
  }
];

export const getArticle = (slug: string) => articles.find((article) => article.slug === slug);
