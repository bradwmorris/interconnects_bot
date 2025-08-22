# Interconnects Bot

A minimal tool to embed and query Interconnects AI blog content using vector search and GPT-4o-mini.

## Setup

### 1. Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your credentials:

```bash
cp .env.local.example .env.local
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
- `OPENAI_API_KEY`: Your OpenAI API key

### 2. Database Setup

Create the `interconnects_bot` table in your Supabase database:

```sql
CREATE TABLE interconnects_bot (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    embedding vector(1536),
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create index for vector similarity search
CREATE INDEX ON interconnects_bot USING ivfflat (embedding vector_cosine_ops);
```

### 3. Install Dependencies

#### Python (for ingestion script)
```bash
cd scripts
pip install -r requirements.txt
```

#### Next.js (for the UI)
```bash
cd app
npm install
```

## Usage

### Step 1: Prepare Blog Content

Save Interconnects blog posts as markdown files in the `blogs/` folder. Use this format:

```markdown
---
title: "Blog Post Title"
author: "Author Name"
date: "2024-01-15"
url: "https://interconnects.ai/p/post-slug"
---

# Main Content

Blog content here...
```

### Step 2: Ingest Content

Run the ingestion script to process and embed the blogs:

```bash
# Single file
python scripts/ingest_blogs.py --file blogs/post.md

# All files in folder
python scripts/ingest_blogs.py --folder blogs/
```

### Step 3: Start the UI

```bash
cd app
npm run dev
```

Open http://localhost:3000 to use the chat interface.

## Project Structure

```
interconnects_bot/
├── scripts/
│   ├── ingest_blogs.py     # Processes markdown files
│   └── requirements.txt    # Python dependencies
├── blogs/                   # Markdown blog files
├── app/                     # Next.js application
│   ├── components/
│   │   ├── BlogList.tsx    # Left panel blog list
│   │   └── ChatInterface.tsx # Right panel chat
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/       # Chat endpoint
│   │   │   └── search/     # Vector search endpoint
│   │   └── page.tsx        # Main page
│   └── lib/
│       └── supabase.ts     # Supabase client
└── .env.local              # Environment variables
```

## Features

- **Semantic Chunking**: Intelligently splits blog content into meaningful chunks
- **Vector Search**: Uses OpenAI embeddings for semantic similarity search
- **Simple UI**: Minimal dark theme interface with blog list and chat
- **Streaming Responses**: Real-time chat responses with GPT-4o-mini

## Troubleshooting

### Vector Search Not Working

If you get an error about missing RPC function, you can either:

1. Create the RPC function in Supabase:
```sql
CREATE OR REPLACE FUNCTION match_documents(
  query_embedding vector(1536),
  match_count int DEFAULT 5,
  match_threshold float DEFAULT 0.7
)
RETURNS TABLE (
  id int,
  text text,
  metadata jsonb,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    interconnects_bot.id,
    interconnects_bot.text,
    interconnects_bot.metadata,
    1 - (interconnects_bot.embedding <=> query_embedding) as similarity
  FROM interconnects_bot
  WHERE 1 - (interconnects_bot.embedding <=> query_embedding) > match_threshold
  ORDER BY interconnects_bot.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
```

2. Or the fallback client-side similarity search will automatically be used.

### No Blogs Showing

Make sure you've:
1. Added markdown files to the `blogs/` folder
2. Run the ingestion script successfully
3. Check Supabase to verify data was inserted

## License

MIT