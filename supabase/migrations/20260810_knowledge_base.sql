-- 1. Enable the vector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Create the table to store website knowledge
CREATE TABLE IF NOT EXISTS public.knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id TEXT NOT NULL, -- To separate different clients/widgets
  url TEXT NOT NULL,
  chunk_text TEXT NOT NULL,
  -- Google Gemini's embedding model outputs 768 dimensions
  embedding vector(768), 
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create an index to make AI searches lightning fast
CREATE INDEX ON public.knowledge_base 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);
