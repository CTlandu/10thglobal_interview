import { NextRequest } from "next/server";
import { isMockMode } from "@/lib/ai-client";
import {
  mockPhaseA_Step1,
  mockPhaseA_ModelA,
  mockPhaseA_ModelB,
  mockPhaseA_Differences,
  mockPhaseA_ClarificationList,
} from "@/lib/mock-data";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function POST(req: NextRequest) {
  const { rawDraft } = await req.json();
  void rawDraft; // used in real mode

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      try {
        // ── Step 1: 结构化解析 ──────────────────────────
        send({ phase: "A", step: 1, type: "progress" });
        await delay(800);

        const structured = isMockMode()
          ? mockPhaseA_Step1()
          : mockPhaseA_Step1(); // real: call AI

        send({
          phase: "A",
          step: 1,
          type: "content",
          dataKey: "structuredData",
          content: JSON.stringify(structured, null, 2),
        });
        await delay(400);
        send({ phase: "A", step: 1, type: "done" });

        // ── Step 2: AI 模型 A 质检 ────────────────────
        send({ phase: "A", step: 2, type: "progress" });
        await delay(1400);

        const modelA = isMockMode()
          ? mockPhaseA_ModelA()
          : mockPhaseA_ModelA();

        send({
          phase: "A",
          step: 2,
          type: "content",
          dataKey: "modelAOutput",
          content: JSON.stringify(modelA, null, 2),
        });
        await delay(400);
        send({ phase: "A", step: 2, type: "done" });

        // ── Step 3: AI 模型 B 交叉验证 ────────────────
        send({ phase: "A", step: 3, type: "progress" });
        await delay(1400);

        const modelB = isMockMode()
          ? mockPhaseA_ModelB()
          : mockPhaseA_ModelB();

        send({
          phase: "A",
          step: 3,
          type: "content",
          dataKey: "modelBOutput",
          content: JSON.stringify(modelB, null, 2),
        });
        await delay(400);
        send({ phase: "A", step: 3, type: "done" });

        // ── Step 4: 差异比对 ──────────────────────────
        send({ phase: "A", step: 4, type: "progress" });
        await delay(1000);

        const differences = isMockMode()
          ? mockPhaseA_Differences()
          : mockPhaseA_Differences();

        send({
          phase: "A",
          step: 4,
          type: "content",
          dataKey: "differences",
          content: JSON.stringify(differences, null, 2),
        });
        await delay(400);
        send({ phase: "A", step: 4, type: "done" });

        // ── Step 5: 澄清清单生成 ──────────────────────
        send({ phase: "A", step: 5, type: "progress" });
        await delay(900);

        const clarList = isMockMode()
          ? mockPhaseA_ClarificationList()
          : mockPhaseA_ClarificationList();

        send({
          phase: "A",
          step: 5,
          type: "content",
          dataKey: "clarificationList",
          content: JSON.stringify(clarList, null, 2),
        });
        await delay(400);
        send({ phase: "A", step: 5, type: "done" });

        send({ phase: "A", step: 5, type: "complete" });
      } catch (err) {
        send({
          phase: "A",
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
