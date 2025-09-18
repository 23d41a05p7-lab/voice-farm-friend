import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'

interface ChatMessage {
  id: string
  question: string
  answer: string
  question_language: string
  answer_language: string
  created_at: string
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  const sendMessage = async (question: string, language: string = 'english') => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to ask questions.",
        variant: "destructive"
      })
      return
    }

    try {
      setLoading(true)

      // Call the farming chatbot edge function
      const { data, error } = await supabase.functions.invoke('farming-chatbot', {
        body: { 
          question, 
          language,
          user_id: user.id 
        }
      })

      if (error) throw error

      // Fetch updated chat history
      await fetchChatHistory()

      return data
    } catch (error: any) {
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchChatHistory = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('chat_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) throw error

      setMessages(data || [])
    } catch (error: any) {
      toast({
        title: "Failed to fetch chat history",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  return {
    messages,
    loading,
    sendMessage,
    fetchChatHistory
  }
}