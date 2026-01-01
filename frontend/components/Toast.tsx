"use client"

import React, { createContext, useContext, useState, useCallback } from "react"

type ToastType = "success" | "error" | "info" | "warning"

export type ToastOptions = {
  title?: string
  message?: string
  type?: ToastType
  durationMs?: number
}

type ToastContextValue = {
  showToast: (opts: ToastOptions) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used within ToastProvider")
  return ctx
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visible, setVisible] = useState(false)
  const [opts, setOpts] = useState<ToastOptions>({})

  const showToast = useCallback((options: ToastOptions) => {
    setOpts(options)
    setVisible(true)
    const dur = options.durationMs ?? 3500
    setTimeout(() => setVisible(false), dur)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast UI */}
      <div className="fixed bottom-6 right-6 z-50">
        <div
          aria-hidden={!visible}
          className={`max-w-sm w-full transition-transform transform ${visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
        >
          <div className={`rounded-lg shadow-lg px-4 py-3 bg-white border ${opts.type === "error" ? "border-red-300" : "border-gray-200"}`}>
            {opts.title && <div className="font-semibold mb-1 text-sm">{opts.title}</div>}
            {opts.message && <div className="text-sm text-gray-700">{opts.message}</div>}
          </div>
        </div>
      </div>
    </ToastContext.Provider>
  )
}
