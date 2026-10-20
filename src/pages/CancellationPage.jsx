import { Link } from 'react-router-dom';
import ScrollReveal from '../components/common/ScrollReveal';

export default function CancellationPage() {
  return (
    <main className="pt-28 pb-20 min-h-screen bg-dark-900 px-4">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-cream mb-4">Cancellation Policy</h1>
            <p className="text-muted text-lg">Clear and fair conditions for your travel plans.</p>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <div className="card-dark p-8 md:p-12 space-y-8 text-cream/90 leading-relaxed font-body">
            <div>
              <h2 className="text-xl font-heading font-semibold text-gold mb-3">Customer Cancellation</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>More than 72 hours before the booking: 100% refund.</li>
                <li>24–72 hours before the booking: 50% refund.</li>
                <li>Less than 24 hours before the booking: no refund.</li>
                <li>Within 24 hours of booking: full refund, provided the booking is more than 72 hours away.</li>
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-heading font-semibold text-gold mb-3">Rescheduling</h2>
              <p>Customers may request to change their booking date, subject to the local expert’s availability.</p>
            </div>
            <div>
              <h2 className="text-xl font-heading font-semibold text-gold mb-3">If a Local Expert Cancels</h2>
              <p>If a local expert cancels a confirmed booking, the customer will receive a full refund or may choose another available verified expert.</p>
            </div>
            <div>
              <h2 className="text-xl font-heading font-semibold text-gold mb-3">Exceptional Circumstances</h2>
              <p>For serious and unforeseen circumstances such as major travel restrictions, natural disasters, or security emergencies, YMY Cons may offer a full refund or rescheduling.</p>
            </div>
            <p className="text-muted text-sm">
              Full details, including service problems and how refunds are processed, are in our{' '}
              <Link to="/refunds" className="text-gold hover:underline">Delivery, Cancellation &amp; Refund Policy</Link>.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </main>
  );
}
