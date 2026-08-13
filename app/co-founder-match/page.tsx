"use client"

import { useEffect, useState } from "react"
import { Send, UserPlus, Users } from "lucide-react"
import { MarkdownReport } from "@/components/trl-services/MarkdownReport"
import { TrlBackendStatus } from "@/components/trl-services/TrlBackendStatus"
import { useAuth } from "@/context/auth-context"
import { fetchResearchers, submitCofounderMatch } from "@/lib/trl-services/api"
import { addMatchReport } from "@/lib/trl-services/storage"
import type { ResearcherProfile } from "@/lib/trl-services/types"

export default function CofounderMatchPage() {
  const { user } = useAuth()
  const [researchers, setResearchers] = useState<ResearcherProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [matchReport, setMatchReport] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [name, setName] = useState(user?.name || "")
  const [title, setTitle] = useState("")
  const [institution, setInstitution] = useState(user?.university || "")
  const [skills, setSkills] = useState("")
  const [bio, setBio] = useState("")
  const [synergyNeeds, setSynergyNeeds] = useState("")
  const [type, setType] = useState<ResearcherProfile["type"]>("academic")

  useEffect(() => {
    fetchResearchers()
      .then(setResearchers)
      .catch(() => setResearchers([]))
      .finally(() => setLoading(false))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !synergyNeeds) {
      setError("Name and synergy goals are required.")
      return
    }
    setSubmitting(true)
    setError(null)
    setMatchReport(null)
    try {
      const data = await submitCofounderMatch({ name, title, institution, skills, bio, synergyNeeds, type })
      setMatchReport(data.matchReport)
      if (user) {
        addMatchReport(user.id, {
          id: data.profile.id,
          name: data.profile.name,
          report: data.matchReport,
          createdAt: new Date().toISOString(),
        })
      }
      setResearchers((prev) => [data.profile, ...prev])
      setSynergyNeeds("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Matching failed")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-[calc(100dvh-4rem)] px-5 py-12 sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/16 via-black/26 to-black/56" />
      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#6efcff]/35 bg-[#6efcff]/10 px-4 py-1 text-[11px] uppercase tracking-[0.18em] text-[#c5fdff]">
            <Users className="h-3.5 w-3.5" />
            Co-Founder Matching
          </p>
          <h1 className="font-headline mb-2 text-3xl font-extrabold text-white/95">Find Your Research Partner</h1>
          <p className="max-w-2xl text-sm text-white/60">
            AI-powered matching against portfolio projects and researcher profiles on the MatDAO platform.
          </p>
          <div className="mt-4">
            <TrlBackendStatus />
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <form onSubmit={handleSubmit} className="workflow-panel space-y-4 rounded-2xl p-6">
            <h2 className="flex items-center gap-2 font-headline text-lg font-bold text-white/95">
              <UserPlus className="h-5 w-5 text-[#6efcff]" />
              Your Profile
            </h2>
            <input
              className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white placeholder:text-white/30"
              placeholder="Full name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white placeholder:text-white/30"
              placeholder="Title / Role"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white placeholder:text-white/30"
              placeholder="Institution"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
            />
            <input
              className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white placeholder:text-white/30"
              placeholder="Skills (comma-separated)"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
            <select
              className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white"
              value={type}
              onChange={(e) => setType(e.target.value as ResearcherProfile["type"])}
            >
              <option value="academic">Academic</option>
              <option value="entrepreneur">Entrepreneur</option>
              <option value="engineer">Engineer</option>
              <option value="investor">Investor</option>
            </select>
            <textarea
              className="min-h-[80px] w-full rounded-lg border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white placeholder:text-white/30"
              placeholder="Short bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
            <textarea
              className="min-h-[100px] w-full rounded-lg border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white placeholder:text-white/30"
              placeholder="What synergy or partnership are you seeking? *"
              value={synergyNeeds}
              onChange={(e) => setSynergyNeeds(e.target.value)}
              required
            />
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-full bg-[#6efcff]/20 px-6 py-2.5 text-sm font-semibold text-[#c5fdff] transition-colors hover:bg-[#6efcff]/30 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              {submitting ? "Matching..." : "Find Matches"}
            </button>
          </form>

          <div className="space-y-6">
            {matchReport && (
              <div className="workflow-panel rounded-2xl p-6">
                <h2 className="mb-4 font-headline text-lg font-bold text-white/95">Match Report</h2>
                <MarkdownReport content={matchReport} />
              </div>
            )}

            <div className="workflow-panel rounded-2xl p-6">
              <h2 className="mb-4 font-headline text-lg font-bold text-white/95">Platform Researchers</h2>
              {loading ? (
                <p className="text-sm text-white/50">Loading...</p>
              ) : (
                <div className="max-h-[400px] space-y-3 overflow-y-auto">
                  {researchers.map((r) => (
                    <div key={r.id} className="rounded-lg border border-white/10 bg-black/20 p-4">
                      <h3 className="text-sm font-semibold text-white/90">{r.name}</h3>
                      <p className="text-xs text-white/50">
                        {r.title} · {r.institution}
                      </p>
                      <p className="mt-2 text-xs text-white/55">{r.synergyNeeds}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
