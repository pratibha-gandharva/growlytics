import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth'
import { getFirestore, Firestore } from 'firebase/firestore'

/**
 * Firebase Client Configuration
 * Loaded via Vite import.meta.env
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'growlytics-6b528.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'growlytics-6b528',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'growlytics-6b528.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
}

/**
 * Validates whether the Firebase web client is supplied with genuine credentials.
 */
export function checkFirebaseConfiguration(): {
  isConfigured: boolean
  missingKeys: string[]
} {
  const missingKeys: string[] = []

  if (!firebaseConfig.apiKey || firebaseConfig.apiKey.includes('your_') || firebaseConfig.apiKey === '') {
    missingKeys.push('VITE_FIREBASE_API_KEY')
  }
  if (!firebaseConfig.projectId || firebaseConfig.projectId.includes('your_') || firebaseConfig.projectId === '') {
    missingKeys.push('VITE_FIREBASE_PROJECT_ID')
  }
  if (!firebaseConfig.appId || firebaseConfig.appId.includes('your_') || firebaseConfig.appId === '') {
    missingKeys.push('VITE_FIREBASE_APP_ID')
  }

  return {
    isConfigured: missingKeys.length === 0,
    missingKeys
  }
}

export const firebaseStatus = checkFirebaseConfiguration()

let appInstance: FirebaseApp | null = null
let authInstance: Auth | null = null
let dbInstance: Firestore | null = null

if (firebaseStatus.isConfigured) {
  try {
    appInstance = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
    authInstance = getAuth(appInstance)
    dbInstance = getFirestore(appInstance)
  } catch (error) {
    console.error('[Growlytics] Firebase initialization failed:', error)
  }
} else {
  console.warn(
    '[Growlytics] Firebase configuration is incomplete. Missing environment variables:',
    firebaseStatus.missingKeys.join(', '),
    '\nPlease configure .env from .env.example with your Firebase Web App credentials.'
  )
}

export const app = appInstance
export const auth = authInstance
export const db = dbInstance

// Pre-configured Google Auth Provider
export const googleAuthProvider = new GoogleAuthProvider()
googleAuthProvider.setCustomParameters({
  prompt: 'select_account'
})
