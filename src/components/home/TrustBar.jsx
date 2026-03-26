import { ShieldCheck, CreditCard, Headphones } from 'lucide-react';
import ScrollReveal from '../common/ScrollReveal';

const trustItems = [
  {
    icon: ShieldCheck,
    title: 'Verified Guides',
    description: 'Every guide is background-checked, licensed, and reviewed by real travelers.',
  },
  {
    icon: CreditCard,
    title: 'Secure Payments',
    description: 'End-to-end encrypted transactions. Pay safely, get instant confirmation.',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Our team is always available. Before, during, and after your tour.',
  },
];

export default function TrustBar() {
  return (
    <section className="py-20 bg-dark-900 border-y border-dark-600/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trustItems.map((item, i) => (
            <ScrollReveal key={item.title} delay={i * 80}>
              <div className="flex items-start gap-4 p-6">
                <div className="w-14 h-14 rounded-2xl bg-gold-100 flex items-center justify-center flex-shrink-0">
                  <item.icon size={26} className="text-gold" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-cream mb-1">{item.title}</h3>
                  <p className="text-muted text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
