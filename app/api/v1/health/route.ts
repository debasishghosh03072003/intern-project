import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import mongoose from "mongoose";

export async function GET() {
  const startTime = Date.now();

  try {
    await connectDB();

    const dbState = mongoose.connection.readyState;
    const dbStateMap: Record<number, string> = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    };

    return NextResponse.json(
      {
        success: true,
        status: "ok",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: {
          status: dbStateMap[dbState] ?? "unknown",
          name: mongoose.connection.name,
        },
        latencyMs: Date.now() - startTime,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        status: "error",
        timestamp: new Date().toISOString(),
        database: { status: "disconnected" },
        latencyMs: Date.now() - startTime,
      },
      { status: 503 }
    );
  }
}
