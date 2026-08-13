import { NextRequest, NextResponse } from "next/server"
import { getIpEngineUrl } from "@/lib/config/services"

export async function POST(request: NextRequest) {
  const IP_ENGINE_URL = getIpEngineUrl()
  try {
    const formData = await request.formData()
    const file = formData.get("file")

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ detail: "No file provided" }, { status: 400 })
    }

    const upstream = new FormData()
    // Preserve the filename so FastAPI can validate the extension.  App Router
    // form parsing otherwise serializes a Blob as a generic "blob" upload.
    upstream.append("file", file, file instanceof File ? file.name : "upload")

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
        detail: `Cannot reach IP Engine at ${IP_ENGINE_URL}. Set IP_ENGINE_URL in your Vercel/v0 environment.`,
      },
      { status: 503 },
    )
  }
}
