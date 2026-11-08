export type TestSetKey = 'setA' | 'setB' | 'setC' | 'setD' | 'setE'
export type CohortKey = 'year2' | 'year3' | 'year5' | 'year7' | 'year9'
export type FatigueLevel = 'none' | 'mild' | 'severe'
export type MethodCategory =
  | 'ALL'
  | 'biomechanics'
  | 'strokes'
  | 'cursive'
  | 'automaticity'
  | 'sensory'
  | 'cognitive'
export type SymptomKey =
  | 'heavy_pressure'
  | 'thumb_wrap'
  | 'floating_letters'
  | 'slow_drag'
  | 'smudging_left'

export interface TestSetConfig {
  id: TestSetKey
  shortLabel: string
  shortTitle: string
  badge: string
  title: string
  durationSec: number
  durationMin: number
  defaultUnit: 'words' | 'letters'
  defaultRaw: number
  isCopySet: boolean
  purpose: string
  instructions: string
  promptText: string
  scoringRule: string
  targetHint: string
}

export const TEST_SETS: Record<TestSetKey, TestSetConfig> = {
  setA: {
    id: 'setA',
    shortLabel: 'Set A · 60 Sec',
    shortTitle: 'Alphabet Recall',
    badge: 'Test Set A · 60-Second Sub-Lexical Automaticity (Berninger & Malpique Protocol)',
    title: '60-Second Alphabet Retrieval & Letterform Automaticity Sprint',
    durationSec: 60,
    durationMin: 1,
    defaultUnit: 'letters',
    defaultRaw: 62,
    isCopySet: true,
    purpose:
      'Measures how automatically your child can retrieve and form lowercase letters from memory without visual copying. Research by Berninger & Winn and Assoc. Prof. Anabela Malpique shows 60-second alphabet automaticity is the single strongest early predictor of compositional fluency.',
    instructions:
      "Ask your child to write the lowercase alphabet (a to z) in order from memory on lined paper as quickly and neatly as possible. If they finish 'z' before 60 seconds, they immediately continue with 'a, b, c...' until the timer rings.",
    promptText:
      'a b c d e f g h i j k l m n o p q r s t u v w x y z  (Repeat continuously from memory until the 60-second bell rings)',
    scoringRule:
      'Count only legible, correctly ordered lowercase letters formed in the first 60 seconds.',
    targetHint: 'Yr 2: 28+ letters · Yr 3: 42+ letters · Yr 5: 60+ letters · Yr 7–9: 85+ letters',
  },
  setB: {
    id: 'setB',
    shortLabel: 'Set B · 3 Min',
    shortTitle: 'HST Pangram Sprint',
    badge: 'Test Set B · 3-Minute Clinical Australian HST Protocol (Wallen, Bonney & Lennox)',
    title: '3-Minute Pangram Speed & Cursive Join Sprint',
    durationSec: 180,
    durationMin: 3,
    defaultUnit: 'letters',
    defaultRaw: 195,
    isCopySet: true,
    purpose:
      'Adapted from the gold-standard Australian Handwriting Speed Test (HST; Wallen, Bonney & Lennox, 1996). Because the pangram contains all 26 letters of the English alphabet (35 letters per sentence), it tests every anticlockwise, clockwise, and diagonal/horizontal cursive join under sustained motor load.',
    instructions:
      'Place this prompt in front of your child. Instruct them to copy the sentence repeatedly on lined paper for exactly 3 minutes at their normal rapid exam pace—without stopping to erase.',
    promptText:
      'The quick brown fox jumps over the lazy dog. (9 words / 35 letters per full line — repeat continuously for 3 minutes)',
    scoringRule:
      'Count total legible letters written in 3 minutes and divide by 3 to get Letters Per Minute (LPM), or enter total count and 3 minutes in the evaluator.',
    targetHint: '1 full line = 9 words (35 letters). 5.5 lines in 3 mins = ~64 LPM (Year 5 norm).',
  },
  setC: {
    id: 'setC',
    shortLabel: 'Set C · 5 Min',
    shortTitle: 'Near-Point Copy',
    badge: 'Test Set C · 5-Minute Near-Point Academic Passage Copy (Stage 2 & Stage 3)',
    title: '5-Minute Sustained Informational Passage Transcription',
    durationSec: 300,
    durationMin: 5,
    defaultUnit: 'words',
    defaultRaw: 68,
    isCopySet: true,
    purpose:
      'Measures near-point visual tracking, punctuation transfer, and fine-motor endurance over 5 continuous minutes when vocabulary and syntax are already provided (isolating pure motor transcription from idea generation).',
    instructions:
      'Have your child copy the passage below onto lined A4 paper for 5 minutes. Compare the neatness of their first two lines against their final two lines to detect grip fatigue.',
    promptText:
      'Across New South Wales classrooms, returning to daily pen-and-paper composition strengthens memory, sharpens spelling accuracy, and builds calm focus. While digital tablets allow rapid searching, sustained handwriting trains the brain to plan complete sentences before ink touches the page. Students who practise thirty minutes of deliberate handwriting each afternoon develop effortless fluency for forty-minute examinations. (56 words / 354 letters)',
    scoringRule:
      'Enter total words copied in 5 minutes. A drop in legibility after minute 3 indicates intrinsic hand muscle fatigue or excessive downward pen pressure.',
    targetHint: 'Passage contains 56 words (354 letters). If finished early, restart from sentence 1.',
  },
  setD: {
    id: 'setD',
    shortLabel: 'Set D · 10 Min',
    shortTitle: 'NAPLAN Free Write',
    badge: 'Test Set D · 10-Minute NAPLAN Persuasive Free-Composition Stamina',
    title: '10-Minute Unassisted Persuasive Argument Sprint (2028 Paper NAPLAN Format)',
    durationSec: 600,
    durationMin: 10,
    defaultUnit: 'words',
    defaultRaw: 112,
    isCopySet: false,
    purpose:
      'Measures true exam compositional speed (ideation + orthographic recall + handwriting execution simultaneously). In a 40-minute NAPLAN test, 10 minutes equals exactly one-third of the 30-minute drafting window.',
    instructions:
      'Give your child 2 minutes to jot 3 bullet points, then start the 10-minute timer to write an Introduction and Body Paragraph 1 on the prompt below without any dictionary or spellcheck.',
    promptText:
      "NAPLAN Prompt: 'Schools should replace at least one hour of daily tablet screen time with handwritten books and outdoor learning.' Do you agree or disagree? Write your persuasive opening and first body paragraph.",
    scoringRule:
      "Multiply your child's 10-minute word count by 2.8 (accounting for late-exam fatigue) to project their full 30-minute NAPLAN Writing output.",
    targetHint: 'Target for Year 5: 100–125 words in 10 minutes (~280–350 words over 30 mins).',
  },
  setE: {
    id: 'setE',
    shortLabel: 'Set E · 5 Min',
    shortTitle: 'Orthographic Dictation',
    badge: 'Test Set E · 5-Minute EAL/D Orthographic Dictation & Challenging Spelling',
    title: '5-Minute High-Modality Orthographic Dictation Test (ACARA Criterion 10)',
    durationSec: 300,
    durationMin: 5,
    defaultUnit: 'words',
    defaultRaw: 54,
    isCopySet: false,
    purpose:
      'Specifically designed for bilingual (LBOTE / EAL/D) students who rely on visual keyboard cues or spellcheck. Tests auditory-to-motor orthographic retrieval of challenging multisyllabic words.',
    instructions:
      'Read the 3 sentences below aloud at a steady pace (twice each) while your child writes them by hand on lined paper without seeing the text.',
    promptText:
      "Dictation Script (Read Aloud to Child): 1. Excessive dependence on digital screens is unequivocally detrimental to a student's sustained concentration. 2. Consequently, conscientious schools are reintroducing mandatory handwritten notebooks to strengthen foundational literacy. 3. Nevertheless, mastering both fluent handwriting and deliberate keyboarding remains indispensable for future academic success. (44 words total)",
    scoringRule:
      "Count total words written and count any misspelled words (especially: unequivocally, detrimental, conscientious, indispensable, consequently, nevertheless) in the 'Illegible / Misformed' box.",
    targetHint: 'Key Tier-2/3 words tested: unequivocally, detrimental, conscientious, indispensable.',
  },
}

