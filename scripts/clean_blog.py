#!/usr/bin/env python3
"""
Simple blog cleaning script to convert raw Interconnects blog posts
to the standardized frontmatter format needed for embedding.
"""

import re
import sys
from pathlib import Path
from datetime import datetime

def clean_blog_post(content: str, source_url: str = None) -> str:
    """Clean a raw blog post and add proper frontmatter."""
    lines = content.strip().split('\n')
    
    # Extract title (usually first line)
    title = lines[0].strip()
    
    # Extract author and date (usually lines 2-4)
    author = "Nathan Lambert"  # Default for Interconnects
    date = None
    
    # Look for date patterns in first few lines
    date_patterns = [
        r'(\w{3} \d{1,2}, \d{4})',  # Aug 15, 2025
        r'(\d{4}-\d{2}-\d{2})',    # 2025-08-15
        r'(\w+ \d{1,2}, \d{4})'    # August 15, 2025
    ]
    
    for i, line in enumerate(lines[:10]):
        for pattern in date_patterns:
            match = re.search(pattern, line)
            if match:
                date_str = match.group(1)
                # Convert to standard format
                try:
                    if ',' in date_str:
                        # Aug 15, 2025 -> 2025-08-15
                        parsed_date = datetime.strptime(date_str, '%b %d, %Y')
                        date = parsed_date.strftime('%Y-%m-%d')
                    else:
                        date = date_str
                except:
                    date = date_str
                break
        if date:
            break
    
    # Default date if not found
    if not date:
        date = datetime.now().strftime('%Y-%m-%d')
    
    # Remove Substack boilerplate
    cleaned_lines = []
    skip_patterns = [
        r'^Share$',
        r'^Interconnects is a reader-supported publication',
        r'^Consider becoming a subscriber',
        r'^Subscribe$',
        r'^Get \d+% off forever'
    ]
    
    # Skip initial metadata lines (title, author, date)
    content_start = 0
    for i, line in enumerate(lines):
        if line.strip() == title.strip():
            content_start = i + 1
            # Skip author/date lines that follow
            while content_start < len(lines):
                current_line = lines[content_start].strip()
                # Skip empty lines
                if current_line == '':
                    content_start += 1
                    continue
                # Skip author lines
                elif any(name in current_line.lower() for name in ['nathan lambert', 'nathan', 'lambert']):
                    content_start += 1
                    continue
                # Skip date lines
                elif re.search(r'(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|\d{4})', current_line):
                    content_start += 1
                    continue
                # Skip subtitle lines (short lines after title)
                elif len(current_line) < 80 and i < 5:
                    content_start += 1
                    continue
                else:
                    break
            break
    
    # Process remaining content
    for i, line in enumerate(lines[content_start:]):
        # Skip boilerplate
        should_skip = False
        for pattern in skip_patterns:
            if re.match(pattern, line.strip(), re.IGNORECASE):
                should_skip = True
                break
        
        if not should_skip:
            cleaned_lines.append(line)
    
    # Build frontmatter
    frontmatter = f"""---
title: "{title}"
author: "{author}"
date: "{date}"
url: "{source_url or 'https://www.interconnects.ai/p/' + title.lower().replace(' ', '-').replace(':', '').replace(',', '')}"
---

# {title}

"""
    
    # Combine frontmatter with cleaned content
    cleaned_content = '\n'.join(cleaned_lines).strip()
    
    return frontmatter + cleaned_content

def main():
    if len(sys.argv) < 2:
        print("Usage: python clean_blog.py <input_file> [output_file] [source_url]")
        sys.exit(1)
    
    input_file = Path(sys.argv[1])
    output_file = Path(sys.argv[2]) if len(sys.argv) > 2 else input_file.with_stem(input_file.stem + '_cleaned')
    source_url = sys.argv[3] if len(sys.argv) > 3 else None
    
    if not input_file.exists():
        print(f"Error: {input_file} does not exist")
        sys.exit(1)
    
    # Read input file
    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Clean the content
    cleaned = clean_blog_post(content, source_url)
    
    # Write output file
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(cleaned)
    
    print(f"✅ Cleaned blog post saved to: {output_file}")
    print(f"📝 Ready for ingestion with: python ingest_blogs.py --file {output_file}")

if __name__ == "__main__":
    main()