import { NextResponse } from "next/server";

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/+$/, "") || "http://localhost:5000";

export async function GET() {
  try {
    const response = await fetch(`${backendUrl}/api/notes/stats`, { cache: "no-store" });
    if (!response.ok) {
      return NextResponse.json(
        { message: "Could not load note statistics" },
        { status: response.status }
      );
    }

    const payload: unknown = await response.json();
    if (
      typeof payload !== "object" ||
      payload === null ||
      !("stats" in payload) ||
      typeof payload.stats !== "object" ||
      payload.stats === null ||
      !("total" in payload.stats) ||
      !("universities" in payload.stats) ||
      !("studyTypes" in payload.stats) ||
      ![payload.stats.total, payload.stats.universities, payload.stats.studyTypes].every(
        (value) => typeof value === "number" && Number.isFinite(value) && value >= 0
      )
    ) {
      return NextResponse.json(
        { message: "Invalid note statistics response from backend" },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      stats: {
        total: payload.stats.total,
        universities: payload.stats.universities,
        studyTypes: payload.stats.studyTypes,
      },
    });
  } catch {
    return NextResponse.json(
      { message: "Could not load note statistics" },
      { status: 502 }
    );
  }
}
