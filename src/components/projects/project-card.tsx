import { Project } from '../../types'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { 
  ExternalLink, 
  CheckCircle2, 
  Circle, 
  Pencil, 
  Trash2, 
  ChevronDown, 
  ChevronUp,
  Layers,
  Sparkles
} from 'lucide-react'
import { GithubIcon } from '../icons/brand-icons'
import { useState } from 'react'
import { cn } from '../../lib/utils'

interface ProjectCardProps {
  project: Project
  onEdit: (project: Project) => void
  onDelete: (projectId: string) => void
  onToggleMilestone: (projectId: string, milestoneId: string) => void
}

export function ProjectCard({
  project,
  onEdit,
  onDelete,
  onToggleMilestone
}: ProjectCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const completedMilestones = project.milestones.filter((m) => m.completed).length
  const totalMilestones = project.milestones.length
  const progressPercent = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0

  const categoryBadgeVariants: Record<string, 'default' | 'secondary' | 'peach' | 'gold' | 'sprout'> = {
    'Full-Stack': 'sprout',
    'Frontend': 'peach',
    'Backend': 'secondary',
    'AI/ML': 'gold',
    'Cloud/DevOps': 'default'
  }

  const statusBadgeVariants: Record<string, 'success' | 'warning' | 'default' | 'secondary'> = {
    'Completed': 'success',
    'In Progress': 'warning',
    'Refactoring': 'secondary',
    'Ideation': 'default'
  }

  return (
    <Card className="flex flex-col justify-between overflow-hidden hover:shadow-md hover:border-primary/40 transition-all duration-300 group">
      <div>
        {/* Card Header */}
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant={categoryBadgeVariants[project.category] || 'default'} size="sm">
                  {project.category}
                </Badge>
                <Badge variant={statusBadgeVariants[project.status] || 'default'} size="sm">
                  {project.status}
                </Badge>
                {project.featured && (
                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 fill-amber-400" /> Featured
                  </span>
                )}
              </div>
              <CardTitle className="text-lg group-hover:text-primary transition-colors">
                {project.title}
              </CardTitle>
            </div>

            {/* Actions: Edit & Delete */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => onEdit(project)}
                className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
                title="Edit project"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDelete(project.id)}
                className="p-1.5 rounded-lg text-muted-foreground hover:bg-red-500/10 hover:text-red-600 transition-colors cursor-pointer"
                title="Delete project"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <CardDescription className="line-clamp-2 mt-1">
            {project.description}
          </CardDescription>
        </CardHeader>

        {/* Card Content */}
        <CardContent className="space-y-4">
          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-muted-foreground font-medium">Milestone Progress</span>
              <span className="font-bold text-foreground">
                {completedMilestones}/{totalMilestones} ({progressPercent}%)
              </span>
            </div>
            <Progress 
              value={progressPercent} 
              colorVariant={progressPercent === 100 ? 'success' : 'primary'} 
            />
          </div>

          {/* Tech Stack Badges */}
          <div className="flex flex-wrap gap-1.5">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="text-xs px-2.5 py-0.5 rounded-lg bg-muted border border-border/60 text-foreground font-medium"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Collapsible Milestones Checklist */}
          {totalMilestones > 0 && (
            <div className="pt-2 border-t border-border/70 space-y-2">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer py-1"
              >
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-primary" />
                  <span>Milestone Pipeline ({completedMilestones}/{totalMilestones})</span>
                </span>
                {isExpanded ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>

              {isExpanded && (
                <div className="space-y-2 pt-1 animate-slide-up">
                  {project.milestones.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => onToggleMilestone(project.id, m.id)}
                      className={cn(
                        'flex items-start gap-2.5 p-2 rounded-xl text-xs transition-colors cursor-pointer border',
                        m.completed
                          ? 'bg-emerald-500/5 border-emerald-500/20 text-foreground'
                          : 'bg-muted/40 border-border text-muted-foreground hover:bg-muted'
                      )}
                    >
                      <button
                        type="button"
                        className="shrink-0 mt-0.5 text-foreground hover:text-primary transition-colors cursor-pointer"
                        aria-label={m.completed ? 'Mark incomplete' : 'Mark completed'}
                      >
                        {m.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Circle className="w-4 h-4 text-muted-foreground" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className={cn('font-medium leading-snug', m.completed && 'line-through text-muted-foreground')}>
                          {m.title}
                        </p>
                        {m.description && (
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            {m.description}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-1 mt-1">
                          {m.skillsAwarded.map((s) => (
                            <span key={s} className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-muted text-muted-foreground">
                              +{s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </div>

      {/* Card Footer: Links */}
      <CardFooter className="pt-3 border-t border-border flex items-center justify-between gap-3 bg-muted/20">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Updated {project.updatedAt}</span>
        </div>

        <div className="flex items-center gap-2">
          {project.liveDemoUrl && (
            <a
              href={project.liveDemoUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Live Demo</span>
            </a>
          )}
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-border bg-card hover:bg-muted text-foreground transition-colors"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>
        </div>
      </CardFooter>
    </Card>
  )
}
