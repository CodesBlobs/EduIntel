import React from 'react'
import { motion } from 'motion/react'
import { STYLE_OPTIONS, LandingStyleKey } from './types'
import { cn } from '@/lib/utils'

interface StyleSwitcherBarProps {
  currentStyle: LandingStyleKey
  onSelectStyle: (style: LandingStyleKey) => void
}

export const StyleSwitcherBar: React.FC<StyleSwitcherBarProps> = ({
  currentStyle,
  onSelectStyle,
}) => {
  return (
    <aside
      aria-label="Landing page style switcher"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 max-w-[96vw] overflow-x-auto custom-scrollbar rounded-full bg-[#1A1A19]/90 dark:bg-stone-950/95 backdrop-blur-xl border border-white/15 p-1.5 shadow-2xl flex items-center gap-1 text-xs text-white select-none transition-all"
    >
      <div className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-stone-400 uppercase tracking-wider border-r border-white/10 shrink-0">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="hidden sm:inline">Design Style</span>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {STYLE_OPTIONS.map((opt) => {
          const isActive = currentStyle === opt.key
          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => onSelectStyle(opt.key)}
              className={cn(
                'relative px-3 py-1.5 rounded-full font-medium transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer text-xs',
                isActive
                  ? 'text-stone-900 font-bold shadow-md'
                  : 'text-stone-300 hover:text-white hover:bg-white/10'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeStyleSwitcherPill"
                  className="absolute inset-0 rounded-full bg-white"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <span className="relative z-10 text-sm leading-none">{opt.icon}</span>
              <span className="relative z-10">{opt.label}</span>
              {isActive && (
                <span
                  className="relative z-10 hidden md:inline text-[9px] px-1 py-0.2 rounded-full bg-stone-900 text-white font-mono"
                >
                  {opt.sublabel}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </aside>
  )
}
