import React, { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Sparkles,
  Clock,
  TrendingUp,
  CheckCircle2,
  PenTool,
} from 'lucide-react'
import {
  IMPROVEMENT_METHODS,
  MethodCategory,
} from '@/data/handwritingData'
import { useLabStore } from '@/store/useLabStore'
import { Badge, Card } from '@/components/ui/primitives'
import { cn } from '@/lib/utils'

const METHOD_FILTERS: Array<{ id: MethodCategory; label: string }> = [
  { id: 'ALL', label: 'Show All 6 Methods' },
  { id: 'biomechanics', label: '1. Biomechanics & Posture' },
  { id: 'strokes', label: '2. NSW Foundation Stroke Families' },
  { id: 'cursive', label: '3. Cursive Join Mechanics' },
  { id: 'automaticity', label: '4. Speed & Automaticity Sprints' },
  { id: 'sensory', label: '5. Kinesthetic & OT Strength' },
  { id: 'cognitive', label: '6. Cognitive Chunking & Hybrid Fluency' },
]

const STROKE_FAMILIES = [
  {
    id: 'c-wave',
    name: "Family 1 · Anticlockwise 'c' Wave",
    letters: 'c  a  d  g  q  o  s  f',
    cue: "Start at 1 o'clock, sweep anticlockwise left around to the baseline.",
  },
  {
    id: 'retrace',
    name: 'Family 2 · Downward & Retrace Bounce',
    letters: 'l  t  b  h  k  m  n  p  r',
    cue: 'Pull straight down to the solid baseline, then bounce up clockwise.',
  },
  {
    id: 'cup',
    name: 'Family 3 · Cup & U-Turn Family',
    letters: 'i  u  y  j',
    cue: 'Downward stroke, curve cleanly along the baseline, pull straight down.',
  },
  {
    id: 'diagonal',
    name: 'Family 4 · Diagonal Slant Family',
    letters: 'v  w  x  z',
    cue: 'Crisp 60° straight diagonal strokes meeting at sharp baseline vertices.',
  },
]

export const ImprovementMethodsView: React.FC = () => {
  const { selectedMethodCategory, setSelectedMethodCategory } = useLabStore()
  const [activeStrokeIdx, setActiveStrokeIdx] = useState(0)

  const filteredMethods =
    selectedMethodCategory === 'ALL'
      ? IMPROVEMENT_METHODS
      : IMPROVEMENT_METHODS.filter((m) => m.category === selectedMethodCategory)

  const activeStroke = STROKE_FAMILIES[activeStrokeIdx]

  return (
    <div className="space-y-6">
      <Card className="p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="border-b border-[#ECEAE4] pb-5 space-y-2">
          <Badge variant="amber">Complete Pedagogical &amp; OT Intervention Playbook</Badge>
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#191918] tracking-tight">
            All 6 Evidence-Based Methods to Improve Handwriting Speed, Legibility &amp; Endurance
          </h2>
          <p className="text-xs sm:text-sm text-[#575653] leading-relaxed max-w-4xl">
            Rather than mindless repetitive copying (&quot;write this line 50 times&quot;), clinical occupational therapy and NSW literacy research prove that handwriting improves fastest when you target the specific bottleneck:{' '}
            <strong className="font-semibold text-[#191918]">
              biomechanics, stroke families, cursive joins, motor automaticity, proximal strength, or hybrid fluency
            </strong>
            .
          </p>
        </div>

        {/* Smooth Notion/Figma Animated Filter Pills */}
        <div className="flex flex-wrap gap-1.5 p-1.5 rounded-2xl bg-[#F4F3EF] border border-black/[0.04]">
          {METHOD_FILTERS.map((f) => {
            const active = selectedMethodCategory === f.id
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setSelectedMethodCategory(f.id)}
                className={cn(
                  'relative px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer select-none',
                  active ? 'text-[#191918] font-semibold' : 'text-[#575653] hover:text-[#191918]'
                )}
              >
                {active && (
                  <motion.div
                    layoutId="methodFilterPill"
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    className="absolute inset-0 rounded-xl bg-white shadow-2xs border border-black/[0.06]"
                  />
                )}
                <span className="relative z-10">{f.label}</span>
              </button>
            )
          })}
        </div>

        {/* Interactive NSW Foundation Stroke Family Sandbox */}
        <div className="rounded-2xl border border-[#E6E4DD] bg-[#FBFBFA] p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <PenTool className="w-4 h-4 text-amber-700" />
              <span className="text-xs font-semibold text-[#191918]">
                Interactive NSW Foundation Style 4-Stroke-Family Drill Preview
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {STROKE_FAMILIES.map((fam, idx) => (
                <button
                  key={fam.id}
                  type="button"
                  onClick={() => setActiveStrokeIdx(idx)}
                  className={cn(
                    'px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer',
                    activeStrokeIdx === idx
                      ? 'bg-[#191918] text-white'
                      : 'bg-white text-[#575653] border border-[#E2E0D8] hover:bg-[#F4F3EF]'
                  )}
                >
                  {fam.name.split('·')[0].trim()}
                </button>
              ))}
            </div>
          </div>

          <div className="dotted-thirds-paper rounded-xl border border-[#DFDDD4] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-[11px] font-semibold text-amber-800">
                {activeStroke.name}
              </div>
              <div className="font-serif text-2xl sm:text-3xl tracking-widest text-[#191918] font-medium py-1">
                {activeStroke.letters}
              </div>
            </div>
            <div className="text-xs text-[#575653] bg-white/90 px-3.5 py-2.5 rounded-xl border border-[#E6E4DD] max-w-sm">
              <strong className="text-[#191918]">Motor Cue:</strong> {activeStroke.cue}
            </div>
          </div>
        </div>

        {/* 6 Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <AnimatePresence mode="popLayout">
            {filteredMethods.map((m) => (
              <motion.div
                key={m.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.18 }}
                className="rounded-2xl bg-[#FBFBFA] p-5 sm:p-6 border border-[#E6E4DD] flex flex-col justify-between space-y-4 hover:bg-white hover:shadow-xs transition-all"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Badge variant="amber">{m.badge}</Badge>
                    <div className="flex items-center gap-2 text-[11px] font-mono text-[#575653]">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-700" />
                        {m.dailyDose}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base sm:text-lg font-semibold text-[#191918] tracking-tight">
                    {m.title}
                  </h3>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                    <span className="font-medium text-indigo-800 bg-indigo-50/70 px-2.5 py-0.5 rounded-md border border-indigo-200/60">
                      Research Basis: {m.evidence}
                    </span>
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-800">
                      <TrendingUp className="w-3 h-3" />
                      {m.impactMetric}
                    </span>
                  </div>

                  <p className="text-xs text-[#575653] leading-relaxed">
                    {m.summary}
                  </p>

                  <div className="rounded-xl bg-white p-4 border border-[#ECEAE4] space-y-2.5">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-[#8A8884] flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      Step-by-Step Home &amp; Classroom Execution
                    </div>
                    <ul className="space-y-2 text-xs text-[#3D3C3A]">
                      {m.steps.map((st, idx) => (
                        <li key={idx} className="flex items-start gap-2 leading-relaxed">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{st}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </Card>
    </div>
  )
}
