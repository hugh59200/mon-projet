export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      conversations: {
        Row: {
          last_admin_message_id: number | null
          last_admin_read_at: string | null
          last_read_at: string | null
          last_read_message_id: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          last_admin_message_id?: number | null
          last_admin_read_at?: string | null
          last_read_at?: string | null
          last_read_message_id?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          last_admin_message_id?: number | null
          last_admin_read_at?: string | null
          last_read_at?: string | null
          last_read_message_id?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_last_admin_message_id_fkey"
            columns: ["last_admin_message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_last_admin_message_id_fkey"
            columns: ["last_admin_message_id"]
            isOneToOne: false
            referencedRelation: "messages_by_conversation_view"
            referencedColumns: ["message_id"]
          },
          {
            foreignKeyName: "conversations_last_read_message_id_fkey"
            columns: ["last_read_message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_last_read_message_id_fkey"
            columns: ["last_read_message_id"]
            isOneToOne: false
            referencedRelation: "messages_by_conversation_view"
            referencedColumns: ["message_id"]
          },
          {
            foreignKeyName: "conversations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "conversation_overview"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "conversations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      emails_sent: {
        Row: {
          body_html: string
          id: string
          order_id: string | null
          provider_response: Json | null
          sent_at: string | null
          status: string | null
          subject: string
          to_email: string
          type: string
        }
        Insert: {
          body_html: string
          id?: string
          order_id?: string | null
          provider_response?: Json | null
          sent_at?: string | null
          status?: string | null
          subject: string
          to_email: string
          type?: string
        }
        Update: {
          body_html?: string
          id?: string
          order_id?: string | null
          provider_response?: Json | null
          sent_at?: string | null
          status?: string | null
          subject?: string
          to_email?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "emails_sent_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "emails_sent_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders_detailed_view"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "emails_sent_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders_full_view"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "emails_sent_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders_overview_for_admin"
            referencedColumns: ["order_id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: number
          is_read: boolean | null
          read_at: string | null
          sender_role: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: never
          is_read?: boolean | null
          read_at?: string | null
          sender_role?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: never
          is_read?: boolean | null
          read_at?: string | null
          sender_role?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "conversation_overview"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      news: {
        Row: {
          author_id: string | null
          content: string | null
          created_at: string | null
          excerpt: string | null
          id: string
          image: string | null
          published_at: string | null
          slug: string
          title: string
          topic_id: string | null
        }
        Insert: {
          author_id?: string | null
          content?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          image?: string | null
          published_at?: string | null
          slug: string
          title: string
          topic_id?: string | null
        }
        Update: {
          author_id?: string | null
          content?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          image?: string | null
          published_at?: string | null
          slug?: string
          title?: string
          topic_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "news_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "conversation_overview"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "news_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "news_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "news_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      news_topics: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          image: string | null
          label: string
          slug: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          image?: string | null
          label: string
          slug: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          image?: string | null
          label?: string
          slug?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          order_id: string
          price: number
          product_id: string
          product_name_snapshot: string
          quantity: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_id: string
          price: number
          product_id: string
          product_name_snapshot: string
          quantity?: number
        }
        Update: {
          created_at?: string | null
          id?: string
          order_id?: string
          price?: number
          product_id?: string
          product_name_snapshot?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders_detailed_view"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders_full_view"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders_overview_for_admin"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          address: string | null
          carrier: string | null
          city: string | null
          country: string | null
          created_at: string | null
          discount_amount: number | null
          email: string
          full_name: string
          id: string
          internal_notes: string | null
          is_guest_order: boolean | null
          order_number: string | null
          payment_intent_id: string | null
          payment_method: string | null
          paypal_order_id: string | null
          shipped_at: string | null
          shipping_cost: number | null
          status: Database["public"]["Enums"]["order_status"]
          stripe_session_id: string | null
          subtotal: number | null
          tax_amount: number | null
          total_amount: number
          tracking_number: string | null
          tracking_token: string | null
          updated_at: string | null
          user_id: string | null
          zip: string | null
        }
        Insert: {
          address?: string | null
          carrier?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          discount_amount?: number | null
          email: string
          full_name: string
          id?: string
          internal_notes?: string | null
          is_guest_order?: boolean | null
          order_number?: string | null
          payment_intent_id?: string | null
          payment_method?: string | null
          paypal_order_id?: string | null
          shipped_at?: string | null
          shipping_cost?: number | null
          status?: Database["public"]["Enums"]["order_status"]
          stripe_session_id?: string | null
          subtotal?: number | null
          tax_amount?: number | null
          total_amount: number
          tracking_number?: string | null
          tracking_token?: string | null
          updated_at?: string | null
          user_id?: string | null
          zip?: string | null
        }
        Update: {
          address?: string | null
          carrier?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          discount_amount?: number | null
          email?: string
          full_name?: string
          id?: string
          internal_notes?: string | null
          is_guest_order?: boolean | null
          order_number?: string | null
          payment_intent_id?: string | null
          payment_method?: string | null
          paypal_order_id?: string | null
          shipped_at?: string | null
          shipping_cost?: number | null
          status?: Database["public"]["Enums"]["order_status"]
          stripe_session_id?: string | null
          subtotal?: number | null
          tax_amount?: number | null
          total_amount?: number
          tracking_number?: string | null
          tracking_token?: string | null
          updated_at?: string | null
          user_id?: string | null
          zip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "conversation_overview"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_events: {
        Row: {
          created_at: string | null
          id: number
          order_id: string | null
          payload: Json | null
          provider: string
        }
        Insert: {
          created_at?: string | null
          id?: never
          order_id?: string | null
          payload?: Json | null
          provider: string
        }
        Update: {
          created_at?: string | null
          id?: never
          order_id?: string | null
          payload?: Json | null
          provider?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_events_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_events_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders_detailed_view"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "payment_events_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders_full_view"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "payment_events_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders_overview_for_admin"
            referencedColumns: ["order_id"]
          },
        ]
      }
      products: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          dosage: string | null
          id: string
          image: string | null
          is_on_sale: boolean | null
          name: string
          price: number
          purity: number | null
          sale_price: number | null
          stock: number
          tags: string[] | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          dosage?: string | null
          id?: string
          image?: string | null
          is_on_sale?: boolean | null
          name: string
          price: number
          purity?: number | null
          sale_price?: number | null
          stock?: number
          tags?: string[] | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          dosage?: string | null
          id?: string
          image?: string | null
          is_on_sale?: boolean | null
          name?: string
          price?: number
          purity?: number | null
          sale_price?: number | null
          stock?: number
          tags?: string[] | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          avatar_url: string | null
          birthdate: string | null
          cgu_accepted: boolean | null
          cgu_accepted_at: string | null
          city: string | null
          country: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          gender: string | null
          id: string
          phone: string | null
          role: string | null
          ui_preferences: Json | null
          zip: string | null
        }
        Insert: {
          address?: string | null
          avatar_url?: string | null
          birthdate?: string | null
          cgu_accepted?: boolean | null
          cgu_accepted_at?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          gender?: string | null
          id: string
          phone?: string | null
          role?: string | null
          ui_preferences?: Json | null
          zip?: string | null
        }
        Update: {
          address?: string | null
          avatar_url?: string | null
          birthdate?: string | null
          cgu_accepted?: boolean | null
          cgu_accepted_at?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          phone?: string | null
          role?: string | null
          ui_preferences?: Json | null
          zip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "user_overview"
            referencedColumns: ["id"]
          },
        ]
      }
      user_cart_items: {
        Row: {
          id: string
          product_id: string
          quantity: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          id?: string
          product_id: string
          quantity?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          id?: string
          product_id?: string
          quantity?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_cart_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "conversation_overview"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_cart_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      conversation_overview: {
        Row: {
          last_admin_message_id: number | null
          last_admin_read_at: string | null
          last_message: string | null
          last_message_at: string | null
          last_read_at: string | null
          last_read_message_id: number | null
          unread_count_admin: number | null
          user_email: string | null
          user_id: string | null
          user_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_last_admin_message_id_fkey"
            columns: ["last_admin_message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_last_admin_message_id_fkey"
            columns: ["last_admin_message_id"]
            isOneToOne: false
            referencedRelation: "messages_by_conversation_view"
            referencedColumns: ["message_id"]
          },
          {
            foreignKeyName: "conversations_last_read_message_id_fkey"
            columns: ["last_read_message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_last_read_message_id_fkey"
            columns: ["last_read_message_id"]
            isOneToOne: false
            referencedRelation: "messages_by_conversation_view"
            referencedColumns: ["message_id"]
          },
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user_overview"
            referencedColumns: ["id"]
          },
        ]
      }
      messages_by_conversation_view: {
        Row: {
          content: string | null
          created_at: string | null
          is_read: boolean | null
          message_id: number | null
          read_at: string | null
          sender_role: string | null
          user_email: string | null
          user_id: string | null
          user_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "conversation_overview"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages_unread_view: {
        Row: {
          count: number | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "conversation_overview"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      orders_detailed_view: {
        Row: {
          address: string | null
          carrier: string | null
          city: string | null
          country: string | null
          created_at: string | null
          detailed_items: Json | null
          discount_amount: number | null
          email: string | null
          full_name: string | null
          is_guest_order: boolean | null
          order_id: string | null
          payment_method: string | null
          shipped_at: string | null
          shipping_cost: number | null
          status: Database["public"]["Enums"]["order_status"] | null
          subtotal: number | null
          tax_amount: number | null
          total_amount: number | null
          tracking_number: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "conversation_overview"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      orders_full_view: {
        Row: {
          carrier: string | null
          created_at: string | null
          detailed_items: Json | null
          discount_amount: number | null
          is_guest_order: boolean | null
          order_id: string | null
          order_number: string | null
          payment_intent_id: string | null
          payment_method: string | null
          paypal_order_id: string | null
          profile_info: Json | null
          shipped_at: string | null
          shipping_address: string | null
          shipping_city: string | null
          shipping_cost: number | null
          shipping_country: string | null
          shipping_email: string | null
          shipping_name: string | null
          shipping_zip: string | null
          status: Database["public"]["Enums"]["order_status"] | null
          stripe_session_id: string | null
          subtotal: number | null
          tax_amount: number | null
          total_amount: number | null
          tracking_number: string | null
          tracking_token: string | null
          updated_at: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "conversation_overview"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      orders_overview_for_admin: {
        Row: {
          created_at: string | null
          customer_email: string | null
          customer_name: string | null
          emails_count: number | null
          is_guest_order: boolean | null
          order_id: string | null
          order_number: string | null
          shipped_at: string | null
          status: Database["public"]["Enums"]["order_status"] | null
          total_amount: number | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "conversation_overview"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_cart_view: {
        Row: {
          cart_item_id: string | null
          is_on_sale: boolean | null
          product_category: string | null
          product_dosage: string | null
          product_id: string | null
          product_image: string | null
          product_name: string | null
          product_price: number | null
          product_purity: number | null
          product_sale_price: number | null
          product_stock: number | null
          quantity: number | null
          updated_at: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_cart_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "conversation_overview"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_cart_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_overview: {
        Row: {
          auth_created_at: string | null
          cgu_accepted: boolean | null
          display_name: string | null
          email: string | null
          full_name: string | null
          id: string | null
          role: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      admin_update_order_status: {
        Args: {
          p_new_status: string
          p_order_id: string
          p_send_email?: boolean
        }
        Returns: Json
      }
      claim_guest_orders: {
        Args: { p_email: string; p_user_id: string }
        Returns: Json
      }
      claim_order_for_user: {
        Args: { p_order_id: string; p_user_id: string }
        Returns: Json
      }
      create_full_order:
        | {
            Args: {
              _address: string
              _city: string
              _country: string
              _email: string
              _full_name: string
              _items: Json
              _payment_intent_id?: string
              _payment_method: string
              _status?: string
              _stripe_session_id?: string
              _total_amount: number
              _user_id: string
              _zip: string
            }
            Returns: string
          }
        | {
            Args: {
              _address: string
              _city: string
              _country: string
              _email: string
              _full_name: string
              _items: Json
              _payment_method: string
              _total_amount: number
              _user_id: string
              _zip: string
            }
            Returns: string
          }
        | {
            Args: {
              _address: string
              _city: string
              _country: string
              _email: string
              _full_name: string
              _items: Json
              _payment_method: string
              _status?: string
              _total_amount: number
              _user_id: string
              _zip: string
            }
            Returns: string
          }
      create_order_with_items: {
        Args: {
          p_address: string
          p_city: string
          p_country: string
          p_email: string
          p_full_name: string
          p_items: Json
          p_payment_method: string
          p_total_amount: number
          p_user_id: string
          p_zip: string
        }
        Returns: string
      }
      create_order_with_items_full: {
        Args: {
          p_address: string
          p_city: string
          p_country: string
          p_discount_amount: number
          p_email: string
          p_full_name: string
          p_items: Json
          p_payment_method: string
          p_shipping_cost: number
          p_subtotal: number
          p_tax_amount: number
          p_total_amount: number
          p_user_id: string
          p_zip: string
        }
        Returns: Json
      }
      get_guest_order_by_token: {
        Args: { p_tracking_token: string }
        Returns: Json
      }
      get_guest_order_details: {
        Args: { p_email: string; p_order_number: string }
        Returns: Json
      }
      get_order_summary_public: { Args: { p_order_id: string }; Returns: Json }
      is_admin: { Args: { uid: string }; Returns: boolean }
      jwt_custom_claims: { Args: never; Returns: Json }
      user_exists_by_email: { Args: { p_email: string }; Returns: boolean }
    }
    Enums: {
      order_status:
        | "pending"
        | "processing"
        | "paid"
        | "confirmed"
        | "shipped"
        | "completed"
        | "canceled"
        | "refunded"
        | "failed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      order_status: [
        "pending",
        "processing",
        "paid",
        "confirmed",
        "shipped",
        "completed",
        "canceled",
        "refunded",
        "failed",
      ],
    },
  },
} as const
