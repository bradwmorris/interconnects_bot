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

// Helper function to extract relevant quotes from chunk text
function extractRelevantQuotes(chunkText: string, query: string, maxQuotes = 3): string[] {
  const quotes: string[] = [];
  
  // Split into sentences - improved regex to handle more cases
  const sentences = chunkText.split(/[.!?]+(?=\s|$)/).filter(s => s.trim().length > 25);
  
  // Score sentences based on keyword overlap with query
  const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  
  const scoredSentences = sentences.map(sentence => {
    const sentenceWords = sentence.toLowerCase().split(/\s+/);
    const matchCount = queryWords.filter(qw => 
      sentenceWords.some(sw => sw.includes(qw) || qw.includes(sw))
    ).length;
    
    // Bonus scoring for direct relevance and completeness
    let bonus = 0;
    if (sentence.toLowerCase().includes('continual learning')) bonus += 0.2;
    if (sentence.toLowerCase().includes('system') || sentence.toLowerCase().includes('problem')) bonus += 0.1;
    if (sentence.length > 50 && sentence.length < 200) bonus += 0.1; // Prefer medium-length sentences
    
    return {
      text: sentence.trim(),
      score: (matchCount / queryWords.length) + bonus,
      length: sentence.length
    };
  });
  
  // Sort by score and select best quotes
  scoredSentences
    .filter(s => s.score > 0.15 && s.length > 25 && s.length < 300) // More inclusive but cap length
    .sort((a, b) => b.score - a.score)
    .slice(0, maxQuotes)
    .forEach(s => quotes.push(s.text));
    
  return quotes;
}

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  // Extract the latest user message for search
  const lastMessage = messages[messages.length - 1];
  let userQuery = '';
  
  if (lastMessage?.role === 'user' && lastMessage.parts) {
    userQuery = lastMessage.parts
      .filter((part) => part.type === 'text')
      .map((part) => part.text)
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
    
    // Group chunks by article to show themes/gist once per article
    const articleMap = new Map();
    searchResults.forEach((chunk) => {
      const title = chunk.metadata?.title || 'Unknown source';
      if (!articleMap.has(title)) {
        articleMap.set(title, {
          gist: chunk.metadata?.gist,
          themes: chunk.metadata?.themes,
          chunks: []
        });
      }
      articleMap.get(title).chunks.push(chunk);
    });
    
    // Build context with themes/gist for each article
    articleMap.forEach((article, title) => {
      context += `[Source: ${title}]\n`;
      
      // Add gist and themes if available
      if (article.gist) {
        context += `Summary: ${article.gist}\n`;
      }
      if (article.themes && article.themes.length > 0) {
        context += `Themes: ${article.themes.join(', ')}\n`;
      }
      context += '\n';
      
      // Add chunks with relevant quotes
      article.chunks.forEach((chunk) => {
        // Extract relevant quotes from this chunk
        const quotes = extractRelevantQuotes(chunk.text, userQuery);
        
        if (quotes.length > 0) {
          context += `Key quotes:\n`;
          quotes.forEach(quote => {
            context += `> "${quote}"\n`;
          });
          context += `\n`;
        }
        
        context += `${chunk.text}\n\n`;
      });
    });
    
    console.log('📝 Context built, length:', context.length);
  } else {
    console.log('❌ No search results found for query');
  }

  const result = streamText({
    model: openai('gpt-4o'),
    system: `You are a helpful assistant that answers questions about content from the Interconnects AI blog.

You have access to embedded content from various Interconnects blog posts. Use the provided context to answer questions accurately.

CRITICAL INSTRUCTIONS FOR QUOTES:
- ALWAYS include direct quotes when they directly answer or support your response
- Present quotes on separate lines using this exact format:
> "exact quote from the context"
- Include the most relevant and specific quotes that directly address the user's question
- Use multiple quotes when they provide different perspectives or build upon each other
- After each quote, briefly explain its relevance to the question

When answering:
- Be specific and cite information from the context when available
- If the context doesn't contain relevant information, say so
- Keep responses concise but informative
- ALWAYS use direct quotes from the context when they support your answer
- Present quotes clearly on separate lines as shown above

${context ? `Context:\n${context}` : 'No specific context available for this query.'}`,
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}

// Helper functions for enhanced scoring
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

function calculateGistScore(query: string, gist: string): number {
  if (!gist) return 0;
  
  const queryWords = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  const gistWords = gist.toLowerCase().split(/\s+/);
  
  const matches = queryWords.filter(qw => 
    gistWords.some(gw => gw.includes(qw) || qw.includes(gw))
  );
  
  return matches.length / Math.max(queryWords.length, 1);
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
      .limit(200); // Get more chunks for better theme matching

    if (error) {
      console.error('❌ Supabase error:', error);
      throw error;
    }

    console.log('📦 Retrieved chunks from DB:', chunks?.length || 0);

    if (!chunks || chunks.length === 0) {
      console.log('⚠️ No chunks found in database');
      return [];
    }

    // Parse query terms for theme matching
    const queryTerms = query.toLowerCase().split(/\s+/).filter(w => w.length > 2);

    // Compute enhanced similarity with theme and gist scoring
    const resultsWithSimilarity = chunks?.map(chunk => {
      // Parse embedding from string to array if needed
      let chunkEmbedding = chunk.embedding;
      if (typeof chunkEmbedding === 'string') {
        try {
          chunkEmbedding = JSON.parse(chunkEmbedding);
        } catch (error) {
          console.error('❌ Failed to parse embedding for chunk:', chunk.id);
          return { ...chunk, similarity: 0, themeScore: 0, gistScore: 0, combinedScore: 0 };
        }
      }
      
      const vectorSimilarity = cosineSimilarity(queryEmbedding, chunkEmbedding);
      
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

    // Sort by combined score and take top results
    resultsWithSimilarity.sort((a, b) => b.combinedScore - a.combinedScore);
    
    const topResults = resultsWithSimilarity.slice(0, limit * 2); // Get more candidates
    const filteredResults = topResults.filter(r => r.combinedScore > 0.3);
    
    console.log('🎯 Top combined scores before filtering:', topResults.slice(0, 3).map(r => ({
      combined: r.combinedScore?.toFixed(3),
      vector: r.similarity?.toFixed(3),
      theme: r.themeScore?.toFixed(3),
      gist: r.gistScore?.toFixed(3)
    })));
    console.log('✅ Results after 0.3 threshold:', filteredResults.length);

    return filteredResults.slice(0, limit); // Return only requested limit

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