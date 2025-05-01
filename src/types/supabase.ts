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
      issues: {
        Row: {
          id: number
          title: string
          description: string
          content: string
          thumbnail: string
          date: string
          slug: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: number
          title: string
          description: string
          content: string
          thumbnail: string
          date?: string
          slug: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: number
          title?: string
          description?: string
          content?: string
          thumbnail?: string
          date?: string
          slug?: string
          created_at?: string
          updated_at?: string | null
        }
      }
      chat_messages: {
        Row: {
          id: number
          issue_slug: string
          sender_name: string
          message: string
          created_at: string
          is_system_message: boolean
          sender_id: string | null
          ip_address: string | null
        }
        Insert: {
          id?: number
          issue_slug: string
          sender_name: string
          message: string
          created_at?: string
          is_system_message?: boolean
          sender_id?: string | null
          ip_address?: string | null
        }
        Update: {
          id?: number
          issue_slug?: string
          sender_name?: string
          message?: string
          created_at?: string
          is_system_message?: boolean
          sender_id?: string | null
          ip_address?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 