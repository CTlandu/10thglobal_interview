// ─────────────────────────────────────────────
// 通用：流水线步骤
// ─────────────────────────────────────────────
export interface PipelineStep {
  id: number;
  label: string;
  /** 一句话描述这步做什么 */
  description: string;
  /** 业务理由：为什么需要这个步骤？（展示给面试官的思维链） */
  rationale: string;
  status: "pending" | "running" | "done" | "error";
  /** 步骤完成后的原始输出（JSON字符串或Markdown） */
  output?: string;
}

export type Phase = "A" | "B" | "C";

// ─────────────────────────────────────────────
// Phase A：活动方案确立
// ─────────────────────────────────────────────

/** 结构化初稿数据（标准字段） */
export interface StructuredBriefData {
  client: string;
  date: string;
  headcount: {
    total: number;
    officials: number;
    companions: number;
  };
  industryInterests: Array<{
    rank: number;
    industry: string;
    suggestedCompany: string;
    basis: string;
  }>;
  specialRequirements: string[];
  otherInfo: string[];
}

/** 单条澄清清单项 */
export interface ClarificationItem {
  id: string;
  field: string;
  question: string;
  priority: "high" | "medium" | "low";
  resolved: boolean;
  answer?: string;
}

/** 单个 AI 模型的质检输出 */
export interface AIModelOutput {
  modelName: string;
  modelIcon: string;
  structuredData: StructuredBriefData;
  clarificationItems: ClarificationItem[];
  notes: string;
}

/** 两模型间的字段差异 */
export interface ModelDifference {
  field: string;
  modelAValue: string;
  modelBValue: string;
  riskLevel: "high" | "medium" | "low";
  suggestion: string;
}

/** Phase A 完整状态 */
export interface PhaseAState {
  rawDraft: string;
  steps: PipelineStep[];
  structuredData: StructuredBriefData | null;
  modelAOutput: AIModelOutput | null;
  modelBOutput: AIModelOutput | null;
  differences: ModelDifference[];
  clarificationList: ClarificationItem[];
  status: "idle" | "running" | "done" | "error";
}

// ─────────────────────────────────────────────
// Phase B：与合作方线上讨论初稿方案
// ─────────────────────────────────────────────

/** AI 从会议纪要中提取的单条决策 */
export interface MeetingDecision {
  topic: string;
  decision: string;
  actionItem?: string;
  /** 关联 Phase A 的澄清清单项 ID（若有） */
  linkedClarificationId?: string;
}

/** Phase B 完整状态 */
export interface PhaseBState {
  meetingNotes: string;
  steps: PipelineStep[];
  decisions: MeetingDecision[];
  updatedClarifications: ClarificationItem[];
  status: "idle" | "running" | "done" | "error";
}

// ─────────────────────────────────────────────
// Phase C：根据会议纪要补充初稿信息
// ─────────────────────────────────────────────

/** 精确需求 */
export interface PreciseRequirement {
  id: string;
  category: string;
  requirement: string;
  source: "initial" | "meeting";
  confirmed: boolean;
}

/** 模糊需求及多模型处理结果 */
export interface VagueRequirement {
  id: string;
  originalText: string;
  aiInterpretation: string;
  modelSuggestions: Array<{
    modelName: string;
    modelIcon: string;
    suggestions: string[];
  }>;
  /** 多模型共识（交集）推荐 */
  consensusSuggestions: string[];
  /** 人工复核决定 */
  humanDecision?: "include" | "exclude" | "pending";
  finalRequirement?: string;
}

/** 初稿 vs 定稿字段对比 */
export interface DiffField {
  field: string;
  before: string;
  after: string;
  changed: boolean;
  changeType?: "added" | "modified" | "removed";
}

/** Phase C 完整状态 */
export interface PhaseCState {
  steps: PipelineStep[];
  preciseRequirements: PreciseRequirement[];
  vagueRequirements: VagueRequirement[];
  diffFields: DiffField[];
  finalBrief: string;
  status: "idle" | "running" | "done" | "error";
}

// ─────────────────────────────────────────────
// API 通信：SSE 数据块类型
// ─────────────────────────────────────────────
export interface SSEChunk {
  phase: Phase;
  step: number;
  type: "progress" | "content" | "done" | "error" | "complete";
  content?: string;
  /** content 为 JSON 时的 key 标识 */
  dataKey?:
    | "structuredData"
    | "modelAOutput"
    | "modelBOutput"
    | "differences"
    | "clarificationList"
    | "decisions"
    | "updatedClarifications"
    | "preciseRequirements"
    | "vagueRequirements"
    | "diffFields"
    | "finalBrief";
}

// ─────────────────────────────────────────────
// Demo 案例
// ─────────────────────────────────────────────
export interface DemoCase {
  id: string;
  label: string;
  description: string;
  rawDraft: string;
  meetingNotes: string;
}

