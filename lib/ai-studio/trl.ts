import { analyzeDocument } from "./api"
import type { AnalysisReport } from "./types"
import type { ProjectMilestones, TrlProject } from "../trl-services/types"

export interface TrlReport {
  documentName: string
  trl: number
  trlSummary: string
  accomplishments: string[]
  potentialPartnership: string
  innovationScore: number
  milestones: ProjectMilestones
  sectorName: string
  analysisSource: "engine" | "client"
  timestamp: number
}

function mapMilestonesFromEngine(
  raw: NonNullable<AnalysisReport["trl_evaluation"]>["milestones"],
): ProjectMilestones {
  return {
    prototype: {
      status: raw.prototype.status,
      description: raw.prototype.description,
      timeline: raw.prototype.timeline,
    },
    mvp: {
      status: raw.mvp.status,
      description: raw.mvp.description,
      timeline: raw.mvp.timeline,
    },
    pilotTest: {
      status: raw.pilot_test.status,
      description: raw.pilot_test.description,
      timeline: raw.pilot_test.timeline,
    },
    commercialization: {
      status: raw.commercialization.status,
      description: raw.commercialization.description,
      timeline: raw.commercialization.timeline,
    },
  }
}

/** Derive TRL report from matdao-ip-engine AnalysisReport (same pattern as due diligence). */
export function deriveTrlFromAnalysis(report: AnalysisReport, documentName: string): TrlReport {
  const trl = report.trl_evaluation
  if (!trl) {
    throw new Error("TRL evaluation missing from engine response")
  }

  return {
    documentName,
    trl: trl.trl,
    trlSummary: trl.trl_summary,
    accomplishments: trl.accomplishments,
    potentialPartnership: trl.potential_partnership,
    innovationScore: trl.innovation_score,
    milestones: mapMilestonesFromEngine(trl.milestones),
    sectorName: trl.sector_name,
    analysisSource: "engine",
    timestamp: Date.now(),
  }
}

export function trlReportToProject(report: TrlReport, title?: string, author?: string): TrlProject {
  const name = title || report.documentName.replace(/\.[^.]+$/, "")
  return {
    id: `proj-${Date.now()}`,
    title: name,
    author: author || "Independent Researcher",
    category: report.sectorName,
    abstract: report.trlSummary.slice(0, 250),
    trl: report.trl,
    trlSummary: report.trlSummary,
    accomplishments: report.accomplishments,
    potentialPartnership: report.potentialPartnership,
    milestones: report.milestones,
    score: report.innovationScore,
    createdAt: new Date().toISOString(),
    logo: "composite",
  }
}

function scoreTextTrl(text: string, documentName: string): TrlReport {
  const lower = text.toLowerCase()
  let trl = 3
  if (/production|commercial|certified|market/i.test(lower)) trl = 8
  else if (/pilot|operational|field test/i.test(lower)) trl = 6
  else if (/prototype|functional|bench/i.test(lower)) trl = 4
  else if (/theory|simulated|modeling/i.test(lower)) trl = 2

  const milestones: ProjectMilestones = {
    prototype: {
      status: trl >= 4 ? "completed" : "current",
      description: "Bench-scale prototype validation.",
      timeline: trl >= 4 ? "Completed" : "Target Q4 2026",
    },
    mvp: {
      status: trl >= 6 ? "completed" : trl >= 4 ? "current" : "future",
      description: "Integrated MVP for partner testing.",
      timeline: trl >= 6 ? "Completed" : "Target Q2 2027",
    },
    pilotTest: {
      status: trl >= 8 ? "completed" : trl === 7 ? "current" : "future",
      description: "Operational pilot deployment.",
      timeline: trl >= 8 ? "Completed" : "Target Q1 2028",
    },
    commercialization: {
      status: trl === 9 ? "completed" : trl === 8 ? "current" : "future",
      description: "Commercial scale-up and licensing.",
      timeline: trl === 9 ? "Completed" : "Target Q4 2028",
    },
  }

  return {
    documentName,
    trl,
    trlSummary: `Estimated TRL ${trl} from document text signals (offline client scoring).`,
    accomplishments: ["Document parsed for TRL keyword signals."],
    potentialPartnership: "Seeking partners aligned with current TRL stage.",
    innovationScore: 40 + trl * 6,
    milestones,
    sectorName: "Deep Tech",
    analysisSource: "client",
    timestamp: Date.now(),
  }
}

export async function analyzeTrl(file: File): Promise<TrlReport> {
  try {
    const report = await analyzeDocument(file)
    return deriveTrlFromAnalysis(report, file.name)
  } catch {
    const text = await file.text()
    if (!text.trim()) {
      throw new Error(
        "Could not read file content. For PDF/DOCX files, start the IP Engine backend first.",
      )
    }
    return scoreTextTrl(text, file.name)
  }
}
