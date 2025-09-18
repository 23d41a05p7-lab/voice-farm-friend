import { useState, useCallback } from 'react'

export function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false)

  const speak = useCallback((text: string, language: string = 'en-US') => {
    if (!('speechSynthesis' in window)) {
      console.warn('Text-to-speech is not supported in your browser')
      return
    }

    // Stop any ongoing speech
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = language
    utterance.rate = 0.8
    utterance.pitch = 1

    utterance.onstart = () => {
      setIsSpeaking(true)
    }

    utterance.onend = () => {
      setIsSpeaking(false)
    }

    utterance.onerror = () => {
      setIsSpeaking(false)
    }

    window.speechSynthesis.speak(utterance)
  }, [])

  const stop = useCallback(() => {
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }, [])

  return {
    isSpeaking,
    speak,
    stop
  }
}