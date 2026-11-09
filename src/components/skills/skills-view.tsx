import { useState } from 'react'
import { useStudent } from '../../context/student-context'
import { SkillProficiencyStatus } from '../../types'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { SkillRadarChart } from './skill-radar-chart'
import { 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ShieldAlert,
  Info
} from 'lucide-react'

export function SkillsView() {
  const { roles, currentRole, setTargetRoleId, evaluatedSkills, readiness } = useStudent()
  const [statusFilter, setStatusFilter] = useState<string>('All')

  const filteredSkills = evaluatedSkills.filter((s) => {
    if (statusFilter === 'All') return true
    return s.status === statusFilter
  })

  const getStatusBadge = (status: SkillProficiencyStatus) => {
    switch (status) {
      case 'Demonstrated':
        return (
          <Badge variant="success" size="sm">
            <CheckCircle2 className="w-3 h-3" /> Demonstrated
          </Badge>
        )
      case 'Developing':
        return (
          <Badge variant="warning" size="sm">
            <AlertCircle className="w-3 h-3" /> Developing
          </Badge>
        )
      case 'Missing':
        return (
          <Badge variant="danger" size="sm">
            <ShieldAlert className="w-3 h-3" /> Missing Gap
          </Badge>
        )
    }
  }

  const getImportanceBadge = (importance: string) => {
    switch (importance) {
      case 'Critical':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
            Critical
          </span>
        )
      case 'Important':
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
            Important
          </span>
        )
      default:
        return (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border">
            Nice-to-Have
          </span>
        )
    }
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
              Skill Gap Explorer
            </h2>
            <Badge variant="sprout">{currentRole.badgeText}</Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Compare your verified portfolio proof against target internship role standards.
          </p>
        </div>

        {/* Readiness Index Pill */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-card border border-border shrink-0">
          <div className="text-right">
            <p className="text-[10px] uppercase font-bold text-muted-foreground">Role Readiness</p>
            <p className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
              {readiness.overallScore}% Met
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Role Switcher Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {roles.map((role) => {
          const isSelected = role.id === currentRole.id
          return (
            <button
              key={role.id}
              onClick={() => setTargetRoleId(role.id)}
              className={`p-4 rounded-2xl text-left border transition-all cursor-pointer relative ${
                isSelected
                  ? 'bg-card border-primary ring-2 ring-primary/20 shadow-sm'
                  : 'bg-card/60 border-border hover:bg-card hover:border-border-hover'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-xs font-bold ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                  {role.name}
                </span>
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                )}
              </div>
              <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                {role.subtitle}
              </p>
            </button>
          )
        })}
      </div>

      {/* Comparison Radar & Summary Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Radar Chart (7 cols) */}
        <Card className="lg:col-span-7 flex flex-col justify-between">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base sm:text-lg">
                  Proficiency vs. Industry Benchmark
                </CardTitle>
                <CardDescription>
                  Spider radar mapping your level (0–5) vs. requirements for {currentRole.name}.
                </CardDescription>
              </div>
              <Badge variant="outline" size="sm">7 Core Axes</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-2">
            <SkillRadarChart skills={evaluatedSkills} />
          </CardContent>
        </Card>

        {/* Readiness Breakdown & Stats (5 cols) */}
        <Card className="lg:col-span-5 flex flex-col justify-between">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">
              Gap Analysis Summary
            </CardTitle>
            <CardDescription>
              Deterministic scoring based on your completed project milestones and roadmap evidence.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-foreground">Critical Skills Met</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                  {readiness.criticalSkillsCoverage}%
                </span>
              </div>
              <Progress value={readiness.criticalSkillsCoverage} colorVariant="success" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-foreground">Project Milestones Verified</span>
                <span className="font-extrabold text-purple-600 dark:text-purple-400">
                  {readiness.projectProofScore}%
                </span>
              </div>
              <Progress value={readiness.projectProofScore} colorVariant="lavender" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-foreground">Growth Path Velocity</span>
                <span className="font-extrabold text-amber-600 dark:text-amber-400">
                  {readiness.roadmapVelocity}%
                </span>
              </div>
              <Progress value={readiness.roadmapVelocity} colorVariant="amber" />
            </div>

            <div className="p-3.5 rounded-xl bg-muted/60 border border-border text-xs space-y-1.5 mt-2">
              <p className="font-bold text-foreground flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-primary" />
                Interviewer Perspective
              </p>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                Interviewers prioritize candidates who can speak concretely about trade-offs in <strong className="text-foreground">Critical</strong> skills over those with surface-level exposure across 20 languages.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Skills Filter Tabs */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {['All', 'Demonstrated', 'Developing', 'Missing'].map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer border ${
                statusFilter === filter
                  ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                  : 'bg-card text-muted-foreground border-border hover:bg-muted hover:text-foreground'
              }`}
            >
              {filter} ({filter === 'All' ? evaluatedSkills.length : evaluatedSkills.filter(s => s.status === filter).length})
            </button>
          ))}
        </div>
      </div>

      {/* Skills Detail Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSkills.map((skill) => (
          <Card key={skill.skillName} className="hover:border-border-hover transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {getStatusBadge(skill.status)}
                    {getImportanceBadge(skill.importance)}
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">
                      {skill.category}
                    </span>
                  </div>
                  <CardTitle className="text-base font-bold">
                    {skill.skillName}
                  </CardTitle>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-foreground">
                    Level {skill.currentLevel}
                  </span>
                  <span className="text-[10px] text-muted-foreground block">
                    Target: Lvl {skill.targetLevel}
                  </span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {/* Progress Level Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-muted-foreground font-medium">
                  <span>Demonstrated Mastery</span>
                  <span>{Math.round((skill.currentLevel / skill.targetLevel) * 100)}% of role target</span>
                </div>
                <Progress 
                  value={skill.currentLevel} 
                  max={skill.targetLevel}
                  colorVariant={
                    skill.status === 'Demonstrated' ? 'success' : skill.status === 'Developing' ? 'amber' : 'primary'
                  }
                />
              </div>

              {/* Why it matters */}
              <p className="text-xs text-foreground/80 leading-relaxed">
                <strong className="text-foreground">Why companies test this: </strong>
                {skill.explanation}
              </p>

              {/* Evidence or Next Step */}
              <div className="pt-2 border-t border-border/70 text-xs">
                {skill.evidenceProjects.length > 0 ? (
                  <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>Evidence in: <strong>{skill.evidenceProjects.join(', ')}</strong></span>
                  </div>
                ) : (
                  <div className="flex items-start gap-1.5 text-amber-700 dark:text-amber-300">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <span><strong>Recommended Next Step:</strong> {skill.recommendedAction}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
