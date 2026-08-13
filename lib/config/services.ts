/**
 * Backend service URLs — set in .env.local (dev) or Vercel/v0 dashboard (production).
 * Server-side API routes prefer IP_ENGINE_URL / TRL_SERVICES_URL (no NEXT_PUBLIC_ prefix).
 */
export function getIpEngineUrl(): string {
  return (
    process.env.IP_ENGINE_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:8765"
  )
}

export function getTrlServicesUrl(): string {
  return (
    process.env.TRL_SERVICES_URL ??
    process.env.NEXT_PUBLIC_TRL_SERVICES_URL ??
    "http://localhost:3001"
  )
}
