import { NextResponse } from "next/server";
import { isMockMode } from "@/lib/ai-client";

export async function GET() {
  return NextResponse.json({
    mockMode: isMockMode(),
    model: process.env.AI_MODEL || "未配置",
    provider: process.env.AI_BASE_URL?.includes("openrouter")
      ? "OpenRouter"
      : process.env.AI_BASE_URL?.includes("moonshot")
      ? "Kimi (月之暗面)"
      : process.env.AI_BASE_URL
      ? "自定义"
      : "OpenAI",
  });
}
