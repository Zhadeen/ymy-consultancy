import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft, MessageSquare } from 'lucide-react';
import ScrollReveal from '../components/common/ScrollReveal';

export default function ChatInbox() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', user.uid),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const activeChats = snapshot.docs.map(doc => {
        const data = doc.data();
        const peerId = data.participants.find(id => id !== user.uid) || data.participants[0];
        const peerData = data[peerId] || { name: 'Unknown', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200' };

        return {
          id: doc.id,
          peerId,
          peerName: peerData.name,
          peerPhoto: peerData.photo,
          lastMessage: data.lastMessage,
          updatedAt: data.updatedAt?.toDate() || new Date()
        };
      });
      setChats(activeChats);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching chats:", err);
      if (err.message.includes('requires an index')) {
        console.warn("Please create the required index in Firebase Console.");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (!user) {
    return (
      <main className="pt-20 h-screen bg-dark-900 flex flex-col items-center justify-center p-4">
        <h2 className="text-xl text-cream mb-4 font-heading">Please log in to view messages</h2>
        <Link to="/login" className="btn-gold">Go to Login</Link>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="pt-20 min-h-screen flex items-center justify-center bg-dark-800">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </main>
    );
  }

  return (
    <main className="pt-20 min-h-screen bg-dark-800 flex flex-col">
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 flex-1">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="text-muted hover:text-gold transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h1 className="font-heading text-3xl font-bold text-cream">Messages</h1>
        </div>

        <ScrollReveal>
          <div className="bg-dark-900 rounded-2xl border border-dark-600 overflow-hidden">
            {chats.length > 0 ? (
              <div className="divide-y divide-dark-600/50">
                {chats.map((chat) => (
                  <Link
                    key={chat.id}
                    to={`/chat/${chat.peerId}`}
                    className="flex items-center gap-4 p-4 sm:p-6 hover:bg-dark-700/50 transition-colors block"
                  >
                    <img src={chat.peerPhoto} alt={chat.peerName} className="w-14 h-14 rounded-full object-cover border border-dark-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <h3 className="text-cream font-semibold truncate text-lg pr-4">{chat.peerName}</h3>
                        <span className="text-xs text-muted-dark whitespace-nowrap flex-shrink-0">
                          {chat.updatedAt.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-muted text-sm truncate">{chat.lastMessage}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-muted flex flex-col items-center">
                <MessageSquare size={48} className="text-dark-500 mb-4" />
                <p className="text-lg mb-2 text-cream">No messages yet</p>
                <p className="text-sm">When you message a guide or a tourist messages you, it will appear here.</p>
              </div>
            )}
          </div>
        </ScrollReveal>
      </div>
    </main>
  );
}
