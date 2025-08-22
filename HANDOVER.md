# Interconnects Bot - Project Handover Document

## Project Overview

This is a simplified open-source tool for ingesting Interconnects AI blog content (https://www.interconnects.ai/) into Supabase and creating a chat-based querying interface. The project was extracted from the user's existing complex KMS system at `/Users/bradleymorris/Desktop/dev/kms_v1/app` to create a minimal MVP focused specifically on Interconnects blog content.

## Current State (WORKING ✅)

The application is **fully functional** with:
- ✅ **Content ingestion**: Python script processes markdown blogs with semantic chunking
- ✅ **Vector search**: OpenAI embeddings with cosine similarity 
- ✅ **Chat interface**: AI SDK v5 with streaming responses
- ✅ **Retrieval system**: Context injection from relevant blog chunks
- ✅ **Clean IDE design**: Modern editor-style UI with proper spacing

## Project Structure

```
/Users/bradleymorris/Desktop/dev/interconnects_bot/
├── app/                          # Next.js 14+ App Router
│   ├── app/
│   │   ├── page.tsx             # Main layout (sidebar + chat)
│   │   └── api/chat/route.ts    # Chat API with retrieval
│   ├── components/
│   │   ├── BlogList.tsx         # File explorer sidebar
│   │   └── ChatInterface.tsx    # Chat interface with streaming
│   └── lib/
│       └── supabase.ts          # Supabase client
├── scripts/
│   └── ingest_blogs.py          # Content ingestion script
└── sample_content/
    └── great_inflection.md      # Sample blog content
```

## Technical Architecture

### Frontend Stack
- **Next.js 14+** with App Router
- **AI SDK v5** (`@ai-sdk/react`) with `useChat` hook
- **Tailwind CSS** for styling
- **Supabase** for database and vector storage
- **TypeScript** throughout

### Backend/APIs
- **Next.js API Routes** (`/api/chat/route.ts`)
- **OpenAI GPT-4o** for chat responses
- **OpenAI text-embedding-3-small** for embeddings
- **Supabase** as vector database

### Data Pipeline
- **Python ingestion** with LangChain semantic chunking
- **Markdown processing** for blog content
- **Vector embeddings** stored as JSON strings in Supabase

## Database Schema

**Supabase Table**: `interconnects_bot`
```sql
CREATE TABLE interconnects_bot (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  embedding JSONB,  -- Stored as JSON string, parsed in API
  metadata JSONB,   -- {title, author, date, url}
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Key Implementation Details

### 1. Embedding Storage & Retrieval
**Critical Issue Resolved**: Embeddings are stored as JSON strings but the similarity function expects arrays.

**Solution in `/app/api/chat/route.ts`**:
```typescript
// Parse embedding from string to array if needed
let chunkEmbedding = chunk.embedding;
if (typeof chunkEmbedding === 'string') {
  try {
    chunkEmbedding = JSON.parse(chunkEmbedding);
  } catch (e) {
    console.error('❌ Failed to parse embedding for chunk:', chunk.id);
    return { ...chunk, similarity: 0 };
  }
}
```

### 2. AI SDK v5 Integration
**Working Pattern**:
```typescript
// ChatInterface.tsx
const { messages, sendMessage } = useChat();

// API route.ts
return streamText({
  model: openai('gpt-4o'),
  system: `${context}`,
  messages: convertToModelMessages(messages),
}).toUIMessageStreamResponse();
```

### 3. Similarity Search
- **Cosine similarity** calculation in JavaScript
- **Threshold**: 0.3 (lowered from 0.7 to capture relevant results)
- **Top results**: 5 chunks maximum per query

## Current UI Design

**Clean IDE-Style Interface**:
- **Left Sidebar**: File explorer with article list, proper icons, spacing
- **Main Panel**: Code editor style with line numbers, syntax highlighting
- **Command Input**: Terminal-style input with `> query $` prompt
- **Status Bar**: IDE information display
- **Spacing**: Generous margins/padding throughout (px-6/px-8, py-4/py-6)

## Environment Setup

**Required Environment Variables** (`.env.local`):
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=your_openai_api_key
```

## Content Ingestion Process

**Script**: `/scripts/ingest_blogs.py`
1. Reads markdown files from specified directory
2. Uses LangChain's semantic text splitter
3. Generates OpenAI embeddings for each chunk
4. Stores in Supabase with metadata

**Usage**:
```bash
cd scripts
python ingest_blogs.py
```

## Major Issues Resolved

### 1. **AI SDK Streaming Issues**
- **Problem**: Multiple failed attempts with different response methods
- **Solution**: Used correct AI SDK v5 pattern with `toUIMessageStreamResponse()`

### 2. **Embedding Format Mismatch**
- **Problem**: Embeddings stored as strings, similarity function expected arrays
- **Solution**: Added JSON.parse() in similarity calculation

### 3. **Message Format Incompatibility**
- **Problem**: `UIMessage[]` vs `ModelMessage[]` mismatch
- **Solution**: Used `convertToModelMessages()` helper

### 4. **UI Layout Issues**
- **Problem**: Explorer text cutoff, poor spacing
- **Solution**: Added proper margins, padding, simplified layout

### 5. **Retrieval Threshold**
- **Problem**: 0.7 threshold too high, no results returned
- **Solution**: Lowered to 0.3, now returns relevant results

## Development Commands

```bash
# Start development server
npm run dev

# Run content ingestion
cd scripts && python ingest_blogs.py

# Install dependencies
npm install
```

## Testing Retrieval

**Test Query**: "What is the great inflection?"
**Expected**: Should return relevant content from the blog with similarity ~0.49

**Debug Logs** (working correctly):
```
🔍 User query extracted: "What is the great inflection?"
✅ Generated embedding, dimensions: 1536
📦 Retrieved chunks from DB: 6
🔍 First embedding type: string
🎯 Top similarities before filtering: [ 0.4875, 0.3817, 0.3685 ]
✅ Results after 0.3 threshold: 3
📊 Search results found: 3
📝 Context built, length: 2684
```

## Known Working Features

1. ✅ **Content Ingestion**: Python script successfully processes and stores blog content
2. ✅ **Vector Search**: Embeddings properly parsed and similarity calculated
3. ✅ **Chat Streaming**: AI SDK v5 streaming responses work correctly
4. ✅ **Context Injection**: Retrieved content included in AI responses
5. ✅ **UI/UX**: Clean IDE-style interface with proper spacing
6. ✅ **Blog List**: Dynamic article listing from database
7. ✅ **Error Handling**: Graceful handling of parsing errors

## Next Steps / Potential Improvements

1. **Add more blog content** via ingestion script
2. **Implement file selection** to query specific articles
3. **Add search filtering** by date, author, etc.
4. **Improve chunking strategy** for better retrieval
5. **Add citation/source links** in responses
6. **Optimize embedding storage** (consider vector extension)

## Important Notes for Next Session

- **Server runs on port 3001** (3000 is occupied)
- **Restart command**: `npm run dev`
- **All retrieval functionality is working** - embeddings parse correctly
- **UI is polished** - clean IDE-style design with proper spacing
- **Sample content exists** in `/sample_content/great_inflection.md`
- **Database has content** - at least 1 blog article indexed

## File Locations for Quick Reference

- **Main layout**: `/app/app/page.tsx`
- **Chat API**: `/app/app/api/chat/route.ts`
- **Chat UI**: `/app/components/ChatInterface.tsx`
- **Sidebar**: `/app/components/BlogList.tsx`
- **Ingestion**: `/scripts/ingest_blogs.py`
- **Environment**: `/app/.env.local`

The project is in a **fully working state** and ready for further development or content expansion.