import type {
  CombinedAssessmentReport,
  SubmittedMilestone,
  UserPlatformData,
  VerificationTask,
} from "./types"

const STORAGE_PREFIX = "matdao-platform-data"

function storageKey(userId: string) {
  return `${STORAGE_PREFIX}-${userId}`
}

function emptyData(): UserPlatformData {
  return { assessments: [], submittedMilestones: [], matchReports: [] }
}

export function loadUserData(userId: string): UserPlatformData {
  if (typeof window === "undefined") return emptyData()
  try {
    const raw = localStorage.getItem(storageKey(userId))
    if (!raw) return emptyData()
    return { ...emptyData(), ...JSON.parse(raw) }
  } catch {
    return emptyData()
  }
}

export function saveUserData(userId: string, data: UserPlatformData) {
  if (typeof window === "undefined") return
  localStorage.setItem(storageKey(userId), JSON.stringify(data))
}

export function addAssessment(userId: string, report: CombinedAssessmentReport) {
  const data = loadUserData(userId)
  data.assessments.unshift(report)
  saveUserData(userId, data)
}

export function addSubmittedMilestone(userId: string, milestone: SubmittedMilestone) {
  const data = loadUserData(userId)
  data.submittedMilestones.unshift(milestone)
  saveUserData(userId, data)
}

export function linkVerificationToMilestone(
  userId: string,
  milestoneId: string,
  verification: VerificationTask,
) {
  const data = loadUserData(userId)
  const milestone = data.submittedMilestones.find((m) => m.id === milestoneId)
  if (milestone) {
    milestone.verificationId = verification.id
  }
  saveUserData(userId, data)
}

export function addMatchReport(
  userId: string,
  entry: { id: string; name: string; report: string; createdAt: string },
) {
  const data = loadUserData(userId)
  data.matchReports.unshift(entry)
  saveUserData(userId, data)
}

export const MILESTONE_LABELS: Record<string, string> = {
  prototype: "Prototype",
  mvp: "MVP / Bench Asset",
  pilotTest: "Pilot Test",
  commercialization: "Commercialization",
}
