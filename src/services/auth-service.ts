import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup,
  sendPasswordResetEmail, 
  signOut as firebaseSignOut, 
  onAuthStateChanged, 
  User as FirebaseUser,
  updateProfile as updateFirebaseProfile
} from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { auth, db, googleAuthProvider } from '../lib/firebase'
import { UserProfile } from '../types/firestore'
import { RoleCategoryId } from '../types'

/**
 * Maps raw Firebase Auth error codes to user-friendly messages.
 */
export function formatAuthError(errorCode: string): string {
  switch (errorCode) {
    case 'auth/email-already-in-use':
      return 'An account already exists with this email address. Please sign in instead.'
    case 'auth/invalid-email':
      return 'Please enter a valid email address.'
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.'
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please verify your credentials and try again.'
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.'
    case 'auth/popup-closed-by-user':
      return 'Google sign-in was cancelled before completion.'
    case 'auth/popup-blocked':
      return 'Sign-in popup was blocked by your browser. Please allow popups for this site.'
    case 'auth/network-request-failed':
      return 'Network connection error. Please check your internet connection.'
    case 'auth/too-many-requests':
      return 'Too many unsuccessful attempts. Access temporarily disabled; please try again later or reset your password.'
    default:
      return 'Authentication failed. Please verify your details and try again.'
  }
}

/**
 * Retrieves the student profile from Firestore: users/{uid}
 */
export async function getStudentProfile(uid: string): Promise<UserProfile | null> {
  if (!db) return null
  try {
    const userRef = doc(db, 'users', uid)
    const snapshot = await getDoc(userRef)
    if (snapshot.exists()) {
      return snapshot.data() as UserProfile
    }
    return null
  } catch (error) {
    console.error('[auth-service] Failed to get user profile:', error)
    throw error
  }
}

/**
 * Creates a new student profile in Firestore: users/{uid}
 */
export async function createStudentProfile(
  uid: string, 
  data: Partial<UserProfile>
): Promise<UserProfile> {
  if (!db) throw new Error('Firestore is not configured')
  const now = new Date().toISOString()
  const profile: UserProfile = {
    uid,
    email: data.email || '',
    displayName: data.displayName || 'Student',
    targetRoleId: data.targetRoleId || 'fullstack-intern',
    onboardingCompleted: data.onboardingCompleted ?? false,
    university: data.university || '',
    major: data.major || '',
    graduationYear: data.graduationYear || '',
    githubUsername: data.githubUsername || '',
    githubUrl: data.githubUrl || (data.githubUsername ? `https://github.com/${data.githubUsername}` : ''),
    linkedinUrl: data.linkedinUrl || '',
    personalWebsite: data.personalWebsite || '',
    bio: data.bio || '',
    weeklyLearningGoalMinutes: data.weeklyLearningGoalMinutes || 300,
    createdAt: now,
    updatedAt: now,
    ...data
  }

  const userRef = doc(db, 'users', uid)
  await setDoc(userRef, profile)
  return profile
}

/**
 * Updates an existing student profile in Firestore: users/{uid}
 */
export async function updateStudentProfile(
  uid: string, 
  updates: Partial<UserProfile>
): Promise<void> {
  if (!db) throw new Error('Firestore is not configured')
  const userRef = doc(db, 'users', uid)
  await updateDoc(userRef, {
    ...updates,
    updatedAt: new Date().toISOString()
  })
}

/**
 * Email/Password Registration
 */
export async function registerWithEmail(
  email: string, 
  pass: string, 
  displayName: string,
  targetRoleId: RoleCategoryId = 'fullstack-intern'
): Promise<{ user: FirebaseUser; profile: UserProfile }> {
  if (!auth) throw new Error('Firebase Auth is not initialized. Please configure .env.')

  const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), pass)
  const user = userCredential.user

  // Update Auth Profile Display Name
  if (displayName) {
    await updateFirebaseProfile(user, { displayName: displayName.trim() })
  }

  // Create Firestore profile
  const profile = await createStudentProfile(user.uid, {
    email: user.email || email,
    displayName: displayName.trim() || 'Student',
    targetRoleId,
    onboardingCompleted: false
  })

  return { user, profile }
}

/**
 * Email/Password Sign-In
 */
export async function signInWithEmail(email: string, pass: string): Promise<FirebaseUser> {
  if (!auth) throw new Error('Firebase Auth is not initialized. Please configure .env.')
  const userCredential = await signInWithEmailAndPassword(auth, email.trim(), pass)
  return userCredential.user
}

/**
 * Google Sign-In Flow
 */
export async function signInWithGoogle(): Promise<{ user: FirebaseUser; profile: UserProfile; isNewUser: boolean }> {
  if (!auth) throw new Error('Firebase Auth is not initialized. Please configure .env.')
  const result = await signInWithPopup(auth, googleAuthProvider)
  const user = result.user

  let profile = await getStudentProfile(user.uid)
  let isNewUser = false

  if (!profile) {
    isNewUser = true
    profile = await createStudentProfile(user.uid, {
      email: user.email || '',
      displayName: user.displayName || 'Student',
      photoURL: user.photoURL || undefined,
      targetRoleId: 'fullstack-intern',
      onboardingCompleted: false
    })
  }

  return { user, profile, isNewUser }
}

/**
 * Password Reset Email
 */
export async function sendPasswordReset(email: string): Promise<void> {
  if (!auth) throw new Error('Firebase Auth is not initialized. Please configure .env.')
  await sendPasswordResetEmail(auth, email.trim())
}

/**
 * Sign Out
 */
export async function signOutStudent(): Promise<void> {
  if (auth) {
    await firebaseSignOut(auth)
  }
}

/**
 * Auth state listener
 */
export function subscribeToAuth(callback: (user: FirebaseUser | null) => void) {
  if (!auth) {
    callback(null)
    return () => {}
  }
  return onAuthStateChanged(auth, callback)
}
