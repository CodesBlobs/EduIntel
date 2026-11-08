import React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Wrench,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Ruler,
} from 'lucide-react'
import {
  EQUIPMENT_MATRIX,
  SYMPTOM_TOOLS,
  SymptomKey,
} from '@/data/handwritingData'
import { useLabStore } from '@/store/useLabStore'
import { Badge, Card, Select } from '@/components/ui/primitives'
import { cn } from '@/lib/utils'

const SYMPTOM_KEYS: SymptomKey[] = [
  'heavy_pressure',
  'thumb_wrap',
  'floating_letters',
  'slow_drag',
  'smudging_left',
]

const RULED_PAPER_PROGRESSION = [
  {
    stage: 'Year 1 (Stage 1)',
    spec: '18mm NSW Dotted Thirds',
    detail: 'Large 6mm x-height zone for early gross-to-fine motor transition',
  },
  {
    stage: 'Year 2 (Stage 1)',
    spec: '14mm NSW Dotted Thirds',
    detail: 'Refines anticlockwise c-wave sizing and baseline anchoring',
  },
  {
    stage: 'Years 3–4 (Stage 2)',
    spec: '11mm NSW Dotted Thirds',
    detail: 'Calibrates diagonal & horizontal cursive joins for Paper NAPLAN',
  },
  {
    stage: 'Years 5–9 (Stage 3–5)',
    spec: '8mm Standard Ruled',
    detail: 'Matches 2028 Year 5 & Secondary NAPLAN / HSC lined exam booklets',
  },
]

export const ToolsErgonomicsView: React.FC = () => {
  const { selectedSymptom, setSelectedSymptom } = useLabStore()
  const activePrescription = SYMPTOM_TOOLS[selectedSymptom]

  return (
    <div className="space-y-6">
      <Card className="p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="border-b border-[#ECEAE4] pb-5 space-y-2">
          <Badge variant="indigo">Practical Equipment &amp; Ergonomic Selector</Badge>
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#191918] tracking-tight">
            Practical Tools, Ergonomic Pens, Ruled Paper &amp; OT Aids by Symptom
          </h2>
          <p className="text-xs sm:text-sm text-[#575653] leading-relaxed max-w-4xl">
            Using the wrong writing instrument (such as a cheap high-friction ballpoint pen that requires 3x downward pressure, or unlined blank paper) instantly causes hand fatigue in a 40-minute exam. Match your child&apos;s school stage and physical symptom to the exact tool below:
          </p>
        </div>

        {/* Interactive Symptom-to-Tool Matcher */}
        <div className="rounded-2xl bg-[#FBFBFA] p-5 sm:p-6 border border-[#E6E4DD] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5" />
                Interactive Tool Prescription
              </span>
              <h3 className="text-base font-semibold text-[#191918] mt-0.5">
                Select Your Child&apos;s #1 Handwriting Bottleneck:
              </h3>
            </div>

            <div className="w-full sm:w-auto min-w-[320px]">
              <Select
                aria-label="Select Handwriting Bottleneck"
                value={selectedSymptom}
                onChange={(e) => setSelectedSymptom(e.target.value as SymptomKey)}
              >
                {SYMPTOM_KEYS.map((k) => (
                  <option key={k} value={k}>
                    {SYMPTOM_TOOLS[k].symptomOption}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {/* Smooth Quick-Select Pills */}
          <div className="flex flex-wrap gap-1.5">
            {SYMPTOM_KEYS.map((k) => {
              const item = SYMPTOM_TOOLS[k]
              const isActive = selectedSymptom === k
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() => setSelectedSymptom(k)}
                  className={cn(
                    'px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer',
                    isActive
                      ? 'bg-[#191918] text-white shadow-2xs'
                      : 'bg-white text-[#575653] border border-[#E2E0D8] hover:bg-[#F4F3EF]'
                  )}
                >
                  {item.shortLabel}
                </button>
              )
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activePrescription.key}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.16 }}
              className="rounded-xl bg-white p-5 border border-[#E6E4DD] space-y-3.5 shadow-2xs"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-semibold text-[#191918] text-sm sm:text-base">
                  {activePrescription.title}
                </div>
                <Badge variant="emerald">{activePrescription.protocolTip}</Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {activePrescription.tools.map((tool, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 rounded-xl bg-amber-50/60 border border-amber-200/70 p-3 text-xs font-medium text-amber-950"
                  >
                    <CheckCircle2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <span>
                      <strong className="font-mono text-[11px] text-amber-800">
                        Tool #{i + 1}:
                      </strong>{' '}
                      {tool}
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-xs text-[#575653] leading-relaxed">
                <strong className="font-semibold text-[#191918]">
                  Clinical Mechanism:{' '}
                </strong>
                {activePrescription.why}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* NSW Dotted Thirds Line-Width Progression Strip */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#191918]">
            <Ruler className="w-4 h-4 text-amber-700" />
            Official NSW Foundation Ruled Paper Progression (Years 1–9)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {RULED_PAPER_PROGRESSION.map((p, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-[#E6E4DD] bg-[#FBFBFA] p-3.5 space-y-1"
              >
                <div className="text-[11px] font-mono font-semibold text-amber-800">
                  {p.stage}
                </div>
                <div className="text-xs font-semibold text-[#191918]">{p.spec}</div>
                <p className="text-[11px] text-[#575653] leading-relaxed">
                  {p.detail}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Comprehensive Equipment Comparison Matrix */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-[#191918] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-600" />
            Complete 6-Category Ergonomic &amp; Occupational Therapy Equipment Matrix
          </h3>

          <div className="overflow-x-auto rounded-2xl border border-[#E6E4DD]">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F4F3EF] text-[#191918] border-b border-[#E6E4DD]">
                  <th className="py-3.5 px-4 font-semibold">Tool Category</th>
                  <th className="py-3.5 px-4 font-semibold">
                    Specific Practical Tool / Specification
                  </th>
                  <th className="py-3.5 px-4 font-semibold">Target Stage</th>
                  <th className="py-3.5 px-4 font-semibold">
                    Biomechanical Mechanism &amp; How It Improves Handwriting
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECEAE4] bg-white">
                {EQUIPMENT_MATRIX.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#F8F7F4] transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-[#191918]">
                      {row.category}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-amber-900">
                      {row.specification}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-[#575653]">
                      {row.targetStage}
                    </td>
                    <td className="py-3.5 px-4 text-[#575653] leading-relaxed max-w-md">
                      {row.mechanism}{' '}
                      {row.linkUrl && (
                        <a
                          href={row.linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-0.5 underline decoration-stone-300 text-amber-800 hover:text-amber-950 font-medium"
                        >
                          [{row.linkText}]
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  )
}
