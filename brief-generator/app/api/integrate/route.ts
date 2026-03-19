// Deprecated — replaced by /api/phase-b, /api/phase-c
import { NextRequest } from "next/server";
export async function POST(_req: NextRequest) {
  return new Response(JSON.stringify({ error: "Use /api/phase-b and /api/phase-c instead" }), { status: 410 });
}
