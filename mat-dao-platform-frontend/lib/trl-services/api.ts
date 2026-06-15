import type { ResearcherProfile, TrlProject, VerificationTask } from "./types"

const BASE = "/api/trl-services"

async function trlFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  })
  const body = await res.json().catch(() => ({ error: "Request failed" }))
  if (!res.ok) {
    throw new Error(body.error || body.detail || `TRL Services error (${res.status})`)
  }
  return body as T
}

export async function checkTrlServicesHealth(): Promise<{
  status: string
  service: string
  gemini_configured: boolean
}> {
  const res = await fetch(`${BASE}/health`)
  if (!res.ok) throw new Error("TRL Services backend unreachable")
  return res.json()
}

export async function evaluateProject(input: {
  title: string
  textContent: string
  category?: string
  author?: string
}): Promise<{ project: TrlProject; note?: string }> {
  return trlFetch("/api/evaluate", { method: "POST", body: JSON.stringify(input) })
}

export async function fetchProjects(): Promise<TrlProject[]> {
  const data = await trlFetch<{ projects: TrlProject[] }>("/api/projects")
  return data.projects
}

export async function fetchVerifications(): Promise<VerificationTask[]> {
  const data = await trlFetch<{ verifications: VerificationTask[] }>("/api/verify")
  return data.verifications
}

export async function submitVerification(input: {
  title: string
  milestoneName: string
  projectId: string
  projectTitle: string
  proofText: string
  submittedBy: string
}): Promise<VerificationTask> {
  const data = await trlFetch<{ task: VerificationTask }>("/api/verify", {
    method: "POST",
    body: JSON.stringify(input),
  })
  return data.task
}

export async function voteVerification(
  id: string,
  passed: boolean,
  notes?: string,
): Promise<VerificationTask> {
  const data = await trlFetch<{ task: VerificationTask }>(`/api/verify/${id}/vote`, {
    method: "POST",
    body: JSON.stringify({ passed, notes }),
  })
  return data.task
}

export async function fetchResearchers(): Promise<ResearcherProfile[]> {
  const data = await trlFetch<{ researchers: ResearcherProfile[] }>("/api/researchers")
  return data.researchers
}

export async function submitCofounderMatch(input: {
  name: string
  title?: string
  institution?: string
  skills?: string | string[]
  bio?: string
  synergyNeeds: string
  type?: ResearcherProfile["type"]
}): Promise<{ profile: ResearcherProfile; matchReport: string }> {
  return trlFetch("/api/match", { method: "POST", body: JSON.stringify(input) })
}
