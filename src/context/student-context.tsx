import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react'
import { useAuth } from './auth-context'
import { 
  Project, 
  RoadmapModule, 
  RoleCategoryId, 
  InternshipRole, 
  EvaluatedSkill, 
  ReadinessScoreBreakdown,
  StudentProfile 
} from '../types'
import { 
  RoadmapTaskEntity, 
  StudySessionEntity, 
  PracticeRecordEntity 
} from '../types/firestore'
import { BENCHMARK_ROLES, INITIAL_PROJECTS } from '../data/initial-data'
import { evaluateSkillsForRole, calculateReadinessScore } from '../lib/calculator'
import { 
  fetchUserProjects, 
  saveUserProject, 
  updateUserProject, 
  deleteUserProject, 
  toggleUserMilestone,
  fetchUserRoadmapTasks,
  saveUserRoadmapTask,
  toggleUserRoadmapTask,
  deleteUserRoadmapTask,
  seedRoleRoadmapTemplate,
  fetchUserStudySessions,
  addUserStudySession,
  deleteUserStudySession,
  fetchUserPracticeRecords,
  addUserPracticeRecord,
  deleteUserPracticeRecord
} from '../services/firestore-service'

interface StudentContextType {
  profile: StudentProfile
  projects: Project[]
  roadmap: RoadmapModule[]
  roadmapTasks: RoadmapTaskEntity[]
  studySessions: StudySessionEntity[]
  practiceRecords: PracticeRecordEntity[]
  targetRoleId: RoleCategoryId
  roles: InternshipRole[]
  currentRole: InternshipRole
  evaluatedSkills: EvaluatedSkill[]
  readiness: ReadinessScoreBreakdown
  loadingData: boolean
  totalStudyMinutes: number
  
  // Actions
  updateProfile: (updates: Partial<StudentProfile>) => Promise<void>
  setTargetRoleId: (roleId: RoleCategoryId) => Promise<void>
  addProject: (newProject: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  updateProject: (project: Project) => Promise<void>
  deleteProject: (projectId: string) => Promise<void>
  toggleMilestone: (projectId: string, milestoneId: string) => Promise<void>
  
  // Roadmap Actions
  toggleRoadmapModule: (taskId: string) => Promise<void>
  addCustomRoadmapTask: (task: { title: string; skillTarget: string; goal: string; estimatedHours: number; priority: 'High' | 'Medium' | 'Low' }) => Promise<void>
  deleteRoadmapTask: (taskId: string) => Promise<void>
  seedRoadmapTemplate: (roleId?: RoleCategoryId) => Promise<void>
  
  // Study & Practice
  addStudySession: (session: { topic: string; durationMinutes: number; notes?: string; roadmapTaskId?: string; studiedAt?: string }) => Promise<void>
  deleteStudySession: (sessionId: string) => Promise<void>
  addPracticeRecord: (record: { topic: string; practiceType: PracticeRecordEntity['practiceType']; questionsAttempted: number; questionsCorrect: number; notes?: string; practicedAt?: string }) => Promise<void>
  deletePracticeRecord: (recordId: string) => Promise<void>

  // Intentional Demo Seeding
  loadDemoProjects: () => Promise<void>
}

const StudentContext = createContext<StudentContextType | undefined>(undefined)

export function StudentProvider({ children }: { children: React.ReactNode }) {
  const { user, profile: authProfile, updateProfileData } = useAuth()

  const [projects, setProjects] = useState<Project[]>([])
  const [roadmapTasks, setRoadmapTasks] = useState<RoadmapTaskEntity[]>([])
  const [studySessions, setStudySessions] = useState<StudySessionEntity[]>([])
  const [practiceRecords, setPracticeRecords] = useState<PracticeRecordEntity[]>([])
  const [loadingData, setLoadingData] = useState<boolean>(true)

  // 1. Target Role
  const targetRoleId: RoleCategoryId = authProfile?.targetRoleId || 'fullstack-intern'

  const currentRole = useMemo(() => {
    return BENCHMARK_ROLES.find((r) => r.id === targetRoleId) || BENCHMARK_ROLES[0]
  }, [targetRoleId])

  // 2. Load User Data when authenticated user changes
  const loadUserData = useCallback(async (uid: string, role: RoleCategoryId) => {
    setLoadingData(true)
    try {
      const [userProjects, userTasks, userSessions, userPractices] = await Promise.all([
        fetchUserProjects(uid),
        fetchUserRoadmapTasks(uid),
        fetchUserStudySessions(uid),
        fetchUserPracticeRecords(uid)
      ])

      setProjects(userProjects)
      setStudySessions(userSessions)
      setPracticeRecords(userPractices)

      // If new account with no roadmap tasks, initialize suggested template for chosen role
      if (userTasks.length === 0) {
        const seeded = await seedRoleRoadmapTemplate(uid, role)
        setRoadmapTasks(seeded)
      } else {
        setRoadmapTasks(userTasks)
      }
    } catch (error) {
      console.error('[StudentContext] Failed to load student data:', error)
    } finally {
      setLoadingData(false)
    }
  }, [])

  useEffect(() => {
    if (user?.uid) {
      loadUserData(user.uid, targetRoleId)
    } else {
      // Clear data immediately when signed out to guarantee multi-user isolation
      setProjects([])
      setRoadmapTasks([])
      setStudySessions([])
      setPracticeRecords([])
      setLoadingData(false)
    }
  }, [user?.uid, loadUserData, targetRoleId])

  // Map RoadmapTaskEntity[] to RoadmapModule[] for compatibility with existing calculations & components
  const roadmap: RoadmapModule[] = useMemo(() => {
    return roadmapTasks.map((t) => ({
      id: t.id,
      roleId: t.roleId,
      title: t.title,
      goal: t.goal,
      skillTarget: t.skillTarget,
      estimatedHours: t.estimatedHours,
      priority: t.priority,
      completed: t.completed,
      completedAt: t.completedAt,
      resources: t.resources || [],
      portfolioChallenge: t.portfolioChallenge || '',
      whyItMatters: t.whyItMatters || ''
    }))
  }, [roadmapTasks])

  // Evaluated Skills
  const evaluatedSkills = useMemo(() => {
    return evaluateSkillsForRole(currentRole, projects, roadmap)
  }, [currentRole, projects, roadmap])

  // Readiness Score
  const readiness = useMemo(() => {
    return calculateReadinessScore(evaluatedSkills, projects, roadmap, targetRoleId)
  }, [evaluatedSkills, projects, roadmap, targetRoleId])

  // Total Study Minutes
  const totalStudyMinutes = useMemo(() => {
    return studySessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0)
  }, [studySessions])

