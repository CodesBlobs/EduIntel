import React from 'react'
import { motion } from 'motion/react'
import {
  Check,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
} from 'lucide-react'
import { INITIAL_AUDIT_ITEMS, MethodCategory } from '@/data/handwritingData'
import { useLabStore } from '@/store/useLabStore'
import { useAudit, useSaveAudit } from '@/hooks/useBackendQueries'
import { Badge, Button, Card } from '@/components/ui/primitives'
import { cn } from '@/lib/utils'

export const LegibilityAuditView: React.FC = () => {
  const {
    activeStudentId,
    auditCheckedMap,
    toggleAuditItem,
    setAllAuditItems,
    setAuditCheckedMap,
    setActiveTab,
    setSelectedMethodCategory,
  } = useLabStore()

  const { data: dbAudit, isLoading: isAuditLoading } = useAudit(activeStudentId)
  const saveAuditMut = useSaveAudit()

  // Sync from DB when loaded
  React.useEffect(() => {
    if (dbAudit?.checked_items && Object.keys(dbAudit.checked_items).length > 0) {
      setAuditCheckedMap(dbAudit.checked_items)
    }
  }, [dbAudit, setAuditCheckedMap])

  const handleToggle = (id: string) => {
    const nextMap = {
      ...auditCheckedMap,
      [id]: !auditCheckedMap[id],
    }
    toggleAuditItem(id)
    saveAuditMut.mutate({ studentId: activeStudentId, checkedItems: nextMap })
  }

  const handleSetAll = (checked: boolean) => {
    const nextMap: Record<string, boolean> = {}
    INITIAL_AUDIT_ITEMS.forEach((item) => {
      nextMap[item.id] = checked
    })
    setAllAuditItems(checked)
    saveAuditMut.mutate({ studentId: activeStudentId, checkedItems: nextMap })
  }

  const passedItems = INITIAL_AUDIT_ITEMS.filter(
    (item) => auditCheckedMap[item.id]
  )
  const failedItems = INITIAL_AUDIT_ITEMS.filter(
    (item) => !auditCheckedMap[item.id]
  )
  const passedCount = passedItems.length

  const jumpToMethod = (cat: MethodCategory) => {
    setSelectedMethodCategory(cat)
    setActiveTab('view-improvement-methods')
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#ECEAE4] pb-5">
          <div className="space-y-2 max-w-3xl">
            <Badge variant="emerald">NSW Foundation Style Diagnostic Checklist</Badge>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#191918] tracking-tight">
              10-Point NSW Foundation Style Legibility &amp; Biomechanical Grip Audit
            </h2>
            <p className="text-xs sm:text-sm text-[#575653] leading-relaxed">
              Speed without legibility still loses marks in NAPLAN Writing if markers cannot distinguish vowel pairs, sentence boundaries, or paragraph breaks. Inspect a 1-page handwritten sample from your child and check every criterion they currently pass:
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="soft"
              size="sm"
              onClick={() => handleSetAll(true)}
            >
              <Check className="w-3.5 h-3.5 text-emerald-700" />
              Check All
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleSetAll(false)}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Uncheck All
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left 7 Cols: Interactive 10-Point Checklist */}
          <div className="lg:col-span-7 space-y-2.5">
            {INITIAL_AUDIT_ITEMS.map((item) => {
              const isChecked = !!auditCheckedMap[item.id]
              return (
                <motion.div
                  key={item.id}
                  layout
                  onClick={() => handleToggle(item.id)}
                  className={cn(
                    'group flex items-start gap-3.5 p-4 rounded-2xl border transition-all cursor-pointer select-none',
                    isChecked
                      ? 'bg-[#FBFBFA] border-[#E4E2DC] hover:border-emerald-300/80'
                      : 'bg-amber-50/35 border-amber-200/80 hover:border-amber-300'
                  )}
                >
                  <div
                    className={cn(
                      'mt-0.5 w-5 h-5 rounded-lg flex items-center justify-center border transition-all shrink-0',
                      isChecked
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-2xs'
                        : 'bg-white border-stone-300 group-hover:border-amber-500'
                    )}
                  >
                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                  </div>

                  <div className="space-y-1.5 text-xs flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span
                        className={cn(
                          'font-semibold text-sm transition-colors',
                          isChecked ? 'text-[#191918]' : 'text-amber-950'
                        )}
                      >
                        {item.title}
                      </span>
                      <Badge variant={isChecked ? 'neutral' : 'amber'}>
                        {item.category}
                      </Badge>
                    </div>

                    <p className="text-[#575653] leading-relaxed">{item.desc}</p>

                    {!isChecked && (
                      <div className="pt-1.5 flex items-center justify-between gap-2 text-[11px] text-amber-900 bg-white/85 px-3 py-2 rounded-xl border border-amber-200/70">
                        <span>
                          <strong className="font-semibold">Fix:</strong> {item.fix}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Right 5 Cols: Smooth Light Notion-Style Sticky Live Audit Score & Remediation Prescription */}
          <div className="lg:col-span-5 rounded-2xl bg-[#F8F7F4] text-[#191918] p-6 border border-[#E6E4DD] space-y-5 lg:sticky lg:top-20">
            <div className="flex items-center justify-between border-b border-[#E6E4DD] pb-3.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#575653] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Live NSW Foundation Style Audit
              </span>
              <span className="font-mono text-xl font-bold text-[#191918]">
                {passedCount} / 10 Passed
              </span>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="h-2 w-full rounded-full bg-black/[0.06] overflow-hidden">
                <div
                  className={cn(
                    'h-full transition-all duration-300 rounded-full',
                    passedCount >= 9
                      ? 'bg-emerald-600'
                      : passedCount >= 6
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                  )}
                  style={{ width: `${passedCount * 10}%` }}
                />
              </div>
              <div className="flex items-center gap-2">
                {passedCount >= 9 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : passedCount >= 6 ? (
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <div
                  className={cn(
                    'font-semibold text-sm sm:text-base',
                    passedCount >= 9
                      ? 'text-emerald-900'
                      : passedCount >= 6
                        ? 'text-amber-900'
                        : 'text-rose-900'
                  )}
                >
                  {passedCount >= 9
                    ? 'Excellent NSW Foundation Style Compliance'
                    : passedCount >= 6
                      ? 'Moderate Biomechanical & Spacing Friction Detected'
                      : 'High Legibility & Ergonomic Intervention Needed'}
                </div>
              </div>
            </div>

            <p className="text-xs text-[#575653] leading-relaxed">
              Unchecked boxes represent the exact physical or visual bottlenecks slowing your child&apos;s writing or causing NAPLAN marker misreads.
            </p>

            <div className="rounded-xl bg-white p-4 border border-[#E6E4DD] space-y-3 shadow-2xs">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-[#575653]">
                Priority Remediation Fixes ({failedItems.length} Unchecked):
              </div>

              {failedItems.length === 0 ? (
                <div className="text-xs text-emerald-800 leading-relaxed py-2">
                  All 10 NSW Foundation Style criteria passed! Focus now on 40-minute timed persuasive stamina (Test Set D in the Live Test Lab).
                </div>
              ) : (
                <ul className="space-y-3 text-xs text-[#3D3C3A]">
                  {failedItems.map((f) => (
                    <li
                      key={f.id}
                      className="pb-2.5 border-b border-[#ECEAE4] last:border-none last:pb-0 space-y-1"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <strong className="font-semibold text-[#191918]">
                          {f.shortTitle}:
                        </strong>
                        <button
                          type="button"
                          onClick={() => jumpToMethod(f.relatedMethod)}
                          className="text-[11px] font-medium text-amber-800 hover:text-amber-950 hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                        >
                          Open Method
                          <ArrowRight className="w-2.5 h-2.5" />
                        </button>
                      </div>
                      <p className="text-[#575653] leading-relaxed text-[11.5px]">
                        {f.fix}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
