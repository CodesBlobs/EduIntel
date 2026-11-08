import React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { X, Printer, CheckCircle2, AlertTriangle } from 'lucide-react'
import {
  COHORT_NORMS,
  INITIAL_AUDIT_ITEMS,
  SYMPTOM_TOOLS,
  TEST_SETS,
} from '@/data/handwritingData'
import { useLabStore } from '@/store/useLabStore'
import { Badge, Button } from '@/components/ui/primitives'

export const ReportModal: React.FC = () => {
  const {
    isReportModalOpen,
    setReportModalOpen,
    selectedCohort,
    activeSetKey,
    latestEval,
    auditCheckedMap,
    selectedSymptom,
    clinicalNotesHtml,
  } = useLabStore()

  if (!isReportModalOpen) return null

  const norm = COHORT_NORMS[selectedCohort]
  const testSet = TEST_SETS[activeSetKey]
  const failedAuditItems = INITIAL_AUDIT_ITEMS.filter(
    (i) => !auditCheckedMap[i.id]
  )
  const passedCount = INITIAL_AUDIT_ITEMS.length - failedAuditItems.length
  const toolPrescription = SYMPTOM_TOOLS[selectedSymptom]

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ duration: 0.18 }}
          className="relative w-full max-w-2xl max-h-[88vh] overflow-y-auto custom-scrollbar rounded-2xl bg-white border border-[#E6E4DD] shadow-2xl p-6 sm:p-8 space-y-6"
        >
          {/* Top Bar */}
          <div className="flex items-start justify-between gap-4 border-b border-[#ECEAE4] pb-4">
            <div>
              <Badge variant="amber">NSW NAPLAN 2028 Diagnostic Report</Badge>
              <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#191918] mt-1">
                Handwriting Readiness &amp; OT Remediation Summary
              </h3>
              <p className="text-xs text-[#575653]">
                Cohort: {norm.label} · Active Protocol: {testSet.shortLabel} ({testSet.shortTitle})
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="soft"
                size="sm"
                onClick={() => window.print()}
              >
                <Printer className="w-3.5 h-3.5" />
                Print / Save PDF
              </Button>
              <button
                type="button"
                onClick={() => setReportModalOpen(false)}
                className="p-1.5 rounded-xl text-[#575653] hover:bg-[#F4F3EF] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Speed Telemetry Summary */}
          <div className="grid grid-cols-3 gap-3 rounded-2xl bg-[#FBFBFA] p-4 border border-[#E6E4DD] text-center">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-[#8A8884]">
                Net Copy/Write Speed
              </div>
              <div className="font-mono text-lg font-bold text-[#191918] mt-0.5">
                {latestEval.netLpm.toFixed(0)} LPM ({latestEval.netWpm.toFixed(1)} WPM)
              </div>
              <div className="text-[11px] text-[#575653]">
                Target: {norm.minLpm}–{norm.targetLpm} LPM
              </div>
            </div>
            <div className="border-x border-[#ECEAE4]">
              <div className="text-[10px] uppercase tracking-wider text-[#8A8884]">
                30-Min NAPLAN Projection
              </div>
              <div className="font-mono text-lg font-bold text-emerald-700 mt-0.5">
                ~{latestEval.projected30MinWords} words
              </div>
              <div className="text-[11px] text-[#575653]">
                Benchmark: {norm.naplan30MinTarget} words
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-[#8A8884]">
                10-Point Legibility Audit
              </div>
              <div className="font-mono text-lg font-bold text-amber-700 mt-0.5">
                {passedCount} / 10 Passed
              </div>
              <div className="text-[11px] text-[#575653]">
                {failedAuditItems.length} priority fixes
              </div>
            </div>
          </div>

          {/* Unchecked Audit Bottlenecks */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#575653]">
              Priority NSW Foundation Style Remediation Items
            </h4>
            {failedAuditItems.length === 0 ? (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-50/70 border border-emerald-200 p-3 text-xs text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                All 10 NSW Foundation Style legibility and grip criteria passed.
              </div>
            ) : (
              <div className="space-y-2">
                {failedAuditItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-2.5 rounded-xl bg-[#FBFBFA] border border-[#E6E4DD] p-3 text-xs"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-semibold text-[#191918]">
                        {item.shortTitle}:
                      </strong>{' '}
                      <span className="text-[#575653]">{item.fix}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Equipment Prescription */}
          <div className="rounded-xl bg-amber-50/50 border border-amber-200/80 p-4 space-y-1.5 text-xs">
            <div className="font-semibold text-[#191918]">
              Selected Equipment Prescription: {toolPrescription.title}
            </div>
            <div className="text-amber-900 font-medium">
              Tools: {toolPrescription.tools.join(' · ')}
            </div>
          </div>

          {/* Tiptap Clinical Notes */}
          {clinicalNotesHtml && (
            <div className="space-y-1.5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#575653]">
                Clinical Observation &amp; Session Notes
              </h4>
              <div
                className="rounded-xl bg-[#FBFBFA] border border-[#E6E4DD] p-4 text-xs text-[#191918] leading-relaxed space-y-1"
                dangerouslySetInnerHTML={{ __html: clinicalNotesHtml }}
              />
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
