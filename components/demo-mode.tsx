"use client"

import { useState, useEffect } from "react"
import { Play, Pause, Settings, Sparkles } from "lucide-react"

interface DemoModeContext {
  isEnabled: boolean
  autoApprove: boolean
  instantInvestment: boolean
  toggleDemoMode: () => void
  toggleAutoApprove: () => void
  toggleInstantInvestment: () => void
}

export function useDemoMode(): DemoModeContext {
  const [isEnabled, setIsEnabled] = useState(false)
  const [autoApprove, setAutoApprove] = useState(true)
  const [instantInvestment, setInstantInvestment] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('demoMode')
    if (saved) {
      const settings = JSON.parse(saved)
      setIsEnabled(settings.enabled || false)
      setAutoApprove(settings.autoApprove !== false)
      setInstantInvestment(settings.instantInvestment !== false)
    }
  }, [])

  const toggleDemoMode = () => {
    const newState = !isEnabled
    setIsEnabled(newState)
    localStorage.setItem('demoMode', JSON.stringify({
      enabled: newState,
      autoApprove,
      instantInvestment
    }))
  }

  const toggleAutoApprove = () => {
    const newState = !autoApprove
    setAutoApprove(newState)
    localStorage.setItem('demoMode', JSON.stringify({
      enabled: isEnabled,
      autoApprove: newState,
      instantInvestment
    }))
  }

  const toggleInstantInvestment = () => {
    const newState = !instantInvestment
    setInstantInvestment(newState)
    localStorage.setItem('demoMode', JSON.stringify({
      enabled: isEnabled,
      autoApprove,
      instantInvestment: newState
    }))
  }

  return {
    isEnabled,
    autoApprove,
    instantInvestment,
    toggleDemoMode,
    toggleAutoApprove,
    toggleInstantInvestment
  }
}

export function DemoModeToggle() {
  const { isEnabled, autoApprove, instantInvestment, toggleDemoMode, toggleAutoApprove, toggleInstantInvestment } = useDemoMode()
  const [showSettings, setShowSettings] = useState(false)

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="flex flex-col items-end gap-2">
        {/* Settings Panel */}
        {showSettings && (
          <div className="mb-2 rounded-xl border border-[#6efcff]/30 bg-black/90 p-4 backdrop-blur-xl">
            <h4 className="mb-3 text-sm font-semibold text-white">Demo Settings</h4>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoApprove}
                  onChange={toggleAutoApprove}
                  className="h-4 w-4 accent-[#6efcff]"
                />
                <span className="text-xs text-white/80">Auto-approve submissions</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={instantInvestment}
                  onChange={toggleInstantInvestment}
                  className="h-4 w-4 accent-[#6efcff]"
                />
                <span className="text-xs text-white/80">Instant investment (no wallet)</span>
              </label>
            </div>
          </div>
        )}

        {/* Main Toggle Button */}
        <button
          onClick={toggleDemoMode}
          className={`flex items-center gap-2 rounded-full px-4 py-2 transition-all ${
            isEnabled
              ? 'bg-gradient-to-r from-[#6efcff] to-[#a78bfa] text-black shadow-lg shadow-[#6efcff]/20'
              : 'bg-white/10 text-white/80 hover:bg-white/20'
          }`}
        >
          {isEnabled ? (
            <>
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">Demo Mode ON</span>
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              <span className="text-sm font-medium">Demo Mode</span>
            </>
          )}
        </button>

        {/* Settings Toggle */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`rounded-full p-2 transition-all ${
            showSettings
              ? 'bg-[#6efcff]/20 text-[#6efcff]'
              : 'bg-white/10 text-white/60 hover:bg-white/20'
          }`}
        >
          <Settings className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
