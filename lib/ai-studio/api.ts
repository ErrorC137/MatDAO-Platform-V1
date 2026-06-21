import type { AnalysisReport, AuditEntry, HitlModifiers, TokenizationBreakdown } from "./types"

export interface BackendHealth {
  reachable: boolean
  status?: string
  index_ready?: boolean
  patent_corpus_size?: number
  embedding_model?: string
  backend_url?: string
  detail?: string
}

export async function checkBackendHealth(): Promise<BackendHealth> {
  try {
    const response = await fetch("/api/ai-studio/health")
    return response.json()
  } catch {
    return { reachable: false, status: "offline", detail: "Cannot reach API proxy" }
  }
}

export async function analyzeDocument(file: File): Promise<AnalysisReport> {
  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch("/api/ai-studio/analyze", {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Analysis failed" }))
    throw new Error(error.detail ?? "Analysis failed")
  }

  return response.json()
}

export function formatUsd(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value)
}

export function computeAdjustedValuation(
  anchor: number,
  modifiers: HitlModifiers,
): { total: number; audit: AuditEntry[] } {
  const teamAdj = anchor * (modifiers.teamPedigree / 100) * 0.10
  const secretsAdj = anchor * (modifiers.tradeSecrets / 100) * 0.15
  const partnerAdj = anchor * (modifiers.partnerships / 100) * 0.05
  const total = anchor + teamAdj + secretsAdj + partnerAdj

  const audit: AuditEntry[] = [
    {
      id: "hitl_team",
      parent_id: "tokenization_anchor",
      label: "Team Pedigree Adjustment",
      amount_usd: teamAdj,
      formula: `Anchor × (slider/100) × 10% max`,
      explanation: "Human-assessed modifier for founder track record, domain expertise, and execution capability.",
      calculation_steps: [
        { step: 1, operation: "Anchor USD", value: anchor },
        { step: 2, operation: "Slider position", value: `${modifiers.teamPedigree}%` },
        { step: 3, operation: "Adjustment USD", value: Math.round(teamAdj) },
      ],
      evidence: [{ type: "hitl_modifier", ref: "team_pedigree", detail: "Max ±10% of anchor" }],
    },
    {
      id: "hitl_secrets",
      parent_id: "tokenization_anchor",
      label: "Trade Secrets & Know-How",
      amount_usd: secretsAdj,
      formula: `Anchor × (slider/100) × 15% max`,
      explanation: "Premium for unpatentable tacit knowledge, proprietary datasets, and undocumented processes.",
      calculation_steps: [
        { step: 1, operation: "Slider position", value: `${modifiers.tradeSecrets}%` },
        { step: 2, operation: "Adjustment USD", value: Math.round(secretsAdj) },
      ],
      evidence: [{ type: "hitl_modifier", ref: "trade_secrets", detail: "Max +15% of anchor" }],
    },
    {
      id: "hitl_partnerships",
      parent_id: "tokenization_anchor",
      label: "Strategic Partnerships",
      amount_usd: partnerAdj,
      formula: `Anchor × (slider/100) × 5% max`,
      explanation: "Modifier for LOIs, pilot agreements, and distribution partnerships not captured in the paper text.",
      calculation_steps: [
        { step: 1, operation: "Slider position", value: `${modifiers.partnerships}%` },
        { step: 2, operation: "Adjustment USD", value: Math.round(partnerAdj) },
      ],
      evidence: [{ type: "hitl_modifier", ref: "partnerships", detail: "Max +5% of anchor" }],
    },
    {
      id: "hitl_final",
      parent_id: "tokenization_anchor",
      label: "Full Adjusted IP Value (100% ownership)",
      amount_usd: total,
      formula: "Anchor + team + secrets + partnerships",
      explanation: "Total enterprise value after human-in-the-loop modifiers, assuming 100% IP ownership.",
      calculation_steps: [
        { step: 1, operation: "AI anchor", value: anchor },
        { step: 2, operation: "HITL adjustments", value: Math.round(teamAdj + secretsAdj + partnerAdj) },
        { step: 3, operation: "Full adjusted value", value: Math.round(total) },
      ],
      evidence: [{ type: "policy", ref: "30_HITL", detail: "Human discretion layer" }],
    },
  ]

  return { total, audit }
}

export function computeTokenizationBreakdown(
  fullAdjustedValue: number,
  tokenizationFractionPct: number,
  hitlAudit: AuditEntry[],
): TokenizationBreakdown {
  const fraction = Math.max(1, Math.min(100, tokenizationFractionPct))
  const listed = fullAdjustedValue * (fraction / 100)

  const fractionAudit: AuditEntry = {
    id: "tokenization_fraction",
    parent_id: "hitl_final",
    label: `Listed for Tokenization (${fraction}% of IP)`,
    amount_usd: listed,
    formula: `Full adjusted value × ${fraction}%`,
    explanation:
      fraction < 100
        ? `You retain ${100 - fraction}% ownership off-platform. Only ${fraction}% of the IP is offered for fractional tokenization on MatDAO.`
        : "100% of IP ownership is being offered for tokenization on the platform.",
    calculation_steps: [
      { step: 1, operation: "Full adjusted value (100%)", value: Math.round(fullAdjustedValue) },
      { step: 2, operation: "Tokenization fraction", value: `${fraction}%` },
      { step: 3, operation: "Listed tokenization value", value: Math.round(listed) },
      { step: 4, operation: "Retained off-platform", value: `${100 - fraction}%` },
    ],
    evidence: [{ type: "user_input", ref: "tokenization_fraction_slider", detail: `${fraction}% offered` }],
  }

  return {
    fullAdjustedValue,
    tokenizationFractionPct: fraction,
    listedTokenizationValue: listed,
    retainedOwnershipPct: 100 - fraction,
    hitlAudit: [...hitlAudit.filter((a) => a.amount_usd !== 0 || a.id === "hitl_final"), fractionAudit],
  }
}