export interface CohortNorm {
  key: CohortKey
  shortName: string
  label: string
  stageTag: string
  policyBadge?: string
  minLpm: number
  targetLpm: number
  riskLpm: number
  copyWpmMin: number
  copyWpmMax: number
  compWpmMin: number
  compWpmTarget: number
  naplan30MinMin: number
  naplan30MinTarget: number
  requirementText: string
  requirementUrl: string
  requirementLinkLabel: string
}

export const COHORT_NORMS: Record<CohortKey, CohortNorm> = {
  year2: {
    key: 'year2',
    shortName: 'Year 1–2',
    label: 'Year 1–2 (Stage 1 Foundation)',
    stageTag: 'Stage 1 (Years 1–2)',
    minLpm: 25,
    targetLpm: 38,
    riskLpm: 20,
    copyWpmMin: 5,
    copyWpmMax: 8,
    compWpmMin: 4,
    compWpmTarget: 6,
    naplan30MinMin: 90,
    naplan30MinTarget: 130,
    requirementText:
      'Unjoined NSW Foundation Style manuscript; dynamic tripod grip; correct starting points & anticlockwise/downward strokes.',
    requirementUrl:
      'https://education.nsw.gov.au/content/dam/main-education/public-schools/going-to-a-public-school/media/documents/foundationwriting.pdf',
    requirementLinkLabel: 'NSW Foundation Style manuscript',
  },
  year3: {
    key: 'year3',
    shortName: 'Year 3 (Paper)',
    label: 'Year 3 (Stage 2 Paper NAPLAN)',
    stageTag: 'Stage 2 (Year 3)',
    policyBadge: 'Paper NAPLAN',
    minLpm: 44,
    targetLpm: 55,
    riskLpm: 35,
    copyWpmMin: 9,
    copyWpmMax: 11,
    compWpmMin: 6,
    compWpmTarget: 8,
    naplan30MinMin: 160,
    naplan30MinTarget: 200,
    requirementText:
      'Transition to Stage 2 NSW Foundation Style pre-cursive & joined cursive (diagonal & horizontal joins).',
    requirementUrl:
      'https://education.nsw.gov.au/content/dam/main-education/en/home/teaching-and-learning/curriculum/english/documents/english-s2-handwriting-and-digital-transcription-instructional-sequence.pdf',
    requirementLinkLabel: 'Stage 2 NSW Foundation Style pre-cursive & joined cursive',
  },
  year5: {
    key: 'year5',
    shortName: 'Year 5 (2028 Paper)',
    label: 'Year 4–5 (2028 Paper Transition Cohort)',
    stageTag: 'Stage 3 (Year 5)',
    policyBadge: '2028 Paper Return',
    minLpm: 60,
    targetLpm: 75,
    riskLpm: 48,
    copyWpmMin: 12,
    copyWpmMax: 15,
    compWpmMin: 10,
    compWpmTarget: 12.5,
    naplan30MinMin: 280,
    naplan30MinTarget: 320,
    requirementText:
      'Fluent, automatic joined cursive; personal legible style at speed; Stage 3 hybrid transcription.',
    requirementUrl:
      'https://education.nsw.gov.au/teaching-and-learning/curriculum/english/planning-programming-and-assessing-english-k-6/other-english-k-6-resources',
    requirementLinkLabel: 'Stage 3 hybrid transcription',
  },
  year7: {
    key: 'year7',
    shortName: 'Year 7',
    label: 'Year 6–7 (Stage 3–4 Secondary Transition)',
    stageTag: 'Stage 4 (Year 7)',
    policyBadge: 'NSW Push Active',
    minLpm: 80,
    targetLpm: 98,
    riskLpm: 65,
    copyWpmMin: 16,
    copyWpmMax: 20,
    compWpmMin: 13,
    compWpmTarget: 16,
    naplan30MinMin: 380,
    naplan30MinTarget: 420,
    requirementText:
      'Sustained secondary examination endurance; zero hand cramping across 40-minute supervised tasks.',
    requirementUrl:
      'https://www.nsw.gov.au/ministerial-releases/new-south-wales-leads-push-for-return-to-pen-and-paper-naplan-writing-tests',
    requirementLinkLabel: 'NSW Secondary Endurance Guidelines',
  },
  year9: {
    key: 'year9',
    shortName: 'Year 9 (Pre-HSC)',
    label: 'Year 8–9 (Stage 5 Pre-HSC Endurance)',
    stageTag: 'Stage 5 (Year 9)',
    policyBadge: 'Pre-HSC Pathway',
    minLpm: 100,
    targetLpm: 120,
    riskLpm: 80,
    copyWpmMin: 20,
    copyWpmMax: 24,
    compWpmMin: 16,
    compWpmTarget: 19.5,
    naplan30MinMin: 480,
    naplan30MinTarget: 520,
    requirementText:
      'High-speed adult-level automaticity (~20+ WPM) required for 2-hour handwritten NSW HSC examinations.',
    requirementUrl:
      'https://education.nsw.gov.au/teaching-and-learning/curriculum/english',
    requirementLinkLabel: 'NSW Stage 5 Pre-HSC Standards',
  },
}

