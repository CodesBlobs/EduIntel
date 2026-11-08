import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'motion/react'
import {
  Timer,
  BarChart3,
  CheckSquare,
  Sparkles,
  Wrench,
  ExternalLink,
  FileCheck2,
  Play,
} from 'lucide-react'
import { LabTabId, useLabStore } from '@/store/useLabStore'
import { INITIAL_AUDIT_ITEMS } from '@/data/handwritingData'
import { Badge, Button } from '@/components/ui/primitives'
import { LiveTestLabView } from '@/components/views/LiveTestLabView'
import { GovCriteriaNormsView } from '@/components/views/GovCriteriaNormsView'
import { LegibilityAuditView } from '@/components/views/LegibilityAuditView'
import { ImprovementMethodsView } from '@/components/views/ImprovementMethodsView'
import { ToolsErgonomicsView } from '@/components/views/ToolsErgonomicsView'
import { ReportModal } from '@/components/ReportModal'
import { BackendSyncProvider } from '@/components/BackendSyncProvider'
import { StudentSwitcher } from '@/components/StudentSwitcher'
import { DbStatusBadge } from '@/components/DbStatusBadge'
import { TopAnnouncementBar } from '@/components/TopAnnouncementBar'
import { StyleSwitcherBar } from '@/components/variants/StyleSwitcherBar'
import { LandingStyleKey } from '@/components/variants/types'
import { trackPageView, trackEvent } from '@/lib/analytics'
import { cn } from '@/lib/utils'

const queryClient = new QueryClient()

interface NavTabItem {
  id: LabTabId
  label: string
  shortLabel: string
  icon: React.FC<{ className?: string }>
}

const NAV_TABS: NavTabItem[] = [
  {
    id: 'view-test-lab',
    label: 'Test Lab',
    shortLabel: 'Test Lab',
    icon: Timer,
  },
  {
    id: 'view-gov-criteria',
    label: 'Speed Norms',
    shortLabel: 'Speed Norms',
    icon: BarChart3,
  },
  {
    id: 'view-legibility-audit',
    label: 'Legibility Audit',
    shortLabel: 'Legibility Audit',
    icon: CheckSquare,
  },
  {
    id: 'view-improvement-methods',
    label: 'Methods',
    shortLabel: 'Methods',
    icon: Sparkles,
  },
  {
    id: 'view-tools-ergonomics',
    label: 'Pens & OT Tools',
    shortLabel: 'Pens & Tools',
    icon: Wrench,
  },
]

