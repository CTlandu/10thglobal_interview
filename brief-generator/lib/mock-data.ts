import type {
  DemoCase,
  StructuredBriefData,
  AIModelOutput,
  ModelDifference,
  ClarificationItem,
  MeetingDecision,
  PreciseRequirement,
  VagueRequirement,
  DiffField,
} from "./types";

// ─────────────────────────────────────────────
// Demo 案例（供演示按钮使用）
// ─────────────────────────────────────────────
export const DEMO_CASES: DemoCase[] = [
  {
    id: "saudi-ai",
    label: "🇸🇦 沙特政府代表团 — AI 考察",
    description: "副部长级，12人，考察大模型与具身机器人",
    rawDraft: `客户：沙特阿拉伯数字化转型局（SDAIA）代表团
日期：2025年10月中旬，共5天
人数：12人，含3名副部长级官员
所需陪同人数：2名高级陪同，1名翻译
参观行业意向：
  1. AI大模型 — 首选字节跳动AI Lab，备选待定
  2. 具身机器人 — 首选UBTECH，了解到有展厅
  3. 政务数字化 — 暂无具体公司
特殊要求：全程英阿双语翻译，部分场合需要阿拉伯语资料，可能有媒体随行
其他信息：
  - 联系人：Mohammed Al-Rashid（首席数字顾问）
  - 接待规格：VIP，高规格全程陪同`,
    meetingNotes: `碰头会时间：2025年9月15日 下午3点，腾讯会议
参与方：我方（张总、李经理）、合作方接待公司（王总）

会议要点记录：
1. 字节跳动参观：对方反馈字节内部有规定，暂不接受政府代表团参观。建议改为智谱AI或MiniMax。
2. 百度文心团队：可以安排，需提前6周申请，正在推进。
3. 机器人参观：UBTECH总部在深圳，可以安排半天参观，有专属展厅。宇树科技也是备选，价格更灵活。
4. 媒体随行：需各参观方单独审批，预计2-3家婉拒拍摄。
5. 预算初步确认：整体接待预算约80-120万人民币，具体分项待合同签订后明细。
6. 行程优先级：北京（2天）→ 深圳（2天）→ 上海（1天）
7. 人数确认：12人总人数不变，但陪同人员调整为3人（增加1名礼宾协调）`,
  },
  {
    id: "uae-manufacturing",
    label: "🇦🇪 UAE主权基金 — 新能源制造考察",
    description: "6人投资经理，考察宁德时代+比亚迪供应链",
    rawDraft: `客户：阿布扎比投资局（ADIA）科技产业部
日期：2025年11月底，共4天
人数：6人，全部高级投资经理
所需陪同人数：1名高级陪同，1名专业翻译
参观行业意向：
  1. 新能源电池 — 首选宁德时代（CATL），宁德总部
  2. 新能源整车 — 首选比亚迪，深圳总部
  3. 供应链创新 — 待定
特殊要求：需要ESG报告和碳中和路线图，注重技术细节，不允许拍照录像（保密要求）
其他信息：
  - 联系人：Khalid Ibrahim（科技投资总监）
  - 预算：中高级，重点商务对接`,
    meetingNotes: `碰头会纪要 - 2025年10月8日

关键结论：
1. CATL参观：可以安排宁德总部参观生产线，但需签保密协议，不允许拍照录像。投资级数据需通过正式渠道另行申请。
2. BYD：建议安排深圳总部，展示整车制造和电池一体化。BYD对高净值投资者有专属接待流程。
3. 新增需求：对方希望增加与中国汽车行业分析机构闭门座谈（中国汽车工业协会或罗兰贝格中国）。
4. ESG材料：对方明确要求各企业提供ESG报告和碳中和路线图，需提前收集。
5. 行程调整：原计划4天改为3天（客户行程冲突），需压缩安排。`,
  },
];

// ─────────────────────────────────────────────
// Phase A Mock 数据
// ─────────────────────────────────────────────

