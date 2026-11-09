export type RoleCategoryId = 
  | 'frontend-intern' 
  | 'fullstack-intern' 
  | 'backend-intern' 
  | 'aiml-intern'

export type ProjectCategory = 
  | 'Full-Stack' 
  | 'Frontend' 
  | 'Backend' 
  | 'AI/ML' 
  | 'Cloud/DevOps'

export type ProjectStatus = 
  | 'Completed' 
  | 'In Progress' 
  | 'Refactoring' 
  | 'Ideation'

export interface ProjectMilestone {
  id: string
  title: string
  description?: string
  completed: boolean
  completedAt?: string
  skillsAwarded: string[]
}

export interface Project {
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

export interface RoleSkillRequirement {
  skillName: string
  category: 'Frontend' | 'Backend' | 'Data/ML' | 'DevOps & Tooling' | 'Core CS'
  importance: 'Critical' | 'Important' | 'Nice-to-Have'
  targetLevel: number // 1 to 5 scale
  explanation: string
  recommendedAction: string
}

export interface InternshipRole {
  id: RoleCategoryId
  name: string
  subtitle: string
  description: string
  badgeText: string
  iconName: string
  requiredSkills: RoleSkillRequirement[]
}

export interface LearningResource {
  title: string
  url: string
  type: 'Official Docs' | 'Interactive Tutorial' | 'GitHub Guide' | 'Course/Video'
  isFree: boolean
}

export interface RoadmapModule {
  id: string
  roleId: RoleCategoryId
  title: string
  goal: string
  skillTarget: string
  estimatedHours: number
  priority: 'High' | 'Medium' | 'Low'
  completed: boolean
  completedAt?: string
  resources: LearningResource[]
  portfolioChallenge: string
  whyItMatters: string
}

export interface StudentProfile {
  name: string
  headline: string
  university: string
  major: string
  graduationYear: string
  githubUsername: string
  githubUrl: string
  linkedinUrl?: string
  personalWebsite?: string
  targetRoleId: RoleCategoryId
  recruitmentSeason: string
  bio: string
}

export type SkillProficiencyStatus = 'Demonstrated' | 'Developing' | 'Missing'

export interface EvaluatedSkill {
  skillName: string
  category: 'Frontend' | 'Backend' | 'Data/ML' | 'DevOps & Tooling' | 'Core CS'
  importance: 'Critical' | 'Important' | 'Nice-to-Have'
  targetLevel: number
  currentLevel: number
  status: SkillProficiencyStatus
  evidenceProjects: string[]
  explanation: string
  recommendedAction: string
}

export interface ReadinessScoreBreakdown {
  overallScore: number // 0-100
  criticalSkillsCoverage: number // % of critical skills met
  projectProofScore: number // score based on completed project milestones
  roadmapVelocity: number // completed roadmap items vs total
  demonstratedCount: number
  developingCount: number
  missingCount: number
  totalSkillsAssessed: number
}
