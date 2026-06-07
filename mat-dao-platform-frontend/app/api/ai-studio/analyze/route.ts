import { NextRequest, NextResponse } from "next/server"

const IP_ENGINE_URL =
  process.env.IP_ENGINE_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:8765"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file")

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ detail: "No file provided" }, { status: 400 })
    }

    const upstream = new FormData()
    upstream.append("file", file)

    const response = await fetch(`${IP_ENGINE_URL}/api/analyze`, {
      method: "POST",
      body: upstream,
    })

    const body = await response.json().catch(() => ({ detail: "Analysis failed" }))

    if (!response.ok) {
      return NextResponse.json(body, { status: response.status })
    }

    return NextResponse.json(body)
  } catch {
    return NextResponse.json(
      {
        detail:
          "Cannot reach the MatDAO IP Engine backend. Start it from matdao-ip-engine: " +
          "cd backend && python -m uvicorn app.main:app --port 8765",
      },
      { status: 503 },
    )
  }
}
