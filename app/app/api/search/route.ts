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

export async function POST(req: NextRequest) {
  try {
    console.log('Search API called');
    const { query, limit = 5 } = await req.json();
    console.log('Search query:', query);

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
      match_count: limit,
      match_threshold: 0.7, // Adjust threshold as needed
    });

    if (error) {
      console.error('Supabase error:', error);
      // If the function doesn't exist, try a different approach
      if (error.message.includes('function') || error.message.includes('does not exist')) {
        // Fallback: Get all chunks and compute similarity client-side
        const { data: chunks, error: fetchError } = await supabase
          .from('interconnects_bot')
          .select('id, text, embedding, metadata')
          .limit(100); // Limit to prevent timeout

        if (fetchError) throw fetchError;

        // Compute cosine similarity
        const resultsWithSimilarity = chunks?.map(chunk => {
          const similarity = cosineSimilarity(queryEmbedding, chunk.embedding);
          return {
            ...chunk,
            similarity
          };
        }) || [];

        // Sort by similarity and take top results
        resultsWithSimilarity.sort((a, b) => b.similarity - a.similarity);
        const topResults = resultsWithSimilarity.slice(0, limit);

        return NextResponse.json({ 
          chunks: topResults.map(r => ({
            text: r.text,
            metadata: r.metadata,
            similarity: r.similarity
          }))
        });
      }
      throw error;
    }

    return NextResponse.json({ 
      chunks: data?.map((item: any) => ({
        text: item.text,
        metadata: item.metadata,
        similarity: item.similarity
      })) || []
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