-- ============================================================
-- MIGRATION V6.2 — USER SESSIONS TRACKING (INCREMENTAL)
-- ============================================================
-- À exécuter sur une base V6.1 existante
-- ============================================================

-- 1. Ajouter colonnes sur profiles (si pas déjà présentes)
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS last_login_at timestamptz,
ADD COLUMN IF NOT EXISTS login_count integer DEFAULT 0;

-- 2. Table user_sessions
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  session_id text NOT NULL,
  session_type text NOT NULL CHECK (session_type IN ('authenticated', 'anonymous', 'guest_checkout')),
  user_agent text,
  ip_address text,
  device_type text CHECK (device_type IN ('desktop', 'tablet', 'mobile', 'unknown')),
  browser text,
  os text,
  country text,
  country_code text,
  city text,
  region text,
  landing_page text,
  referrer text,
  started_at timestamptz DEFAULT now(),
  last_activity_at timestamptz DEFAULT now(),
  ended_at timestamptz,
  duration_seconds integer GENERATED ALWAYS AS (
    CASE
      WHEN ended_at IS NOT NULL THEN EXTRACT(EPOCH FROM (ended_at - started_at))::integer
      ELSE EXTRACT(EPOCH FROM (last_activity_at - started_at))::integer
    END
  ) STORED,
  pages_viewed integer DEFAULT 1,
  added_to_cart boolean DEFAULT false,
  started_checkout boolean DEFAULT false,
  completed_order boolean DEFAULT false,
  metadata jsonb DEFAULT '{}'::jsonb
);

