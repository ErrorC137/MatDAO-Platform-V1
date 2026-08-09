export interface AuditEntry {
  id: string
  parent_id?: string | null
  label: string
  amount_usd: number
  formula: string
  explanation: string
  calculation_steps: Array<{ step: number; operation: string; value: string | number }>
  evidence: Array<{ type: string; ref?: string; detail?: string }>
}

export interface AnalysisReport {
  document_profile?: {
    document_type: string
    parsing_confidence: number
    sections_found: string[]
    word_count: number
    supports_tokenization: boolean
    note: string
  }
  classification: {
    ipc_primary: string
    cpc_primary: string
    nace_code: string
    sector_name: string
    classification_confidence: number
    classifier_model?: string
    detected_keywords?: string[]
    field_classification?: {
      primary: string
      secondary: string
      tertiary: string
    }
  }
  originality: {
    max_cosine_similarity: number
    originality_premium_s: number
    embedding_model: string
    patent_corpus_size?: number
    top_patent_matches: Array<{
      patent_id: string
      title: string
      ipc: string
      cosine_similarity: number
    }>
  }
  fto: {
    r_fto: number
    risk_tier_pct: number
    high_risk_patent_group: string | null
    expert_consultation_required: boolean
    overlap_matrix: Array<{
      patent_id: string
      title: string
      cosine_similarity: number
      overlap_ratio: number
      flagged_elements: string[]
      structural_overlap: boolean
    }>
    flagged_patent_count: number
    analysis_source: string
  }
  valuation: {
    v_baseline_usd: number
    s_originality: number
    r_fto: number
    v_target_usd: number
    valuation_floor_usd: number
    tokenization_anchor_usd: number
    royalty_rate_baseline: number
    sector_name: string
    formula: string
    hitl_reserved_pct: number
    automated_anchor_pct: number
    audit_trail?: AuditEntry[]
    additional_factors?: {
      market_size_multiplier: number
      trl_adjustment_factor: number
      team_quality_score: number
      competitive_advantage_score: number
      regulatory_risk_discount: number
      time_to_market_months: number
      patent_strength_score: number
      commercial_readiness_score: number
    }
  }
  trl_evaluation?: {
    trl: number
    trl_summary: string
    accomplishments: string[]
    potential_partnership: string
    innovation_score: number
    milestones: {
      prototype: { status: "completed" | "current" | "future"; description: string; timeline: string }
      mvp: { status: "completed" | "current" | "future"; description: string; timeline: string }
      pilot_test: { status: "completed" | "current" | "future"; description: string; timeline: string }
      commercialization: { status: "completed" | "current" | "future"; description: string; timeline: string }
    }
    sector_name: string
    analysis_source: string
  }
  document_stats: {
    abstract_chars: number
    methodology_chars: number
    claims_chars: number
  }
  report_metadata: {
    report_id: string
    timestamp_unix: number
    signature_sha256_hmac: string
    privacy_mode: string
  }
  value_chain_analysis?: {
    upstream: Array<{
      stage: string
      description: string
      key_suppliers: string[]
      risk_level: string
      cost_impact: string
    }>
    midstream: Array<{
      stage: string
      description: string
      key_suppliers: string[]
      risk_level: string
      cost_impact: string
    }>
    downstream: Array<{
      stage: string
      description: string
      key_suppliers: string[]
      risk_level: string
      cost_impact: string
    }>
    value_capture_opportunities: string[]
  }
}

export interface HitlModifiers {
  teamPedigree: number
  tradeSecrets: number
  partnerships: number
}

export interface TokenizationBreakdown {
  fullAdjustedValue: number
  tokenizationFractionPct: number
  listedTokenizationValue: number
  retainedOwnershipPct: number
  hitlAudit: AuditEntry[]
}

export interface DueDiligenceDimension {
  id: number
  name: string
  score: number
  maxScore: number
  weight: number
  evidence: string[]
  layer: "extraction" | "enrichment" | "integrity"
}

export interface DueDiligenceReport {
  documentName: string
  wordCount: number
  dimensions: DueDiligenceDimension[]
  totalScore: number
  maxTotalScore: number
  integrityGateTriggered: boolean
  investmentTier: "pass" | "review" | "fail"
  timestamp: number
  analysisSource?: "engine" | "client"
  layers: {
    layer1: string
    layer2: string
    integrityGate: string
  }
}
