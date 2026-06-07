import { analyzeDocument } from "./api"
import type { AnalysisReport, DueDiligenceDimension, DueDiligenceReport } from "./types"

const DIMENSION_DEFS = [
  { id: 1, name: "Evidence Quality", layer: "extraction" as const, weight: 12, keywords: ["abstract", "results", "data", "figure", "table"] },
  { id: 2, name: "Methodological Rigor", layer: "extraction" as const, weight: 12, keywords: ["method", "protocol", "control", "statistical", "sample size"] },
  { id: 3, name: "Reproducibility", layer: "extraction" as const, weight: 10, keywords: ["reproduc", "replicat", "dataset", "code", "supplementary"] },
  { id: 4, name: "Novelty & Originality", layer: "enrichment" as const, weight: 14, keywords: ["novel", "first", "unprecedented", "breakthrough", "innovative"] },
  { id: 5, name: "Publication Status", layer: "enrichment" as const, weight: 10, keywords: ["peer-review", "journal", "published", "preprint", "arxiv"] },
  { id: 6, name: "Team Credibility", layer: "enrichment" as const, weight: 10, keywords: ["university", "institute", "phd", "professor", "laboratory"] },
  { id: 7, name: "Market Viability", layer: "enrichment" as const, weight: 12, keywords: ["commercial", "market", "industry", "application", "scale"] },
  { id: 8, name: "Regulatory Risk", layer: "enrichment" as const, weight: 10, keywords: ["fda", "regulat", "compliance", "safety", "ethical"] },
  { id: 9, name: "Research Integrity", layer: "integrity" as const, weight: 10, keywords: ["conflict", "fabricat", "plagiar", "retracted", "misconduct"] },
]

function clampScore(value: number): number {
  return Math.round(Math.min(10, Math.max(0, value)) * 10) / 10
}

function finalizeReport(
  documentName: string,
  wordCount: number,
  dimensions: DueDiligenceDimension[],
  source: "engine" | "client",
): DueDiligenceReport {
  const integrityDim = dimensions.find((d) => d.id === 9)!
  const integrityGateTriggered = integrityDim.score <= 1

  let totalScore: number
  if (integrityGateTriggered) {
    totalScore = 0
  } else {
    totalScore = dimensions.reduce((sum, d) => sum + (d.score / d.maxScore) * d.weight, 0)
  }

  const maxTotalScore = DIMENSION_DEFS.reduce((sum, d) => sum + d.weight, 0)

  let investmentTier: DueDiligenceReport["investmentTier"]
  if (integrityGateTriggered || totalScore < 40) {
    investmentTier = "fail"
  } else if (totalScore < 65) {
    investmentTier = "review"
  } else {
    investmentTier = "pass"
  }

  return {
    documentName,
    wordCount,
    dimensions,
    totalScore: Math.round(totalScore * 10) / 10,
    maxTotalScore,
    integrityGateTriggered,
    investmentTier,
    timestamp: Date.now(),
    analysisSource: source,
    layers: {
      layer1: source === "engine"
        ? "PatentSBERTa NLP extraction + IPC/CPC classification"
        : "Client-side text extraction (backend offline)",
      layer2: source === "engine"
        ? "Patent corpus enrichment + FTO overlap analysis"
        : "Keyword signal enrichment",
      integrityGate: "Dim9 ≤ 1 forces total score to 0",
    },
  }
}

