#!/usr/bin/env python3
"""
Simplified blog ingestion script for Interconnects Bot
Processes markdown files and stores chunks with embeddings in Supabase
"""

import os
import sys
import argparse
import json
import re
from typing import Dict, List, Optional, Tuple
from datetime import datetime
from pathlib import Path
import logging

# Third-party imports
from dotenv import load_dotenv
from supabase import create_client, Client
from openai import OpenAI

# Try to import LangChain for semantic chunking
try:
    from langchain_experimental.text_splitter import SemanticChunker
    from langchain_openai.embeddings import OpenAIEmbeddings
    LANGCHAIN_AVAILABLE = True
except ImportError:
    print("LangChain not available. Install with: pip install langchain-experimental langchain-openai")
    LANGCHAIN_AVAILABLE = False
    from langchain.text_splitter import RecursiveCharacterTextSplitter

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv('../.env.local')

class BlogProcessor:
    def __init__(self):
        """Initialize the blog processor with Supabase and OpenAI clients."""
        # Initialize Supabase client
        supabase_url = os.getenv('NEXT_PUBLIC_SUPABASE_URL')
        supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
        
        if not supabase_url or not supabase_key:
            raise ValueError("Missing Supabase credentials in environment variables")
        
        self.supabase: Client = create_client(supabase_url, supabase_key)
        
        # Initialize OpenAI client
        openai_api_key = os.getenv('OPENAI_API_KEY')
        if not openai_api_key:
            raise ValueError("Missing OpenAI API key in environment variables")
        
        self.openai_client = OpenAI(api_key=openai_api_key)
        
        # Initialize chunking strategy
        if LANGCHAIN_AVAILABLE:
            logger.info("Using semantic chunking")
            self.embeddings = OpenAIEmbeddings(
                model="text-embedding-3-small",
                openai_api_key=openai_api_key
            )
            self.chunker = SemanticChunker(
                embeddings=self.embeddings,
                breakpoint_threshold_type="percentile",
                breakpoint_threshold_amount=85
            )
        else:
            logger.info("Using character-based chunking")
            self.chunker = RecursiveCharacterTextSplitter(
                chunk_size=1000,
                chunk_overlap=200,
                separators=["\n\n", "\n", ". ", "! ", "? ", ", ", " "],
                length_function=len
            )
    
    def extract_frontmatter(self, content: str) -> Tuple[Dict, str]:
        """Extract frontmatter metadata from markdown content."""
        metadata = {}
        
        # Check for frontmatter
        if content.startswith('---'):
            try:
                parts = content.split('---', 2)
                if len(parts) >= 3:
                    frontmatter = parts[1].strip()
                    main_content = parts[2].strip()
                    
                    # Parse frontmatter
                    for line in frontmatter.split('\n'):
                        if ':' in line:
                            key, value = line.split(':', 1)
                            key = key.strip().lower()
                            value = value.strip().strip('"').strip("'")
                            metadata[key] = value
                    
                    return metadata, main_content
            except Exception as e:
                logger.warning(f"Error parsing frontmatter: {e}")
        
        return metadata, content
    
    def extract_gist_and_themes(self, content: str, title: str = "") -> Dict:
        """Use GPT-4o to extract gist and themes from article content."""
        try:
            logger.info("Extracting gist and themes using GPT-4o")
            
            prompt = f"""Please analyze the following article and extract:

1. A concise gist (1-2 sentences) summarizing the main argument or point
2. 3-7 major themes as an array of strings

Article Title: {title}

Article Content:
{content[:8000]}  # Limit content to stay within token limits

Please respond in valid JSON format:
{{
  "gist": "Your 1-2 sentence summary here",
  "themes": ["Theme 1", "Theme 2", "Theme 3"]
}}"""

            response = self.openai_client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": "You are an expert at analyzing AI research and technical content. Extract key information in the requested JSON format."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3
            )
            
            result_text = response.choices[0].message.content
            logger.info(f"GPT-4o raw response: {result_text}")
            
            # Parse JSON response
            import json
            # Clean the response to extract JSON
            if "```json" in result_text:
                # Extract JSON from code block
                json_start = result_text.find("```json") + 7
                json_end = result_text.find("```", json_start)
                result_text = result_text[json_start:json_end].strip()
            elif "{" in result_text and "}" in result_text:
                # Extract JSON from response
                json_start = result_text.find("{")
                json_end = result_text.rfind("}") + 1
                result_text = result_text[json_start:json_end]
            
            result = json.loads(result_text)
            
            logger.info(f"Extracted gist: {result.get('gist', '')[:100]}...")
            logger.info(f"Extracted themes: {result.get('themes', [])}")
            
            return result
            
        except Exception as e:
            logger.error(f"Error extracting gist and themes: {e}")
            # Return empty values if GPT-4o call fails
            return {
                "gist": "",
                "themes": []
            }

    def create_chunks(self, content: str, metadata: Dict) -> List[Dict]:
        """Create semantic chunks from content."""
        chunks = []
        
        try:
            if LANGCHAIN_AVAILABLE:
                # Use semantic chunking
                documents = self.chunker.create_documents([content])
                
                for i, doc in enumerate(documents):
                    chunk_text = doc.page_content.strip()
                    
                    # Skip very small chunks
                    if len(chunk_text) < 100:
                        continue
                    
                    chunk_data = {
                        'text': chunk_text,
                        'metadata': {
                            **metadata,
                            'chunk_index': i,
                            'chunk_length': len(chunk_text)
                        }
                    }
                    chunks.append(chunk_data)
            else:
                # Use character-based chunking
                text_chunks = self.chunker.split_text(content)
                
                for i, chunk_text in enumerate(text_chunks):
                    if len(chunk_text) < 100:
                        continue
                    
                    chunk_data = {
                        'text': chunk_text,
                        'metadata': {
                            **metadata,
                            'chunk_index': i,
                            'chunk_length': len(chunk_text)
                        }
                    }
                    chunks.append(chunk_data)
            
            logger.info(f"Created {len(chunks)} chunks")
            return chunks
            
        except Exception as e:
            logger.error(f"Error creating chunks: {e}")
            return []
    
    def generate_embedding(self, text: str) -> List[float]:
        """Generate embedding for text using OpenAI."""
        try:
            response = self.openai_client.embeddings.create(
                model="text-embedding-3-small",
                input=text
            )
            return response.data[0].embedding
        except Exception as e:
            logger.error(f"Error generating embedding: {e}")
            raise
    
    def store_chunks(self, chunks: List[Dict]) -> bool:
        """Store chunks in Supabase interconnects_bot table."""
        try:
            for i, chunk in enumerate(chunks):
                logger.info(f"Processing chunk {i+1}/{len(chunks)}")
                
                # Generate embedding
                embedding = self.generate_embedding(chunk['text'])
                
                # Prepare data for insertion
                data = {
                    'text': chunk['text'],
                    'embedding': embedding,
                    'metadata': chunk['metadata']
                }
                
                # Insert into Supabase
                result = self.supabase.table('interconnects_bot').insert(data).execute()
                
                if not result.data:
                    logger.error(f"Failed to insert chunk {i+1}")
                    return False
            
            logger.info(f"Successfully stored {len(chunks)} chunks")
            return True
            
        except Exception as e:
            logger.error(f"Error storing chunks: {e}")
            return False
    
    def process_file(self, file_path: str, custom_metadata: Optional[Dict] = None) -> bool:
        """Process a single markdown file."""
        try:
            logger.info(f"Processing file: {file_path}")
            
            # Read file content
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Extract frontmatter and content
            metadata, main_content = self.extract_frontmatter(content)
            
            # Add file-based metadata
            file_name = Path(file_path).stem
            metadata['file_name'] = file_name
            metadata['processed_at'] = datetime.now().isoformat()
            
            # Override with custom metadata if provided
            if custom_metadata:
                metadata.update(custom_metadata)
            
            # Ensure we have a title
            if 'title' not in metadata:
                metadata['title'] = file_name.replace('_', ' ').replace('-', ' ').title()
            
            logger.info(f"Initial metadata: {metadata}")
            
            # Extract gist and themes using GPT-4o
            gist_themes = self.extract_gist_and_themes(main_content, metadata.get('title', ''))
            
            # Add gist and themes to metadata
            metadata.update(gist_themes)
            
            logger.info(f"Enhanced metadata with gist and themes: {metadata}")
            
            # Create chunks
            chunks = self.create_chunks(main_content, metadata)
            
            if not chunks:
                logger.warning("No chunks created")
                return False
            
            # Store chunks
            success = self.store_chunks(chunks)
            
            if success:
                logger.info(f"✅ Successfully processed: {metadata['title']}")
            else:
                logger.error(f"❌ Failed to process: {metadata['title']}")
            
            return success
            
        except Exception as e:
            logger.error(f"Error processing file {file_path}: {e}")
            return False
    
    def process_folder(self, folder_path: str) -> Tuple[int, int]:
        """Process all markdown files in a folder."""
        folder = Path(folder_path)
        
        if not folder.exists():
            logger.error(f"Folder does not exist: {folder_path}")
            return 0, 0
        
        # Find all markdown files
        md_files = list(folder.glob('*.md')) + list(folder.glob('*.markdown'))
        
        if not md_files:
            logger.warning(f"No markdown files found in {folder_path}")
            return 0, 0
        
        logger.info(f"Found {len(md_files)} markdown files")
        
        success_count = 0
        for file_path in md_files:
            if self.process_file(str(file_path)):
                success_count += 1
        
        return success_count, len(md_files)

