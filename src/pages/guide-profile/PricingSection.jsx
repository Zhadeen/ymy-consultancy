import ScrollReveal from '../../components/common/ScrollReveal';

export default function PricingSection({ guide }) {
  return (
    <ScrollReveal>
      <h2 className="font-heading text-2xl font-bold text-cream mb-6">Pricing</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Half Day', sublabel: '4 hours', price: guide.priceHalfDay },
          { label: 'Full Day', sublabel: '8 hours', price: guide.priceFullDay, popular: true },
          { label: 'Custom', sublabel: 'Per hour', price: guide.priceCustom },
        ].map(tier => (
          <div
            key={tier.label}
            className={`card-dark p-6 text-center relative ${tier.popular ? 'border-gold' : ''}`}
          >
            {tier.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-dark-900 text-xs font-bold px-3 py-1 rounded-full">
                Most Popular
              </div>
            )}
            <h3 className="font-heading text-lg text-cream font-semibold">{tier.label}</h3>
            <p className="text-muted-dark text-xs mt-1">{tier.sublabel}</p>
            <div className="mt-4">
              <span className="text-3xl font-heading font-bold text-gold">${tier.price}</span>
            </div>
          </div>
        ))}
      </div>
    </ScrollReveal>
  );
}
