export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      orders: {
        Row: {
          created_at: string
          delivery_destination: string
          delivery_period: number
          discount: number
          freight: number | null
          freight_terms: string
          id: number
          net_amount: number
          order_date: string
          payment_terms: string
          remarks: string | null
          required_date: string
          sales_tax: number
          supplier_address: string | null
          supplier_name: string
          total_amount: number
        }
        Insert: {
          created_at?: string
          delivery_destination: string
          delivery_period: number
          discount?: number
          freight?: number | null
          freight_terms: string
          id?: number
          net_amount: number
          order_date: string
          payment_terms: string
          remarks?: string | null
          required_date: string
          sales_tax?: number
          supplier_address?: string | null
          supplier_name: string
          total_amount: number
        }
        Update: {
          created_at?: string
          delivery_destination?: string
          delivery_period?: number
          discount?: number
          freight?: number | null
          freight_terms?: string
          id?: number
          net_amount?: number
          order_date?: string
          payment_terms?: string
          remarks?: string | null
          required_date?: string
          sales_tax?: number
          supplier_address?: string | null
          supplier_name?: string
          total_amount?: number
        }
        Relationships: []
      }
      requested_items: {
        Row: {
          additional_specifications: string | null
          amount: number
          category: Database["public"]["Enums"]["order_category"]
          created_at: string
          id: number
          item_code: string
          item_description: string
          order_id: number
          quantity: number
          rate: number
          unit: string
        }
        Insert: {
          additional_specifications?: string | null
          amount: number
          category: Database["public"]["Enums"]["order_category"]
          created_at?: string
          id?: number
          item_code: string
          item_description: string
          order_id: number
          quantity: number
          rate: number
          unit: string
        }
        Update: {
          additional_specifications?: string | null
          amount?: number
          category?: Database["public"]["Enums"]["order_category"]
          created_at?: string
          id?: number
          item_code?: string
          item_description?: string
          order_id?: number
          quantity?: number
          rate?: number
          unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "requested_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      user_otps: {
        Row: {
          created_at: string
          expires_at: string
          id: number
          otp: string
          purpose: Database["public"]["Enums"]["otp_purpose"]
          used: boolean
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: number
          otp: string
          purpose: Database["public"]["Enums"]["otp_purpose"]
          used?: boolean
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: number
          otp?: string
          purpose?: Database["public"]["Enums"]["otp_purpose"]
          used?: boolean
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      users: {
        Row: {
          email: string | null
          first_name: string | null
          id: string | null
          last_name: string | null
          role: string | null
        }
        Insert: {
          email?: string | null
          first_name?: never
          id?: string | null
          last_name?: never
          role?: never
        }
        Update: {
          email?: string | null
          first_name?: never
          id?: string | null
          last_name?: never
          role?: never
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      order_category: "ZIPPER" | "ACCESSORIES"
      otp_purpose: "login" | "forgot-password" | "email-verification"
      user_roles:
        | "SUPER_ADMIN"
        | "ORGANIZATIONAL_ADMIN"
        | "PROCESS_MANAGER"
        | "EMPLOYEE"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      order_category: ["ZIPPER", "ACCESSORIES"],
      otp_purpose: ["login", "forgot-password", "email-verification"],
      user_roles: [
        "SUPER_ADMIN",
        "ORGANIZATIONAL_ADMIN",
        "PROCESS_MANAGER",
        "EMPLOYEE",
      ],
    },
  },
} as const
