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
              <h2 className="text-xl font-heading font-semibold text-gold mb-3">Standard Experience Guidelines</h2>
              <p>Because plans can change unexpectedly, reservations via the YMY Local Guide Platform can be canceled without penalty up to 24 hours before the scheduled start time for a 100% full refund to your original payment method. The 15% platform service fee is included in this refund.</p>
            </div>
            <div>
              <h2 className="text-xl font-heading font-semibold text-gold mb-3">Late Cancellations</h2>
              <p>Cancellations made less than 24 hours prior to the scheduled start time or "no-shows" are non-refundable. This policy ensures our Local Guides are fairly compensated for their reserved time and preparation.</p>
            </div>
            <div>
              <h2 className="text-xl font-heading font-semibold text-gold mb-3">Local Guide Cancellations</h2>
              <p>In the rare event a confirmed Local Guide must cancel an experience, Travelers will always receive an immediate 100% refund of the full amount paid, including all fees.</p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </main>
  );
}
