import { NextResponse } from "next/server";
import { leaderboardStore } from "@/lib/store/leaderboardStore";

export async function GET() {
  return NextResponse.json({ ok: true, entries: leaderboardStore.top(10) });
}
