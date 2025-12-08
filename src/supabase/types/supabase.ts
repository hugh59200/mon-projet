// Override: any pour éviter "Type instantiation is excessively deep and possibly infinite"
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Json = any

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      auto_promo_settings: {
        Row: {
          created_at: string | null
          id: string
          is_enabled: boolean | null
          setting_key: string
          setting_value: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
          setting_key: string
          setting_value: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_enabled?: boolean | null
          setting_key?: string
          setting_value?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
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
          content_i18n: Json | null
          created_at: string | null
          excerpt: string | null
          excerpt_i18n: Json | null
          id: string
          image: string | null
          published_at: string | null
          slug: string
          title: string
          title_i18n: Json | null
          topic_id: string | null
        }
        Insert: {
          author_id?: string | null
          content?: string | null
          content_i18n?: Json | null
          created_at?: string | null
          excerpt?: string | null
          excerpt_i18n?: Json | null
          id?: string
          image?: string | null
          published_at?: string | null
          slug: string
          title: string
          title_i18n?: Json | null
          topic_id?: string | null
        }
        Update: {
          author_id?: string | null
          content?: string | null
          content_i18n?: Json | null
          created_at?: string | null
          excerpt?: string | null
          excerpt_i18n?: Json | null
          id?: string
          image?: string | null
          published_at?: string | null
          slug?: string
          title?: string
          title_i18n?: Json | null
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
          description_i18n: Json | null
          id: string
          image: string | null
          label: string
          label_i18n: Json | null
          slug: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          description_i18n?: Json | null
          id?: string
          image?: string | null
          label: string
          label_i18n?: Json | null
          slug: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          description_i18n?: Json | null
          id?: string
          image?: string | null
          label?: string
          label_i18n?: Json | null
          slug?: string
        }
        Relationships: []
      }
      newsletter_campaigns: {
        Row: {
          bounced_count: number | null
          clicked_count: number | null
          content_html: string
          content_text: string | null
          created_at: string | null
          created_by: string | null
          id: string
          opened_count: number | null
          preview_text: string | null
          recipients_count: number | null
          scheduled_at: string | null
          sent_at: string | null
          sent_count: number | null
          status: string | null
          subject: string
          target_locales: string[] | null
          target_status: string | null
          target_topics: string[] | null
          unsubscribed_count: number | null
          updated_at: string | null
        }
        Insert: {
          bounced_count?: number | null
          clicked_count?: number | null
          content_html: string
          content_text?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          opened_count?: number | null
          preview_text?: string | null
          recipients_count?: number | null
          scheduled_at?: string | null
          sent_at?: string | null
          sent_count?: number | null
          status?: string | null
          subject: string
          target_locales?: string[] | null
          target_status?: string | null
          target_topics?: string[] | null
          unsubscribed_count?: number | null
          updated_at?: string | null
        }
        Update: {
          bounced_count?: number | null
          clicked_count?: number | null
          content_html?: string
          content_text?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          opened_count?: number | null
          preview_text?: string | null
          recipients_count?: number | null
          scheduled_at?: string | null
          sent_at?: string | null
          sent_count?: number | null
          status?: string | null
          subject?: string
          target_locales?: string[] | null
          target_status?: string | null
          target_topics?: string[] | null
          unsubscribed_count?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "newsletter_campaigns_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_overview"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_sends: {
        Row: {
          bounce_reason: string | null
          bounced_at: string | null
          campaign_id: string
          clicked_at: string | null
          id: string
          opened_at: string | null
          provider_message_id: string | null
          sent_at: string | null
          subscriber_id: string
        }
        Insert: {
          bounce_reason?: string | null
          bounced_at?: string | null
          campaign_id: string
          clicked_at?: string | null
          id?: string
          opened_at?: string | null
          provider_message_id?: string | null
          sent_at?: string | null
          subscriber_id: string
        }
        Update: {
          bounce_reason?: string | null
          bounced_at?: string | null
          campaign_id?: string
          clicked_at?: string | null
          id?: string
          opened_at?: string | null
          provider_message_id?: string | null
          sent_at?: string | null
          subscriber_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "newsletter_sends_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "newsletter_campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "newsletter_sends_subscriber_id_fkey"
            columns: ["subscriber_id"]
            isOneToOne: false
            referencedRelation: "newsletter_subscribers"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscribers: {
        Row: {
          confirmation_token: string | null
          confirmed_at: string | null
          country: string | null
          created_at: string | null
          email: string
          emails_opened_count: number | null
          emails_sent_count: number | null
          first_name: string | null
          id: string
          ip_address: unknown
          last_email_opened_at: string | null
          last_email_sent_at: string | null
          locale: string | null
          preferences: Json | null
          source: string | null
          status: string | null
          unsubscribe_reason: string | null
          unsubscribed_at: string | null
          updated_at: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          confirmation_token?: string | null
          confirmed_at?: string | null
          country?: string | null
          created_at?: string | null
          email: string
          emails_opened_count?: number | null
          emails_sent_count?: number | null
          first_name?: string | null
          id?: string
          ip_address?: unknown
          last_email_opened_at?: string | null
          last_email_sent_at?: string | null
          locale?: string | null
          preferences?: Json | null
          source?: string | null
          status?: string | null
          unsubscribe_reason?: string | null
          unsubscribed_at?: string | null
          updated_at?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          confirmation_token?: string | null
          confirmed_at?: string | null
          country?: string | null
          created_at?: string | null
          email?: string
          emails_opened_count?: number | null
          emails_sent_count?: number | null
          first_name?: string | null
          id?: string
          ip_address?: unknown
          last_email_opened_at?: string | null
          last_email_sent_at?: string | null
          locale?: string | null
          preferences?: Json | null
          source?: string | null
          status?: string | null
          unsubscribe_reason?: string | null
          unsubscribed_at?: string | null
          updated_at?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "newsletter_subscribers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_overview"
            referencedColumns: ["id"]
          },
        ]
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
          payment_method: string | null
          promo_code_id: string | null
          promo_code_snapshot: string | null
          relay_address: string | null
          relay_city: string | null
          relay_country: string | null
          relay_id: string | null
          relay_name: string | null
          relay_zipcode: string | null
          shipped_at: string | null
          shipping_cost: number | null
          status: Database["public"]["Enums"]["order_status"]
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
          payment_method?: string | null
          promo_code_id?: string | null
          promo_code_snapshot?: string | null
          relay_address?: string | null
          relay_city?: string | null
          relay_country?: string | null
          relay_id?: string | null
          relay_name?: string | null
          relay_zipcode?: string | null
          shipped_at?: string | null
          shipping_cost?: number | null
          status?: Database["public"]["Enums"]["order_status"]
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
          payment_method?: string | null
          promo_code_id?: string | null
          promo_code_snapshot?: string | null
          relay_address?: string | null
          relay_city?: string | null
          relay_country?: string | null
          relay_id?: string | null
          relay_name?: string | null
          relay_zipcode?: string | null
          shipped_at?: string | null
          shipping_cost?: number | null
          status?: Database["public"]["Enums"]["order_status"]
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
            foreignKeyName: "orders_promo_code_id_fkey"
            columns: ["promo_code_id"]
            isOneToOne: false
            referencedRelation: "promo_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_promo_code_id_fkey"
            columns: ["promo_code_id"]
            isOneToOne: false
            referencedRelation: "promo_codes_admin"
            referencedColumns: ["id"]
          },
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
          bulk_pricing: Json | null
          cas_number: string | null
          category: string
          category_i18n: Json | null
          coa_url: string | null
          created_at: string | null
          description: string | null
          description_i18n: Json | null
          dosage: string | null
          id: string
          image: string | null
          is_on_sale: boolean | null
          name: string
          name_i18n: Json | null
          price: number
          purity: number | null
          sale_price: number | null
          sequence: string | null
          stock: number
          tags: string[] | null
        }
        Insert: {
          bulk_pricing?: Json | null
          cas_number?: string | null
          category: string
          category_i18n?: Json | null
          coa_url?: string | null
          created_at?: string | null
          description?: string | null
          description_i18n?: Json | null
          dosage?: string | null
          id?: string
          image?: string | null
          is_on_sale?: boolean | null
          name: string
          name_i18n?: Json | null
          price: number
          purity?: number | null
          sale_price?: number | null
          sequence?: string | null
          stock?: number
          tags?: string[] | null
        }
        Update: {
          bulk_pricing?: Json | null
          cas_number?: string | null
          category?: string
          category_i18n?: Json | null
          coa_url?: string | null
          created_at?: string | null
          description?: string | null
          description_i18n?: Json | null
          dosage?: string | null
          id?: string
          image?: string | null
          is_on_sale?: boolean | null
          name?: string
          name_i18n?: Json | null
          price?: number
          purity?: number | null
          sale_price?: number | null
          sequence?: string | null
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
          last_login_at: string | null
          login_count: number | null
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
          last_login_at?: string | null
          login_count?: number | null
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
          last_login_at?: string | null
          login_count?: number | null
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
      promo_code_usage: {
        Row: {
          discount_applied: number
          id: string
          order_id: string | null
          promo_code_id: string
          used_at: string | null
          user_email: string
          user_id: string | null
        }
        Insert: {
          discount_applied: number
          id?: string
          order_id?: string | null
          promo_code_id: string
          used_at?: string | null
          user_email: string
          user_id?: string | null
        }
        Update: {
          discount_applied?: number
          id?: string
          order_id?: string | null
          promo_code_id?: string
          used_at?: string | null
          user_email?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "promo_code_usage_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promo_code_usage_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders_detailed_view"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "promo_code_usage_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders_full_view"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "promo_code_usage_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders_overview_for_admin"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "promo_code_usage_promo_code_id_fkey"
            columns: ["promo_code_id"]
            isOneToOne: false
            referencedRelation: "promo_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promo_code_usage_promo_code_id_fkey"
            columns: ["promo_code_id"]
            isOneToOne: false
            referencedRelation: "promo_codes_admin"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "promo_code_usage_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "conversation_overview"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "promo_code_usage_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      promo_codes: {
        Row: {
          active: boolean | null
          code: string
          created_at: string | null
          current_uses: number | null
          description: string | null
          discount_type: string
          discount_value: number
          id: string
          max_discount_amount: number | null
          max_uses: number | null
          max_uses_per_user: number | null
          min_order_amount: number | null
          updated_at: string | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          active?: boolean | null
          code: string
          created_at?: string | null
          current_uses?: number | null
          description?: string | null
          discount_type: string
          discount_value: number
          id?: string
          max_discount_amount?: number | null
          max_uses?: number | null
          max_uses_per_user?: number | null
          min_order_amount?: number | null
          updated_at?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          active?: boolean | null
          code?: string
          created_at?: string | null
          current_uses?: number | null
          description?: string | null
          discount_type?: string
          discount_value?: number
          id?: string
          max_discount_amount?: number | null
          max_uses?: number | null
          max_uses_per_user?: number | null
          min_order_amount?: number | null
          updated_at?: string | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          author_institution: string | null
          author_name: string
          author_title: string | null
          author_type: string | null
          content: string | null
          created_at: string | null
          id: string
          is_approved: boolean | null
          is_featured: boolean | null
          is_verified_purchase: boolean | null
          product_id: string
          rating: number
          rating_purity: number | null
          rating_quality: number | null
          rating_shipping: number | null
          rating_value: number | null
          title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          author_institution?: string | null
          author_name: string
          author_title?: string | null
          author_type?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          is_approved?: boolean | null
          is_featured?: boolean | null
          is_verified_purchase?: boolean | null
          product_id: string
          rating: number
          rating_purity?: number | null
          rating_quality?: number | null
          rating_shipping?: number | null
          rating_value?: number | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          author_institution?: string | null
          author_name?: string
          author_title?: string | null
          author_type?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          is_approved?: boolean | null
          is_featured?: boolean | null
          is_verified_purchase?: boolean | null
          product_id?: string
          rating?: number
          rating_purity?: number | null
          rating_quality?: number | null
          rating_shipping?: number | null
          rating_value?: number | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_overview"
            referencedColumns: ["id"]
          },
        ]
      }
      user_cart_items: {
        Row: {
          applied_discount_percent: number | null
          id: string
          product_id: string
          quantity: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          applied_discount_percent?: number | null
          id?: string
          product_id: string
          quantity?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          applied_discount_percent?: number | null
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
      user_promo_rewards: {
        Row: {
          created_at: string | null
          expires_at: string | null
          generated_code: string | null
          id: string
          is_used: boolean | null
          metadata: Json | null
          promo_code_id: string | null
          reward_type: string
          user_email: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          generated_code?: string | null
          id?: string
          is_used?: boolean | null
          metadata?: Json | null
          promo_code_id?: string | null
          reward_type: string
          user_email: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          generated_code?: string | null
          id?: string
          is_used?: boolean | null
          metadata?: Json | null
          promo_code_id?: string | null
          reward_type?: string
          user_email?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_promo_rewards_promo_code_id_fkey"
            columns: ["promo_code_id"]
            isOneToOne: false
            referencedRelation: "promo_codes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_promo_rewards_promo_code_id_fkey"
            columns: ["promo_code_id"]
            isOneToOne: false
            referencedRelation: "promo_codes_admin"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_promo_rewards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "conversation_overview"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_promo_rewards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_sessions: {
        Row: {
          added_to_cart: boolean | null
          browser: string | null
          city: string | null
          completed_order: boolean | null
          country: string | null
          country_code: string | null
          device_type: string | null
          duration_seconds: number | null
          ended_at: string | null
          id: string
          ip_address: string | null
          landing_page: string | null
          last_activity_at: string | null
          metadata: Json | null
          os: string | null
          pages_viewed: number | null
          referrer: string | null
          region: string | null
          session_id: string
          session_type: string
          started_at: string | null
          started_checkout: boolean | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          added_to_cart?: boolean | null
          browser?: string | null
          city?: string | null
          completed_order?: boolean | null
          country?: string | null
          country_code?: string | null
          device_type?: string | null
          duration_seconds?: number | null
          ended_at?: string | null
          id?: string
          ip_address?: string | null
          landing_page?: string | null
          last_activity_at?: string | null
          metadata?: Json | null
          os?: string | null
          pages_viewed?: number | null
          referrer?: string | null
          region?: string | null
          session_id: string
          session_type: string
          started_at?: string | null
          started_checkout?: boolean | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          added_to_cart?: boolean | null
          browser?: string | null
          city?: string | null
          completed_order?: boolean | null
          country?: string | null
          country_code?: string | null
          device_type?: string | null
          duration_seconds?: number | null
          ended_at?: string | null
          id?: string
          ip_address?: string | null
          landing_page?: string | null
          last_activity_at?: string | null
          metadata?: Json | null
          os?: string | null
          pages_viewed?: number | null
          referrer?: string | null
          region?: string | null
          session_id?: string
          session_type?: string
          started_at?: string | null
          started_checkout?: boolean | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "conversation_overview"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_sessions_user_id_fkey"
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
      newsletter_stats: {
        Row: {
          active_rate: number | null
          active_subscribers: number | null
          locales_count: number | null
          new_last_30_days: number | null
          new_last_7_days: number | null
          pending_subscribers: number | null
          total_subscribers: number | null
          unsubscribed_count: number | null
        }
        Relationships: []
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
          is_relay_delivery: boolean | null
          order_id: string | null
          payment_method: string | null
          relay_address: string | null
          relay_city: string | null
          relay_country: string | null
          relay_id: string | null
          relay_name: string | null
          relay_zipcode: string | null
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
          delivery_address: string | null
          delivery_city: string | null
          delivery_country: string | null
          delivery_name: string | null
          delivery_zip: string | null
          detailed_items: Json | null
          discount_amount: number | null
          is_guest_order: boolean | null
          is_relay_delivery: boolean | null
          order_id: string | null
          order_number: string | null
          payment_method: string | null
          profile_info: Json | null
          relay_address: string | null
          relay_city: string | null
          relay_country: string | null
          relay_id: string | null
          relay_name: string | null
          relay_zipcode: string | null
          shipped_at: string | null
          shipping_address: string | null
          shipping_city: string | null
          shipping_cost: number | null
          shipping_country: string | null
          shipping_email: string | null
          shipping_name: string | null
          shipping_zip: string | null
          status: Database["public"]["Enums"]["order_status"] | null
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
          delivery_city: string | null
          emails_count: number | null
          is_guest_order: boolean | null
          is_relay_delivery: boolean | null
          order_id: string | null
          order_number: string | null
          payment_method: string | null
          relay_id: string | null
          relay_name: string | null
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
      product_reviews_summary: {
        Row: {
          average_rating: number | null
          avg_purity: number | null
          avg_quality: number | null
          avg_shipping: number | null
          avg_value: number | null
          five_star_count: number | null
          four_star_count: number | null
          one_star_count: number | null
          product_id: string | null
          review_count: number | null
          three_star_count: number | null
          two_star_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      promo_codes_admin: {
        Row: {
          active: boolean | null
          code: string | null
          code_type: string | null
          created_at: string | null
          current_uses: number | null
          description: string | null
          discount_type: string | null
          discount_value: number | null
          id: string | null
          last_used_at: string | null
          max_discount_amount: number | null
          max_uses: number | null
          max_uses_per_user: number | null
          min_order_amount: number | null
          total_discount_given: number | null
          total_uses: number | null
          updated_at: string | null
          valid_from: string | null
          valid_until: string | null
        }
        Relationships: []
      }
      sessions_by_country: {
        Row: {
          country: string | null
          country_code: string | null
          orders: number | null
          total_sessions: number | null
          unique_users: number | null
        }
        Relationships: []
      }
      sessions_by_day: {
        Row: {
          anonymous_sessions: number | null
          authenticated_users: number | null
          conversions: number | null
          day: string | null
          total_sessions: number | null
          unique_countries: number | null
        }
        Relationships: []
      }
      sessions_stats: {
        Row: {
          anonymous_sessions: number | null
          authenticated_sessions: number | null
          authenticated_users: number | null
          avg_duration_seconds: number | null
          avg_pages_viewed: number | null
          desktop_sessions: number | null
          mobile_sessions: number | null
          sessions_24h: number | null
          sessions_30d: number | null
          sessions_7d: number | null
          sessions_with_cart: number | null
          sessions_with_checkout: number | null
          sessions_with_order: number | null
          tablet_sessions: number | null
          total_sessions: number | null
          unique_sessions: number | null
          users_24h: number | null
          users_30d: number | null
          users_7d: number | null
        }
        Relationships: []
      }
      user_cart_view: {
        Row: {
          applied_discount_percent: number | null
          cart_item_id: string | null
          category_i18n: Json | null
          is_on_sale: boolean | null
          name_i18n: Json | null
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
      apply_promo_code: {
        Args: {
          p_discount_applied: number
          p_order_id: string
          p_promo_code_id: string
          p_user_email: string
          p_user_id: string
        }
        Returns: boolean
      }
      check_loyalty_reward: {
        Args: { p_user_email: string; p_user_id: string }
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
      confirm_newsletter_subscription: {
        Args: { p_token: string }
        Returns: Json
      }
      create_cart_abandonment_promo: {
        Args: { p_cart_value?: number; p_user_email: string; p_user_id: string }
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
          p_promo_code_id?: string
          p_promo_code_snapshot?: string
          p_relay_address?: string
          p_relay_city?: string
          p_relay_country?: string
          p_relay_id?: string
          p_relay_name?: string
          p_relay_zipcode?: string
          p_shipping_cost: number
          p_subtotal: number
          p_tax_amount: number
          p_total_amount: number
          p_user_id: string
          p_zip: string
        }
        Returns: Json
      }
      create_welcome_promo: {
        Args: { p_user_email: string; p_user_id: string }
        Returns: Json
      }
      end_session: { Args: { p_session_id: string }; Returns: Json }
      find_abandoned_carts: {
        Args: { p_cutoff_time: string; p_min_value?: number }
        Returns: {
          cart_total: number
          email: string
          items_count: number
          last_activity: string
          user_id: string
        }[]
      }
      generate_unique_promo_code: {
        Args: { p_prefix?: string }
        Returns: string
      }
      get_guest_order_by_token: {
        Args: { p_tracking_token: string }
        Returns: Json
      }
      get_guest_order_details: {
        Args: { p_email: string; p_order_number: string }
        Returns: Json
      }
      get_order_by_stripe_session: {
        Args: { p_session_id: string }
        Returns: Json
      }
      get_order_summary_public: { Args: { p_order_id: string }; Returns: Json }
      is_admin:
        | { Args: { uid: string }; Returns: boolean }
        | { Args: never; Returns: boolean }
      jwt_custom_claims: { Args: never; Returns: Json }
      remove_order_relay: { Args: { p_order_id: string }; Returns: Json }
      subscribe_to_newsletter: {
        Args: {
          p_email: string
          p_first_name?: string
          p_locale?: string
          p_preferences?: Json
          p_source?: string
        }
        Returns: Json
      }
      track_session: {
        Args: {
          p_browser?: string
          p_city?: string
          p_country?: string
          p_country_code?: string
          p_device_type?: string
          p_ip_address?: string
          p_landing_page?: string
          p_os?: string
          p_referrer?: string
          p_region?: string
          p_session_id: string
          p_session_type?: string
          p_user_agent?: string
          p_user_id?: string
        }
        Returns: Json
      }
      unsubscribe_from_newsletter: {
        Args: { p_email: string; p_reason?: string }
        Returns: Json
      }
      update_order_relay: {
        Args: {
          p_order_id: string
          p_relay_address: string
          p_relay_city: string
          p_relay_country?: string
          p_relay_id: string
          p_relay_name: string
          p_relay_zipcode: string
        }
        Returns: Json
      }
      update_session_activity: {
        Args: {
          p_added_to_cart?: boolean
          p_completed_order?: boolean
          p_pages_viewed?: number
          p_session_id: string
          p_started_checkout?: boolean
        }
        Returns: Json
      }
      user_exists_by_email: { Args: { p_email: string }; Returns: boolean }
      validate_promo_code: {
        Args: {
          p_code: string
          p_subtotal: number
          p_user_email?: string
          p_user_id?: string
        }
        Returns: Json
      }
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
