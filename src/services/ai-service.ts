import { auth } from '../lib/firebase'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
}

export interface StudentAIContext {
  targetRole: string
  topGaps: string[]
  completedTasksCount: number
  totalStudyHours: number
  recentProjects: string[]
}

const AI_ENDPOINT = import.meta.env.VITE_AI_ENDPOINT_URL || ''

/**
 * Checks whether a server-side AI endpoint has been configured.
 */
export function isAIServiceConfigured(): boolean {
  return Boolean(AI_ENDPOINT && AI_ENDPOINT.trim().length > 0)
}

/**
 * Sends a chat message to the secure server-side AI endpoint.
 * Includes student's Firebase Auth ID token in Authorization header.
 */
export async function sendAIMessage(
  messages: ChatMessage[],
  context: StudentAIContext
): Promise<string> {
  if (!isAIServiceConfigured()) {
    throw new Error(
      'AI Endpoint is not configured. Deploy the Firebase Cloud Function or configure VITE_AI_ENDPOINT_URL in .env.'
    )
  }

  // Get current student's Firebase Auth ID token
  const currentUser = auth?.currentUser
  if (!currentUser) {
    throw new Error('You must be signed in to use the AI Learning Companion.')
  }

  const idToken = await currentUser.getIdToken()

  const response = await fetch(AI_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
    body: JSON.stringify({
      messages,
      context
    })
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `AI request failed with status ${response.status}`)
  }

  const data = await response.json()
  return data.reply || data.response || ''
}
