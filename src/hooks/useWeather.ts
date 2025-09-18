import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

interface WeatherData {
  id: string
  location: string
  forecast_date: string
  temperature: number | null
  humidity: number | null
  wind_speed: number | null
  rain_chance: number | null
  weather_condition: string | null
  created_at: string
}

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchWeather = async (location?: string) => {
    try {
      setLoading(true)
      
      // Call the weather edge function
      const { data, error } = await supabase.functions.invoke('weather', {
        body: { location: location || 'Delhi' }
      })

      if (error) throw error

      // Fetch weather data from database
      const { data: weatherData, error: dbError } = await supabase
        .from('weather')
        .select('*')
        .order('forecast_date', { ascending: true })
        .limit(7)

      if (dbError) throw dbError

      setWeather(weatherData || [])
    } catch (error: any) {
      toast({
        title: "Weather fetch failed",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWeather()
  }, [])

  return {
    weather,
    loading,
    fetchWeather
  }
}