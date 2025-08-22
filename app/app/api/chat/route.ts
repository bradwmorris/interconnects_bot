import { openai } from '@ai-sdk/openai';
import { streamText, UIMessage, convertToModelMessages } from 'ai';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  // Extract the latest user message for search
  const lastMessage = messages[messages.length - 1];
  let userQuery = '';
  
  if (lastMessage?.role === 'user' && lastMessage.parts) {
    userQuery = lastMessage.parts
      .filter((part: any) => part.type === 'text')
      .map((part: any) => part.text)
      .join('');
  }

  console.log('🔍 User query extracted:', userQuery);

  // Search for relevant blog content
  const searchResults = await searchBlogContent(userQuery);
  console.log('📊 Search results found:', searchResults.length);
  
  if (searchResults.length > 0) {
    console.log('🎯 Top search result similarity:', searchResults[0]?.similarity);
    console.log('📄 Top search result source:', searchResults[0]?.metadata?.title);
  }

  // Build context from search results
  let context = '';
  if (searchResults.length > 0) {
    context = 'Relevant context from Interconnects blog:\n\n';
    searchResults.forEach((chunk: any, index: number) => {
      const source = chunk.metadata?.title || 'Unknown source';
      context += `[Source: ${source}]\n${chunk.text}\n\n`;
    });
    console.log('📝 Context built, length:', context.length);
  } else {
    console.log('❌ No search results found for query');
  }

  const result = streamText({
    model: openai('gpt-4o'),
    system: `You are a helpful assistant that answers questions about content from the Interconnects AI blog.

You have access to embedded content from various Interconnects blog posts. Use the provided context to answer questions accurately.

When answering:
- Be specific and cite information from the context when available
- If the context doesn't contain relevant information, say so
- Keep responses concise but informative
- Use quotes from the context to support your answers when appropriate

${context ? `Context:\n${context}` : 'No specific context available for this query.'}`,
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}

// Search function for blog content
async function searchBlogContent(query: string, limit = 5) {
  try {
    if (!query.trim()) {
      console.log('⚠️ Empty query, skipping search');
      return [];
    }

    console.log('🔍 Searching for:', query);

    // Generate embedding for the query
    const embeddingResponse = await openaiClient.embeddings.create({
      model: 'text-embedding-3-small',
      input: query,
    });

    const queryEmbedding = embeddingResponse.data[0].embedding;
    console.log('✅ Generated embedding, dimensions:', queryEmbedding.length);

    // Get all chunks and compute similarity
    const { data: chunks, error } = await supabase
      .from('interconnects_bot')
      .select('id, text, embedding, metadata')
      .limit(100);

    if (error) {
      console.error('❌ Supabase error:', error);
      throw error;
    }

    console.log('📦 Retrieved chunks from DB:', chunks?.length || 0);

    if (!chunks || chunks.length === 0) {
      console.log('⚠️ No chunks found in database');
      return [];
    }

    // Debug: Check the first embedding format
    if (chunks[0]?.embedding) {
      console.log('🔍 First embedding type:', typeof chunks[0].embedding);
      console.log('🔍 First embedding length:', Array.isArray(chunks[0].embedding) ? chunks[0].embedding.length : 'not array');
      console.log('🔍 First few values:', Array.isArray(chunks[0].embedding) ? chunks[0].embedding.slice(0, 3) : chunks[0].embedding);
    }

    // Compute cosine similarity
    const resultsWithSimilarity = chunks?.map(chunk => {
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
      
      const similarity = cosineSimilarity(queryEmbedding, chunkEmbedding);
      return {
        ...chunk,
        similarity
      };
    }) || [];

    // Sort by similarity and take top results
    resultsWithSimilarity.sort((a, b) => b.similarity - a.similarity);
    
    const topResults = resultsWithSimilarity.slice(0, limit);
    const filteredResults = topResults.filter(r => r.similarity > 0.3);
    
    console.log('🎯 Top similarities before filtering:', topResults.slice(0, 3).map(r => r.similarity));
    console.log('✅ Results after 0.3 threshold:', filteredResults.length);

    return filteredResults;

  } catch (error) {
    console.error('❌ Search error:', error);
    return [];
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