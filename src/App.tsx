import { useState } from 'react'
import { ThemeProvider } from './context/theme-context'
import { AuthProvider, useAuth } from './context/auth-context'
import { StudentProvider } from './context/student-context'
import { Navbar, NavTab } from './components/layout/navbar'
import { Footer } from './components/layout/footer'
import { OverviewView } from './components/overview/overview-view'
import { ProjectsView } from './components/projects/projects-view'
import { SkillsView } from './components/skills/skills-view'
import { RoadmapView } from './components/roadmap/roadmap-view'
import { SettingsView } from './components/settings/settings-view'
import { LandingPage } from './components/landing/landing-page'
import { AuthModal } from './components/auth/auth-modal'
import { OnboardingWizard } from './components/onboarding/onboarding-wizard'
import { AIChatPanel } from './components/ai/ai-chat-panel'
import { BrandLogo } from './components/layout/brand-logo'
import { Sparkles } from 'lucide-react'

function AppContent() {
  const { user, profile, loading } = useAuth()
  const [activeTab, setActiveTab] = useState<NavTab>('overview')
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')
  const [isAIChatOpen, setIsAIChatOpen] = useState(false)

  // 1. Initial Session Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground space-y-4">
        <BrandLogo />
        <div className="flex items-center gap-2 text-xs text-muted-foreground animate-pulse">
          <Sparkles className="w-4 h-4 text-primary animate-spin" />
          <span>Restoring secure session...</span>
        </div>
      </div>
    )
  }

  // 2. Unauthenticated Visitor -> Public Landing Page
  if (!user) {
    return (
      <>
        <LandingPage
          onOpenAuth={(mode) => {
            setAuthMode(mode)
            setIsAuthModalOpen(true)
          }}
        />
        <AuthModal
          isOpen={isAuthModalOpen}
          initialMode={authMode}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </>
    )
  }

  // 3. Authenticated User without completed onboarding -> Onboarding Wizard
  if (profile && !profile.onboardingCompleted) {
    return <OnboardingWizard />
  }

  // 4. Authenticated Student Dashboard
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-250 selection:bg-primary/20 selection:text-primary">
      {/* Top sticky Navbar */}
      <Navbar 
        activeTab={activeTab} 
        onSelectTab={setActiveTab} 
        onOpenAIChat={() => setIsAIChatOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {activeTab === 'overview' && (
          <OverviewView onNavigate={(tab) => setActiveTab(tab)} />
        )}
        {activeTab === 'projects' && <ProjectsView />}
        {activeTab === 'skills' && <SkillsView />}
        {activeTab === 'roadmap' && <RoadmapView />}
        {activeTab === 'settings' && <SettingsView />}
      </main>

      {/* Floating AI Learning Companion Panel */}
      <AIChatPanel
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
      />

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <StudentProvider>
          <AppContent />
        </StudentProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
