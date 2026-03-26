import ScrollReveal from '../components/common/ScrollReveal';

export default function SafetyPage() {
  return (
    <main className="pt-28 pb-20 min-h-screen bg-dark-900 px-4">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-cream mb-4">Trust & Safety</h1>
            <p className="text-muted text-lg">Your well-being is our highest priority.</p>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <div className="card-dark p-8 md:p-12 space-y-8 text-cream/90 leading-relaxed font-body">
            <div>
              <h2 className="text-xl font-heading font-semibold text-gold mb-3">Verified Guides</h2>
              <p>Every guide on the YMY Consultancy platform undergoes a stringent verification process. This includes identity checks, background screenings, and professional qualification verification in their corresponding local jurisdictions.</p>
            </div>
            <div>
              <h2 className="text-xl font-heading font-semibold text-gold mb-3">Secure Payments</h2>
              <p>We process all transactions via secure, bank-level encryption. Your payment is held safely until your tour has been successfully completed, protecting you against fraud or unfulfilled services.</p>
            </div>
            <div>
              <h2 className="text-xl font-heading font-semibold text-gold mb-3">Emergency Support</h2>
              <p>If you encounter an emergency during your tour, the YMY app provides a 24/7 emergency hotline button. We remain dedicated to ensuring our travelers explore the world securely.</p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </main>
  );
}