export function mockPhaseA_Step1(): StructuredBriefData {
  return {
    client: "沙特阿拉伯数字化转型局（SDAIA）代表团",
    date: "2025年10月中旬，共5天",
    headcount: {
      total: 12,
      officials: 3,
      companions: 2,
    },
    industryInterests: [
      {
        rank: 1,
        industry: "AI大模型",
        suggestedCompany: "字节跳动 AI Lab",
        basis: "客户明确指定，基于公司历史接待经验",
      },
      {
        rank: 2,
        industry: "具身机器人",
        suggestedCompany: "UBTECH",
        basis: "客户提及 UBTECH 展厅，公司有对接渠道",
      },
      {
        rank: 3,
        industry: "政务数字化",
        suggestedCompany: "待定（TBD）",
        basis: "客户有意向但无具体公司偏好，需碰头会确认",
      },
    ],
    specialRequirements: ["全程英阿双语翻译", "部分场合需阿拉伯语材料", "媒体随行（待审批）"],
    otherInfo: [
      "联系人：Mohammed Al-Rashid（首席数字顾问）",
      "接待规格：VIP 高规格全程陪同",
    ],
  };
}

export function mockPhaseA_ModelA(): AIModelOutput {
  return {
    modelName: "Kimi (moonshot-v1)",
    modelIcon: "🌙",
    structuredData: mockPhaseA_Step1(),
    clarificationItems: [
      {
        id: "A1",
        field: "所需陪同人数",
        question: "初稿显示「2名高级陪同+1名翻译」，但陪同人数字段只写了2人，翻译是否计入陪同总人数？",
        priority: "high",
        resolved: false,
      },
      {
        id: "A2",
        field: "参观行业意向 - AI大模型",
        question: "字节跳动 AI Lab 是否已有对接渠道？若字节不接受，备选方案是什么？",
        priority: "high",
        resolved: false,
      },
      {
        id: "A3",
        field: "媒体随行",
        question: "媒体随行是客户主动要求还是我方安排？各参观企业是否提前知情并同意？",
        priority: "medium",
        resolved: false,
      },
      {
        id: "A4",
        field: "政务数字化",
        question: "参观行业意向第3条（政务数字化）无具体公司，是否需要在碰头会前由我方提供候选名单？",
        priority: "medium",
        resolved: false,
      },
    ],
    notes: "整体初稿信息较完整，但字节跳动对接可行性存疑，建议重点在碰头会中确认备选方案。",
  };
}

export function mockPhaseA_ModelB(): AIModelOutput {
  return {
    modelName: "GPT-4o-mini",
    modelIcon: "🤖",
    structuredData: {
      ...mockPhaseA_Step1(),
      headcount: {
        total: 12,
        officials: 3,
        companions: 3, // ← 差异点：Model B 将翻译计入陪同
      },
    },
    clarificationItems: [
      {
        id: "B1",
        field: "所需陪同人数",
        question: "陪同人员编制：2名高级陪同 + 1名翻译 = 共3人，还是2人（翻译外聘不计）？建议统一口径。",
        priority: "high",
        resolved: false,
      },
      {
        id: "B2",
        field: "参观行业意向 - 优先级权重",
        question: "三个参观行业（AI大模型、具身机器人、政务数字化）若时间冲突，优先级顺序如何？需客户确认。",
        priority: "high",
        resolved: false,
      },
      {
        id: "B3",
        field: "特殊要求 - 阿拉伯语材料",
        question: "哪些场合需要阿拉伯语材料？是全部参观场合，还是特定的正式会议环节？",
        priority: "medium",
        resolved: false,
      },
      {
        id: "B4",
        field: "接待预算",
        question: "初稿未提及预算范围，是否已有内部预算上限？「高规格」的具体标准是什么？",
        priority: "low",
        resolved: false,
      },
    ],
    notes:
      "发现陪同人数存在歧义（2 vs 3），且初稿缺少预算信息。行业优先级权重未明确，建议在碰头会议程中专门确认。",
  };
}

export function mockPhaseA_Differences(): ModelDifference[] {
  return [
    {
      field: "所需陪同人数",
      modelAValue: "2人（高级陪同2名，翻译单独列计）",
      modelBValue: "3人（含翻译共3名）",
      riskLevel: "high",
      suggestion: "需在碰头会中明确：翻译是否计入陪同编制，避免报价和实际安排不一致。",
    },
    {
      field: "澄清问题侧重",
      modelAValue: "重点关注字节跳动对接可行性及备选",
      modelBValue: "重点关注行业优先级权重和预算范围",
      riskLevel: "medium",
      suggestion: "两者都重要，建议合并为完整澄清清单，碰头会中逐项确认。",
    },
    {
      field: "特殊要求细化",
      modelAValue: "笼统列为「媒体随行（待审批）」",
      modelBValue: "进一步拆分：哪些场合需阿拉伯语材料？",
      riskLevel: "medium",
      suggestion: "Model B 的细化更有利于执行，建议采纳 Model B 的版本。",
    },
  ];
}

