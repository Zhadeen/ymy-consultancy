import ScrollReveal from '../components/common/ScrollReveal';

export default function HelpCenterPage() {
  return (
    <main className="pt-28 pb-20 min-h-screen bg-dark-900 px-4">
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-cream mb-4">Help Center</h1>
            <p className="text-muted text-lg">How can we assist you with your YMY Consultancy experience?</p>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <div className="card-dark p-8 md:p-12 space-y-8 text-cream/90 leading-relaxed font-body">
            <div>
              <h2 className="text-xl font-heading font-semibold text-gold mb-3">Booking a Tour</h2>
              <p>To book a tour, simply navigate to the Explore page, select your preferred local guide, and choose an available date from their calendar. Once requested, the guide will have 24 hours to confirm.</p>
            </div>
            <div>
              <h2 className="text-xl font-heading font-semibold text-gold mb-3">Contacting your Guide</h2>
              <p>After booking, you can communicate directly with your guide via our secure in-app chat. Go to your Dashboard and select the specific booking to view your chat messages.</p>
            </div>
            <div>
              <h2 className="text-xl font-heading font-semibold text-gold mb-3">Contact YMY Support</h2>
              <p>Need urgent assistance? Our global support team is available 24/7. Please email us at <a href="mailto:support@ymyconsultancy.com" className="text-gold hover:underline">support@ymyconsultancy.com</a> or use the support module in your dashboard.</p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </main>
  );
}
