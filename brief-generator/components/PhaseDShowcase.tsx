"use client";

import {
  Search,
  Mail,
  Phone,
  MapPin,
  Star,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  FlaskConical,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

// ── Mock data ────────────────────────────────
const MOCK_COMPANIES = [
  {
    id: 1,
    need: "AI大模型政务落地案例",
    industry: "AI / 云计算",
    name: "阿里云（政务云）",
    address: "北京市朝阳区阿里中心",
    phones: ["010-XXXX-XXXX"],
    emails: ["gov-bd@alibaba-inc.com"],
    priority: 5,
    status: "agreed" as const,
    visitTime: "10月15日 上午10:00",
    fee: "免费（官方接待）",
    notes: "需签 NDA，不允许拍摄核心机房",
  },
  {
    id: 2,
    need: "AI大模型政务落地案例",
    industry: "AI / 云计算",
    name: "腾讯政务云",
    address: "北京市海淀区腾讯北京总部",
    phones: ["010-XXXX-XXXX"],
    emails: ["govcloud@tencent.com"],
    priority: 4,
    status: "pending" as const,
    visitTime: null,
    fee: null,
    notes: null,
  },
  {
    id: 3,
    need: "具身机器人展示",
    industry: "机器人",
    name: "UBTECH 深圳总部",
    address: "深圳市南山区科技园北区",
    phones: ["0755-XXXX-XXXX"],
    emails: ["visit@ubtrobot.com"],
    priority: 5,
    status: "agreed" as const,
    visitTime: "10月17日 下午2:00",
    fee: "¥50,000 / 半天（含讲解）",
    notes: "有专属展厅，可安排机器人互动演示",
  },
  {
    id: 4,
    need: "具身机器人展示",
    industry: "机器人",
    name: "宇树科技（Unitree）",
    address: "杭州市余杭区",
    phones: ["0571-XXXX-XXXX"],
    emails: ["bd@unitree.com"],
    priority: 3,
    status: "declined" as const,
    visitTime: null,
    fee: null,
    notes: "当期档期已满，可排11月",
  },
];

const MOCK_EMAIL = `尊敬的 [企业接待负责人]：

您好！我司目前正在接待沙特阿拉伯数字化转型局（SDAIA）高级代表团，一行12人，
含3名副部长级官员，计划于2025年10月中旬访问中国。

代表团对贵司在 [AI大模型 / 政务数字化] 领域的实践经验高度关注，
希望安排一次约2小时的参观交流，主要包括：
  · 核心产品 / 技术方向介绍
  · 政务场景落地案例分享
  · 与技术负责人的闭门交流（可选）

如有意向，请告知可行时间段及相关安排要求，我司将提前完成所有手续。

期待您的回复。

此致
[负责人姓名]
[公司名称] · 政企拓展部
[电话] | [邮箱]`;

const STEP_RATIONALES = [
  "单一搜索引擎的结果存在遗漏和错误，多引擎并行后交叉比对，可以有效提高联系方式的准确率，减少因信息错误导致的外联失败。",
  "每次冷启动外联都从头写邮件效率很低，AI 基于会议纪要和企业背景自动生成话术，保证内容相关性的同时节省人工时间。",
  "沟通结果结构化记录后，可按行业、优先级、地理位置进行多维筛选，辅助人工做最终决策，避免手动在多份表格间比对。",
];

// ── Components ───────────────────────────────
function StepBadge({ n, label, rationale }: { n: number; label: string; rationale: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3">
        <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 text-xs font-bold flex items-center justify-center shrink-0">
          {n}
        </span>
        <span className="text-sm font-semibold text-gray-700 flex-1">{label}</span>
        <button
          className="flex items-center gap-1 text-[10px] text-amber-600 hover:bg-amber-50 px-1.5 py-1 rounded transition-colors"
          onClick={() => setOpen((v) => !v)}
        >
          <Lightbulb className="w-3 h-3" />
          思维链
          {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>
      {open && (
        <div className="mx-4 mb-3 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200">
          <p className="text-xs text-amber-800 leading-relaxed">
            <span className="font-semibold">为什么有这步？</span> {rationale}
          </p>
        </div>
      )}
    </div>
  );
}

function CompanyRow({ company }: { company: (typeof MOCK_COMPANIES)[0] }) {
  const statusConfig = {
    agreed: { label: "已同意", color: "text-green-600 bg-green-50 border-green-200", icon: CheckCircle2 },
    pending: { label: "待回复", color: "text-amber-600 bg-amber-50 border-amber-200", icon: Clock },
    declined: { label: "婉拒", color: "text-red-500 bg-red-50 border-red-200", icon: XCircle },
  };
  const sc = statusConfig[company.status];
  const Icon = sc.icon;

  return (
    <div className={cn("rounded-lg border p-3 text-xs", company.status === "agreed" ? "border-green-200 bg-green-50/30" : "border-gray-200 bg-white")}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-gray-800">{company.name}</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-600 font-medium">
              {company.industry}
            </span>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn("w-2.5 h-2.5", i < company.priority ? "text-amber-400 fill-amber-400" : "text-gray-200")}
                />
              ))}
            </div>
          </div>
          <p className="text-[10px] text-gray-400 mt-0.5 italic">需求：{company.need}</p>
        </div>
        <span className={cn("flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-medium shrink-0", sc.color)}>
          <Icon className="w-3 h-3" />
          {sc.label}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-gray-500 mb-2">
        <div className="flex items-center gap-1">
          <MapPin className="w-3 h-3 shrink-0" />
          {company.address}
        </div>
        <div className="flex items-center gap-1">
          <Phone className="w-3 h-3 shrink-0" />
          {company.phones[0]}
        </div>
        <div className="flex items-center gap-1">
          <Mail className="w-3 h-3 shrink-0" />
          {company.emails[0]}
        </div>
        {company.visitTime && (
          <div className="flex items-center gap-1 text-green-600 font-medium">
            <Clock className="w-3 h-3 shrink-0" />
            {company.visitTime}
          </div>
        )}
      </div>

      {company.notes && (
        <div className="text-[10px] text-gray-400 bg-gray-50 rounded px-2 py-1">
          备注：{company.notes}
        </div>
      )}
      {company.fee && (
        <div className="text-[10px] text-green-600 mt-1">费用：{company.fee}</div>
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────
export function PhaseDShowcase() {
  const [emailOpen, setEmailOpen] = useState(false);

  return (
    <div className="space-y-4">
      {/* Disclaimer banner */}
      <div className="flex items-start gap-2.5 rounded-xl border border-dashed border-purple-300 bg-purple-50 px-4 py-3">
        <FlaskConical className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-semibold text-purple-700">延伸方向思路展示</p>
          <p className="text-xs text-purple-600 mt-0.5">
            本阶段不在当前版本的实现范围内，仅展示设计思路与数据结构。
            实际落地需接入实时搜索 API 和外部邮件服务。
          </p>
        </div>
      </div>

      {/* Step explanations */}
      <div className="space-y-2">
        <StepBadge n={1} label="多搜索引擎并行查询企业联系方式" rationale={STEP_RATIONALES[0]} />
        <StepBadge n={2} label="AI 生成冷启动外联邮件 / 电话话术" rationale={STEP_RATIONALES[1]} />
        <StepBadge n={3} label="沟通结果记录 + 按优先级 / 地理位置筛选" rationale={STEP_RATIONALES[2]} />
      </div>

      {/* Company table mock */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Search className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-xs font-semibold text-gray-700">企业候选列表（示例数据）</span>
          <span className="text-[10px] text-gray-400 ml-auto">
            {MOCK_COMPANIES.filter((c) => c.status === "agreed").length} / {MOCK_COMPANIES.length} 已确认
          </span>
        </div>
        <div className="space-y-2">
          {MOCK_COMPANIES.map((c) => (
            <CompanyRow key={c.id} company={c} />
          ))}
        </div>
      </div>

      {/* Email template mock */}
      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <button
          className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
          onClick={() => setEmailOpen((v) => !v)}
        >
          <Mail className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-xs font-semibold text-gray-700 flex-1">
            AI 生成的外联邮件模板（示例）
          </span>
          {emailOpen ? (
            <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          )}
        </button>
        {emailOpen && (
          <div className="border-t border-gray-100 p-4">
            <pre className="text-[11px] text-gray-600 whitespace-pre-wrap leading-relaxed font-sans bg-gray-50 rounded-lg p-3">
              {MOCK_EMAIL}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
