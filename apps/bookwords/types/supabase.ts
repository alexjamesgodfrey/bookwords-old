export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      authors: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
      }
      authors_on_book: {
        Row: {
          author_id: string | null
          book_id: string
          created_at: string
          id: number
        }
        Insert: {
          author_id?: string | null
          book_id: string
          created_at?: string
          id?: number
        }
        Update: {
          author_id?: string | null
          book_id?: string
          created_at?: string
          id?: number
        }
      }
      books: {
        Row: {
          created_at: string | null
          description: string | null
          google_id: string
          id: string
          image: string | null
          pages: number | null
          published_date: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          google_id: string
          id: string
          image?: string | null
          pages?: number | null
          published_date?: string | null
          title?: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          google_id?: string
          id?: string
          image?: string | null
          pages?: number | null
          published_date?: string | null
          title?: string
        }
      }
      contributions: {
        Row: {
          at: string
          average_paragraph: number
          average_sentence: number
          average_word: number
          book_id: string
          by: string
          characters_excluding_spaces: number
          characters_including_spaces: number
          google_id: string
          id: string
          longest_word: string
          paragraphs: number
          sentences: number
          short_words: number
          unique_words: number
          words: number
        }
        Insert: {
          at?: string
          average_paragraph: number
          average_sentence: number
          average_word: number
          book_id: string
          by: string
          characters_excluding_spaces: number
          characters_including_spaces: number
          google_id: string
          id: string
          longest_word: string
          paragraphs: number
          sentences: number
          short_words: number
          unique_words: number
          words: number
        }
        Update: {
          at?: string
          average_paragraph?: number
          average_sentence?: number
          average_word?: number
          book_id?: string
          by?: string
          characters_excluding_spaces?: number
          characters_including_spaces?: number
          google_id?: string
          id?: string
          longest_word?: string
          paragraphs?: number
          sentences?: number
          short_words?: number
          unique_words?: number
          words?: number
        }
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
      }
      tops_on_contribution: {
        Row: {
          contribution_id: string
          count: number
          created_at: string
          id: number
          is_common: boolean
          rank: number
          word: string
        }
        Insert: {
          contribution_id: string
          count: number
          created_at?: string
          id?: number
          is_common: boolean
          rank: number
          word: string
        }
        Update: {
          contribution_id?: string
          count?: number
          created_at?: string
          id?: number
          is_common?: boolean
          rank?: number
          word?: string
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
