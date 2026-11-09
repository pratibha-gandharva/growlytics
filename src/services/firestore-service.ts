import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  writeBatch
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import { 
  ProjectEntity, 
  RoadmapTaskEntity, 
  StudySessionEntity, 
  PracticeRecordEntity, 
  UserPreferencesEntity 
} from '../types/firestore'
import { Project, RoleCategoryId } from '../types'
import { INITIAL_ROADMAP } from '../data/initial-data'

function requireDb() {
  if (!db) {
    throw new Error('Firestore is not initialized. Please ensure .env has valid Firebase configuration.')
  }
  return db
}

// ----------------------------------------------------
// 1. Projects & Milestones
// Path: users/{uid}/projects/{projectId}
// ----------------------------------------------------

export async function fetchUserProjects(uid: string): Promise<Project[]> {
  const firestore = requireDb()
  const projectsCol = collection(firestore, 'users', uid, 'projects')
  const q = query(projectsCol, orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)
  
  return snapshot.docs.map((docSnap) => {
    const data = docSnap.data() as ProjectEntity
    return {
      ...data,
      id: docSnap.id
    }
  })
}

export async function saveUserProject(uid: string, project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Promise<Project> {
  const firestore = requireDb()
  const projectId = project.id || `proj-${Date.now()}`
  const now = new Date().toISOString().split('T')[0]
  
  const projectDocRef = doc(firestore, 'users', uid, 'projects', projectId)
  const existingSnap = await getDoc(projectDocRef)

  const entity: ProjectEntity = {
    ...project,
    id: projectId,
    createdAt: existingSnap.exists() ? (existingSnap.data() as ProjectEntity).createdAt : now,
    updatedAt: now
  }

  await setDoc(projectDocRef, entity, { merge: true })
  return entity
}

export async function updateUserProject(uid: string, project: Project): Promise<void> {
  const firestore = requireDb()
  const projectDocRef = doc(firestore, 'users', uid, 'projects', project.id)
  const now = new Date().toISOString().split('T')[0]

  await updateDoc(projectDocRef, {
    ...project,
    updatedAt: now
  })
}

export async function deleteUserProject(uid: string, projectId: string): Promise<void> {
  const firestore = requireDb()
  const projectDocRef = doc(firestore, 'users', uid, 'projects', projectId)
  await deleteDoc(projectDocRef)
}

export async function toggleUserMilestone(
  uid: string, 
  projectId: string, 
  milestoneId: string
): Promise<Project | null> {
  const firestore = requireDb()
  const projectDocRef = doc(firestore, 'users', uid, 'projects', projectId)
  const snap = await getDoc(projectDocRef)
  
  if (!snap.exists()) return null
  const project = snap.data() as ProjectEntity

  const now = new Date().toISOString().split('T')[0]
  const updatedMilestones = project.milestones.map((m) => {
    if (m.id !== milestoneId) return m
    const willComplete = !m.completed
    return {
      ...m,
      completed: willComplete,
      completedAt: willComplete ? now : undefined
    }
  })

  await updateDoc(projectDocRef, {
    milestones: updatedMilestones,
    updatedAt: now
  })

  return {
    ...project,
    milestones: updatedMilestones,
    updatedAt: now
  }
}

// ----------------------------------------------------
// 2. Customizable Roadmap Tasks
// Path: users/{uid}/roadmapTasks/{taskId}
// ----------------------------------------------------

export async function fetchUserRoadmapTasks(uid: string): Promise<RoadmapTaskEntity[]> {
  const firestore = requireDb()
  const tasksCol = collection(firestore, 'users', uid, 'roadmapTasks')
  const q = query(tasksCol, orderBy('sortOrder', 'asc'))
  const snapshot = await getDocs(q)
  
  return snapshot.docs.map((d) => ({
    ...(d.data() as RoadmapTaskEntity),
    id: d.id
  }))
}

export async function saveUserRoadmapTask(
  uid: string, 
  task: Partial<RoadmapTaskEntity> & { id?: string; title: string; skillTarget: string }
): Promise<RoadmapTaskEntity> {
  const firestore = requireDb()
  const taskId = task.id || `task-${Date.now()}`
  const now = new Date().toISOString()
  const taskDocRef = doc(firestore, 'users', uid, 'roadmapTasks', taskId)

  const entity: RoadmapTaskEntity = {
    id: taskId,
    roleId: task.roleId || 'fullstack-intern',
    title: task.title,
    goal: task.goal || '',
    skillTarget: task.skillTarget,
    estimatedHours: task.estimatedHours ?? 3,
    priority: task.priority || 'Medium',
    status: task.status || (task.completed ? 'completed' : 'not_started'),
    completed: task.completed ?? false,
    completedAt: task.completed ? (task.completedAt || now) : undefined,
    resources: task.resources || [],
    portfolioChallenge: task.portfolioChallenge || '',
    whyItMatters: task.whyItMatters || '',
    isCustom: task.isCustom ?? true,
    notes: task.notes || '',
    sortOrder: task.sortOrder ?? Date.now(),
    createdAt: task.createdAt || now,
    updatedAt: now
  }

  await setDoc(taskDocRef, entity, { merge: true })
  return entity
}

export async function toggleUserRoadmapTask(uid: string, taskId: string): Promise<RoadmapTaskEntity | null> {
  const firestore = requireDb()
  const taskDocRef = doc(firestore, 'users', uid, 'roadmapTasks', taskId)
  const snap = await getDoc(taskDocRef)
  if (!snap.exists()) return null

  const current = snap.data() as RoadmapTaskEntity
  const willComplete = !current.completed
  const now = new Date().toISOString()

  const updates: Partial<RoadmapTaskEntity> = {
    completed: willComplete,
    status: willComplete ? 'completed' : 'not_started',
    completedAt: willComplete ? now : undefined,
    updatedAt: now
  }

  await updateDoc(taskDocRef, updates)
  return { ...current, ...updates }
}

export async function deleteUserRoadmapTask(uid: string, taskId: string): Promise<void> {
  const firestore = requireDb()
  const taskDocRef = doc(firestore, 'users', uid, 'roadmapTasks', taskId)
  await deleteDoc(taskDocRef)
}

/**
 * Loads deterministic template curriculum for the selected role
 * without overwriting custom student tasks.
 */
export async function seedRoleRoadmapTemplate(uid: string, roleId: RoleCategoryId): Promise<RoadmapTaskEntity[]> {
  const firestore = requireDb()
  const existing = await fetchUserRoadmapTasks(uid)
  const existingRoleTaskTitles = new Set(
    existing.filter((t) => t.roleId === roleId).map((t) => t.title.toLowerCase())
  )

  const templateModules = INITIAL_ROADMAP.filter((m) => m.roleId === roleId)
  const batch = writeBatch(firestore)
  const added: RoadmapTaskEntity[] = []

  let orderIndex = existing.length

  for (const mod of templateModules) {
    if (!existingRoleTaskTitles.has(mod.title.toLowerCase())) {
      const taskId = `seed-${roleId}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
      const taskDocRef = doc(firestore, 'users', uid, 'roadmapTasks', taskId)
      const now = new Date().toISOString()

      const entity: RoadmapTaskEntity = {
        id: taskId,
        roleId: mod.roleId,
        title: mod.title,
        goal: mod.goal,
        skillTarget: mod.skillTarget,
        estimatedHours: mod.estimatedHours,
        priority: mod.priority,
        status: 'not_started',
        completed: false,
        resources: mod.resources,
        portfolioChallenge: mod.portfolioChallenge,
        whyItMatters: mod.whyItMatters,
        isCustom: false,
        sortOrder: ++orderIndex,
        createdAt: now,
        updatedAt: now
      }

      batch.set(taskDocRef, entity)
      added.push(entity)
    }
  }

  if (added.length > 0) {
    await batch.commit()
  }

  return [...existing, ...added]
}

// ----------------------------------------------------
// 3. Study Sessions
// Path: users/{uid}/studySessions/{sessionId}
// ----------------------------------------------------

export async function fetchUserStudySessions(uid: string): Promise<StudySessionEntity[]> {
  const firestore = requireDb()
  const colRef = collection(firestore, 'users', uid, 'studySessions')
  const q = query(colRef, orderBy('studiedAt', 'desc'))
  const snapshot = await getDocs(q)
  
  return snapshot.docs.map((d) => ({
    ...(d.data() as StudySessionEntity),
    id: d.id
  }))
}

export async function addUserStudySession(
  uid: string, 
  data: Omit<StudySessionEntity, 'id' | 'createdAt'>
): Promise<StudySessionEntity> {
  const firestore = requireDb()
  if (data.durationMinutes < 0) {
    throw new Error('Duration must be a positive number of minutes.')
  }
  const sessionId = `session-${Date.now()}`
  const now = new Date().toISOString()
  const docRef = doc(firestore, 'users', uid, 'studySessions', sessionId)

  const entity: StudySessionEntity = {
    ...data,
    id: sessionId,
    createdAt: now
  }

  await setDoc(docRef, entity)
  return entity
}

export async function deleteUserStudySession(uid: string, sessionId: string): Promise<void> {
  const firestore = requireDb()
  const docRef = doc(firestore, 'users', uid, 'studySessions', sessionId)
  await deleteDoc(docRef)
}

// ----------------------------------------------------
// 4. Practice Records
// Path: users/{uid}/practiceRecords/{recordId}
// ----------------------------------------------------

export async function fetchUserPracticeRecords(uid: string): Promise<PracticeRecordEntity[]> {
  const firestore = requireDb()
  const colRef = collection(firestore, 'users', uid, 'practiceRecords')
  const q = query(colRef, orderBy('practicedAt', 'desc'))
  const snapshot = await getDocs(q)
  
  return snapshot.docs.map((d) => ({
    ...(d.data() as PracticeRecordEntity),
    id: d.id
  }))
}

export async function addUserPracticeRecord(
  uid: string, 
  data: Omit<PracticeRecordEntity, 'id' | 'createdAt'>
): Promise<PracticeRecordEntity> {
  const firestore = requireDb()

  if (data.questionsAttempted < 0 || data.questionsCorrect < 0) {
    throw new Error('Question counts cannot be negative.')
  }
  if (data.questionsCorrect > data.questionsAttempted) {
    throw new Error('Correct answers cannot exceed attempted questions.')
  }

  const recordId = `practice-${Date.now()}`
  const now = new Date().toISOString()
  const docRef = doc(firestore, 'users', uid, 'practiceRecords', recordId)

  const entity: PracticeRecordEntity = {
    ...data,
    id: recordId,
    createdAt: now
  }

  await setDoc(docRef, entity)
  return entity
}

export async function deleteUserPracticeRecord(uid: string, recordId: string): Promise<void> {
  const firestore = requireDb()
  const docRef = doc(firestore, 'users', uid, 'practiceRecords', recordId)
  await deleteDoc(docRef)
}

// ----------------------------------------------------
// 5. User Preferences
// Path: users/{uid}/preferences/settings
// ----------------------------------------------------

export async function fetchUserPreferences(uid: string): Promise<UserPreferencesEntity | null> {
  const firestore = requireDb()
  const docRef = doc(firestore, 'users', uid, 'preferences', 'settings')
  const snap = await getDoc(docRef)
  if (snap.exists()) {
    return snap.data() as UserPreferencesEntity
  }
  return null
}

export async function saveUserPreferences(
  uid: string, 
  prefs: Partial<UserPreferencesEntity>
): Promise<void> {
  const firestore = requireDb()
  const docRef = doc(firestore, 'users', uid, 'preferences', 'settings')
  await setDoc(docRef, {
    ...prefs,
    updatedAt: new Date().toISOString()
  }, { merge: true })
}
