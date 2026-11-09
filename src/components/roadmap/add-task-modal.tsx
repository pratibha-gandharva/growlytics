import { useState } from 'react'
import { useStudent } from '../../context/student-context'
import { Dialog } from '../ui/dialog'
import { Button } from '../ui/button'
import { Input, Textarea } from '../ui/input'
import { Milestone, Plus } from 'lucide-react'

interface AddTaskModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddTaskModal({ isOpen, onClose }: AddTaskModalProps) {
  const { addCustomRoadmapTask, currentRole } = useStudent()

  const [title, setTitle] = useState('')
  const [skillTarget, setSkillTarget] = useState('')
  const [goal, setGoal] = useState('')
  const [estimatedHours, setEstimatedHours] = useState(3)
  const [priority, setPriority] = useState<'High' | 'Medium' | 'Low'>('High')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (!title.trim()) {
      setErrorMsg('Please enter a task title.')
      return
    }
    if (!skillTarget.trim()) {
      setErrorMsg('Please specify which skill this task targets.')
      return
    }

    setLoading(true)
    try {
      await addCustomRoadmapTask({
        title: title.trim(),
        skillTarget: skillTarget.trim(),
        goal: goal.trim(),
        estimatedHours: Number(estimatedHours),
        priority
      })
      setTitle('')
      setSkillTarget('')
      setGoal('')
      setEstimatedHours(3)
      onClose()
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to add roadmap task.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog isOpen={isOpen} onClose={onClose} className="max-w-lg p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-border">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Milestone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-foreground">
              Add Custom Roadmap Task
            </h3>
            <p className="text-xs text-muted-foreground">
              Add your own milestone or coursework track to your personal curriculum.
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300 text-xs">
            {errorMsg}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Task Title <span className="text-red-500">*</span>
          </label>
          <Input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Build an Express rate limiter with sliding window"
            className="text-xs"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1">
              Targeted Skill <span className="text-red-500">*</span>
            </label>
            <Input
              required
              value={skillTarget}
              onChange={(e) => setSkillTarget(e.target.value)}
              placeholder="e.g. Redis, Docker, React"
              className="text-xs"
              list="role-skills-list"
            />
            <datalist id="role-skills-list">
              {currentRole.requiredSkills.map((s) => (
                <option key={s.skillName} value={s.skillName} />
              ))}
            </datalist>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Est. Hours
              </label>
              <Input
                type="number"
                min={1}
                max={100}
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(Number(e.target.value))}
                className="text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-input bg-background text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1">
            Goal & Key Outcome
          </label>
          <Textarea
            rows={2}
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="Describe what you will produce or understand after finishing this task..."
            className="text-xs"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2 border-t border-border">
          <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs">
            Cancel
          </Button>
          <Button type="submit" disabled={loading} variant="sprout" size="sm" className="text-xs font-bold gap-1.5">
            <Plus className="w-3.5 h-3.5" /> {loading ? 'Saving...' : 'Add Task'}
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
