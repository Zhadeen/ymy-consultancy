import ScrollReveal from '../components/common/ScrollReveal';

export default function TermsPage() {
  return (
    <main className="pt-28 pb-20 min-h-screen bg-dark-900 px-4">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-cream mb-4">Terms of Service</h1>
            <p className="text-muted text-lg">The legal agreement governing your use of YMY Consultancy.</p>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <div className="card-dark p-8 md:p-12 space-y-8 text-cream/90 leading-relaxed font-body">
            <div>
              <h2 className="text-xl font-heading font-semibold text-gold mb-3">1. Acceptance of Terms</h2>
              <p>By registering for, accessing, browsing, or using the YMY Local Guide Platform, you acknowledge that you have read, understood, and agree to be bound by the following terms and conditions.</p>
            </div>
            <div>
              <h2 className="text-xl font-heading font-semibold text-gold mb-3">2. Service Usage</h2>
              <p>Our platform operates as a connective layer granting Travelers access to independent Local Guides. YMY Consultancy itself does not coordinate physical tours, transport logistics, or assume liability for circumstances experienced during a booking connection.</p>
            </div>
            <div>
              <h2 className="text-xl font-heading font-semibold text-gold mb-3">3. Payments & Fees</h2>
              <p>The platform retains 15% of each booking fee as a service charge. Payments are processed via Stripe. Local Guides receive 85% of the agreed amount. Full refunds are issued for cancellations made more than 24 hours before the scheduled appointment. Cancellations within 24 hours are non-refundable.</p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </main>
  );
}
