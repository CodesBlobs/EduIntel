import React, { useState } from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import {
  ExternalLink,
  BookOpen,
  TrendingUp,
  Award,
  FileSpreadsheet,
} from 'lucide-react'
import { COHORT_NORMS, CohortKey } from '@/data/handwritingData'
import { useLabStore } from '@/store/useLabStore'
import { Badge, Card } from '@/components/ui/primitives'
import { cn } from '@/lib/utils'

export const GovCriteriaNormsView: React.FC = () => {
  const { selectedCohort, setSelectedCohort, latestEval } = useLabStore()
  const [chartMode, setChartMode] = useState<'lpm' | 'volume'>('lpm')

  const orderedCohorts: CohortKey[] = ['year2', 'year3', 'year5', 'year7', 'year9']

  const chartData = orderedCohorts.map((key) => {
    const c = COHORT_NORMS[key]
    return {
      name: c.shortName,
      targetLpm: c.targetLpm,
      minLpm: c.minLpm,
      riskLpm: c.riskLpm,
      targetWords30m: c.naplan30MinTarget,
      minWords30m: c.naplan30MinMin,
      yourChildLpm: key === selectedCohort ? Math.round(latestEval.netLpm) : undefined,
    }
  })

  return (
    <div className="space-y-6">
      <Card className="p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="border-b border-[#ECEAE4] pb-5 space-y-2">
          <Badge variant="indigo">Official NSW Syllabus &amp; Clinical Benchmarks</Badge>
          <h2 className="text-2xl sm:text-3xl font-semibold text-[#191918] tracking-tight">
            Government Handwriting Criteria, Minimum Speed Norms (WPM / LPM) &amp; Australian Research
          </h2>
          <p className="text-xs sm:text-sm text-[#575653] leading-relaxed max-w-4xl">
            This reference consolidates the{' '}
            <strong className="font-semibold text-[#191918]">
              NSW Department of Education English K–10 Syllabus (NSW Foundation Style)
            </strong>
            , Australian occupational therapy norms (
            <a
              href="https://www.researchgate.net/publication/249435924_The_Handwriting_speed_test"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-stone-300 underline-offset-3 text-amber-800 hover:text-amber-950"
            >
              Wallen, Bonney &amp; Lennox HST
            </a>
            ;{' '}
            <a
              href="https://www.researchgate.net/publication/367257181_Handwriting_Speeds_of_4th-8th_Grade_Students"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-stone-300 underline-offset-3 text-amber-800 hover:text-amber-950"
            >
              Ziviani &amp; Elkins
            </a>
            ), and national literacy studies by{' '}
            <a
              href="https://www.ecu.edu.au/newsroom/articles/research/the-writing-is-on-the-wall-are-kids-ditching-pens-for-keyboards"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-stone-300 underline-offset-3 text-amber-800 hover:text-amber-950"
            >
              Assoc. Prof. Anabela Malpique (Edith Cowan University)
            </a>
            .
          </p>
        </div>

        {/* Master Speed & Volume Table */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-base font-semibold text-[#191918] flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-amber-700" />
              1. Minimum &amp; Target Handwriting Speed Norms by School Year (Australia &amp; NSW NAPLAN)
            </h3>
            <span className="text-[11px] text-[#8A8884]">
              Click any stage row to calibrate the Lab Evaluator to that year group
            </span>
          </div>

          <p className="text-xs text-[#575653] leading-relaxed bg-[#F6F5F1] px-4 py-2.5 rounded-xl border border-[#E6E4DD]">
            <em className="font-medium text-[#191918]">
              Note on Copy Speed vs. Compositional Speed:
            </em>{' '}
            Clinical tests like the 3-minute{' '}
            <strong className="font-semibold text-[#191918]">
              Handwriting Speed Test (HST)
            </strong>{' '}
            measure near-point copying in{' '}
            <strong className="font-semibold text-[#191918]">
              Letters Per Minute (LPM)
            </strong>{' '}
            (divide LPM by 5 for standard 5-character Words Per Minute). During an exam like NAPLAN Writing, where a student must simultaneously plan ideas, recall spelling, and construct syntax,{' '}
            <strong className="font-semibold text-amber-900">
              compositional WPM is typically 65%–75% of raw copy WPM
            </strong>
            .
          </p>

          <div className="overflow-x-auto rounded-2xl border border-[#E6E4DD]">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F4F3EF] text-[#191918] border-b border-[#E6E4DD]">
                  <th className="py-3.5 px-4 font-semibold">NSW Stage &amp; Year</th>
                  <th className="py-3.5 px-4 font-semibold">
                    Copy Speed Norm (Letters/Min - LPM)
                  </th>
                  <th className="py-3.5 px-4 font-semibold">Copy Speed (Words/Min - WPM)</th>
                  <th className="py-3.5 px-4 font-semibold">
                    NAPLAN Compositional Speed (WPM)
                  </th>
                  <th className="py-3.5 px-4 font-semibold">30-Min Net Drafting Output</th>
                  <th className="py-3.5 px-4 font-semibold">
                    Official NSW Foundation Style Requirement
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECEAE4]">
                {orderedCohorts.map((key) => {
                  const row = COHORT_NORMS[key]
                  const isSelected = selectedCohort === key
                  return (
                    <tr
                      key={key}
                      onClick={() => setSelectedCohort(key)}
                      className={cn(
                        'transition-colors cursor-pointer',
                        isSelected
                          ? 'bg-amber-50/70'
                          : key === 'year5'
                            ? 'bg-[#FAF9F5] hover:bg-[#F4F3EF]/70'
                            : 'bg-white hover:bg-[#F8F7F4]'
                      )}
                    >
                      <td className="py-3.5 px-4 font-semibold text-[#191918]">
                        <div className="flex items-center gap-2">
                          <span>{row.stageTag}</span>
                          {isSelected && (
                            <span className="w-2 h-2 rounded-full bg-amber-600 shrink-0" />
                          )}
                        </div>
                        {row.policyBadge && (
                          <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-100/80 text-amber-900">
                            {row.policyBadge}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono">
                        <span className="font-bold text-[#191918]">
                          {row.minLpm} – {row.targetLpm} LPM
                        </span>
                        <br />
                        <span className="text-[11px] text-rose-600 font-medium">
                          Risk: &lt;{row.riskLpm} LPM
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium text-[#191918]">
                        {row.copyWpmMin} – {row.copyWpmMax} WPM
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-amber-800">
                        {row.compWpmMin} – {row.compWpmTarget} WPM
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-emerald-800">
                        {row.naplan30MinMin} – {row.naplan30MinTarget}+ words
                      </td>
                      <td className="py-3.5 px-4 text-[#575653] leading-relaxed max-w-md">
                        {row.requirementText}{' '}
                        <a
                          href={row.requirementUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-0.5 underline decoration-stone-300 underline-offset-2 text-amber-800 hover:text-amber-950 font-medium"
                        >
                          [{row.requirementLinkLabel}]
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Chart + 4 Core Research Pillars Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2 items-start">
          {/* Left 6 Cols: Recharts Growth Curve */}
          <div className="lg:col-span-6 rounded-2xl bg-[#FBFBFA] p-5 border border-[#E6E4DD] space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#8A8884]">
                  Recharts Interactive Telemetry
                </span>
                <h4 className="font-semibold text-[#191918] text-sm flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  Australian Growth Curve: Copy Speed (LPM) vs NAPLAN Target
                </h4>
              </div>

              <div className="inline-flex rounded-xl bg-[#EFECE6] p-0.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => setChartMode('lpm')}
                  className={cn(
                    'px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer',
                    chartMode === 'lpm'
                      ? 'bg-white text-[#191918] shadow-2xs'
                      : 'text-[#575653]'
                  )}
                >
                  Speed (LPM)
                </button>
                <button
                  type="button"
                  onClick={() => setChartMode('volume')}
                  className={cn(
                    'px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer',
                    chartMode === 'volume'
                      ? 'bg-white text-[#191918] shadow-2xs'
                      : 'text-[#575653]'
                  )}
                >
                  30-Min Word Output
                </button>
              </div>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                {chartMode === 'lpm' ? (
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 16, left: -12, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient id="targetGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#059669" stopOpacity={0.22} />
                        <stop offset="95%" stopColor="#059669" stopOpacity={0.01} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ECEAE4" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11, fill: '#575653' }}
                      axisLine={{ stroke: '#E2E0D8' }}
                    />
                    <YAxis
                      domain={[0, 135]}
                      tick={{ fontSize: 11, fill: '#575653' }}
                      axisLine={{ stroke: '#E2E0D8' }}
                      tickFormatter={(v) => `${v}`}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid #E6E4DD',
                        fontSize: '12px',
                        backgroundColor: '#FFFFFF',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                    <Area
                      type="monotone"
                      dataKey="targetLpm"
                      name="Target Exam Readiness (LPM)"
                      stroke="#059669"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#targetGrad)"
                    />
                    <Area
                      type="monotone"
                      dataKey="minLpm"
                      name="Minimum Australian Norm Floor (LPM)"
                      stroke="#d97706"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      fill="none"
                    />
                    <Area
                      type="monotone"
                      dataKey="riskLpm"
                      name="Clinical Risk Threshold (LPM)"
                      stroke="#e11d48"
                      strokeWidth={1.5}
                      strokeDasharray="2 3"
                      fill="none"
                    />
                  </AreaChart>
                ) : (
                  <BarChart
                    data={chartData}
                    margin={{ top: 10, right: 16, left: -8, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#ECEAE4" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#575653' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#575653' }} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid #E6E4DD',
                        fontSize: '12px',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                    <Bar
                      dataKey="minWords30m"
                      name="Minimum 30-Min Output (Words)"
                      fill="#d97706"
                      radius={[6, 6, 0, 0]}
                    />
                    <Bar
                      dataKey="targetWords30m"
                      name="Target 30-Min NAPLAN Output (Words)"
                      fill="#191918"
                      radius={[6, 6, 0, 0]}
                    />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right 6 Cols: 4 Core Research Pillars */}
          <div className="lg:col-span-6 space-y-3 text-xs text-[#575653]">
            <h4 className="font-semibold text-[#191918] text-sm flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-amber-700" />
              4 Core Government &amp; Academic Research Pillars
            </h4>

            <div className="rounded-xl bg-[#FBFBFA] p-4 border border-[#E6E4DD] space-y-1.5">
              <div className="font-semibold text-[#191918]">
                1. NSW Department of Education: 1-Hour Daily Paper Mandate (Nov 2026)
              </div>
              <p className="leading-relaxed">
                New NSW public school guidelines recommend a{' '}
                <strong className="font-semibold text-[#191918]">
                  minimum of 1 hour per day of learning using pen and paper
                </strong>{' '}
                after a NSW Government research fund found only one-third of primary parents believe classroom technology benefits outweigh disadvantages (
                <a
                  href="https://www.insidestategovernment.com.au/nsw-leads-pen-and-paper-push-for-naplan-writing-tests/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-stone-300 text-amber-800 hover:text-amber-950"
                >
                  Inside State Government, Nov 2026
                </a>
                ).
              </p>
            </div>

            <div className="rounded-xl bg-[#FBFBFA] p-4 border border-[#E6E4DD] space-y-1.5">
              <div className="font-semibold text-[#191918]">
                2. Edith Cowan University (Malpique et al., 2023–2026): Muscle Memory &amp; Spelling
              </div>
              <p className="leading-relaxed">
                Large-scale Australian classroom studies (544 Year 2 students across 47 classrooms) by Assoc. Prof. Anabela Malpique prove that primary children write{' '}
                <strong className="font-semibold text-[#191918]">
                  longer and higher-quality texts by hand than on keyboards
                </strong>
                , and that handwriting automaticity directly strengthens orthographic spelling memory by freeing cognitive load (
                <a
                  href="https://educationhq.com/news/shaping-literacy-the-importance-of-handwriting-in-primary-and-secondary-settings-173139/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-stone-300 text-amber-800 hover:text-amber-950"
                >
                  EducationHQ
                </a>
                ;{' '}
                <a
                  href="http://www.iier.org.au/iier33/malpique.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-stone-300 text-amber-800 hover:text-amber-950"
                >
                  IIER Study PDF
                </a>
                ).
              </p>
            </div>

            <div className="rounded-xl bg-[#FBFBFA] p-4 border border-[#E6E4DD] space-y-1.5">
              <div className="font-semibold text-[#191918]">
                3. CESE NSW Report: The 5-WPM Typing vs Handwriting Threshold
              </div>
              <p className="leading-relaxed">
                Research by the NSW Centre for Education Statistics and Evaluation (
                <a
                  href="https://education.nsw.gov.au/content/dam/main-education/about-us/educational-data/cese/2021-online-writing-tests-for-primary-students.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-stone-300 text-amber-800 hover:text-amber-950"
                >
                  CESE Online Writing Report
                </a>
                ) and University of Sydney economist Assoc. Prof. Marian Vidal-Fernandez shows that testing primary students online when daily classroom work is handwritten depresses scores for students who lack touch-typing automaticity.
              </p>
            </div>

            <div className="rounded-xl bg-[#FBFBFA] p-4 border border-[#E6E4DD] space-y-1.5">
              <div className="font-semibold text-[#191918] flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-emerald-700" />
                4. Berninger &amp; Winn Working Memory Model: The 60-LPM Automaticity Gate
              </div>
              <p className="leading-relaxed">
                Neurocognitive literacy models show that until sub-lexical stroke production crosses ~60 Letters Per Minute, graphomotor execution competes directly with the prefrontal cortex&apos;s idea generation and rhetorical planning buffers.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
