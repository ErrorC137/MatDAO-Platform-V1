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
          <div className="mb-2 border border-gray-200 bg-white rounded-lg p-4 shadow-lg">
            <h4 className="mb-3 text-sm font-semibold text-gray-900">Demo Settings</h4>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoApprove}
                  onChange={toggleAutoApprove}
                  className="h-4 w-4 accent-blue-600"
                />
                <span className="text-xs text-gray-700">Auto-approve submissions</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={instantInvestment}
                  onChange={toggleInstantInvestment}
                  className="h-4 w-4 accent-blue-600"
                />
                <span className="text-xs text-gray-700">Instant investment (no wallet)</span>
              </label>
            </div>
          </div>
        )}

        {/* Main Toggle Button */}
        <button
          onClick={toggleDemoMode}
          className={`flex items-center gap-2 rounded-full px-4 py-2 transition-all shadow-sm ${
            isEnabled
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
          className={`rounded-full p-2 transition-all shadow-sm ${
            showSettings
              ? 'bg-blue-100 text-blue-600'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          <Settings className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
