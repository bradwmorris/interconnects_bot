# Branch: enhance-mvp-embed-retrieve

**Created:** 2025-08-22  
**Status:** In Progress  

## Objective
Enhance the MVP embed and retrieve system to use GPT-4o for creating gist summaries and extracting major themes, then integrate these into the metadata before embedding happens. Update retrieval to be theme and gist aware.

## Requirements

### 1. Enhanced Metadata Structure
Every chunk should include:
- `gist`: GPT-4o generated summary of the article
- `themes`: Array of major themes extracted by GPT-4o  
- `key_concepts`: Array of key concepts from the content

**Example metadata output:**
```json
{
  "url": "https://www.interconnects.ai/p/contra-dwarkesh-on-continual-learning",
  "date": "2025-08-15",
  "gist": "The article critiques Dwarkesh Patel's emphasis on continual learning as a bottleneck for AI progress, arguing that scaling and improving context management in AI systems will naturally lead to advancements without needing to mimic human learning processes.",
  "title": "Contra Dwarkesh on Continual Learning",
  "author": "Nathan Lambert",
  "themes": ["Continual learning", "AI progress", "Human-like reasoning", "Context management", "AI system capabilities"],
  "file_name": "contra_dwarkesh_cleaned2",
  "chunk_index": 0,
  "chunk_length": 1097,
  "key_concepts": ["continual learning", "language models", "context length", "reasoning models", "in-context learning"],
  "processed_at": "2025-08-22T13:34:23.732249"
}
```

### 2. Implementation Changes
- Use GPT-4o to analyze full article content before chunking
- Extract gist and themes that apply to entire article
- Add gist and themes to metadata for each chunk of the same article
- Update retrieval process to consider themes and gist in search

### 3. Files to Modify
- Embedding pipeline (Python ingestion system)
- Retrieval API endpoints:
  - `/Users/bradleymorris/Desktop/dev/interconnects_bot/app/api/search/route.ts`
  - `/Users/bradleymorris/Desktop/dev/interconnects_bot/app/api/chat/route.ts`

## Tasks
- [x] Analyze current embedding pipeline 
- [x] Update embedding system to use GPT-4o for gist and themes extraction
- [x] Modify metadata structure to include gist and themes before embedding
- [x] Update retrieval process to be theme and gist aware
- [ ] Test the enhanced system end-to-end

## Implementation Details

### 1. Enhanced Ingestion Pipeline (`scripts/ingest_blogs.py`)
- **New Method**: `extract_gist_and_themes()` - Uses GPT-4o to analyze full article content
- **Enhanced Workflow**: 
  1. Extract article content and frontmatter
  2. Call GPT-4o to generate gist, themes, and key concepts
  3. Add these to metadata before chunking
  4. Each chunk inherits the same gist/themes from the parent article

### 2. Enhanced Search API (`app/api/search/route.ts`)
- **Theme Scoring**: `calculateThemeScore()` - Matches query terms to article themes
- **Gist Scoring**: `calculateGistScore()` - Measures query relevance to article gist
- **Combined Scoring**: 70% vector similarity + 20% theme score + 10% gist score
- **Theme Filtering**: Optional `themeFilter` parameter for focused searches

### 3. Enhanced Chat Retrieval (`app/api/chat/route.ts`)
- **Improved Search**: Same enhanced scoring as search API
- **Better Context**: Leverages themes and gist for more relevant results
- **Debug Logging**: Enhanced logging shows all scoring components

### 4. Scoring Algorithm
```
combinedScore = (vectorSimilarity * 0.7) + (themeScore * 0.2) + (gistScore * 0.1)
```

## Notes
- Each article should have the same gist and themes across all its chunks ✅
- Retrieval should leverage themes for better semantic matching ✅
- Consider performance implications of GPT-4o calls during ingestion ⚠️
- GPT-4o calls add ~2-3 seconds per article during ingestion
- Fallback gracefully if GPT-4o fails (returns empty gist/themes)

## Testing Needed
1. Test ingestion script with new GPT-4o integration
2. Verify metadata includes gist, themes, and key_concepts
3. Test enhanced search scoring with theme-aware queries
4. Validate chat responses use enhanced context