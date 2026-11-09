import { useState } from 'react'
import { useStudent } from '../../context/student-context'
import { Dialog } from '../ui/dialog'
import { Button } from '../ui/button'
import { Input, Textarea } from '../ui/input'
import { PracticeRecordEntity } from '../../types/firestore'
import { Target, Trash2, Plus } from 'lucide-react'

interface PracticeTrackerModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PracticeTrackerModal({ isOpen, onClose }: PracticeTrackerModalProps) {
  const { practiceRecords, addPracticeRecord, deletePracticeRecord } = useStudent()

  const [topic, setTopic] = useState('')
  const [practiceType, setPracticeType] = useState<PracticeRecordEntity['practiceType']>('LeetCode / DSA')
  const [questionsAttempted, setQuestionsAttempted] = useState(5)
  const [questionsCorrect, setQuestionsCorrect] = useState(4)
  const [notes, setNotes] = useState('')
  const [practicedAt, setPracticedAt] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!topic.trim()) {
      setErrorMsg('Please enter a practice topic.')
      return
    }
    if (questionsAttempted < 0 || questionsCorrect < 0) {
      setErrorMsg('Question counts cannot be negative.')
      return
    }
    if (questionsCorrect > questionsAttempted) {
      setErrorMsg('Correct answers cannot exceed attempted questions.')
      return
    }

    setLoading(true)
    try {
      await addPracticeRecord({
        topic: topic.trim(),
        practiceType,
        questionsAttempted: Number(questionsAttempted),
        questionsCorrect: Number(questionsCorrect),
        notes: notes.trim() || undefined,
        practicedAt
      })
      setTopic('')
      setNotes('')
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to record practice result.')
    } finally {
      setLoading(false)
    }
  }

  const totalAttempted = practiceRecords.reduce((acc, r) => acc + (r.questionsAttempted || 0), 0)
  const totalCorrect = practiceRecords.reduce((acc, r) => acc + (r.questionsCorrect || 0), 0)
  const accuracyPct = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0

  return (
    <Dialog isOpen={isOpen} onClose={onClose} className="max-w-xl p-6">
      <div className="space-y-5">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-foreground">
                Practice & Quiz Records
              </h3>
              <p className="text-xs text-muted-foreground">
                Track interview problems solved, quiz results, and conceptual checks.
              </p>
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300 text-xs">
            {errorMsg}
          </div>
        )}

        {/* Practice Form */}
        <form onSubmit={handleSubmit} className="p-4 rounded-2xl bg-muted/50 border border-border space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5 text-primary" /> Log New Practice Session
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Topic / Problem Set <span className="text-red-500">*</span>
              </label>
              <Input
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Binary Search & Two Pointers"
                className="text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Practice Format
              </label>
              <select
                value={practiceType}
                onChange={(e) => setPracticeType(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-input bg-background text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="LeetCode / DSA">LeetCode / DSA</option>
                <option value="Concept Quiz">Concept Quiz</option>
                <option value="System Design">System Design</option>
                <option value="Code Review">Code Review</option>
                <option value="Mock Technical Interview">Mock Technical Interview</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Attempted <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                min={1}
                max={500}
                required
                value={questionsAttempted}
                onChange={(e) => setQuestionsAttempted(Number(e.target.value))}
                className="text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Correct / Solved <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                min={0}
                max={questionsAttempted}
                required
                value={questionsCorrect}
                onChange={(e) => setQuestionsCorrect(Number(e.target.value))}
                className="text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Date
              </label>
              <Input
                type="date"
                required
                value={practicedAt}
                onChange={(e) => setPracticedAt(e.target.value)}
                className="text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Notes or Mistakes to Review (Optional)
            </label>
            <Textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What edge cases were missed? What was the time complexity?"
              className="text-xs"
            />
          </div>

          <div className="flex justify-end pt-1">
            <Button
              type="submit"
              disabled={loading}
              variant="sprout"
              size="sm"
              className="text-xs font-bold gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Log Practice
            </Button>
          </div>
        </form>

        {/* Practice History */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Recent Practice Records ({practiceRecords.length})
            </h4>
            {totalAttempted > 0 && (
              <span className="text-xs text-muted-foreground">
                Accuracy: <strong className="text-emerald-600 dark:text-emerald-400">{accuracyPct}%</strong> ({totalCorrect}/{totalAttempted})
              </span>
            )}
          </div>

          {practiceRecords.length === 0 ? (
            <p className="text-xs text-muted-foreground py-4 text-center italic">
              No practice records yet. Record your LeetCode or quiz sessions above!
            </p>
          ) : (
            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {practiceRecords.map((record) => {
                const pct = record.questionsAttempted > 0 
                  ? Math.round((record.questionsCorrect / record.questionsAttempted) * 100) 
                  : 0
                return (
                  <div
                    key={record.id}
                    className="p-3 rounded-xl border border-border bg-card flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground">{record.topic}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 font-bold">
                          {record.practiceType}
                        </span>
                        <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                          {record.questionsCorrect}/{record.questionsAttempted} ({pct}%)
                        </span>
                      </div>
                      {record.notes && (
                        <p className="text-muted-foreground line-clamp-2 text-[11px]">
                          {record.notes}
                        </p>
                      )}
                      <span className="text-[10px] text-muted-foreground block">
                        {record.practicedAt}
                      </span>
                    </div>

                    <button
                      onClick={() => deletePracticeRecord(record.id)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-muted transition-colors cursor-pointer shrink-0"
                      title="Delete record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </Dialog>
  )
}
