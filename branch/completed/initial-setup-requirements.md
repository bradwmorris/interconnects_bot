# Simplified PRD: Interconnects Bot

## Overview
A minimal tool to embed Interconnects blog posts and query them via a chat interface. No complex ingestion UI - just a Python script for processing and a clean Next.js chat interface.

## Architecture

```
┌──────────────────────────────────┐
│     Manual Ingestion Process     │
│                                  │
│  1. Save blog as .md file        │
│  2. Run Python script            │
│  3. Chunks stored in Supabase    │
└──────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────┐
│        Supabase Database         │
│                                  │
│  Table: interconnects_bot        │
│  - id, text, embedding,          │
│    metadata, created_at          │
└──────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────┐
│       Next.js Chat UI            │
│  ┌──────────┐ ┌────────────────┐ │
│  │Blog List │ │ Chat Interface │ │
│  └──────────┘ └────────────────┘ │
└──────────────────────────────────┘
```

## Database Schema

### Single Table: interconnects_bot

```sql
CREATE TABLE interconnects_bot (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,                    -- The chunk content
    embedding vector(1536),                 -- OpenAI embedding vector
    metadata JSONB,                        -- {title, url, chunk_index, date, author}
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create index for vector similarity search
CREATE INDEX ON interconnects_bot USING ivfflat (embedding vector_cosine_ops);
```

## Component 1: Python Ingestion Script

### File Format Recommendation
**Best format: Markdown (.md) files**

Why markdown is ideal:
- Preserves structure (headers, lists, code blocks)
- Clean text extraction
- Easy to copy/paste from web
- Human-readable for review

### Script: `ingest_blogs.py`

**Features:**
- Process single or multiple markdown files
- Semantic chunking (800-1200 tokens optimal)
- Generate embeddings with OpenAI
- Store in Supabase with metadata

**Usage:**
```bash
# Single file
python ingest_blogs.py --file blogs/interconnects_post_1.md

# Multiple files
python ingest_blogs.py --folder blogs/

# With custom metadata
python ingest_blogs.py --file blog.md --title "AI Safety" --author "Author Name"
```

**Simplified Processing Flow:**
1. Read markdown file
2. Extract metadata from frontmatter (if present) or CLI args
3. Clean and prepare text
4. Create semantic chunks using LangChain
5. Generate embeddings for each chunk
6. Store in interconnects_bot table

### Markdown File Structure (Recommended)
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

## Component 2: Next.js Chat Interface

### Single Page Application

**Route: `/` (main page)**

### UI Layout
```
┌────────────────────────────────────────────────────────┐
│                 Interconnects Bot                      │
├────────────────────────────────────────────────────────┤
│ ┌──────────────────┐ ┌────────────────────────────────┐│
│ │                  │ │                                ││
│ │  Blog List       │ │     Chat Interface             ││
│ │                  │ │                                ││
│ │ ▸ Blog Post 1   │ │  ❯ What are the main themes?  ││
│ │ ▸ Blog Post 2   │ │                                ││
│ │ ▸ Blog Post 3   │ │  ◉ Based on the blogs, the    ││
│ │ ▸ Blog Post 4   │ │    main themes are...         ││
│ │                  │ │                                ││
│ │ [5 blogs total] │ │                                ││
│ │                  │ │  [Type your question...]      ││
│ └──────────────────┘ └────────────────────────────────┘│
└────────────────────────────────────────────────────────┘
```

### Features
- **Left Panel**: List of ingested blogs (from metadata)
- **Right Panel**: Chat interface
- **No focus mode**: All queries search across all blogs
- **Simple dark theme**: Based on existing KMS design

### API Routes

#### GET /api/blogs
Get list of unique blogs from metadata
```typescript
Response: {
  blogs: [
    { title: string, author: string, date: string, url: string }
  ]
}
```

#### POST /api/chat
Chat with embedded content
```typescript
Request: {
  message: string;
  sessionId?: string;  // Optional, for context within session
}

Response: Stream<{
  content: string;
}>
```

#### POST /api/search
Internal vector search endpoint (used by chat)
```typescript
Request: {
  query: string;
  limit?: number;  // Default: 5
}

Response: {
  chunks: [
    { text: string, metadata: object, similarity: number }
  ]
}
```

## Implementation Plan

### Phase 1: Ingestion Script (Day 1-2)

1. **Create project structure:**
```
interconnects_bot/
├── scripts/
│   ├── ingest_blogs.py
│   └── requirements.txt
├── blogs/               # Markdown files go here
├── app/                 # Next.js app
└── .env.local
```

2. **Simplify web_embeddings.py to:**
   - Remove web scraping logic
   - Remove PDF handling
   - Focus on markdown/text processing
   - Keep semantic chunking
   - Simplify metadata structure

3. **Test with sample blog:**
   - Save one Interconnects post as markdown
   - Run ingestion
   - Verify chunks in Supabase

### Phase 2: Chat Interface (Day 3-4)

1. **Setup Next.js project:**
   - Initialize with TypeScript
   - Add Supabase client
   - Configure OpenAI SDK

2. **Create single-page UI:**
   - Port simplified version of main-interface.tsx
   - Remove focused item logic
   - Simplify chat widget

3. **Implement chat API:**
   - Vector search across all chunks
   - Stream responses with GPT-4o-mini
   - No session persistence

### Phase 3: Testing & Polish (Day 5)

1. **Ingest 5-10 Interconnects blogs**
2. **Test query quality**
3. **Optimize chunk size if needed**
4. **Add error handling**

## Technical Stack

### Dependencies

**Python (requirements.txt):**
```
openai==1.0.0
supabase==2.0.0
python-dotenv==1.0.0
langchain==0.1.0
langchain-experimental==0.0.0
langchain-openai==0.0.0
tiktoken==0.5.0
```

**Next.js (package.json):**
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "@supabase/supabase-js": "^2.39.0",
    "@ai-sdk/react": "^0.0.0",
    "@ai-sdk/openai": "^0.0.0",
    "ai": "^3.0.0"
  }
}
```

### Environment Variables
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# OpenAI
OPENAI_API_KEY=

# Python script specific
SUPABASE_DB_PASSWORD=
```

## Simplifications from Original KMS

### Removed:
- Complex multi-table schema
- User authentication
- Focused item context
- Session persistence
- Multiple content types (only blogs)
- UI-based ingestion
- Relationship edges
- Memory system
- Tool orchestration

### Kept (Simplified):
- Semantic chunking algorithm
- Vector embeddings
- pgvector similarity search
- Chat streaming
- Dark monospace UI theme

## Success Criteria

1. **Ingestion**: Process 10 Interconnects blogs < 5 min
2. **Search Quality**: Relevant chunks retrieved for queries
3. **Response Time**: Chat responses < 2 seconds
4. **UI Simplicity**: Single page, no navigation needed
5. **Setup Time**: < 30 minutes from clone to running

## Next Steps

1. Create the ingestion script
2. Test with 1-2 blogs
3. Build the minimal UI
4. Deploy to Vercel (optional)

This simplified approach focuses purely on making Interconnects content queryable with minimal complexity.