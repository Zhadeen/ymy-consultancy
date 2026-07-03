import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { subscribeToUserChats } from '../infrastructure/firebase/repositories/messagesRepository';

export function useUnreadCount() {
  const { user } = useAuth();
  const [totalUnread, setTotalUnread] = useState(0);

  useEffect(() => {
    if (!user) {
      setTotalUnread(0);
      return;
    }

    const unsubscribe = subscribeToUserChats(user.uid, (chats) => {
      let count = 0;
      chats.forEach(data => {
        if (data.unreadCount && data.unreadCount[user.uid]) {
          count += data.unreadCount[user.uid];
        }
      });
      setTotalUnread(count);
    }, (error) => {
      console.error("Error fetching unread count:", error);
    });

    return () => unsubscribe();
  }, [user]);

  return totalUnread;
}
