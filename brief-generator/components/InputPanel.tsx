"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ChevronDown, PlayCircle, ArrowRight, FlaskConical } from "lucide-react";
import { DEMO_CASES } from "@/lib/mock-data";
import type { Phase } from "@/lib/types";

interface InputPanelProps {
  activePhase: Phase | "D";
  isRunning: boolean;
  phaseADone: boolean;
  phaseBDone: boolean;
  onRunPhaseA: (rawDraft: string) => void;
  onRunPhaseB: (meetingNotes: string) => void;
  onRunPhaseC: () => void;
}

export function InputPanel({
  activePhase,
  isRunning,
  phaseADone,
  phaseBDone,
  onRunPhaseA,
  onRunPhaseB,
  onRunPhaseC,
}: InputPanelProps) {
  void isRunning;
  const [rawDraft, setRawDraft] = useState("");
  const [meetingNotes, setMeetingNotes] = useState("");
  const [showDemoList, setShowDemoList] = useState(false);

  const handleLoadDemo = (id: string) => {
    const demo = DEMO_CASES.find((d) => d.id === id);
    if (!demo) return;
    setRawDraft(demo.rawDraft);
    setMeetingNotes(demo.meetingNotes);
    setShowDemoList(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">输入控制台</h2>
            <p className="text-xs text-gray-400 mt-0.5">填写信息后点击运行按钮</p>
          </div>
          {/* Demo selector */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className="text-xs gap-1 h-7"
              onClick={() => setShowDemoList((v) => !v)}
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              演示数据
              <ChevronDown className="w-3 h-3" />
            </Button>
            {showDemoList && (
              <div className="absolute right-0 top-8 z-50 bg-white border border-gray-200 rounded-lg shadow-lg w-64 py-1">
                {DEMO_CASES.map((demo) => (
                  <button
                    key={demo.id}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors"
                    onClick={() => handleLoadDemo(demo.id)}
                  >
                    <div className="text-xs font-medium text-gray-800">{demo.label}</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">{demo.description}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Phase A input */}
      {activePhase === "A" && (
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4">
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                  A
                </span>
                <label className="text-xs font-semibold text-gray-800">手动初稿</label>
              </div>
              <p className="text-[10px] text-gray-400 mb-2">
                填写客户名称、日期、人数、参观行业意向、特殊要求等基本信息。格式自由，AI 会自动结构化。
              </p>
              <Textarea
                placeholder={`例：
客户：沙特数字化转型局代表团
日期：2025年10月中旬，5天
人数：12人（含3名副部长）
所需陪同：2名高级陪同，1名翻译
参观意向：AI大模型、具身机器人
特殊要求：全程英阿双语翻译...`}
                value={rawDraft}
                onChange={(e) => setRawDraft(e.target.value)}
                className="text-xs resize-none h-72 bg-gray-50 focus:bg-white transition-colors"
              />
            </div>

            {/* What happens explanation */}
            <div className="rounded-lg bg-blue-50 border border-blue-100 p-3 space-y-1.5">
              <div className="text-[10px] font-semibold text-blue-700 mb-1">运行后会发生什么？</div>
              {[
                "① AI 将初稿转为结构化 JSON 字段",
                "② 两个 AI 模型独立质检，标注澄清点",
                "③ 系统对比两模型输出，高亮分歧点",
                "④ 自动生成带 Checkbox 的澄清清单",
              ].map((s) => (
                <div key={s} className="flex items-start gap-1.5 text-[11px] text-blue-600">
                  <ArrowRight className="w-3 h-3 shrink-0 mt-0.5" />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 border-t bg-white">
            <Button
              className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-sm h-9"
              disabled={isRunning || !rawDraft.trim()}
              onClick={() => onRunPhaseA(rawDraft)}
            >
              {isRunning ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  AI 流水线运行中...
                </>
              ) : (
                <>
                  <PlayCircle className="w-3.5 h-3.5" />
                  运行 Phase A（5 个步骤）
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Phase B input */}
      {activePhase === "B" && (
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4">
            {!phaseADone && (
              <div className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 mb-3">
                <p className="text-xs text-amber-700">
                  请先完成 Phase A（活动方案确立）再进行碰头会整合。
                </p>
              </div>
            )}
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                  B
                </span>
                <label className="text-xs font-semibold text-gray-800">碰头会纪要</label>
              </div>
              <p className="text-[10px] text-gray-400 mb-2">
                将线上碰头会的会议纪要粘贴到这里（语音转录、手写记录均可）。
              </p>
              <Textarea
                placeholder={`例：
碰头会时间：2025年9月15日 下午3点
参与方：我方（张总）、合作方（王总）

1. 字节跳动参观：不接受政府代表团，改为智谱AI
2. 百度参观：可安排，需6周前申请
3. 预算确认：80-120万人民币...`}
                value={meetingNotes}
                onChange={(e) => setMeetingNotes(e.target.value)}
                className="text-xs resize-none h-72 bg-gray-50 focus:bg-white transition-colors"
                disabled={!phaseADone}
              />
            </div>

            <div className="rounded-lg bg-purple-50 border border-purple-100 p-3 space-y-1.5">
              <div className="text-[10px] font-semibold text-purple-700 mb-1">运行后会发生什么？</div>
              {[
                "① 会议纪要导入系统，标记为结构化输入",
                "② AI 提取关键决策，格式化为结构化列表",
                "③ 自动比对 Phase A 澄清清单，标记已解答项",
              ].map((s) => (
                <div key={s} className="flex items-start gap-1.5 text-[11px] text-purple-600">
                  <ArrowRight className="w-3 h-3 shrink-0 mt-0.5" />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 border-t bg-white">
            <Button
              className="w-full gap-2 bg-purple-600 hover:bg-purple-700 text-sm h-9"
              disabled={isRunning || !meetingNotes.trim() || !phaseADone}
              onClick={() => onRunPhaseB(meetingNotes)}
            >
              {isRunning ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  整合中...
                </>
              ) : (
                <>
                  <PlayCircle className="w-3.5 h-3.5" />
                  运行 Phase B（3 个步骤）
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Phase C input */}
      {activePhase === "C" && (
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4">
            {!phaseBDone && (
              <div className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 mb-3">
                <p className="text-xs text-amber-700">
                  请先完成 Phase B（碰头会整合）再生成定稿。
                </p>
              </div>
            )}

            <div className="rounded-lg bg-green-50 border border-green-100 p-3 space-y-1.5 mb-3">
              <div className="text-[10px] font-semibold text-green-700 mb-1">Phase C 会做什么？</div>
              {[
                "① 提取精确需求（明确确认的需求）",
                "② 识别模糊需求，AI 挖掘深层含义",
                "③ 3 个模型并行推荐方案（候选集）",
                "④ 多数同意机制筛选共识方案",
                "⑤ 人工逐条复核，最终决策权在人",
                "⑥ 可视化初稿 vs 定稿差异对比",
              ].map((s) => (
                <div key={s} className="flex items-start gap-1.5 text-[11px] text-green-700">
                  <ArrowRight className="w-3 h-3 shrink-0 mt-0.5" />
                  <span>{s}</span>
                </div>
              ))}
            </div>

            <div className="rounded-lg bg-gray-50 border border-gray-100 p-3 text-xs text-gray-500">
              <p className="font-medium text-gray-700 mb-1">输入来源（自动使用）：</p>
              <div className="flex items-center gap-1.5">
                <Badge variant="outline" className="text-[10px] text-blue-600 border-blue-200">
                  Phase A 结构化初稿
                </Badge>
                <span>+</span>
                <Badge variant="outline" className="text-[10px] text-purple-600 border-purple-200">
                  Phase B 会议决策
                </Badge>
              </div>
            </div>
          </div>

          <div className="p-4 border-t bg-white">
            <Button
              className="w-full gap-2 bg-green-600 hover:bg-green-700 text-sm h-9"
              disabled={isRunning || !phaseBDone}
              onClick={onRunPhaseC}
            >
              {isRunning ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  生成定稿中...
                </>
              ) : (
                <>
                  <PlayCircle className="w-3.5 h-3.5" />
                  运行 Phase C（6 个步骤）
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Phase D — no input needed, just explanation */}
      {activePhase === "D" && (
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                D
              </span>
              <span className="text-xs font-semibold text-gray-800">企业联络 & 行程落地</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-600 font-medium">
                延伸方向
              </span>
            </div>

            <div className="rounded-lg bg-purple-50 border border-dashed border-purple-300 p-3">
              <div className="flex items-start gap-2">
                <FlaskConical className="w-3.5 h-3.5 text-purple-500 shrink-0 mt-0.5" />
                <p className="text-xs text-purple-700">
                  本阶段为设计思路展示，不在当前版本的实现范围内。
                  右侧展示的是完整的数据结构与交互逻辑设计，可供参考。
                </p>
              </div>
            </div>

            <div className="space-y-2 text-xs text-gray-600">
              <p className="font-semibold text-gray-700">设计思路：</p>
              {[
                "Brief 定稿后，需要将参观意向落实为具体企业对接。此步骤涉及大量重复性搜索和外联工作，是自动化的理想场景。",
                "调用 2-3 个 AI 搜索引擎并行查询目标企业联系方式，交叉比对结果，提高准确率。",
                "基于会议纪要 + 企业背景，AI 自动生成个性化外联邮件 / 电话话术，保证内容相关性。",
                "沟通结果结构化记录后，按行业、优先级、地理位置辅助人工完成最终行程筛选。",
              ].map((s, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <ArrowRight className="w-3 h-3 shrink-0 mt-0.5 text-purple-400" />
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
