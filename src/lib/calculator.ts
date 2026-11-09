import { 
  Project, 
  InternshipRole, 
  RoadmapModule, 
  EvaluatedSkill, 
  ReadinessScoreBreakdown 
} from '../types'

/**
 * Normalizes a skill string for fuzzy matching against project tech stacks and milestone rewards.
 */
function normalize(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '')
}

/**
 * Matches whether a target skill requirement is addressed by a given skill token or project tag.
 */
function isSkillMatch(targetSkill: string, candidate: string): boolean {
  const normTarget = normalize(targetSkill)
  const normCand = normalize(candidate)

  if (normTarget.includes(normCand) || normCand.includes(normTarget)) {
    return true
  }

  // Common synonym / technology aliases
  const aliases: Record<string, string[]> = {
    react: ['reactjs', 'componentarchitecture', 'frontend', 'uiuxdesign'],
    typescript: ['typescriptstrictmode', 'ts'],
    nodejs: ['node', 'express', 'restfulapis', 'backend'],
    postgresql: ['postgres', 'sql', 'relationaldatabases', 'sqlschemadesign', 'databaseoptimization'],
    docker: ['containerization', 'devops', 'dockermulticontainer'],
    testing: ['testsuite', 'unitintegration', 'playwright', 'vitest', 'e2e'],
    redis: ['caching', 'pubsub', 'inmemory', 'distributedbroker'],
    cicd: ['githubactions', 'continuousintegration', 'ciautomation'],
    python: ['fastapi', 'textprocessing', 'ml', 'machinelearning'],
    vectordatabases: ['embeddings', 'chromadb', 'semanticsearch'],
    websockets: ['realtime', 'concurrency', 'networking']
  }

  for (const [key, list] of Object.entries(aliases)) {
    if (normTarget.includes(key)) {
      if (list.some((alias) => normCand.includes(alias))) return true
    }
  }

  return false
}

/**
 * Deterministically evaluates each required skill for an internship role based on:
 * 1. Completed milestones in student projects
 * 2. In-progress milestones and project techStack mentions
 * 3. Completed roadmap items targeting the skill
 */
export function evaluateSkillsForRole(
  role: InternshipRole,
  projects: Project[],
  roadmapModules: RoadmapModule[]
): EvaluatedSkill[] {
  return role.requiredSkills.map((req) => {
    let demonstratedPoints = 0
    let developingPoints = 0
    const evidenceProjects: string[] = []

    // 1. Scan Projects
    projects.forEach((proj) => {
      let projectContributed = false

      // Check completed milestones
      proj.milestones.forEach((m) => {
        const awardsMatch = m.skillsAwarded.some((s) => isSkillMatch(req.skillName, s))
        const titleMatch = isSkillMatch(req.skillName, m.title)

        if (awardsMatch || titleMatch) {
          projectContributed = true
          if (m.completed) {
            demonstratedPoints += 1.5
          } else {
            developingPoints += 0.8
          }
        }
      })

      // Check tech stack tags
      const techMatch = proj.techStack.some((t) => isSkillMatch(req.skillName, t))
      if (techMatch && !projectContributed) {
        projectContributed = true
        if (proj.status === 'Completed') {
          demonstratedPoints += 1.0
        } else {
          developingPoints += 0.6
        }
      }

      if (projectContributed && !evidenceProjects.includes(proj.title)) {
        evidenceProjects.push(proj.title)
      }
    })

    // 2. Scan completed roadmap items
    roadmapModules.forEach((mod) => {
      if (mod.completed && isSkillMatch(req.skillName, mod.skillTarget)) {
        demonstratedPoints += 1.5
      } else if (!mod.completed && isSkillMatch(req.skillName, mod.skillTarget)) {
        developingPoints += 0.4
      }
    })

    // Calculate level (clamped 0 to 5)
    let calculatedLevel = Math.min(
      5,
      Math.round(demonstratedPoints + (developingPoints > 0 ? 0.5 : 0))
    )

    // Determine status
    let status: 'Demonstrated' | 'Developing' | 'Missing'
    if (calculatedLevel >= req.targetLevel) {
      status = 'Demonstrated'
    } else if (calculatedLevel >= 1 || developingPoints > 0) {
      status = 'Developing'
      if (calculatedLevel === 0) calculatedLevel = 1
    } else {
      status = 'Missing'
      calculatedLevel = 0
    }

    return {
      skillName: req.skillName,
      category: req.category,
      importance: req.importance,
      targetLevel: req.targetLevel,
      currentLevel: calculatedLevel,
      status,
      evidenceProjects,
      explanation: req.explanation,
      recommendedAction: req.recommendedAction
    }
  })
}

