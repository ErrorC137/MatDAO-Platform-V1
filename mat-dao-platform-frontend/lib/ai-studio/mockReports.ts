import type { CombinedAssessmentReport } from "@/lib/trl-services/types"

/**
 * Mock AI reports for all existing projects on the platform
 * These reports simulate the output from the matdao-ip-engine backend
 * using all factors from current AI tools (TRL, IP valuation, due diligence)
 */

export const mockProjectReports: Record<string, CombinedAssessmentReport> = {
  "g-cap-500": {
    id: "g-cap-500",
    title: "G-Cap 500: Ultra-Fast Charging Graphene Batteries",
    author: "Prof. Dr. Arnon Jenkins (MIT)",
    category: "Energy Storage",
    createdAt: "2026-06-15T10:30:00Z",
    summary: {
      trl: 6,
      ipScore: 85,
      valuationUsd: 2500000,
      dueDiligenceScore: 78,
      investmentTier: "review",
      recommendedNextSteps: [
        "Scale up VAGA manufacturing process for pilot production",
        "Conduct extended cycle life testing under real-world conditions",
        "Engage with potential automotive partners for validation",
        "File additional patents for manufacturing process improvements",
        "Prepare for Series A funding round based on pilot results"
      ]
    },
    trlProject: {
      id: "g-cap-500",
      title: "G-Cap 500: Ultra-Fast Charging Graphene Batteries",
      author: "Prof. Dr. Arnon Jenkins (MIT)",
      category: "Energy Storage",
      abstract: "Revolutionary graphene-based energy storage with 5-minute charging capability",
      trl: 6,
      trlSummary: "TRL 6: Technology demonstrated in relevant environment. Prototype systems have been tested under simulated operational conditions showing 5-minute charging capability and 100,000+ cycle life.",
      accomplishments: [
        "Successfully synthesized VAGA material at lab scale",
        "Achieved 180 Wh/kg energy density in prototype cells",
        "Demonstrated 0-80% charging in 5 minutes",
        "Completed 100,000 charge cycles with <20% degradation",
        "Validated performance from -40°C to +65°C"
      ],
      potentialPartnership: "Automotive manufacturers, data center operators",
      milestones: {
        prototype: {
          description: "Complete lab-scale VAGA synthesis and characterization",
          timeline: "Q1 2024",
          status: "completed"
        },
        mvp: {
          description: "Build and test prototype battery cells",
          timeline: "Q3 2024",
          status: "completed"
        },
        pilotTest: {
          description: "Conduct pilot testing with automotive partners",
          timeline: "Q1 2025",
          status: "current"
        },
        commercialization: {
          description: "Scale manufacturing for commercial production",
          timeline: "Q4 2025",
          status: "future"
        }
      },
      score: 85,
      createdAt: "2026-06-15T10:30:00Z",
      logo: "battery"
    },
    ipReport: {
      classification: {
        ipc_primary: "H01M 4/36",
        cpc_primary: "H01M 4/362015",
        nace_code: "26.10",
        sector_name: "Energy Storage",
        classification_confidence: 0.92
      },
      originality: {
        max_cosine_similarity: 0.15,
        originality_premium_s: 0.85,
        embedding_model: "text-embedding-3-small",
        patent_corpus_size: 1000000,
        top_patent_matches: [
          { patent_id: "US10234567", title: "Fast charging battery electrodes", ipc: "H01M 4/36", cosine_similarity: 0.15 },
          { patent_id: "US9876543", title: "Graphene-based energy storage", ipc: "H01M 4/36", cosine_similarity: 0.28 }
        ]
      },
      fto: {
        r_fto: 0.25,
        risk_tier_pct: 25,
        high_risk_patent_group: null,
        expert_consultation_required: false,
        overlap_matrix: [
          { patent_id: "US10234567", title: "Fast charging battery electrodes", cosine_similarity: 0.85, overlap_ratio: 0.72, flagged_elements: ["electrode", "graphene"], structural_overlap: true },
          { patent_id: "US9876543", title: "Graphene-based energy storage", cosine_similarity: 0.72, overlap_ratio: 0.65, flagged_elements: ["graphene"], structural_overlap: false }
        ],
        flagged_patent_count: 1,
        analysis_source: "client"
      },
      valuation: {
        v_baseline_usd: 1500000,
        s_originality: 0.85,
        r_fto: 0.25,
        v_target_usd: 2500000,
        valuation_floor_usd: 1800000,
        tokenization_anchor_usd: 2000000,
        royalty_rate_baseline: 0.03,
        sector_name: "Energy Storage",
        formula: "v_target = v_baseline * (1 + s_originality) * (1 - r_fto)",
        hitl_reserved_pct: 0.1,
        automated_anchor_pct: 0.9
      },
      document_stats: {
        abstract_chars: 500,
        methodology_chars: 2000,
        claims_chars: 1500
      },
      report_metadata: {
        report_id: "g-cap-500-" + Date.now(),
        timestamp_unix: Math.floor(Date.now() / 1000),
        signature_sha256_hmac: "mock-signature-hash",
        privacy_mode: "standard"
      }
    },
    dueDiligenceReport: {
      documentName: "G-Cap 500 Research Proposal",
      wordCount: 5000,
      dimensions: [
        { id: 1, name: "Technical Feasibility", score: 85, maxScore: 100, weight: 0.15, evidence: ["Lab results", "Prototype data"], layer: "extraction" },
        { id: 2, name: "Market Potential", score: 80, maxScore: 100, weight: 0.15, evidence: ["Market analysis"], layer: "enrichment" },
        { id: 3, name: "Team Expertise", score: 75, maxScore: 100, weight: 0.12, evidence: ["Team credentials"], layer: "extraction" },
        { id: 4, name: "IP Strength", score: 85, maxScore: 100, weight: 0.15, evidence: ["Patent analysis"], layer: "enrichment" },
        { id: 5, name: "Regulatory Path", score: 70, maxScore: 100, weight: 0.10, evidence: ["Regulatory review"], layer: "enrichment" },
        { id: 6, name: "Scalability", score: 75, maxScore: 100, weight: 0.12, evidence: ["Manufacturing plan"], layer: "enrichment" },
        { id: 7, name: "Competitive Advantage", score: 80, maxScore: 100, weight: 0.10, evidence: ["Competitive analysis"], layer: "enrichment" },
        { id: 8, name: "Risk Mitigation", score: 70, maxScore: 100, weight: 0.06, evidence: ["Risk assessment"], layer: "integrity" },
        { id: 9, name: "Commercial Viability", score: 75, maxScore: 100, weight: 0.05, evidence: ["Business model"], layer: "enrichment" }
      ],
      totalScore: 78,
      maxTotalScore: 100,
      integrityGateTriggered: false,
      investmentTier: "review",
      timestamp: Date.now(),
      analysisSource: "client",
      layers: {
        layer1: "Technical and market data extraction completed",
        layer2: "IP and regulatory analysis enriched",
        integrityGate: "No integrity issues detected"
      }
    }
  },

  "cnt-power-cable": {
    id: "cnt-power-cable",
    title: "CNT Power Cable for Grid Infrastructure",
    author: "Dr. Somchai Tanaka (Chulalongkorn)",
    category: "Infrastructure",
    createdAt: "2026-06-14T15:45:00Z",
    summary: {
      trl: 4,
      ipScore: 72,
      valuationUsd: 1200000,
      dueDiligenceScore: 65,
      investmentTier: "review",
      recommendedNextSteps: [
        "Develop scalable CNT alignment process",
        "Conduct long-term reliability testing",
        "Establish partnerships with utility companies",
        "Optimize cost structure for commercial production",
        "Complete regulatory certification process"
      ]
    },
    trlProject: {
      id: "cnt-power-cable",
      title: "CNT Power Cable for Grid Infrastructure",
      author: "Dr. Somchai Tanaka (Chulalongkorn)",
      category: "Infrastructure",
      abstract: "Carbon nanotube-based power transmission cables with 80% less energy loss",
      trl: 4,
      trlSummary: "TRL 4: Technology validated in laboratory. CNT alignment process demonstrated at lab scale with 80% energy loss reduction compared to copper cables.",
      accomplishments: [
        "Developed CNT alignment technique",
        "Achieved <1% energy loss in lab prototypes",
        "Demonstrated higher current capacity than copper",
        "Established partnerships with utility companies"
      ],
      potentialPartnership: "Utility companies, grid operators",
      milestones: {
        prototype: {
          description: "Scale up CNT material synthesis",
          timeline: "Q2 2024",
          status: "completed"
        },
        mvp: {
          description: "Build and test cable prototypes",
          timeline: "Q4 2024",
          status: "current"
        },
        pilotTest: {
          description: "Conduct field testing with utilities",
          timeline: "Q2 2025",
          status: "future"
        },
        commercialization: {
          description: "Begin commercial cable production",
          timeline: "Q4 2025",
          status: "future"
        }
      },
      score: 72,
      createdAt: "2026-06-14T15:45:00Z",
      logo: "composite"
    },
    ipReport: {
      classification: {
        ipc_primary: "H01B 1/00",
        cpc_primary: "H01B 1/002015",
        nace_code: "27.10",
        sector_name: "Electrical Cables",
        classification_confidence: 0.88
      },
      originality: {
        max_cosine_similarity: 0.28,
        originality_premium_s: 0.72,
        embedding_model: "text-embedding-3-small",
        patent_corpus_size: 1000000,
        top_patent_matches: [
          { patent_id: "US11234567", title: "Carbon nanotube conductors", ipc: "H01B 1/00", cosine_similarity: 0.22 },
          { patent_id: "US10987654", title: "Low-loss power cables", ipc: "H01B 1/00", cosine_similarity: 0.35 }
        ]
      },
      fto: {
        r_fto: 0.35,
        risk_tier_pct: 35,
        high_risk_patent_group: null,
        expert_consultation_required: false,
        overlap_matrix: [
          { patent_id: "US11234567", title: "Carbon nanotube conductors", cosine_similarity: 0.78, overlap_ratio: 0.68, flagged_elements: ["cnt", "conductor"], structural_overlap: true },
          { patent_id: "US10987654", title: "Low-loss power cables", cosine_similarity: 0.65, overlap_ratio: 0.55, flagged_elements: ["cable"], structural_overlap: false }
        ],
        flagged_patent_count: 1,
        analysis_source: "client"
      },
      valuation: {
        v_baseline_usd: 800000,
        s_originality: 0.72,
        r_fto: 0.35,
        v_target_usd: 1200000,
        valuation_floor_usd: 900000,
        tokenization_anchor_usd: 1000000,
        royalty_rate_baseline: 0.025,
        sector_name: "Electrical Cables",
        formula: "v_target = v_baseline * (1 + s_originality) * (1 - r_fto)",
        hitl_reserved_pct: 0.15,
        automated_anchor_pct: 0.85
      },
      document_stats: {
        abstract_chars: 450,
        methodology_chars: 1800,
        claims_chars: 1200
      },
      report_metadata: {
        report_id: "cnt-power-cable-" + Date.now(),
        timestamp_unix: Math.floor(Date.now() / 1000),
        signature_sha256_hmac: "mock-signature-hash",
        privacy_mode: "standard"
      }
    },
    dueDiligenceReport: {
      documentName: "CNT Power Cable Research Proposal",
      wordCount: 4500,
      dimensions: [
        { id: 1, name: "Technical Feasibility", score: 70, maxScore: 100, weight: 0.15, evidence: ["Lab results"], layer: "extraction" },
        { id: 2, name: "Market Potential", score: 65, maxScore: 100, weight: 0.15, evidence: ["Market analysis"], layer: "enrichment" },
        { id: 3, name: "Team Expertise", score: 60, maxScore: 100, weight: 0.12, evidence: ["Team credentials"], layer: "extraction" },
        { id: 4, name: "IP Strength", score: 72, maxScore: 100, weight: 0.15, evidence: ["Patent analysis"], layer: "enrichment" },
        { id: 5, name: "Regulatory Path", score: 55, maxScore: 100, weight: 0.10, evidence: ["Regulatory review"], layer: "enrichment" },
        { id: 6, name: "Scalability", score: 60, maxScore: 100, weight: 0.12, evidence: ["Manufacturing plan"], layer: "enrichment" },
        { id: 7, name: "Competitive Advantage", score: 68, maxScore: 100, weight: 0.10, evidence: ["Competitive analysis"], layer: "enrichment" },
        { id: 8, name: "Risk Mitigation", score: 62, maxScore: 100, weight: 0.06, evidence: ["Risk assessment"], layer: "integrity" },
        { id: 9, name: "Commercial Viability", score: 65, maxScore: 100, weight: 0.05, evidence: ["Business model"], layer: "enrichment" }
      ],
      totalScore: 65,
      maxTotalScore: 100,
      integrityGateTriggered: false,
      investmentTier: "review",
      timestamp: Date.now(),
      analysisSource: "client",
      layers: {
        layer1: "Technical and market data extraction completed",
        layer2: "IP and regulatory analysis enriched",
        integrityGate: "No integrity issues detected"
      }
    }
  },

  "water-hyacinth-biochar": {
    id: "water-hyacinth-biochar",
    title: "Water Hyacinth Biochar for Carbon Sequestration",
    author: "Dr. Sarah Chen",
    category: "Environmental Tech",
    createdAt: "2026-06-15T09:15:00Z",
    summary: {
      trl: 7,
      ipScore: 88,
      valuationUsd: 3500000,
      dueDiligenceScore: 82,
      investmentTier: "pass",
      recommendedNextSteps: [
        "Expand pilot production facilities",
        "Secure carbon credit certification",
        "Establish partnerships with agricultural organizations",
        "Develop biochar quality standards",
        "Prepare for Series B funding round"
      ]
    },
    trlProject: {
      id: "water-hyacinth-biochar",
      title: "Water Hyacinth Biochar for Carbon Sequestration",
      author: "Dr. Sarah Chen",
      category: "Environmental Tech",
      abstract: "Large-scale biochar production from invasive water hyacinth with verified carbon sequestration",
      trl: 7,
      trlSummary: "TRL 7: System prototype demonstrated in operational environment. Large-scale biochar production from invasive water hyacinth with verified carbon sequestration capabilities.",
      accomplishments: [
        "Developed efficient water hyacinth harvesting process",
        "Achieved 50% carbon content in biochar",
        "Verified carbon sequestration over 100+ years",
        "Established pilot production facility",
        "Secured initial carbon credit agreements"
      ],
      potentialPartnership: "Agricultural organizations, carbon credit markets",
      milestones: {
        prototype: {
          description: "Complete lab-scale biochar optimization",
          timeline: "Q1 2024",
          status: "completed"
        },
        mvp: {
          description: "Build pilot production facility",
          timeline: "Q3 2024",
          status: "completed"
        },
        pilotTest: {
          description: "Conduct large-scale field trials",
          timeline: "Q1 2025",
          status: "completed"
        },
        commercialization: {
          description: "Scale to commercial production",
          timeline: "Q4 2025",
          status: "current"
        }
      },
      score: 88,
      createdAt: "2026-06-15T09:15:00Z",
      logo: "carbon"
    },
    ipReport: {
      classification: {
        ipc_primary: "C10B 1/00",
        cpc_primary: "C10B 1/002015",
        nace_code: "20.10",
        sector_name: "Environmental Technology",
        classification_confidence: 0.95
      },
      originality: {
        max_cosine_similarity: 0.12,
        originality_premium_s: 0.88,
        embedding_model: "text-embedding-3-small",
        patent_corpus_size: 1000000,
        top_patent_matches: [
          { patent_id: "US12345678", title: "Biochar production methods", ipc: "C10B 1/00", cosine_similarity: 0.18 },
          { patent_id: "US11567890", title: "Carbon sequestration systems", ipc: "C10B 1/00", cosine_similarity: 0.32 }
        ]
      },
      fto: {
        r_fto: 0.15,
        risk_tier_pct: 15,
        high_risk_patent_group: null,
        expert_consultation_required: false,
        overlap_matrix: [
          { patent_id: "US12345678", title: "Biochar production methods", cosine_similarity: 0.82, overlap_ratio: 0.75, flagged_elements: ["biochar", "production"], structural_overlap: true },
          { patent_id: "US11567890", title: "Carbon sequestration systems", cosine_similarity: 0.68, overlap_ratio: 0.60, flagged_elements: ["carbon"], structural_overlap: false }
        ],
        flagged_patent_count: 1,
        analysis_source: "client"
      },
      valuation: {
        v_baseline_usd: 2500000,
        s_originality: 0.88,
        r_fto: 0.15,
        v_target_usd: 3500000,
        valuation_floor_usd: 2800000,
        tokenization_anchor_usd: 3000000,
        royalty_rate_baseline: 0.04,
        sector_name: "Environmental Technology",
        formula: "v_target = v_baseline * (1 + s_originality) * (1 - r_fto)",
        hitl_reserved_pct: 0.05,
        automated_anchor_pct: 0.95
      },
      document_stats: {
        abstract_chars: 600,
        methodology_chars: 2500,
        claims_chars: 1800
      },
      report_metadata: {
        report_id: "water-hyacinth-biochar-" + Date.now(),
        timestamp_unix: Math.floor(Date.now() / 1000),
        signature_sha256_hmac: "mock-signature-hash",
        privacy_mode: "standard"
      }
    },
    dueDiligenceReport: {
      documentName: "Water Hyacinth Biochar Research Proposal",
      wordCount: 5500,
      dimensions: [
        { id: 1, name: "Technical Feasibility", score: 88, maxScore: 100, weight: 0.15, evidence: ["Lab results", "Pilot data"], layer: "extraction" },
        { id: 2, name: "Market Potential", score: 85, maxScore: 100, weight: 0.15, evidence: ["Market analysis"], layer: "enrichment" },
        { id: 3, name: "Team Expertise", score: 80, maxScore: 100, weight: 0.12, evidence: ["Team credentials"], layer: "extraction" },
        { id: 4, name: "IP Strength", score: 88, maxScore: 100, weight: 0.15, evidence: ["Patent analysis"], layer: "enrichment" },
        { id: 5, name: "Regulatory Path", score: 75, maxScore: 100, weight: 0.10, evidence: ["Regulatory review"], layer: "enrichment" },
        { id: 6, name: "Scalability", score: 82, maxScore: 100, weight: 0.12, evidence: ["Manufacturing plan"], layer: "enrichment" },
        { id: 7, name: "Competitive Advantage", score: 85, maxScore: 100, weight: 0.10, evidence: ["Competitive analysis"], layer: "enrichment" },
        { id: 8, name: "Risk Mitigation", score: 78, maxScore: 100, weight: 0.06, evidence: ["Risk assessment"], layer: "integrity" },
        { id: 9, name: "Commercial Viability", score: 82, maxScore: 100, weight: 0.05, evidence: ["Business model"], layer: "enrichment" }
      ],
      totalScore: 82,
      maxTotalScore: 100,
      integrityGateTriggered: false,
      investmentTier: "pass",
      timestamp: Date.now(),
      analysisSource: "client",
      layers: {
        layer1: "Technical and market data extraction completed",
        layer2: "IP and regulatory analysis enriched",
        integrityGate: "No integrity issues detected"
      }
    }
  },

  "quantum-dots-solar": {
    id: "quantum-dots-solar",
    title: "Quantum Dot Enhanced Solar Cells",
    author: "Dr. Michael Torres",
    category: "Clean Energy",
    createdAt: "2026-06-13T14:20:00Z",
    summary: {
      trl: 5,
      ipScore: 80,
      valuationUsd: 2800000,
      dueDiligenceScore: 75,
      investmentTier: "review",
      recommendedNextSteps: [
        "Optimize quantum dot synthesis for scale-up",
        "Improve long-term stability of solar cells",
        "Conduct accelerated aging tests",
        "Partner with solar panel manufacturers",
        "Complete efficiency validation at commercial scale"
      ]
    },
    trlProject: {
      id: "quantum-dots-solar",
      title: "Quantum Dot Enhanced Solar Cells",
      author: "Dr. Michael Torres",
      category: "Clean Energy",
      abstract: "Quantum dot solar cells achieving 40% efficiency in laboratory conditions",
      trl: 5,
      trlSummary: "TRL 5: Technology validated in relevant environment. Quantum dot solar cells achieving 40% efficiency in laboratory conditions, approaching theoretical limits.",
      accomplishments: [
        "Synthesized high-quality quantum dots",
        "Achieved 40% conversion efficiency",
        "Demonstrated stability over 1000 hours",
        "Developed scalable deposition process",
        "Filed patents for quantum dot design"
      ],
      potentialPartnership: "Solar panel manufacturers, energy companies",
      milestones: {
        prototype: {
          description: "Optimize quantum dot synthesis",
          timeline: "Q2 2024",
          status: "completed"
        },
        mvp: {
          description: "Build and test solar cell prototypes",
          timeline: "Q4 2024",
          status: "completed"
        },
        pilotTest: {
          description: "Conduct long-term stability tests",
          timeline: "Q2 2025",
          status: "current"
        },
        commercialization: {
          description: "Integrate with commercial solar panels",
          timeline: "Q4 2025",
          status: "future"
        }
      },
      score: 80,
      createdAt: "2026-06-13T14:20:00Z",
      logo: "turbine"
    },
    ipReport: {
      classification: {
        ipc_primary: "H01L 31/00",
        cpc_primary: "H01L 31/002015",
        nace_code: "26.20",
        sector_name: "Solar Technology",
        classification_confidence: 0.90
      },
      originality: {
        max_cosine_similarity: 0.20,
        originality_premium_s: 0.80,
        embedding_model: "text-embedding-3-small",
        patent_corpus_size: 1000000,
        top_patent_matches: [
          { patent_id: "US13456789", title: "Quantum dot solar cells", ipc: "H01L 31/00", cosine_similarity: 0.25 },
          { patent_id: "US12345678", title: "High-efficiency photovoltaics", ipc: "H01L 31/00", cosine_similarity: 0.30 }
        ]
      },
      fto: {
        r_fto: 0.30,
        risk_tier_pct: 30,
        high_risk_patent_group: null,
        expert_consultation_required: false,
        overlap_matrix: [
          { patent_id: "US13456789", title: "Quantum dot solar cells", cosine_similarity: 0.75, overlap_ratio: 0.70, flagged_elements: ["quantum", "solar"], structural_overlap: true },
          { patent_id: "US12345678", title: "High-efficiency photovoltaics", cosine_similarity: 0.70, overlap_ratio: 0.65, flagged_elements: ["photovoltaic"], structural_overlap: false }
        ],
        flagged_patent_count: 1,
        analysis_source: "client"
      },
      valuation: {
        v_baseline_usd: 2000000,
        s_originality: 0.80,
        r_fto: 0.30,
        v_target_usd: 2800000,
        valuation_floor_usd: 2200000,
        tokenization_anchor_usd: 2400000,
        royalty_rate_baseline: 0.035,
        sector_name: "Solar Technology",
        formula: "v_target = v_baseline * (1 + s_originality) * (1 - r_fto)",
        hitl_reserved_pct: 0.12,
        automated_anchor_pct: 0.88
      },
      document_stats: {
        abstract_chars: 550,
        methodology_chars: 2200,
        claims_chars: 1600
      },
      report_metadata: {
        report_id: "quantum-dots-solar-" + Date.now(),
        timestamp_unix: Math.floor(Date.now() / 1000),
        signature_sha256_hmac: "mock-signature-hash",
        privacy_mode: "standard"
      }
    },
    dueDiligenceReport: {
      documentName: "Quantum Dot Solar Cells Research Proposal",
      wordCount: 4800,
      dimensions: [
        { id: 1, name: "Technical Feasibility", score: 80, maxScore: 100, weight: 0.15, evidence: ["Lab results"], layer: "extraction" },
        { id: 2, name: "Market Potential", score: 78, maxScore: 100, weight: 0.15, evidence: ["Market analysis"], layer: "enrichment" },
        { id: 3, name: "Team Expertise", score: 72, maxScore: 100, weight: 0.12, evidence: ["Team credentials"], layer: "extraction" },
        { id: 4, name: "IP Strength", score: 80, maxScore: 100, weight: 0.15, evidence: ["Patent analysis"], layer: "enrichment" },
        { id: 5, name: "Regulatory Path", score: 68, maxScore: 100, weight: 0.10, evidence: ["Regulatory review"], layer: "enrichment" },
        { id: 6, name: "Scalability", score: 70, maxScore: 100, weight: 0.12, evidence: ["Manufacturing plan"], layer: "enrichment" },
        { id: 7, name: "Competitive Advantage", score: 78, maxScore: 100, weight: 0.10, evidence: ["Competitive analysis"], layer: "enrichment" },
        { id: 8, name: "Risk Mitigation", score: 72, maxScore: 100, weight: 0.06, evidence: ["Risk assessment"], layer: "integrity" },
        { id: 9, name: "Commercial Viability", score: 75, maxScore: 100, weight: 0.05, evidence: ["Business model"], layer: "enrichment" }
      ],
      totalScore: 75,
      maxTotalScore: 100,
      integrityGateTriggered: false,
      investmentTier: "review",
      timestamp: Date.now(),
      analysisSource: "client",
      layers: {
        layer1: "Technical and market data extraction completed",
        layer2: "IP and regulatory analysis enriched",
        integrityGate: "No integrity issues detected"
      }
    }
  }
}

/**
 * Get a mock AI report for a specific project
 */
export function getMockReport(projectId: string): CombinedAssessmentReport | null {
  return mockProjectReports[projectId] || null
}

/**
 * Get all mock AI reports
 */
export function getAllMockReports(): CombinedAssessmentReport[] {
  return Object.values(mockProjectReports)
}
