export const BOOKING_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  CONFIRMED: 'confirmed',
  UPCOMING: 'upcoming',
  ON_THE_WAY: 'on_the_way',
  ARRIVED: 'arrived',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  DECLINED: 'declined',
};

// Mirrors GuideDashboard's existing "not yet completed/declined" grouping.
export const ACTIVE_BOOKING_STATUSES = [
  BOOKING_STATUS.PENDING,
  BOOKING_STATUS.ACCEPTED,
  BOOKING_STATUS.ON_THE_WAY,
  BOOKING_STATUS.ARRIVED,
  BOOKING_STATUS.IN_PROGRESS,
  BOOKING_STATUS.UPCOMING,
  BOOKING_STATUS.CONFIRMED,
];

// Mirrors GuideDashboard/AdminPanel's existing "post-payment" grouping.
export const PAID_BOOKING_STATUSES = [
  BOOKING_STATUS.ON_THE_WAY,
  BOOKING_STATUS.ARRIVED,
  BOOKING_STATUS.IN_PROGRESS,
  BOOKING_STATUS.COMPLETED,
];
