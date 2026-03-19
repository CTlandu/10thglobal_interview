"use client";

import { useState, useCallback, useEffect } from "react";
import { InputPanel } from "@/components/InputPanel";
import { PhaseAWorkflow } from "@/components/PhaseAWorkflow";
import { PhaseBWorkflow } from "@/components/PhaseBWorkflow";
import { PhaseCWorkflow } from "@/components/PhaseCWorkflow";
import { PhaseDShowcase } from "@/components/PhaseDShowcase";
import { MetricsDashboard } from "@/components/MetricsDashboard";
import { cn } from "@/lib/utils";
import {
  PHASE_A_STEPS,
  PHASE_B_STEPS,
  PHASE_C_STEPS,
} from "@/lib/types";
import type {
  Phase,
  PipelineStep,
  PhaseAState,
  PhaseBState,
  PhaseCState,
  ClarificationItem,
  VagueRequirement,
} from "@/lib/types";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";

// ─────────────────────────────────────────────
// Initial state helpers
// ─────────────────────────────────────────────
const initPhaseA = (): PhaseAState => ({
  rawDraft: "",
  steps: PHASE_A_STEPS.map((s) => ({ ...s })),
  structuredData: null,
  modelAOutput: null,
  modelBOutput: null,
  differences: [],
  clarificationList: [],
  status: "idle",
});

const initPhaseB = (): PhaseBState => ({
  meetingNotes: "",
  steps: PHASE_B_STEPS.map((s) => ({ ...s })),
  decisions: [],
  updatedClarifications: [],
  status: "idle",
});

const initPhaseC = (): PhaseCState => ({
  steps: PHASE_C_STEPS.map((s) => ({ ...s })),
  preciseRequirements: [],
  vagueRequirements: [],
  diffFields: [],
  finalBrief: "",
  status: "idle",
});

// ─────────────────────────────────────────────
// Step update helper
// ─────────────────────────────────────────────
function updateStep(
  steps: PipelineStep[],
  stepId: number,
  status: PipelineStep["status"]
): PipelineStep[] {
  return steps.map((s) => (s.id === stepId ? { ...s, status } : s));
}

// ─────────────────────────────────────────────
// Phase tab config
// ─────────────────────────────────────────────
const PHASE_CONFIG = [
  {
    id: "A" as Phase,
    label: "活动方案确立",
    subtitle: "结构化初稿 + 双模型质检 + 澄清清单",
    color: {
      active: "border-blue-500 bg-blue-50 text-blue-700",
      done: "border-green-400 bg-green-50 text-green-700",
      idle: "border-gray-200 bg-white text-gray-500 hover:bg-gray-50",
    },
    badge: "bg-blue-100 text-blue-700",
    dot: "bg-blue-500",
  },
  {
    id: "B" as Phase,
    label: "线上碰头讨论",
    subtitle: "会议纪要导入 + 关键决策提取 + 澄清核对",
    color: {
      active: "border-purple-500 bg-purple-50 text-purple-700",
      done: "border-green-400 bg-green-50 text-green-700",
      idle: "border-gray-200 bg-white text-gray-500 hover:bg-gray-50",
    },
    badge: "bg-purple-100 text-purple-700",
    dot: "bg-purple-500",
  },
  {
    id: "C" as Phase,
    label: "信息补充 & 定稿",
    subtitle: "精确/模糊需求拆分 + 多模型共识 + Diff对比 + 导出",
    color: {
      active: "border-green-500 bg-green-50 text-green-700",
      done: "border-green-400 bg-green-50 text-green-700",
      idle: "border-gray-200 bg-white text-gray-500 hover:bg-gray-50",
    },
    badge: "bg-green-100 text-green-700",
    dot: "bg-green-500",
  },
  {
    id: "D" as Phase,
    label: "企业联络 & 行程落地",
    subtitle: "AI搜索 + 外联话术 + 行程筛选（延伸方向）",
    color: {
      active: "border-purple-500 bg-purple-50 text-purple-700",
      done: "border-purple-400 bg-purple-50 text-purple-700",
      idle: "border-dashed border-gray-200 bg-white text-gray-400 hover:bg-gray-50",
    },
    badge: "bg-purple-100 text-purple-700",
    dot: "bg-purple-400",
  },
];

