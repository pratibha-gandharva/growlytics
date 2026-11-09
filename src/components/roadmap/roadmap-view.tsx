import { useState } from 'react'
import { useStudent } from '../../context/student-context'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Progress } from '../ui/progress'
import { AddTaskModal } from './add-task-modal'
import { 
  Milestone, 
  CheckCircle2, 
  Circle, 
  Clock, 
  ExternalLink, 
  BookOpen, 
  Flame, 
  Sparkles, 
  Target,
  Plus,
  Trash2,
  RotateCcw
} from 'lucide-react'
import { cn } from '../../lib/utils'

export function RoadmapView() {
  const { 
    roadmap, 
    currentRole, 
    toggleRoadmapModule, 
    deleteRoadmapTask, 
    seedRoadmapTemplate 
  } = useStudent()
  
  const [filterRoleOnly, setFilterRoleOnly] = useState(true)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [seeding, setSeeding] = useState(false)

  // Filter modules
  const displayedModules = roadmap.filter((mod) => {
    if (filterRoleOnly) {
      return mod.roleId === currentRole.id
    }
    return true
  })

  const completedCount = displayedModules.filter((m) => m.completed).length
  const totalCount = displayedModules.length
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  const handleSeedTemplate = async () => {
    setSeeding(true)
    try {
      await seedRoadmapTemplate(currentRole.id)
    } finally {
      setSeeding(false)
    }
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
              My Growth Path
            </h2>
            <Badge variant="sprout">
              {currentRole.name} Focus
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Prioritized curriculum to systematically close identified skill gaps with verifiable proof.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            disabled={seeding}
            onClick={handleSeedTemplate}
            className="text-xs gap-1.5"
            title="Import recommended template tasks for this role"
          >
            <RotateCcw className={cn('w-3.5 h-3.5', seeding && 'animate-spin')} />
            {seeding ? 'Loading...' : 'Import Role Template'}
          </Button>

          <Button
            variant="sprout"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="text-xs font-bold gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Custom Task
          </Button>
        </div>
      </div>

      {/* Progress & Filter Bar */}
      <Card className="bg-gradient-to-r from-card to-[var(--background-subtle)]">
        <CardContent className="p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="w-full md:max-w-md space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-foreground">
                Path Completion for {currentRole.name}
              </span>
              <span className="font-extrabold text-primary">
                {completedCount}/{totalCount} ({progressPct}%)
              </span>
            </div>
            <Progress value={progressPct} colorVariant="success" />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <Button
              size="sm"
              variant={filterRoleOnly ? 'default' : 'outline'}
              onClick={() => setFilterRoleOnly(true)}
              className="text-xs"
            >
              Current Role ({roadmap.filter(m => m.roleId === currentRole.id).length})
            </Button>
            <Button
              size="sm"
              variant={!filterRoleOnly ? 'default' : 'outline'}
              onClick={() => setFilterRoleOnly(false)}
              className="text-xs"
            >
              All Roles ({roadmap.length})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      {displayedModules.length === 0 && (
        <Card className="p-8 text-center space-y-3">
          <Milestone className="w-10 h-10 text-muted-foreground mx-auto" />
          <h3 className="text-base font-bold text-foreground">No tasks in this path yet</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Click "Import Role Template" to load industry-curated modules for {currentRole.name}, or add your own custom tasks.
          </p>
          <div className="pt-2">
            <Button size="sm" variant="sprout" onClick={handleSeedTemplate} disabled={seeding}>
              Import {currentRole.name} Curriculum
            </Button>
          </div>
        </Card>
      )}

      {/* Roadmap Modules List */}
      <div className="space-y-4">
        {displayedModules.map((module, index) => {
          return (
            <Card
              key={module.id}
              className={cn(
                'transition-all duration-200 border',
                module.completed
                  ? 'border-emerald-500/30 bg-emerald-500/5'
                  : 'hover:border-border-hover'
              )}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    {/* Interactive Completion Button */}
                    <button
                      onClick={() => toggleRoadmapModule(module.id)}
                      className="mt-1 shrink-0 text-foreground hover:scale-110 transition-transform cursor-pointer"
                      title={module.completed ? 'Mark as incomplete' : 'Mark as completed'}
                      aria-label={module.completed ? 'Mark as incomplete' : 'Mark as completed'}
                    >
                      {module.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                      ) : (
                        <Circle className="w-6 h-6 text-muted-foreground hover:text-primary" />
                      )}
                    </button>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-muted-foreground">
                          Track #{index + 1}
                        </span>
                        <Badge
                          variant={module.priority === 'High' ? 'danger' : 'warning'}
                          size="sm"
                        >
                          {module.priority} Priority
                        </Badge>
                        <span className="text-xs px-2 py-0.5 rounded-md bg-muted text-foreground/80 font-mono">
                          Target: {module.skillTarget}
                        </span>
                        {module.completed && (
                          <Badge variant="success" size="sm">
                            <Sparkles className="w-3 h-3" /> Completed
                          </Badge>
                        )}
                      </div>

                      <CardTitle className={cn('text-base sm:text-lg', module.completed && 'line-through text-muted-foreground')}>
                        {module.title}
                      </CardTitle>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      <span>~{module.estimatedHours} hrs</span>
                    </div>

                    <button
                      onClick={() => deleteRoadmapTask(module.id)}
                      className="p-1 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-muted transition-colors cursor-pointer"
                      title="Delete roadmap task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {module.goal && (
                  <CardDescription className="pt-1 text-foreground/85">
                    <strong className="text-foreground">Goal: </strong>
                    {module.goal}
                  </CardDescription>
                )}
              </CardHeader>

              <CardContent className="space-y-4 pt-0">
                {/* Why companies care */}
                {module.whyItMatters && (
                  <div className="p-3 rounded-xl bg-card border border-border text-xs leading-relaxed space-y-1">
                    <p className="font-semibold text-foreground flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-amber-500" />
                      Why this matters in interviews:
                    </p>
                    <p className="text-muted-foreground">
                      {module.whyItMatters}
                    </p>
                  </div>
                )}

                {/* Portfolio Challenge */}
                {module.portfolioChallenge && (
                  <div className="p-3 rounded-xl bg-muted/60 border border-border text-xs leading-relaxed space-y-1">
                    <p className="font-semibold text-foreground flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      Actionable Portfolio Addition:
                    </p>
                    <p className="text-foreground/90">
                      {module.portfolioChallenge}
                    </p>
                  </div>
                )}

                {/* Free Documentation & Resources */}
                {module.resources && module.resources.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      Recommended Documentation & Guides:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {module.resources.map((res) => (
                        <a
                          key={res.url}
                          href={res.url}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-muted text-xs font-medium text-foreground transition-colors group"
                        >
                          <span className="group-hover:text-primary transition-colors">
                            {res.title}
                          </span>
                          <span className="text-[10px] text-muted-foreground font-mono">
                            [{res.type}]
                          </span>
                          <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-primary" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  )
}