-- 3. Index
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON public.user_sessions (user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_user_sessions_session_id ON public.user_sessions (session_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_started_at ON public.user_sessions (started_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_sessions_type ON public.user_sessions (session_type);
CREATE INDEX IF NOT EXISTS idx_user_sessions_country ON public.user_sessions (country_code);

-- 4. RLS
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin full user_sessions" ON public.user_sessions;
CREATE POLICY "Admin full user_sessions" ON public.user_sessions
  FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Users view own sessions" ON public.user_sessions;
CREATE POLICY "Users view own sessions" ON public.user_sessions
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Public insert sessions" ON public.user_sessions;
CREATE POLICY "Public insert sessions" ON public.user_sessions
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Public update own sessions" ON public.user_sessions;
CREATE POLICY "Public update own sessions" ON public.user_sessions
  FOR UPDATE TO anon, authenticated
  USING (session_id IS NOT NULL);

-- 5. Vues
CREATE OR REPLACE VIEW public.sessions_stats AS
SELECT
  COUNT(*) AS total_sessions,
  COUNT(DISTINCT session_id) AS unique_sessions,
  COUNT(DISTINCT user_id) FILTER (WHERE user_id IS NOT NULL) AS authenticated_users,
  COUNT(*) FILTER (WHERE session_type = 'anonymous') AS anonymous_sessions,
  COUNT(*) FILTER (WHERE session_type = 'authenticated') AS authenticated_sessions,
  COUNT(*) FILTER (WHERE started_at > now() - interval '24 hours') AS sessions_24h,
  COUNT(DISTINCT user_id) FILTER (WHERE started_at > now() - interval '24 hours' AND user_id IS NOT NULL) AS users_24h,
  COUNT(*) FILTER (WHERE started_at > now() - interval '7 days') AS sessions_7d,
  COUNT(DISTINCT user_id) FILTER (WHERE started_at > now() - interval '7 days' AND user_id IS NOT NULL) AS users_7d,
  COUNT(*) FILTER (WHERE started_at > now() - interval '30 days') AS sessions_30d,
  COUNT(DISTINCT user_id) FILTER (WHERE started_at > now() - interval '30 days' AND user_id IS NOT NULL) AS users_30d,
  COUNT(*) FILTER (WHERE added_to_cart = true) AS sessions_with_cart,
  COUNT(*) FILTER (WHERE started_checkout = true) AS sessions_with_checkout,
  COUNT(*) FILTER (WHERE completed_order = true) AS sessions_with_order,
  AVG(duration_seconds) FILTER (WHERE duration_seconds > 0) AS avg_duration_seconds,
  AVG(pages_viewed) AS avg_pages_viewed,
  COUNT(*) FILTER (WHERE device_type = 'desktop') AS desktop_sessions,
  COUNT(*) FILTER (WHERE device_type = 'mobile') AS mobile_sessions,
  COUNT(*) FILTER (WHERE device_type = 'tablet') AS tablet_sessions
FROM public.user_sessions;

CREATE OR REPLACE VIEW public.sessions_by_day AS
SELECT
  date_trunc('day', started_at)::date AS day,
  COUNT(*) AS total_sessions,
  COUNT(DISTINCT user_id) FILTER (WHERE user_id IS NOT NULL) AS authenticated_users,
  COUNT(*) FILTER (WHERE session_type = 'anonymous') AS anonymous_sessions,
  COUNT(*) FILTER (WHERE completed_order = true) AS conversions,
  COUNT(DISTINCT country_code) AS unique_countries
FROM public.user_sessions
WHERE started_at > now() - interval '30 days'
GROUP BY date_trunc('day', started_at)::date
ORDER BY day DESC;

CREATE OR REPLACE VIEW public.sessions_by_country AS
SELECT
  COALESCE(country, 'Inconnu') AS country,
  COALESCE(country_code, 'XX') AS country_code,
  COUNT(*) AS total_sessions,
  COUNT(DISTINCT user_id) FILTER (WHERE user_id IS NOT NULL) AS unique_users,
  COUNT(*) FILTER (WHERE completed_order = true) AS orders
FROM public.user_sessions
WHERE started_at > now() - interval '30 days'
GROUP BY country, country_code
ORDER BY total_sessions DESC
LIMIT 20;

GRANT SELECT ON public.sessions_stats TO authenticated;
GRANT SELECT ON public.sessions_by_day TO authenticated;
GRANT SELECT ON public.sessions_by_country TO authenticated;

-- 6. Fonctions RPC
CREATE OR REPLACE FUNCTION public.track_session(
  p_session_id text,
  p_user_id uuid DEFAULT NULL,
  p_session_type text DEFAULT 'anonymous',
  p_user_agent text DEFAULT NULL,
  p_ip_address text DEFAULT NULL,
  p_device_type text DEFAULT 'unknown',
  p_browser text DEFAULT NULL,
  p_os text DEFAULT NULL,
  p_country text DEFAULT NULL,
  p_country_code text DEFAULT NULL,
  p_city text DEFAULT NULL,
  p_region text DEFAULT NULL,
  p_landing_page text DEFAULT NULL,
  p_referrer text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_session_id uuid;
  v_existing_session uuid;
BEGIN
  SELECT id INTO v_existing_session
  FROM public.user_sessions
  WHERE session_id = p_session_id
    AND started_at > now() - interval '24 hours'
  LIMIT 1;

  IF v_existing_session IS NOT NULL THEN
    UPDATE public.user_sessions
    SET
      last_activity_at = now(),
      user_id = COALESCE(p_user_id, user_id),
      session_type = CASE
        WHEN p_user_id IS NOT NULL THEN 'authenticated'
        ELSE session_type
      END
    WHERE id = v_existing_session;

    RETURN jsonb_build_object(
      'success', true,
      'session_id', v_existing_session,
      'is_new', false
    );
  END IF;

  INSERT INTO public.user_sessions (
    session_id, user_id, session_type,
    user_agent, ip_address, device_type, browser, os,
    country, country_code, city, region,
    landing_page, referrer
  )
  VALUES (
    p_session_id, p_user_id, p_session_type,
    p_user_agent, p_ip_address, p_device_type, p_browser, p_os,
    p_country, p_country_code, p_city, p_region,
    p_landing_page, p_referrer
  )
  RETURNING id INTO v_session_id;

  IF p_user_id IS NOT NULL THEN
    UPDATE public.profiles
    SET
      last_login_at = now(),
      login_count = COALESCE(login_count, 0) + 1
    WHERE id = p_user_id;
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'session_id', v_session_id,
    'is_new', true
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.track_session TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.update_session_activity(
  p_session_id text,
  p_pages_viewed integer DEFAULT NULL,
  p_added_to_cart boolean DEFAULT NULL,
  p_started_checkout boolean DEFAULT NULL,
  p_completed_order boolean DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.user_sessions
  SET
    last_activity_at = now(),
    pages_viewed = COALESCE(p_pages_viewed, pages_viewed),
    added_to_cart = COALESCE(p_added_to_cart, added_to_cart),
    started_checkout = COALESCE(p_started_checkout, started_checkout),
    completed_order = COALESCE(p_completed_order, completed_order)
  WHERE session_id = p_session_id
    AND started_at > now() - interval '24 hours';

  RETURN jsonb_build_object('success', true);
END;
$$;

GRANT EXECUTE ON FUNCTION public.update_session_activity TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.end_session(p_session_id text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.user_sessions
  SET ended_at = now()
  WHERE session_id = p_session_id
    AND ended_at IS NULL;

  RETURN jsonb_build_object('success', true);
END;
$$;

GRANT EXECUTE ON FUNCTION public.end_session TO anon, authenticated;

-- FIN MIGRATION V6.2
