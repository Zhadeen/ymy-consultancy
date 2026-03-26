import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Check, CheckCheck, ChevronLeft, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockChatMessages, mockGuides } from '../data/mockData';

export default function ChatPage() {
  const [messages, setMessages] = useState(mockChatMessages);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);
  const guide = mockGuides[0];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg = {
      id: String(Date.now()),
      senderId: 'tourist',
      text: input,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setMessages(prev => [...prev, newMsg]);
    setInput('');

    // Simulate guide reply
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: String(Date.now() + 1),
        senderId: 'guide',
        text: "Thanks for your message! I'll get back to you shortly. 😊",
        timestamp: new Date().toISOString(),
        read: true,
      }]);
    }, 2000);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <main className="pt-20 h-screen bg-dark-900 flex flex-col">
      {/* Chat Header */}
      <div className="bg-dark-800 border-b border-dark-600/50 px-4 sm:px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <Link to="/search" className="text-muted hover:text-gold transition-colors">
            <ChevronLeft size={20} />
          </Link>
          <div className="relative">
            <img src={guide.photo} alt={guide.name} className="w-11 h-11 rounded-full object-cover border border-dark-500" />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-dark-800" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-cream font-semibold text-sm truncate">{guide.name}</h2>
            <p className="text-green-400 text-xs">Online</p>
          </div>
          <span className="text-xs text-muted bg-dark-700 px-3 py-1.5 rounded-full">{guide.city}</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-4">
          {/* Date separator */}
          <div className="text-center">
            <span className="text-xs text-muted-dark bg-dark-700 px-3 py-1 rounded-full">
              Today
            </span>
          </div>

          {messages.map((msg) => {
            const isMine = msg.senderId === 'tourist';
            return (
              <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] sm:max-w-[70%] ${isMine ? 'order-1' : ''}`}>
                  {!isMine && (
                    <img src={guide.photo} alt="" className="w-7 h-7 rounded-full object-cover mb-1" />
                  )}
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      isMine
                        ? 'bg-gold text-dark-900 rounded-br-md'
                        : 'bg-dark-700 text-cream rounded-bl-md'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <div className={`flex items-center gap-1 mt-1 ${isMine ? 'justify-end' : ''}`}>
                    <span className="text-[10px] text-muted-dark">{formatTime(msg.timestamp)}</span>
                    {isMine && (
                      msg.read
                        ? <CheckCheck size={12} className="text-gold" />
                        : <Check size={12} className="text-muted-dark" />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-dark-800 border-t border-dark-600/50 px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-end gap-3">
          <button className="w-10 h-10 rounded-full bg-dark-700 flex items-center justify-center text-muted hover:text-gold transition-colors flex-shrink-0">
            <Paperclip size={18} />
          </button>
          <div className="flex-1 relative">
            <textarea
              rows={1}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Type a message..."
              className="input-dark !py-3 !pr-12 resize-none text-sm"
              id="chat-input"
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-10 h-10 rounded-full bg-gold flex items-center justify-center text-dark-900 disabled:opacity-50 hover:bg-gold-light transition-all flex-shrink-0"
            id="chat-send-btn"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </main>
  );
}
