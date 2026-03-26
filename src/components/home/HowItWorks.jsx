import { Search, Calendar, Compass } from 'lucide-react';
import ScrollReveal from '../common/ScrollReveal';

const steps = [
  {
    icon: Search,
    number: '01',
    title: 'Search & Discover',
    description: 'Browse verified guides by city, language, and specialty. Read reviews, view portfolios, and find your perfect match.',
  },
  {
    icon: Calendar,
    number: '02',
    title: 'Book Instantly',
    description: 'Choose your date, tour type, and confirm in seconds. Secure payment, instant confirmation, zero hassle.',
  },
  {
    icon: Compass,
    number: '03',
    title: 'Explore & Enjoy',
    description: 'Meet your guide and experience the destination like a local. Authentic stories, hidden gems, unforgettable memories.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section-padding bg-dark-900">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal className="text-center mb-16">
          <span className="text-gold text-sm font-semibold uppercase tracking-[0.2em] mb-4 block">Simple Process</span>
          <h2 className="font-heading text-4xl sm:text-5xl font-bold text-cream mb-6">
            How It Works
          </h2>
          <div className="gold-divider mx-auto mb-6" />
          <p className="text-muted max-w-2xl mx-auto text-lg">
            From search to adventure in under 60 seconds. We've eliminated every friction point.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <ScrollReveal key={step.number} delay={i * 80}>
              <div className="relative group">
                <div className="card-dark p-8 sm:p-10 text-center h-full">
                  {/* Step number */}
                  <div className="text-6xl font-heading font-bold text-dark-600 group-hover:text-gold-100 transition-colors duration-500 mb-4">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-gold-100 flex items-center justify-center mx-auto mb-6 group-hover:bg-gold-200 transition-all duration-500 group-hover:scale-110">
                    <step.icon size={28} className="text-gold" />
                  </div>

                  {/* Content */}
                  <h3 className="font-heading text-xl font-semibold text-cream mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Connector line (hidden on last) */}
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 border-t border-dashed border-gold-200" />
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