export function mockPhaseA_ClarificationList(): ClarificationItem[] {
  return [
    {
      id: "C1",
      field: "所需陪同人数",
      question: "陪同总人数：2人（翻译外聘）还是3人（翻译计入）？",
      priority: "high",
      resolved: false,
    },
    {
      id: "C2",
      field: "参观行业意向 - 字节跳动",
      question: "字节跳动 AI Lab 是否有对接渠道？若不可行，备选方案是什么（智谱AI / MiniMax）？",
      priority: "high",
      resolved: false,
    },
    {
      id: "C3",
      field: "参观行业意向 - 优先级",
      question: "若三个参观行业（AI大模型、机器人、政务数字化）时间冲突，优先顺序如何？",
      priority: "high",
      resolved: false,
    },
    {
      id: "C4",
      field: "媒体随行",
      question: "媒体随行是客户主动要求还是我方安排？各参观企业是否知情并同意拍摄？",
      priority: "medium",
      resolved: false,
    },
    {
      id: "C5",
      field: "阿拉伯语材料",
      question: "哪些环节需要阿拉伯语材料？是全部场合还是仅正式会议？",
      priority: "medium",
      resolved: false,
    },
    {
      id: "C6",
      field: "接待预算",
      question: "内部预算上限是否已确定？「高规格」接待的具体标准（人均餐标、酒店星级等）？",
      priority: "low",
      resolved: false,
    },
    {
      id: "C7",
      field: "政务数字化参观",
      question: "政务数字化参观无具体公司，是否由我方提供候选名单供客户选择？",
      priority: "low",
      resolved: false,
    },
  ];
}

// ─────────────────────────────────────────────
// Phase B Mock 数据
// ─────────────────────────────────────────────

export function mockPhaseB_Decisions(): MeetingDecision[] {
  return [
    {
      topic: "字节跳动参观替换",
      decision: "字节跳动不接受政府代表团，改为智谱AI或MiniMax，两者均有对接渠道。",
      actionItem: "王总负责联系智谱AI，本周内确认档期。",
      linkedClarificationId: "C2",
    },
    {
      topic: "百度参观确认",
      decision: "百度可安排，需提前6周申请。",
      actionItem: "李经理本周提交申请，锁定日期。",
    },
    {
      topic: "机器人参观确认",
      decision: "UBTECH 深圳总部半天参观，专属展厅可用。宇树科技作为备选。",
      actionItem: "确认 UBTECH 档期，备选宇树科技报价。",
    },
    {
      topic: "陪同人数调整",
      decision: "陪同人员从2人调整为3人（增加1名礼宾协调），翻译计入陪同编制。",
      actionItem: "更新合同报价。",
      linkedClarificationId: "C1",
    },
    {
      topic: "接待预算确认",
      decision: "整体接待预算初步确认约80-120万人民币，具体分项待合同签订后明细。",
      actionItem: "会后整理预算分项表。",
      linkedClarificationId: "C6",
    },
    {
      topic: "行程路线确认",
      decision: "北京（2天）→ 深圳（2天）→ 上海（1天）行程路线已确认。",
      linkedClarificationId: "C3",
    },
    {
      topic: "媒体随行",
      decision: "媒体随行需各参观方单独审批，预计2-3家婉拒拍摄，需提前告知客户。",
      actionItem: "逐一向各参观企业发送媒体随行申请。",
      linkedClarificationId: "C4",
    },
  ];
}

