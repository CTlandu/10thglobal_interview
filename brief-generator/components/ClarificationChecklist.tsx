"use client";

import { AlertCircle, CheckSquare, Square, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import type { ClarificationItem } from "@/lib/types";

interface ClarificationChecklistProps {
  items: ClarificationItem[];
  onToggle?: (id: string, resolved: boolean) => void;
  onAnswerChange?: (id: string, answer: string) => void;
  compact?: boolean;
}

const priorityConfig = {
  high: { label: "高", color: "text-red-600 bg-red-50 border-red-200" },
  medium: { label: "中", color: "text-amber-600 bg-amber-50 border-amber-200" },
  low: { label: "低", color: "text-gray-500 bg-gray-50 border-gray-200" },
};

export function ClarificationChecklist({
  items,
  onToggle,
  onAnswerChange,
  compact = false,
}: ClarificationChecklistProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const resolved = items.filter((i) => i.resolved).length;
  const total = items.length;

  return (
    <div className="space-y-1.5">
      {/* Summary bar */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
          <span className="text-xs font-medium text-gray-700">
            澄清清单
          </span>
          <span className="text-xs text-gray-400">
            {resolved}/{total} 已解答
          </span>
        </div>
        {/* Progress bar */}
        <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full transition-all"
            style={{ width: `${total > 0 ? (resolved / total) * 100 : 0}%` }}
          />
        </div>
      </div>

      {items.map((item) => {
        const pc = priorityConfig[item.priority];
        const isExpanded = expandedId === item.id;
        return (
          <div
            key={item.id}
            className={cn(
              "rounded-lg border transition-all",
              item.resolved
                ? "border-green-200 bg-green-50"
                : "border-gray-200 bg-white hover:border-gray-300"
            )}
          >
            <div
              className="flex items-start gap-2 p-2 cursor-pointer"
              onClick={() => setExpandedId(isExpanded ? null : item.id)}
            >
              {/* Checkbox */}
              <button
                className="shrink-0 mt-0.5"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggle?.(item.id, !item.resolved);
                }}
              >
                {item.resolved ? (
                  <CheckSquare className="w-4 h-4 text-green-500" />
                ) : (
                  <Square className="w-4 h-4 text-gray-300" />
                )}
              </button>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span
                    className={cn(
                      "text-[9px] font-bold px-1.5 py-0.5 rounded-full border",
                      pc.color
                    )}
                  >
                    {pc.label}
                  </span>
                  <span className="text-[10px] font-medium text-gray-500">
                    {item.field}
                  </span>
                </div>
                <p
                  className={cn(
                    "text-xs mt-0.5 leading-relaxed",
                    item.resolved ? "text-green-700 line-through opacity-60" : "text-gray-700"
                  )}
                >
                  {item.question}
                </p>
                {item.resolved && item.answer && (
                  <p className="text-xs mt-1 text-green-700 bg-green-100 rounded px-2 py-1">
                    ✅ {item.answer}
                  </p>
                )}
              </div>

              {/* Expand icon */}
              {!compact && !item.resolved && (
                <span className="shrink-0 text-gray-300">
                  {isExpanded ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </span>
              )}
            </div>

            {/* Answer input (expanded, only for unresolved) */}
            {isExpanded && !item.resolved && !compact && (
              <div className="px-2 pb-2 pl-8">
                <textarea
                  className="w-full text-xs rounded-md border border-gray-200 bg-gray-50 p-2 resize-none focus:outline-none focus:border-blue-300 focus:bg-white"
                  rows={2}
                  placeholder="在碰头会中记录答案..."
                  value={item.answer || ""}
                  onChange={(e) => onAnswerChange?.(item.id, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
