export interface Milestone {
  status: "completed" | "current" | "future"
  description: string
  timeline: string
}

export interface ProjectMilestones {
  prototype: Milestone
  mvp: Milestone
  pilotTest: Milestone
  commercialization: Milestone
}

export interface TrlProject {
  id: string
  title: string
  author: string
  category: string
  abstract: string
  trl: number
  trlSummary: string
  accomplishments: string[]
  potentialPartnership: string
  milestones: ProjectMilestones
  score: number
  createdAt: string
  logo: "battery" | "carbon" | "ai" | "chitin" | "shield" | "turbine" | "composite"
}

export interface ResearcherProfile {
  id: string
  name: string
  title: string
  institution: string
  skills: string[]
  bio: string
  synergyNeeds: string
  type: "academic" | "entrepreneur" | "engineer" | "investor"
}

export interface VerificationTask {
  id: string
  title: string
  milestoneName: string
  projectId: string
  projectTitle: string
  proofText: string
  submittedBy: string
  submittedAt: string
  aiPassed: boolean
  aiPlagiarismScore: number
  aiConsistencyReport: string
  humanVoted: boolean
  humanPassed?: boolean
  humanNotes?: string
  status: "pending" | "verified" | "rejected" | "flagged"
}

export interface SubmittedMilestone {
  id: string
  projectId: string
  projectTitle: string
  milestoneKey: keyof ProjectMilestones
  milestoneLabel: string
  description: string
  timeline: string
  status: Milestone["status"]
  submittedAt: string
  submittedBy: string
  verificationId?: string
}

export interface CombinedAssessmentReport {
  id: string
  title: string
  author: string
  category: string
  createdAt: string
  trlProject: TrlProject
  ipReport?: import("../ai-studio/types").AnalysisReport
  dueDiligenceReport?: import("../ai-studio/types").DueDiligenceReport
  summary: {
    trl: number
    ipScore: number
    valuationUsd: number | null
    dueDiligenceScore: number | null
    investmentTier: string | null
    recommendedNextSteps: string[]
  }
}

export interface UserPlatformData {
  assessments: CombinedAssessmentReport[]
  submittedMilestones: SubmittedMilestone[]
  matchReports: Array<{ id: string; name: string; report: string; createdAt: string }>
}
