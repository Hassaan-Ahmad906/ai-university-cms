import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'

const AuthContext = createContext(null)

const STORAGE_KEY = 'pu-lms-auth'

// Mock user data generator based on role
function createMockUser(email, role) {
  const roleProfiles = {
    student: {
      firstName: 'Ahmed',
      lastName: 'Khan',
      department: 'Computer Science',
      avatar: null,
    },
    teacher: {
      firstName: 'Dr. Sarah',
      lastName: 'Malik',
      department: 'Computer Science',
      avatar: null,
    },
    admin: {
      firstName: 'Muhammad',
      lastName: 'Ali',
      department: 'IT Administration',
      avatar: null,
    },
    hod: {
      firstName: 'Prof. Fatima',
      lastName: 'Zahra',
      department: 'Computer Science',
      avatar: null,
    },
    vc: {
      firstName: 'Prof. Dr. Khalid',
      lastName: 'Mahmood',
      department: 'Vice Chancellor Office',
      avatar: null,
    },
    dean: {
      firstName: 'Dr. Usman',
      lastName: 'Tariq',
      department: 'Faculty of Computing',
      avatar: null,
    },
    registrar: {
      firstName: 'Dr. Amina',
      lastName: 'Bibi',
      department: 'Registrar Office',
      avatar: null,
    },
    treasurer: {
      firstName: 'Mr. Faisal',
      lastName: 'Shahzad',
      department: 'Treasury',
      avatar: null,
    },
    clerk: {
      firstName: 'Ayesha',
      lastName: 'Siddiqui',
      department: 'Administration',
      avatar: null,
    },
    controller: {
      firstName: 'Dr. Nasir',
      lastName: 'Hussain',
      department: 'Controller of Examinations',
      avatar: null,
    },
  }

  const profile = roleProfiles[role] || roleProfiles.student

  return {
    id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    email,
    firstName: profile.firstName,
    lastName: profile.lastName,
    role,
    avatar: profile.avatar,
    department: profile.department,
  }
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

  const login = useCallback(async (email, password, role = 'student') => {
    setLoading(true)

    // Simulate network latency for realistic UX
    await new Promise(resolve => setTimeout(resolve, 800))

    const newUser = createMockUser(email, role)
    setUser(newUser)
    setLoading(false)

    return newUser
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // localStorage unavailable
    }
  }, [])

  const updateUser = useCallback((updates) => {
    setUser(prev => {
      if (!prev) return prev
      return { ...prev, ...updates }
    })
  }, [])

  const isAuthenticated = !!user

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      loading,
      login,
      logout,
      updateUser,
    }),
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
