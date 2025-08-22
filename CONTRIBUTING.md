# Contributing to Interconnects Bot

Welcome to the Interconnects Bot project! This guide will help you get started with contributing to our AI-powered blog content retrieval and chat system.

## 🚀 Quick Start for New Contributors

### Prerequisites
- **Node.js** 18+ and npm
- **Python** 3.8+ with pip
- **Supabase** account (for database)
- **OpenAI API** key

### Initial Setup

1. **Clone and setup environment:**
   ```bash
   git clone https://github.com/bradwmorris/interconnects_bot.git
   cd interconnects_bot
   
   # Copy environment template
   cp .env.example .env.local
   # Fill in your API keys in .env.local
   ```

2. **Install dependencies:**
   ```bash
   # Frontend dependencies
   npm install
   
   # Python dependencies for content ingestion
   cd scripts
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   cd ..
   ```

3. **Database setup:**
   - Create a Supabase project
   - Run the SQL schema from README.md
   - Add your Supabase credentials to `.env.local`

4. **Test your setup:**
   ```bash
   npm run dev  # Should start on http://localhost:3000
   ```

## 🌿 Branch Workflow & Naming Convention

We use **feature-based branches** with descriptive names. Here's our 2025 standard:

### Branch Types
```bash
feature/add-user-authentication    # New features
fix/chat-response-timeout         # Bug fixes  
improvement/search-performance    # Enhancements
docs/update-api-documentation    # Documentation
refactor/cleanup-components      # Code refactoring
hotfix/security-vulnerability    # Urgent fixes
```

### Workflow
1. **Create descriptive branch**: `git checkout -b feature/your-feature-name`
2. **Make your changes** with clear, atomic commits
3. **Test thoroughly** - run dev server and test affected features
4. **Create PR** with clear description of changes
5. **Code review** - all PRs require review before merge

### Branch Protection
> **Note for Project Owner**: As the owner, you can push directly to `main` for small changes or use feature branches as you prefer. See [Owner Workflow Guide](docs/contributing/owner-workflow.md) for your personal process.

For collaborative development:
- `main` branch should be protected - no direct pushes by external contributors
- All external changes must go through Pull Requests  
- PRs require at least one review
- CI checks must pass before merge

## 🤖 AI-Assisted Development with Claude

This project is **actively developed with Claude AI assistance**. Here's how we integrate AI into our workflow:

### Claude Integration
- **CLAUDE.md**: Contains project context and instructions for AI assistance
- **Session Documentation**: AI sessions logged in `/docs/YYYY_MM_DD/sessions/`
- **AI-Friendly Code**: Code written with clear comments and structure for AI understanding

### Working with Claude
1. **Before starting**: Read `CLAUDE.md` to understand project context
2. **During development**: Document AI assistance in commit messages
3. **Complex features**: Create session notes in `/docs/` for team awareness
4. **Code reviews**: Mention if AI assistance was used (helps reviewers understand approach)

### Example AI-Assisted Commit:
```bash
git commit -m "Add user authentication system

- Implement JWT-based auth with Next.js middleware
- Add protected routes and user context
- Include proper error handling and validation

Co-developed with Claude AI assistance"
```

## 📁 Project Structure

```
interconnects_bot/
├── CLAUDE.md                 # AI assistant configuration
├── CONTRIBUTING.md           # This file
├── README.md                # Setup and usage guide
├── app/                     # Next.js 15 App Router
│   ├── api/chat/           # Chat API with AI integration
│   ├── api/search/         # Vector search endpoint
│   └── page.tsx            # Main application page
├── components/             # React components
│   ├── BlogList.tsx       # Sidebar blog list
│   └── ChatInterface.tsx  # Main chat interface
├── docs/                  # Project documentation
│   ├── YYYY_MM_DD/        # Date-based organization
│   │   ├── sessions/      # AI session logs
│   │   ├── specs/         # Requirements & specs
│   │   └── design/        # Design documents
│   ├── contributing/      # Contributor guides
│   └── deployment/        # Deployment guides
├── scripts/               # Python ingestion scripts
│   └── ingest_blogs.py   # Content processing
└── blogs/                # Blog content (markdown files)
```

## 🧪 Development Guidelines

### Code Style
- **TypeScript**: Use strict mode, proper typing
- **React**: Functional components with hooks
- **AI SDK**: Follow AI SDK v5 patterns for streaming
- **Comments**: Clear, AI-readable comments for complex logic

### Testing
- **Manual testing**: Test chat interface with various queries
- **API testing**: Verify both chat and search endpoints
- **Content ingestion**: Test with sample blog files
- **Environment**: Test with clean `.env.local` setup

### Performance
- **Streaming responses**: Maintain real-time chat experience  
- **Vector search**: Keep similarity threshold optimized (currently 0.3)
- **Bundle size**: Monitor with `npm run build`

## 🔍 Working with Content

### Adding Blog Content
1. **Format**: Use markdown with frontmatter:
   ```markdown
   ---
   title: "Blog Post Title"
   author: "Author Name" 
   date: "2024-01-15"
   url: "https://interconnects.ai/p/post-slug"
   ---
   
   # Content here...
   ```

2. **Ingestion**: Run the Python script:
   ```bash
   cd scripts
   source venv/bin/activate
   python ingest_blogs.py --file ../blogs/new-post.md
   ```

3. **Testing**: Verify content appears in chat interface

### Database Schema
The project uses Supabase with this schema:
```sql
CREATE TABLE interconnects_bot (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  embedding JSONB,  -- OpenAI embeddings as JSON
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 🚦 Pull Request Process

### Before Submitting
- [ ] Code follows project conventions
- [ ] Manual testing completed
- [ ] No hardcoded secrets or API keys
- [ ] Documentation updated if needed
- [ ] Descriptive commit messages

### PR Template
```markdown
## Summary
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature  
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Code refactoring

## Testing
- [ ] Manual testing completed
- [ ] API endpoints tested
- [ ] Content ingestion tested (if applicable)

## AI Assistance
- [ ] Claude AI was used in development
- [ ] Session documented in /docs/ (if significant)
```

## 🐛 Issue Reporting

### Bug Reports
- Use clear, descriptive titles
- Include steps to reproduce
- Provide environment details (Node.js version, OS)
- Include relevant error messages or logs

### Feature Requests  
- Describe the problem you're trying to solve
- Suggest potential implementation approach
- Consider impact on existing functionality

## 📚 Additional Resources

- **Next.js 15 Documentation**: https://nextjs.org/docs
- **AI SDK v5 Guide**: https://sdk.vercel.ai/docs
- **Supabase Documentation**: https://supabase.com/docs
- **OpenAI API Reference**: https://platform.openai.com/docs

## 🤝 Community Guidelines

- **Be respectful** and inclusive
- **Ask questions** - we're here to help
- **Document your discoveries** - helps the whole team
- **Credit AI assistance** when used
- **Focus on user value** in all contributions

## 📞 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For questions and brainstorming  
- **Documentation**: Check `/docs/` for detailed guides

---

**Happy Contributing! 🎉**

Remember: This project embraces AI-assisted development. Don't hesitate to leverage Claude or other AI tools in your workflow - just document the assistance for team transparency.