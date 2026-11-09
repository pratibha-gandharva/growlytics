import { useStudent } from '../../context/student-context'
import { Badge } from '../ui/badge'
import { 
  Globe, 
  GraduationCap, 
  Sparkles, 
  Calendar,
  Briefcase
} from 'lucide-react'
import { GithubIcon, LinkedinIcon } from '../icons/brand-icons'

export function StudentBanner() {
  const { profile, currentRole, readiness } = useStudent()

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card via-card to-[var(--background-subtle)] p-6 sm:p-8 shadow-sm">
      {/* Decorative botanical background blob */}
      <div 
        className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-emerald-500/10 dark:bg-emerald-500/5 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div 
        className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-purple-500/10 dark:bg-purple-500/5 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4 sm:gap-5">
          {/* Avatar with Sprout Accent */}
          <div className="relative shrink-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-800 flex items-center justify-center text-white text-2xl sm:text-3xl font-extrabold shadow-lg shadow-emerald-900/15 ring-4 ring-background">
              {profile.name.charAt(0)}
            </div>
            <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center text-xs font-bold ring-2 ring-background shadow-xs" title="Level 3 Sprout">
              🌱
            </span>
          </div>

          {/* Bio & Details */}
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-foreground font-sans">
                {profile.name}
              </h1>
              <Badge variant="sprout" size="sm">
                <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                {profile.recruitmentSeason}
              </Badge>
            </div>

            <p className="text-sm font-medium text-muted-foreground flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1">
                <GraduationCap className="w-4 h-4 text-primary" />
                {profile.university} • {profile.major}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                Class of {profile.graduationYear}
              </span>
            </p>

            <p className="text-xs sm:text-sm text-foreground/85 max-w-2xl leading-relaxed pt-1">
              {profile.bio}
            </p>

            {/* Social / Portfolio Links */}
            <div className="flex items-center gap-3 pt-2 text-xs font-medium">
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-border bg-card hover:bg-muted text-foreground transition-colors"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>@{profile.githubUsername}</span>
              </a>
              {profile.linkedinUrl && (
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-border bg-card hover:bg-muted text-foreground transition-colors"
                >
                  <LinkedinIcon className="w-3.5 h-3.5 text-blue-500" />
                  <span>LinkedIn</span>
                </a>
              )}
              {profile.personalWebsite && (
                <a
                  href={profile.personalWebsite}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-border bg-card hover:bg-muted text-foreground transition-colors"
                >
                  <Globe className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Portfolio</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Readiness Card Badge */}
        <div className="shrink-0 flex flex-col justify-between p-4 rounded-2xl bg-card border border-border shadow-xs sm:min-w-[220px]">
          <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground mb-2">
            <span className="flex items-center gap-1 font-semibold text-foreground">
              <Briefcase className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              Target Role
            </span>
            <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-300">
              Active Focus
            </span>
          </div>

          <p className="text-sm font-bold text-foreground line-clamp-1 mb-3">
            {currentRole.name}
          </p>

          <div className="pt-2 border-t border-border flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">Readiness Index</span>
            <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
              {readiness.overallScore}%
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
