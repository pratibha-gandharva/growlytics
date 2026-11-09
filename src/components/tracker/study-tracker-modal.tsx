import { useState } from 'react'
import { useStudent } from '../../context/student-context'
import { Dialog } from '../ui/dialog'
import { Button } from '../ui/button'
import { Input, Textarea } from '../ui/input'
import { Clock, Trash2, Plus } from 'lucide-react'

interface StudyTrackerModalProps {
  isOpen: boolean
  onClose: () => void
}

export function StudyTrackerModal({ isOpen, onClose }: StudyTrackerModalProps) {
  const { studySessions, addStudySession, deleteStudySession, roadmap } = useStudent()

  const [topic, setTopic] = useState('')
  const [durationMinutes, setDurationMinutes] = useState(45)
  const [notes, setNotes] = useState('')
  const [roadmapTaskId, setRoadmapTaskId] = useState('')
  const [studiedAt, setStudiedAt] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!topic.trim()) {
      setErrorMsg('Please enter a topic or subject.')
      return
    }
    if (durationMinutes <= 0) {
      setErrorMsg('Duration must be greater than 0 minutes.')
      return
    }

    setLoading(true)
    try {
      await addStudySession({
        topic: topic.trim(),
        durationMinutes: Number(durationMinutes),
        notes: notes.trim() || undefined,
        roadmapTaskId: roadmapTaskId || undefined,
        studiedAt
      })
      // Reset form
      setTopic('')
      setDurationMinutes(45)
      setNotes('')
      setRoadmapTaskId('')
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to record study session.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog isOpen={isOpen} onClose={onClose} className="max-w-xl p-6">
      <div className="space-y-5">
        <div className="flex items-center justify-between pb-2 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-foreground">
                Study Session Tracker
              </h3>
              <p className="text-xs text-muted-foreground">
                Record your independent learning time and link it to your roadmap.
              </p>
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300 text-xs">
            {errorMsg}
          </div>
        )}

        {/* New Session Form */}
        <form onSubmit={handleSubmit} className="p-4 rounded-2xl bg-muted/50 border border-border space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5 text-primary" /> Log New Study Session
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-foreground mb-1">
                Topic or Concept Studied <span className="text-red-500">*</span>
              </label>
              <Input
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. PostgreSQL B-Tree Indexes & EXPLAIN"
                className="text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Duration (minutes) <span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                min={5}
                max={600}
                required
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Link to Roadmap Module (Optional)
              </label>
              <select
                value={roadmapTaskId}
                onChange={(e) => setRoadmapTaskId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-input bg-background text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">None / General Study</option>
                {roadmap.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Date Studied
              </label>
              <Input
                type="date"
                required
                value={studiedAt}
                onChange={(e) => setStudiedAt(e.target.value)}
                className="text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Key Insights or Notes (Optional)
            </label>
            <Textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What clicked? What questions remain for your next session?"
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
              <Plus className="w-3.5 h-3.5" /> Log Session
            </Button>
          </div>
        </form>

        {/* Recent Session History */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Recent Study Sessions ({studySessions.length})
            </h4>
            <span className="text-xs text-muted-foreground">
              Total logged: <strong className="text-foreground">{Math.round(studySessions.reduce((a, b) => a + b.durationMinutes, 0) / 60 * 10) / 10} hrs</strong>
            </span>
          </div>

          {studySessions.length === 0 ? (
            <p className="text-xs text-muted-foreground py-4 text-center italic">
              No study sessions logged yet. Record your first session above!
            </p>
          ) : (
            <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
              {studySessions.map((session) => (
                <div
                  key={session.id}
                  className="p-3 rounded-xl border border-border bg-card flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground">{session.topic}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-700 dark:text-purple-300 font-bold">
                        {session.durationMinutes} mins
                      </span>
                    </div>
                    {session.notes && (
                      <p className="text-muted-foreground line-clamp-2 text-[11px]">
                        {session.notes}
                      </p>
                    )}
                    <span className="text-[10px] text-muted-foreground block">
                      {session.studiedAt}
                    </span>
                  </div>

                  <button
                    onClick={() => deleteStudySession(session.id)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-muted transition-colors cursor-pointer shrink-0"
                    title="Delete session record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Dialog>
  )
}
