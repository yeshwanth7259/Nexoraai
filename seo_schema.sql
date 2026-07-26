-- NEXORA SEO INTELLIGENCE TABLES
-- Run this in Supabase Dashboard -> SQL Editor to create the 11 modular tables

-- 1. seo_projects (Domains and overarching settings)
CREATE TABLE IF NOT EXISTS public.seo_projects (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  domain      TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2. seo_scans (Historical records of AI Audits)
CREATE TABLE IF NOT EXISTS public.seo_scans (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id  UUID NOT NULL REFERENCES public.seo_projects(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  score       INTEGER DEFAULT 0,
  details     JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 3. seo_keywords (Saved keywords and research data)
CREATE TABLE IF NOT EXISTS public.seo_keywords (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id  UUID NOT NULL REFERENCES public.seo_projects(id) ON DELETE CASCADE,
  keyword     TEXT NOT NULL,
  volume      INTEGER DEFAULT 0,
  difficulty  INTEGER DEFAULT 0,
  intent      TEXT DEFAULT 'informational',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 4. seo_competitors (Tracked competitor domains)
CREATE TABLE IF NOT EXISTS public.seo_competitors (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id  UUID NOT NULL REFERENCES public.seo_projects(id) ON DELETE CASCADE,
  domain      TEXT NOT NULL,
  traffic     INTEGER DEFAULT 0,
  overlap     INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 5. seo_reports (Generated PDF/client reports)
CREATE TABLE IF NOT EXISTS public.seo_reports (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id  UUID NOT NULL REFERENCES public.seo_projects(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  file_url    TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 6. seo_tasks (Auto-generated AI Fix tasks)
CREATE TABLE IF NOT EXISTS public.seo_tasks (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id  UUID NOT NULL REFERENCES public.seo_projects(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  status      TEXT DEFAULT 'pending',
  type        TEXT DEFAULT 'technical',
  ai_fix      JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 7. seo_history (Timeline of changes)
CREATE TABLE IF NOT EXISTS public.seo_history (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id  UUID NOT NULL REFERENCES public.seo_projects(id) ON DELETE CASCADE,
  event_type  TEXT NOT NULL,
  description TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 8. seo_rank_tracking (Historical SERP positions)
CREATE TABLE IF NOT EXISTS public.seo_rank_tracking (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  keyword_id  UUID NOT NULL REFERENCES public.seo_keywords(id) ON DELETE CASCADE,
  position    INTEGER,
  url         TEXT,
  date        DATE DEFAULT CURRENT_DATE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 9. seo_site_health (Technical health breakdowns)
CREATE TABLE IF NOT EXISTS public.seo_site_health (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scan_id     UUID NOT NULL REFERENCES public.seo_scans(id) ON DELETE CASCADE,
  metric      TEXT NOT NULL,
  status      TEXT DEFAULT 'pass',
  details     TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 10. seo_backlinks (Backlink data)
CREATE TABLE IF NOT EXISTS public.seo_backlinks (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id  UUID NOT NULL REFERENCES public.seo_projects(id) ON DELETE CASCADE,
  source_url  TEXT NOT NULL,
  target_url  TEXT NOT NULL,
  anchor      TEXT,
  is_dofollow BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 11. seo_content_analysis (Content Optimizer drafts)
CREATE TABLE IF NOT EXISTS public.seo_content_analysis (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id  UUID NOT NULL REFERENCES public.seo_projects(id) ON DELETE CASCADE,
  keyword_id  UUID REFERENCES public.seo_keywords(id) ON DELETE SET NULL,
  content     TEXT,
  score       INTEGER DEFAULT 0,
  suggestions JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for SEO tables
CREATE INDEX IF NOT EXISTS idx_seo_projects_user ON public.seo_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_seo_scans_project ON public.seo_scans(project_id);
CREATE INDEX IF NOT EXISTS idx_seo_keywords_project ON public.seo_keywords(project_id);
CREATE INDEX IF NOT EXISTS idx_seo_tasks_project ON public.seo_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_seo_rank_keyword ON public.seo_rank_tracking(keyword_id);

-- RLS for SEO tables
ALTER TABLE public.seo_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own seo projects read" ON public.seo_projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Own seo projects insert" ON public.seo_projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Own seo projects update" ON public.seo_projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Own seo projects delete" ON public.seo_projects FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE public.seo_scans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own scans" ON public.seo_scans USING (EXISTS (SELECT 1 FROM public.seo_projects WHERE seo_projects.id = project_id AND seo_projects.user_id = auth.uid()));

ALTER TABLE public.seo_keywords ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own keywords" ON public.seo_keywords USING (EXISTS (SELECT 1 FROM public.seo_projects WHERE seo_projects.id = project_id AND seo_projects.user_id = auth.uid()));
  
ALTER TABLE public.seo_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own tasks" ON public.seo_tasks USING (EXISTS (SELECT 1 FROM public.seo_projects WHERE seo_projects.id = project_id AND seo_projects.user_id = auth.uid()));
