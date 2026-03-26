import ScrollReveal from '../components/common/ScrollReveal';

export default function PrivacyPage() {
  return (
    <main className="pt-28 pb-20 min-h-screen bg-dark-900 px-4">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-cream mb-4">Privacy Policy</h1>
            <p className="text-muted text-lg">How we collect and manage your personal data.</p>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <div className="card-dark p-8 md:p-12 space-y-8 text-cream/90 leading-relaxed font-body">
            <div>
              <h2 className="text-xl font-heading font-semibold text-gold mb-3">Data Collection</h2>
              <p>We receive and collect information you provide directly to us when setting up an account, communicating with a guide, or booking travel. This safely comprises name, email, encrypted passwords, payment details, and geolocation necessary for city-specific searches.</p>
            </div>
            <div>
              <h2 className="text-xl font-heading font-semibold text-gold mb-3">Cookies & Analytics</h2>
              <p>YMY Consultancy utilizes local storage and first-party cookies to remember your authenticated session across multiple visits. We deploy anonymized analytics to measure site traffic trends and continuously improve user experience.</p>
            </div>
            <div>
              <h2 className="text-xl font-heading font-semibold text-gold mb-3">Information Sharing</h2>
              <p>We do not sell personal data to advertisers under any circumstances. Minimum necessary data is shared with your booked Local Guide to safely facilitate the rendezvous, and secure payment processing strings to Stripe.</p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </main>
  );
}
