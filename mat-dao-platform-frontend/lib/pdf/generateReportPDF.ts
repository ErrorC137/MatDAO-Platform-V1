import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import type { CombinedAssessmentReport } from "@/lib/trl-services/types"

export function generateReportPDF(report: CombinedAssessmentReport): void {
  const doc = new jsPDF()
  let currentY = 0
  
  // Title
  doc.setFontSize(18)
  doc.setTextColor(0, 0, 0)
  doc.text("MatDAO Research Intelligence Report", 14, 20)
  
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 27)
  
  // Project Details
  doc.setFontSize(13)
  doc.setTextColor(0, 0, 0)
  doc.text("Project Details", 14, 38)
  
  doc.setFontSize(9)
  doc.setTextColor(60, 60, 60)
  doc.text(`Title: ${report.title}`, 14, 45)
  doc.text(`Author: ${report.author}`, 14, 51)
  doc.text(`Category: ${report.category}`, 14, 57)
  
  // Document Profile
  if (report.ipReport?.document_profile) {
    doc.setFontSize(13)
    doc.setTextColor(0, 0, 0)
    doc.text("Document Profile", 14, 68)
    
    const docProfileData = [
      ["Document Type", report.ipReport.document_profile.document_type || "N/A"],
      ["Word Count", report.ipReport.document_profile.word_count?.toLocaleString() || "N/A"],
      ["Sections Found", report.ipReport.document_profile.sections_found?.join(", ") || "N/A"]
    ]
    
    autoTable(doc, {
      startY: 73,
      head: [["Field", "Value"]],
      body: docProfileData,
      theme: "grid",
      headStyles: { fillColor: [110, 252, 255], textColor: [0, 0, 0], fontSize: 9 },
      styles: { fontSize: 9 },
      didDrawPage: (data) => {
        currentY = data.cursor?.y || 73
      },
    })
  }
  
  // Summary Metrics
  doc.setFontSize(13)
  doc.setTextColor(0, 0, 0)
  doc.text("Summary Metrics", 14, currentY + 12)
  
  const summaryData = [
    ["TRL Level", `TRL ${report.summary.trl}`],
    ["Innovation Score", String(report.summary.ipScore)],
    ["IP Valuation", report.summary.valuationUsd ? `$${report.summary.valuationUsd.toLocaleString()}` : "N/A"],
    ["Due Diligence", report.summary.dueDiligenceScore !== null ? `${report.summary.dueDiligenceScore.toFixed(1)}%` : "N/A"],
    ["Investment Tier", report.summary.investmentTier || "N/A"],
  ]
  
  autoTable(doc, {
    startY: currentY + 17,
    head: [["Metric", "Value"]],
    body: summaryData,
    theme: "grid",
    headStyles: { fillColor: [110, 252, 255], textColor: [0, 0, 0], fontSize: 9 },
    styles: { fontSize: 9 },
    didDrawPage: (data) => {
      currentY = data.cursor?.y || currentY + 17
    },
  })
  
  // Team Assessment
  if (report.trlProject?.team_assessment) {
    doc.addPage()
    doc.setFontSize(13)
    doc.setTextColor(0, 0, 0)
    doc.text("Team Assessment", 14, 20)
    
    const teamData = [
      ["Team Expertise Score", `${((report.trlProject.team_expertise_score || 0.5) * 100).toFixed(0)}%`],
      ["Institution Reputation", `${((report.trlProject.institution_reputation_score || 0.5) * 100).toFixed(0)}%`]
    ]
    
    autoTable(doc, {
      startY: 27,
      head: [["Metric", "Value"]],
      body: teamData,
      theme: "grid",
      headStyles: { fillColor: [167, 139, 250], textColor: [0, 0, 0], fontSize: 9 },
      styles: { fontSize: 9 },
      didDrawPage: (data) => {
        currentY = data.cursor?.y || 27
      },
    })
    
    doc.setFontSize(9)
    doc.setTextColor(60, 60, 60)
    const teamText = doc.splitTextToSize(report.trlProject.team_assessment, 180)
    doc.text(teamText, 14, currentY + 10)
    currentY += teamText.length * 4 + 10
  }
  
  // TRL Summary
  doc.addPage()
  doc.setFontSize(13)
  doc.setTextColor(0, 0, 0)
  doc.text("TRL Evaluation", 14, 20)
  
  doc.setFontSize(9)
  doc.setTextColor(60, 60, 60)
  const trlText = doc.splitTextToSize(report.trlProject.trlSummary, 180)
  doc.text(trlText, 14, 27)
  
  // Accomplishments
  doc.setFontSize(10)
  doc.setTextColor(0, 0, 0)
  doc.text("Key Accomplishments:", 14, currentY + trlText.length * 4 + 10)
  
  doc.setFontSize(8)
  doc.setTextColor(60, 60, 60)
  report.trlProject.accomplishments.forEach((acc, i) => {
    doc.text(`• ${acc}`, 14, currentY + trlText.length * 4 + 17 + (i * 5))
  })
  
  // Milestone Roadmap
  const milestoneData = Object.entries(report.trlProject.milestones).map(([key, m]) => [
    key,
    m.description,
    m.timeline,
    m.status,
  ])
  
  autoTable(doc, {
    startY: currentY + trlText.length * 4 + report.trlProject.accomplishments.length * 5 + 27,
    head: [["Milestone", "Description", "Timeline", "Status"]],
    body: milestoneData,
    theme: "grid",
    headStyles: { fillColor: [110, 252, 255], textColor: [0, 0, 0], fontSize: 8 },
    styles: { fontSize: 7, cellWidth: "wrap" },
    columnStyles: { 0: { cellWidth: 22 }, 1: { cellWidth: 75 }, 2: { cellWidth: 32 }, 3: { cellWidth: 22 } },
    didDrawPage: (data) => {
      currentY = data.cursor?.y || 0
    },
  })
  
  // USPTO Patent Search Results
  if ((report.ipReport as any)?.uspto_patents && (report.ipReport as any).uspto_patents.length > 0) {
    doc.addPage()
    doc.setFontSize(13)
    doc.setTextColor(0, 0, 0)
    doc.text("USPTO Patent Search Results", 14, 20)
    doc.setFontSize(8)
    doc.setTextColor(100, 100, 100)
    doc.text("Source: USPTO Open Data Portal", 14, 27)
    
    const usptoData = (report.ipReport as any).uspto_patents.slice(0, 5).map((patent: any) => [
      patent.patent_id,
      patent.title?.slice(0, 40) || "N/A",
      `${(patent.similarity_score * 100).toFixed(0)}%`,
      patent.filing_date || "N/A"
    ])
    
    autoTable(doc, {
      startY: 32,
      head: [["Patent ID", "Title", "Similarity", "Filing Date"]],
      body: usptoData,
      theme: "grid",
      headStyles: { fillColor: [110, 252, 255], textColor: [0, 0, 0], fontSize: 8 },
      styles: { fontSize: 7, cellWidth: "wrap" },
      columnStyles: { 0: { cellWidth: 25 }, 1: { cellWidth: 70 }, 2: { cellWidth: 20 }, 3: { cellWidth: 25 } },
      didDrawPage: (data) => {
        currentY = data.cursor?.y || 32
      },
    })
  }
  
  // Patent Claim Analysis
  if ((report.ipReport as any)?.patent_claim_analysis) {
    doc.addPage()
    doc.setFontSize(13)
    doc.setTextColor(0, 0, 0)
    doc.text("Patent Claim Analysis (35 USC § 102/103)", 14, 20)
    
    const claimData = [
      ["Novelty Score", `${((report.ipReport as any).patent_claim_analysis.novelty_score * 100).toFixed(0)}%`],
      ["Non-Obviousness Score", `${((report.ipReport as any).patent_claim_analysis.non_obviousness_score * 100).toFixed(0)}%`],
      ["Overall Patentability", (report.ipReport as any).patent_claim_analysis.overall_patentability?.slice(0, 50) || "N/A"]
    ]
    
    autoTable(doc, {
      startY: 27,
      head: [["Metric", "Value"]],
      body: claimData,
      theme: "grid",
      headStyles: { fillColor: [167, 139, 250], textColor: [0, 0, 0], fontSize: 9 },
      styles: { fontSize: 9 },
      didDrawPage: (data) => {
        currentY = data.cursor?.y || 27
      },
    })
    
    if ((report.ipReport as any).patent_claim_analysis.recommendations) {
      doc.setFontSize(9)
      doc.setTextColor(0, 0, 0)
      doc.text("Recommendations:", 14, currentY + 10)
      doc.setFontSize(8)
      doc.setTextColor(60, 60, 60)
      const recommendations = (report.ipReport as any).patent_claim_analysis.recommendations.slice(0, 5)
      for (let i = 0; i < recommendations.length; i++) {
        doc.text(`• ${recommendations[i]}`, 14, currentY + 17 + (i * 5))
      }
    }
  }
  
  // Legal Citation Verification
  if ((report.ipReport as any)?.legal_citation_verification) {
    doc.addPage()
    doc.setFontSize(13)
    doc.setTextColor(0, 0, 0)
    doc.text("Legal Citation Verification", 14, 20)
    
    const citationData = [
      ["Total Citations", String((report.ipReport as any).legal_citation_verification.total_citations)],
      ["Verified Citations", String((report.ipReport as any).legal_citation_verification.verified_citations)],
      ["Invalid Citations", String((report.ipReport as any).legal_citation_verification.invalid_citations)],
      ["Overall Confidence", `${((report.ipReport as any).legal_citation_verification.overall_confidence * 100).toFixed(0)}%`]
    ]
    
    autoTable(doc, {
      startY: 27,
      head: [["Metric", "Value"]],
      body: citationData,
      theme: "grid",
      headStyles: { fillColor: [110, 252, 255], textColor: [0, 0, 0], fontSize: 9 },
      styles: { fontSize: 9 },
      didDrawPage: (data) => {
        currentY = data.cursor?.y || 27
      },
    })
    
    if ((report.ipReport as any).legal_citation_verification.recommendations) {
      doc.setFontSize(9)
      doc.setTextColor(0, 0, 0)
      doc.text("Verification Recommendations:", 14, currentY + 10)
      doc.setFontSize(8)
      doc.setTextColor(60, 60, 60)
      const recommendations = (report.ipReport as any).legal_citation_verification.recommendations.slice(0, 5)
      for (let i = 0; i < recommendations.length; i++) {
        doc.text(`• ${recommendations[i]}`, 14, currentY + 17 + (i * 5))
      }
    }
  }
  
  // Compliance & Tokenization Status
  doc.addPage()
  doc.setFontSize(13)
  doc.setTextColor(0, 0, 0)
  doc.text("Compliance & Tokenization Status", 14, 20)
  
  const complianceData = [
    ["KYC Verified", (report.ipReport as any)?.compliance_status?.kyc_verified ? "Yes" : "No"],
    ["Accredited Investor", (report.ipReport as any)?.compliance_status?.accredited ? "Yes" : "No"],
    ["Entity Registered", (report.ipReport as any)?.compliance_status?.entity_registered ? "Yes" : "No"],
    ["Story Protocol IP Asset", (report.ipReport as any)?.tokenization_status?.story_protocol_registered ? "Registered" : "Pending"],
    ["ERC-3643 Token", (report.ipReport as any)?.tokenization_status?.erc3643_deployed ? "Deployed" : "Pending"],
    ["Royalty Splitter", (report.ipReport as any)?.tokenization_status?.royalty_splitter_configured ? "Configured" : "Pending"]
  ]
  
  autoTable(doc, {
    startY: 27,
    head: [["Status Item", "Status"]],
    body: complianceData,
    theme: "grid",
    headStyles: { fillColor: [167, 139, 250], textColor: [0, 0, 0], fontSize: 9 },
    styles: { fontSize: 9 },
    didDrawPage: (data) => {
      currentY = data.cursor?.y || 27
    },
  })
  
  // IP Valuation (if available)
  if (report.ipReport) {
    doc.addPage()
    doc.setFontSize(13)
    doc.setTextColor(0, 0, 0)
    doc.text("IP Valuation & FTO Analysis", 14, 20)
    
    const ipData = [
      ["Sector", report.ipReport.classification.sector_name],
      ["FTO Risk Score", `${(report.ipReport.fto.r_fto * 100).toFixed(2)}%`],
      ["Target Valuation", `$${report.ipReport.valuation.v_target_usd.toLocaleString()}`],
      ["Classification", report.ipReport.classification.ipc_primary],
    ]
    
    autoTable(doc, {
      startY: 27,
      head: [["Metric", "Value"]],
      body: ipData,
      theme: "grid",
      headStyles: { fillColor: [110, 252, 255], textColor: [0, 0, 0], fontSize: 9 },
      styles: { fontSize: 9 },
      didDrawPage: (data) => {
        currentY = data.cursor?.y || 27
      },
    })
  }
  
  // Due Diligence (if available)
  if (report.dueDiligenceReport) {
    doc.addPage()
    doc.setFontSize(13)
    doc.setTextColor(0, 0, 0)
    doc.text("Scientific Due Diligence", 14, 20)
    
    const ddData = [
      ["Total Score", `${report.dueDiligenceReport.totalScore.toFixed(1)}%`],
      ["Investment Tier", report.dueDiligenceReport.investmentTier.toUpperCase()],
      ["Integrity Gate", report.dueDiligenceReport.integrityGateTriggered ? "Triggered" : "Not Triggered"],
    ]
    
    autoTable(doc, {
      startY: 27,
      head: [["Metric", "Value"]],
      body: ddData,
      theme: "grid",
      headStyles: { fillColor: [110, 252, 255], textColor: [0, 0, 0], fontSize: 9 },
      styles: { fontSize: 9 },
      didDrawPage: (data) => {
        currentY = data.cursor?.y || 27
      },
    })
  }
  
  // Comprehensive Analysis (if available)
  if ((report.ipReport as any)?.comprehensive_analysis) {
    doc.addPage()
    doc.setFontSize(13)
    doc.setTextColor(0, 0, 0)
    doc.text("Comprehensive Analysis", 14, 20)
    
    const compAnalysis = (report.ipReport as any).comprehensive_analysis
    
    doc.setFontSize(10)
    doc.setTextColor(0, 0, 0)
    doc.text("Executive Summary", 14, 27)
    doc.setFontSize(8)
    doc.setTextColor(60, 60, 60)
    const execText = doc.splitTextToSize(compAnalysis.executive_summary || "N/A", 180)
    doc.text(execText, 14, 33)
    currentY = 33 + execText.length * 4
    
    doc.setFontSize(10)
    doc.setTextColor(0, 0, 0)
    doc.text("Technical Analysis", 14, currentY + 5)
    doc.setFontSize(8)
    doc.setTextColor(60, 60, 60)
    const techText = doc.splitTextToSize(compAnalysis.technical_analysis || "N/A", 180)
    doc.text(techText, 14, currentY + 11)
    currentY += techText.length * 4 + 11
    
    doc.setFontSize(10)
    doc.setTextColor(0, 0, 0)
    doc.text("Market Analysis", 14, currentY + 5)
    doc.setFontSize(8)
    doc.setTextColor(60, 60, 60)
    const marketText = doc.splitTextToSize(compAnalysis.market_analysis || "N/A", 180)
    doc.text(marketText, 14, currentY + 11)
  }
  
  // Recommended Next Steps
  doc.addPage()
  doc.setFontSize(13)
  doc.setTextColor(0, 0, 0)
  doc.text("Recommended Next Steps", 14, 20)
  
  doc.setFontSize(9)
  doc.setTextColor(60, 60, 60)
  report.summary.recommendedNextSteps.forEach((step, i) => {
    const stepText = doc.splitTextToSize(`${i + 1}. ${step}`, 180)
    doc.text(stepText, 14, 28 + (i * 12))
  })
  
  // Footer
  doc.setFontSize(7)
  doc.setTextColor(150, 150, 150)
  doc.text("Generated by MatDAO AI Platform", 14, 280)
  doc.text("matdao-platform-v1.vercel.app", 14, 285)
  
  // Save PDF
  doc.save(`MatDAO-Report-${report.title.replace(/\s+/g, '-')}.pdf`)
}
