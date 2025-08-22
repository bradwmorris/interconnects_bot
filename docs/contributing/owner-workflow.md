# Project Owner Workflow Guide

**For**: Bradley Morris (Project Owner)  
**Scenario**: Making changes to your own project with Claude AI assistance

## 🎯 Your Personal Development Workflow

As the project owner, you have **two workflow options** depending on the type of change:

### **Option A: Direct Workflow** (Simple Changes)
*For small fixes, documentation updates, minor features*

```bash
# 1. Stay on main branch or create feature branch
git checkout main
# OR: git checkout -b feature/small-improvement

# 2. Work with Claude to make changes
# Claude will help edit files, test, etc.

# 3. Commit directly to main (you own it!)
git add .
git commit -m "Add search performance improvements

- Optimize vector similarity threshold
- Add query result caching
- Improve response time by ~200ms

🤖 Co-developed with Claude AI assistance"

# 4. Push directly 
git push origin main
```

### **Option B: Branch Workflow** (Complex Changes)  
*For major features, refactoring, or when you want to test thoroughly*

```bash
# 1. Create descriptive feature branch
git checkout -b feature/add-user-authentication

# 2. Work with Claude on the feature
# Document the session in /docs/YYYY_MM_DD/sessions/

# 3. Commit progress as you go
git add .
git commit -m "Implement JWT authentication middleware

- Add auth middleware for protected routes
- Create user context and hooks
- Add login/logout components

Co-developed with Claude AI - see docs/2025_08_22/sessions/auth-implementation.md"

# 4. When complete, merge to main
git checkout main
git merge feature/add-user-authentication
git push origin main

# 5. Clean up feature branch
git branch -d feature/add-user-authentication
```

## 🤖 Working with Claude AI

### **Start Each Session**
```bash
# 1. Create or switch to your working branch
git checkout -b feature/your-feature-name

# 2. Tell Claude your goal
"I want to add user authentication to the app"

# 3. Let Claude help plan and implement
# Claude will read CLAUDE.md and understand your project
```

### **Document Your Sessions** (For Complex Work)
Create session files in `/docs/YYYY_MM_DD/sessions/` like:
- `user-authentication-implementation.md`
- `search-performance-optimization.md` 
- `ui-redesign-session.md`

### **Commit with AI Attribution**
```bash
git commit -m "Your change description

Key improvements:
- Thing 1 you built
- Thing 2 you added  
- Thing 3 you fixed

🤖 Co-developed with Claude AI assistance"
```

## 📝 When Should You Use Each Workflow?

### **Direct to Main** ✅ Use For:
- Bug fixes (1-2 files changed)
- Documentation updates
- Small UI tweaks
- Content additions (new blog posts)
- Configuration changes

### **Feature Branch** ✅ Use For:
- New features (authentication, search improvements)
- Major refactoring
- Database schema changes  
- Complex multi-file changes
- Anything you want to test thoroughly first

## 🔄 Your Typical Development Cycle

### **Daily Development**
```bash
# Morning: Check what you want to work on
git status
git checkout main
git pull  # Always start clean

# Work with Claude on your improvement
git checkout -b feature/improve-chat-interface

# [Work happens with Claude...]

# End of session: Commit progress
git add .
git commit -m "Improve chat interface with loading states

🤖 Session documented in docs/2025_08_22/sessions/chat-improvements.md"

# If complete: merge to main
git checkout main  
git merge feature/improve-chat-interface
git push origin main
```

### **Weekly Cleanup**
```bash
# Clean up old feature branches
git branch -d feature/completed-feature-name

# Review what you've built
git log --oneline -10

# Update documentation if needed
```

## 🎯 Special Scenarios

### **When External Contributors Join**
Once you have external contributors, you'll set up:
- Branch protection on `main` 
- Required PR reviews
- Then **you follow the same PR process as contributors**

But for now, as sole owner: **you can push directly to main** or use feature branches as you prefer.

### **Experimental Features**
```bash
# Create experimental branch
git checkout -b experiment/new-ai-model

# Work with Claude, try things out
# If it works: merge to main
# If it doesn't: just delete the branch
git branch -D experiment/new-ai-model
```

### **Hotfixes for Production**
```bash
# If something breaks in production
git checkout -b hotfix/fix-critical-search-bug

# Quick fix with Claude
git commit -m "Fix critical search timeout bug

🤖 Urgent fix with Claude AI assistance"

# Deploy immediately
git checkout main
git merge hotfix/fix-critical-search-bug
git push origin main
```

## 📚 Key Differences from External Contributors

| **You (Owner)** | **External Contributors** |
|-----------------|---------------------------|
| Can push directly to main | Must use PRs |
| Can merge your own branches | Need code review |
| Can change project structure | Follow established patterns |
| Set your own workflow pace | Follow project conventions |
| Document when you want to | Must document changes |

## 🚀 Quick Reference Commands

### **Start New Work**
```bash
git checkout main && git pull
git checkout -b feature/your-feature-name
```

### **Save Progress**
```bash
git add . && git commit -m "Work in progress on feature X"
```

### **Complete Feature**
```bash
git checkout main
git merge feature/your-feature-name
git push origin main
git branch -d feature/your-feature-name
```

### **Check What You've Done**
```bash
git log --oneline -5  # Recent commits
git branch  # See all branches
```

## 💡 Pro Tips for You as Owner

1. **Use descriptive branch names** - helps Claude understand context
2. **Commit frequently** - easier to track what Claude helped with
3. **Document complex sessions** - you'll thank yourself later  
4. **Test before merging** - `npm run dev` and test functionality
5. **Keep main branch clean** - it's what people see when they visit your repo

## 🎯 Bottom Line for You

**You have the freedom to work however you want on your own project!**

- Small changes? Push directly to main.
- Big features? Use feature branches.
- Working with Claude? Document the cool stuff you built together.
- Want to experiment? Create experiment branches.

The structure is there to **help you stay organized**, not to constrain you. Use what makes sense for each situation!