import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Mic, Volume2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useSpeechToText } from '@/hooks/useSpeechToText'
import { useTextToSpeech } from '@/hooks/useTextToSpeech'

interface AuthModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const { signUp, signIn } = useAuth()
  const { startListening, stopListening, transcript, isListening } = useSpeechToText()
  const { speak } = useTextToSpeech()

  const handleVoiceInput = (field: 'name' | 'location') => {
    if (isListening) {
      stopListening()
      if (field === 'name') setName(transcript)
      if (field === 'location') setLocation(transcript)
    } else {
      const prompt = field === 'name' ? 'Please say your name' : 'Please say your location'
      speak(prompt)
      startListening()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (isSignUp) {
        await signUp(email, password, { name, location })
      } else {
        await signIn(email, password)
      }
      onOpenChange(false)
    } finally {
      setIsLoading(false)
    }
  }

  const speakInstructions = () => {
    const text = isSignUp 
      ? 'Please fill in your details to create an account. You can use voice input for name and location.'
      : 'Please enter your email and password to sign in.'
    speak(text)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isSignUp ? 'Create Account' : 'Sign In'}
            <Button
              variant="outline"
              size="sm"
              onClick={speakInstructions}
              className="ml-auto"
            >
              <Volume2 className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={isSignUp ? 'signup' : 'signin'} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin" onClick={() => setIsSignUp(false)}>
              Sign In
            </TabsTrigger>
            <TabsTrigger value="signup" onClick={() => setIsSignUp(true)}>
              Sign Up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <div className="flex gap-2">
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleVoiceInput('name')}
                    className={isListening ? 'bg-red-100' : ''}
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="flex gap-2">
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter your location"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleVoiceInput('location')}
                    className={isListening ? 'bg-red-100' : ''}
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}