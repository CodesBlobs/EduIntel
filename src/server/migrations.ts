import { getSQL } from './db'

export async function runMigrations() {
  const sql = getSQL()

  // ── Students ──────────────────────────────────────────────────
  await sql`
    CREATE TABLE IF NOT EXISTS students (
      id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      name          TEXT NOT NULL DEFAULT 'Default Student',
      cohort_key    TEXT NOT NULL DEFAULT 'year5',
      handedness    TEXT NOT NULL DEFAULT 'right' CHECK (handedness IN ('right','left')),
      created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `

  // ── Diagnostic Attempts ───────────────────────────────────────
  await sql`
    CREATE TABLE IF NOT EXISTS diagnostic_attempts (
      id                  TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      student_id          TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      student_label       TEXT NOT NULL DEFAULT '',
      cohort_key          TEXT NOT NULL,
      test_set_key        TEXT NOT NULL,
      duration_min        NUMERIC(5,1) NOT NULL,
      unit                TEXT NOT NULL CHECK (unit IN ('words','letters')),
      raw_count           INTEGER NOT NULL,
      illegible_count     INTEGER NOT NULL DEFAULT 0,
      fatigue             TEXT NOT NULL DEFAULT 'none' CHECK (fatigue IN ('none','mild','severe')),
      net_lpm             NUMERIC(7,1) NOT NULL DEFAULT 0,
      net_wpm             NUMERIC(7,1) NOT NULL DEFAULT 0,
      gross_wpm           NUMERIC(7,1) NOT NULL DEFAULT 0,
      projected_30min_words INTEGER NOT NULL DEFAULT 0,
      status              TEXT NOT NULL DEFAULT 'below' CHECK (status IN ('exceeds','developing','below')),
      created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `

  // ── Audit Snapshots ───────────────────────────────────────────
  await sql`
    CREATE TABLE IF NOT EXISTS audit_snapshots (
      id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      student_id      TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      checked_items   JSONB NOT NULL DEFAULT '{}',
      created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `

  // ── Clinical Notes ────────────────────────────────────────────
  await sql`
    CREATE TABLE IF NOT EXISTS clinical_notes (
      id              TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
      student_id      TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
      content_html    TEXT NOT NULL DEFAULT '',
      created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `

  // ── User Preferences (per-student UI state) ───────────────────
  await sql`
    CREATE TABLE IF NOT EXISTS user_preferences (
      student_id                TEXT PRIMARY KEY REFERENCES students(id) ON DELETE CASCADE,
      selected_cohort           TEXT NOT NULL DEFAULT 'year5',
      active_set_key            TEXT NOT NULL DEFAULT 'setA',
      selected_method_category  TEXT NOT NULL DEFAULT 'ALL',
      selected_symptom          TEXT NOT NULL DEFAULT 'heavy_pressure',
      show_dotted_thirds        BOOLEAN NOT NULL DEFAULT true,
      updated_at                TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `

  // ── Index for fast lookups ────────────────────────────────────
  await sql`
    CREATE INDEX IF NOT EXISTS idx_attempts_student
      ON diagnostic_attempts(student_id, created_at DESC)
  `
  await sql`
    CREATE INDEX IF NOT EXISTS idx_audit_student
      ON audit_snapshots(student_id, created_at DESC)
  `
  await sql`
    CREATE INDEX IF NOT EXISTS idx_notes_student
      ON clinical_notes(student_id, updated_at DESC)
  `

  console.log('[DB] ✅ All migrations complete')
}

/**
 * Seeds a default student with the sample data from the original zustand store
 * if no students exist yet.
 */
export async function seedIfEmpty() {
  const sql = getSQL()

  const existing = await sql`SELECT id FROM students LIMIT 1`
  if (existing.length > 0) {
    console.log('[DB] Seed skipped — data already exists')
    return
  }

  // Create default student
  const [student] = await sql`
    INSERT INTO students (id, name, cohort_key, handedness)
    VALUES ('default-student', 'Sample Student (Yr 5)', 'year5', 'right')
    RETURNING id
  `

  const studentId = student.id

  // Seed two diagnostic attempts (matching original seed data)
  await sql`
    INSERT INTO diagnostic_attempts
      (id, student_id, student_label, cohort_key, test_set_key, duration_min, unit, raw_count, illegible_count, fatigue, net_lpm, net_wpm, gross_wpm, projected_30min_words, status, created_at)
    VALUES
      ('seed-1', ${studentId}, 'Baseline Check', 'year5', 'setA', 1, 'letters', 54, 1, 'mild', 49, 9.8, 10.8, 191, 'below', now() - interval '14 days'),
      ('seed-2', ${studentId}, 'After Grip & Rollerball Fix', 'year5', 'setB', 3, 'letters', 204, 1, 'none', 66, 13.3, 13.6, 288, 'developing', now() - interval '7 days')
  `

  // Seed default audit checklist
  const defaultCheckedMap = {
    grip_tripod: true,
    pressure_light: false,
    paper_tilt: true,
    anticlockwise: true,
    size_zones: false,
    baseline_sit: true,
    word_spacing: true,
    cursive_joins: false,
    clean_edits: false,
    paragraph_gap: true,
  }
  await sql`
    INSERT INTO audit_snapshots (student_id, checked_items)
    VALUES (${studentId}, ${JSON.stringify(defaultCheckedMap)})
  `

  // Seed clinical notes
  await sql`
    INSERT INTO clinical_notes (student_id, content_html)
    VALUES (${studentId}, ${`<p><strong>Clinical Observation Notes:</strong> Student starts with a neat Dynamic Tripod grip in Minute 1, but increases downward tip pressure after Line 3. Switching from a standard oil ballpoint to a 0.7mm liquid rollerball and tilting the A4 lined page 30° anticlockwise visibly relaxed the index finger joint.</p><ul><li>Practise 5-minute anticlockwise <em>c-wave</em> garlands daily on 11mm dotted thirds.</li><li>Use single horizontal strike-through instead of heavy scribble blocks.</li></ul>`})
  `

  // Seed user preferences
  await sql`
    INSERT INTO user_preferences (student_id, selected_cohort, active_set_key, selected_method_category, selected_symptom, show_dotted_thirds)
    VALUES (${studentId}, 'year5', 'setA', 'ALL', 'heavy_pressure', true)
  `

  console.log('[DB] ✅ Default student seeded with sample data')
}

