import { Link } from 'react-router-dom';
import { XCircle, ArrowLeft, HelpCircle } from 'lucide-react';
import ScrollReveal from '../components/common/ScrollReveal';

export default function PaymentCancel() {
  return (
    <main className="pt-20 min-h-screen bg-dark-800 flex items-center justify-center p-4">
      <ScrollReveal className="max-w-md w-full">
        <div className="card-dark p-8 sm:p-12 text-center border-red-500/20 relative">
          <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-8 border border-red-500/20">
            <XCircle size={40} className="text-red-500" />
          </div>

          <h1 className="font-heading text-3xl font-bold text-cream mb-4">Payment Cancelled</h1>
          <p className="text-muted text-lg mb-10">
            Your booking was not confirmed. No charges were made to your account.
          </p>

          <div className="bg-dark-600/50 rounded-2xl p-6 mb-10 text-left border border-dark-500">
            <h3 className="text-cream text-sm font-semibold mb-3 flex items-center gap-2">
              <HelpCircle size={16} className="text-gold" /> Need help?
            </h3>
            <p className="text-muted text-sm leading-relaxed">
              If you had trouble with the payment, you can try another card or contact us for assistance.
            </p>
          </div>

          <div className="space-y-4">
            <Link to="/search" className="btn-gold w-full py-4 flex items-center justify-center gap-2">
              <ArrowLeft size={18} />
              Try Again
            </Link>
            <Link to="/" className="btn-ghost w-full py-4">
              Back to Home
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </main>
  );
}
