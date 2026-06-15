"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  Plus,
  Check,
  ChevronDown,
  ChevronUp,
  Trash2,
  Beaker,
  FlaskConical,
  DollarSign,
  ShieldAlert,
  Scaling,
  Building2,
  CircleAlert,
  RotateCcw,
  BarChart3,
  FileCheck,
  Leaf,
  Gavel,
  Shield,
  Target,
  ExternalLink,
} from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { fetchVerifications } from "@/lib/trl-services/api"
import { loadUserData } from "@/lib/trl-services/storage"
import type { SubmittedMilestone, VerificationTask } from "@/lib/trl-services/types"

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface MilestoneData {
  id: number
  title: string
  proving: string[]
  description: string
  budget: string
  duration: string
  riskCategory: string[]
}

const provingOptions = [
  { label: "Reproducibility", icon: RotateCcw },
  { label: "Performance", icon: BarChart3 },
  { label: "Cost validation", icon: FileCheck },
  { label: "Scale-up feasibility", icon: Scaling },
  { label: "Regulatory", icon: Gavel },
]

const durationOptions = [
  "4 Weeks",
  "6 Weeks",
  "8 Weeks",
  "10 Weeks",
  "12 Weeks",
  "16 Weeks",
  "20 Weeks",
  "24 Weeks",
]

const riskOptions = [
  { label: "Technical", icon: ShieldAlert },
  { label: "Scale", icon: Scaling },
  { label: "Market", icon: Building2 },
  { label: "IP", icon: CircleAlert },
]

const trlSteps = [
  { trl: "TRL 4", label: "In Progress", status: "active" },
  { trl: "TRL 5", label: "Next Target", status: "upcoming" },
  { trl: "TRL 6", label: "Future Plan", status: "future" },
]

