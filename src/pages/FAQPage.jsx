import { Link } from 'react-router-dom';
import Seo from '../seo/Seo';
import { ROUTE_META, FAQ } from '../config/site';
import { faqPageLd, breadcrumbLd } from '../seo/jsonLd';
import Breadcrumbs from '../components/conversion/Breadcrumbs';
import FAQSection from '../components/conversion/FAQSection';
import CTA from '../components/conversion/CTA';

const CRUMBS = [{ name: 'Home', path: '/' }, { name: 'FAQ', path: '/faq' }];

export default function FAQPage() {
  const meta = ROUTE_META['/faq'];
  return (
    <main className="pt-28 pb-20 min-h-screen bg-dark-900 px-4">
      <Seo
        title={meta.title}
        description={meta.description}
        path="/faq"
        image={meta.og}
        jsonLd={[faqPageLd(FAQ), breadcrumbLd(CRUMBS)]}
      />
      <div className="max-w-3xl mx-auto">
        <Breadcrumbs items={CRUMBS} />
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-cream mt-4 mb-4">
          Frequently asked questions
        </h1>
        <p className="text-muted text-lg mb-10">
          How booking a local guide on YMY works — payments, cancellations, and becoming a guide.
          Can't find your answer?{' '}
          <Link to="/contact" className="text-gold hover:underline">Contact us</Link>.
        </p>

        <FAQSection items={FAQ} />

        <div className="mt-12">
          <CTA align="left" />
        </div>
      </div>
    </main>
  );
}
