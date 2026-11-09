import { 
  RoleCategoryId, 
  ProjectCategory, 
  ProjectStatus, 
  ProjectMilestone, 
  LearningResource 
} from './index'

export interface UserProfile {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  university?: string
  major?: string
  graduationYear?: string
  githubUsername?: string
  githubUrl?: string
  linkedinUrl?: string
  personalWebsite?: string
  targetRoleId: RoleCategoryId
  bio?: string
  onboardingCompleted: boolean
  weeklyLearningGoalMinutes?: number
  createdAt: string
  updatedAt: string
}

export interface ProjectEntity {
  id: string
  title: string
  tagline: string
  description: string
  category: ProjectCategory
  techStack: string[]
  githubUrl: string
  liveDemoUrl?: string
  status: ProjectStatus
  featured: boolean
  milestones: ProjectMilestone[]
  keyLearnings: string[]
  createdAt: string
  updatedAt: string
}

export type RoadmapTaskStatus = 'not_started' | 'in_progress' | 'completed'

export interface RoadmapTaskEntity {
  id: string
  roleId: RoleCategoryId
  title: string
  goal: string
  skillTarget: string
  estimatedHours: number
  estimatedMinutes?: number
  priority: 'High' | 'Medium' | 'Low'
  status: RoadmapTaskStatus
  completed: boolean
  completedAt?: string
  resources: LearningResource[]
  portfolioChallenge?: string
  whyItMatters?: string
  isCustom?: boolean
  notes?: string
  sortOrder?: number
  createdAt: string
  updatedAt: string
}

export interface StudySessionEntity {
  id: string
  roadmapTaskId?: string
  topic: string
  durationMinutes: number
  notes?: string
  studiedAt: string
  createdAt: string
}

export type PracticeType = 
  | 'LeetCode / DSA' 
  | 'Concept Quiz' 
  | 'System Design' 
  | 'Code Review' 
  | 'Mock Technical Interview'

export interface PracticeRecordEntity {
  id: string
  roadmapTaskId?: string
  topic: string
  practiceType: PracticeType
  questionsAttempted: number
  questionsCorrect: number
  notes?: string
  practicedAt: string
  createdAt: string
}

export interface UserSkillEntity {
  id: string
  name: string
  category: 'Frontend' | 'Backend' | 'Data/ML' | 'DevOps & Tooling' | 'Core CS'
  currentLevel: number // 0-5
  targetLevel: number  // 1-5
  status: 'Demonstrated' | 'Developing' | 'Missing'
  evidenceNotes?: string
  createdAt: string
  updatedAt: string
}

export interface UserPreferencesEntity {
  theme: 'light' | 'dark'
  weeklyLearningGoalMinutes: number
  updatedAt: string
}
