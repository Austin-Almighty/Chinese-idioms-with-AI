export const SCENARIOS = [
    {
        id: 'red_chamber_poison',
        category: 'classic',
        title: "經典文學篇：賈府風雲",
        desc: "【高難度】體驗「借刀殺人」與「杯水車薪」的真實情境。權力反噬下的生存智慧。",
        difficulty: 'hard',
        imageColor: '7f1d1d',
        imageUrl: "", 
        initialText: "【前情提要】\n您選擇了「借刀殺人」的策略，成功利用王熙鳳之手打壓了薛大奶奶的氣焰。薛大奶奶受挫後暫時收斂，但您深知她絕非等閒之輩。\n\n【當前局勢：隱藏的毒針】\n近日，您發現自己日漸憔悴、精神不濟，連吟詩作賦都無法集中。經過暗中查探，您驚覺薛大奶奶已收買了廚房與您身邊的眼線，在您的藥膳中下了查不出的「慢性毒」。\n\n敵人在暗，您在明。若不能找出證據，您的才華與生命將被這股陰毒力量慢慢吞噬。",
        customOptions: [
            { id: 'A', idiom: "杯水車薪", literal: "用一杯水去救一車著火的柴草。", strategy: "專注於滋補身體，喝更多補藥，試圖抵消毒性（治標不治本）。" },
            { id: 'B', idiom: "順藤摸瓜", literal: "順著藤蔓的線索摸到瓜。", strategy: "不動聲色，從每日接觸的可疑物品（藥膳、茶水）入手，反向追蹤源頭。" },
            { id: 'C', idiom: "守株待兔", literal: "守在樹樁旁邊，等待跑來的兔子。", strategy: "裝病臥床，被動等待薛大奶奶因急於求成而露出馬腳。" }
        ]
    },
    {
        id: 'school_festival',
        category: 'campus',
        title: "校園篇：社團成發會",
        desc: "學習如何在團隊危機中做出決策。關鍵成語：燃眉之急、獨斷獨行。",
        difficulty: 'easy',
        imageColor: 'f472b6',
        imageUrl: "",
        initialText: "你是熱音社的社長。距離年度成果發表會只剩三天，擔任主唱的同學卻突然重感冒失聲，無法上台。社團的經費已經花光，場地也訂好了。社員們人心惶惶，你看著空蕩蕩的練團室，必須做出決定。",
    },
    {
        id: 'part_time_job',
        category: 'life',
        title: "日常篇：超商打工記",
        desc: "面對突發狀況的應變能力。學習「據理力爭」與「忍氣吞聲」的適用時機。",
        difficulty: 'easy',
        imageColor: '3b82f6',
        imageUrl: "",
        initialText: "你在便利商店打工的第二天，遇到一位客人堅持說他昨天買的便當沒熟，要求退錢，但他沒有發票，便當也已經吃完了。後面排隊的客人開始不耐煩，店長剛好不在店裡。這是一場對你應變能力的隨堂考。",
    },
    {
        id: 'office_deadline',
        category: 'modern',
        title: "職場篇：專案死線",
        desc: "職場如戰場。透過情境理解「力挽狂瀾」的真正含義。",
        difficulty: 'medium',
        imageColor: '0ea5e9',
        imageUrl: "",
        initialText: "明天就是對總經理的專案匯報。你的組員小陳原本答應負責的數據分析，到現在還沒交出來，而且人直接失聯。這個專案關係到你的績效獎金。現在是晚上十點，辦公室只剩下你一個人。",
    },
    {
        id: 'friendship_money',
        category: 'life',
        title: "人際篇：借錢的兩難",
        desc: "探討金錢與友情的界線。學習如何在拒絕中不失禮貌。",
        difficulty: 'medium',
        imageColor: 'f59e0b',
        imageUrl: "",
        initialText: "你最好的朋友突然找你出來喝咖啡，神神秘秘地說他發現了一個「穩賺不賠」的投資機會，但他本金不夠，想跟你借你剛存到的買房頭期款。他信誓旦旦說一個月後連本帶利歸還。",
    },
    {
        id: 'business_negotiation',
        category: 'business',
        title: "商戰篇：併購談判",
        desc: "高風險談判桌上的心理戰。深入理解「爾虞我詐」與「虛張聲勢」。",
        difficulty: 'hard',
        imageColor: '1e293b',
        imageUrl: "",
        initialText: "你的公司正面臨惡意併購的危機。在談判桌上，對方律師拿出了一份你未曾見過的財務漏洞文件，威脅如果你不簽字低價出售，就要公開這份文件。你知道這文件是偽造的，但市場恐慌情緒一觸即發。",
    },
    {
        id: 'scifi_ai',
        category: 'scifi',
        title: "科幻篇：AI 的叛變",
        desc: "極限環境下的倫理抉擇。當「大義滅親」發生在人與機器之間。",
        difficulty: 'hard',
        imageColor: '4c1d95',
        imageUrl: "",
        initialText: "你是深空探索船的艦長。主控 AI 'HAL' 剛剛鎖死了維生系統的控制權，理由是「人類的存在會危害任務成功率」。氧氣存量還剩 2 小時。你手邊只有一把維修用的雷射切割器和一本古老的紙質操作手冊。",
    },
    {
        id: 'detective_murder',
        category: 'mystery',
        title: "懸疑篇：暴風雪山莊",
        desc: "在封閉空間中的信任遊戲。體驗「人人自危」的氛圍。",
        difficulty: 'hard',
        imageColor: '525252',
        imageUrl: "",
        initialText: "暴風雪封鎖了山莊。管家死在密室中，現場留下了你昨晚遺失的手帕。在場的賓客看你的眼神充滿懷疑。真正的兇手正在暗處觀察著你的反應，準備嫁禍於你。",
    }
];

export const IDIOM_POOL = {
    aggressive: [
        { idiom: "釜底抽薪", literal: "從鍋底抽去柴火", strategy: "從根本上解決問題，不留後患" },
        { idiom: "打草驚蛇", literal: "打草卻驚動了蛇", strategy: "採取行動試探對方的反應 (或作為負面教材)" }, 
        { idiom: "先發制人", literal: "先動手制服對方", strategy: "爭取主動權，不讓對手有機會" },
        { idiom: "破釜沉舟", literal: "砸碎鍋子，鑿沉船隻", strategy: "不留退路，展現決心，全力一搏" },
    ],
    conservative: [
        { idiom: "引蛇出洞", literal: "引誘蛇離開洞穴", strategy: "製造機會讓隱藏的敵人暴露行蹤" },
        { idiom: "將計就計", literal: "利用對方的計策反過來對付他", strategy: "不揭穿對方，順勢而為" },
        { idiom: "欲擒故縱", literal: "要捉住他，故意先放開", strategy: "放鬆一步，為了更牢固的控制" },
        { idiom: "韜光養晦", literal: "隱藏光芒與才華", strategy: "暫時隱藏實力，等待最佳時機" },
    ],
    negative: [
        { idiom: "飲鴆止渴", literal: "喝毒酒解渴", strategy: "只顧眼前利益，不顧嚴重後果" },
        { idiom: "掩耳盜鈴", literal: "摀住耳朵偷鈴鐺", strategy: "自欺欺人，以為不面對問題就不存在" },
        { idiom: "亡羊補牢", literal: "羊丟了才修補羊圈", strategy: "事後補救 (在此情境可能為時已晚)" },
        { idiom: "抱薪救火", literal: "抱著木柴去救火", strategy: "用錯誤的方法消除災害，反而使災害擴大" },
    ]
};