const trlTemplates: Record<string, { budget: string; duration: string }> = {
  "TRL 4": { budget: "$35k to $50k", duration: "8-12 weeks" },
  "TRL 5": { budget: "$50k to $120k", duration: "12-20 weeks" },
  "TRL 6": { budget: "$120k to $250k", duration: "16-24 weeks" },
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function MilestoneBuilderPage() {
  const { user } = useAuth()
  const [recommendedMilestones, setRecommendedMilestones] = useState<SubmittedMilestone[]>([])
  const [auditorResults, setAuditorResults] = useState<VerificationTask[]>([])

  useEffect(() => {
    if (user) {
      const data = loadUserData(user.id)
      setRecommendedMilestones(data.submittedMilestones)
    }
    fetchVerifications()
      .then(setAuditorResults)
      .catch(() => setAuditorResults([]))
  }, [user])

  const [milestones, setMilestones] = useState<MilestoneData[]>([
    {
      id: 1,
      title: "Lab Reproducibility Test",
      proving: ["Reproducibility"],
      description: "",
      budget: "40000",
      duration: "8 Weeks",
      riskCategory: ["Technical"],
    },
  ])
  const [expandedId, setExpandedId] = useState<number | null>(1)

  const addMilestone = () => {
    const newId = milestones.length > 0 ? Math.max(...milestones.map((m) => m.id)) + 1 : 1
    setMilestones([
      ...milestones,
      {
        id: newId,
        title: "",
        proving: [],
        description: "",
        budget: "",
        duration: "8 Weeks",
        riskCategory: [],
      },
    ])
    setExpandedId(newId)
  }

  const updateMilestone = (id: number, updates: Partial<MilestoneData>) => {
    setMilestones(milestones.map((m) => (m.id === id ? { ...m, ...updates } : m)))
  }

  const toggleArrayItem = (
    id: number,
    field: "proving" | "riskCategory",
    item: string,
    maxItems?: number
  ) => {
    const milestone = milestones.find((m) => m.id === id)
    if (!milestone) return
    const current = milestone[field]
    if (current.includes(item)) {
      updateMilestone(id, { [field]: current.filter((i) => i !== item) })
    } else if (!maxItems || current.length < maxItems) {
      updateMilestone(id, { [field]: [...current, item] })
    }
  }

  const removeMilestone = (id: number) => {
    setMilestones(milestones.filter((m) => m.id !== id))
    if (expandedId === id) setExpandedId(null)
  }

  return (
    <div className="flex flex-col">
      {/* ---- Hero ---- */}
      <section className="border-b border-border/40 bg-card/50 px-4 py-14">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-accent/30 bg-accent/10">
            <FlaskConical className="h-6 w-6 text-accent" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Milestone Builder
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
            Outline your validation milestones to de-risk your research
            step-by-step. Unlock funding as you progress through TRL stages.
          </p>
        </div>
      </section>

      {/* ---- AI-Recommended Milestones & Auditor Results ---- */}
      {(recommendedMilestones.length > 0 || auditorResults.length > 0) && (
        <section className="border-b border-border/40 bg-secondary/20 px-4 py-10">
          <div className="mx-auto max-w-3xl space-y-8">
            {recommendedMilestones.length > 0 && (
              <div>
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                  <Target className="h-5 w-5 text-primary" />
                  Recommended Next Steps
                </h2>
                <p className="mb-4 text-xs text-muted-foreground">
                  From your Project Assessment report — submit proofs via the AI Auditor.
                </p>
                <div className="space-y-3">
                  {recommendedMilestones.map((m) => (
                    <div
                      key={m.id}
                      className="rounded-xl border border-border/60 bg-card p-4"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-foreground">{m.milestoneLabel}</span>
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[10px] capitalize text-primary">
                          {m.status}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{m.projectTitle}</p>
                      <p className="mt-2 text-sm text-foreground/80">{m.description}</p>
                      <p className="mt-1 font-mono text-[10px] text-muted-foreground">{m.timeline}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {auditorResults.length > 0 && (
              <div>
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                  <Shield className="h-5 w-5 text-accent" />
                  AI Auditor Results
                </h2>
                <div className="space-y-3">
                  {auditorResults.slice(0, 5).map((task) => (
                    <div
                      key={task.id}
                      className="rounded-xl border border-border/60 bg-card p-4"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-medium text-foreground">{task.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {task.projectTitle} · {task.milestoneName}
                          </p>
                        </div>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                            task.aiPassed
                              ? "bg-accent/15 text-accent"
                              : "bg-destructive/15 text-destructive"
                          }`}
                        >
                          AI {task.aiPassed ? "Pass" : "Flagged"}
                        </span>
                      </div>
                      <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                        {task.aiConsistencyReport.replace(/[#*]/g, "").slice(0, 200)}...
                      </p>
                    </div>
                  ))}
                </div>
                <Link
                  href="/ai-auditor"
                  className="mt-3 inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  Submit new proof <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ---- TRL Progress Stepper ---- */}
      <section className="px-4 py-10">
        <div className="mx-auto max-w-xl">
          <div className="flex items-start justify-between">
            {trlSteps.map((step, index) => (
              <div key={step.trl} className="flex flex-1 flex-col items-center">
                {/* Top: circle + connector */}
                <div className="flex w-full items-center">
                  {/* Left connector */}
                  {index > 0 && (
                    <div
                      className={`h-0.5 flex-1 ${
                        step.status === "active"
                          ? "bg-primary"
                          : "bg-border/60"
                      }`}
                    />
                  )}
                  {index === 0 && <div className="flex-1" />}

                  {/* Circle */}
                  <div
                    className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                      step.status === "active"
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                        : "border-2 border-border bg-background text-muted-foreground"
                    }`}
                  >
                    {index + 1}
                  </div>

                  {/* Right connector */}
                  {index < trlSteps.length - 1 && (
                    <div className="h-0.5 flex-1 bg-border/60" />
                  )}
                  {index === trlSteps.length - 1 && <div className="flex-1" />}
                </div>

                {/* Labels */}
                <p className="mt-2 text-sm font-semibold text-foreground">
                  {step.trl}
                </p>
                <p
                  className={`text-xs ${
                    step.status === "active"
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Milestones ---- */}
      <section className="px-4 pb-20">
        <div className="mx-auto flex max-w-2xl flex-col gap-5">
          {milestones.map((milestone, mIndex) => {
            const isExpanded = expandedId === milestone.id
            return (
              <div
                key={milestone.id}
                className="overflow-hidden rounded-xl border border-border/50 bg-card/60 shadow-sm"
              >
                {/* ---- Header ---- */}
                <button
                  type="button"
                  onClick={() =>
                    setExpandedId(isExpanded ? null : milestone.id)
                  }
                  className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-secondary/20"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${
                        mIndex === 0
                          ? "bg-primary/20 text-primary"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {milestone.id}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {milestone.title || "New Milestone"}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>TRL 4</span>
                        <span className="text-border">|</span>
                        <span>
                          {mIndex === 0 ? "In Progress" : "Draft"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {mIndex === 0 && (
                      <>
                        <span className="rounded-full border border-accent/30 bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
                          TRL 4
                        </span>
                        <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                          In Progress
                        </span>
                      </>
                    )}
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {/* ---- Expanded Content ---- */}
                {isExpanded && (
                  <div className="border-t border-border/40 px-5 py-6">
                    <div className="flex flex-col gap-6">
                      {/* Title */}
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-foreground">
                          Milestone Title
                        </label>
                        <input
                          type="text"
                          value={milestone.title}
                          onChange={(e) =>
                            updateMilestone(milestone.id, {
                              title: e.target.value,
                            })
                          }
                          className="rounded-xl border border-border bg-secondary/30 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
                          placeholder="Enter milestone title"
                        />
                      </div>

                      {/* What are you proving */}
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-foreground">
                          What are you proving?
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {provingOptions.map((option) => {
                            const Icon = option.icon
                            const isSelected = milestone.proving.includes(
                              option.label
                            )
                            return (
                              <button
                                key={option.label}
                                type="button"
                                onClick={() =>
                                  toggleArrayItem(
                                    milestone.id,
                                    "proving",
                                    option.label,
                                    2
                                  )
                                }
                                className={`flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-medium transition-all ${
                                  isSelected
                                    ? "border-accent bg-accent/15 text-accent shadow-sm shadow-accent/10"
                                    : "border-border bg-card text-muted-foreground hover:border-border/80 hover:text-foreground"
                                }`}
                              >
                                {isSelected ? (
                                  <Check className="h-3.5 w-3.5" />
                                ) : (
                                  <Icon className="h-3.5 w-3.5" />
                                )}
                                {option.label}
                              </button>
                            )
                          })}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Select up to 2 categories
                        </p>
                      </div>

                      {/* Description */}
                      <div className="flex flex-col gap-2">
                        <textarea
                          rows={3}
                          value={milestone.description}
                          onChange={(e) =>
                            updateMilestone(milestone.id, {
                              description: e.target.value,
                            })
                          }
                          className="resize-none rounded-xl border border-border bg-secondary/30 px-4 py-3 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
                          placeholder="E.g. Reproduce supercapacitor performance in 3 independent lab tests within +/-10% variance"
                        />
                        <p className="text-xs text-muted-foreground">
                          TRL 4 milestone template: {trlTemplates["TRL 4"].budget}
                        </p>
                      </div>

                      {/* Budget & Duration */}
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="flex flex-col gap-2">
                          <label className="text-sm font-medium text-foreground">
                            Budget Needed
                          </label>
                          <div className="flex items-center overflow-hidden rounded-xl border border-border bg-secondary/30 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/30">
                            <span className="flex items-center justify-center border-r border-border bg-muted/30 px-3 py-2.5">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </span>
                            <input
                              type="text"
                              value={milestone.budget}
                              onChange={(e) =>
                                updateMilestone(milestone.id, {
                                  budget: e.target.value,
                                })
                              }
                              className="w-full bg-transparent px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                              placeholder="40,000"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-sm font-medium text-foreground">
                            Duration
                          </label>
                          <div className="relative">
                            <select
                              value={milestone.duration}
                              onChange={(e) =>
                                updateMilestone(milestone.id, {
                                  duration: e.target.value,
                                })
                              }
                              className="w-full appearance-none rounded-xl border border-border bg-secondary/30 px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
                            >
                              {durationOptions.map((d) => (
                                <option key={d} value={d}>
                                  {d}
                                </option>
                              ))}
                            </select>
                            <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                              <ChevronDown className="h-4 w-4" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        TRL 4 milestone template: {trlTemplates["TRL 4"].duration}
                      </p>

                      {/* Risk Category */}
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-foreground">
                          Risk Category
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {riskOptions.map((option) => {
                            const Icon = option.icon
                            const isSelected = milestone.riskCategory.includes(
                              option.label
                            )
                            return (
                              <button
                                key={option.label}
                                type="button"
                                onClick={() =>
                                  toggleArrayItem(
                                    milestone.id,
                                    "riskCategory",
                                    option.label
                                  )
                                }
                                className={`flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-medium transition-all ${
                                  isSelected
                                    ? "border-accent bg-accent/15 text-accent shadow-sm shadow-accent/10"
                                    : "border-border bg-card text-muted-foreground hover:border-border/80 hover:text-foreground"
                                }`}
                              >
                                {isSelected ? (
                                  <Check className="h-3.5 w-3.5" />
                                ) : (
                                  <Icon className="h-3.5 w-3.5" />
                                )}
                                {option.label}
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => removeMilestone(milestone.id)}
                          className="flex items-center gap-2 rounded-full border border-border px-5 py-2 text-sm text-muted-foreground transition-colors hover:border-destructive/50 hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => setExpandedId(null)}
                          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-accent/80 to-primary/80 px-5 py-2 text-sm font-medium text-foreground shadow-sm transition-opacity hover:opacity-90"
                        >
                          <Plus className="h-4 w-4" />
                          Add Milestone
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}

          {/* Add Milestone button */}
          <button
            type="button"
            onClick={addMilestone}
            className="flex items-center gap-2 rounded-xl border border-dashed border-border p-5 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:bg-card/40 hover:text-foreground"
          >
            <Plus className="h-4 w-4" />
            Add Milestone
          </button>

          {/* Submit CTA */}
          <div className="mt-6 flex flex-col items-center gap-3">
            <button
              type="button"
              className="rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Submit All Milestones
            </button>
            <p className="text-xs text-muted-foreground">
              Your milestones will be reviewed by the MatDAO committee.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
