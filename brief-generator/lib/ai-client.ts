import OpenAI from "openai";

// Supports OpenAI, OpenRouter, Kimi, or any OpenAI-compatible API
export function createAIClient() {
  const apiKey = process.env.AI_API_KEY || process.env.OPENAI_API_KEY;
  const baseURL = process.env.AI_BASE_URL;

  if (!apiKey) {
    return null; // Falls back to mock mode
  }

  const isOpenRouter = baseURL?.includes("openrouter.ai");

  return new OpenAI({
    apiKey,
    ...(baseURL ? { baseURL } : {}),
    // OpenRouter requires these headers to appear on leaderboards (optional but recommended)
    defaultHeaders: isOpenRouter
      ? {
          "HTTP-Referer": "https://brief-generator.internal",
          "X-Title": "Partner Brief Generator",
        }
      : undefined,
  });
}

export const AI_MODEL = process.env.AI_MODEL || "gpt-4o-mini";

export function isMockMode(): boolean {
  return !process.env.AI_API_KEY && !process.env.OPENAI_API_KEY;
}
