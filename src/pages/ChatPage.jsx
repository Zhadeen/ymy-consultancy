import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Check, CheckCheck, ChevronLeft, Image as ImageIcon } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { collection, doc, query, orderBy, onSnapshot, addDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';

export default function ChatPage() {
  const { guideId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef(null);

  const chatId = user ? [user.uid, guideId].sort().join('_') : null;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!user) return; // Wait for user to be available

    const fetchGuide = async () => {
      try {
        const docRef = doc(db, 'guides', guideId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setGuide({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (err) {
        console.error("Error fetching guide for chat:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGuide();

    // Listen to messages
    const q = query(
      collection(db, 'chats', chatId, 'messages'),
      orderBy('timestamp', 'asc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Handle serverTimestamp pending state
        timestamp: doc.data().timestamp ? doc.data().timestamp.toDate().toISOString() : new Date().toISOString()
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [guideId, user, chatId]);

  const handleSend = async () => {
    if (!input.trim() || !user) return;
    const textToSend = input;
    setInput('');
    try {
      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        text: textToSend,
        senderId: user.uid,
        timestamp: serverTimestamp(),
        read: false,
      });

      // Simulate a mock reply for demonstration purposes if desired
      setTimeout(async () => {
        await addDoc(collection(db, 'chats', chatId, 'messages'), {
          text: "Thanks for your message! I'm currently reviewing your request.",
          senderId: guideId,
          timestamp: serverTimestamp(),
          read: true,
        });
      }, 3000);

    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' });
  };

  if (!user) {
    return (
      <main className="pt-20 h-screen bg-dark-900 flex flex-col items-center justify-center p-4">
        <h2 className="text-xl text-cream mb-4 font-heading">Please log in to chat</h2>
        <Link to="/login" className="btn-gold">Go to Login</Link>
      </main>
    );
  }

  if (loading || !guide) {
    return (
      <main className="pt-20 h-screen bg-dark-900 flex flex-col items-center justify-center p-4">
         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
      </main>
    );
  }

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
            const isMine = msg.senderId === user.uid;
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
