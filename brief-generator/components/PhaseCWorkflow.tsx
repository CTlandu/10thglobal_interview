"use client";

import { StepCard } from "./StepCard";
import { DiffViewer } from "./DiffViewer";
import { BriefRenderer } from "./BriefRenderer";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  XCircle,
  Download,
  FileText,
  FileSpreadsheet,
  File,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { Button } from "./ui/button";
import type {
  PipelineStep,
  PreciseRequirement,
  VagueRequirement,
  DiffField,
} from "@/lib/types";

interface PhaseCWorkflowProps {
  steps: PipelineStep[];
  preciseRequirements: PreciseRequirement[];
  vagueRequirements: VagueRequirement[];
  diffFields: DiffField[];
  finalBrief: string;
  onVagueDecision: (id: string, decision: "include" | "exclude") => void;
}

export function PhaseCWorkflow({
  steps,
  preciseRequirements,
  vagueRequirements,
  diffFields,
  finalBrief,
  onVagueDecision,
}: PhaseCWorkflowProps) {
  const handleExport = (format: string) => {
    if (format === "txt" && finalBrief) {
      const blob = new Blob([finalBrief], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `合作方Brief_${new Date().toLocaleDateString("zh-CN").replace(/\//g, "")}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-3">
      {/* Step 1: 精确需求提取 */}
      <StepCard step={steps[0]} defaultOpen>
        {preciseRequirements.length > 0 && (
          <div className="space-y-1.5">
            {preciseRequirements.map((req) => (
              <div
                key={req.id}
                className={cn(
                  "flex items-start gap-2 rounded-lg border p-2 text-xs",
                  req.source === "meeting"
                    ? "border-green-200 bg-green-50"
                    : "border-blue-100 bg-blue-50"
                )}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <span
                    className={cn(
                      "text-[9px] font-bold px-1 rounded mr-1",
                      req.source === "meeting"
                        ? "bg-green-100 text-green-600"
                        : "bg-blue-100 text-blue-600"
                    )}
                  >
                    {req.category}
                  </span>
                  <span className="text-gray-800">{req.requirement}</span>
                  <span className="ml-1 text-[9px] text-gray-400">
                    （来源：{req.source === "meeting" ? "碰头会" : "初稿"}）
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </StepCard>

      {/* Step 2: 模糊需求识别 */}
      <StepCard step={steps[1]} defaultOpen>
        {vagueRequirements.length > 0 && (
          <div className="space-y-2">
            {vagueRequirements.map((vague) => (
              <div key={vague.id} className="rounded-lg border border-amber-200 bg-amber-50 p-2.5">
                <div className="text-[10px] font-bold text-amber-600 mb-1">原始表述</div>
                <div className="text-xs text-gray-800 font-medium mb-1">"{vague.originalText}"</div>
                <div className="text-[10px] text-gray-500">
                  AI解读：{vague.aiInterpretation}
                </div>
              </div>
            ))}
          </div>
        )}
      </StepCard>

      {/* Step 3: 多模型候选方案 */}
      <StepCard step={steps[2]} defaultOpen>
        {vagueRequirements.length > 0 && vagueRequirements[0].modelSuggestions.length > 0 && (
          <div className="space-y-4">
            {vagueRequirements.map((vague) => (
              <div key={vague.id}>
                <div className="text-xs font-semibold text-gray-700 mb-2">
                  针对："{vague.originalText}"
                </div>
                <div className="grid gap-2">
                  {vague.modelSuggestions.map((ms) => (
                    <div key={ms.modelName} className="rounded-lg border border-gray-200 bg-white p-2">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className="text-sm">{ms.modelIcon}</span>
                        <span className="text-xs font-semibold text-gray-600">{ms.modelName}</span>
                      </div>
                      <div className="space-y-1">
                        {ms.suggestions.map((s, i) => (
                          <div key={i} className="flex items-start gap-1.5 text-xs text-gray-600">
                            <span className="text-gray-300 shrink-0">{i + 1}.</span>
                            <span>{s}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </StepCard>

      {/* Step 4: 共识筛选 */}
      <StepCard step={steps[3]} defaultOpen>
        {vagueRequirements.length > 0 && vagueRequirements[0].consensusSuggestions.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs text-gray-500">以下选项被 ≥2 个模型同时推荐，视为共识方案：</p>
            {vagueRequirements.map((vague) => (
              <div key={vague.id}>
                <div className="text-xs font-semibold text-gray-600 mb-1">
                  针对：{vague.originalText}
                </div>
                <div className="space-y-1">
                  {vague.consensusSuggestions.map((s, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-xs rounded-lg border border-teal-200 bg-teal-50 px-2 py-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                      <span className="text-teal-800 font-medium">{s}</span>
                      <span className="ml-auto text-[10px] text-teal-500">多模型共识 ✓</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </StepCard>

      {/* Step 5: 人工复核 */}
      <StepCard step={steps[4]} defaultOpen>
        {vagueRequirements.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs text-gray-500">
              请对每条共识推荐进行「采纳 / 放弃」判断：
            </p>
            {vagueRequirements.map((vague) =>
              vague.consensusSuggestions.map((s, i) => (
                <div
                  key={`${vague.id}-${i}`}
                  className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-2"
                >
                  <div className="flex-1 text-xs text-gray-700">{s}</div>
                  <div className="flex gap-1.5 shrink-0">
                    <button
                      className={cn(
                        "flex items-center gap-1 text-[11px] px-2 py-1 rounded-md border transition-colors",
                        vague.humanDecision === "include"
                          ? "bg-green-500 text-white border-green-500"
                          : "text-green-600 border-green-200 hover:bg-green-50"
                      )}
                      onClick={() => onVagueDecision(vague.id, "include")}
                    >
                      <ThumbsUp className="w-3 h-3" />
                      采纳
                    </button>
                    <button
                      className={cn(
                        "flex items-center gap-1 text-[11px] px-2 py-1 rounded-md border transition-colors",
                        vague.humanDecision === "exclude"
                          ? "bg-red-500 text-white border-red-500"
                          : "text-red-500 border-red-200 hover:bg-red-50"
                      )}
                      onClick={() => onVagueDecision(vague.id, "exclude")}
                    >
                      <ThumbsDown className="w-3 h-3" />
                      放弃
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </StepCard>

      {/* Step 6: 初稿 vs 定稿对比 */}
      <StepCard step={steps[5]} defaultOpen>
        {diffFields.length > 0 && <DiffViewer fields={diffFields} />}
        {finalBrief && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="text-xs font-semibold text-gray-600 mb-2">定稿预览</div>
            <BriefRenderer content={finalBrief} />
          </div>
        )}
      </StepCard>

      {/* Export panel (appears after step 6 done) */}
      {steps[5]?.status === "done" && finalBrief && (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-3">
          <div className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" />
            导出定稿 Brief
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs gap-1.5"
              onClick={() => handleExport("txt")}
            >
              <FileText className="w-3.5 h-3.5" />
              .TXT
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs gap-1.5 opacity-50 cursor-not-allowed"
              disabled
              title="需接入真实 API 后启用"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              .CSV / Excel
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs gap-1.5 opacity-50 cursor-not-allowed"
              disabled
              title="需接入真实 API 后启用"
            >
              <File className="w-3.5 h-3.5" />
              .WORD / PDF
            </Button>
          </div>
          <p className="text-[10px] text-gray-400 mt-1.5">
            CSV/Excel/Word/PDF 导出需接入真实 AI API 后启用
          </p>
        </div>
      )}

      {/* Done banner */}
      {steps.every((s) => s.status === "done") && (
        <div className="flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 px-3 py-2">
          <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
          <p className="text-xs text-green-700 font-medium">
            全流程完成！合作方 Brief 已生成定稿，可导出对外发送。
          </p>
        </div>
      )}
    </div>
  );
}
