"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Upload,
  FileText,
  X,
  ArrowRight,
  Beaker,
  Info,
  Loader2,
} from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/context/auth-context"

/* ------------------------------------------------------------------ */
/*  Option data                                                        */
/* ------------------------------------------------------------------ */

const workingFields = [
  "Energy Storage",
  "Nanomaterials",
  "Biomaterials",
  "Polymers",
  "Ceramics",
  "Composites",
  "Metals & Alloys",
  "Semiconductors",
  "Catalysis",
  "Photovoltaics",
]

const partnerOptions = [
  "Industry Partner",
  "Academic Collaborator",
  "Government Lab",
  "Not Needed",
]

const licenseOptions = [
  "Open Source",
  "University License",
  "Exclusive License",
  "Pending",
]

const fundingOptions = [
  "< $10,000",
  "$10,000 - $50,000",
  "$50,000 - $100,000",
  "$100,000 - $250,000",
  "> $250,000",
]

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function SubmitProjectPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [trl, setTrl] = useState(2)
  const [fileName, setFileName] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFileName(selectedFile.name)
      setFile(selectedFile)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user) {
      setError("Please sign in to submit a project")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData(e.currentTarget)
      const title = formData.get("title") as string
      const institution = formData.get("institution") as string
      const email = formData.get("email") as string
      const workingField = formData.get("workingField") as string
      const partnerNeeded = formData.get("partnerNeeded") as string
      const license = formData.get("license") as string
      const fundingNeeded = formData.get("fundingNeeded") as string
      const mainObstacle = formData.get("mainObstacle") as string
      const whatProven = formData.get("whatProven") as string

      if (!title || !institution || !email || !workingField || !fundingNeeded || !mainObstacle || !whatProven) {
        setError("Please fill in all required fields")
        setLoading(false)
        return
      }

      // Create slug from title
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now()

      // Parse funding range
      let fundingGoal = 50000
      if (fundingNeeded.includes("< $10,000")) fundingGoal = 10000
      else if (fundingNeeded.includes("$10,000 - $50,000")) fundingGoal = 50000
      else if (fundingNeeded.includes("$50,000 - $100,000")) fundingGoal = 100000
      else if (fundingNeeded.includes("$100,000 - $250,000")) fundingGoal = 250000
      else if (fundingNeeded.includes("> $250,000")) fundingGoal = 500000

      // Insert project into Supabase with raising status for demo
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .insert({
          title,
          slug,
          researcher_id: user.id,
          trl,
          phase: 'raising', // Set to raising for demo scenario
          funding_goal: fundingGoal,
          funding_raised: 0,
          investors_count: 0,
          days_remaining: 60, // Default 60 days for demo
          is_raising: true, // Enable raising status
          description: [
            { key: 'institution', value: institution },
            { key: 'email', value: email },
            { key: 'workingField', value: workingField },
            { key: 'partnerNeeded', value: partnerNeeded },
            { key: 'license', value: license },
            { key: 'fundingNeeded', value: fundingNeeded },
          ],
          technical_specs: [
            { key: 'mainObstacle', value: mainObstacle },
            { key: 'whatProven', value: whatProven },
          ],
          market_applications: [],
          development_timeline: [],
          team: [],
          risk_factors: [],
          competitive_advantage: [],
          ip_status: { type: '', status: '', details: '' },
        })
        .select()
        .single()

      if (projectError) throw projectError

      // If file uploaded, upload to Pinata (simplified - just store metadata for now)
      if (file) {
        console.log('File uploaded:', file.name)
        // TODO: Implement actual file upload to Pinata
      }

      router.push(`/submit/milestone?projectId=${projectData.id}`)
    } catch (err) {
      console.error('Submission error:', err)
      setError(err instanceof Error ? err.message : 'Failed to submit project')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col">
      {/* ---- Hero header ---- */}
      <section className="border-b border-border/40 bg-card/50 px-4 py-14">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-primary/30 bg-primary/10">
            <Beaker className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {"Let\u2019s understand your research"}
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            This helps us match your project with the right milestone structure
            and connect you with funding opportunities in the MatDAO ecosystem.
          </p>
        </div>
      </section>

      {/* ---- Form ---- */}
      <section className="px-4 py-12">
        <div className="mx-auto w-full max-w-2xl">
          {error && (
            <div className="mb-6 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex flex-col gap-10">
            {/* ====== Section: Basic Info ====== */}
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold text-foreground">
                Basic Information
              </h2>
              <p className="text-xs text-muted-foreground">
                Tell us about your project and yourself.
              </p>
            </div>

            {/* Project Title */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">
                Project Title <span className="text-destructive">*</span>
              </label>
              <input
                name="title"
                type="text"
                required
                className="rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
                placeholder="e.g. Vertically Aligned Graphene Supercapacitor"
              />
            </div>

            {/* Institution & Email */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-foreground">
                  Institution <span className="text-destructive">*</span>
                </label>
                <input
                  name="institution"
                  type="text"
                  required
                  className="rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
                  placeholder="MIT, Stanford, etc."
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-foreground">
                  Email <span className="text-destructive">*</span>
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  className="rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
                  placeholder="you@university.edu"
                />
              </div>
            </div>

            {/* Working Field & Partner */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-foreground">
                  Working Field <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <select
                    name="workingField"
                    required
                    className="w-full appearance-none rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
                  >
                    <option value="">Select a field</option>
                    {workingFields.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-foreground">
                  Partner Needed
                </label>
                <div className="relative">
                  <select name="partnerNeeded" className="w-full appearance-none rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30">
                    <option value="">Select partner type</option>
                    {partnerOptions.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-border/40" />

            {/* ====== Section: Technical Details ====== */}
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold text-foreground">
                Technical Details
              </h2>
              <p className="text-xs text-muted-foreground">
                Describe your current research readiness and needs.
              </p>
            </div>

            {/* Current TRL */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-foreground">
                  Current TRL <span className="text-destructive">*</span>
                </label>
                <div className="group relative">
                  <Info className="h-3.5 w-3.5 text-muted-foreground" />
                  <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-56 -translate-x-1/2 rounded-lg border border-border bg-card p-2.5 text-xs leading-relaxed text-muted-foreground opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
                    Technology Readiness Level (1-9). TRL 1 = basic principles,
                    TRL 9 = market ready.
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <input
                  type="range"
                  min={1}
                  max={9}
                  value={trl}
                  onChange={(e) => setTrl(Number(e.target.value))}
                  className="mb-3 w-full accent-primary"
                />
                <div className="flex justify-between">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setTrl(n)}
                      className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium transition-colors ${
                        n === trl
                          ? "bg-primary text-primary-foreground"
                          : n <= trl
                          ? "bg-primary/20 text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* License & Funding */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-foreground">
                  License
                </label>
                <div className="relative">
                  <select name="license" className="w-full appearance-none rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30">
                    <option value="">Select license type</option>
                    {licenseOptions.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-foreground">
                  Funding Needed <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <select
                    name="fundingNeeded"
                    required
                    className="w-full appearance-none rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
                  >
                    <option value="">Select funding range</option>
                    {fundingOptions.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-border/40" />

            {/* ====== Section: Narrative ====== */}
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-semibold text-foreground">
                Research Narrative
              </h2>
              <p className="text-xs text-muted-foreground">
                Help reviewers understand your challenges and achievements.
              </p>
            </div>

            {/* Main Obstacle */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">
                Main Obstacle <span className="text-destructive">*</span>
              </label>
              <textarea
                name="mainObstacle"
                rows={4}
                required
                className="resize-none rounded-xl border border-border bg-card px-4 py-3 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
                placeholder="What is the primary technical or market challenge you face? (e.g. difficulty scaling from lab to pilot production)"
              />
            </div>

            {/* What you have proven */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">
                What you have proven? <span className="text-destructive">*</span>
              </label>
              <textarea
                name="whatProven"
                rows={4}
                required
                className="resize-none rounded-xl border border-border bg-card px-4 py-3 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
                placeholder="Describe your key results, published data, or validated prototypes so far."
              />
            </div>

            {/* PDF Upload */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">
                Supporting Document (PDF)
              </label>
              <input
                ref={fileRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleFile}
              />
              {fileName ? (
                <div className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="text-sm text-foreground">{fileName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFileName(null)
                      if (fileRef.current) fileRef.current.value = ""
                    }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-card py-10 transition-colors hover:border-primary/50 hover:bg-card/80"
                >
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Click to upload a PDF
                  </span>
                  <span className="text-xs text-muted-foreground/60">
                    Max 25 MB
                  </span>
                </button>
              )}
            </div>

            {/* Submit */}
            <div className="flex flex-col items-center gap-3 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating your milestones...
                  </>
                ) : (
                  <>
                    Create your milestones
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
              <p className="text-xs text-muted-foreground">
                You can save and return to this later.
              </p>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}
