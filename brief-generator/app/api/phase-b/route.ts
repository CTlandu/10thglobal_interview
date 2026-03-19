import { NextRequest } from "next/server";
import { isMockMode } from "@/lib/ai-client";
import {
  mockPhaseB_Decisions,
  mockPhaseB_UpdatedClarifications,
} from "@/lib/mock-data";
import type { ClarificationItem } from "@/lib/types";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function POST(req: NextRequest) {
  const { meetingNotes, clarificationList } = await req.json() as {
    meetingNotes: string;
    clarificationList: ClarificationItem[];
  };
  void meetingNotes;

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      try {
        // ── Step 1: 会议纪要导入 ────────────────────────
        send({ phase: "B", step: 1, type: "progress" });
        await delay(600);
        send({ phase: "B", step: 1, type: "done" });

        // ── Step 2: 关键决策提取 ──────────────────────
        send({ phase: "B", step: 2, type: "progress" });
        await delay(1600);

        const decisions = isMockMode()
          ? mockPhaseB_Decisions()
          : mockPhaseB_Decisions();

        send({
          phase: "B",
          step: 2,
          type: "content",
          dataKey: "decisions",
          content: JSON.stringify(decisions, null, 2),
        });
        await delay(400);
        send({ phase: "B", step: 2, type: "done" });

        // ── Step 3: 澄清清单核对 ──────────────────────
        send({ phase: "B", step: 3, type: "progress" });
        await delay(1000);

        const updated = isMockMode()
          ? mockPhaseB_UpdatedClarifications(clarificationList)
          : mockPhaseB_UpdatedClarifications(clarificationList);

        send({
          phase: "B",
          step: 3,
          type: "content",
          dataKey: "updatedClarifications",
          content: JSON.stringify(updated, null, 2),
        });
        await delay(400);
        send({ phase: "B", step: 3, type: "done" });

        send({ phase: "B", step: 3, type: "complete" });
      } catch (err) {
        send({
          phase: "B",
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
