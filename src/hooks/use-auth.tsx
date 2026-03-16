import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'

interface AuthContextType {
  user: User | null
  session: Session | null
  userRole: string | null
  signUp: (email: string, password: string) => Promise<{ data: any; error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ data: any; error: AuthError | null }>
  signOut: () => Promise<{ error: AuthError | null }>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true

    async function getInitialSession() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (mounted) {
          setSession(session)
          setUser(session?.user ?? null)
          if (!session?.user) {
            setUserRole(null)
            setLoading(false)
          }
        }
      } catch (error) {
        if (mounted) setLoading(false)
      }
    }

    getInitialSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (mounted) {
        setSession(session)
        setUser(session?.user ?? null)
        if (!session?.user) {
          setUserRole(null)
          setLoading(false)
        }
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    let mounted = true

    async function fetchRole() {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('usuarios')
            .select('role')
            .eq('id', user.id)
            .single()

          if (mounted) {
            if (!error && data) {
              setUserRole(data.role)
            } else {
              setUserRole(null)
            }
            setLoading(false)
          }
        } catch (error) {
          if (mounted) {
            setUserRole(null)
            setLoading(false)
          }
        }
      }
    }

    if (user) {
      setLoading(true)
      fetchRole()
    }
  }, [user?.id])

  const signUp = async (email: string, password: string) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/` },
    })
  }

  const signIn = async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({ email, password })
  }

  const signOut = async () => {
    setUserRole(null)
    return await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, session, userRole, signUp, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
