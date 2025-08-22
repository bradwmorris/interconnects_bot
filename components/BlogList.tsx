"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { FileIcon } from '@radix-ui/react-icons';

interface BlogMetadata {
  title: string;
  author?: string;
  date?: string;
  url?: string;
}

interface BlogListProps {
  selectedBlog: string | null;
  onBlogSelect: (title: string | null) => void;
}

export default function BlogList({ selectedBlog, onBlogSelect }: BlogListProps) {
  const [blogs, setBlogs] = useState<BlogMetadata[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from('interconnects_bot')
        .select('metadata')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      const uniqueBlogs = new Map<string, BlogMetadata>();
      
      data?.forEach(item => {
        if (item.metadata?.title && !uniqueBlogs.has(item.metadata.title)) {
          uniqueBlogs.set(item.metadata.title, {
            title: item.metadata.title,
            author: item.metadata.author,
            date: item.metadata.date,
            url: item.metadata.url
          });
        }
      });

      setBlogs(Array.from(uniqueBlogs.values()));
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col" style={{ background: 'black' }}>
      {/* Header */}
      <div style={{ 
        padding: '15px 20px', 
        borderBottom: '1px solid #333',
        textTransform: 'uppercase',
        fontSize: '12px',
        color: '#888',
        letterSpacing: '0.05em'
      }}>
        INTERCONNECTS_BOT
      </div>

      {/* Files Section */}
      <div className="flex-1 overflow-auto">
        <div style={{ 
          padding: '15px 20px', 
          fontSize: '12px', 
          color: '#666',
          fontFamily: 'monospace'
        }}>
          blogs
        </div>
        
        {loading ? (
          <div style={{ padding: '10px 20px', color: '#666', fontSize: '14px' }}>Loading...</div>
        ) : blogs.length === 0 ? (
          <div style={{ padding: '10px 20px', color: '#666', fontSize: '14px' }}>No files</div>
        ) : (
          <div>
            {blogs.map((blog, index) => (
              <button
                key={index}
                onClick={() => onBlogSelect(selectedBlog === blog.title ? null : blog.title)}
                style={{
                  width: '100%',
                  padding: '10px 20px',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  fontSize: '14px',
                  fontFamily: 'monospace',
                  background: selectedBlog === blog.title ? '#222' : 'transparent',
                  color: selectedBlog === blog.title ? '#ddd' : '#888',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <FileIcon style={{ width: '16px', height: '16px', color: '#666', flexShrink: 0 }} />
                <span style={{ 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis', 
                  whiteSpace: 'nowrap'
                }}>
                  {blog.title}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ 
        padding: '10px 20px', 
        borderTop: '1px solid #333',
        fontSize: '12px',
        color: '#666',
        fontFamily: 'monospace'
      }}>
        {blogs.length} items
      </div>
    </div>
  );
}