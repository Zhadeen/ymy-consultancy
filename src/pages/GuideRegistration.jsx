import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Camera, FileText, DollarSign, ChevronRight, ChevronLeft, Globe, CheckCircle2 } from 'lucide-react';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { LANGUAGES, COUNTRIES, CITIES_BY_COUNTRY } from '../data/mockData';
import ScrollReveal from '../components/common/ScrollReveal';
import { useAuth } from '../context/AuthContext';
import { uploadFile } from '../utils/firebaseHelpers';
import logo from '../assets/logo.png';

const steps = ['Personal Info', 'Photo', 'ID Verification', 'Bio & Languages', 'Pricing', 'Review'];

export default function GuideRegistration() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);
  const [statusText, setStatusText] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', phone: '', country: '', countryCode: '', phoneCode: '', city: '',
    photo: null, photoPreview: '',
    idType: 'Passport', idDocument: null, idDocumentPreview: '',
    bio: '', languages: [], specialties: '',
    priceHalfDay: '', priceFullDay: '', priceCustom: '',
  });

  const selectedCountry = COUNTRIES.find(c => c.name === form.country);
  const availableCities = form.countryCode ? (CITIES_BY_COUNTRY[form.countryCode] || []) : [];

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

  const handleIDUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      update('idDocument', file);
      update('idDocumentPreview', URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    try {
      if (!form.firstName.trim() || !form.lastName.trim()) {
        setError('Please enter both your first and last name');
        return;
      }
      if (!form.password || form.password.length < 8) {
        setError('Password must be at least 8 characters');
        return;
      }
      if (!form.idDocument) {
        setError('Please upload an ID document for verification');
        return;
      }

      setProcessing(true);
      setError('');
      setStatusText('Creating account...');

      // Create user auth with role 'pending_guide'
      const userCredential = await register(`${form.firstName} ${form.lastName}`, form.email, form.password, 'pending_guide');
      const uid = userCredential.user.uid;

      // Upload files to Firebase Storage
      let photoUrl = 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200';
      let idDocumentUrl = '';

      // Upload profile photo
      if (form.photo && form.photo instanceof File) {
        setStatusText('Uploading profile photo...');
        try {
          const uploadedUrl = await uploadFile(form.photo, 'profile_photos', `${uid}_profile`);
          if (uploadedUrl) {
            photoUrl = uploadedUrl;
          }
        } catch (err) {
          console.error("Photo upload error:", err);
        }
      }
      
      // Upload ID document
      if (form.idDocument && form.idDocument instanceof File) {
        setStatusText('Uploading ID document...');
        try {
          const uploadedUrl = await uploadFile(form.idDocument, 'id_documents', `${uid}_id`);
          if (uploadedUrl) {
            idDocumentUrl = uploadedUrl;
          }
        } catch (err) {
          console.error("ID upload error:", err);
        }
      }
      
      setStatusText('Finalizing application...');

      // Save application details to 'guide_applications' collection
      setStatusText('Finalizing application...');
      await setDoc(doc(db, 'guide_applications', uid), {
        uid,
        name: `${form.firstName} ${form.lastName}`,
        email: form.email,
        country: form.country,
        countryCode: form.countryCode,
        city: form.city,
        phone: form.phone,
        phoneCode: form.phoneCode,
        photo: photoUrl,
        idType: form.idType,
        idDocumentUrl: idDocumentUrl,
        idVerified: false,
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
      console.error("Registration failed:", err);
      setError(err.message?.replace('Firebase: ', '') || 'Registration failed. Please try again.');
    } finally {
      setProcessing(false);
      setStatusText('');
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
              <div className="flex gap-2">
                <div className="w-28 flex-shrink-0">
                  <input type="text" value={form.phoneCode} readOnly placeholder="+XXX" className="input-dark text-center" />
                </div>
                <input type="tel" placeholder="Your phone number" value={form.phone} onChange={e => update('phone', e.target.value)} className="input-dark flex-1" />
              </div>
              <select value={form.country} onChange={e => { const selected = COUNTRIES.find(c => c.name === e.target.value); update('country', e.target.value); update('countryCode', selected?.code || ''); update('phoneCode', selected?.phoneCode || ''); update('city', ''); }} className="input-dark">
                <option value="">Select your country</option>
                {COUNTRIES.map(c => <option key={c.code} value={c.name}>{c.flag} {c.name} ({c.code})</option>)}
              </select>
              {form.country && (
                <select value={form.city} onChange={e => update('city', e.target.value)} className="input-dark mt-4">
                  <option value="">Select your city</option>
                  {availableCities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              )}
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

          {/* Step 2: ID Verification */}
          {step === 2 && (
            <div className="space-y-6">
              <p className="text-muted text-sm">To ensure the safety of our tourists, we require a clear photo of your government-issued ID.</p>
              
              <div>
                <label className="text-sm text-cream font-medium mb-3 block">Document Type</label>
                <div className="flex gap-3">
                  {['Passport', 'National ID', 'Driver License'].map(type => (
                    <button
                      key={type}
                      onClick={() => update('idType', type)}
                      className={`flex-1 py-3 rounded-xl border transition-all duration-300 ${
                        form.idType === type 
                          ? 'border-gold bg-gold-100 text-gold' 
                          : 'border-dark-500 text-muted hover:border-gold-200'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="card-dark p-8 border-dashed border-2 border-dark-500 text-center">
                {form.idDocumentPreview ? (
                  <div className="relative group">
                    <img src={form.idDocumentPreview} alt="ID Document Preview" className="max-h-60 mx-auto rounded-xl shadow-2xl" />
                    <label className="absolute inset-0 bg-dark-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer rounded-xl">
                      <Camera size={24} className="text-gold" />
                      <input type="file" accept="image/*" onChange={handleIDUpload} className="hidden" />
                    </label>
                  </div>
                ) : (
                  <label className="cursor-pointer block">
                    <FileText size={48} className="text-muted-dark mx-auto mb-4" />
                    <p className="text-cream font-medium mb-1">Click to upload ID photo</p>
                    <p className="text-muted text-xs">PNG, JPG or PDF up to 10MB</p>
                    <input type="file" accept="image/*" onChange={handleIDUpload} className="hidden" />
                  </label>
                )}
              </div>
              
              <div className="bg-gold-50/10 border border-gold-200/20 rounded-xl p-4 flex gap-3">
                <div className="text-gold mt-0.5">🛡️</div>
                <p className="text-xs text-muted-dark leading-relaxed">
                  Your ID is processed securely and is only visible to YMY administrators for verification purposes. It will never be shared with touristers or third parties.
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Bio & Languages */}
          {step === 3 && (
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

          {/* Step 4: Pricing */}
          {step === 4 && (
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

          {/* Step 5: Review */}
          {step === 5 && (
            <div className="space-y-4">
              <p className="text-muted text-sm mb-6">Review your application before submitting.</p>
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 mb-4">
                  <p className="text-red-400 text-sm text-center">{error}</p>
                </div>
              )}
              <div className="bg-dark-600 rounded-2xl p-5 space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted">Name</span><span className="text-cream">{form.firstName} {form.lastName}</span></div>
                <div className="flex justify-between"><span className="text-muted">Email</span><span className="text-cream">{form.email}</span></div>
                <div className="flex justify-between"><span className="text-muted">Phone</span><span className="text-cream">{form.phoneCode} {form.phone}</span></div>
                <div className="flex justify-between"><span className="text-muted">ID Type</span><span className="text-cream">{form.idType}</span></div>
                <div className="flex justify-between"><span className="text-muted">ID Document</span><span className={form.idDocument ? 'text-green-400' : 'text-red-400'}>{form.idDocument ? '✓ Uploaded' : '✗ Missing'}</span></div>
                <div className="flex justify-between"><span className="text-muted">Country</span><span className="text-cream">{form.country} ({form.countryCode})</span></div>
                <div className="flex justify-between"><span className="text-muted">City</span><span className="text-cream">{form.city}</span></div>
                <div className="flex justify-between"><span className="text-muted">Languages</span><span className="text-cream">{form.languages.join(', ') || 'None selected'}</span></div>
                <div className="flex justify-between font-medium pt-2 border-t border-dark-500"><span className="text-muted">Pricing</span><span className="text-gold">${form.priceHalfDay || '–'} / ${form.priceFullDay || '–'} / ${form.priceCustom || '–'}/hr</span></div>
              </div>
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
              <button 
                onClick={() => {
                  if (step === 2 && !form.idDocument) {
                    setError('Please upload an ID document to proceed.');
                    return;
                  }
                  setError('');
                  setStep(step + 1);
                }} 
                className="btn-gold flex items-center gap-2"
              >
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <button 
                onClick={handleSubmit} 
                className="btn-gold flex items-center gap-2"
                disabled={processing}
              >
                {processing ? (statusText || 'Processing...') : 'Submit Application'} <CheckCircle2 size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
