"use client"

import { useState } from "react"
import { 
  FileText, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Plus,
  Download,
  Eye,
  Award
} from "lucide-react"
import { getAllMockReports } from "@/lib/ai-studio/mockReports"

interface Project {
  id: string
  title: string
  trl: number
  funding: number
  status: "active" | "completed" | "pending"
  milestones: {
    total: number
    completed: number
    pending: number
  }
  lastUpdated: string
}

interface AIReport {
  id: string
  projectId: string
  projectName: string
  trlScore: number
  ipScore: number
  dueDiligenceScore: number
  overallScore: number
  generatedAt: string
  status: "complete" | "processing" | "failed"
}

const mockProjects: Project[] = [
  {
    id: "g-cap-500",
    title: "G-Cap 500: Ultra-Fast Charging Graphene Batteries",
    trl: 6,
    funding: 180000,
    status: "active",
    milestones: { total: 4, completed: 2, pending: 2 },
    lastUpdated: "2026-06-10"
  },
  {
    id: "cnt-power-cable",
    title: "CNT Power Cable for Grid Infrastructure",
    trl: 4,
    funding: 95000,
    status: "active",
    milestones: { total: 4, completed: 1, pending: 3 },
    lastUpdated: "2026-06-08"
  },
  {
    id: "water-hyacinth-biochar",
    title: "Water Hyacinth Biochar for Carbon Sequestration",
    trl: 7,
    funding: 250000,
    status: "active",
    milestones: { total: 4, completed: 3, pending: 1 },
    lastUpdated: "2026-06-12"
  },
  {
    id: "quantum-dots-solar",
    title: "Quantum Dot Enhanced Solar Cells",
    trl: 5,
    funding: 125000,
    status: "active",
    milestones: { total: 4, completed: 2, pending: 2 },
    lastUpdated: "2026-06-05"
  }
]

export default function ResearcherDashboard() {
  const [activeTab, setActiveTab] = useState<"projects" | "reports" | "funding">("projects")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  
  // Generate AI reports from mock data
  const mockAIReports: AIReport[] = getAllMockReports().map(report => ({
    id: `report-${report.id}`,
    projectId: report.id,
    projectName: report.title,
    trlScore: report.summary.trl,
    ipScore: report.summary.ipScore,
    dueDiligenceScore: report.summary.dueDiligenceScore,
    overallScore: Math.round((report.summary.ipScore + report.summary.dueDiligenceScore) / 2),
    generatedAt: new Date().toISOString(),
    status: "complete" as const
  }))

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400"
    if (score >= 60) return "text-yellow-400"
    return "text-red-400"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
      case "completed": return "bg-blue-500/20 text-blue-400 border-blue-500/40"
      case "pending": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/40"
      case "complete": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
      case "processing": return "bg-blue-500/20 text-blue-400 border-blue-500/40"
      case "failed": return "bg-red-500/20 text-red-400 border-red-500/40"
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/40"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/60 bg-card/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Researcher Dashboard</h1>
              <p className="mt-2 text-muted-foreground">
                Manage your projects, track AI analysis reports, and monitor funding progress
              </p>
            </div>
            <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4" />
              New Project
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-border/60 bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-3">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Projects</p>
                <p className="text-2xl font-bold text-foreground">{mockProjects.length}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border/60 bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-3">
                <Award className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">AI Reports</p>
                <p className="text-2xl font-bold text-foreground">{mockAIReports.length}</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border/60 bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-3">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Funding</p>
                <p className="text-2xl font-bold text-foreground">$650,000</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border/60 bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-3">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Score</p>
                <p className="text-2xl font-bold text-foreground">78%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex gap-2 border-b border-border/60">
          <button
            onClick={() => setActiveTab("projects")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "projects"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            My Projects
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "reports"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            AI Reports
          </button>
          <button
            onClick={() => setActiveTab("funding")}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "funding"
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Funding Progress
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {activeTab === "projects" && (
          <div className="space-y-4">
            {mockProjects.map((project) => (
              <div
                key={project.id}
                className="rounded-xl border border-border/60 bg-card p-6 transition-all hover:shadow-lg"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    <div className="mb-3 flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-foreground">{project.title}</h3>
                      <span className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <p className="text-xs text-muted-foreground">TRL Level</p>
                        <p className="text-lg font-semibold text-foreground">TRL {project.trl}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Funding</p>
                        <p className="text-lg font-semibold text-foreground">${project.funding.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Milestones</p>
                        <p className="text-lg font-semibold text-foreground">
                          {project.milestones.completed}/{project.milestones.total}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-secondary/20 px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary/30">
                      <Eye className="h-4 w-4" />
                      View Details
                    </button>
                    <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                      <FileText className="h-4 w-4" />
                      Generate Report
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "reports" && (
          <div className="space-y-4">
            {mockAIReports.map((report) => (
              <div
                key={report.id}
                className="rounded-xl border border-border/60 bg-card p-6 transition-all hover:shadow-lg"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    <div className="mb-3 flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-foreground">{report.projectName}</h3>
                      <span className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                    </div>
                    <div className="grid gap-4 md:grid-cols-4">
                      <div>
                        <p className="text-xs text-muted-foreground">TRL Score</p>
                        <p className={`text-lg font-semibold ${getScoreColor(report.trlScore)}`}>{report.trlScore}/9</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">IP Score</p>
                        <p className={`text-lg font-semibold ${getScoreColor(report.ipScore)}`}>{report.ipScore}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Due Diligence</p>
                        <p className={`text-lg font-semibold ${getScoreColor(report.dueDiligenceScore)}`}>{report.dueDiligenceScore}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Overall</p>
                        <p className={`text-lg font-semibold ${getScoreColor(report.overallScore)}`}>{report.overallScore}%</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-secondary/20 px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary/30">
                      <Eye className="h-4 w-4" />
                      View Report
                    </button>
                    <button className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-secondary/20 px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary/30">
                      <Download className="h-4 w-4" />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "funding" && (
          <div className="space-y-4">
            {mockProjects.map((project) => (
              <div
                key={project.id}
                className="rounded-xl border border-border/60 bg-card p-6 transition-all hover:shadow-lg"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    <h3 className="mb-3 text-lg font-semibold text-foreground">{project.title}</h3>
                    <div className="mb-4">
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">${project.funding.toLocaleString()} raised</span>
                        <span className="font-medium text-foreground">
                          {Math.round((project.funding / 250000) * 100)}%
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-secondary/20">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${Math.round((project.funding / 250000) * 100)}%` }}
                        />
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">Goal: $250,000</p>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>Updated {project.lastUpdated}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-4 w-4" />
                        <span>{project.milestones.completed} milestones completed</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-secondary/20 px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary/30">
                      <Eye className="h-4 w-4" />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
