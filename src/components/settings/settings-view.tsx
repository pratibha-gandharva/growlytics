import { useState, useEffect } from 'react'
import { useStudent } from '../../context/student-context'
import { useAuth } from '../../context/auth-context'
import { useTheme } from '../../context/theme-context'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card'
import { Input, Textarea } from '../ui/input'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { 
  User, 
  Sun, 
  Moon, 
  Save, 
  Briefcase,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  FolderGit2
} from 'lucide-react'

export function SettingsView() {
  const { profile, updateProfile, roles, currentRole, setTargetRoleId, loadDemoProjects, projects } = useStudent()
  const { user, signOut } = useAuth()
  const { theme, setTheme } = useTheme()

  // Profile Form State
  const [name, setName] = useState(profile.name)
  const [university, setUniversity] = useState(profile.university)
  const [major, setMajor] = useState(profile.major)
  const [graduationYear, setGraduationYear] = useState(profile.graduationYear)
  const [githubUsername, setGithubUsername] = useState(profile.githubUsername)
  const [githubUrl, setGithubUrl] = useState(profile.githubUrl)
  const [linkedinUrl, setLinkedinUrl] = useState(profile.linkedinUrl || '')
  const [personalWebsite, setPersonalWebsite] = useState(profile.personalWebsite || '')
  const [bio, setBio] = useState(profile.bio)

  const [saving, setSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [loadingDemo, setLoadingDemo] = useState(false)
  const [demoLoadedMsg, setDemoLoadedMsg] = useState(false)

  // Keep form in sync when profile loads
  useEffect(() => {
    setName(profile.name)
    setUniversity(profile.university)
    setMajor(profile.major)
    setGraduationYear(profile.graduationYear)
    setGithubUsername(profile.githubUsername)
    setGithubUrl(profile.githubUrl)
    setLinkedinUrl(profile.linkedinUrl || '')
    setPersonalWebsite(profile.personalWebsite || '')
    setBio(profile.bio)
  }, [profile])

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateProfile({
        name,
        university,
        major,
        graduationYear,
        githubUsername,
        githubUrl: githubUrl || (githubUsername ? `https://github.com/${githubUsername}` : ''),
        linkedinUrl: linkedinUrl || undefined,
        personalWebsite: personalWebsite || undefined,
        bio
      })
      setSavedSuccess(true)
      setTimeout(() => setSavedSuccess(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  const handleImportDemo = async () => {
    setLoadingDemo(true)
    try {
      await loadDemoProjects()
      setDemoLoadedMsg(true)
      setTimeout(() => setDemoLoadedMsg(false), 3000)
    } finally {
      setLoadingDemo(false)
    }
  }

  return (
    <div className="space-y-8 animate-fade-in pb-12 max-w-4xl">
      {/* Header */}
      <div className="pb-2 border-b border-border">
        <h2 className="text-2xl font-extrabold text-foreground tracking-tight">
          Settings & Profile
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Manage your verified student portfolio profile, target internship roles, and interface theme.
        </p>
      </div>

      {/* Account Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <CardTitle className="text-base sm:text-lg">Account Identity</CardTitle>
            </div>
            <Badge variant="sprout">Firebase Authenticated</Badge>
          </div>
          <CardDescription>
            Your account data is private, isolated to your user ID, and protected by Firestore Security Rules.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-muted/60 border border-border">
              <span className="text-muted-foreground font-medium block mb-0.5">Email Address</span>
              <span className="font-bold text-foreground">{user?.email || 'N/A'}</span>
            </div>
            <div className="p-3 rounded-xl bg-muted/60 border border-border">
              <span className="text-muted-foreground font-medium block mb-0.5">User UID (Firestore Namespace)</span>
              <span className="font-mono text-[11px] text-foreground truncate block">
                {user?.uid || 'N/A'}
              </span>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut()}
              className="text-xs text-red-600 dark:text-red-400 gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Target Role Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Target Internship Role
          </CardTitle>
          <CardDescription>
            Benchmarks your skill levels, gap analysis, and growth curriculum against this role.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {roles.map((r) => {
              const isSelected = r.id === currentRole.id
              return (
                <button
                  key={r.id}
                  onClick={() => setTargetRoleId(r.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-500/10 border-emerald-500 ring-2 ring-emerald-500/20 text-foreground font-bold'
                      : 'bg-card border-border hover:bg-muted text-card-foreground'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs">{r.name}</span>
                    {isSelected && (
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-bold">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground font-normal line-clamp-1">
                    {r.subtitle}
                  </p>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Theme Preferences Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <Sun className="w-5 h-5 text-amber-500" />
            Theme Preference
          </CardTitle>
          <CardDescription>
            Choose your preferred color theme.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 max-w-md">
            <button
              onClick={() => setTheme('light')}
              className={`flex items-center gap-3 p-3.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                theme === 'light'
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-900 dark:text-amber-200 ring-2 ring-amber-500/20'
                  : 'bg-card border-border hover:bg-muted text-muted-foreground'
              }`}
            >
              <Sun className="w-5 h-5 text-amber-500" />
              <div className="text-left">
                <p>Botanical Linen (Light)</p>
                <p className="text-[10px] font-normal text-muted-foreground">Warm cream & sage</p>
              </div>
            </button>

            <button
              onClick={() => setTheme('dark')}
              className={`flex items-center gap-3 p-3.5 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200 ring-2 ring-emerald-500/20'
                  : 'bg-card border-border hover:bg-muted text-muted-foreground'
              }`}
            >
              <Moon className="w-5 h-5 text-emerald-400" />
              <div className="text-left">
                <p>Midnight Pine (Dark)</p>
                <p className="text-[10px] font-normal text-muted-foreground">Charcoal & luminous sage</p>
              </div>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Profile Form Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Personal Student Portfolio Profile
          </CardTitle>
          <CardDescription>
            Contextual details displayed on your personal dashboard banner.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <Input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  University / College
                </label>
                <Input
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Major / Degree
                </label>
                <Input
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Expected Graduation
                </label>
                <Input
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(e.target.value)}
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
                  className="text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  GitHub Profile URL
                </label>
                <Input
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  LinkedIn URL (Optional)
                </label>
                <Input
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Personal Portfolio Website (Optional)
                </label>
                <Input
                  value={personalWebsite}
                  onChange={(e) => setPersonalWebsite(e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Student Bio & Learning Summary
              </label>
              <Textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="text-xs"
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border">
              {savedSuccess ? (
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Profile updated in Cloud Firestore!</span>
                </div>
              ) : (
                <span />
              )}

              <Button
                type="submit"
                disabled={saving}
                variant="sprout"
                size="sm"
                className="text-xs font-bold gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                {saving ? 'Saving...' : 'Save Profile'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Demo Projects Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base sm:text-lg flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-purple-500" />
            Sample Architecture & Demo Repositories
          </CardTitle>
          <CardDescription>
            Import reference portfolio projects with verified milestone structures into your personal account.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">
              Current account has <strong className="text-foreground">{projects.length}</strong> projects.
            </p>
            {demoLoadedMsg && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-1">
                Sample projects successfully imported!
              </p>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={loadingDemo}
            onClick={handleImportDemo}
            className="text-xs"
          >
            {loadingDemo ? 'Importing...' : 'Load Sample Projects'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