function HandwritingLabWorkspace() {
  const {
    activeTab,
    setActiveTab,
    auditCheckedMap,
    setReportModalOpen,
    landingStyle,
    setLandingStyle,
  } = useLabStore()

  const handleSelectStyle = (style: LandingStyleKey) => {
    setLandingStyle(style)
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      if (style !== 'classic') {
        url.searchParams.set('landing', style)
      } else {
        url.searchParams.delete('landing')
        url.searchParams.delete('style')
      }
      window.history.replaceState({}, '', url.toString())
    }
  }

  const passedAuditCount = INITIAL_AUDIT_ITEMS.filter(
    (i) => auditCheckedMap[i.id]
  ).length

  const handleSwitchTab = (tabId: LabTabId) => {
    setActiveTab(tabId)
    trackPageView(`/${tabId}`, tabId)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div
      className={cn(
        'min-h-screen flex flex-col selection:bg-stone-200 transition-colors duration-200',
        landingStyle === 'linear'
          ? 'bg-[#090A0C] text-zinc-100'
          : landingStyle === 'mathspace'
            ? 'bg-[#F8FAFC] text-slate-900'
            : landingStyle === 'monday'
              ? 'bg-[#F7F9FC] text-stone-900'
              : landingStyle === 'duolingo'
                ? 'bg-[#F7FCF2] text-stone-900'
                : 'bg-[#FBFBFA] text-[#191918]'
      )}
    >
      {/* 1. TOP ANNOUNCEMENT / NEWS BAR (plan.md Section 2) */}
      <TopAnnouncementBar />

      {/* SUBTLE NOTION-STYLE CONTEXT STRIP */}
      <div className="bg-[#F4F3EF] text-[#575653] text-[11.5px] py-1.5 px-4 border-b border-[#E8E7E2]">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 truncate">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white text-[#191918] border border-[#E2E0D8]">
              NAPLAN 2028 Reform
            </span>
            <span className="truncate">
              Calibrated to <strong className="font-medium text-[#191918]">NSW DoE Stage 1–5 Foundation Style</strong> &amp; <strong className="font-medium text-[#191918]">Australian HST Clinical Norms</strong>
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 shrink-0">
            <DbStatusBadge />
            <a
              href="https://education.nsw.gov.au/teaching-and-learning/curriculum/english/planning-programming-and-assessing-english-k-6/other-english-k-6-resources"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#575653] hover:text-[#191918] transition-colors inline-flex items-center gap-1 font-medium"
            >
              NSW K–6 Syllabus Guides
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://www.nsw.gov.au/ministerial-releases/new-south-wales-leads-push-for-return-to-pen-and-paper-naplan-writing-tests"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#575653] hover:text-[#191918] transition-colors inline-flex items-center gap-1 font-medium"
            >
              2028 Paper Policy
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* CLEAN NORMAL STICKY NAVBAR (Notion / Figma style) */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-[#EAE9E4]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 gap-4">
            {/* Left: Clean Brand Identity */}
            <button
              type="button"
              onClick={() => handleSwitchTab('view-test-lab')}
              className="flex items-center gap-2.5 text-left cursor-pointer group shrink-0"
            >
              <div className="w-7 h-7 rounded-lg bg-[#191918] flex items-center justify-center text-white font-mono font-semibold text-xs shadow-2xs group-hover:bg-[#2F2F2D] transition-colors">
                HW
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sm tracking-tight text-[#191918]">
                  HandwritingReadiness
                </span>
                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-[#F4F3EF] text-[#575653] border border-black/[0.06]">
                  NSW
                </span>
              </div>
            </button>

            {/* Center: Normal Clean Navigation Links */}
            <nav
              className="hidden md:flex items-center gap-1"
              aria-label="Main Lab Navigation"
            >
              {NAV_TABS.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleSwitchTab(tab.id)}
                    className={cn(
                      'relative px-3 py-1.5 rounded-lg text-[13px] font-medium transition-colors flex items-center gap-1.5 cursor-pointer select-none whitespace-nowrap',
                      isActive
                        ? 'text-[#191918]'
                        : 'text-[#686763] hover:text-[#191918] hover:bg-[#F4F3EF]/60'
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="mainNavTabPill"
                        transition={{
                          type: 'spring',
                          stiffness: 450,
                          damping: 34,
                        }}
                        className="absolute inset-0 rounded-lg bg-[#F2F1EC]"
                      />
                    )}
                    <Icon
                      className={cn(
                        'relative z-10 w-3.5 h-3.5',
                        isActive ? 'text-[#191918]' : 'text-[#8A8884]'
                      )}
                    />
                    <span className="relative z-10">{tab.label}</span>
                    {tab.id === 'view-legibility-audit' && (
                      <span
                        className={cn(
                          'relative z-10 text-[10px] font-mono px-1.5 py-0.2 rounded-md border',
                          isActive
                            ? 'bg-white text-[#191918] border-black/[0.08]'
                            : 'bg-[#F4F3EF] text-[#575653] border-transparent'
                        )}
                      >
                        {passedAuditCount}/10
                      </span>
                    )}
                  </button>
                )
              })}

              {/* Reports Navigation Link (plan.md Section 3) */}
              <button
                type="button"
                onClick={() => setReportModalOpen(true)}
                className="relative px-3 py-1.5 rounded-lg text-[13px] font-medium text-[#686763] hover:text-[#191918] hover:bg-[#F4F3EF]/60 transition-colors flex items-center gap-1.5 cursor-pointer select-none whitespace-nowrap"
                title="View Diagnostic Summary & Print PDF"
              >
                <FileCheck2 className="w-3.5 h-3.5 text-[#8A8884]" />
                <span>Reports</span>
              </button>
            </nav>

            {/* Right: Clean Actions (plan.md Section 3) */}
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="hidden lg:block">
                <StudentSwitcher />
              </div>

              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={() => {
                  handleSwitchTab('view-test-lab')
                  window.setTimeout(() => {
                    document.getElementById('assessment-bench')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }, 100)
                }}
                className="rounded-xl px-4 py-2 font-semibold bg-[#191918] text-white hover:bg-[#2F2F2D] shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Test</span>
              </Button>
            </div>
          </div>

          {/* Mobile Navigation Bar (Only shown on small screens < md) */}
          <div className="flex md:hidden items-center justify-between border-t border-[#ECEAE4] py-1.5 gap-2">
            <div className="flex overflow-x-auto custom-scrollbar gap-1 flex-1">
              {NAV_TABS.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleSwitchTab(tab.id)}
                    className={cn(
                      'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer',
                      isActive
                        ? 'bg-[#F2F1EC] text-[#191918] font-semibold'
                        : 'text-[#686763] hover:text-[#191918]'
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.shortLabel}</span>
                  </button>
                )
              })}
              <button
                type="button"
                onClick={() => setReportModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer text-[#686763] hover:text-[#191918]"
              >
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>Reports</span>
              </button>
            </div>
            <div className="shrink-0 scale-90 origin-right">
              <StudentSwitcher />
            </div>
          </div>
        </div>
      </header>

      {/* MAIN WORKSPACE CONTENT */}
      <main className="flex-grow max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            {activeTab === 'view-test-lab' && <LiveTestLabView />}
            {activeTab === 'view-gov-criteria' && <GovCriteriaNormsView />}
            {activeTab === 'view-legibility-audit' && <LegibilityAuditView />}
            {activeTab === 'view-improvement-methods' && (
              <ImprovementMethodsView />
            )}
            {activeTab === 'view-tools-ergonomics' && <ToolsErgonomicsView />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* PRINTABLE CLINICAL REPORT MODAL */}
      <ReportModal />

      {/* REFINED NOTION/FIGMA-STYLE FOOTER */}
      <footer className="bg-[#F4F3EF] text-[#575653] text-xs border-t border-[#E6E4DD] mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#191918] flex items-center justify-center text-amber-400 font-mono font-bold text-[11px]">
                HW
              </div>
              <span className="font-semibold text-[#191918] text-sm">
                HandwritingReadiness<span className="text-amber-700">.NSW</span>
              </span>
            </div>
            <p className="leading-relaxed text-xs text-[#575653]">
              Dedicated NSW NAPLAN Handwriting Assessment &amp; Remediation Lab. Built on official NSW Department of Education Foundation Style guides and Australian occupational therapy norms.
            </p>
          </div>

          <div className="space-y-2">
            <div className="font-semibold text-[#191918] uppercase tracking-wider text-[11px]">
              Official NSW Government Guides
            </div>
            <ul className="space-y-1.5">
              <li>
                <a
                  href="https://education.nsw.gov.au/content/dam/main-education/public-schools/going-to-a-public-school/media/documents/foundationwriting.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#191918] underline decoration-stone-300 underline-offset-3 inline-flex items-center gap-1"
                >
                  NSW Foundation Style Writing Guide (PDF)
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://education.nsw.gov.au/content/dam/main-education/en/home/teaching-and-learning/curriculum/english/documents/english-s2-handwriting-and-digital-transcription-instructional-sequence.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#191918] underline decoration-stone-300 underline-offset-3 inline-flex items-center gap-1"
                >
                  Stage 2 Handwriting &amp; Digital Transcription Sequence
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://education.nsw.gov.au/teaching-and-learning/curriculum/english/planning-programming-and-assessing-english-k-6/other-english-k-6-resources"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#191918] underline decoration-stone-300 underline-offset-3 inline-flex items-center gap-1"
                >
                  NSW DoE K–6 Handwriting Resources Hub
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="font-semibold text-[#191918] uppercase tracking-wider text-[11px]">
              Academic &amp; Clinical Research Sources
            </div>
            <ul className="space-y-1.5">
              <li>
                <a
                  href="https://www.researchgate.net/publication/249435924_The_Handwriting_speed_test"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#191918] underline decoration-stone-300 underline-offset-3 inline-flex items-center gap-1"
                >
                  Wallen, Bonney &amp; Lennox — Handwriting Speed Test (HST)
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.ecu.edu.au/newsroom/articles/research/the-writing-is-on-the-wall-are-kids-ditching-pens-for-keyboards"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#191918] underline decoration-stone-300 underline-offset-3 inline-flex items-center gap-1"
                >
                  Assoc. Prof. Anabela Malpique (ECU) Hybrid Writer Study
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://education.nsw.gov.au/content/dam/main-education/about-us/educational-data/cese/2021-online-writing-tests-for-primary-students.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#191918] underline decoration-stone-300 underline-offset-3 inline-flex items-center gap-1"
                >
                  NSW CESE Online vs Paper Writing Report
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>

      {/* FLOATING DESIGN STYLE SWITCHER BAR (Duolingo, Notion, Monday, Linear, Mathspace, Classic) */}
      <StyleSwitcherBar currentStyle={landingStyle} onSelectStyle={handleSelectStyle} />
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BackendSyncProvider>
        <HandwritingLabWorkspace />
      </BackendSyncProvider>
    </QueryClientProvider>
  )
}
