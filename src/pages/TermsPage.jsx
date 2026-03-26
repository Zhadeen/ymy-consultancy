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
              <p>By registering for, accessing, browsing, or using the YMY Consultancy Marketplace, you acknowledge that you have read, understood, and agree to be bound by the following terms and conditions.</p>
            </div>
            <div>
              <h2 className="text-xl font-heading font-semibold text-gold mb-3">2. Service Usage</h2>
              <p>Our platform operates simply as a connective layer granting tourists access to freelance, expert guides. YMY Consultancy itself does not coordinate physical tours, transport logistics, or assume liability for circumstances experienced during a booking connection.</p>
            </div>
            <div>
              <h2 className="text-xl font-heading font-semibold text-gold mb-3">3. Payments & Adjustments</h2>
              <p>The platform initiates holding fees immediately upon a tourist completing checkout. These funds are paid out to Local Guides shortly after a completed tour experience. Refer to our specific cancellation policy if obligations change.</p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </main>
  );
}
