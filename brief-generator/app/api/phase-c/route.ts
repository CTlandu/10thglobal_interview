import { NextRequest } from "next/server";
import { isMockMode } from "@/lib/ai-client";
import {
  mockPhaseC_PreciseRequirements,
  mockPhaseC_VagueRequirements,
  mockPhaseC_DiffFields,
  mockPhaseC_FinalBrief,
} from "@/lib/mock-data";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function POST(req: NextRequest) {
  const { meetingNotes, structuredData } = await req.json();
  void meetingNotes;
  void structuredData;

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      try {
        // ── Step 1: 精确需求提取 ─────────────────────
        send({ phase: "C", step: 1, type: "progress" });
        await delay(1000);

        const precise = isMockMode()
          ? mockPhaseC_PreciseRequirements()
          : mockPhaseC_PreciseRequirements();

        send({
          phase: "C",
          step: 1,
          type: "content",
          dataKey: "preciseRequirements",
          content: JSON.stringify(precise, null, 2),
        });
        await delay(400);
        send({ phase: "C", step: 1, type: "done" });

        // ── Step 2: 模糊需求识别 ─────────────────────
        send({ phase: "C", step: 2, type: "progress" });
        await delay(1200);

        const vague = isMockMode()
          ? mockPhaseC_VagueRequirements()
          : mockPhaseC_VagueRequirements();

        // 先只发送基础信息（不含模型建议）
        const vagueBase = vague.map((v) => ({
          id: v.id,
          originalText: v.originalText,
          aiInterpretation: v.aiInterpretation,
          modelSuggestions: [],
          consensusSuggestions: [],
          humanDecision: "pending",
        }));

        send({
          phase: "C",
          step: 2,
          type: "content",
          dataKey: "vagueRequirements",
          content: JSON.stringify(vagueBase, null, 2),
        });
        await delay(400);
        send({ phase: "C", step: 2, type: "done" });

        // ── Step 3: 多模型候选方案 ───────────────────
        send({ phase: "C", step: 3, type: "progress" });
        await delay(2000);

        // 发送带模型建议的完整数据
        send({
          phase: "C",
          step: 3,
          type: "content",
          dataKey: "vagueRequirements",
          content: JSON.stringify(vague, null, 2),
        });
        await delay(400);
        send({ phase: "C", step: 3, type: "done" });

        // ── Step 4: 共识筛选 ─────────────────────────
        send({ phase: "C", step: 4, type: "progress" });
        await delay(1000);

        const withConsensus = vague; // 已含 consensusSuggestions
        send({
          phase: "C",
          step: 4,
          type: "content",
          dataKey: "vagueRequirements",
          content: JSON.stringify(withConsensus, null, 2),
        });
        await delay(400);
        send({ phase: "C", step: 4, type: "done" });

        // Step 5 (人工复核) 是纯前端交互，不需要 API 步骤

        // ── Step 6: 初稿 vs 定稿对比 ────────────────
        send({ phase: "C", step: 6, type: "progress" });
        await delay(800);

        const diff = isMockMode()
          ? mockPhaseC_DiffFields()
          : mockPhaseC_DiffFields();

        send({
          phase: "C",
          step: 6,
          type: "content",
          dataKey: "diffFields",
          content: JSON.stringify(diff, null, 2),
        });

        const finalBrief = isMockMode()
          ? mockPhaseC_FinalBrief()
          : mockPhaseC_FinalBrief();

        send({
          phase: "C",
          step: 6,
          type: "content",
          dataKey: "finalBrief",
          content: finalBrief,
        });

        await delay(400);
        send({ phase: "C", step: 6, type: "done" });

        send({ phase: "C", step: 6, type: "complete" });
      } catch (err) {
        send({
          phase: "C",
          step: 1,
          type: "error",
          content: err instanceof Error ? err.message : "未知错误",
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
