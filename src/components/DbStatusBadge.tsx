import React from 'react'
import { useHealthCheck } from '@/hooks/useBackendQueries'
import { Check, Cloud, CloudOff } from 'lucide-react'

export const DbStatusBadge: React.FC = () => {
  const { isLoading, isError } = useHealthCheck()

  if (isLoading) {
    return (
      <div className="flex items-center gap-1.5 text-[11px] text-[#8A8884] bg-white px-2 py-0.5 rounded-full border border-[#E2E0D8]">
        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
        <span>Syncing...</span>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center gap-1.5 text-[11px] text-stone-600 bg-stone-100 px-2 py-0.5 rounded-full border border-stone-200">
        <CloudOff className="w-3 h-3 text-stone-400" />
        <span>Local Mode</span>
      </div>
    )
  }

  return (
    <div
      className="flex items-center gap-1.5 text-[11px] text-emerald-800 bg-emerald-50/80 px-2.5 py-0.5 rounded-full border border-emerald-200/70"
      title="All diagnostic attempts and notes are automatically saved to your profile."
    >
      <Check className="w-3 h-3 text-emerald-600 stroke-[2.5]" />
      <span className="font-medium text-[11px]">Auto-Saved</span>
    </div>
  )
}