export interface AuditItem {
  id: string
  number: number
  category:
    | 'Biomechanics & Posture'
    | 'NSW Foundation Stroke Formation'
    | 'Spatial Alignment'
    | 'Stage 2–3 Cursive Fluency'
    | 'Exam Presentation'
  title: string
  shortTitle: string
  desc: string
  defaultChecked: boolean
  fix: string
  relatedMethod: MethodCategory
}

export const INITIAL_AUDIT_ITEMS: AuditItem[] = [
  {
    id: 'grip_tripod',
    number: 1,
    category: 'Biomechanics & Posture',
    title: '1. Dynamic Tripod Grasp (No Thumb-Wrap or Fist Clench)',
    shortTitle: 'Dynamic Tripod Grasp',
    desc: 'Pencil/pen rests lightly on the first joint of the middle finger, held by thumb and index pads ~2cm above the tip with an open circular web space.',
    defaultChecked: true,
    fix: 'Fit a Crossover Silicone Grip or switch to a triangular barrel (Faber-Castell Grip / Lamy Safari) for 4 weeks to open the thumb-index web space.',
    relatedMethod: 'biomechanics',
  },
  {
    id: 'pressure_light',
    number: 2,
    category: 'Biomechanics & Posture',
    title: '2. Controlled Downward Pressure (No Page Embossing on Reverse Side)',
    shortTitle: 'Controlled Downward Pressure',
    desc: 'Turning the paper over reveals smooth paper—not deep ridges, torn fibres, or white-knuckled index finger hyperextension.',
    defaultChecked: false,
    fix: "Replace standard ballpoint pens with a 0.7mm liquid rollerball or fountain pen, and practise 'Ghost Writing' (writing so lightly a tissue underneath doesn't tear).",
    relatedMethod: 'sensory',
  },
  {
    id: 'paper_tilt',
    number: 3,
    category: 'Biomechanics & Posture',
    title: '3. 30° Paper Tilt & Non-Writing Hand Stabilisation',
    shortTitle: '30° Paper Tilt & Stabilisation',
    desc: 'Paper is angled ~30° left (for right-handers) or ~30° right (for left-handers) so the forearm glides along the desk while the non-writing hand anchors the top corner.',
    defaultChecked: true,
    fix: 'Place a strip of masking tape on the desk at a 30° angle as a permanent visual paper-alignment guide during homework.',
    relatedMethod: 'biomechanics',
  },
  {
    id: 'anticlockwise',
    number: 4,
    category: 'NSW Foundation Stroke Formation',
    title: '4. Correct Anticlockwise Formation (a, c, d, g, o, q, s)',
    shortTitle: 'Correct Anticlockwise Formation',
    desc: "All round 'c-family' letters begin at the 1 o'clock position and sweep anticlockwise—never drawn from the bottom baseline upward.",
    defaultChecked: true,
    fix: "Run 5-minute daily 'c-wave' garlands (c-a-d-g-q-o) starting at the 1 o'clock dot on NSW 11mm dotted thirds paper.",
    relatedMethod: 'strokes',
  },
  {
    id: 'size_zones',
    number: 5,
    category: 'Spatial Alignment',
    title: '5. Distinct 3-Zone Letter Heights (Body, Ascenders, Descenders)',
    shortTitle: 'Distinct 3-Zone Letter Heights',
    desc: 'Body letters (a, e, m, n, r) stay uniform in the middle zone; ascenders (b, d, h, k, l, t) rise twice as tall; descenders (g, j, p, q, y) drop cleanly below the baseline.',
    defaultChecked: false,
    fix: "Use highlighted NSW Dotted Thirds paper for 2 weeks so the child gets immediate visual feedback when 'e' or 'o' balloons into the upper zone.",
    relatedMethod: 'strokes',
  },
  {
    id: 'baseline_sit',
    number: 6,
    category: 'Spatial Alignment',
    title: '6. Consistent Baseline Anchoring (No Floating or Diving Words)',
    shortTitle: 'Consistent Baseline Anchoring',
    desc: 'Every word sits squarely on the ruled line across all 30 minutes of writing, rather than bouncing upward mid-sentence.',
    defaultChecked: true,
    fix: "Slow down to 80% speed for 5 lines each day with a 'Touch the Floor' cue on every downward stroke.",
    relatedMethod: 'strokes',
  },
  {
    id: 'word_spacing',
    number: 7,
    category: 'Spatial Alignment',
    title: "7. Uniform Inter-Word Spacing ('One Lowercase o' Gap)",
    shortTitle: 'Uniform Inter-Word Spacing',
    desc: "Words are separated by a consistent 4mm–5mm gap (roughly the width of one lowercase 'o'), neither jammed together nor stretched across the page.",
    defaultChecked: true,
    fix: "Teach the mental 'invisible o' rhythm between words instead of using a slow physical finger spacer.",
    relatedMethod: 'automaticity',
  },
  {
    id: 'cursive_joins',
    number: 8,
    category: 'Stage 2–3 Cursive Fluency',
    title: '8. Smooth Diagonal & Horizontal Cursive Joins (Years 3–9)',
    shortTitle: 'Smooth Diagonal & Horizontal Cursive Joins',
    desc: 'Uses NSW Foundation Style diagonal joins (e.g., in, at, ch) and top horizontal joins (from o, r, v, w) without lifting the pen after every single letter.',
    defaultChecked: false,
    fix: 'Practise 2-letter and 3-letter high-frequency digraph chunks (th, ing, tion, con, pro, oul, wh) as single continuous motor movements.',
    relatedMethod: 'cursive',
  },
  {
    id: 'clean_edits',
    number: 9,
    category: 'Exam Presentation',
    title: '9. Single-Line Strike-Through Editing (No Heavy Scribble Blocks)',
    shortTitle: 'Single-Line Strike-Through Editing',
    desc: 'When changing a word, draws one neat horizontal line through the mistake and writes above or beside it—preserving clean visual scanning for NAPLAN markers.',
    defaultChecked: false,
    fix: "Enforce the 'Single Ruler Strike' rule during all home practice: ban erasers and ban blacking out words with dense ink.",
    relatedMethod: 'cognitive',
  },
  {
    id: 'paragraph_gap',
    number: 10,
    category: 'Exam Presentation',
    title: '10. Clear Blank-Line Paragraph Separation',
    shortTitle: 'Clear Blank-Line Paragraph Separation',
    desc: 'Leaves one full empty ruled line (or clear 2cm indent) between every paragraph so Criterion 7 (Paragraphing) is unmistakable at a glance.',
    defaultChecked: true,
    fix: 'Have your child draw a small margin star (*) on the skipped line before starting each new PEEL body paragraph.',
    relatedMethod: 'cognitive',
  },
]