export default function Home() {
  const [activePhase, setActivePhase] = useState<Phase | "D">("A");
  const [isRunning, setIsRunning] = useState(false);
  const [apiStatus, setApiStatus] = useState<{ mockMode: boolean; model: string; provider: string } | null>(null);

  const [phaseA, setPhaseA] = useState<PhaseAState>(initPhaseA);
  const [phaseB, setPhaseB] = useState<PhaseBState>(initPhaseB);
  const [phaseC, setPhaseC] = useState<PhaseCState>(initPhaseC);

  useEffect(() => {
    fetch("/api/status")
      .then((r) => r.json())
      .then(setApiStatus)
      .catch(() => {});
  }, []);

  const isMock = apiStatus?.mockMode ?? true;

  // ─────────────────────────────────────────
  // Phase A runner
  // ─────────────────────────────────────────
  const handleRunPhaseA = useCallback(async (rawDraft: string) => {
    setIsRunning(true);
    setPhaseA((prev) => ({
      ...initPhaseA(),
      rawDraft,
      status: "running",
    }));

    try {
      const response = await fetch("/api/phase-a", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawDraft }),
      });

      if (!response.body) throw new Error("No response body");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        for (const line of chunk.split("\n")) {
          if (!line.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(line.slice(6));

            if (data.type === "progress") {
              setPhaseA((prev) => ({
                ...prev,
                steps: updateStep(prev.steps, data.step, "running"),
              }));
            } else if (data.type === "done") {
              setPhaseA((prev) => ({
                ...prev,
                steps: updateStep(prev.steps, data.step, "done"),
              }));
            } else if (data.type === "content") {
              const parsed = JSON.parse(data.content);
              setPhaseA((prev) => {
                const next = { ...prev };
                if (data.dataKey === "structuredData") next.structuredData = parsed;
                if (data.dataKey === "modelAOutput") next.modelAOutput = parsed;
                if (data.dataKey === "modelBOutput") next.modelBOutput = parsed;
                if (data.dataKey === "differences") next.differences = parsed;
                if (data.dataKey === "clarificationList") next.clarificationList = parsed;
                return next;
              });
            } else if (data.type === "complete") {
              setPhaseA((prev) => ({ ...prev, status: "done" }));
            } else if (data.type === "error") {
              setPhaseA((prev) => ({
                ...prev,
                status: "error",
                steps: updateStep(prev.steps, data.step || 1, "error"),
              }));
            }
          } catch {
            // ignore parse errors
          }
        }
      }
    } catch (err) {
      console.error(err);
      setPhaseA((prev) => ({ ...prev, status: "error" }));
    } finally {
      setIsRunning(false);
    }
  }, []);

  // ─────────────────────────────────────────
  // Phase B runner
  // ─────────────────────────────────────────
  const handleRunPhaseB = useCallback(
    async (meetingNotes: string) => {
      setIsRunning(true);
      setPhaseB(() => ({
        ...initPhaseB(),
        meetingNotes,
        status: "running",
      }));

      try {
        const response = await fetch("/api/phase-b", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            meetingNotes,
            clarificationList: phaseA.clarificationList,
          }),
        });

        if (!response.body) throw new Error("No response body");
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          for (const line of chunk.split("\n")) {
            if (!line.startsWith("data: ")) continue;
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === "progress") {
                setPhaseB((prev) => ({
                  ...prev,
                  steps: updateStep(prev.steps, data.step, "running"),
                }));
              } else if (data.type === "done") {
                setPhaseB((prev) => ({
                  ...prev,
                  steps: updateStep(prev.steps, data.step, "done"),
                }));
              } else if (data.type === "content") {
                const parsed = JSON.parse(data.content);
                setPhaseB((prev) => {
                  const next = { ...prev };
                  if (data.dataKey === "decisions") next.decisions = parsed;
                  if (data.dataKey === "updatedClarifications")
                    next.updatedClarifications = parsed;
                  return next;
                });
              } else if (data.type === "complete") {
                setPhaseB((prev) => ({ ...prev, status: "done" }));
              } else if (data.type === "error") {
                setPhaseB((prev) => ({
                  ...prev,
                  status: "error",
                  steps: updateStep(prev.steps, data.step || 1, "error"),
                }));
              }
            } catch {}
          }
        }
      } catch (err) {
        console.error(err);
        setPhaseB((prev) => ({ ...prev, status: "error" }));
      } finally {
        setIsRunning(false);
      }
    },
    [phaseA.clarificationList]
  );

  // ─────────────────────────────────────────
  // Phase C runner
  // ─────────────────────────────────────────
  const handleRunPhaseC = useCallback(async () => {
    setIsRunning(true);
    setPhaseC(() => ({ ...initPhaseC(), status: "running" }));

    try {
      const response = await fetch("/api/phase-c", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          structuredData: phaseA.structuredData,
          meetingNotes: phaseB.meetingNotes,
          decisions: phaseB.decisions,
        }),
      });

      if (!response.body) throw new Error("No response body");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        for (const line of chunk.split("\n")) {
          if (!line.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.type === "progress") {
              setPhaseC((prev) => ({
                ...prev,
                steps: updateStep(prev.steps, data.step, "running"),
              }));
            } else if (data.type === "done") {
              setPhaseC((prev) => ({
                ...prev,
                steps: updateStep(prev.steps, data.step, "done"),
              }));
            } else if (data.type === "content") {
              setPhaseC((prev) => {
                const next = { ...prev };
                if (data.dataKey === "preciseRequirements")
                  next.preciseRequirements = JSON.parse(data.content);
                if (data.dataKey === "vagueRequirements")
                  next.vagueRequirements = JSON.parse(data.content);
                if (data.dataKey === "diffFields")
                  next.diffFields = JSON.parse(data.content);
                if (data.dataKey === "finalBrief")
                  next.finalBrief = data.content;
                return next;
              });
            } else if (data.type === "complete") {
              setPhaseC((prev) => ({ ...prev, status: "done" }));
            } else if (data.type === "error") {
              setPhaseC((prev) => ({
                ...prev,
                status: "error",
                steps: updateStep(prev.steps, data.step || 1, "error"),
              }));
            }
          } catch {}
        }
      }
    } catch (err) {
      console.error(err);
      setPhaseC((prev) => ({ ...prev, status: "error" }));
    } finally {
      setIsRunning(false);
    }
  }, [phaseA.structuredData, phaseB.meetingNotes, phaseB.decisions]);

  // ─────────────────────────────────────────
  // Clarification handlers
  // ─────────────────────────────────────────
  const handleClarificationToggle = useCallback((id: string, resolved: boolean) => {
    setPhaseA((prev) => ({
      ...prev,
      clarificationList: prev.clarificationList.map((item) =>
        item.id === id ? { ...item, resolved } : item
      ),
    }));
  }, []);

  const handleClarificationAnswer = useCallback((id: string, answer: string) => {
    setPhaseA((prev) => ({
      ...prev,
      clarificationList: prev.clarificationList.map((item) =>
        item.id === id ? { ...item, answer } : item
      ),
    }));
  }, []);

  const handleVagueDecision = useCallback(
    (id: string, decision: "include" | "exclude") => {
      setPhaseC((prev) => ({
        ...prev,
        vagueRequirements: prev.vagueRequirements.map((v) =>
          v.id === id ? { ...v, humanDecision: decision } : v
        ),
      }));
    },
    []
  );

  // ─────────────────────────────────────────
  // Derived state
  // ─────────────────────────────────────────
  const phaseADone = phaseA.status === "done";
  const phaseBDone = phaseB.status === "done";

  const phaseStatus = (phase: Phase | "D") => {
    if (phase === "A") return phaseA.status;
    if (phase === "B") return phaseB.status;
    if (phase === "C") return phaseC.status;
    return "idle" as const;
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* ── Header ───────────────────────────────── */}
      <header className="bg-white border-b px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">AI</span>
          </div>
          <div>
            <h1 className="text-sm font-bold text-gray-900">合作方 Brief 生成系统</h1>
            <p className="text-xs text-gray-400">跨境政企访学 · AI 工作流 · 三阶段质量控制</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isMock ? (
            <div className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-orange-50 text-orange-600 border border-orange-200">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
              演示模式（Mock）
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              {apiStatus?.provider} · {apiStatus?.model}
            </div>
          )}
        </div>
      </header>

      {/* ── Phase Navigation ─────────────────────── */}
      <div className="bg-white border-b px-6 py-2 shrink-0">
        <div className="flex items-center gap-3">
          {PHASE_CONFIG.map((cfg, index) => {
            const status = phaseStatus(cfg.id);
            const isActive = activePhase === cfg.id;
            const isDone = status === "done";
            const isRunningThis = status === "running";

            return (
              <button
                key={cfg.id}
                className={cn(
                  "flex items-start gap-2.5 px-3 py-2 rounded-lg border transition-all text-left",
                  isActive && !isDone && cfg.color.active,
                  isDone && cfg.color.done,
                  !isActive && !isDone && cfg.color.idle
                )}
                onClick={() => setActivePhase(cfg.id)}
              >
                {/* Phase indicator */}
                <div className="shrink-0 mt-0.5">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  ) : isRunningThis ? (
                    <Loader2 className="w-4 h-4 text-current animate-spin" />
                  ) : (
                    <div
                      className={cn(
                        "w-4 h-4 rounded-full border-2 flex items-center justify-center text-[9px] font-bold",
                        isActive
                          ? "border-current text-current"
                          : "border-gray-300 text-gray-300"
                      )}
                    >
                      {index + 1}
                    </div>
                  )}
                </div>

                <div>
                  <div className="text-xs font-semibold leading-tight">{cfg.label}</div>
                  <div
                    className={cn(
                      "text-[10px] leading-tight mt-0.5",
                      isActive || isDone ? "opacity-70" : "text-gray-400"
                    )}
                  >
                    {cfg.subtitle}
                  </div>
                </div>
              </button>
            );
          })}

          {/* Connector arrows */}
          <div className="flex-1" />
          <div className="text-xs text-gray-400 hidden md:block">
            完整工作流：A → B → C → D
          </div>
        </div>
      </div>

      {/* ── Main content ─────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Input panel */}
        <div className="w-[360px] shrink-0 bg-white border-r flex flex-col overflow-hidden">
          <InputPanel
            activePhase={activePhase}
            isRunning={isRunning}
            phaseADone={phaseADone}
            phaseBDone={phaseBDone}
            onRunPhaseA={handleRunPhaseA}
            onRunPhaseB={handleRunPhaseB}
            onRunPhaseC={handleRunPhaseC}
          />
        </div>

        {/* Right: Workflow visualization */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 max-w-3xl mx-auto">
            {/* Phase label */}
            <div className="flex items-center gap-2 mb-4">
              <div
                className={cn(
                  "text-xs font-bold px-2.5 py-1 rounded-full",
                  activePhase === "A" && "bg-blue-100 text-blue-700",
                  activePhase === "B" && "bg-purple-100 text-purple-700",
                  activePhase === "C" && "bg-green-100 text-green-700"
                )}
              >
                Phase {activePhase}
              </div>
              <h2 className="text-sm font-semibold text-gray-900">
                {PHASE_CONFIG.find((c) => c.id === activePhase)?.label}
              </h2>
              <span className="text-xs text-gray-400">
                — 每个步骤卡片可展开查看「思维链」和输出结果
              </span>
            </div>

            {/* Workflow steps */}
            {activePhase === "A" && (
              <PhaseAWorkflow
                steps={phaseA.steps}
                structuredData={phaseA.structuredData}
                modelAOutput={phaseA.modelAOutput}
                modelBOutput={phaseA.modelBOutput}
                differences={phaseA.differences}
                clarificationList={phaseA.clarificationList}
                onClarificationToggle={handleClarificationToggle}
                onClarificationAnswer={handleClarificationAnswer}
              />
            )}

            {activePhase === "B" && (
              <PhaseBWorkflow
                steps={phaseB.steps}
                meetingNotes={phaseB.meetingNotes}
                decisions={phaseB.decisions}
                updatedClarifications={
                  phaseB.updatedClarifications.length > 0
                    ? phaseB.updatedClarifications
                    : phaseA.clarificationList
                }
              />
            )}

            {activePhase === "C" && (
              <PhaseCWorkflow
                steps={phaseC.steps}
                preciseRequirements={phaseC.preciseRequirements}
                vagueRequirements={phaseC.vagueRequirements}
                diffFields={phaseC.diffFields}
                finalBrief={phaseC.finalBrief}
                onVagueDecision={handleVagueDecision}
              />
            )}

            {activePhase === "D" && <PhaseDShowcase />}

            {/* Empty state */}
            {activePhase === "A" && phaseA.status === "idle" && (
              <EmptyState
                phase="A"
                message="在左侧填写手动初稿，点击「运行 Phase A」启动 AI 工作流"
              />
            )}
            {activePhase === "B" && phaseB.status === "idle" && (
              <EmptyState
                phase="B"
                message={
                  phaseADone
                    ? "在左侧粘贴碰头会纪要，点击「运行 Phase B」"
                    : "请先完成 Phase A（活动方案确立）"
                }
              />
            )}
            {activePhase === "C" && phaseC.status === "idle" && (
              <EmptyState
                phase="C"
                message={
                  phaseBDone
                    ? "点击左侧「运行 Phase C」生成定稿"
                    : "请先完成 Phase A 和 Phase B"
                }
              />
            )}
            {/* Phase D has no empty state — PhaseDShowcase is always visible */}
          </div>
        </div>
      </div>

      {/* ── Bottom: Metrics ────────────────────── */}
      <div className="shrink-0 bg-white border-t">
        <MetricsDashboard />
      </div>
    </div>
  );
}

function EmptyState({ phase, message }: { phase: Phase; message: string }) {
  const colors = {
    A: "bg-blue-50 border-blue-100 text-blue-600",
    B: "bg-purple-50 border-purple-100 text-purple-600",
    C: "bg-green-50 border-green-100 text-green-600",
  };

  return (
    <div
      className={cn(
        "rounded-xl border-2 border-dashed p-8 flex flex-col items-center justify-center text-center",
        colors[phase]
      )}
    >
      <Circle className="w-8 h-8 mb-3 opacity-30" />
      <p className="text-sm font-medium opacity-70">{message}</p>
      <p className="text-xs mt-1 opacity-50">
        每个步骤会显示「思维链」说明，解释该步骤的业务逻辑
      </p>
    </div>
  );
}
