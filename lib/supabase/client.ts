import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string
          role: 'researcher' | 'staff' | 'investor'
          wallet_address: string | null
          university: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          role: 'researcher' | 'staff' | 'investor'
          wallet_address?: string | null
          university?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'researcher' | 'staff' | 'investor'
          wallet_address?: string | null
          university?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          title: string
          slug: string
          researcher_id: string
          trl: number
          phase: string
          funding_goal: number
          funding_raised: number
          description: string[]
          technical_specs: { label: string; value: string }[]
          market_applications: string[]
          development_timeline: { phase: string; timeline: string; status: string }[]
          team: { name: string; role: string; institution: string }[]
          risk_factors: string[]
          competitive_advantage: string[]
          ip_status: { type: string; status: string; details: string }
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          researcher_id: string
          trl: number
          phase: string
          funding_goal: number
          funding_raised?: number
          description: string[]
          technical_specs?: { label: string; value: string }[]
          market_applications?: string[]
          development_timeline?: { phase: string; timeline: string; status: string }[]
          team?: { name: string; role: string; institution: string }[]
          risk_factors?: string[]
          competitive_advantage?: string[]
          ip_status?: { type: string; status: string; details: string }
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          researcher_id?: string
          trl?: number
          phase?: string
          funding_goal?: number
          funding_raised?: number
          description?: string[]
          technical_specs?: { label: string; value: string }[]
          market_applications?: string[]
          development_timeline?: { phase: string; timeline: string; status: string }[]
          team?: { name: string; role: string; institution: string }[]
          risk_factors?: string[]
          competitive_advantage?: string[]
          ip_status?: { type: string; status: string; details: string }
          created_at?: string
          updated_at?: string
        }
      }
      assessments: {
        Row: {
          id: string
          user_id: string
          project_id: string
          title: string
          author: string
          category: string
          trl: number
          ip_score: number
          valuation_usd: number | null
          due_diligence_score: number | null
          investment_tier: string | null
          trl_project: any
          ip_report: any
          due_diligence_report: any
          summary: any
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          project_id: string
          title: string
          author: string
          category: string
          trl: number
          ip_score: number
          valuation_usd?: number | null
          due_diligence_score?: number | null
          investment_tier?: string | null
          trl_project?: any
          ip_report?: any
          due_diligence_report?: any
          summary?: any
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          project_id?: string
          title?: string
          author?: string
          category?: string
          trl?: number
          ip_score?: number
          valuation_usd?: number | null
          due_diligence_score?: number | null
          investment_tier?: string | null
          trl_project?: any
          ip_report?: any
          due_diligence_report?: any
          summary?: any
          created_at?: string
        }
      }
      verification_tasks: {
        Row: {
          id: string
          title: string
          milestone_name: string
          project_id: string
          project_title: string
          proof_text: string
          submitted_by: string
          submitted_at: string
          ai_passed: boolean
          ai_plagiarism_score: number
          ai_consistency_report: string
          human_voted: boolean
          human_passed: boolean | null
          human_notes: string | null
          status: 'pending' | 'verified' | 'rejected' | 'flagged'
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          milestone_name: string
          project_id: string
          project_title: string
          proof_text: string
          submitted_by: string
          submitted_at?: string
          ai_passed?: boolean
          ai_plagiarism_score?: number
          ai_consistency_report?: string
          human_voted?: boolean
          human_passed?: boolean | null
          human_notes?: string | null
          status?: 'pending' | 'verified' | 'rejected' | 'flagged'
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          milestone_name?: string
          project_id?: string
          project_title?: string
          proof_text?: string
          submitted_by?: string
          submitted_at?: string
          ai_passed?: boolean
          ai_plagiarism_score?: number
          ai_consistency_report?: string
          human_voted?: boolean
          human_passed?: boolean | null
          human_notes?: string | null
          status?: 'pending' | 'verified' | 'rejected' | 'flagged'
          created_at?: string
        }
      }
      submitted_milestones: {
        Row: {
          id: string
          user_id: string
          project_id: string
          project_title: string
          milestone_key: string
          milestone_label: string
          description: string
          timeline: string
          status: 'completed' | 'current' | 'future'
          submitted_at: string
          submitted_by: string
          verification_id: string | null
        }
        Insert: {
          id?: string
          user_id: string
          project_id: string
          project_title: string
          milestone_key: string
          milestone_label: string
          description: string
          timeline: string
          status: 'completed' | 'current' | 'future'
          submitted_at?: string
          submitted_by: string
          verification_id?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          project_id?: string
          project_title?: string
          milestone_key?: string
          milestone_label?: string
          description?: string
          timeline?: string
          status?: 'completed' | 'current' | 'future'
          submitted_at?: string
          submitted_by?: string
          verification_id?: string | null
        }
      }
    }
  }
}
