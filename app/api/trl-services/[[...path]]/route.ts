import { NextRequest, NextResponse } from "next/server"
import { getTrlServicesUrl } from "@/lib/config/services"

async function proxy(request: NextRequest, pathSegments: string[] = []) {
  const TRL_SERVICES_URL = getTrlServicesUrl()
  const path = pathSegments.join("/")
  const url = new URL(request.url)
  const target = `${TRL_SERVICES_URL}/${path}${url.search}`

  try {
    const init: RequestInit = {
      method: request.method,
      headers: { "Content-Type": "application/json" },
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      init.body = await request.text()
    }

    const response = await fetch(target, init)
    const body = await response.json().catch(() => ({ error: "TRL Services request failed" }))
    return NextResponse.json(body, { status: response.status })
  } catch {
    return NextResponse.json(
      {
        error: `Cannot reach TRL Services at ${TRL_SERVICES_URL}. Set TRL_SERVICES_URL in your Vercel/v0 environment.`,
      },
      { status: 503 },
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> },
) {
  const { path } = await params
  return proxy(request, path ?? [])
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> },
) {
  const { path } = await params
  return proxy(request, path ?? [])
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path?: string[] }> },
) {
  const { path } = await params
  return proxy(request, path ?? [])
}