export interface ImprovementMethod {
  id: string
  category: Exclude<MethodCategory, 'ALL'>
  badge: string
  title: string
  evidence: string
  dailyDose: string
  impactMetric: string
  summary: string
  steps: string[]
}

export const IMPROVEMENT_METHODS: ImprovementMethod[] = [
  {
    id: 'method-1',
    category: 'biomechanics',
    badge: 'Method 1 · Ergonomics & Biomechanics',
    title: '90-90-90 Postural Core & Dynamic Tripod Calibration',
    evidence: "NSW DoE 'Handwriting in the Early Years' & Occupational Therapy Ergonomic Standards",
    dailyDose: '2 min setup before writing',
    impactMetric: '-60% forearm cramping',
    summary:
      "Fine motor control at the fingertips requires proximal stability at the core and shoulder. If a child's feet dangle off a dining chair or their elbow hangs off the desk, the forearm muscles over-contract, causing hand pain within 6 minutes.",
    steps: [
      '90-90-90 Seating Rule: Adjust chair and footstool so ankles, knees, and hips all form 90° angles, with forearms resting comfortably on the desk (~2cm below elbow height).',
      '30° Paper Tilt: Tilt the page 30° anticlockwise for right-handers (30° clockwise for left-handers) so the hand moves naturally along the radius-ulna arc without wrist hooking.',
      "The 'Sleeping Pillow' Grip Cue: Place a tiny folded tissue or small pom-pom under the ring and little fingers so they curl softly into the palm, isolating the thumb, index, and middle fingers into a relaxed Dynamic Tripod.",
    ],
  },
  {
    id: 'method-2',
    category: 'strokes',
    badge: 'Method 2 · NSW Foundation Style Stroke Families',
    title: 'Cognitive Grouping by 4 Stroke Families (Not A-to-Z Order)',
    evidence: 'NSW Department of Education Stage 1 & Stage 2 Instructional Sequences',
    dailyDose: '5 min targeted drills',
    impactMetric: 'Eliminates b/d & p/q reversals',
    summary:
      'Teaching letters alphabetically (a, b, c, d...) confuses motor memory because adjacent letters use opposite directional pathways. Grouping letters by their starting motor stroke builds rapid muscle memory and eliminates b/d and p/q reversals.',
    steps: [
      "Family 1 — Anticlockwise 'c' Wave (a, c, d, g, o, q, s, f): All start at 1 o'clock and sweep left. Fixes the #1 speed bottleneck where children draw 'o' and 'a' clockwise from the bottom.",
      'Family 2 — Downward & Retrace Bounce (b, h, k, l, m, n, p, r, t): Start at top, pull straight down to baseline, and bounce up along the same line clockwise.',
      'Family 3 — Cup / U-Turn Family (i, j, u, y): Downward stroke curving cleanly along the baseline before pulling straight down.',
      'Family 4 — Diagonal Slant Family (v, w, x, z): Sharp 60° straight diagonal strokes with crisp vertices.',
    ],
  },
  {
    id: 'method-3',
    category: 'cursive',
    badge: 'Method 3 · NSW Stage 2 & Stage 3 Cursive Fluency',
    title: "Strategic Cursive Joining & The 'Pen-Lift Rhythm' (Every 3–5 Letters)",
    evidence: 'NSW English K–6 Stage 2/3 Cursive Guidelines & Ziviani Speed Studies',
    dailyDose: '5 min digraph garlands',
    impactMetric: '+15–22 LPM speed gain',
    summary:
      "Both pure unjoined printing (lifting the pen after every letter) and rigid 10-letter unbroken loops slow students down. High-speed Australian exam writers use 'partially joined cursive'—joining 3–5 letter chunks and lifting naturally after descenders.",
    steps: [
      'Master Diagonal Joins First: Practise joining baseline exit ticks to x-height letters (ai, ch, er, in, th, un) in 2-minute rhythmic garlands.',
      'Master Top Horizontal Joins: Practise joining top-exit letters (o, r, v, w) across the top zone into the next letter (oa, or, ov, wi, wh) without dipping to the baseline.',
      "Know Where NOT to Join (Break Letters): Under NSW Foundation Style, do not force awkward joins after lowercase descenders (g, j, p, q, y) or 's' and 'z'—use that micro-lift to slide the wrist forward along the line.",
    ],
  },
  {
    id: 'method-4',
    category: 'automaticity',
    badge: 'Method 4 · Speed & Working-Memory Release',
    title: 'Timed Alphabet, Pangram & Morpheme Automaticity Sprints',
    evidence: "Berninger & Winn 'Not-So-Simple View of Writing' & Assoc. Prof. Anabela Malpique (ECU)",
    dailyDose: '3 min timed sprint',
    impactMetric: '+25–42% compositional fluency',
    summary:
      'Research proves that until letter and syllable production exceeds ~60 LPM, working memory cannot focus on persuasive vocabulary or complex syntax. Short 3-minute timed sprints build neural automaticity without inducing boredom.',
    steps: [
      'Daily 60-Second Alphabet Warm-Up: Start every homework session with a 60-second lowercase alphabet sprint, tracking personal best LPM on a wall chart.',
      'Top-30 Academic Morpheme Chunks: Drill common NAPLAN prefixes and suffixes (con-, pre-, un-, -tion, -ment, -ously, -able, -ight) as single continuous hand gestures rather than spelling letter-by-letter.',
      "Metronome Pacing Drills: Use a 60 BPM audio click to train steady, unhurried stroke cadence—preventing the 'rush-in-paragraph-1, crash-in-paragraph-3' pattern.",
    ],
  },
  {
    id: 'method-5',
    category: 'sensory',
    badge: 'Method 5 · Occupational Therapy & Kinesthetic Conditioning',
    title: 'Proximal Shoulder Stability, Intrinsic Hand Strength & Pressure Calibration',
    evidence: 'Australian Occupational Therapy Clinical Guidelines & Sensory-Motor Integration',
    dailyDose: '3 min pre-writing warmup',
    impactMetric: 'Sustained 40-min stamina',
    summary:
      "When children complain 'writing hurts my hand' (reported widely in Malpique's 2026 interviews), the root cause is weak intrinsic palmar arches and excessive pinch force.",
    steps: [
      "3-Minute Pre-Writing Hand Gym: Pinch and pull medium-resistance Theraputty, walk fingers up and down the pencil barrel ('Pencil Caterpillars'), and perform 10 wall push-ups to activate shoulder stabilisers.",
      'Vertical Surface Writing: Have your child write their 5-minute essay plan on a wall-mounted whiteboard or easel at eye level—this naturally locks the wrist into 20° extension and strengthens the shoulder girdle.',
      'Carbon-Paper / Mechanical Lead Pressure Test: Have your child write a paragraph with a 0.5mm mechanical pencil; if the lead snaps, they are applying excessive vertical force.',
    ],
  },
  {
    id: 'method-6',
    category: 'cognitive',
    badge: 'Method 6 · Exam Strategy & Hybrid Modality Training',
    title: "Pre-Writing 'Box-and-Bullet' Offloading & Hybrid Writer Balance",
    evidence: "Essential Assessment (Nov 2026) & ECU 'Writing for All' Hybrid Writer Framework",
    dailyDose: '5 min planning protocol',
    impactMetric: '-70% mid-sentence cross-outs',
    summary:
      "Because NSW Year 5 NAPLAN returns to paper in 2028 while OC/Selective placement tests remain computer-based, Sydney students must become 'Hybrid Writers' who separate cognitive planning from physical transcription.",
    steps: [
      'Separate Ideation from Transcription: Spend the first 5 minutes writing a bullet-point Box Plan + 10 challenging spelling words at the top of the page. This frees the hand to write continuously for 30 minutes without pausing mid-sentence to think of arguments.',
      'Look-Ahead Clause Buffering: Train your child to mentally compose the entire clause before the pen moves, reducing mid-sentence cross-outs by 70%.',
      'The 80/20 Hybrid Schedule: Dedicate 30 minutes on Mon–Fri to pen-and-paper composition (aligning with the NSW 1-hour daily paper guideline) and 20 minutes on Sat–Sun to deliberate touch-typing.',
    ],
  },
]

