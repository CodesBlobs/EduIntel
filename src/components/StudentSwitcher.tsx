import React, { useState } from 'react'
import { useLabStore } from '@/store/useLabStore'
import {
  useStudents,
  useCreateStudent,
  useDeleteStudent,
  useUpdateStudent,
} from '@/hooks/useBackendQueries'
import { Button, Input, Select } from '@/components/ui/primitives'
import { User, Plus, Trash2, Check, Edit2 } from 'lucide-react'

export const StudentSwitcher: React.FC = () => {
  const { activeStudentId, setActiveStudentId } = useLabStore()
  const { data: students, isLoading } = useStudents()
  const createStudentMut = useCreateStudent()
  const deleteStudentMut = useDeleteStudent()
  const updateStudentMut = useUpdateStudent()

  const [isAdding, setIsAdding] = useState(false)
  const [newName, setNewName] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')

  const activeStudent = students?.find((s) => s.id === activeStudentId)

  const handleCreate = () => {
    if (!newName.trim()) return
    createStudentMut.mutate(
      { name: newName.trim(), cohort_key: 'year5', handedness: 'right' },
      {
        onSuccess: (student) => {
          setActiveStudentId(student.id)
          setNewName('')
          setIsAdding(false)
        },
      }
    )
  }

  const handleUpdate = () => {
    if (!editName.trim() || !activeStudentId) return
    updateStudentMut.mutate(
      { id: activeStudentId, data: { name: editName.trim() } },
      {
        onSuccess: () => {
          setIsEditing(false)
        },
      }
    )
  }

  const handleDelete = (id: string) => {
    if (students && students.length <= 1) {
      alert('Cannot delete the only student profile.')
      return
    }
    if (confirm('Delete this student profile and all associated test data?')) {
      deleteStudentMut.mutate(id, {
        onSuccess: () => {
          const remaining = students?.filter((s) => s.id !== id)
          if (remaining && remaining.length > 0) {
            setActiveStudentId(remaining[0].id)
          }
        },
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-xs text-[#8A8884]">
        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
        Loading profiles...
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      {/* Student dropdown */}
      {!isEditing && !isAdding && (
        <div className="flex items-center gap-1.5 bg-[#F4F3EF] px-2 py-1 rounded-lg border border-[#E2E0D8]">
          <User className="w-3.5 h-3.5 text-[#575653]" />
          <select
            value={activeStudentId}
            onChange={(e) => setActiveStudentId(e.target.value)}
            className="bg-transparent text-xs font-medium text-[#191918] focus:outline-none cursor-pointer pr-1"
          >
            {students?.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          {activeStudent && (
            <button
              type="button"
              onClick={() => {
                setEditName(activeStudent.name)
                setIsEditing(true)
              }}
              className="p-0.5 text-[#8A8884] hover:text-[#191918] transition-colors"
              title="Rename student"
            >
              <Edit2 className="w-3 h-3" />
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="p-0.5 text-[#8A8884] hover:text-[#191918] transition-colors"
            title="Add student profile"
          >
            <Plus className="w-3 h-3" />
          </button>

          {students && students.length > 1 && (
            <button
              type="button"
              onClick={() => handleDelete(activeStudentId)}
              className="p-0.5 text-[#8A8884] hover:text-rose-600 transition-colors"
              title="Delete current student"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      {/* Add new student inline */}
      {isAdding && (
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-[#191918] shadow-xs">
          <Input
            type="text"
            placeholder="Student name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            className="h-6 text-xs w-32 px-1.5"
            autoFocus
          />
          <Button
            type="button"
            size="sm"
            variant="default"
            onClick={handleCreate}
            disabled={createStudentMut.isPending}
            className="h-6 px-2 text-xs"
          >
            <Check className="w-3 h-3" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => setIsAdding(false)}
            className="h-6 px-1.5 text-xs text-[#8A8884]"
          >
            ✕
          </Button>
        </div>
      )}

      {/* Edit current student inline */}
      {isEditing && (
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-[#191918] shadow-xs">
          <Input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleUpdate()}
            className="h-6 text-xs w-32 px-1.5"
            autoFocus
          />
          <Button
            type="button"
            size="sm"
            variant="default"
            onClick={handleUpdate}
            disabled={updateStudentMut.isPending}
            className="h-6 px-2 text-xs"
          >
            <Check className="w-3 h-3" />
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => setIsEditing(false)}
            className="h-6 px-1.5 text-xs text-[#8A8884]"
          >
            ✕
          </Button>
        </div>
      )}
    </div>
  )
}
