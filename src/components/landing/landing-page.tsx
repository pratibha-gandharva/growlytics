import { BrandLogo } from '../layout/brand-logo'
import { ThemeToggle } from '../layout/theme-toggle'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card'
import { 
  Sparkles, 
  FolderGit2, 
  Compass, 
  Milestone, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Users
} from 'lucide-react'

interface LandingPageProps {
  onOpenAuth: (mode: 'signin' | 'signup') => void
}

export function LandingPage({ onOpenAuth }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 selection:text-primary">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <BrandLogo />

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenAuth('signin')}
              className="text-xs font-semibold"
            >
              Sign In
            </Button>
            <Button
              variant="sprout"
              size="sm"
              onClick={() => onOpenAuth('signup')}
              className="text-xs font-semibold shadow-xs"
            >
              Get Started Free
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>The Multi-User Internship Preparation Platform</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.15]">
            Grow your skills. <br className="hidden sm:inline" />
            <span className="text-primary bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              Build your proof.
            </span>{' '}
            Track your progress.
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed">
            Growlytics empowers college students to land tech internships through personalized learning roadmaps, demonstrable project milestones, verified skill-gap benchmarks, and an AI learning companion.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Button
              size="lg"
              variant="sprout"
              onClick={() => onOpenAuth('signup')}
              className="w-full sm:w-auto text-sm font-bold gap-2 shadow-md cursor-pointer"
            >
              Begin Your Growth Journey <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => onOpenAuth('signin')}
              className="w-full sm:w-auto text-sm font-semibold cursor-pointer"
            >
              Sign In to Your Account
            </Button>
          </div>

          {/* Social Proof & Value Props */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Private & Secure Cloud Isolation</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Deterministic, Verifiable Readiness Index</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Designed for Engineering Undergrads</span>
            </div>
          </div>
        </div>
      </section>

      {/* Target Roles Supported */}
      <section className="py-12 border-y border-border bg-card/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-bold uppercase tracking-wider text-muted-foreground mb-6">
            Curated benchmarks for high-demand software engineering tracks
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: 'Frontend Developer', desc: 'React, TypeScript, Accessibility & Core Web Vitals' },
              { title: 'Full-Stack Developer', desc: 'End-to-end architectures, APIs, PostgreSQL & Docker' },
              { title: 'Backend Developer', desc: 'Distributed services, Redis caching, SQL tuning & concurrency' },
              { title: 'AI / ML Engineer', desc: 'Vector databases, Python, FastAPI & semantic evaluation' }
            ].map((role) => (
              <div key={role.title} className="p-4 rounded-2xl bg-card border border-border space-y-1">
                <Badge variant="outline" size="sm" className="mb-1 text-[10px]">Intern Track</Badge>
                <h3 className="font-bold text-sm text-foreground">{role.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{role.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Platform Pillars */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              A Complete System for Internship Preparation
            </h2>
            <p className="text-sm text-muted-foreground">
              Everything you need to transform theoretical knowledge into verifiable proof that impresses technical interviewers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pillar 1 */}
            <Card className="hover:border-emerald-500/40 transition-colors">
              <CardHeader>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2">
                  <FolderGit2 className="w-5 h-5" />
                </div>
                <CardTitle className="text-lg">Project Garden with Milestones</CardTitle>
                <CardDescription>
                  Showcase real engineering repos. Break projects into verifiable milestones like SQL schema indexing, WebSocket connection pools, or Playwright E2E suites.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-1.5">
                <div className="flex items-center gap-1.5 text-foreground/80">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Live demo & GitHub links</span>
                </div>
                <div className="flex items-center gap-1.5 text-foreground/80">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Awarded skill competencies</span>
                </div>
              </CardContent>
            </Card>

            {/* Pillar 2 */}
            <Card className="hover:border-primary/40 transition-colors">
              <CardHeader>
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-2">
                  <Compass className="w-5 h-5" />
                </div>
                <CardTitle className="text-lg">Skill Gap Explorer</CardTitle>
                <CardDescription>
                  Understand exactly what technical recruiters assess for your dream internship role. Compare your demonstrable skills against industry benchmarks.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-1.5">
                <div className="flex items-center gap-1.5 text-foreground/80">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Interactive radar & gap analysis</span>
                </div>
                <div className="flex items-center gap-1.5 text-foreground/80">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Critical, Important & Nice-to-Have tiers</span>
                </div>
              </CardContent>
            </Card>

            {/* Pillar 3 */}
            <Card className="hover:border-purple-500/40 transition-colors">
              <CardHeader>
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2">
                  <Milestone className="w-5 h-5" />
                </div>
                <CardTitle className="text-lg">Customizable Growth Path</CardTitle>
                <CardDescription>
                  Follow role-tailored roadmaps with free high-quality documentation (MDN, React, Redis, Docker), create custom tasks, and log study sessions.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground space-y-1.5">
                <div className="flex items-center gap-1.5 text-foreground/80">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Study hours & practice logs</span>
                </div>
                <div className="flex items-center gap-1.5 text-foreground/80">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Interview-oriented portfolio challenges</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-16 bg-gradient-to-br from-emerald-500/10 via-card to-background border-t border-border">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl font-extrabold text-foreground">
            Ready to prepare for your next technical interview?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm">
            Create your private student profile, select your target role, and begin closing skill gaps today.
          </p>
          <div>
            <Button
              size="lg"
              variant="sprout"
              onClick={() => onOpenAuth('signup')}
              className="text-sm font-bold shadow-md cursor-pointer"
            >
              Get Started with Growlytics
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-border py-8 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} Growlytics. Grow your skills. Build your proof. Track your progress.</p>
      </footer>
    </div>
  )
}
