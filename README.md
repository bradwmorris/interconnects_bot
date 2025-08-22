# Interconnects Bot

A minimal tool to embed and query Interconnects AI blog content using vector search and GPT-4o-mini.

> **🤖 AI-Assisted Development**: This project is actively developed with Claude AI assistance. See [CONTRIBUTING.md](CONTRIBUTING.md) for workflow details.

## Setup

### 1. Environment Variables

Copy `.env.example` to `.env.local` and fill in your credentials:

```bash
cp .env.example .env.local
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

```bash
# Install Node.js dependencies (from project root)
npm install

# Set up Python environment for content ingestion
cd scripts
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ..
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
# From project root
npm run dev
```

Open http://localhost:3000 to use the chat interface.

## Project Structure

```
interconnects_bot/
├── CLAUDE.md               # AI assistant configuration
├── CONTRIBUTING.md         # Contribution guidelines
├── README.md              # This file
├── app/                   # Next.js 15 App Router
│   ├── api/
│   │   ├── chat/         # Chat API with streaming
│   │   └── search/       # Vector search endpoint
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main application page
├── components/            # React components
│   ├── BlogList.tsx      # Left sidebar blog list
│   └── ChatInterface.tsx # Main chat interface
├── docs/                 # Project documentation
│   ├── YYYY_MM_DD/       # Date-based organization
│   ├── archive/          # Historical documentation
│   ├── contributing/     # Contributor guides
│   └── deployment/       # Deployment guides
├── lib/
│   └── supabase.ts       # Supabase client configuration
├── scripts/              # Content ingestion tools
│   ├── ingest_blogs.py   # Python content processor
│   ├── requirements.txt  # Python dependencies
│   └── venv/            # Python virtual environment
├── blogs/               # Blog content (markdown files)
├── .env.local          # Environment variables (not in git)
└── .env.example        # Environment template
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

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines on:

- **Development setup** and workflow
- **Branch naming conventions** and collaboration process  
- **AI-assisted development** patterns with Claude
- **Code style** and testing guidelines
- **Pull request** process

### Quick Contributing Guide

1. **Fork and clone** the repository
2. **Create a feature branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes** with clear, atomic commits
4. **Test thoroughly** - ensure chat and search work as expected
5. **Submit a PR** with clear description

### Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server  
npm run lint     # Run ESLint
```

## License

MIT