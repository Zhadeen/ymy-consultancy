import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Send, MessageCircle } from 'lucide-react';
import Seo from '../seo/Seo';
import { ROUTE_META, SITE } from '../config/site';
import { breadcrumbLd } from '../seo/jsonLd';
import Breadcrumbs from '../components/conversion/Breadcrumbs';
import ResponseTimePromise from '../components/conversion/ResponseTimePromise';

const CRUMBS = [{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact' }];

export default function ContactPage() {
  const meta = ROUTE_META['/contact'];
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', message: '', company: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Could not send your message. Please try again.');
      }
      navigate('/thank-you');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const whatsappUrl = SITE.contact.whatsapp ? `https://wa.me/${SITE.contact.whatsapp}` : null;

  return (
    <main className="pt-28 pb-20 min-h-screen bg-dark-900 px-4">
      <Seo title={meta.title} description={meta.description} path="/contact" image={meta.og} jsonLd={[breadcrumbLd(CRUMBS)]} />
      <div className="max-w-2xl mx-auto">
        <Breadcrumbs items={CRUMBS} />
        <h1 className="font-heading text-4xl md:text-5xl font-bold text-cream mt-4 mb-3">Contact us</h1>
        <p className="text-muted text-lg mb-2">
          Questions about booking a guide, becoming a guide, or partnerships? Send a message.
        </p>
        <ResponseTimePromise className="mb-8" />

        <form onSubmit={handleSubmit} className="card-dark p-6 sm:p-8 space-y-5" noValidate>
          <div>
            <label htmlFor="c-name" className="block text-sm font-medium text-muted mb-2">Your name</label>
            <input id="c-name" type="text" required value={form.name} onChange={update('name')} className="input-dark w-full" autoComplete="name" />
          </div>
          <div>
            <label htmlFor="c-email" className="block text-sm font-medium text-muted mb-2">Email</label>
            <input id="c-email" type="email" required value={form.email} onChange={update('email')} className="input-dark w-full" autoComplete="email" />
          </div>
          <div>
            <label htmlFor="c-message" className="block text-sm font-medium text-muted mb-2">Message</label>
            <textarea id="c-message" required rows={5} value={form.message} onChange={update('message')} className="input-dark w-full resize-none" />
          </div>

          {/* Honeypot: hidden from users, ignored by them, filled by bots. */}
          <input
            type="text" tabIndex={-1} autoComplete="off" value={form.company} onChange={update('company')}
            className="hidden" aria-hidden="true"
            name="company"
          />

          {error && <p className="text-red-400 text-sm" role="alert">{error}</p>}

          <button type="submit" disabled={loading} className="btn-gold w-full inline-flex items-center justify-center gap-2 py-3 disabled:opacity-50">
            {loading ? 'Sending…' : <><Send size={18} aria-hidden="true" /> Send message</>}
          </button>
        </form>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 text-sm">
          {SITE.contact.email && (
            <a href={`mailto:${SITE.contact.email}`} className="inline-flex items-center gap-2 text-muted hover:text-gold">
              <Mail size={16} aria-hidden="true" /> {SITE.contact.email}
            </a>
          )}
          {whatsappUrl && (
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-muted hover:text-gold">
              <MessageCircle size={16} aria-hidden="true" /> WhatsApp
            </a>
          )}
        </div>
      </div>
    </main>
  );
}