export function mockPhaseB_UpdatedClarifications(
  original: ClarificationItem[]
): ClarificationItem[] {
  return original.map((item) => {
    const resolutions: Record<string, { resolved: boolean; answer: string }> = {
      C1: {
        resolved: true,
        answer: "陪同总人数为3人：2名高级陪同 + 1名翻译（计入编制）。",
      },
      C2: {
        resolved: true,
        answer: "字节跳动不接受，改为智谱AI（首选）/ MiniMax（备选），王总负责对接。",
      },
      C3: {
        resolved: true,
        answer: "优先级：AI大模型 > 具身机器人 > 政务数字化（若时间冲突可舍去第3项）。",
      },
      C4: {
        resolved: true,
        answer: "媒体随行需各企业单独审批，预计2-3家婉拒，已告知客户。",
      },
      C6: {
        resolved: true,
        answer: "整体预算80-120万人民币，分项明细待合同签订。",
      },
    };
    const resolution = resolutions[item.id];
    if (resolution) {
      return { ...item, resolved: true, answer: resolution.answer };
    }
    return item;
  });
}

// ─────────────────────────────────────────────
// Phase C Mock 数据
// ─────────────────────────────────────────────

export function mockPhaseC_PreciseRequirements(): PreciseRequirement[] {
  return [
    {
      id: "P1",
      category: "参观企业",
      requirement: "AI大模型：由字节跳动改为智谱AI（GLM-4）",
      source: "meeting",
      confirmed: true,
    },
    {
      id: "P2",
      category: "参观企业",
      requirement: "大模型备选：MiniMax（Hailuo AI）",
      source: "meeting",
      confirmed: true,
    },
    {
      id: "P3",
      category: "参观企业",
      requirement: "机器人：UBTECH 深圳总部半天参观",
      source: "meeting",
      confirmed: true,
    },
    {
      id: "P4",
      category: "行程",
      requirement: "北京（2天）→ 深圳（2天）→ 上海（1天）",
      source: "meeting",
      confirmed: true,
    },
    {
      id: "P5",
      category: "人员",
      requirement: "陪同3人：2名高级陪同 + 1名翻译",
      source: "meeting",
      confirmed: true,
    },
    {
      id: "P6",
      category: "预算",
      requirement: "整体接待预算 80-120万人民币（初步确认）",
      source: "meeting",
      confirmed: true,
    },
  ];
}

export function mockPhaseC_VagueRequirements(): VagueRequirement[] {
  return [
    {
      id: "V1",
      originalText: "政务数字化参观（无具体公司）",
      aiInterpretation:
        "客户核心诉求是了解中国AI在政务场景的落地经验，可能对接的标的应具备：有明确的政务数字化案例、愿意接受国际代表团访问。",
      modelSuggestions: [
        {
          modelName: "Kimi",
          modelIcon: "🌙",
          suggestions: [
            "阿里云（政务云 + 钉钉政务版）",
            "腾讯政务云（粤省事等案例）",
            "华为政务数字化（鲲鹏生态）",
            "商汤科技（城市 AI 大脑）",
            "旷视科技（城市安防数字化）",
          ],
        },
        {
          modelName: "GPT-4o-mini",
          modelIcon: "🤖",
          suggestions: [
            "腾讯政务云（微信政务服务案例）",
            "阿里云（政务AI云平台）",
            "科大讯飞（语音AI在政务的应用）",
            "华为政务数字化",
            "浪潮信息（政务大数据平台）",
          ],
        },
        {
          modelName: "Gemini Pro",
          modelIcon: "✨",
          suggestions: [
            "阿里云（政务云最大规模落地）",
            "腾讯政务云",
            "华为政务数字化",
            "商汤科技（城市 AI）",
            "平安科技（金融+政务AI案例）",
          ],
        },
      ],
      consensusSuggestions: ["阿里云（政务云）", "腾讯政务云", "华为政务数字化"],
      humanDecision: "pending",
    },
    {
      id: "V2",
      originalText: "「希望有一定仪式感，可能有媒体随行」",
      aiInterpretation:
        "仪式感需求意味着需要正式的欢迎仪式、礼宾安排和媒体友好的拍摄场景。媒体随行需要提前协调各参观方，部分企业可能拒绝。",
      modelSuggestions: [
        {
          modelName: "Kimi",
          modelIcon: "🌙",
          suggestions: [
            "开幕欢迎晚宴（含致辞环节）",
            "参观前正式引导仪式",
            "合影留念安排（有企业 Logo 背景板）",
          ],
        },
        {
          modelName: "GPT-4o-mini",
          modelIcon: "🤖",
          suggestions: [
            "开幕晚宴 + 双方代表致辞",
            "企业参观时设置正式接待仪式",
            "合影安排 + 伴手礼准备",
          ],
        },
        {
          modelName: "Gemini Pro",
          modelIcon: "✨",
          suggestions: [
            "正式欢迎晚宴（北京，抵达当晚）",
            "合影 + 企业宣传资料赠送",
            "媒体随行协调（逐一获得企业书面授权）",
          ],
        },
      ],
      consensusSuggestions: ["开幕欢迎晚宴（含致辞）", "正式合影安排"],
      humanDecision: "pending",
    },
  ];
}

