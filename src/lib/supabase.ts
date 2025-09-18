import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://your-project.supabase.co'
const supabaseAnonKey = 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          user_id: string
          name: string
          location: string | null
          preferred_language: 'english' | 'hindi' | 'punjabi'
          notifications_enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          location?: string | null
          preferred_language?: 'english' | 'hindi' | 'punjabi'
          notifications_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          location?: string | null
          preferred_language?: 'english' | 'hindi' | 'punjabi'
          notifications_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      weather: {
        Row: {
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
        Insert: {
          id?: string
          location: string
          forecast_date: string
          temperature?: number | null
          humidity?: number | null
          wind_speed?: number | null
          rain_chance?: number | null
          weather_condition?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          location?: string
          forecast_date?: string
          temperature?: number | null
          humidity?: number | null
          wind_speed?: number | null
          rain_chance?: number | null
          weather_condition?: string | null
          created_at?: string
        }
      }
      crops: {
        Row: {
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
        Insert: {
          id?: string
          crop_name: string
          crop_name_hindi?: string | null
          crop_name_punjabi?: string | null
          image_url?: string | null
          soil_type?: string | null
          season?: string | null
          fertilizer_tip?: string | null
          fertilizer_tip_hindi?: string | null
          fertilizer_tip_punjabi?: string | null
          planting_months?: string[] | null
          harvest_months?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          crop_name?: string
          crop_name_hindi?: string | null
          crop_name_punjabi?: string | null
          image_url?: string | null
          soil_type?: string | null
          season?: string | null
          fertilizer_tip?: string | null
          fertilizer_tip_hindi?: string | null
          fertilizer_tip_punjabi?: string | null
          planting_months?: string[] | null
          harvest_months?: string[] | null
          created_at?: string
        }
      }
      chat_history: {
        Row: {
          id: string
          user_id: string
          question: string
          question_language: string
          answer: string
          answer_language: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          question: string
          question_language?: string
          answer: string
          answer_language?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          question?: string
          question_language?: string
          answer?: string
          answer_language?: string
          created_at?: string
        }
      }
    }
  }
}