def main():
    parser = argparse.ArgumentParser(description='Ingest Interconnects blog posts')
    parser.add_argument('--file', type=str, help='Process a single markdown file')
    parser.add_argument('--folder', type=str, help='Process all markdown files in folder')
    parser.add_argument('--title', type=str, help='Override title metadata')
    parser.add_argument('--author', type=str, help='Set author metadata')
    parser.add_argument('--url', type=str, help='Set source URL metadata')
    parser.add_argument('--date', type=str, help='Set date metadata')
    
    args = parser.parse_args()
    
    if not args.file and not args.folder:
        parser.error('Either --file or --folder must be specified')
    
    # Create processor
    processor = BlogProcessor()
    
    # Build custom metadata if provided
    custom_metadata = {}
    if args.title:
        custom_metadata['title'] = args.title
    if args.author:
        custom_metadata['author'] = args.author
    if args.url:
        custom_metadata['url'] = args.url
    if args.date:
        custom_metadata['date'] = args.date
    
    # Process file or folder
    if args.file:
        success = processor.process_file(args.file, custom_metadata)
        sys.exit(0 if success else 1)
    elif args.folder:
        success_count, total_count = processor.process_folder(args.folder)
        logger.info(f"\nProcessed {success_count}/{total_count} files successfully")
        sys.exit(0 if success_count == total_count else 1)

if __name__ == "__main__":
    main()