# Developer Setup Guide

This guide will get you up and running with the Interconnects Bot development environment.

## Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.8+ with pip
- **Git** for version control
- **Supabase** account (free tier works fine)
- **OpenAI API** key

## Quick Setup Checklist

### ✅ Environment Setup
```bash
# 1. Clone the repository
git clone https://github.com/bradwmorris/interconnects_bot.git
cd interconnects_bot

# 2. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# 3. Install Node.js dependencies
npm install

# 4. Set up Python environment
cd scripts
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

### ✅ Database Setup
1. Create a new Supabase project at https://supabase.com
2. Go to SQL Editor and run this schema:

```sql
CREATE TABLE interconnects_bot (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  embedding JSONB,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for vector similarity search (if using pgvector)
CREATE INDEX ON interconnects_bot USING ivfflat (embedding vector_cosine_ops);
```

3. Get your project credentials from Settings → API
4. Add them to your `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

### ✅ Test Your Setup
```bash
# 1. Start the development server
npm run dev

# 2. Open http://localhost:3000
# You should see the chat interface

# 3. Test content ingestion (optional)
cd scripts
source venv/bin/activate
python ingest_blogs.py --file ../blogs/sample_interconnects_post.md
```

## Development Workflow

### Branch Management
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Work on your changes...

# Push and create PR
git push origin feature/your-feature-name
```

### Common Commands
```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
npm run lint     # Code linting
```

### Testing Changes
- **Chat Interface**: Test with queries like "What is the great inflection?"
- **Content Ingestion**: Add a test blog file and verify it appears in search
- **API Endpoints**: Check `/api/chat` and `/api/search` work correctly

## Project Architecture

### Frontend (Next.js 15)
- **App Router**: Modern Next.js routing in `/app`
- **Streaming AI**: Real-time chat with AI SDK v5
- **Components**: React components in `/components`

### Backend (API Routes)
- **Chat API**: `/app/api/chat/route.ts` - Handles AI conversations
- **Search API**: `/app/api/search/route.ts` - Vector similarity search
- **Supabase**: Database client in `/lib/supabase.ts`

### Content Pipeline (Python)
- **Ingestion**: `/scripts/ingest_blogs.py` processes markdown files
- **Chunking**: Uses LangChain for semantic text splitting
- **Embeddings**: OpenAI embeddings stored as JSONB

## AI-Assisted Development

This project embraces AI assistance with Claude:

### Claude Integration
- **CLAUDE.md**: Project context for AI assistance
- **Session Docs**: AI collaboration logged in `/docs/`
- **Branch Naming**: Use descriptive names like `feature/add-authentication`

### Working with Claude
1. Read `CLAUDE.md` for project context
2. Use descriptive branch names
3. Document significant AI assistance in commits
4. Keep session notes for complex features

## Troubleshooting

### Common Issues

**"Module not found" errors**: Run `npm install` from project root

**Python import errors**: Ensure virtual environment is activated:
```bash
cd scripts
source venv/bin/activate  # Windows: venv\Scripts\activate
```

**Vector search not working**: Either set up the Supabase RPC function (see README) or use the fallback client-side search

**Environment variables**: Double-check your `.env.local` file has all required keys

**Build errors**: Ensure TypeScript types are correct and all imports resolve

### Getting Help
- **Documentation**: Check `/docs/` for guides
- **Issues**: Create GitHub issues for bugs
- **Discussions**: Use GitHub Discussions for questions

## Next Steps

After setup is complete:

1. **Read** the main [CONTRIBUTING.md](../../CONTRIBUTING.md) for full guidelines
2. **Explore** the codebase - start with `/app/page.tsx` and `/components/ChatInterface.tsx`
3. **Test** adding a new blog post to understand the content pipeline
4. **Make** a small improvement to get familiar with the workflow
5. **Join** discussions about new features and improvements

Happy coding! 🚀