// Deprecated — replaced by /api/phase-a, /api/phase-b, /api/phase-c
import { NextRequest } from "next/server";
export async function POST(_req: NextRequest) {
  return new Response(JSON.stringify({ error: "Use /api/phase-a instead" }), { status: 410 });
}