export interface SymptomPrescription {
  key: SymptomKey
  shortLabel: string
  symptomOption: string
  title: string
  tools: string[]
  why: string
  protocolTip: string
}

export const SYMPTOM_TOOLS: Record<SymptomKey, SymptomPrescription> = {
  heavy_pressure: {
    key: 'heavy_pressure',
    shortLabel: 'Heavy Pressure & Hand Cramps',
    symptomOption: '1. Presses Too Hard / Rips Paper / Hand Cramps After 5 Mins',
    title: 'Prescription for Heavy Pressure, Page Indentation & Early Hand Cramping',
    tools: [
      'Lamy Safari Rollerball or Pilot V5/V7 Liquid Ink Pen (0.5mm–0.7mm)',
      '2B/4B Triangular Graphite Pencil',
      'Mechanical 0.5mm Lead Feedback Drill',
    ],
    why: "Standard cheap ballpoint pens require steep angles and heavy downward force to roll the tungsten ball. Switching to a liquid rollerball or fountain pen allows ink to flow by capillary action at zero pressure. Pair with a 5-minute 'tissue-under-the-page' game where the child tries to write without indenting the backing sheet.",
    protocolTip: 'Zero-pressure liquid capillary ink cuts downward force by ~45% within 48 hours.',
  },
  thumb_wrap: {
    key: 'thumb_wrap',
    shortLabel: 'Thumb-Wrap or Fist Grip',
    symptomOption: '2. Thumb-Wrap, Fist Grip, or Hyperextended Index Joint',
    title: 'Prescription for Thumb-Wrap, Fist Grasp, or Hyperextended Index Joint',
    tools: [
      'The Crossover Grip (Silicone Wings)',
      'Stabilo EASYoriginal Ergonomic Molded Pen',
      "'Pom-Pom in Palm' Isolation Trick",
    ],
    why: 'A thumb-wrap grip locks the finger joints and forces the entire forearm to drag across the page. The Crossover Grip has soft silicone wings that physically prevent the thumb from crossing over the index finger while holding a small pom-pom with the ring and pinky fingers stabilizes the ulnar arch.',
    protocolTip: 'Use the winged silicone grip for 4–6 weeks, then transition to a faceted triangular barrel.',
  },
  floating_letters: {
    key: 'floating_letters',
    shortLabel: 'Floating Letters & Size Variance',
    symptomOption: '3. Letters Float Above Line or Vary Wildly in Size',
    title: 'Prescription for Floating Letters, Inconsistent Sizing & B/D Reversals',
    tools: [
      'NSW Foundation Style Dotted Thirds Exercise Book (14mm Stage 1 / 11mm Stage 2)',
      'Highlighted Baseline Strip',
      '20° Angled Slope Board',
    ],
    why: "Unlined or wide-ruled paper gives no visual anchor for the middle x-height zone. Highlight the bottom solid baseline in yellow and practise the 'Anticlockwise C-Wave' family so every letter touches both the dotted midline and solid baseline.",
    protocolTip: 'Step down ruled line width gradually: 18mm (Yr 1) → 14mm (Yr 2) → 11mm (Yr 3–4) → 8mm (Yr 5+).',
  },
  slow_drag: {
    key: 'slow_drag',
    shortLabel: 'Neat but Very Slow (<8 WPM)',
    symptomOption: '4. Neat but Extremely Slow (<8 WPM in Upper Primary)',
    title: 'Prescription for Neat but Slow Writers (<8 WPM in Years 4–7)',
    tools: [
      'Low-Viscosity Hybrid Gel/Rollerball (Uni-ball Jetstream 0.7mm)',
      'Daily 3-Min Pangram Timer (Test Set B)',
      'Digraph Cursive Join Cards',
    ],
    why: "Perfectionist slow writers usually 'draw' each letter individually with high finger tension and frequent micro-pauses. Transition them from unjoined print to NSW Foundation Style diagonal joins (connecting 3–4 letters per word) and run daily 3-minute speed sprints where speed is rewarded over perfection.",
    protocolTip: 'Joining 3-letter morpheme chunks (-ing, -tion, con-, the) reduces pen lifts by 60%.',
  },
  smudging_left: {
    key: 'smudging_left',
    shortLabel: 'Left-Handed Smudging & Hooked Wrist',
    symptomOption: '5. Left-Handed Smudging & Hooked Wrist Posture',
    title: "Prescription for Left-Handed Smudging & 'Hooked' Wrist Posture",
    tools: [
      'Stabilo EASYoriginal Left-Handed Edition',
      'Fast-Drying Pigment/Hybrid Ink (Zebra Sarasa Dry / Uni-ball Jetstream)',
      '30° Clockwise Paper Tilt',
    ],
    why: 'Left-handers hook their wrist above the line because the paper is tilted the wrong way (or straight), causing their hand to drag through wet ink and block their view of previous words. Tilt the paper 30°–35° clockwise (top-right corner tilted down) so the left hand stays comfortably below the writing line.',
    protocolTip: 'Grip the barrel 2.5cm–3cm back from the tip so the left hand never obscures the emerging word.',
  },
}

