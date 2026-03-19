"use client";

import { StepCard } from "./StepCard";
import { ClarificationChecklist } from "./ClarificationChecklist";
import { CheckCircle2, MessageSquare, Link } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PipelineStep, MeetingDecision, ClarificationItem } from "@/lib/types";

interface PhaseBWorkflowProps {
  steps: PipelineStep[];
  meetingNotes: string;
  decisions: MeetingDecision[];
  updatedClarifications: ClarificationItem[];
}

export function PhaseBWorkflow({
  steps,
  meetingNotes,
  decisions,
  updatedClarifications,
}: PhaseBWorkflowProps) {
  return (
    <div className="space-y-3">
      {/* Step 1: 会议纪要导入 */}
      <StepCard step={steps[0]} defaultOpen>
        {meetingNotes && (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 mb-1">
              <MessageSquare className="w-3.5 h-3.5 text-purple-500" />
              <span className="text-xs font-medium text-gray-600">会议纪要原文</span>
            </div>
            <pre className="text-[11px] text-gray-700 whitespace-pre-wrap leading-relaxed font-sans">
              {meetingNotes}
            </pre>
          </div>
        )}
      </StepCard>

      {/* Step 2: 关键决策提取 */}
      <StepCard step={steps[1]} defaultOpen>
        {decisions.length > 0 && (
          <div className="space-y-2">
            {decisions.map((d, i) => (
              <div key={i} className="rounded-lg border border-purple-100 bg-purple-50 p-2.5">
                <div className="flex items-start gap-2">
                  <span className="text-xs font-bold text-purple-400 shrink-0 mt-0.5">
                    #{i + 1}
                  </span>
                  <div className="space-y-1 min-w-0">
                    <div className="text-xs font-semibold text-purple-800">{d.topic}</div>
                    <div className="text-xs text-gray-700">{d.decision}</div>
                    {d.actionItem && (
                      <div className="text-[11px] text-purple-600 bg-purple-100 rounded px-2 py-0.5">
                        → 行动项：{d.actionItem}
                      </div>
                    )}
                    {d.linkedClarificationId && (
                      <div className="flex items-center gap-1 text-[10px] text-gray-400">
                        <Link className="w-2.5 h-2.5" />
                        关联澄清清单：{d.linkedClarificationId}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </StepCard>

      {/* Step 3: 澄清清单核对 */}
      <StepCard step={steps[2]} defaultOpen>
        {updatedClarifications.length > 0 && (
          <div>
            <div className="mb-2 text-xs text-gray-500">
              会议已解答{" "}
              <span className="font-semibold text-green-600">
                {updatedClarifications.filter((c) => c.resolved).length}
              </span>{" "}
              /{updatedClarifications.length} 项
            </div>
            <ClarificationChecklist
              items={updatedClarifications}
              compact
            />
          </div>
        )}
      </StepCard>

      {/* Done banner */}
      {steps.every((s) => s.status === "done") && (
        <div className="flex items-center gap-2 rounded-lg bg-purple-50 border border-purple-200 px-3 py-2">
          <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0" />
          <p className="text-xs text-purple-700">
            Phase B 完成！会议关键决策已提取，澄清清单已更新。请前往 Phase C 进行信息补充和定稿。
          </p>
        </div>
      )}
    </div>
  );
}
