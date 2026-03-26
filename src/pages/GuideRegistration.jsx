import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Camera, FileText, DollarSign, ChevronRight, ChevronLeft, Globe, CheckCircle2 } from 'lucide-react';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { LANGUAGES, CITIES } from '../data/mockData';
import ScrollReveal from '../components/common/ScrollReveal';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

const steps = ['Personal Info', 'Photo', 'Bio & Languages', 'Pricing', 'Review'];

export default function GuideRegistration() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', phone: '', city: '',
    photo: null, photoPreview: '',
    bio: '', languages: [], specialties: '',
    priceHalfDay: '', priceFullDay: '', priceCustom: '',
  });

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const toggleLanguage = (lang) => {
    setForm(prev => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter(l => l !== lang)
        : [...prev.languages, lang],
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      update('photo', file);
      update('photoPreview', URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    try {
      if (!form.password || form.password.length < 8) {
        setError('Password must be at least 8 characters');
        return;
      }
      // Create user auth with role 'pending_guide'
      const userCredential = await register(`${form.firstName} ${form.lastName}`, form.email, form.password, 'pending_guide');
      const uid = userCredential.user.uid;

      // Save application details to 'guide_applications' collection
      await setDoc(doc(db, 'guide_applications', uid), {
        uid,
        name: `${form.firstName} ${form.lastName}`,
        email: form.email,
        city: form.city,
        phone: form.phone,
        photo: form.photoPreview || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
        bio: form.bio,
        languages: form.languages,
        specialties: form.specialties,
        priceHalfDay: Number(form.priceHalfDay),
        priceFullDay: Number(form.priceFullDay),
        priceCustom: Number(form.priceCustom),
        status: 'pending',
        createdAt: serverTimestamp()
      });

      setSubmitted(true);
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    }
  };

  if (submitted) {
    return (
      <main className="pt-20 min-h-screen bg-dark-900 flex items-center justify-center px-4">
        <ScrollReveal className="max-w-md w-full text-center">
          <div className="card-dark p-10 border-gold-200">
            <div className="w-20 h-20 rounded-full bg-gold-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} className="text-gold" />
            </div>
            <h1 className="font-heading text-3xl font-bold text-cream mb-3">Application Submitted!</h1>
            <p className="text-muted mb-8">Thank you for applying to become a YMY guide. Our team will review your application within 24-48 hours.</p>
            <Link to="/" className="btn-gold inline-block">Back to Home</Link>
          </div>
        </ScrollReveal>
      </main>
    );
  }

  return (
    <main className="pt-20 min-h-screen bg-dark-900">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <ScrollReveal>
          <div className="text-center mb-10">
            <img src={logo} alt="YMY Consultancy Logo" className="h-16 w-auto object-contain mx-auto mb-4 drop-shadow-lg" />
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-cream mb-2">Become a Guide</h1>
            <p className="text-muted">Share your expertise. Earn on your schedule. Join a global community.</p>
          </div>
        </ScrollReveal>

        {/* Progress bar */}
        <div className="flex items-center justify-between mb-10">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all duration-300 ${
                i <= step ? 'bg-gold text-dark-900' : 'bg-dark-600 text-muted'
              }`}>
                {i < step ? '✓' : i + 1}
              </div>
              {i < steps.length - 1 && (
                <div className={`h-[2px] flex-1 mx-2 transition-all duration-500 ${
                  i < step ? 'bg-gold' : 'bg-dark-600'
                }`} />
              )}
            </div>
          ))}
        </div>

        <div className="card-dark p-8">
          <h2 className="font-heading text-xl font-bold text-cream mb-6">{steps[step]}</h2>

          {/* Step 0: Personal Info */}
          {step === 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="First Name" value={form.firstName} onChange={e => update('firstName', e.target.value)} className="input-dark" />
                <input type="text" placeholder="Last Name" value={form.lastName} onChange={e => update('lastName', e.target.value)} className="input-dark" />
              </div>
              <input type="email" placeholder="Email Address" value={form.email} onChange={e => update('email', e.target.value)} className="input-dark" />
              <input type="password" placeholder="Create Password (min 8 chars)" value={form.password} onChange={e => update('password', e.target.value)} className="input-dark" />
              <input type="tel" placeholder="Phone Number" value={form.phone} onChange={e => update('phone', e.target.value)} className="input-dark" />
              <select value={form.city} onChange={e => update('city', e.target.value)} className="input-dark">
                <option value="">Select your city</option>
                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          )}

          {/* Step 1: Photo */}
          {step === 1 && (
            <div className="text-center">
              <div className="w-40 h-40 rounded-full bg-dark-600 mx-auto mb-6 overflow-hidden border-2 border-dashed border-dark-500 flex items-center justify-center">
                {form.photoPreview ? (
                  <img src={form.photoPreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Camera size={40} className="text-muted-dark" />
                )}
              </div>
              <label className="btn-ghost inline-flex items-center gap-2 cursor-pointer">
                <Camera size={16} />
                Upload Photo
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
              <p className="text-muted-dark text-xs mt-4">Use a professional, friendly photo. Minimum 400×400px.</p>
            </div>
          )}

          {/* Step 2: Bio & Languages */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="text-sm text-cream font-medium mb-2 block">Bio</label>
                <textarea rows={5} placeholder="Tell travelers about yourself, your expertise, and what makes your tours special..." value={form.bio} onChange={e => update('bio', e.target.value)} className="input-dark resize-none" />
                <p className="text-muted-dark text-xs mt-1">{form.bio.length}/500 characters</p>
              </div>
              <div>
                <label className="text-sm text-cream font-medium mb-3 block">Languages you speak</label>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang}
                      onClick={() => toggleLanguage(lang)}
                      className={`px-4 py-2 rounded-full text-sm border transition-all duration-300 ${
                        form.languages.includes(lang)
                          ? 'border-gold bg-gold-100 text-gold'
                          : 'border-dark-500 text-muted hover:border-gold-200'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm text-cream font-medium mb-2 block">Specialties</label>
                <input type="text" placeholder="e.g. History, Food, Architecture, Nightlife" value={form.specialties} onChange={e => update('specialties', e.target.value)} className="input-dark" />
              </div>
            </div>
          )}

          {/* Step 3: Pricing */}
          {step === 3 && (
            <div className="space-y-6">
              <p className="text-muted text-sm">Set your rates. You can change these anytime from your dashboard.</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="card-dark p-5 text-center !bg-dark-600">
                  <div className="text-2xl mb-2">🌤️</div>
                  <h3 className="text-cream font-semibold text-sm mb-1">Half Day</h3>
                  <p className="text-muted-dark text-xs mb-3">4 hours</p>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold font-bold">$</span>
                    <input type="number" placeholder="120" value={form.priceHalfDay} onChange={e => update('priceHalfDay', e.target.value)} className="input-dark !pl-8 text-center" />
                  </div>
                </div>
                <div className="card-dark p-5 text-center border-gold !bg-dark-600">
                  <div className="text-2xl mb-2">☀️</div>
                  <h3 className="text-cream font-semibold text-sm mb-1">Full Day</h3>
                  <p className="text-muted-dark text-xs mb-3">8 hours</p>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold font-bold">$</span>
                    <input type="number" placeholder="200" value={form.priceFullDay} onChange={e => update('priceFullDay', e.target.value)} className="input-dark !pl-8 text-center" />
                  </div>
                </div>
                <div className="card-dark p-5 text-center !bg-dark-600">
                  <div className="text-2xl mb-2">✨</div>
                  <h3 className="text-cream font-semibold text-sm mb-1">Custom</h3>
                  <p className="text-muted-dark text-xs mb-3">Per hour</p>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gold font-bold">$</span>
                    <input type="number" placeholder="50" value={form.priceCustom} onChange={e => update('priceCustom', e.target.value)} className="input-dark !pl-8 text-center" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div className="space-y-4">
              <p className="text-muted text-sm mb-6">Review your application before submitting.</p>
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 mb-4">
                  <p className="text-red-400 text-sm text-center">{error}</p>
                </div>
              )}
              <div className="bg-dark-600 rounded-2xl p-5 space-y-3">
                <div className="flex justify-between text-sm"><span className="text-muted">Name</span><span className="text-cream">{form.firstName} {form.lastName}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted">Email</span><span className="text-cream">{form.email}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted">City</span><span className="text-cream">{form.city}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted">Languages</span><span className="text-cream">{form.languages.join(', ') || 'None selected'}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted">Pricing</span><span className="text-cream">${form.priceHalfDay || '–'} / ${form.priceFullDay || '–'} / ${form.priceCustom || '–'}/hr</span></div>
              </div>
              {form.bio && (
                <div className="bg-dark-600 rounded-2xl p-5">
                  <p className="text-muted text-xs mb-1">Bio</p>
                  <p className="text-cream text-sm">{form.bio}</p>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-dark-600">
            {step > 0 ? (
              <button onClick={() => setStep(step - 1)} className="btn-ghost flex items-center gap-2">
                <ChevronLeft size={16} /> Back
              </button>
            ) : <div />}
            {step < steps.length - 1 ? (
              <button onClick={() => setStep(step + 1)} className="btn-gold flex items-center gap-2">
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <button onClick={handleSubmit} className="btn-gold flex items-center gap-2">
                Submit Application <CheckCircle2 size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
