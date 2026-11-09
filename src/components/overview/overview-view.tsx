import { useState } from 'react'
import { useStudent } from '../../context/student-context'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Progress } from '../ui/progress'
import { StudentBanner } from '../layout/student-banner'
import { StudyTrackerModal } from '../tracker/study-tracker-modal'
import { PracticeTrackerModal } from '../tracker/practice-tracker-modal'
import { 
  FolderGit2, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Flame, 
  ExternalLink, 
  Target, 
  Info,
  Clock,
  Plus
} from 'lucide-react'
import { GithubIcon } from '../icons/brand-icons'
import { NavTab } from '../layout/navbar'

export function OverviewView({ onNavigate }: { onNavigate: (tab: NavTab) => void }) {
  const { 
    projects, 
    roadmap, 
    currentRole, 
    readiness, 
    toggleMilestone, 
    toggleRoadmapModule,
    totalStudyMinutes,
    studySessions,
    practiceRecords,
    loadDemoProjects
  } = useStudent()
  
  const [showFormulaModal, setShowFormulaModal] = useState(false)
  const [isStudyModalOpen, setIsStudyModalOpen] = useState(false)
  const [isPracticeModalOpen, setIsPracticeModalOpen] = useState(false)
  const [loadingDemo, setLoadingDemo] = useState(false)

  // Calculate high-impact next best actions
  const incompleteProjects = projects.filter((p) => p.status !== 'Completed')
  const nextIncompleteMilestone = projects
    .flatMap((p) => p.milestones.map((m) => ({ ...m, projectId: p.id, projectTitle: p.title })))
    .find((m) => !m.completed)

  const nextRoadmapItem = roadmap
    .filter((r) => r.roleId === currentRole.id && !r.completed)
    .sort((a, b) => {
      if (a.priority === 'High' && b.priority !== 'High') return -1
      if (a.priority !== 'High' && b.priority === 'High') return 1
      return 0
    })[0]

  // Total completed milestones
  const allMilestones = projects.flatMap((p) => p.milestones)
  const completedMilestonesCount = allMilestones.filter((m) => m.completed).length

  const studyHours = Math.round((totalStudyMinutes / 60) * 10) / 10

  const handleLoadDemo = async () => {
    setLoadingDemo(true)
    try {
      await loadDemoProjects()
    } finally {
      setLoadingDemo(false)
    }
  }

  return (
    <div className="space-y-7 animate-fade-in pb-12">
      {/* Student Profile Header */}
      <StudentBanner />

      {/* KPI Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1: Overall Readiness */}
        <Card className="hover:border-emerald-500/40 transition-colors">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Internship Readiness
              </span>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Sparkles className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-extrabold text-foreground">
                {readiness.overallScore}%
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {readiness.overallScore >= 70 ? 'Competitive' : 'In Progress'}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <Progress 
              value={readiness.overallScore} 
              colorVariant="success" 
              className="mt-1" 
            />
            <div className="flex justify-between items-center text-[11px] text-muted-foreground mt-2">
              <span>Benchmark: 85%</span>
              <button
                onClick={() => setShowFormulaModal(true)}
                className="text-primary hover:underline font-medium inline-flex items-center gap-0.5 cursor-pointer"
              >
                Calculation logic <Info className="w-3 h-3" />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Stat 2: Verified Projects */}
        <Card className="hover:border-primary/40 transition-colors">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Project Garden
              </span>
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <FolderGit2 className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-extrabold text-foreground">
                {projects.length}
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                repositories
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1.5 text-xs text-foreground/85 mt-1">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {projects.filter((p) => p.status === 'Completed').length} Completed
              </span>
              <span>•</span>
              <span className="text-amber-600 dark:text-amber-400 font-medium">
                {incompleteProjects.length} Active
              </span>
            </div>
            <div className="mt-2 text-[11px] text-muted-foreground">
              {allMilestones.length > 0
                ? `${completedMilestonesCount}/${allMilestones.length} milestones verified`
                : 'No milestones recorded yet'}
            </div>
          </CardContent>
        </Card>

        {/* Stat 3: Study Time */}
        <Card className="hover:border-purple-500/40 transition-colors">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Study Time Logged
              </span>
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-extrabold text-foreground">
                {studyHours}h
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                ({studySessions.length} sessions)
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mt-2">
              <span className="text-[11px] text-muted-foreground">Independent deep work</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsStudyModalOpen(true)}
                className="h-6 text-[11px] text-purple-600 dark:text-purple-400 font-bold p-0 hover:underline cursor-pointer"
              >
                + Log Session
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stat 4: Practice Problems & Accuracy */}
        <Card className="hover:border-amber-500/40 transition-colors">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Practice Records
              </span>
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Target className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-extrabold text-foreground">
                {practiceRecords.length}
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                sessions tracked
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mt-2">
              <span className="text-[11px] text-muted-foreground">LeetCode & concept quizzes</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPracticeModalOpen(true)}
                className="h-6 text-[11px] text-amber-600 dark:text-amber-400 font-bold p-0 hover:underline cursor-pointer"
              >
                + Log Practice
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Empty State for New Account with zero projects */}
      {projects.length === 0 && (
        <Card className="border-dashed border-2 border-emerald-500/30 bg-emerald-500/5 p-6 sm:p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
            <FolderGit2 className="w-6 h-6" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-foreground">
            Welcome to your Growlytics Workspace!
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
            You don't have any projects in your portfolio yet. Add your current GitHub repositories, or explore with our structured sample projects.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button
              size="sm"
              variant="sprout"
              onClick={() => onNavigate('projects')}
              className="text-xs font-bold gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Your First Project
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={loadingDemo}
              onClick={handleLoadDemo}
              className="text-xs"
            >
              {loadingDemo ? 'Loading...' : 'Load Sample Data (Optional)'}
            </Button>
          </div>
        </Card>
      )}

      {/* Main 2-Column Section: Next Action & Role Fit */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Next Best Actions */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="border-emerald-500/30 bg-gradient-to-br from-card to-emerald-500/5">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    <Flame className="w-4 h-4 animate-pulse" />
                  </div>
                  <CardTitle className="text-base sm:text-lg">
                    Recommended Next Action
                  </CardTitle>
                </div>
                <Badge variant="sprout">Top Priority</Badge>
              </div>
              <CardDescription>
                High-leverage step to move your readiness needle for {currentRole.name}.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {nextRoadmapItem ? (
                <div className="p-4 rounded-xl border border-border bg-card/80 space-y-2.5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">
                          Roadmap Milestone
                        </span>
                        <span className="text-xs text-muted-foreground">~{nextRoadmapItem.estimatedHours} hrs</span>
                      </div>
                      <h4 className="text-sm font-bold text-foreground mt-1">
                        {nextRoadmapItem.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Targeting skill: <span className="font-semibold text-foreground">{nextRoadmapItem.skillTarget}</span>
                      </p>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleRoadmapModule(nextRoadmapItem.id)}
                      className="shrink-0"
                    >
                      Mark Done
                    </Button>
                  </div>

                  {nextRoadmapItem.portfolioChallenge && (
                    <p className="text-xs text-foreground/80 bg-muted/60 p-2.5 rounded-lg border border-border/50">
                      💡 <span className="font-semibold">Portfolio Challenge:</span> {nextRoadmapItem.portfolioChallenge}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => onNavigate('roadmap')}
                      className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      View in My Growth Path <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-card border border-border text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
                  <p className="text-xs font-semibold text-foreground">
                    All current roadmap tracks for {currentRole.name} completed!
                  </p>
                  <Button size="sm" variant="outline" onClick={() => onNavigate('roadmap')}>
                    Add Custom Tasks
                  </Button>
                </div>
              )}

              {nextIncompleteMilestone && (
                <div className="p-4 rounded-xl border border-border bg-card/80 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                          Project Milestone
                        </span>
                        <span className="text-xs font-medium text-foreground">
                          in {nextIncompleteMilestone.projectTitle}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-foreground mt-1">
                        {nextIncompleteMilestone.title}
                      </h4>
                      {nextIncompleteMilestone.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {nextIncompleteMilestone.description}
                        </p>
                      )}
                    </div>

                    <Button
                      size="sm"
                      variant="sprout"
                      onClick={() => toggleMilestone(nextIncompleteMilestone.projectId, nextIncompleteMilestone.id)}
                      className="shrink-0"
                    >
                      Complete
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Projects Preview if any exist */}
          {projects.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base sm:text-lg">Featured Portfolio Proof</CardTitle>
                    <CardDescription>
                      Documented technical implementations and milestone progress.
                    </CardDescription>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onNavigate('projects')}
                  >
                    View All ({projects.length})
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {projects.slice(0, 2).map((proj) => {
                  const completed = proj.milestones.filter((m) => m.completed).length
                  const total = proj.milestones.length
                  const pct = total > 0 ? Math.round((completed / total) * 100) : 0

                  return (
                    <div
                      key={proj.id}
                      className="p-4 rounded-xl border border-border bg-card hover:bg-muted/40 transition-colors space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-foreground">{proj.title}</h4>
                            <Badge 
                              variant={proj.status === 'Completed' ? 'success' : 'peach'} 
                              size="sm"
                            >
                              {proj.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                            {proj.tagline}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {proj.liveDemoUrl && (
                            <a
                              href={proj.liveDemoUrl}
                              target="_blank"
                              rel="noreferrer noopener"
                              className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                              title="Open live demo"
                            >
                              <ExternalLink className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                            </a>
                          )}
                          <a
                            href={proj.githubUrl}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="p-1.5 rounded-lg border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            title="Open GitHub repo"
                          >
                            <GithubIcon className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>

                      <Progress 
                        value={pct} 
                        colorVariant={pct === 100 ? 'success' : 'primary'}
                        showLabel
                        label={`${completed}/${total} Milestones`}
                      />
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Skill Summary & Benchmark */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base sm:text-lg">Target Role Benchmark</CardTitle>
                <Badge variant="outline">{currentRole.badgeText}</Badge>
              </div>
              <CardDescription>
                {currentRole.name}: verified evidence vs requirements.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3.5 rounded-xl bg-muted/60 border border-border/80 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground font-medium">Role Fit Coverage</span>
                  <span className="font-bold text-foreground">{readiness.overallScore}%</span>
                </div>
                <Progress value={readiness.overallScore} colorVariant="success" />

                <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-card border border-border">
                    <p className="text-emerald-600 dark:text-emerald-400 font-extrabold text-base">
                      {readiness.demonstratedCount}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-semibold">Mastered</p>
                  </div>
                  <div className="p-2 rounded-lg bg-card border border-border">
                    <p className="text-amber-600 dark:text-amber-400 font-extrabold text-base">
                      {readiness.developingCount}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-semibold">Developing</p>
                  </div>
                  <div className="p-2 rounded-lg bg-card border border-border">
                    <p className="text-red-500 font-extrabold text-base">
                      {readiness.missingCount}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-semibold">Gaps</p>
                  </div>
                </div>
              </div>

              {/* Priority Gaps */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Critical Skills for {currentRole.name.split(' ')[0]}
                </h4>
                {currentRole.requiredSkills.slice(0, 3).map((req) => (
                  <div 
                    key={req.skillName}
                    className="p-3 rounded-xl border border-border bg-card flex items-start justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-foreground">{req.skillName}</span>
                        {req.importance === 'Critical' && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-red-500/10 text-red-600 dark:text-red-400">
                            Critical
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                        {req.recommendedAction}
                      </p>
                    </div>

                    <Badge variant="outline" size="sm" className="shrink-0 text-[10px]">
                      Target: Lvl {req.targetLevel}
                    </Badge>
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                className="w-full text-xs font-semibold gap-1.5"
                onClick={() => onNavigate('skills')}
              >
                Open Full Skill Gap Explorer <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <StudyTrackerModal
        isOpen={isStudyModalOpen}
        onClose={() => setIsStudyModalOpen(false)}
      />

      <PracticeTrackerModal
        isOpen={isPracticeModalOpen}
        onClose={() => setIsPracticeModalOpen(false)}
      />

      {/* Formula Transparency Modal */}
      {showFormulaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-lg rounded-2xl bg-card border border-border p-6 shadow-2xl text-card-foreground animate-scale-in space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-border">
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  Readiness Score Calculation
                </h3>
                <p className="text-xs text-muted-foreground">
                  Transparent, verifiable, deterministic scoring model
                </p>
              </div>
              <button
                onClick={() => setShowFormulaModal(false)}
                className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-foreground/90 space-y-3 leading-relaxed">
              <p>
                Growlytics does not guess or invent hiring probabilities. Your score (<strong className="text-emerald-600 dark:text-emerald-400">{readiness.overallScore}%</strong>) is computed deterministically from three verifiable pillars:
              </p>

              <div className="p-3 rounded-xl bg-muted/60 border border-border space-y-2">
                <div className="flex justify-between font-semibold">
                  <span>1. Skill Coverage Matrix (50% Weight)</span>
                  <span className="text-primary">Lvl Match / Target</span>
                </div>
                <p className="text-muted-foreground text-[11px]">
                  Evaluates each skill required for {currentRole.name}. Skills weighted by Critical (3x), Important (2x), Nice-to-Have (1x).
                </p>

                <div className="flex justify-between font-semibold pt-1">
                  <span>2. Project Milestones Proof (30% Weight)</span>
                  <span className="text-purple-600 dark:text-purple-400">
                    {readiness.projectProofScore}%
                  </span>
                </div>
                <p className="text-muted-foreground text-[11px]">
                  Ratio of completed milestones across all projects in your portfolio.
                </p>

                <div className="flex justify-between font-semibold pt-1">
                  <span>3. Growth Path Velocity (20% Weight)</span>
                  <span className="text-amber-600 dark:text-amber-400">
                    {readiness.roadmapVelocity}%
                  </span>
                </div>
                <p className="text-muted-foreground text-[11px]">
                  Percentage of recommended learning modules completed for the active target role.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button size="sm" onClick={() => setShowFormulaModal(false)}>
                Got it
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
