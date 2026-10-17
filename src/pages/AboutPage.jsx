import { Link } from 'react-router-dom';
import { Search, CalendarCheck, MapPin, ShieldCheck, CreditCard, Users } from 'lucide-react';
import Seo from '../seo/Seo';
import { ROUTE_META, SITE } from '../config/site';
import { LEGAL } from '../config/legal';
import { breadcrumbLd } from '../seo/jsonLd';
import Breadcrumbs from '../components/conversion/Breadcrumbs';
import CTA from '../components/conversion/CTA';
import { renderText } from '../components/legal/renderText';

// About page — required by iyzico's merchant website criteria. Copy describes
// only how the platform actually works; company identifiers come from LEGAL and
// stay as highlighted [OWNER MUST PROVIDE: …] placeholders until supplied.
const PATH = '/about';

const STEPS = [
  { icon: Search, title: 'Find a guide', text: 'Browse verified local guides by city, language, specialty and price, and read their profiles.' },
  { icon: CalendarCheck, title: 'Book and pay securely', text: 'Choose a date and pay online. Your booking confirmation appears straight away in your dashboard.' },
  { icon: MapPin, title: 'Meet your guide', text: 'Message your guide to agree the details, then enjoy a private experience led by someone who lives there.' },
];

const PRINCIPLES = [
  { icon: ShieldCheck, title: 'Verified guides', text: 'Every guide submits a government identity document, which our team reviews before their profile goes live.' },
  { icon: CreditCard, title: 'Transparent pricing', text: 'Prices are shown before you pay. YMY keeps a 15% platform fee; the guide receives 85% of each booking.' },
  { icon: Users, title: 'Independent locals', text: 'Guides are independent professionals who set their own offers, so travelers book real local expertise directly.' },
];

export default function AboutPage() {
  const meta = ROUTE_META[PATH];
  const crumbs = [{ name: 'Home', path: '/' }, { name: 'About Us', path: PATH }];
  const c = LEGAL.company;
  const details = [
    ['Legal name', c.entityName],
    ['Trading name', c.tradingName],
    ['Registered address', c.address],
    ['Tax office / number', `${c.taxOffice} / ${c.taxNumber}`],
    ...(c.mersis ? [['MERSİS number', c.mersis]] : []),
    ['Email', SITE.contact.email || c.generalEmail],
    ['Phone', SITE.contact.phone || c.phone],
  ];

  return (
    <main className="pt-28 pb-20 min-h-screen bg-dark-900 px-4">
      <Seo
        title={meta.title}
        description={meta.description}
        path={PATH}
        image={meta.og}
        jsonLd={[breadcrumbLd(crumbs)]}
      />
      <div className="max-w-4xl mx-auto">
        <Breadcrumbs items={crumbs} />

        <header className="mt-4 mb-14">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-cream mb-4">About YMY</h1>
          <p className="text-muted text-lg leading-relaxed max-w-2xl">
            YMY Consultancy runs an online marketplace that connects travelers with verified,
            independent local guides for private, authentic experiences, booked and paid for directly on our website.
          </p>
        </header>

        <section className="mb-14" aria-labelledby="how-heading">
          <h2 id="how-heading" className="text-2xl font-heading font-semibold text-gold mb-6">How it works</h2>
          <ol className="grid gap-4 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <li key={step.title} className="card-dark p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-9 h-9 rounded-full bg-gold/15 text-gold flex items-center justify-center" aria-hidden="true">
                    <step.icon size={18} />
                  </span>
                  <span className="text-muted-dark text-xs font-semibold tracking-wider">STEP {i + 1}</span>
                </div>
                <h3 className="text-cream font-semibold mb-1.5">{step.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{step.text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mb-14" aria-labelledby="principles-heading">
          <h2 id="principles-heading" className="text-2xl font-heading font-semibold text-gold mb-6">What we stand for</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {PRINCIPLES.map((item) => (
              <div key={item.title} className="card-dark p-6">
                <item.icon size={20} className="text-gold mb-3" aria-hidden="true" />
                <h3 className="text-cream font-semibold mb-1.5">{item.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-14 card-dark p-6 md:p-8 flex flex-col sm:flex-row gap-6 items-start" aria-labelledby="founder-heading">
          {SITE.founder.photo && (
            <img
              src={SITE.founder.photo}
              alt={SITE.founder.name}
              width="96"
              height="96"
              className="w-24 h-24 rounded-full object-cover shrink-0"
            />
          )}
          <div>
            <h2 id="founder-heading" className="text-2xl font-heading font-semibold text-gold mb-1">Who runs YMY</h2>
            <p className="text-cream font-semibold">{SITE.founder.name}, {SITE.founder.role}</p>
            <p className="text-muted leading-relaxed mt-2">
              {SITE.founder.bio
                ? SITE.founder.bio
                : renderText('[OWNER MUST PROVIDE: 1–3 sentence founder bio]')}
            </p>
          </div>
        </section>

        <section className="mb-14" aria-labelledby="company-heading">
          <h2 id="company-heading" className="text-2xl font-heading font-semibold text-gold mb-6">Company information</h2>
          <dl className="card-dark divide-y divide-dark-600/60">
            {details.map(([label, value]) => (
              <div key={label} className="grid sm:grid-cols-3 gap-1 sm:gap-4 px-6 py-4">
                <dt className="text-muted-dark text-sm">{label}</dt>
                <dd className="sm:col-span-2 text-cream/90 text-sm break-words">{renderText(value)}</dd>
              </div>
            ))}
            <div className="grid sm:grid-cols-3 gap-1 sm:gap-4 px-6 py-4">
              <dt className="text-muted-dark text-sm">WhatsApp</dt>
              <dd className="sm:col-span-2 text-sm">
                <a href={`https://wa.me/${SITE.contact.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">
                  +{SITE.contact.whatsapp}
                </a>
              </dd>
            </div>
          </dl>
          <p className="text-muted text-sm mt-4">
            Read our <Link to="/distance-sales-contract" className="text-gold hover:underline">Distance Sale Contract</Link>,{' '}
            <Link to="/refunds" className="text-gold hover:underline">Delivery, Cancellation &amp; Refund Policy</Link> and{' '}
            <Link to="/privacy" className="text-gold hover:underline">Privacy Policy</Link>, or{' '}
            <Link to="/contact" className="text-gold hover:underline">contact us</Link>.
          </p>
        </section>

        <CTA align="left" />
      </div>
    </main>
  );
}
