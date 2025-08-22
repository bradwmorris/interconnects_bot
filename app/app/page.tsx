import BlogList from '@/components/BlogList';
import ChatInterface from '@/components/ChatInterface';

export default function Home() {
  return (
    <div style={{ 
      height: '100vh', 
      width: '100vw', 
      background: 'black',
      display: 'flex',
      overflow: 'hidden'
    }}>
      {/* Left sidebar */}
      <div style={{ 
        width: '300px', 
        flexShrink: 0, 
        borderRight: '1px solid #333'
      }}>
        <BlogList />
      </div>
      
      {/* Right content area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <ChatInterface />
      </div>
    </div>
  );
}