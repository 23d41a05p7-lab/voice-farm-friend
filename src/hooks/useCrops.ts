import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

interface CropData {
  id: string
  crop_name: string
  crop_name_hindi: string | null
  crop_name_punjabi: string | null
  image_url: string | null
  soil_type: string | null
  season: string | null
  fertilizer_tip: string | null
  fertilizer_tip_hindi: string | null
  fertilizer_tip_punjabi: string | null
  planting_months: string[] | null
  harvest_months: string[] | null
  created_at: string
}

export function useCrops() {
  const [crops, setCrops] = useState<CropData[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchCrops = async (filters?: { soil_type?: string; season?: string }) => {
    try {
      setLoading(true)
      
      let query = supabase.from('crops').select('*')
      
      if (filters?.soil_type) {
        query = query.eq('soil_type', filters.soil_type)
      }
      
      if (filters?.season) {
        query = query.eq('season', filters.season)
      }

      const { data, error } = await query.order('crop_name')

      if (error) throw error

      setCrops(data || [])
    } catch (error: any) {
      toast({
        title: "Failed to fetch crops",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCrops()
  }, [])

  return {
    crops,
    loading,
    fetchCrops
  }
}