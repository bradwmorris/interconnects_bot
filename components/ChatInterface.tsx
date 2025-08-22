"use client";

import { useRef, useEffect, useState } from 'react';
import { useChat } from '@ai-sdk/react';

export default function ChatInterface() {
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { messages, sendMessage } = useChat();
  const [input, setInput] = useState('');

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    sendMessage({ text: input });
    setInput('');
  };

  return (
    <div className="h-full flex flex-col" style={{ background: 'black' }}>
      {/* Main Content Area */}
      <div className="flex-1 overflow-auto" style={{ padding: '20px 30px' }}>
        {messages.length === 0 ? (
          <div style={{ fontFamily: 'monospace' }}>
            <div className="flex" style={{ marginBottom: '20px' }}>
              <span style={{ color: '#666', width: '20px', marginRight: '20px' }}>1</span>
              <span style={{ color: '#aaa' }}>// Welcome to Interconnects AI Assistant</span>
            </div>
            <div className="flex" style={{ marginBottom: '20px' }}>
              <span style={{ color: '#666', width: '20px', marginRight: '20px' }}>2</span>
              <span style={{ color: '#aaa' }}>// Query the indexed blog content below</span>
            </div>
            <div className="flex" style={{ marginBottom: '20px' }}>
              <span style={{ color: '#666', width: '20px', marginRight: '20px' }}>3</span>
              <span></span>
            </div>
            <div className="flex" style={{ marginBottom: '20px' }}>
              <span style={{ color: '#666', width: '20px', marginRight: '20px' }}>4</span>
              <span style={{ color: '#aaa' }}>// Example queries:</span>
            </div>
            <div className="flex" style={{ marginBottom: '20px' }}>
              <span style={{ color: '#666', width: '20px', marginRight: '20px' }}>5</span>
              <span style={{ color: '#aaa' }}>console.log("What are the main themes?");</span>
            </div>
            <div className="flex" style={{ marginBottom: '20px' }}>
              <span style={{ color: '#666', width: '20px', marginRight: '20px' }}>6</span>
              <span style={{ color: '#aaa' }}>console.log("Summarize AI safety points");</span>
            </div>
            <div className="flex" style={{ marginBottom: '20px' }}>
              <span style={{ color: '#666', width: '20px', marginRight: '20px' }}>7</span>
              <span style={{ color: '#aaa' }}>console.log("Author's thoughts on LLMs?");</span>
            </div>
          </div>
        ) : (
          <div style={{ fontFamily: 'monospace' }}>
            {messages.map((message, messageIndex) => (
              <div key={message.id} style={{ marginBottom: '30px' }}>
                <div className="flex">
                  <span style={{ color: '#666', width: '20px', marginRight: '20px' }}>
                    {messageIndex * 2 + 4}
                  </span>
                  <span style={{ 
                    color: message.role === 'user' ? '#3b82f6' : '#22c55e'
                  }}>
                    {message.role === 'user' ? '> Query' : '# Response'}
                  </span>
                </div>
                
                <div className="flex" style={{ marginTop: '10px' }}>
                  <span style={{ color: '#666', width: '20px', marginRight: '20px' }}></span>
                  <div style={{ 
                    color: message.role === 'user' ? '#93c5fd' : '#d1d5db'
                  }}>
                    {message.parts.map((part, i) => {
                      if (part.type === 'text') {
                        return (
                          <div key={i}>
                            {message.role === 'user' 
                              ? `"${part.text}"` 
                              : part.text.split('\n').map((line, lineIndex) => (
                                  <div key={lineIndex} style={{ marginBottom: '10px' }}>
                                    {line}
                                  </div>
                                ))
                            }
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
                
                <div className="flex" style={{ marginTop: '10px' }}>
                  <span style={{ color: '#666', width: '20px', marginRight: '20px' }}>
                    {messageIndex * 2 + 5}
                  </span>
                  <span></span>
                </div>
              </div>
            ))}
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div style={{ borderTop: '1px solid #333' }}>
        <div style={{ padding: '15px 30px' }}>
          <form onSubmit={handleSubmit} className="flex items-center">
            <span style={{ 
              color: '#aaa', 
              fontFamily: 'monospace', 
              marginRight: '15px' 
            }}>{'>'}</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  if (input.trim()) {
                    handleSubmit(e as any);
                  }
                }
              }}
              placeholder="Enter your question..."
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                color: '#d1d5db',
                fontFamily: 'monospace',
                fontSize: '14px'
              }}
            />
          </form>
        </div>
        
        {/* Status Bar */}
        <div className="flex justify-between" style={{ 
          borderTop: '1px solid #333',
          padding: '10px 30px',
          color: '#666',
          fontSize: '12px',
          fontFamily: 'monospace'
        }}>
          <div>? for shortcuts</div>
          <div>⌘K to generate a command</div>
        </div>
      </div>
    </div>
  );
}