export interface EquipmentRow {
  category: string
  specification: string
  targetStage: string
  mechanism: string
  linkUrl?: string
  linkText?: string
}

export const EQUIPMENT_MATRIX: EquipmentRow[] = [
  {
    category: '1. Early Primary Pencils',
    specification:
      'Triangular Jumbo 2B / 4B Graphite Pencil (e.g. Faber-Castell Grip 2001 / Staedtler Noris Club Triplus)',
    targetStage: 'Kindergarten – Year 3',
    mechanism:
      'Recommended by NSW DoE Handwriting in the Early Years; soft 2B lead produces dark lines with minimal downward pressure while the 3 facets naturally guide thumb, index, and middle fingers.',
    linkUrl:
      'https://assets.schools.nsw.gov.au/content/dam/doe/sws/schools/e/eastlakes-p/PDF%20for%20website/Handwriting_in_the_Early_Years%20(1).pdf',
    linkText: 'NSW DoE Handwriting in the Early Years',
  },
  {
    category: '2. Molded Ergonomic Rollerballs & Fountain Pens',
    specification:
      'Lamy Safari / ABC, Stabilo EASYoriginal (Left/Right specific), or Pilot FriXion / JetStream 0.7mm',
    targetStage: 'Year 4 – Year 9 (Pen Licence & NAPLAN)',
    mechanism:
      'Liquid/gel hybrid ink reduces paper friction by ~40% compared to standard oil ballpoints, immediately boosting speed by 2–3 WPM and preventing flexor tendon cramping.',
  },
  {
    category: '3. Prosthetic Silicone Grips',
    specification: 'The Pencil Grip (Original Pear), Crossover Grip (Wings), & Claw Grip',
    targetStage: 'Remedial K – Year 6',
    mechanism:
      'The Crossover Grip physically blocks the thumb from wrapping over the index finger; transition to a bare triangular barrel after 6 weeks of muscle-memory consolidation.',
  },
  {
    category: '4. NSW Foundation Ruled Paper',
    specification:
      'NSW Dotted Thirds (18mm Yr 1 → 14mm Yr 2 → 11mm Yr 3–4 → 8mm Standard Ruled Yr 5–9)',
    targetStage: 'All Stages (K–9)',
    mechanism:
      'Dotted thirds provide explicit visual boundaries for x-height body letters (a, c, e), ascenders (b, d, h, l), and descenders (g, j, p, y).',
  },
  {
    category: '5. Posture & Surface Aids',
    specification: '20°–22° Angled Writing Slope Board + Non-Slip Dycem Mat',
    targetStage: 'Students with slouching or wrist hooking',
    mechanism:
      'Places the wrist in slight functional extension (the strongest position for finger flexion) and aligns paper for visual tracking without neck strain.',
  },
  {
    category: '6. Fine-Motor & Intrinsic Hand Conditioning',
    specification:
      'Graded Theraputty (Medium Resistance), Tweezers & Vertical Whiteboard Drills',
    targetStage: '5-Min Pre-Writing Warmup',
    mechanism:
      'Strengthens the lumbrical and interossei muscles in the arch of the palm and stabilises the shoulder girdle so fingers move independently.',
  },
]