// ─────────────────────────────────────────────
// Phase A 步骤定义（含思维链 rationale）
// ─────────────────────────────────────────────
export const PHASE_A_STEPS: PipelineStep[] = [
  {
    id: 1,
    label: "结构化解析",
    description: "将手动初稿转为标准字段 JSON",
    rationale:
      "自然语言初稿存在歧义，结构化后才能让 AI 进行精确的比对与质检，同时也便于后续导出 Excel/CSV 等格式。",
    status: "pending",
  },
  {
    id: 2,
    label: "AI 模型 A 质检",
    description: "独立审核初稿，标注澄清点",
    rationale:
      "引入第一个大模型独立审核，捕捉人工盲区（如：人数前后不一致、参观行业优先级模糊）。独立运行，避免被人工判断干扰。",
    status: "pending",
  },
  {
    id: 3,
    label: "AI 模型 B 交叉验证",
    description: "第二模型独立执行同一任务",
    rationale:
      "不同模型有不同训练偏好，交叉验证可发现单一模型的盲区。两模型的分歧点往往是信息最不清晰的地方，需重点关注。",
    status: "pending",
  },
  {
    id: 4,
    label: "差异比对",
    description: "对比两模型输出，高亮分歧",
    rationale:
      "两个 AI 都不确定的字段，大概率是原始信息本身有歧义或缺失。差异比对将这些风险点可视化，供人工聚焦复核。",
    status: "pending",
  },
  {
    id: 5,
    label: "澄清清单生成",
    description: "整理带 Checkbox 的待确认问题列表",
    rationale:
      "将 AI 识别的需澄清事项整理为可操作清单，碰头会中逐项确认，替代依赖记忆的临时提问，避免 miscommunication。",
    status: "pending",
  },
];

// ─────────────────────────────────────────────
// Phase B 步骤定义
// ─────────────────────────────────────────────
export const PHASE_B_STEPS: PipelineStep[] = [
  {
    id: 1,
    label: "会议纪要导入",
    description: "将碰头会记录导入系统",
    rationale:
      "会议中的口头确认分散在各处，需要先将纪要作为结构化处理的输入源，明确区分「已确认」vs「仍待定」的信息。",
    status: "pending",
  },
  {
    id: 2,
    label: "关键决策提取",
    description: "AI 自动提取会议中的关键结论",
    rationale:
      "人工阅读会议纪要并整理决策点通常需要 15-30 分钟。AI 提取将这一工作压缩到 1 分钟，并以结构化格式输出，减少遗漏。",
    status: "pending",
  },
  {
    id: 3,
    label: "澄清清单核对",
    description: "自动标记 Phase A 清单中已解答的问题",
    rationale:
      "将 Phase A 生成的澄清清单与会议结论对比，自动标记已解答项，让负责人一眼看出还有哪些问题未被会议覆盖。",
    status: "pending",
  },
];

// ─────────────────────────────────────────────
// Phase C 步骤定义
// ─────────────────────────────────────────────
export const PHASE_C_STEPS: PipelineStep[] = [
  {
    id: 1,
    label: "精确需求提取",
    description: "从会议纪要中提取明确确认的需求",
    rationale:
      "精确需求是客户明确表达、无歧义的需求（如：「字节跳动改为智谱AI」）。先把这类需求落地，建立定稿基础。",
    status: "pending",
  },
  {
    id: 2,
    label: "模糊需求识别",
    description: "识别表述模糊但有实际意图的需求",
    rationale:
      "模糊需求（如：「希望看些高科技的东西」）隐含真实诉求，不能忽略，需要 AI 帮助挖掘深层含义并推荐具体方案。",
    status: "pending",
  },
  {
    id: 3,
    label: "多模型候选方案",
    description: "2-3 个模型并行为模糊需求推荐具体选项",
    rationale:
      "单一模型推荐存在偏见风险。多模型并行推荐，为共识筛选提供多角度候选集，提高最终推荐的可靠性。",
    status: "pending",
  },
  {
    id: 4,
    label: "共识筛选",
    description: "仅保留多个模型都认可的方案",
    rationale:
      "通过「多数同意」机制过滤 AI 幻觉：只有多个模型都推荐的选项才进入候选名单，大幅降低错误推荐的风险。",
    status: "pending",
  },
  {
    id: 5,
    label: "人工复核",
    description: "逐条审批 AI 推荐，最终决策权在人",
    rationale:
      "AI 推荐是辅助工具，不是最终决策。业务负责人需对每条推荐进行「采纳 / 放弃」判断，确保业务合理性。",
    status: "pending",
  },
  {
    id: 6,
    label: "初稿 vs 定稿对比",
    description: "可视化两版本的字段变化",
    rationale:
      "将初稿（Phase A）与定稿（Phase C）并排对比，让负责人一眼确认所有变更，避免遗漏或意外覆盖。",
    status: "pending",
  },
];
