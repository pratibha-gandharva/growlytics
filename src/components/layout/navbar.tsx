import { BrandLogo } from './brand-logo'
import { ThemeToggle } from './theme-toggle'
import { useStudent } from '../../context/student-context'
import { useAuth } from '../../context/auth-context'
import { RoleCategoryId } from '../../types'
import { Button } from '../ui/button'
import { 
  Briefcase, 
  ChevronDown, 
  Sparkles, 
  Layers,
  FolderGit2, 
  Compass, 
  Milestone, 
  Settings as SettingsIcon,
  Menu,
  X,
  Bot,
  LogOut
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '../../lib/utils'

export type NavTab = 'overview' | 'projects' | 'skills' | 'roadmap' | 'settings'

interface NavbarProps {
  activeTab: NavTab
  onSelectTab: (tab: NavTab) => void
  onOpenAIChat?: () => void
}

export function Navbar({ activeTab, onSelectTab, onOpenAIChat }: NavbarProps) {
  const { profile, currentRole, roles, setTargetRoleId, readiness } = useStudent()
  const { user, signOut } = useAuth()
  
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'overview', label: 'Overview', icon: Layers },
    { id: 'projects', label: 'Project Garden', icon: FolderGit2 },
    { id: 'skills', label: 'Skill Gap Explorer', icon: Compass },
    { id: 'roadmap', label: 'My Growth Path', icon: Milestone },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ]

  const handleRoleSelect = (roleId: RoleCategoryId) => {
    setTargetRoleId(roleId)
    setRoleDropdownOpen(false)
  }

  const handleSignOut = async () => {
    setUserMenuOpen(false)
    setMobileMenuOpen(false)
    await signOut()
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/85 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => onSelectTab('overview')} 
              className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl text-left"
            >
              <BrandLogo />
            </button>

            {/* Target Role Selector Pill (Desktop) */}
            <div className="hidden lg:block relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-muted text-xs font-medium text-foreground transition-all cursor-pointer shadow-2xs"
                title="Change target internship role"
              >
                <Briefcase className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-muted-foreground font-normal">Target:</span>
                <span className="font-semibold">{currentRole.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground ml-0.5" />
              </button>

              {roleDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setRoleDropdownOpen(false)}
                  />
                  <div className="absolute left-0 mt-2 w-72 rounded-2xl bg-card border border-border p-2 shadow-xl z-50 animate-scale-in">
                    <div className="px-3 py-2 border-b border-border mb-1">
                      <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                        Select Target Role
                      </p>
                    </div>
                    {roles.map((role) => (
                      <button
                        key={role.id}
                        onClick={() => handleRoleSelect(role.id)}
                        className={cn(
                          'w-full flex flex-col items-start px-3 py-2 rounded-xl text-left text-xs transition-colors cursor-pointer',
                          role.id === currentRole.id
                            ? 'bg-primary/10 text-primary font-semibold'
                            : 'hover:bg-muted text-foreground'
                        )}
                      >
                        <span>{role.name}</span>
                        <span className="text-[10px] text-muted-foreground line-clamp-1">
                          {role.subtitle}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-muted/60 p-1 rounded-2xl border border-border/60">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={cn(
                    'flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer',
                    isActive
                      ? 'bg-card text-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
                  )}
                >
                  <Icon className={cn('w-4 h-4', isActive ? 'text-primary' : 'text-muted-foreground')} />
                  {item.label}
                </button>
              )
            })}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* AI Learning Companion Button */}
            {onOpenAIChat && (
              <button
                onClick={onOpenAIChat}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 text-xs font-bold transition-colors cursor-pointer"
                title="Open Growlytics AI Learning Companion"
              >
                <Bot className="w-4 h-4 text-primary" />
                <span className="hidden sm:inline">AI Companion</span>
              </button>
            )}

            {/* Quick Readiness Score Pill */}
            <div 
              onClick={() => onSelectTab('skills')}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold cursor-pointer hover:bg-emerald-500/15 transition-colors"
              title="Click to view detailed skill gaps"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{readiness.overallScore}% Ready</span>
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Profile & Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-muted transition-colors cursor-pointer"
                title="Account menu"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold ring-2 ring-background">
                  {profile.name ? profile.name.charAt(0).toUpperCase() : 'S'}
                </div>
              </button>

              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-card border border-border p-2 shadow-xl z-50 animate-scale-in space-y-1">
                    <div className="px-3 py-2 border-b border-border mb-1">
                      <p className="text-xs font-bold text-foreground truncate">
                        {profile.name}
                      </p>
                      <p className="text-[11px] text-muted-foreground truncate">
                        {user?.email || 'Student Account'}
                      </p>
                      <p className="text-[10px] text-primary font-medium mt-0.5">
                        {currentRole.name}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        onSelectTab('settings')
                        setUserMenuOpen(false)
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs text-foreground hover:bg-muted transition-colors cursor-pointer"
                    >
                      <SettingsIcon className="w-4 h-4 text-muted-foreground" />
                      <span>Account Settings</span>
                    </button>

                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl border border-border bg-card text-foreground hover:bg-muted cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card px-4 pt-3 pb-6 animate-slide-up space-y-3">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id)
                    setMobileMenuOpen(false)
                  }}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors w-full text-left',
                    isActive
                      ? 'bg-primary/10 text-primary font-bold'
                      : 'text-foreground hover:bg-muted'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              )
            })}
          </div>

          {onOpenAIChat && (
            <div className="pt-2">
              <button
                onClick={() => {
                  onOpenAIChat()
                  setMobileMenuOpen(false)
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold bg-primary/10 text-primary border border-primary/20"
              >
                <Bot className="w-4 h-4" />
                <span>Open AI Companion</span>
              </button>
            </div>
          )}

          <div className="pt-3 border-t border-border space-y-2">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Target Internship Role
            </p>
            <div className="grid grid-cols-1 gap-1">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => {
                    handleRoleSelect(role.id)
                    setMobileMenuOpen(false)
                  }}
                  className={cn(
                    'px-3 py-2 rounded-xl text-xs text-left transition-colors',
                    role.id === currentRole.id
                      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-500/20'
                      : 'hover:bg-muted text-muted-foreground'
                  )}
                >
                  {role.name}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-border flex items-center justify-between">
            <div className="text-xs">
              <p className="font-bold text-foreground">{profile.name}</p>
              <p className="text-[11px] text-muted-foreground">{user?.email}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="text-xs text-red-600 dark:text-red-400 gap-1"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
