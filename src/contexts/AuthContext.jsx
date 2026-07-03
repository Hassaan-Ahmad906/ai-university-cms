import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import api from '../utils/api'

const AuthContext = createContext(null)

const STORAGE_KEY = 'pu-lms-auth'

// Mock user data generator (fallback when backend is not running)
function createMockUser(email, role) {
  const roleProfiles = {
    student: { firstName: 'Ahmed', lastName: 'Khan', department: 'Computer Science' },
    teacher: { firstName: 'Dr. Sarah', lastName: 'Malik', department: 'Computer Science' },
    admin: { firstName: 'Muhammad', lastName: 'Ali', department: 'IT Administration' },
    hod: { firstName: 'Prof. Fatima', lastName: 'Zahra', department: 'Computer Science' },
    vc: { firstName: 'Prof. Dr. Khalid', lastName: 'Mahmood', department: 'Vice Chancellor Office' },
    dean: { firstName: 'Dr. Usman', lastName: 'Tariq', department: 'Faculty of Computing' },
    registrar: { firstName: 'Dr. Amina', lastName: 'Bibi', department: 'Registrar Office' },
    treasurer: { firstName: 'Mr. Faisal', lastName: 'Shahzad', department: 'Treasury' },
    clerk: { firstName: 'Ayesha', lastName: 'Siddiqui', department: 'Administration' },
    controller: { firstName: 'Dr. Nasir', lastName: 'Hussain', department: 'Controller of Examinations' },
  }
  const profile = roleProfiles[role] || roleProfiles.student
  return { id: `mock_${Date.now()}`, email, role, avatar: null, ...profile }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Rehydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed && parsed.email && parsed.role) {
          setUser(parsed)
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    } finally {
      setLoading(false)
    }
  }, [])

  // Persist user changes to localStorage
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
      } else {
        localStorage.removeItem(STORAGE_KEY)
      }
    } catch {
      // localStorage unavailable
    }
  }, [user])

  const login = useCallback(async (email, password) => {
    setLoading(true)
    try {
      // Backend auto-detects role from credentials
      const data = await api.login(email, password)
      setUser(data.user)
      setLoading(false)
      return data.user
    } catch (err) {
      // Fallback to mock if backend is not running
      console.log('Backend not available, using mock login:', err.message)
      await new Promise(resolve => setTimeout(resolve, 500))
      // Auto-detect role from email prefix (e.g. student@pu.edu.pk → student)
      const detectedRole = email.split('@')[0].replace(/[0-9]/g, '') || 'student'
      const mockUser = createMockUser(email, detectedRole)
      setUser(mockUser)
      setLoading(false)
      return mockUser
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    api.logout()
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // localStorage unavailable
    }
  }, [])

  const updateUser = useCallback((updates) => {
    setUser(prev => prev ? { ...prev, ...updates } : prev)
  }, [])

  const isAuthenticated = !!user

  const value = useMemo(
    () => ({ user, isAuthenticated, loading, login, logout, updateUser }),
    [user, isAuthenticated, loading, login, logout, updateUser]
  )

  return (
    <AuthContext.Provider value={value}>
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

export default AuthContext
