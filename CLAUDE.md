# Interconnects Bot - Claude Assistant Configuration

## Project Overview

**Project Type**: AI-powered blog content retrieval and chat system  
**Purpose**: Simplified tool for ingesting and querying Interconnects AI blog content using vector search and GPT-4o  
**Status**: Fully functional MVP with working embedding/retrieval pipeline

## Critical Context

**IMPORTANT**: This is a WORKING application. Do not break existing functionality unless explicitly requested.

**Key Features Working**:
- ✅ Content ingestion via Python script with semantic chunking
- ✅ Vector search with OpenAI embeddings 
- ✅ AI SDK v5 streaming chat with context injection
- ✅ Quote extraction functionality for precise responses
- ✅ Clean IDE-style UI with terminal aesthetics

## Technology Stack

- **Frontend**: Next.js 15.5.0 with App Router, TypeScript, AI SDK v5
- **Backend**: Next.js API routes, OpenAI GPT-4o, Supabase
- **Data**: Python ingestion with LangChain semantic chunking

## Project Structure

```
/Users/bradleymorris/Desktop/dev/interconnects_bot/
├── app/                          # Next.js App Router
│   ├── api/chat/route.ts        # Chat API with quote extraction
│   ├── page.tsx                 # Main layout
│   └── layout.tsx               # Root layout
├── components/
│   ├── BlogList.tsx             # Left sidebar
│   └── ChatInterface.tsx        # Chat interface
├── lib/supabase.ts              # Supabase client
├── scripts/ingest_blogs.py      # Content ingestion
├── blogs/                       # Blog content files
├── .env.local                   # Environment variables
└── package.json                 # Dependencies
```

## Environment Setup

**Required Variables** (`.env.local`):
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  
OPENAI_API_KEY=your_openai_api_key
```

## Development Commands

```bash
# Start development server
npm run dev

# Install dependencies
npm install

# Run content ingestion
cd scripts && source venv/bin/activate && python ingest_blogs.py
```

## Branch-Based Development

**Branch Naming**: `claude-session-YYYYMMDD-HHMMSS`

**Workflow**:
1. Each Claude session works on timestamped branch
2. Document work in `/branch/[branch-name].md` 
3. Update status as tasks complete
4. Move completed docs to `/branch/completed/`

## Critical Implementation Details

### Quote Extraction System
- Function: `extractRelevantQuotes()` in `/app/api/chat/route.ts`
- Extracts 1-2 relevant quotes per chunk based on keyword overlap
- Quotes appear as `> "sentence text"` in responses

### Vector Search
- Similarity threshold: 0.3 (for better recall)
- Top results: 5 chunks maximum per query
- Embeddings stored as JSON strings, parsed in API

### Database Schema
```sql
CREATE TABLE interconnects_bot (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  embedding JSONB,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## DO NOT Guidelines

- **DO NOT** break the working embedding parsing logic
- **DO NOT** change AI SDK v5 streaming patterns without testing
- **DO NOT** delete or modify `.env.local` without backup
- **DO NOT** remove logging in search pipeline

## Quick Reference

**Key Files**:
- Chat API: `/app/api/chat/route.ts`
- Chat UI: `/components/ChatInterface.tsx`
- Sidebar: `/components/BlogList.tsx`
- Ingestion: `/scripts/ingest_blogs.py`

**Test Query**: "What is the great inflection?" (should return relevant results with quotes)