import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, userData: { name: string; location?: string }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      })

      if (error) throw error

      if (data.user && !data.session) {
        toast({
          title: "Check your email",
          description: "Please check your email for verification link.",
        })
      }

      return { data, error: null }
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive"
      })
      return { data: null, error }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      toast({
        title: "Welcome back!",
        description: "Successfully signed in.",
      })

      return { data, error: null }
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive"
      })
      return { data: null, error }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut
  }
}