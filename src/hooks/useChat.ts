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

  const getBasicAnswer = (question: string): string => {
    const lowerQuestion = question.toLowerCase()
    
    if (lowerQuestion.includes('water') || lowerQuestion.includes('irrigation')) {
      return "Water your crops early morning or late evening. Most crops need 1-2 inches of water per week. Check soil moisture by inserting your finger 2 inches deep - if dry, it's time to water."
    }
    
    if (lowerQuestion.includes('fertilizer') || lowerQuestion.includes('nutrients')) {
      return "Use balanced NPK fertilizer (10-10-10) for most crops. Apply organic compost monthly. For vegetables, use nitrogen-rich fertilizer during growth phase and phosphorus-rich during flowering."
    }
    
    if (lowerQuestion.includes('pest') || lowerQuestion.includes('insect')) {
      return "Use neem oil for organic pest control. Companion planting with marigolds helps repel pests. Check plants regularly for early pest detection. Encourage beneficial insects like ladybugs."
    }
    
    if (lowerQuestion.includes('soil') || lowerQuestion.includes('ground')) {
      return "Good soil should be well-draining, rich in organic matter, with pH 6.0-7.0. Add compost annually. Test soil pH every 2-3 years. Rotate crops to prevent soil depletion."
    }
    
    if (lowerQuestion.includes('plant') || lowerQuestion.includes('seed') || lowerQuestion.includes('grow')) {
      return "Plant seeds at depth 2-3 times their diameter. Space according to plant requirements. Start seeds indoors 6-8 weeks before last frost for warm season crops."
    }
    
    if (lowerQuestion.includes('disease') || lowerQuestion.includes('sick')) {
      return "Prevent disease with good air circulation and proper spacing. Remove affected plant parts immediately. Use copper fungicide for fungal issues. Avoid overhead watering."
    }
    
    if (lowerQuestion.includes('harvest') || lowerQuestion.includes('pick')) {
      return "Harvest in early morning when plants are fully hydrated. Pick fruits when fully colored but still firm. Leafy greens taste best when young and tender."
    }
    
    if (lowerQuestion.includes('weather') || lowerQuestion.includes('climate')) {
      return "Monitor local weather forecasts. Protect crops from frost with row covers. Provide shade during extreme heat. Adjust watering based on weather conditions."
    }
    
    return "For best farming results, focus on healthy soil, proper watering, adequate sunlight, and regular monitoring. Consider your local climate and growing season when planning crops."
  }

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

      // Generate basic answer
      const answer = getBasicAnswer(question)
      
      // Create new message
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        question,
        answer,
        question_language: language,
        answer_language: language,
        created_at: new Date().toISOString()
      }

      // Add to local state
      setMessages(prev => [newMessage, ...prev])

      return { answer }
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