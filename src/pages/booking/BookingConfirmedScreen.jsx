import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import ScrollReveal from '../../components/common/ScrollReveal';

export default function BookingConfirmedScreen({ confirmed, totalPrice }) {
  return (
    <main className="pt-20 min-h-screen bg-dark-800 flex items-center justify-center p-4">
      <ScrollReveal>
        <div className="card-dark max-w-lg w-full p-8 text-center border-gold-200">
          <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={32} className="text-green-500" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-cream mb-2">Booking Confirmed!</h1>
          <p className="text-muted mb-8 text-sm">
            Your booking with <span className="text-cream font-medium">{confirmed.guideName}</span> on {new Date(confirmed.date).toLocaleDateString()} has been successfully processed.
          </p>

          <div className="bg-dark-900 rounded-xl p-6 mb-8 text-left border border-dark-600/50">
            <h3 className="text-gold font-heading font-bold mb-3 flex items-center gap-2">
              <CheckCircle2 size={18} /> Payment Received
            </h3>
            <p className="text-cream text-sm mb-4 leading-relaxed">
              Your payment of <span className="text-gold font-bold">${totalPrice}</span> was successful. The Local Guide has been notified.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Link to={`/chat/${confirmed.guideUid}`} className="btn-gold w-full flex items-center justify-center gap-2">
              Chat with Local Guide
            </Link>
            <Link to="/dashboard" className="text-muted hover:text-cream text-sm font-medium">
              Go to Visitor Dashboard
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </main>
  );
}