  // Profile adapter
  const profile: StudentProfile = useMemo(() => {
    return {
      name: authProfile?.displayName || user?.displayName || 'Student',
      headline: authProfile?.bio || `${currentRole.name} Candidate`,
      university: authProfile?.university || '',
      major: authProfile?.major || '',
      graduationYear: authProfile?.graduationYear || '',
      githubUsername: authProfile?.githubUsername || '',
      githubUrl: authProfile?.githubUrl || '',
      linkedinUrl: authProfile?.linkedinUrl,
      personalWebsite: authProfile?.personalWebsite,
      targetRoleId,
      recruitmentSeason: 'Upcoming Recruiting',
      bio: authProfile?.bio || ''
    }
  }, [authProfile, user, currentRole, targetRoleId])

  // ----------------------------------------------------
  // Actions
  // ----------------------------------------------------

  const updateProfile = async (updates: Partial<StudentProfile>) => {
    if (!user) return
    await updateProfileData({
      displayName: updates.name,
      university: updates.university,
      major: updates.major,
      graduationYear: updates.graduationYear,
      githubUsername: updates.githubUsername,
      githubUrl: updates.githubUrl,
      linkedinUrl: updates.linkedinUrl,
      personalWebsite: updates.personalWebsite,
      bio: updates.bio,
      targetRoleId: updates.targetRoleId || targetRoleId
    })
  }

  const setTargetRoleId = async (roleId: RoleCategoryId) => {
    if (!user) return
    await updateProfileData({ targetRoleId: roleId })
    // Ensure template tasks for newly selected role are seeded if absent
    await seedRoleRoadmapTemplate(user.uid, roleId)
    const updatedTasks = await fetchUserRoadmapTasks(user.uid)
    setRoadmapTasks(updatedTasks)
  }

  const addProject = async (newProjectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return
    const saved = await saveUserProject(user.uid, newProjectData)
    setProjects((prev) => [saved, ...prev])
  }

  const updateProject = async (updatedProject: Project) => {
    if (!user) return
    await updateUserProject(user.uid, updatedProject)
    setProjects((prev) =>
      prev.map((p) => (p.id === updatedProject.id ? updatedProject : p))
    )
  }

