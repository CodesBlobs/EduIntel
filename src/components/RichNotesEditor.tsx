import React, { useRef, useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  RotateCcw,
  Sparkles,
  FileText,
  CloudCheck,
  Check,
} from 'lucide-react'
import { useLabStore } from '@/store/useLabStore'
import { useNotes, useSaveNotes } from '@/hooks/useBackendQueries'
import { cn } from '@/lib/utils'

export const RichNotesEditor: React.FC = () => {
  const { activeStudentId, clinicalNotesHtml, setClinicalNotesHtml } = useLabStore()
  const { data: dbNotes, isLoading: isNotesLoading } = useNotes(activeStudentId)
  const saveNotesMut = useSaveNotes()
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [isSaved, setIsSaved] = React.useState(true)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder:
          'Record live clinical observations (e.g., grip transitions after minute 3, wrist posture, b/d reversals, or hybrid typing notes)...',
      }),
    ],
    content: clinicalNotesHtml,
    onUpdate: ({ editor: ed }) => {
      const html = ed.getHTML()
      setClinicalNotesHtml(html)
      setIsSaved(false)
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
      debounceTimer.current = setTimeout(() => {
        saveNotesMut.mutate(
          { studentId: activeStudentId, contentHtml: html },
          { onSuccess: () => setIsSaved(true) }
        )
      }, 1000)
    },
  })

  // Sync editor content when DB notes load or student changes
  useEffect(() => {
    if (dbNotes?.content_html !== undefined && editor) {
      if (editor.getHTML() !== dbNotes.content_html) {
        editor.commands.setContent(dbNotes.content_html)
        setClinicalNotesHtml(dbNotes.content_html)
      }
    }
  }, [dbNotes, editor, setClinicalNotesHtml])

  if (!editor) return null

  const plainText = editor.getText().trim()
  const wordCount = plainText ? plainText.split(/\s+/).length : 0
  const charCount = plainText.length

  const insertObservationTemplate = () => {
    const template = `
      <p><strong>Session Observation Template (NSW Foundation Style):</strong></p>
      <ul>
        <li><strong>Minute 1–2 Posture &amp; Grasp:</strong> Dynamic tripod maintained; paper tilted at 30°.</li>
        <li><strong>Minute 3+ Endurance Shift:</strong> Slight increase in index finger pressure; remind to relax shoulder girdle.</li>
        <li><strong>Target Stroke / Join Focus:</strong> Practise diagonal joins (<em>in, ch, th</em>) and top horizontal joins (<em>or, oa, wh</em>).</li>
      </ul>
    `
    editor.commands.setContent(template)
    setClinicalNotesHtml(template)
    saveNotesMut.mutate(
      { studentId: activeStudentId, contentHtml: template },
      { onSuccess: () => setIsSaved(true) }
    )
  }

  return (
    <div className="rounded-2xl border border-[#E6E4DD] bg-[#FBFBFA] overflow-hidden transition-all focus-within:border-stone-400 focus-within:bg-white">
      {/* Notion-style smooth toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ECEAE4] bg-[#F5F4F0]/80 px-3 py-2">
        <div className="flex items-center gap-1">
          <span className="inline-flex items-center gap-1.5 pr-2 text-[11px] font-semibold text-[#575653] border-r border-[#E2E0D8]">
            <FileText className="w-3.5 h-3.5 text-amber-700" />
            Observation Pad
          </span>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={cn(
              'p-1.5 rounded-lg text-xs transition-colors cursor-pointer',
              editor.isActive('bold')
                ? 'bg-[#191918] text-white'
                : 'text-[#575653] hover:bg-[#E8E6DF]'
            )}
            title="Bold"
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={cn(
              'p-1.5 rounded-lg text-xs transition-colors cursor-pointer',
              editor.isActive('italic')
                ? 'bg-[#191918] text-white'
                : 'text-[#575653] hover:bg-[#E8E6DF]'
            )}
            title="Italic"
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={cn(
              'p-1.5 rounded-lg text-xs transition-colors cursor-pointer',
              editor.isActive('bulletList')
                ? 'bg-[#191918] text-white'
                : 'text-[#575653] hover:bg-[#E8E6DF]'
            )}
            title="Bullet List"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={cn(
              'p-1.5 rounded-lg text-xs transition-colors cursor-pointer',
              editor.isActive('orderedList')
                ? 'bg-[#191918] text-white'
                : 'text-[#575653] hover:bg-[#E8E6DF]'
            )}
            title="Numbered List"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={cn(
              'p-1.5 rounded-lg text-xs transition-colors cursor-pointer',
              editor.isActive('blockquote')
                ? 'bg-[#191918] text-white'
                : 'text-[#575653] hover:bg-[#E8E6DF]'
            )}
            title="Quote Callout"
          >
            <Quote className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={insertObservationTemplate}
            className="inline-flex items-center gap-1 rounded-lg bg-white px-2 py-1 text-[11px] font-medium text-[#191918] border border-[#E2E0D8] hover:bg-[#F4F3EF] transition-colors cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-amber-600" />
            Insert OT Template
          </button>
          <button
            type="button"
            onClick={() => {
              editor.commands.clearContent()
              setClinicalNotesHtml('')
            }}
            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] text-[#575653] hover:bg-[#E8E6DF] transition-colors cursor-pointer"
            title="Clear Notes"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="p-3.5 text-xs leading-relaxed text-[#191918]">
        <EditorContent editor={editor} />
      </div>

      <div className="flex items-center justify-between border-t border-[#ECEAE4] bg-[#F5F4F0]/50 px-3.5 py-1.5 text-[11px] text-[#8A8884] font-mono">
        <span className="flex items-center gap-1.5">
          {saveNotesMut.isPending ? (
            <span className="text-amber-600">Saving notes...</span>
          ) : isSaved ? (
            <span className="text-emerald-700 flex items-center gap-1">
              <Check className="w-3 h-3" /> Auto-saved
            </span>
          ) : (
            <span>Unsaved changes...</span>
          )}
        </span>
        <span>
          {wordCount} words · {charCount} chars
        </span>
      </div>
    </div>
  )
}