/**
 * Calculates a transparent, verifiable readiness score breakdown (0-100%).
 */
export function calculateReadinessScore(
  evaluatedSkills: EvaluatedSkill[],
  projects: Project[],
  roadmapModules: RoadmapModule[],
  currentRoleId: string
): ReadinessScoreBreakdown {
  if (evaluatedSkills.length === 0) {
    return {
      overallScore: 0,
      criticalSkillsCoverage: 0,
      projectProofScore: 0,
      roadmapVelocity: 0,
      demonstratedCount: 0,
      developingCount: 0,
      missingCount: 0,
      totalSkillsAssessed: 0
    }
  }

  // Weights for importance
  const weights = {
    Critical: 3,
    Important: 2,
    'Nice-to-Have': 1
  }

  let totalWeightedTarget = 0
  let totalWeightedEarned = 0
  let criticalCount = 0
  let criticalMet = 0

  let demonstratedCount = 0
  let developingCount = 0
  let missingCount = 0

  evaluatedSkills.forEach((skill) => {
    const w = weights[skill.importance]
    totalWeightedTarget += skill.targetLevel * w
    totalWeightedEarned += Math.min(skill.currentLevel, skill.targetLevel) * w

    if (skill.importance === 'Critical') {
      criticalCount++
      if (skill.status === 'Demonstrated') {
        criticalMet++
      }
    }

    if (skill.status === 'Demonstrated') demonstratedCount++
    else if (skill.status === 'Developing') developingCount++
    else missingCount++
  })

  // Skill Coverage Component (50% weight)
  const skillsCoverageRatio = totalWeightedTarget > 0 ? totalWeightedEarned / totalWeightedTarget : 0

  // Project Milestones Component (30% weight)
  let totalMilestones = 0
  let completedMilestones = 0
  projects.forEach((p) => {
    p.milestones.forEach((m) => {
      totalMilestones++
      if (m.completed) completedMilestones++
    })
  })
  const projectProofRatio = totalMilestones > 0 ? completedMilestones / totalMilestones : 0

  // Roadmap Velocity Component (20% weight)
  const roleRoadmap = roadmapModules.filter((r) => r.roleId === currentRoleId)
  const completedRoadmaps = roleRoadmap.filter((r) => r.completed).length
  const roadmapRatio = roleRoadmap.length > 0 ? completedRoadmaps / roleRoadmap.length : 0

  // Overall Score (0-100)
  const overallScore = Math.round(
    (skillsCoverageRatio * 0.5 + projectProofRatio * 0.3 + roadmapRatio * 0.2) * 100
  )

  const criticalSkillsCoverage = criticalCount > 0 ? Math.round((criticalMet / criticalCount) * 100) : 100
  const projectProofScore = Math.round(projectProofRatio * 100)
  const roadmapVelocity = Math.round(roadmapRatio * 100)

  return {
    overallScore: Math.min(100, Math.max(0, overallScore)),
    criticalSkillsCoverage,
    projectProofScore,
    roadmapVelocity,
    demonstratedCount,
    developingCount,
    missingCount,
    totalSkillsAssessed: evaluatedSkills.length
  }
}
