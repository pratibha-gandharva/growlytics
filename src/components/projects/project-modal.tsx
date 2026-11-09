import React, { useState, useEffect } from 'react'
import { Project, ProjectCategory, ProjectStatus, ProjectMilestone } from '../../types'
import { Dialog } from '../ui/dialog'
import { Input, Textarea } from '../ui/input'
import { Button } from '../ui/button'
import { Plus, Trash2, CheckCircle2 } from 'lucide-react'

interface ProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (projectData: any) => void
  initialProject?: Project | null
}

export function ProjectModal({
  isOpen,
  onClose,
  onSave,
  initialProject
}: ProjectModalProps) {
  const [title, setTitle] = useState('')
  const [tagline, setTagline] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<ProjectCategory>('Full-Stack')
  const [techStackInput, setTechStackInput] = useState('')
  const [githubUrl, setGithubUrl] = useState('')
  const [liveDemoUrl, setLiveDemoUrl] = useState('')
  const [status, setStatus] = useState<ProjectStatus>('In Progress')
  const [featured, setFeatured] = useState(false)
  const [milestones, setMilestones] = useState<ProjectMilestone[]>([])

  // New milestone state inside modal
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('')
  const [newMilestoneSkills, setNewMilestoneSkills] = useState('')

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (initialProject) {
      setTitle(initialProject.title)
      setTagline(initialProject.tagline)
      setDescription(initialProject.description)
      setCategory(initialProject.category)
      setTechStackInput(initialProject.techStack.join(', '))
      setGithubUrl(initialProject.githubUrl)
      setLiveDemoUrl(initialProject.liveDemoUrl || '')
      setStatus(initialProject.status)
      setFeatured(initialProject.featured)
      setMilestones(initialProject.milestones)
    } else {
      setTitle('')
      setTagline('')
      setDescription('')
      setCategory('Full-Stack')
      setTechStackInput('')
      setGithubUrl('')
      setLiveDemoUrl('')
      setStatus('In Progress')
      setFeatured(false)
      setMilestones([
        {
          id: `m-${Date.now()}-1`,
          title: 'Project Architecture & Setup',
          completed: true,
          skillsAwarded: ['Architecture']
        },
        {
          id: `m-${Date.now()}-2`,
          title: 'Core Features & Business Logic',
          completed: false,
          skillsAwarded: ['Implementation']
        }
      ])
    }
    setErrors({})
    setNewMilestoneTitle('')
    setNewMilestoneSkills('')
  }, [initialProject, isOpen])

  const validate = () => {
    const err: Record<string, string> = {}
    if (!title.trim()) err.title = 'Project title is required'
    if (!tagline.trim()) err.tagline = 'Tagline is required'
    if (!description.trim()) err.description = 'Description is required'
    if (!techStackInput.trim()) err.techStack = 'Enter at least one technology (e.g. React, TypeScript)'
    if (!githubUrl.trim()) {
      err.githubUrl = 'GitHub repository URL is required'
    } else if (!githubUrl.startsWith('http://') && !githubUrl.startsWith('https://')) {
      err.githubUrl = 'Must be a valid URL starting with https://'
    }

    if (liveDemoUrl.trim() && !liveDemoUrl.startsWith('http://') && !liveDemoUrl.startsWith('https://')) {
      err.liveDemoUrl = 'Live demo must start with https:// or http://'
    }

    setErrors(err)
    return Object.keys(err).length === 0
  }

  const handleAddMilestone = () => {
    if (!newMilestoneTitle.trim()) return
    const skills = newMilestoneSkills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    const newM: ProjectMilestone = {
      id: `m-${Date.now()}`,
      title: newMilestoneTitle.trim(),
      completed: false,
      skillsAwarded: skills.length > 0 ? skills : [category]
    }
    setMilestones([...milestones, newM])
    setNewMilestoneTitle('')
    setNewMilestoneSkills('')
  }

  const handleRemoveMilestone = (id: string) => {
    setMilestones(milestones.filter((m) => m.id !== id))
  }

  const handleToggleMilestone = (id: string) => {
    setMilestones(
      milestones.map((m) =>
        m.id === id ? { ...m, completed: !m.completed } : m
      )
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const parsedTechStack = techStackInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    const payload = {
      title: title.trim(),
      tagline: tagline.trim(),
      description: description.trim(),
      category,
      techStack: parsedTechStack,
      githubUrl: githubUrl.trim(),
      liveDemoUrl: liveDemoUrl.trim() || undefined,
      status,
      featured,
      milestones,
      keyLearnings: initialProject?.keyLearnings || [
        'Implemented responsive layout and modular components.',
        'Structured Git commits and pull request milestones.'
      ]
    }

    onSave(payload)
    onClose()
  }

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={initialProject ? 'Edit Project' : 'Add New Portfolio Project'}
      description="Showcase your engineering work with repository links, milestones, and verifiable skills."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Project Title *"
            placeholder="e.g. EchoFlow Message Broker"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={errors.title}
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ProjectCategory)}
              className="flex h-10 w-full rounded-xl border border-input bg-card px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="Full-Stack">Full-Stack</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="AI/ML">AI / Machine Learning</option>
              <option value="Cloud/DevOps">Cloud / DevOps</option>
            </select>
          </div>
        </div>

        <Input
          label="One-line Tagline *"
          placeholder="e.g. Real-time distributed telemetry dashboard for high-traffic APIs"
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          error={errors.tagline}
        />

        <Textarea
          label="Detailed Description *"
          placeholder="Explain what problem this project solves, architectural decisions, and challenges overcome."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          error={errors.description}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="GitHub Repository URL *"
            placeholder="https://github.com/username/repo"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            error={errors.githubUrl}
          />

          <Input
            label="Live Demo URL (Optional)"
            placeholder="https://your-demo-app.vercel.app"
            value={liveDemoUrl}
            onChange={(e) => setLiveDemoUrl(e.target.value)}
            error={errors.liveDemoUrl}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Technologies Used (Comma-separated) *"
            placeholder="React, TypeScript, PostgreSQL, Redis, Docker"
            value={techStackInput}
            onChange={(e) => setTechStackInput(e.target.value)}
            error={errors.techStack}
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
              Current Project Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ProjectStatus)}
              className="flex h-10 w-full rounded-xl border border-input bg-card px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="Completed">Completed / Production</option>
              <option value="In Progress">In Active Development</option>
              <option value="Refactoring">Refactoring / Optimizing</option>
              <option value="Ideation">Planning / Prototype</option>
            </select>
          </div>
        </div>

        {/* Milestone Pipeline Management */}
        <div className="p-4 rounded-xl border border-border bg-muted/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-foreground">
              Milestone Checklist ({milestones.length})
            </span>
            <span className="text-[11px] text-muted-foreground">
              Click checkbox to toggle completion
            </span>
          </div>

          <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
            {milestones.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between gap-2 p-2 rounded-lg bg-card border border-border text-xs"
              >
                <button
                  type="button"
                  onClick={() => handleToggleMilestone(m.id)}
                  className="flex items-center gap-2 text-left cursor-pointer flex-1"
                >
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 ${
                      m.completed ? 'text-emerald-600 dark:text-emerald-400' : 'text-muted-foreground'
                    }`}
                  />
                  <span className={m.completed ? 'line-through text-muted-foreground' : 'font-medium'}>
                    {m.title}
                  </span>
                </button>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono">
                    {m.skillsAwarded.join(', ')}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveMilestone(m.id)}
                    className="p-1 text-muted-foreground hover:text-red-500 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Add Milestone Row */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-1 border-t border-border/60">
            <input
              type="text"
              placeholder="New milestone title (e.g. Unit tests with Vitest)"
              value={newMilestoneTitle}
              onChange={(e) => setNewMilestoneTitle(e.target.value)}
              className="sm:col-span-7 h-8 px-2.5 rounded-lg border border-border bg-card text-xs text-foreground"
            />
            <input
              type="text"
              placeholder="Skills (e.g. Vitest, Testing)"
              value={newMilestoneSkills}
              onChange={(e) => setNewMilestoneSkills(e.target.value)}
              className="sm:col-span-3 h-8 px-2.5 rounded-lg border border-border bg-card text-xs text-foreground"
            />
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={handleAddMilestone}
              className="sm:col-span-2 h-8 text-xs"
            >
              <Plus className="w-3 h-3 mr-1" /> Add
            </Button>
          </div>
        </div>

        {/* Featured Checkbox */}
        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-foreground">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="rounded border-border text-primary focus:ring-primary w-4 h-4 cursor-pointer"
          />
          <span>Feature this project at the top of your portfolio</span>
        </label>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="sprout">
            {initialProject ? 'Save Changes' : 'Create Project'}
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
