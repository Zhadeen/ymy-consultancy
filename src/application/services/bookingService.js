import { BOOKING_STATUS } from '../../domain/constants/bookingStatus';
import { createBooking, getBookingById, updateBooking as updateBookingRecord } from '../../infrastructure/firebase/repositories/bookingsRepository';
import { addMessage, upsertChatMeta } from '../../infrastructure/firebase/repositories/messagesRepository';

const PEER_FALLBACK_PHOTO = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200';

export function generateReference() {
  return 'YMY-' + Math.random().toString(36).substr(2, 6).toUpperCase();
}

// Never throws — a failed notification shouldn't block the booking/payment flow it's attached to.
export async function sendAutomatedBookingMessage(metadata, customText = null) {
  try {
    const { userId, guideId, visitorName, guideName, tourType, bookingDate, guidePhoto } = metadata;
    if (!userId || !guideId) return;

    const chatId = [userId, guideId].sort().join('_');
    const text = customText || `Hi ${guideName}! I just booked you for a ${tourType} experience on ${new Date(bookingDate).toLocaleDateString()}. Looking forward to meeting you!`;

    await addMessage(chatId, {
      text,
      senderId: userId,
      timestamp: new Date(),
      read: false,
      isSystem: true, // Mark as automated
    });

    await upsertChatMeta(chatId, {
      participants: [userId, guideId],
      lastMessage: text,
      updatedAt: new Date(),
      [userId]: { name: visitorName, photo: PEER_FALLBACK_PHOTO },
      [guideId]: { name: guideName, photo: guidePhoto || '' },
    });

    console.log(`[Notification] Automated message sent for chatId: ${chatId}`);
  } catch (err) {
    console.error('Error sending automated booking message:', err);
  }
}

export async function createPendingBooking(bookingData) {
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
      status: BOOKING_STATUS.PENDING,
      paymentStatus: 'unpaid',
      createdAt: new Date().toISOString(),
    };

    const bookingId = await createBooking(pendingBooking);

    // Notify guide about the request
    const requestText = `Hi ${bookingData.guideName}! I just sent a booking request for a ${bookingData.tourType} experience on ${new Date(bookingData.date).toLocaleDateString()}. Please check your dashboard to accept or decline!`;
    await sendAutomatedBookingMessage({
      userId: bookingData.visitorId,
      guideId: bookingData.guideUid || bookingData.guideId, // Use auth UID for chat
      visitorName: bookingData.visitorName,
      guideName: bookingData.guideName,
      guidePhoto: bookingData.guidePhoto || '',
    }, requestText);

    return bookingId;
  } catch (err) {
    console.error('Error creating pending booking:', err);
    throw err;
  }
}

// Returns the final booking (with id) on success; throws on failure. Caller owns React state.
export async function savePaidBooking(metadata) {
  if (metadata.bookingId) {
    // Handle deferred payment execution (updating existing pending/accepted booking)
    const existing = await getBookingById(metadata.bookingId);

    if (existing) {
      const finalBooking = { ...existing, paymentStatus: 'paid', status: BOOKING_STATUS.ON_THE_WAY, paidAt: new Date().toISOString() };
      await updateBookingRecord(metadata.bookingId, { paymentStatus: 'paid', status: BOOKING_STATUS.ON_THE_WAY, paidAt: finalBooking.paidAt });

      // Send payment confirmation message
      const confirmationText = `Payment Confirmed! ✅ I have successfully completed the payment for my booking. I'm excited for our session!`;
      await sendAutomatedBookingMessage(metadata, confirmationText);

      return { id: metadata.bookingId, ...finalBooking };
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
    status: BOOKING_STATUS.ON_THE_WAY, // directly to on_the_way after paid
    paymentStatus: 'paid',
    createdAt: new Date().toISOString(),
  };

  const bookingId = await createBooking(finalBooking);

  const confirmationText = `Payment Confirmed! ✅ I have successfully completed the payment for my booking. I'm excited for our session!`;
  await sendAutomatedBookingMessage(metadata, confirmationText);

  return { id: bookingId, ...finalBooking };
}
