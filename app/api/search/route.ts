import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Helper function to calculate theme overlap score
function calculateThemeScore(queryTerms: string[], themes: string[]): number {
  if (!themes || themes.length === 0) return 0;
  
  const normalizedThemes = themes.map(t => t.toLowerCase());
  const matchingTerms = queryTerms.filter(term => 
    normalizedThemes.some(theme => 
      theme.includes(term.toLowerCase()) || term.toLowerCase().includes(theme)
    )
  );
  
  return matchingTerms.length / Math.max(queryTerms.length, 1);
}

// Helper function to calculate gist relevance score
function calculateGistScore(query: string, gist: string): number {
  if (!gist) return 0;
  
  const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  const gistWords = gist.toLowerCase().split(/\s+/);
  
  const matches = queryWords.filter(qw => 
    gistWords.some(gw => gw.includes(qw) || qw.includes(gw))
  );
  
  return matches.length / Math.max(queryWords.length, 1);
}

export async function POST(req: NextRequest) {
  try {
    console.log('Search API called');
    const { query, limit = 5, themeFilter } = await req.json();
    console.log('Search query:', query);
    console.log('Theme filter:', themeFilter);

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    // Generate embedding for the query
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: query,
    });

    const queryEmbedding = embeddingResponse.data[0].embedding;

    // Perform vector similarity search
    const { data, error } = await supabase.rpc('match_documents', {
      query_embedding: queryEmbedding,
      match_count: limit * 2, // Get more results for theme filtering
      match_threshold: 0.5, // Lower threshold to get more candidates
    });

    if (error) {
      console.error('Supabase error:', error);
      // If the function doesn't exist, try a different approach
      if (error.message.includes('function') || error.message.includes('does not exist')) {
        // Fallback: Get all chunks and compute similarity client-side
        const { data: chunks, error: fetchError } = await supabase
          .from('interconnects_bot')
          .select('id, text, embedding, metadata')
          .limit(200); // Get more chunks for better theme filtering

        if (fetchError) throw fetchError;

        // Parse query for theme matching
        const queryTerms = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);

        // Compute enhanced similarity with theme and gist scoring
        const resultsWithSimilarity = chunks?.map(chunk => {
          const vectorSimilarity = cosineSimilarity(queryEmbedding, chunk.embedding);
          
          // Calculate theme overlap score
          const themeScore = calculateThemeScore(queryTerms, chunk.metadata?.themes || []);
          
          // Calculate gist relevance score
          const gistScore = calculateGistScore(query, chunk.metadata?.gist || '');
          
          // Combine scores with weights
          const combinedScore = (
            vectorSimilarity * 0.7 +     // Vector similarity gets 70% weight
            themeScore * 0.2 +           // Theme matching gets 20% weight
            gistScore * 0.1              // Gist relevance gets 10% weight
          );
          
          return {
            ...chunk,
            similarity: vectorSimilarity,
            themeScore,
            gistScore,
            combinedScore
          };
        }) || [];

        // Filter by theme if specified
        let filteredResults = resultsWithSimilarity;
        if (themeFilter) {
          filteredResults = resultsWithSimilarity.filter(chunk => 
            chunk.metadata?.themes?.some((theme: string) => 
              theme.toLowerCase().includes(themeFilter.toLowerCase())
            )
          );
        }

        // Sort by combined score and take top results
        filteredResults.sort((a, b) => b.combinedScore - a.combinedScore);
        const topResults = filteredResults.slice(0, limit);

        return NextResponse.json({ 
          chunks: topResults.map(r => ({
            text: r.text,
            metadata: r.metadata,
            similarity: r.similarity,
            themeScore: r.themeScore,
            gistScore: r.gistScore,
            combinedScore: r.combinedScore
          }))
        });
      }
      throw error;
    }

    // Process RPC results with theme scoring
    const queryTerms = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    const enhancedResults = data?.map((item: any) => {
      const themeScore = calculateThemeScore(queryTerms, item.metadata?.themes || []);
      const gistScore = calculateGistScore(query, item.metadata?.gist || '');
      const combinedScore = (
        item.similarity * 0.7 +
        themeScore * 0.2 +
        gistScore * 0.1
      );
      
      return {
        ...item,
        themeScore,
        gistScore,
        combinedScore
      };
    }) || [];

    // Filter by theme if specified
    let filteredResults = enhancedResults;
    if (themeFilter) {
      filteredResults = enhancedResults.filter(chunk => 
        chunk.metadata?.themes?.some((theme: string) => 
          theme.toLowerCase().includes(themeFilter.toLowerCase())
        )
      );
    }

    // Sort by combined score
    filteredResults.sort((a, b) => b.combinedScore - a.combinedScore);
    const topResults = filteredResults.slice(0, limit);

    return NextResponse.json({ 
      chunks: topResults.map(item => ({
        text: item.text,
        metadata: item.metadata,
        similarity: item.similarity,
        themeScore: item.themeScore,
        gistScore: item.gistScore,
        combinedScore: item.combinedScore
      }))
    });

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to search documents' },
      { status: 500 }
    );
  }
}

// Helper function for cosine similarity
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}