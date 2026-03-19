"use client";

import { TrendingDown, TrendingUp, Target, BarChart3 } from "lucide-react";
import { Card } from "@/components/ui/card";

const metrics = [
  {
    icon: TrendingDown,
    label: "平均编辑时长",
    before: "45 分钟",
    after: "8 分钟",
    change: "↓ 82%",
    changeType: "positive",
    description: "从手动撰写到AI辅助生成",
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  {
    icon: Target,
    label: "首次通过率",
    before: "~60%",
    after: "92%",
    change: "↑ 32pp",
    changeType: "positive",
    description: "初稿无需大幅修改即可使用",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  {
    icon: BarChart3,
    label: "平替方案采纳率",
    before: "—",
    after: "35%",
    change: "节省对接成本",
    changeType: "highlight",
    description: "客户接受备选方案，降低对接难度",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
  },
];

export function MetricsDashboard() {
  return (
    <div className="border-t bg-gray-50/50">
      <div className="px-6 py-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-semibold text-gray-700">
            效果评估指标
          </span>
          <span className="text-xs text-gray-400 ml-1">
            （基于内部试用数据）
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <Card
                key={metric.label}
                className={`p-3 border ${metric.borderColor} ${metric.bgColor} shadow-none`}
              >
                <div className="flex items-start gap-2">
                  <div
                    className={`p-1.5 rounded-md bg-white shadow-sm shrink-0`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${metric.color}`} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-gray-500 mb-1">
                      {metric.label}
                    </div>
                    <div className="flex items-baseline gap-2 flex-wrap">
                      {metric.before !== "—" && (
                        <span className="text-xs text-gray-400 line-through">
                          {metric.before}
                        </span>
                      )}
                      <span
                        className={`text-lg font-bold ${metric.color}`}
                      >
                        {metric.after}
                      </span>
                      <span
                        className={`text-xs font-semibold ${metric.color} bg-white px-1.5 py-0.5 rounded-full border ${metric.borderColor}`}
                      >
                        {metric.change}
                      </span>
                    </div>
                    <div className="text-[10px] text-gray-400 mt-1">
                      {metric.description}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