  const deleteProject = async (projectId: string) => {
    if (!user) return
    await deleteUserProject(user.uid, projectId)
    setProjects((prev) => prev.filter((p) => p.id !== projectId))
  }

  const toggleMilestone = async (projectId: string, milestoneId: string) => {
    if (!user) return
    const updated = await toggleUserMilestone(user.uid, projectId, milestoneId)
    if (updated) {
      setProjects((prev) =>
        prev.map((p) => (p.id === projectId ? updated : p))
      )
    }
  }

  const toggleRoadmapModule = async (taskId: string) => {
    if (!user) return
    const updated = await toggleUserRoadmapTask(user.uid, taskId)
    if (updated) {
      setRoadmapTasks((prev) =>
        prev.map((t) => (t.id === taskId ? updated : t))
      )
    }
  }

  const addCustomRoadmapTask = async (task: {
    title: string
    skillTarget: string
    goal: string
    estimatedHours: number
    priority: 'High' | 'Medium' | 'Low'
  }) => {
    if (!user) return
    const created = await saveUserRoadmapTask(user.uid, {
      ...task,
      roleId: targetRoleId,
      isCustom: true
    })
    setRoadmapTasks((prev) => [created, ...prev])
  }

  const deleteRoadmapTask = async (taskId: string) => {
    if (!user) return
    await deleteUserRoadmapTask(user.uid, taskId)
    setRoadmapTasks((prev) => prev.filter((t) => t.id !== taskId))
  }

  const seedRoadmapTemplate = async (roleId: RoleCategoryId = targetRoleId) => {
    if (!user) return
    const tasks = await seedRoleRoadmapTemplate(user.uid, roleId)
    setRoadmapTasks(tasks)
  }

  const addStudySession = async (session: {
    topic: string
    durationMinutes: number
    notes?: string
    roadmapTaskId?: string
    studiedAt?: string
  }) => {
    if (!user) return
    const created = await addUserStudySession(user.uid, {
      topic: session.topic,
      durationMinutes: session.durationMinutes,
      notes: session.notes,
      roadmapTaskId: session.roadmapTaskId,
      studiedAt: session.studiedAt || new Date().toISOString().split('T')[0]
    })
    setStudySessions((prev) => [created, ...prev])
  }

  const deleteStudySession = async (sessionId: string) => {
    if (!user) return
    await deleteUserStudySession(user.uid, sessionId)
    setStudySessions((prev) => prev.filter((s) => s.id !== sessionId))
  }

  const addPracticeRecord = async (record: {
    topic: string
    practiceType: PracticeRecordEntity['practiceType']
    questionsAttempted: number
    questionsCorrect: number
    notes?: string
    practicedAt?: string
  }) => {
    if (!user) return
    const created = await addUserPracticeRecord(user.uid, {
      topic: record.topic,
      practiceType: record.practiceType,
      questionsAttempted: record.questionsAttempted,
      questionsCorrect: record.questionsCorrect,
      notes: record.notes,
      practicedAt: record.practicedAt || new Date().toISOString().split('T')[0]
    })
    setPracticeRecords((prev) => [created, ...prev])
  }

  const deletePracticeRecord = async (recordId: string) => {
    if (!user) return
    await deleteUserPracticeRecord(user.uid, recordId)
    setPracticeRecords((prev) => prev.filter((r) => r.id !== recordId))
  }

  const loadDemoProjects = async () => {
    if (!user) return
    for (const p of INITIAL_PROJECTS) {
      await saveUserProject(user.uid, p)
    }
    const freshProjects = await fetchUserProjects(user.uid)
    setProjects(freshProjects)
  }

  return (
    <StudentContext.Provider
      value={{
        profile,
        projects,
        roadmap,
        roadmapTasks,
        studySessions,
        practiceRecords,
        targetRoleId,
        roles: BENCHMARK_ROLES,
        currentRole,
        evaluatedSkills,
        readiness,
        loadingData,
        totalStudyMinutes,
        updateProfile,
        setTargetRoleId,
        addProject,
        updateProject,
        deleteProject,
        toggleMilestone,
        toggleRoadmapModule,
        addCustomRoadmapTask,
        deleteRoadmapTask,
        seedRoadmapTemplate,
        addStudySession,
        deleteStudySession,
        addPracticeRecord,
        deletePracticeRecord,
        loadDemoProjects
      }}
    >
      {children}
    </StudentContext.Provider>
  )
}

export function useStudent() {
  const context = useContext(StudentContext)
  if (!context) {
    throw new Error('useStudent must be used within a StudentProvider')
  }
  return context
}
