"use client"

import { useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Beaker } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/context/auth-context"
import { useDemoMode } from "@/components/demo-mode"
import { MultiStepForm } from "@/components/submit/multi-step-form"

export default function SubmitProjectPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { isEnabled: demoMode } = useDemoMode()

  const handleSubmit = async (formData: any) => {
    if (!user) {
      throw new Error("Please sign in to submit a project")
    }

    // Parse funding range
    let fundingGoal = 50000
    if (formData.fundingNeeded.includes("< $10,000")) fundingGoal = 10000
    else if (formData.fundingNeeded.includes("$10,000 - $50,000")) fundingGoal = 50000
    else if (formData.fundingNeeded.includes("$50,000 - $100,000")) fundingGoal = 100000
    else if (formData.fundingNeeded.includes("$100,000 - $250,000")) fundingGoal = 250000
    else if (formData.fundingNeeded.includes("> $250,000")) fundingGoal = 500000

    // Create slug from title
    const slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now()

    // Insert project into Supabase with raising status for demo
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .insert({
        title: formData.title,
        slug,
        researcher_id: user.id,
        trl: formData.trl,
        phase: 'raising',
        funding_goal: fundingGoal,
        funding_raised: 0,
        is_raising: true,
        description: [
          { key: 'institution', value: formData.institution },
          { key: 'email', value: formData.email },
          { key: 'workingField', value: formData.workingField },
          { key: 'partnerNeeded', value: formData.partnerNeeded },
          { key: 'license', value: formData.license },
          { key: 'fundingNeeded', value: formData.fundingNeeded },
          { key: 'targetAudience', value: formData.targetAudience },
          { key: 'painPoints', value: formData.painPoints },
          { key: 'marketSize', value: formData.marketSize },
        ],
        technical_specs: [
          { key: 'businessModel', value: formData.businessModel },
          { key: 'milestones', value: formData.milestones },
          { key: 'timeline', value: formData.timeline },
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

    // Handle file uploads (simplified for demo)
    if (formData.pitchDeck) {
      console.log('Pitch deck uploaded:', formData.pitchDeck.name)
    }
    if (formData.prototype) {
      console.log('Prototype uploaded:', formData.prototype.name)
    }
    if (formData.additionalDocs) {
      console.log('Additional docs uploaded:', formData.additionalDocs.name)
    }

    router.push(`/submit/milestone?projectId=${projectData.id}`)
  }

  const demoData = {
    title: "Graphene-Based Supercapacitor for Grid Storage",
    institution: "MIT",
    email: "researcher@mit.edu",
    workingField: "Energy Storage",
    trl: 5,
    targetAudience: "Electric vehicle manufacturers, data centers, renewable energy providers",
    painPoints: "Slow charging times, energy loss during transmission, high costs of current battery technology",
    marketSize: "$50B global market by 2030",
    businessModel: "Licensing to manufacturers, direct sales for specialized applications, service contracts",
    fundingNeeded: "$100,000 - $250,000",
    partnerNeeded: "Industry Partner",
    license: "University License",
    milestones: "Proof of Concept (6 months), Prototype (12 months), Pilot (18 months), Commercialization (24 months)",
    timeline: "6 months for PoC validation, 12 months for prototype development, 18 months for pilot deployment, 24 months for commercial launch",
  }

  return (
    <div className="flex flex-col">
      {/* Hero header */}
      <section className="border-b border-white/10 bg-black/40 backdrop-blur-sm px-4 py-14">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-[#6efcff]/30 bg-[#6efcff]/10">
            <Beaker className="h-6 w-6 text-[#c5fdff]" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white/95 md:text-4xl">
            Submit Your Innovation
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/60">
            Guide your research through the MatDAO protocol. Our multi-step process helps us match your project with the right funding and milestone structure.
          </p>
        </div>
      </section>

      {/* Multi-step form */}
      <section className="px-4 py-12">
        <div className="mx-auto w-full max-w-4xl">
          <MultiStepForm 
            onSubmit={handleSubmit} 
            demoMode={demoMode}
            demoData={demoData}
          />
        </div>
      </section>
    </div>
  )
}
