"use client";

import { ArrowRight, MinusCircle, PlusCircle, Equal } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DiffField } from "@/lib/types";

interface DiffViewerProps {
  fields: DiffField[];
}

export function DiffViewer({ fields }: DiffViewerProps) {
  const changed = fields.filter((f) => f.changed).length;
  const total = fields.length;

  return (
    <div className="space-y-2">
      {/* Summary */}
      <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
        <div className="flex items-center gap-1.5 text-xs text-amber-600 font-medium">
          <MinusCircle className="w-3.5 h-3.5" />
          {changed} 项变更
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Equal className="w-3.5 h-3.5" />
          {total - changed} 项不变
        </div>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-[1fr_24px_1fr] gap-2 text-[10px] font-semibold text-gray-400 px-1">
        <div>初稿（Phase A）</div>
        <div />
        <div>定稿（Phase C）</div>
      </div>

      {/* Rows */}
      {fields.map((field) => (
        <div
          key={field.field}
          className={cn(
            "rounded-lg border overflow-hidden",
            field.changed ? "border-amber-200" : "border-gray-100"
          )}
        >
          {/* Field label */}
          <div
            className={cn(
              "px-2 py-1 text-[10px] font-semibold",
              field.changed
                ? "bg-amber-50 text-amber-700"
                : "bg-gray-50 text-gray-400"
            )}
          >
            {field.field}
          </div>

          {/* Diff row */}
          <div className="grid grid-cols-[1fr_24px_1fr] gap-0 text-xs">
            {/* Before */}
            <div
              className={cn(
                "p-2 leading-relaxed",
                field.changed
                  ? "bg-red-50 text-red-700 line-through opacity-70"
                  : "text-gray-600"
              )}
            >
              {field.before}
            </div>

            {/* Arrow */}
            <div className="flex items-center justify-center bg-white">
              {field.changed ? (
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Equal className="w-3.5 h-3.5 text-gray-200" />
              )}
            </div>

            {/* After */}
            <div
              className={cn(
                "p-2 leading-relaxed",
                field.changed
                  ? "bg-green-50 text-green-800 font-medium"
                  : "text-gray-600"
              )}
            >
              {field.after}
              {field.changed && field.changeType === "added" && (
                <span className="ml-1 inline-flex items-center gap-0.5 text-[9px] text-green-600 bg-green-100 px-1 rounded">
                  <PlusCircle className="w-2.5 h-2.5" /> 新增
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