export function mockPhaseC_DiffFields(): DiffField[] {
  return [
    {
      field: "参观企业 — AI大模型",
      before: "字节跳动 AI Lab（首选）",
      after: "智谱AI GLM-4（首选）/ MiniMax（备选）",
      changed: true,
      changeType: "modified",
    },
    {
      field: "所需陪同人数",
      before: "2名高级陪同（翻译外聘）",
      after: "3人：2名高级陪同 + 1名翻译（计入编制）",
      changed: true,
      changeType: "modified",
    },
    {
      field: "行程路线",
      before: "TBD（待碰头会确认）",
      after: "北京（2天）→ 深圳（2天）→ 上海（1天）",
      changed: true,
      changeType: "modified",
    },
    {
      field: "接待预算",
      before: "TBD（高规格，未明确金额）",
      after: "80-120万人民币（初步确认，分项待合同）",
      changed: true,
      changeType: "modified",
    },
    {
      field: "机器人参观",
      before: "UBTECH（有展厅，待确认）",
      after: "UBTECH 深圳总部，半天参观，已确认；宇树科技备选",
      changed: true,
      changeType: "modified",
    },
    {
      field: "媒体随行",
      before: "媒体随行（待审批）",
      after: "各参观企业需单独审批，预计2-3家婉拒，已告知客户",
      changed: true,
      changeType: "modified",
    },
    {
      field: "客户名称",
      before: "沙特阿拉伯数字化转型局（SDAIA）代表团",
      after: "沙特阿拉伯数字化转型局（SDAIA）代表团",
      changed: false,
    },
    {
      field: "访问时间",
      before: "2025年10月中旬，共5天",
      after: "2025年10月中旬，共5天",
      changed: false,
    },
    {
      field: "总人数",
      before: "12人，含3名副部长级官员",
      after: "12人，含3名副部长级官员",
      changed: false,
    },
  ];
}

export function mockPhaseC_FinalBrief(): string {
  return `# 合作方 Brief（定稿）

## 客户概况
**代表团：** 沙特阿拉伯数字化转型局（SDAIA）代表团
**规模：** 12人，含3名副部长级官员
**访问时间：** 2025年10月中旬，共5天
**接待规格：** VIP 高规格，陪同3人（含翻译）
**预算：** 80-120万人民币（初步确认）

---

## 精确参观需求

| 行业 | 参观企业 | 状态 |
|------|----------|------|
| AI大模型 | 智谱AI（GLM-4）| ✅ 已确认对接渠道 |
| AI大模型（备选） | MiniMax（Hailuo AI）| ✅ 备选可用 |
| 具身机器人 | UBTECH 深圳总部 | ✅ 半天展厅参观 |
| 具身机器人（备选）| 宇树科技 | ✅ 报价灵活 |
| 政务数字化 | 阿里云 / 腾讯政务云 | 🔄 人工复核后加入 |

---

## 行程框架
**北京（2天）→ 深圳（2天）→ 上海（1天）**

- 北京：智谱AI参观 + 百度飞桨交流 + 欢迎晚宴
- 深圳：UBTECH 机器人展厅 + 华为/腾讯政务云
- 上海：总结座谈 + 离沪

---

## 注意事项
- 全程英阿双语翻译（含阿拉伯语正式材料）
- 媒体随行需各企业书面授权，预计2-3家婉拒
- 字节跳动不接受政府代表团，已改为智谱AI

---

## 待跟进事项（TBD）
- [ ] 百度参观正式确认函（需提前6周）
- [ ] 预算分项明细（合同签订后）
- [ ] 政务数字化参观企业最终确认
- [ ] 媒体随行各企业授权书收集

---

*本 Brief 为定稿版本（Phase C 输出）。生成时间：${new Date().toLocaleString("zh-CN")}*`;
}
