import { User as SupabaseUser } from '@supabase/supabase-js'

export type User = SupabaseUser

export interface AuthState {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string, name?: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
}

export interface TravelPlan {
  id: string
  user_id: string
  title: string
  destination: string
  start_date: string
  end_date: string
  budget: number
  travelers_count: number
  preferences: string[]
  itinerary: ItineraryItem[]
  expenses: Expense[]
  created_at: string
  updated_at: string
}

export interface ItineraryItem {
  id: string
  day: number
  time: string
  title: string
  description: string
  location: {
    name: string
    address: string
    latitude: number
    longitude: number
  }
  type: 'attraction' | 'restaurant' | 'accommodation' | 'transport'
  estimated_cost: number
  duration: number // in minutes
}

export interface Expense {
  id: string
  plan_id: string
  title: string
  amount: number
  category: 'transport' | 'accommodation' | 'food' | 'attraction' | 'shopping' | 'other'
  date: string
  description?: string
  created_at: string
}