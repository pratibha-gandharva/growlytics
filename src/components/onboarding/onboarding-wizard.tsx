import { useState } from 'react'
import { useAuth } from '../../context/auth-context'
import { BENCHMARK_ROLES } from '../../data/initial-data'
import { RoleCategoryId } from '../../types'
import { Button } from '../ui/button'
import { Input, Textarea } from '../ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { 
  Sparkles, 
  ArrowRight, 
  GraduationCap, 
  CheckCircle2 
} from 'lucide-react'

export function OnboardingWizard() {
  const { user, profile, completeOnboarding } = useAuth()

  const [step, setStep] = useState<1 | 2>(1)
  const [displayName, setDisplayName] = useState(profile?.displayName || user?.displayName || '')
  const [targetRoleId, setTargetRoleId] = useState<RoleCategoryId>(profile?.targetRoleId || 'fullstack-intern')
  
  // Optional Step 2 fields
  const [university, setUniversity] = useState(profile?.university || '')
  const [major, setMajor] = useState(profile?.major || '')
  const [graduationYear, setGraduationYear] = useState(profile?.graduationYear || '')
  const [githubUsername, setGithubUsername] = useState(profile?.githubUsername || '')
  const [bio, setBio] = useState(profile?.bio || '')
  
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault()
    if (!displayName.trim()) {
      setErrorMsg('Please enter your full name.')
      return
    }
    setErrorMsg(null)
    setStep(2)
  }

  const handleFinalSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setErrorMsg(null)
    setSubmitting(true)

    try {
      await completeOnboarding({
        displayName: displayName.trim(),
        targetRoleId,
        university: university.trim() || undefined,
        major: major.trim() || undefined,
        graduationYear: graduationYear.trim() || undefined,
        githubUsername: githubUsername.trim() || undefined,
        githubUrl: githubUsername.trim() ? `https://github.com/${githubUsername.trim()}` : undefined,
        bio: bio.trim() || undefined
      })
    } catch (err: any) {
      console.error('Failed to complete onboarding:', err)
      setErrorMsg(err?.message || 'Failed to save profile. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-center items-center p-4 sm:p-6 selection:bg-primary/20 selection:text-primary animate-fade-in">
      <div className="w-full max-w-2xl space-y-6">
        
        {/* Progress Bar & Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome to Growlytics • Step {step} of 2</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            {step === 1 ? 'Select your Internship Target' : 'Personalize your Student Profile'}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
            {step === 1
              ? 'Choose the engineering role you are preparing for. Growlytics will benchmark your skills and curate your learning roadmap.'
              : 'Add your university and GitHub handle to contextualize your portfolio. You can always update these in Settings.'}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-700 dark:text-red-300 text-xs">
            {errorMsg}
          </div>
        )}

        {/* Step 1: Target Role Selection */}
        {step === 1 && (
          <form onSubmit={handleNextStep} className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">Your Details</CardTitle>
                <CardDescription>What should we call you on your dashboard?</CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Your Full Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="text-xs"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Target Role Benchmark <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {BENCHMARK_ROLES.map((role) => {
                  const isSelected = targetRoleId === role.id
                  return (
                    <div
                      key={role.id}
                      onClick={() => setTargetRoleId(role.id)}
                      className={`p-4 rounded-2xl border text-left cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? 'bg-emerald-500/10 border-emerald-500 ring-2 ring-emerald-500/20 text-foreground'
                          : 'bg-card border-border hover:border-border-hover text-card-foreground'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <Badge
                          variant={isSelected ? 'success' : 'outline'}
                          size="sm"
                          className="text-[10px]"
                        >
                          {role.badgeText}
                        </Badge>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        )}
                      </div>
                      <h3 className="font-bold text-sm text-foreground mb-1">
                        {role.name}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {role.subtitle}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                variant="sprout"
                size="lg"
                className="text-xs font-bold gap-2 cursor-pointer shadow-xs"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </form>
        )}

        {/* Step 2: Optional Academic & GitHub Info */}
        {step === 2 && (
          <form onSubmit={handleFinalSubmit} className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  Academic Background (Optional)
                </CardTitle>
                <CardDescription>
                  Helps contextualize recruitment seasons and internship eligibility.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      College or University
                    </label>
                    <Input
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                      placeholder="e.g. State University"
                      className="text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Degree & Major
                    </label>
                    <Input
                      value={major}
                      onChange={(e) => setMajor(e.target.value)}
                      placeholder="e.g. B.S. in Computer Science"
                      className="text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      Expected Graduation
                    </label>
                    <Input
                      value={graduationYear}
                      onChange={(e) => setGraduationYear(e.target.value)}
                      placeholder="e.g. Spring 2027"
                      className="text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">
                      GitHub Username
                    </label>
                    <Input
                      value={githubUsername}
                      onChange={(e) => setGithubUsername(e.target.value)}
                      placeholder="e.g. dev-student"
                      className="text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-foreground mb-1">
                    Bio / Focus
                  </label>
                  <Textarea
                    rows={2}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Short summary of what you are currently learning..."
                    className="text-xs"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center justify-between pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setStep(1)}
                className="text-xs"
              >
                Back
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={submitting}
                  onClick={() => handleFinalSubmit()}
                  className="text-xs"
                >
                  Skip for Now
                </Button>
                <Button
                  type="submit"
                  variant="sprout"
                  size="lg"
                  disabled={submitting}
                  className="text-xs font-bold gap-2 cursor-pointer shadow-xs"
                >
                  {submitting ? 'Setting Up...' : 'Enter Dashboard'} <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </form>
        )}

      </div>
    </div>
  )
}
