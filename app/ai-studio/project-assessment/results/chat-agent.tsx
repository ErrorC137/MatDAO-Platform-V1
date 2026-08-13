"use client"

import { useState } from "react"
import { MessageSquare, Send, Loader2, Sparkles } from "lucide-react"

interface ChatAgentProps {
  report: any
}

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function ChatAgent({ report }: ChatAgentProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI analysis assistant. I can help explain the analysis results, provide recommendations for next steps, or answer any questions about your project assessment. What would you like to know?",
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const generateResponse = async (userMessage: string) => {
    // Extract key information from the report for context
    const trl = report.ipReport?.trl_evaluation?.trl || "N/A"
    const innovationScore = report.ipReport?.innovation_score || "N/A"
    const valuation = report.ipReport?.valuation?.v_target_usd || "N/A"
    const sector = report.ipReport?.classification?.sector_name || "N/A"
    const comprehensiveAnalysis = report.ipReport?.comprehensive_analysis || {}
    const marketMapping = report.ipReport?.market_mapping || {}

    // Generate contextual response based on the report data
    const lowerMessage = userMessage.toLowerCase()
    
    let response = ""

    if (lowerMessage.includes("trl") || lowerMessage.includes("technology readiness")) {
      let trlAssessment = ""
      if (trl >= 6) {
        trlAssessment = "Advanced development with clear commercialization path"
      } else if (trl >= 4) {
        trlAssessment = "Promising development with defined roadmap"
      } else if (trl >= 2) {
        trlAssessment = "Early development requiring significant investment"
      } else {
        trlAssessment = "Conceptual stage requiring fundamental validation"
      }
      
      const milestoneStatus = trl >= 4 ? "The technology has achieved important milestones validating technical feasibility." : "The technology is in early development stages requiring further validation."
      const execSummary = comprehensiveAnalysis.executive_summary || "The technology shows promising development progress."
      
      response = "Based on the analysis, your project is at Technology Readiness Level (TRL) " + String(trl) + ". " + execSummary + "\n\nThe TRL assessment indicates:\n- " + trlAssessment + "\n\n" + milestoneStatus + "\n\nWould you like specific recommendations for advancing to the next TRL level?"
    } else if (lowerMessage.includes("innovation") || lowerMessage.includes("novelty") || lowerMessage.includes("score")) {
      let innovationAssessment = ""
      if (innovationScore > 70) {
        innovationAssessment = "The technology shows exceptional innovation potential with strong competitive advantages."
      } else if (innovationScore > 50) {
        innovationAssessment = "The technology demonstrates good innovation with moderate competitive advantages."
      } else {
        innovationAssessment = "The technology shows incremental innovation with room for improvement."
      }
      
      const technicalAnalysis = comprehensiveAnalysis.technical_analysis?.includes("Innovation and Novelty Assessment") ? comprehensiveAnalysis.technical_analysis.split("Innovation and Novelty Assessment")[1]?.split("###")[0] || "" : "The technology demonstrates promising innovation potential."
      
      response = "Your innovation score is " + String(innovationScore) + ". " + technicalAnalysis + "\n\nKey innovation factors:\n- Novel technical approach with differentiation potential\n- Patent landscape analysis revealing competitive positioning\n- Technical methodology showing scientific rigor\n\n" + innovationAssessment + "\n\nWould you like recommendations for enhancing innovation or IP strategy?"
    } else if (lowerMessage.includes("valuation") || lowerMessage.includes("worth") || lowerMessage.includes("value")) {
      let valuationFormatted = ""
      if (typeof valuation === 'number') {
        valuationFormatted = valuation.toLocaleString()
      } else {
        valuationFormatted = String(valuation)
      }
      
      let investmentSummary = ""
      if (comprehensiveAnalysis.investment_thesis?.includes("Investment Opportunity Summary")) {
        investmentSummary = comprehensiveAnalysis.investment_thesis.split("Investment Opportunity Summary")[1]?.split("###")[0] || ""
      } else {
        investmentSummary = "Market analysis, technology maturity, and competitive positioning."
      }
      
      let returnPotential = ""
      if (comprehensiveAnalysis.investment_thesis?.includes("Return Potential")) {
        returnPotential = comprehensiveAnalysis.investment_thesis.split("Return Potential")[1]?.split("###")[0] || "The investment offers significant return potential with multiple exit scenarios."
      } else {
        returnPotential = "The investment offers significant return potential with multiple exit scenarios."
      }
      
      const trlString = String(trl)
      
      response = "The estimated valuation range is $" + valuationFormatted + ". This valuation is based on:\n\n" + investmentSummary + "\n\nKey valuation drivers:\n- Technology maturity at TRL " + trlString + "\n- Market opportunity in " + sector + "\n- IP position and competitive advantages\n- Development progress and commercialization potential\n\n" + returnPotential + "\n\nWould you like detailed investment recommendations or exit strategy analysis?"
    } else if (lowerMessage.includes("market") || lowerMessage.includes("commercial") || lowerMessage.includes("customer")) {
      const workingField = marketMapping.working_field || sector
      const totalOpportunities = marketMapping.total_opportunities || "multiple"
      const marketOverview = comprehensiveAnalysis.market_analysis?.includes("Target Market Sector Overview") ? comprehensiveAnalysis.market_analysis.split("Target Market Sector Overview")[1]?.split("###")[0] || "" : "The market shows strong growth potential with favorable competitive dynamics."
      const recommendedApproach = marketMapping.market_entry_strategy?.recommended_approach || "Partnership-based market entry"
      const timelineEstimate = marketMapping.market_entry_strategy?.timeline_estimate || "12-18 months"
      const topOpportunity = marketMapping.top_opportunity || "Multiple sectors identified"
      const strategicRecs = comprehensiveAnalysis.market_analysis?.includes("Strategic Market Recommendations") ? comprehensiveAnalysis.market_analysis.split("Strategic Market Recommendations")[1]?.split("###")[0] || "" : "Strategic market recommendations focus on validation and customer engagement."
      
      response = "The market analysis identifies " + workingField + " as the primary target sector with " + totalOpportunities + " market opportunities.\n\n" + marketOverview + "\n\nMarket entry strategy:\n- " + recommendedApproach + "\n- Timeline: " + timelineEstimate + "\n- Top opportunity: " + topOpportunity + "\n\n" + strategicRecs + "\n\nWould you like specific market entry recommendations or competitive analysis?"
    } else if (lowerMessage.includes("recommendation") || lowerMessage.includes("next step") || lowerMessage.includes("what should i do")) {
      let trlCondition = ""
      if (trl < 4) {
        trlCondition = "Complete experimental validation and prototype development"
      } else if (trl < 7) {
        trlCondition = "Advance to pilot-scale demonstrations and secure strategic partnerships"
      } else {
        trlCondition = "Execute market entry strategy and scale manufacturing"
      }
      
      const priorityAction2 = comprehensiveAnalysis.ip_competitive_analysis?.includes("IP Strategy Recommendations") ? "Implement comprehensive IP strategy with patent filing" : "Develop IP strategy aligned with commercialization timeline"
      const priorityAction3 = comprehensiveAnalysis.development_roadmap?.includes("Critical Next Steps") ? "Execute critical next steps for TRL advancement" : "Focus on development milestones and validation"
      const immediateActions = comprehensiveAnalysis.strategic_recommendations?.includes("Immediate Actions") ? comprehensiveAnalysis.strategic_recommendations.split("Immediate Actions")[1]?.split("###")[0] || "" : "Immediate priorities include technical validation, IP protection, and partnership development."
      const fundingStrategy = comprehensiveAnalysis.strategic_recommendations?.includes("Funding Strategy") ? comprehensiveAnalysis.strategic_recommendations.split("Funding Strategy")[1]?.split("##")[0] || "" : "Funding strategy should align with development milestones and commercialization timeline."
      
      response = "Based on the comprehensive analysis, here are the key recommendations:\n\n" + immediateActions + "\n\nPriority actions:\n1. " + trlCondition + "\n2. " + priorityAction2 + "\n3. " + priorityAction3 + "\n\n" + fundingStrategy + "\n\nWould you like detailed action plans for any specific recommendation?"
    } else if (lowerMessage.includes("risk") || lowerMessage.includes("challenge") || lowerMessage.includes("problem")) {
      let ipRiskAnalysis = ""
      if (comprehensiveAnalysis.risk_assessment?.includes("Intellectual Property Risk Analysis")) {
        ipRiskAnalysis = comprehensiveAnalysis.risk_assessment.split("Intellectual Property Risk Analysis")[1]?.split("###")[0] || ""
      } else {
        ipRiskAnalysis = "IP risks require strategic management and comprehensive analysis."
      }
      
      let riskMitigation = ""
      if (comprehensiveAnalysis.risk_assessment?.includes("Risk Mitigation Strategies")) {
        riskMitigation = comprehensiveAnalysis.risk_assessment.split("Risk Mitigation Strategies")[1]?.split("##")[0] || ""
      } else {
        riskMitigation = "Risk mitigation strategies include phased development, comprehensive validation, and strategic partnerships."
      }
      
      const riskFactors = "Primary risk factors:\n- Technical development risks with validation requirements\n- Market adoption risks requiring customer engagement\n- IP landscape complexity requiring strategic management\n- Execution risks with development timeline considerations"
      const overallRisk = "The overall risk profile presents a favorable risk-reward ratio with clear mitigation strategies."
      
      response = "The comprehensive risk assessment identifies several key areas:\n\n" + ipRiskAnalysis + "\n\n" + riskFactors + "\n\n" + riskMitigation + "\n\n" + overallRisk + "\n\nWould you like specific risk mitigation recommendations for any particular area?"
    } else if (lowerMessage.includes("ip") || lowerMessage.includes("patent") || lowerMessage.includes("intellectual property")) {
      let patentPositioning = ""
      if (comprehensiveAnalysis.ip_competitive_analysis?.includes("Patent Landscape Positioning")) {
        patentPositioning = comprehensiveAnalysis.ip_competitive_analysis.split("Patent Landscape Positioning")[1]?.split("###")[0] || "Strong patent positioning with good novelty and competitive advantages."
      } else {
        patentPositioning = "Strong patent positioning with good novelty and competitive advantages."
      }
      
      let ftoAnalysis = ""
      if (comprehensiveAnalysis.ip_competitive_analysis?.includes("Freedom to Operate")) {
        ftoAnalysis = comprehensiveAnalysis.ip_competitive_analysis.split("Freedom to Operate")[1]?.split("###")[0] || "Freedom to operate analysis shows manageable IP considerations with strategic opportunities."
      } else {
        ftoAnalysis = "Freedom to operate analysis shows manageable IP considerations with strategic opportunities."
      }
      
      response = "The IP analysis reveals:\n\n" + patentPositioning + "\n\nIP strategy recommendations:\n- File comprehensive patent applications for core innovations\n- Conduct regular freedom-to-operate analysis\n- Develop strategic IP portfolio with defensive positioning\n- Monitor competitive patent landscape\n- Consider international filings for key markets\n\n" + ftoAnalysis + "\n\nWould you like specific IP filing recommendations or competitive analysis?"
    } else if (lowerMessage.includes("timeline") || lowerMessage.includes("when") || lowerMessage.includes("how long")) {
      const developmentTimeline = comprehensiveAnalysis.development_roadmap?.includes("Development Timeline") ? comprehensiveAnalysis.development_roadmap.split("Development Timeline")[1]?.split("###")[0] : "Timeline estimates based on development stage and complexity."
      
      let milestoneTimeline = ""
      if (trl < 4) {
        milestoneTimeline = "6-12 months to reach TRL 4-5 with prototype validation"
      } else if (trl < 7) {
        milestoneTimeline = "12-18 months to reach TRL 6-7 with pilot validation"
      } else {
        milestoneTimeline = "18-24 months to reach TRL 8-9 with commercialization"
      }
      
      const criticalSteps = comprehensiveAnalysis.development_roadmap?.includes("Critical Next Steps") ? "Critical next steps should be completed within 3-6 months" : "Development priorities should focus on validation and advancement"
      const fundingTimeline = comprehensiveAnalysis.strategic_recommendations?.includes("Funding Timeline") ? comprehensiveAnalysis.strategic_recommendations.split("Funding Timeline")[1]?.split("##")[0] : "Funding should be aligned with key development milestones."
      
      response = "Based on the current TRL " + String(trl) + " status, the development timeline is:\n\n" + developmentTimeline + "\n\nExpected milestones:\n- " + milestoneTimeline + "\n- " + criticalSteps + "\n\n" + fundingTimeline + "\n\nWould you like detailed milestone planning or resource allocation recommendations?"
    } else {
      const workingField = marketMapping.working_field || sector
      const valuationFormatted = typeof valuation === 'number' ? valuation.toLocaleString() : String(valuation)
      const investmentRec = comprehensiveAnalysis.executive_summary?.includes("Investment Recommendation") ? comprehensiveAnalysis.executive_summary.split("Investment Recommendation")[1] || "" : "The technology represents a promising investment opportunity with strong commercialization potential."
      
      response = "Based on your project analysis, I can provide insights on:\n\n- **TRL Assessment**: Current development stage at TRL " + trl + " with specific advancement recommendations\n- **Innovation Analysis**: Innovation score of " + innovationScore + " with IP strategy recommendations\n- **Market Analysis**: " + workingField + " sector opportunities and entry strategy\n- **Valuation**: Estimated $" + valuationFormatted + " valuation with investment thesis\n- **Risk Assessment**: Comprehensive risk analysis with mitigation strategies\n- **Recommendations**: Strategic action plans for development and commercialization\n- **Timeline**: Development milestones and commercialization timeline\n\n" + investmentRec + "\n\nWhat specific aspect would you like me to explain in more detail?"
    }

    return response
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response generation
    setTimeout(async () => {
      try {
        const response = await generateResponse(input)
        const assistantMessage: Message = {
          role: "assistant",
          content: response,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, assistantMessage])
      } catch (error) {
        const errorMessage: Message = {
          role: "assistant",
          content: "I apologize, but I encountered an error generating a response. Please try again.",
          timestamp: new Date()
        }
        setMessages(prev => [...prev, errorMessage])
      } finally {
        setIsLoading(false)
      }
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-white/10 bg-white/5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6efcff]/20 border border-[#6efcff]/30">
            <Sparkles className="h-5 w-5 text-[#c5fdff]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white/90">AI Analysis Assistant</h3>
            <p className="text-xs text-white/50">Ask questions about your analysis</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === "user"
                  ? "bg-gradient-to-r from-[#6efcff] to-[#a78bfa] text-black"
                  : "bg-white/10 text-white/90"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p className="text-xs mt-1 opacity-60">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white/10 rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-white/60" />
                <p className="text-sm text-white/60">Analyzing your report...</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10 bg-white/5">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about your analysis, recommendations, or next steps..."
            className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:border-[#6efcff] focus:outline-none focus:ring-1 focus:ring-[#6efcff]/40 transition-all"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#6efcff] to-[#a78bfa] px-4 py-3 text-sm font-semibold text-black transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {[
            "Explain TRL score",
            "Market recommendations",
            "IP strategy",
            "Next steps",
            "Risk assessment"
          ].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => setInput(suggestion)}
              className="text-xs text-white/40 hover:text-white/60 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
