"use client";

import { CheckCircle2, Circle, Loader2, XCircle, ChevronDown, ChevronUp, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import type { PipelineStep } from "@/lib/types";

interface StepCardProps {
  step: PipelineStep;
  children?: React.ReactNode;
  /** 是否默认展开输出区 */
  defaultOpen?: boolean;
}

export function StepCard({ step, children, defaultOpen = false }: StepCardProps) {
  const [rationaleOpen, setRationaleOpen] = useState(false);
  const [outputOpen, setOutputOpen] = useState(defaultOpen);

  const isDone = step.status === "done";
  const isRunning = step.status === "running";
  const isError = step.status === "error";

  return (
    <div
      className={cn(
        "rounded-xl border transition-all duration-300",
        step.status === "pending" && "border-gray-200 bg-white",
        isRunning && "border-blue-300 bg-blue-50 shadow-sm shadow-blue-100",
        isDone && "border-green-300 bg-white",
        isError && "border-red-300 bg-red-50"
      )}
    >
      {/* Header row */}
      <div className="flex items-start gap-3 p-3">
        {/* Status icon */}
        <div className="mt-0.5 shrink-0">
          {step.status === "pending" && <Circle className="w-5 h-5 text-gray-300" />}
          {isRunning && <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />}
          {isDone && <CheckCircle2 className="w-5 h-5 text-green-500" />}
          {isError && <XCircle className="w-5 h-5 text-red-500" />}
        </div>

        {/* Title + description */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                step.status === "pending" && "bg-gray-100 text-gray-400",
                isRunning && "bg-blue-100 text-blue-600",
                isDone && "bg-green-100 text-green-600",
                isError && "bg-red-100 text-red-600"
              )}
            >
              Step {step.id}
            </span>
            <span
              className={cn(
                "text-sm font-semibold",
                step.status === "pending" && "text-gray-400",
                isRunning && "text-blue-700",
                isDone && "text-gray-900",
                isError && "text-red-700"
              )}
            >
              {step.label}
            </span>
          </div>
          <p
            className={cn(
              "text-xs mt-0.5",
              step.status === "pending" && "text-gray-300",
              isRunning && "text-blue-500",
              isDone && "text-gray-500",
              isError && "text-red-500"
            )}
          >
            {step.description}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Rationale toggle */}
          <button
            className={cn(
              "flex items-center gap-1 text-[10px] px-1.5 py-1 rounded-md transition-colors",
              "text-amber-600 hover:bg-amber-50"
            )}
            onClick={() => setRationaleOpen((v) => !v)}
            title="为什么需要这个步骤？"
          >
            <Lightbulb className="w-3 h-3" />
            <span className="hidden sm:inline">思维链</span>
            {rationaleOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {/* Output toggle (only when done) */}
          {isDone && children && (
            <button
              className="flex items-center gap-1 text-[10px] px-1.5 py-1 rounded-md text-gray-500 hover:bg-gray-100 transition-colors"
              onClick={() => setOutputOpen((v) => !v)}
            >
              输出
              {outputOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          )}
        </div>
      </div>

      {/* Rationale panel */}
      {rationaleOpen && (
        <div className="mx-3 mb-2 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200">
          <p className="text-xs text-amber-800 leading-relaxed">
            <span className="font-semibold">为什么有这步？</span>{" "}
            {step.rationale}
          </p>
        </div>
      )}

      {/* Running animation */}
      {isRunning && (
        <div className="mx-3 mb-3 h-1 rounded-full overflow-hidden bg-blue-100">
          <div className="h-full bg-blue-400 animate-pulse rounded-full" style={{ width: "60%" }} />
        </div>
      )}

      {/* Output area */}
      {isDone && outputOpen && children && (
        <div className="mx-3 mb-3 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden">
          <div className="max-h-64 overflow-y-auto p-3">{children}</div>
        </div>
      )}
    </div>
  );
}
