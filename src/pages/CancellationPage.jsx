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
              <h2 className="text-xl font-heading font-semibold text-gold mb-3">Standard Tour Guidelines</h2>
              <p>Because plans can change unexpectedly, reservations via YMY Consultancy can generally be canceled without penalty up to 48 hours before the scheduled start time for a 100% full refund to your original payment method.</p>
            </div>
            <div>
              <h2 className="text-xl font-heading font-semibold text-gold mb-3">Late Cancellations</h2>
              <p>For cancellations made within 24–48 hours before the scheduled start time, a 50% refund will be issued. Cancellations submitted less than 24 hours prior or 'no-shows' will incur an un-refundable 100% cancelation fee paid to your guide.</p>
            </div>
            <div>
              <h2 className="text-xl font-heading font-semibold text-gold mb-3">Guide Cancellations</h2>
              <p>In the rare event a confirmed expert guide must cancel a tour, tourists will always receive an immediate 100% refund alongside platform credit towards an alternative booking.</p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </main>
  );
}
