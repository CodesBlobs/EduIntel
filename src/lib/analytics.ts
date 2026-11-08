/**
 * Google Analytics 4 (GA4) Client Integration
 *
 * Configures gtag.js for tracking page views, test launches, completions, and custom interactions.
 * Provide VITE_GA_MEASUREMENT_ID in .env or via site configuration.
 */

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

const DEFAULT_MEASUREMENT_ID =
  (import.meta.env.VITE_GA_MEASUREMENT_ID as string) || 'G-XXXXXXXXXX'

let isInitialized = false

/**
 * Initializes Google Analytics 4 by dynamically injecting the gtag script if needed.
 */
export function initGA(measurementId: string = DEFAULT_MEASUREMENT_ID): void {
  if (typeof window === 'undefined' || isInitialized) return
  if (!measurementId || measurementId === 'G-XXXXXXXXXX') {
    // If placeholder or not provided, still initialize dummy gtag to prevent errors
    window.dataLayer = window.dataLayer || []
    window.gtag = function () {
      window.dataLayer?.push(arguments)
    }
    console.info('[Analytics] Google Analytics initialized in dev/standby mode (Set VITE_GA_MEASUREMENT_ID to activate live tracking).')
    isInitialized = true
    return
  }

  // Inject gtag.js script tag
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
  document.head.appendChild(script)

  // Configure dataLayer & gtag
  window.dataLayer = window.dataLayer || []
  window.gtag = function () {
    window.dataLayer?.push(arguments)
  }

  window.gtag('js', new Date())
  window.gtag('config', measurementId, {
    send_page_view: true,
  })

  isInitialized = true
  console.info(`[Analytics] Google Analytics active with ID: ${measurementId}`)
}

/**
 * Sends a generic custom event to Google Analytics.
 */
export function trackEvent(
  eventName: string,
  eventParams?: Record<string, unknown>
): void {
  if (typeof window === 'undefined') return
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, eventParams || {})
  }
}

/**
 * Tracks a page or tab transition.
 */
export function trackPageView(pagePath: string, pageTitle?: string): void {
  trackEvent('page_view', {
    page_path: pagePath,
    page_title: pageTitle || document.title,
  })
}

/**
 * Tracks when a student starts a timed assessment.
 */
export function trackTestStarted(testSetKey: string, cohortKey: string): void {
  trackEvent('assessment_started', {
    test_set: testSetKey,
    cohort: cohortKey,
    timestamp: new Date().toISOString(),
  })
}

/**
 * Tracks when a student finishes and logs a timed assessment.
 */
export function trackTestCompleted(result: {
  testSetKey: string
  cohortKey: string
  netLpm: number
  netWpm: number
  status: string
}): void {
  trackEvent('assessment_completed', {
    test_set: result.testSetKey,
    cohort: result.cohortKey,
    net_lpm: result.netLpm,
    net_wpm: result.netWpm,
    status: result.status,
    timestamp: new Date().toISOString(),
  })
}

/**
 * Tracks audit checklist interactions.
 */
export function trackAuditProgress(passedCount: number, total: number = 10): void {
  trackEvent('audit_progress', {
    passed_count: passedCount,
    total_criteria: total,
    pass_rate_pct: Math.round((passedCount / total) * 100),
  })
}
