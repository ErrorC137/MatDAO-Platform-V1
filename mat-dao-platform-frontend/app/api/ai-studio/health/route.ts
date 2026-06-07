import { NextResponse } from "next/server"

const IP_ENGINE_URL =
  process.env.IP_ENGINE_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:8765"

export async function GET() {
  try {
    const response = await fetch(`${IP_ENGINE_URL}/health`, {
      next: { revalidate: 0 },
    })
    const body = await response.json()
    return NextResponse.json({ reachable: true, ...body })
  } catch {
    return NextResponse.json(
      {
        reachable: false,
        status: "offline",
        service: "matdao-ip-engine",
        detail: "Backend not running on " + IP_ENGINE_URL,
      },
      { status: 503 },
    )
  }
}
