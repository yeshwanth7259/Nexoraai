-- NEXORA AI — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Paste → Run

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (synced with auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL DEFAULT '',
  email       TEXT UNIQUE NOT NULL,
  role        TEXT NOT NULL DEFAULT 'member',
  plan        TEXT NOT NULL DEFAULT 'free',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Chats table
CREATE TABLE IF NOT EXISTS public.chats (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL DEFAULT 'New Chat',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chat_id       UUID NOT NULL REFERENCES public.chats(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role          TEXT NOT NULL CHECK (role IN ('user','assistant')),
  content       TEXT NOT NULL,
  web_searched  BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Subscribers table
CREATE TABLE IF NOT EXISTS public.subscribers (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email      TEXT UNIQUE NOT NULL,
  name       TEXT,
  plan       TEXT DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_chats_user    ON public.chats(user_id);
CREATE INDEX IF NOT EXISTS idx_chats_updated ON public.chats(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_msgs_chat     ON public.messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_msgs_created  ON public.messages(created_at);

-- Row Level Security
ALTER TABLE public.users    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chats    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Own profile read"   ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Own profile update" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Chats policies
CREATE POLICY "Own chats read"   ON public.chats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Own chats insert" ON public.chats FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Own chats update" ON public.chats FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Own chats delete" ON public.chats FOR DELETE USING (auth.uid() = user_id);

-- Messages policies
CREATE POLICY "Own messages read"   ON public.messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Own messages insert" ON public.messages FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Auto-create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role, plan_type)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email,'@',1)), 
    'member', 
    'basic'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER chats_updated_at BEFORE UPDATE ON public.chats FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();
CREATE TRIGGER users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

-- Verify setup
SELECT 'Schema created successfully!' AS status;

-- Extend public.users table with plan details
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS plan_type TEXT DEFAULT 'basic', -- 'basic', 'pro', 'ultra_pro'
ADD COLUMN IF NOT EXISTS billing_cycle TEXT DEFAULT 'monthly', -- 'monthly', 'yearly'
ADD COLUMN IF NOT EXISTS subscription_end TIMESTAMPTZ;

-- Projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  type        TEXT NOT NULL DEFAULT 'Website',
  progress    INTEGER DEFAULT 0,
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  due_date    TEXT NOT NULL,
  completed   BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Metrics table (or we can just calculate them, but for now we can store a snapshot)
CREATE TABLE IF NOT EXISTS public.user_metrics (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID UNIQUE NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  seo_traffic     INTEGER DEFAULT 0,
  traffic_growth  INTEGER DEFAULT 0,
  active_leads    INTEGER DEFAULT 0,
  leads_growth    INTEGER DEFAULT 0,
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_projects_user ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user ON public.tasks(user_id);

-- RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY ""Own projects read"" ON public.projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY ""Own projects insert"" ON public.projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY ""Own projects update"" ON public.projects FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY ""Own tasks read"" ON public.tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY ""Own tasks insert"" ON public.tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY ""Own tasks update"" ON public.tasks FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY ""Own metrics read"" ON public.user_metrics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY ""Own metrics insert"" ON public.user_metrics FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY ""Own metrics update"" ON public.user_metrics FOR UPDATE USING (auth.uid() = user_id);

-- Auto-update updated_at for projects and metrics
CREATE TRIGGER projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();
CREATE TRIGGER metrics_updated_at BEFORE UPDATE ON public.user_metrics FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();

