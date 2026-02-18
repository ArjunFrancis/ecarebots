// Generated types for Supabase database
// This file will be auto-generated once schema is deployed

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          date_of_birth: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          phone?: string | null
          date_of_birth?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          date_of_birth?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      medications: {
        Row: {
          id: string
          user_id: string
          name: string
          dosage: string
          frequency: string
          times: string[]
          refill_date: string | null
          notes: string | null
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          dosage: string
          frequency: string
          times: string[]
          refill_date?: string | null
          notes?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          dosage?: string
          frequency?: string
          times?: string[]
          refill_date?: string | null
          notes?: string | null
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      appointments: {
        Row: {
          id: string
          user_id: string
          title: string
          datetime: string
          location: string | null
          notes: string | null
          completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          datetime: string
          location?: string | null
          notes?: string | null
          completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          datetime?: string
          location?: string | null
          notes?: string | null
          completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      adherence_logs: {
        Row: {
          id: string
          user_id: string
          medication_id: string
          scheduled_time: string
          taken_at: string | null
          status: 'taken' | 'skipped' | 'pending'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          medication_id: string
          scheduled_time: string
          taken_at?: string | null
          status?: 'taken' | 'skipped' | 'pending'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          medication_id?: string
          scheduled_time?: string
          taken_at?: string | null
          status?: 'taken' | 'skipped' | 'pending'
          created_at?: string
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}
