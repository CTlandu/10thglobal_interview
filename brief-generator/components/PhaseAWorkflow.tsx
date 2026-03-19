"use client";

import { StepCard } from "./StepCard";
import { ClarificationChecklist } from "./ClarificationChecklist";
import { cn } from "@/lib/utils";
import type {
  PipelineStep,
  StructuredBriefData,
  AIModelOutput,
  ModelDifference,
  ClarificationItem,
} from "@/lib/types";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

interface PhaseAWorkflowProps {
  steps: PipelineStep[];
  structuredData: StructuredBriefData | null;
  modelAOutput: AIModelOutput | null;
  modelBOutput: AIModelOutput | null;
  differences: ModelDifference[];
  clarificationList: ClarificationItem[];
  onClarificationToggle: (id: string, resolved: boolean) => void;
  onClarificationAnswer: (id: string, answer: string) => void;
}

export function PhaseAWorkflow({
  steps,
  structuredData,
  modelAOutput,
  modelBOutput,
  differences,
  clarificationList,
  onClarificationToggle,
  onClarificationAnswer,
}: PhaseAWorkflowProps) {
  return (
    <div className="space-y-3">
      {/* Step 1: 结构化解析 */}
      <StepCard step={steps[0]} defaultOpen>
        {structuredData && (
          <div className="space-y-2 text-xs">
            <Row label="客户" value={structuredData.client} />
            <Row label="日期" value={structuredData.date} />
            <Row
              label="人数"
              value={`总计 ${structuredData.headcount.total} 人（官员 ${structuredData.headcount.officials} 人，陪同 ${structuredData.headcount.companions} 人）`}
            />
            <div>
              <span className="font-medium text-gray-600">参观行业意向：</span>
              <div className="mt-1 space-y-1">
                {structuredData.industryInterests.map((i) => (
                  <div key={i.rank} className="flex items-start gap-2 pl-2">
                    <span className="text-blue-500 font-bold shrink-0">#{i.rank}</span>
                    <div>
                      <span className="font-medium text-gray-700">{i.industry}</span>
                      <span className="text-gray-400 ml-1">→ {i.suggestedCompany}</span>
                      <p className="text-gray-400 text-[10px]">{i.basis}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Row label="特殊要求" value={structuredData.specialRequirements.join("；")} />
            <Row label="其他信息" value={structuredData.otherInfo.join("；")} />
          </div>
        )}
      </StepCard>

      {/* Step 2: AI 模型 A */}
      <StepCard step={steps[1]} defaultOpen>
        {modelAOutput && <ModelOutputView output={modelAOutput} />}
      </StepCard>

      {/* Step 3: AI 模型 B */}
      <StepCard step={steps[2]} defaultOpen>
        {modelBOutput && <ModelOutputView output={modelBOutput} />}
      </StepCard>

      {/* Step 4: 差异比对 */}
      <StepCard step={steps[3]} defaultOpen>
        {differences.length > 0 && (
          <div className="space-y-2 text-xs">
            {differences.map((diff, i) => (
              <div
                key={i}
                className={cn(
                  "rounded-lg border p-2",
                  diff.riskLevel === "high" && "border-red-200 bg-red-50",
                  diff.riskLevel === "medium" && "border-amber-200 bg-amber-50",
                  diff.riskLevel === "low" && "border-gray-200 bg-gray-50"
                )}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <AlertTriangle
                    className={cn(
                      "w-3 h-3",
                      diff.riskLevel === "high" && "text-red-500",
                      diff.riskLevel === "medium" && "text-amber-500",
                      diff.riskLevel === "low" && "text-gray-400"
                    )}
                  />
                  <span className="font-semibold text-gray-700">{diff.field}</span>
                  <span
                    className={cn(
                      "text-[9px] px-1 rounded-full font-bold",
                      diff.riskLevel === "high" && "bg-red-100 text-red-600",
                      diff.riskLevel === "medium" && "bg-amber-100 text-amber-600",
                      diff.riskLevel === "low" && "bg-gray-100 text-gray-500"
                    )}
                  >
                    {diff.riskLevel === "high" ? "高风险" : diff.riskLevel === "medium" ? "中风险" : "低"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-1">
                  <div className="bg-white rounded p-1.5 border border-red-100">
                    <div className="text-[9px] text-red-500 font-medium mb-0.5">模型 A</div>
                    <div className="text-gray-700">{diff.modelAValue}</div>
                  </div>
                  <div className="bg-white rounded p-1.5 border border-blue-100">
                    <div className="text-[9px] text-blue-500 font-medium mb-0.5">模型 B</div>
                    <div className="text-gray-700">{diff.modelBValue}</div>
                  </div>
                </div>
                <p className="text-[10px] text-gray-500 italic">{diff.suggestion}</p>
              </div>
            ))}
          </div>
        )}
      </StepCard>

      {/* Step 5: 澄清清单 */}
      <StepCard step={steps[4]} defaultOpen>
        {clarificationList.length > 0 && (
          <ClarificationChecklist
            items={clarificationList}
            onToggle={onClarificationToggle}
            onAnswerChange={onClarificationAnswer}
          />
        )}
      </StepCard>

      {/* Done banner */}
      {steps.every((s) => s.status === "done") && (
        <div className="flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 px-3 py-2">
          <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
          <p className="text-xs text-green-700">
            Phase A 完成！初稿已结构化，双模型质检通过，请前往 Phase B 进行碰头会整合。
          </p>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="font-medium text-gray-600">{label}：</span>
      <span className="text-gray-800">{value}</span>
    </div>
  );
}

function ModelOutputView({ output }: { output: AIModelOutput }) {
  return (
    <div className="space-y-2 text-xs">
      <div className="flex items-center gap-2 pb-1 border-b border-gray-100">
        <span className="text-base">{output.modelIcon}</span>
        <span className="font-semibold text-gray-700">{output.modelName}</span>
        <span className="text-gray-400">{output.notes}</span>
      </div>
      <div>
        <div className="font-medium text-gray-600 mb-1">
          标注需澄清事项（{output.clarificationItems.length}条）：
        </div>
        <div className="space-y-1">
          {output.clarificationItems.map((item) => (
            <div
              key={item.id}
              className={cn(
                "rounded px-2 py-1.5 border text-[11px]",
                item.priority === "high" && "bg-red-50 border-red-200 text-red-700",
                item.priority === "medium" && "bg-amber-50 border-amber-200 text-amber-700",
                item.priority === "low" && "bg-gray-50 border-gray-200 text-gray-600"
              )}
            >
              <span className="font-semibold">[{item.field}]</span>{" "}
              {item.question}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
