import React, { createContext, useContext, useEffect, useState } from 'react'
import { User as FirebaseUser } from 'firebase/auth'
import { 
  subscribeToAuth, 
  getStudentProfile, 
  updateStudentProfile, 
  createStudentProfile,
  signInWithEmail as apiSignInEmail,
  registerWithEmail as apiRegisterEmail,
  signInWithGoogle as apiSignInGoogle,
  sendPasswordReset as apiSendPasswordReset,
  signOutStudent as apiSignOut
} from '../services/auth-service'
import { firebaseStatus } from '../lib/firebase'
import { UserProfile } from '../types/firestore'
import { RoleCategoryId } from '../types'

interface AuthContextType {
  user: FirebaseUser | null
  profile: UserProfile | null
  loading: boolean
  isConfigured: boolean
  missingKeys: string[]
  signInWithEmail: (email: string, pass: string) => Promise<void>
  signUpWithEmail: (email: string, pass: string, name: string, role?: RoleCategoryId) => Promise<void>
  signInWithGoogle: () => Promise<void>
  sendPasswordReset: (email: string) => Promise<void>
  signOut: () => Promise<void>
  updateProfileData: (updates: Partial<UserProfile>) => Promise<void>
  completeOnboarding: (details: Partial<UserProfile>) => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  // Listen to Firebase Auth state
  useEffect(() => {
    if (!firebaseStatus.isConfigured) {
      setLoading(false)
      return
    }

    const unsubscribe = subscribeToAuth(async (currentUser) => {
      setUser(currentUser)
      if (currentUser) {
        try {
          const userProfile = await getStudentProfile(currentUser.uid)
          setProfile(userProfile)
        } catch (e) {
          console.error('[AuthContext] Error loading user profile:', e)
        }
      } else {
        // Clear in-memory profile completely upon sign-out
        setProfile(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const refreshProfile = async () => {
    if (!user) return
    const userProfile = await getStudentProfile(user.uid)
    setProfile(userProfile)
  }

  const signInWithEmail = async (email: string, pass: string) => {
    const firebaseUser = await apiSignInEmail(email, pass)
    setUser(firebaseUser)
    const p = await getStudentProfile(firebaseUser.uid)
    setProfile(p)
  }

  const signUpWithEmail = async (email: string, pass: string, name: string, role?: RoleCategoryId) => {
    const { user: newUser, profile: newProfile } = await apiRegisterEmail(email, pass, name, role)
    setUser(newUser)
    setProfile(newProfile)
  }

  const signInWithGoogle = async () => {
    const { user: googleUser, profile: googleProfile } = await apiSignInGoogle()
    setUser(googleUser)
    setProfile(googleProfile)
  }

  const sendPasswordReset = async (email: string) => {
    await apiSendPasswordReset(email)
  }

  const signOut = async () => {
    await apiSignOut()
    setUser(null)
    setProfile(null)
  }

  const updateProfileData = async (updates: Partial<UserProfile>) => {
    if (!user) throw new Error('Not authenticated')
    await updateStudentProfile(user.uid, updates)
    setProfile((prev) => (prev ? { ...prev, ...updates, updatedAt: new Date().toISOString() } : null))
  }

  const completeOnboarding = async (details: Partial<UserProfile>) => {
    if (!user) throw new Error('Not authenticated')
    const finalData: Partial<UserProfile> = {
      ...details,
      onboardingCompleted: true
    }
    if (profile) {
      await updateStudentProfile(user.uid, finalData)
    } else {
      await createStudentProfile(user.uid, finalData)
    }
    const updated = await getStudentProfile(user.uid)
    setProfile(updated)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isConfigured: firebaseStatus.isConfigured,
        missingKeys: firebaseStatus.missingKeys,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        sendPasswordReset,
        signOut,
        updateProfileData,
        completeOnboarding,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