/** Derive 9-dimension scores from a real matdao-ip-engine AnalysisReport */
export function deriveDueDiligenceFromAnalysis(
  report: AnalysisReport,
  documentName: string,
): DueDiligenceReport {
  const profile = report.document_profile
  const stats = report.document_stats
  const wordCount = profile?.word_count ?? Math.round(
    (stats.abstract_chars + stats.methodology_chars + stats.claims_chars) / 5,
  )

  const sections = profile?.sections_found ?? []
  const parsingConfidence = profile?.parsing_confidence ?? 0.5

  const dimensions: DueDiligenceDimension[] = [
    {
      id: 1,
      name: "Evidence Quality",
      score: clampScore(parsingConfidence * 10 + sections.length * 0.8),
      maxScore: 10,
      weight: 12,
      layer: "extraction",
      evidence: [
        `Parsing confidence: ${(parsingConfidence * 100).toFixed(0)}%`,
        `Sections found: ${sections.length > 0 ? sections.join(", ") : "none"}`,
        `Document type: ${profile?.document_type?.replace(/_/g, " ") ?? "unknown"}`,
      ],
    },
    {
      id: 2,
      name: "Methodological Rigor",
      score: clampScore(stats.methodology_chars / 200 + (sections.includes("methods") ? 3 : 0)),
      maxScore: 10,
      weight: 12,
      layer: "extraction",
      evidence: [
        `Methodology section: ${stats.methodology_chars} chars`,
        sections.includes("methods") ? "Methods section detected" : "No methods section found",
      ],
    },
    {
      id: 3,
      name: "Reproducibility",
      score: clampScore(
        (sections.includes("results") ? 4 : 1) +
        (stats.claims_chars > 100 ? 3 : 0) +
        parsingConfidence * 2,
      ),
      maxScore: 10,
      weight: 10,
      layer: "extraction",
      evidence: [
        `Results/outcomes: ${stats.claims_chars} chars`,
        profile?.supports_tokenization ? "Sufficient detail for tokenization" : "Limited outcome detail",
      ],
    },
    {
      id: 4,
      name: "Novelty & Originality",
      score: clampScore(report.originality.originality_premium_s * 30 + (1 - report.originality.max_cosine_similarity) * 5),
      maxScore: 10,
      weight: 14,
      layer: "enrichment",
      evidence: [
        `Originality premium: +${(report.originality.originality_premium_s * 100).toFixed(1)}%`,
        `Max patent similarity: ${(report.originality.max_cosine_similarity * 100).toFixed(1)}%`,
        `Corpus: ${report.originality.patent_corpus_size ?? 0} patents indexed`,
      ],
    },
    {
      id: 5,
      name: "Publication Status",
      score: clampScore(parsingConfidence * 6 + (stats.abstract_chars > 200 ? 3 : 1)),
      maxScore: 10,
      weight: 10,
      layer: "enrichment",
      evidence: [
        `Abstract: ${stats.abstract_chars} chars`,
        `Classification confidence: ${(report.classification.classification_confidence * 100).toFixed(0)}%`,
      ],
    },
    {
      id: 6,
      name: "Team Credibility",
      score: clampScore(report.classification.classification_confidence * 7 + 2),
      maxScore: 10,
      weight: 10,
      layer: "enrichment",
      evidence: [
        `Sector: ${report.classification.sector_name}`,
        `IPC ${report.classification.ipc_primary} · NACE ${report.classification.nace_code}`,
      ],
    },
    {
      id: 7,
      name: "Market Viability",
      score: clampScore(
        (report.valuation.v_baseline_usd > 1_000_000 ? 6 : 4) +
        report.originality.originality_premium_s * 10,
      ),
      maxScore: 10,
      weight: 12,
      layer: "enrichment",
      evidence: [
        `Sector baseline: $${(report.valuation.v_baseline_usd / 1_000_000).toFixed(1)}M`,
        `V_target: $${(report.valuation.v_target_usd / 1_000_000).toFixed(2)}M`,
      ],
    },
    {
      id: 8,
      name: "Regulatory & FTO Risk",
      score: clampScore(10 - report.fto.r_fto * 20 - (report.fto.expert_consultation_required ? 3 : 0)),
      maxScore: 10,
      weight: 10,
      layer: "enrichment",
      evidence: [
        `FTO risk haircut: −${(report.fto.r_fto * 100).toFixed(1)}%`,
        `${report.fto.flagged_patent_count} flagged patents`,
        report.fto.expert_consultation_required ? "Attorney consultation recommended" : "No critical FTO flags",
      ],
    },
    {
      id: 9,
      name: "Research Integrity",
      score: clampScore(
        parsingConfidence < 0.2 ? 0 :
        parsingConfidence < 0.35 ? 1 :
        7 + parsingConfidence * 2,
      ),
      maxScore: 10,
      weight: 10,
      layer: "integrity",
      evidence: [
        parsingConfidence < 0.35
          ? "Low parsing confidence — possible integrity or format issue"
          : "No integrity flags in extracted content",
        profile?.note ?? "Processed via IP Engine pipeline",
      ],
    },
  ]

  return finalizeReport(documentName, wordCount, dimensions, "engine")
}

function countKeywordHits(text: string, keywords: string[]): number {
  const lower = text.toLowerCase()
  return keywords.filter((kw) => lower.includes(kw)).length
}

function scoreDimensionFromText(text: string, def: (typeof DIMENSION_DEFS)[0], wordCount: number): DueDiligenceDimension {
  const hits = countKeywordHits(text, def.keywords)
  const lengthFactor = Math.min(1, wordCount / 800)
  let score: number

  if (def.id === 9) {
    const integrityFlags = ["fabricat", "plagiar", "retracted", "misconduct", "conflict of interest"]
    const hasFlag = integrityFlags.some((f) => text.toLowerCase().includes(f))
    score = hasFlag ? 0 : Math.min(10, 6 + hits * 1.5 + lengthFactor * 2)
  } else {
    score = Math.min(10, 3 + hits * 1.8 + lengthFactor * 3)
  }

  const evidence: string[] = []
  if (hits > 0) evidence.push(`${hits} relevant signal${hits > 1 ? "s" : ""} detected in text`)
  if (wordCount > 500) evidence.push(`Document length: ${wordCount} words`)
  if (def.id === 9 && score === 0) evidence.push("Integrity concern detected — Dim9 gate triggered")

  return {
    id: def.id,
    name: def.name,
    score: Math.round(score * 10) / 10,
    maxScore: 10,
    weight: def.weight,
    evidence: evidence.length > 0 ? evidence : ["Limited signals — manual review recommended"],
    layer: def.layer,
  }
}

function scoreTextDueDiligence(text: string, documentName: string): DueDiligenceReport {
  const wordCount = text.split(/\s+/).filter(Boolean).length
  const dimensions = DIMENSION_DEFS.map((def) => scoreDimensionFromText(text, def, wordCount))
  return finalizeReport(documentName, wordCount, dimensions, "client")
}

export async function analyzeDueDiligence(file: File): Promise<DueDiligenceReport> {
  const name = file.name.toLowerCase()
  const needsEngine = name.endsWith(".pdf") || name.endsWith(".docx")

  if (needsEngine) {
    const report = await analyzeDocument(file)
    return deriveDueDiligenceFromAnalysis(report, file.name)
  }

  try {
    const report = await analyzeDocument(file)
    return deriveDueDiligenceFromAnalysis(report, file.name)
  } catch {
    const text = await file.text()
    if (!text.trim()) {
      throw new Error(
        "Could not read file content. For PDF/DOCX files, start the IP Engine backend first.",
      )
    }
    return scoreTextDueDiligence(text, file.name)
  }
}

export function getInvestmentTierLabel(tier: DueDiligenceReport["investmentTier"]): string {
  switch (tier) {
    case "pass": return "Investment Ready"
    case "review": return "Further Review Required"
    case "fail": return "Does Not Pass Integrity Gate"
  }
}
