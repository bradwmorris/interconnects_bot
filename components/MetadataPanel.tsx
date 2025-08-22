"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface BlogMetadata {
  url?: string;
  date?: string;
  gist?: string;
  title?: string;
  author?: string;
  themes?: string[];
  file_name?: string;
}

interface MetadataPanelProps {
  selectedBlog: string | null;
}

export default function MetadataPanel({ selectedBlog }: MetadataPanelProps) {
  const [metadata, setMetadata] = useState<BlogMetadata | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedBlog) {
      fetchMetadata(selectedBlog);
    } else {
      setMetadata(null);
    }
  }, [selectedBlog]);

  const fetchMetadata = async (blogTitle: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('interconnects_bot')
        .select('metadata')
        .eq('metadata->>title', blogTitle)
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching metadata:', error);
        return;
      }

      setMetadata(data?.metadata || null);
    } catch (error) {
      console.error('Error fetching metadata:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedBlog) {
    return (
      <div style={{
        width: '400px',
        background: '#0a0a0a',
        borderRight: '1px solid #333',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#666',
        fontFamily: 'monospace',
        fontSize: '14px'
      }}>
        Select a blog to view metadata
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{
        width: '400px',
        background: '#0a0a0a',
        borderRight: '1px solid #333',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#666',
        fontFamily: 'monospace',
        fontSize: '14px'
      }}>
        Loading metadata...
      </div>
    );
  }

  return (
    <div style={{
      width: '400px',
      background: '#0a0a0a',
      borderRight: '1px solid #333',
      height: '100vh',
      overflow: 'auto'
    }}>
      {/* Header */}
      <div style={{
        padding: '15px 20px',
        borderBottom: '1px solid #333',
        textTransform: 'uppercase',
        fontSize: '12px',
        color: '#888',
        letterSpacing: '0.05em'
      }}>
        METADATA
      </div>

      {metadata && (
        <div style={{ padding: '20px' }}>
          {/* Title */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{
              fontSize: '12px',
              color: '#666',
              fontFamily: 'monospace',
              marginBottom: '8px',
              textTransform: 'uppercase'
            }}>
              Title
            </div>
            <div style={{
              fontSize: '14px',
              color: '#ddd',
              fontFamily: 'monospace',
              lineHeight: '1.4'
            }}>
              {metadata.title}
            </div>
          </div>

          {/* Author */}
          {metadata.author && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{
                fontSize: '12px',
                color: '#666',
                fontFamily: 'monospace',
                marginBottom: '8px',
                textTransform: 'uppercase'
              }}>
                Author
              </div>
              <div style={{
                fontSize: '14px',
                color: '#ddd',
                fontFamily: 'monospace'
              }}>
                {metadata.author}
              </div>
            </div>
          )}

          {/* Date */}
          {metadata.date && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{
                fontSize: '12px',
                color: '#666',
                fontFamily: 'monospace',
                marginBottom: '8px',
                textTransform: 'uppercase'
              }}>
                Date
              </div>
              <div style={{
                fontSize: '14px',
                color: '#ddd',
                fontFamily: 'monospace'
              }}>
                {metadata.date}
              </div>
            </div>
          )}

          {/* Gist */}
          {metadata.gist && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{
                fontSize: '12px',
                color: '#666',
                fontFamily: 'monospace',
                marginBottom: '8px',
                textTransform: 'uppercase'
              }}>
                Summary
              </div>
              <div style={{
                fontSize: '14px',
                color: '#ddd',
                fontFamily: 'monospace',
                lineHeight: '1.4'
              }}>
                {metadata.gist}
              </div>
            </div>
          )}

          {/* Themes */}
          {metadata.themes && metadata.themes.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{
                fontSize: '12px',
                color: '#666',
                fontFamily: 'monospace',
                marginBottom: '12px',
                textTransform: 'uppercase'
              }}>
                Themes
              </div>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px'
              }}>
                {metadata.themes.map((theme, index) => (
                  <span key={index} style={{
                    display: 'inline-block',
                    fontSize: '12px',
                    color: '#ddd',
                    fontFamily: 'monospace',
                    background: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    whiteSpace: 'nowrap'
                  }}>
                    {theme}
                  </span>
                ))}
              </div>
            </div>
          )}


          {/* URL */}
          {metadata.url && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{
                fontSize: '12px',
                color: '#666',
                fontFamily: 'monospace',
                marginBottom: '8px',
                textTransform: 'uppercase'
              }}>
                URL
              </div>
              <a href={metadata.url} target="_blank" rel="noopener noreferrer" style={{
                fontSize: '14px',
                color: '#3b82f6',
                fontFamily: 'monospace',
                textDecoration: 'underline',
                wordBreak: 'break-all'
              }}>
                {metadata.url}
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}