import { NextResponse } from "next/server"
import { getIpEngineUrl } from "@/lib/config/services"

export async function GET() {
  const IP_ENGINE_URL = getIpEngineUrl()
  try {
    const response = await fetch(`${IP_ENGINE_URL}/health`, {
      next: { revalidate: 0 },
    })
    const body = await response.json().catch(() => ({}))
    return NextResponse.json({
      reachable: response.ok,
      backend_url: IP_ENGINE_URL,
      ...body,
    })
  } catch {
    return NextResponse.json(
      {
        reachable: false,
        status: "offline",
        backend_url: IP_ENGINE_URL,
        detail: `Cannot reach IP Engine at ${IP_ENGINE_URL}. Set IP_ENGINE_URL in your environment.`,
      },
      { status: 503 },
    )
  }
}
