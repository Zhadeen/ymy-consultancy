import ScrollReveal from '../../components/common/ScrollReveal';
import { calculatePlatformFee } from '../../domain/pricing';
import { BOOKING_STATUS } from '../../domain/constants/bookingStatus';

export default function BookingsTab({ bookings }) {
  return (
    <div>
      <ScrollReveal>
        <h1 className="font-heading text-3xl font-bold text-cream mb-6">Marketplace Bookings</h1>
      </ScrollReveal>

      <ScrollReveal delay={80}>
        <div className="card-dark overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-600">
                  <th className="text-left text-xs text-muted uppercase tracking-wider font-medium px-5 py-4">Ref</th>
                  <th className="text-left text-xs text-muted uppercase tracking-wider font-medium px-5 py-4">Traveler</th>
                  <th className="text-left text-xs text-muted uppercase tracking-wider font-medium px-5 py-4">Guide</th>
                  <th className="text-left text-xs text-muted uppercase tracking-wider font-medium px-5 py-4">Date</th>
                  <th className="text-left text-xs text-muted uppercase tracking-wider font-medium px-5 py-4">Total</th>
                  <th className="text-left text-xs text-muted uppercase tracking-wider font-medium px-5 py-4 text-gold">15% Fee</th>
                  <th className="text-left text-xs text-muted uppercase tracking-wider font-medium px-5 py-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-5 py-10 text-center text-muted">No bookings found in the marketplace.</td>
                  </tr>
                ) : (
                  bookings.map((booking) => (
                    <tr key={booking.id} className="border-b border-dark-700/50 hover:bg-dark-700/30 transition-colors text-sm">
                      <td className="px-5 py-4 font-mono text-gold font-bold">{booking.reference}</td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col">
                          <span className="text-cream font-medium">{booking.visitorName}</span>
                          <span className="text-xs text-muted-dark">{booking.visitorEmail}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-cream">{booking.guideName}</td>
                      <td className="px-5 py-4 text-muted">{new Date(booking.date).toLocaleDateString()}</td>
                      <td className="px-5 py-4 text-cream font-bold">${booking.totalPrice}</td>
                      <td className="px-5 py-4 text-gold font-bold">${calculatePlatformFee(booking.totalPrice).toFixed(2)}</td>
                      <td className="px-5 py-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest ${
                          booking.status === BOOKING_STATUS.UPCOMING ? 'bg-gold/10 text-gold' : 'bg-green-500/10 text-green-400'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
