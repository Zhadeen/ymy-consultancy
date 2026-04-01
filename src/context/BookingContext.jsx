import { createContext, useContext, useState } from 'react';
import { collection, addDoc, doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const [booking, setBooking] = useState({
    guideId: null,
    guideName: '',
    date: '',
    tourType: 'full',
    guests: 1,
    totalPrice: 0,
    specialRequests: '',
  });
  const [confirmed, setConfirmed] = useState(null);
  const [error, setError] = useState(null);

  const updateBooking = (updates) => {
    setBooking(prev => ({ ...prev, ...updates }));
  };

  const generateReference = () => {
    return 'YMY-' + Math.random().toString(36).substr(2, 6).toUpperCase();
  };

  const createPendingBooking = async (bookingData) => {
    try {
      const reference = generateReference();
      const pendingBooking = {
        guideId: bookingData.guideId,
        guideName: bookingData.guideName,
        guidePhoto: bookingData.guidePhoto || '',
        guideUid: bookingData.guideUid || '',
        visitorId: bookingData.visitorId,
        visitorName: bookingData.visitorName,
        visitorEmail: bookingData.visitorEmail,
        date: bookingData.date,
        tourType: bookingData.tourType,
        guests: parseInt(bookingData.guests),
        totalPrice: parseFloat(bookingData.totalPrice),
        visitPurpose: bookingData.visitPurpose || '',
        localExperience: bookingData.localExperience || '',
        specialRequests: bookingData.specialRequests || '',
        reference,
        status: 'pending',
        paymentStatus: 'unpaid',
        createdAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, 'bookings'), pendingBooking);
      
      // Notify guide about the request
      const requestText = `Hi ${bookingData.guideName}! I just sent a booking request for a ${bookingData.tourType} experience on ${new Date(bookingData.date).toLocaleDateString()}. Please check your dashboard to accept or decline!`;
      await sendAutomatedBookingMessage({
        userId: bookingData.visitorId,
        guideId: bookingData.guideUid || bookingData.guideId, // Use auth UID for chat
        visitorName: bookingData.visitorName,
        guideName: bookingData.guideName,
        guidePhoto: bookingData.guidePhoto || ''
      }, requestText);

      return docRef.id;
    } catch (err) {
      console.error('Error creating pending booking:', err);
      throw err;
    }
  };

  const sendAutomatedBookingMessage = async (metadata, customText = null) => {
    try {
      const { userId, guideId, visitorName, guideName, tourType, bookingDate, guidePhoto } = metadata;
      if (!userId || !guideId) return;

      const chatId = [userId, guideId].sort().join('_');
      const text = customText || `Hi ${guideName}! I just booked you for a ${tourType} experience on ${new Date(bookingDate).toLocaleDateString()}. Looking forward to meeting you!`;

      // 1. Add the message to the subcollection
      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        text,
        senderId: userId,
        timestamp: new Date(),
        read: false,
        isSystem: true // Mark as automated
      });

      // 2. Update the chat main document (metadata)
      await setDoc(doc(db, 'chats', chatId), {
        participants: [userId, guideId],
        lastMessage: text,
        updatedAt: new Date(),
        [userId]: { name: visitorName, photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200' },
        [guideId]: { name: guideName, photo: guidePhoto || '' }
      }, { merge: true });

      console.log(`[Notification] Automated message sent for chatId: ${chatId}`);
    } catch (err) {
      console.error('Error sending automated booking message:', err);
    }
  };

  const savePaidBooking = async (metadata) => {
    try {
      if (metadata.bookingId) {
        // Handle deferred payment execution (updating existing pending/accepted booking)
        const docRef = doc(db, 'bookings', metadata.bookingId);
        const existingSnap = await getDoc(docRef);
        
        if (existingSnap.exists()) {
          const finalBooking = { ...existingSnap.data(), paymentStatus: 'paid', status: 'on_the_way', paidAt: new Date().toISOString() };
          await updateDoc(docRef, { paymentStatus: 'paid', status: 'on_the_way', paidAt: finalBooking.paidAt });
          
          // Send payment confirmation message
          const confirmationText = `Payment Confirmed! ✅ I have successfully completed the payment for my booking. I'm excited for our session!`;
          await sendAutomatedBookingMessage(metadata, confirmationText);
          
          setConfirmed({ id: metadata.bookingId, ...finalBooking });
          setError(null);
          return finalBooking;
        }
      }

      // Fallback for direct checkout overrides
      const reference = generateReference();
      const finalBooking = {
        guideId: metadata.guideId,
        guideName: metadata.guideName,
        guidePhoto: metadata.guidePhoto || '',
        visitorId: metadata.userId,
        visitorName: metadata.visitorName,
        visitorEmail: metadata.visitorEmail,
        date: metadata.bookingDate,
        tourType: metadata.tourType,
        guests: parseInt(metadata.guests),
        totalPrice: parseFloat(metadata.totalPrice),
        visitPurpose: metadata.visitPurpose || '',
        localExperience: metadata.localExperience || '',
        specialRequests: metadata.specialRequests || '',
        reference,
        status: 'on_the_way', // directly to on_the_way after paid
        paymentStatus: 'paid',
        createdAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, 'bookings'), finalBooking);
      
      const confirmationText = `Payment Confirmed! ✅ I have successfully completed the payment for my booking. I'm excited for our session!`;
      await sendAutomatedBookingMessage(metadata, confirmationText);

      setConfirmed({ id: docRef.id, ...finalBooking });
      setError(null);
      return finalBooking;
    } catch (err) {
      console.error('Error saving paid booking:', err);
      setError(err.message);
      throw err;
    }
  };

  const resetBooking = () => {
    setBooking({ guideId: null, guideName: '', date: '', tourType: 'full', guests: 1, totalPrice: 0, specialRequests: '' });
    setConfirmed(null);
  };

  return (
    <BookingContext.Provider value={{ booking, confirmed, error, updateBooking, createPendingBooking, savePaidBooking, resetBooking }}>
      {children}
    </BookingContext.Provider>
  );
}


export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) throw new Error('useBooking must be used within BookingProvider');
  return context;
};
