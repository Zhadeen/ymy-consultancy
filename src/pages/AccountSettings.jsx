import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSearchParams } from 'react-router-dom';
import { User, Mail, Shield, Camera, Save, CheckCircle2, ChevronLeft, Lock, Eye, EyeOff, DollarSign, Calendar, ChevronRight, MapPin, Languages, Award, Image } from 'lucide-react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../components/common/ScrollReveal';
import { doc, updateDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { db, auth } from '../config/firebase';
import { uploadFile } from '../utils/firebaseHelpers';

export default function AccountSettings() {
  const { user, updateUserLocal } = useAuth();
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'profile';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [name, setName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);

  // Guide profile state
  const [guideData, setGuideData] = useState(null);
  const [guideId, setGuideId] = useState(null);
  const [bio, setBio] = useState('');
  const [specialties, setSpecialties] = useState('');
  const [guideLanguages, setGuideLanguages] = useState('');
  const [priceHalfDay, setPriceHalfDay] = useState('');
  const [priceFullDay, setPriceFullDay] = useState('');
  const [priceCustom, setPriceCustom] = useState('');

  // Availability state
  const [calMonth, setCalMonth] = useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });
  const [availability, setAvailability] = useState({});

  // Fetch guide data for guide users
  useEffect(() => {
    if (!user || user.role !== 'guide') return;
    const fetchGuide = async () => {
      try {
        const q = query(collection(db, 'guides'), where('uid', '==', user.uid));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const gData = { id: snap.docs[0].id, ...snap.docs[0].data() };
          setGuideData(gData);
          setGuideId(snap.docs[0].id);
          setBio(gData.bio || '');
          setSpecialties(Array.isArray(gData.specialties) ? gData.specialties.join(', ') : gData.specialties || '');
          setGuideLanguages(Array.isArray(gData.languages) ? gData.languages.join(', ') : gData.languages || '');
          setPriceHalfDay(gData.priceHalfDay || '');
          setPriceFullDay(gData.priceFullDay || '');
          setPriceCustom(gData.priceCustom || '');
          setAvailability(gData.availability || {});
        }
      } catch (err) {
        console.error('Error fetching guide data:', err);
      }
    };
    fetchGuide();
  }, [user]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  // Save profile info
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), { name });
      if (guideId) {
        await updateDoc(doc(db, 'guides', guideId), { name });
      }
      updateUserLocal?.({ ...user, name });
      showMessage('success', 'Profile updated successfully!');
    } catch (err) {
      console.error('Update error:', err);
      showMessage('error', 'Failed to update. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Photo upload
  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Basic client-side validation
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_FILE_SIZE) {
      showMessage('error', 'Photo size must be less than 5MB.');
      return;
    }

    setPhotoUploading(true);
    try {
      const fileName = `${user.uid}_${Date.now()}`;
      // Use the robust uploadFile helper which includes timeouts and better error handling
      const downloadURL = await uploadFile(file, 'profile_photos', fileName);
      
      if (!downloadURL) {
        throw new Error("Failed to receive a valid download URL from Firebase.");
      }

      await updateDoc(doc(db, 'users', user.uid), { photo: downloadURL });
      if (guideId) {
        await updateDoc(doc(db, 'guides', guideId), { photo: downloadURL });
      }
      updateUserLocal?.({ ...user, photo: downloadURL });
      showMessage('success', 'Profile photo updated successfully!');
    } catch (err) {
      console.error('Photo upload error:', err);
      showMessage('error', err.message || 'Failed to upload photo. Please ensure your internet connection is stable.');
    } finally {
      setPhotoUploading(false);
    }
  };

  // Password change
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      showMessage('error', 'New passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      showMessage('error', 'Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);
      showMessage('success', 'Password changed successfully!');
      // Reset fields but keep security tab active
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err) {
      console.error('Password change error:', err);
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        showMessage('error', 'Current password is incorrect.');
      } else {
        showMessage('error', 'Failed to change password. You may need to log in again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Save guide profile (bio, pricing, etc)
  const handleSaveGuideProfile = async (e) => {
    e.preventDefault();
    if (!guideId) return;
    setLoading(true);
    try {
      await updateDoc(doc(db, 'guides', guideId), {
        bio,
        specialties: specialties.split(',').map(s => s.trim()).filter(Boolean),
        languages: guideLanguages.split(',').map(s => s.trim()).filter(Boolean),
        priceHalfDay: Number(priceHalfDay),
        priceFullDay: Number(priceFullDay),
        priceCustom: Number(priceCustom),
      });
      showMessage('success', 'Guide profile & pricing updated!');
    } catch (err) {
      console.error('Guide profile update error:', err);
      showMessage('error', 'Failed to update guide profile.');
    } finally {
      setLoading(false);
    }
  };

  // Availability toggle
  const toggleDay = (dateStr) => {
    setAvailability(prev => ({ ...prev, [dateStr]: !prev[dateStr] }));
  };

  const handleSaveAvailability = async () => {
    if (!guideId) return;
    setLoading(true);
    try {
      await updateDoc(doc(db, 'guides', guideId), { availability });
      showMessage('success', 'Availability updated!');
    } catch (err) {
      console.error('Availability update error:', err);
      showMessage('error', 'Failed to save availability.');
    } finally {
      setLoading(false);
    }
  };

  // Calendar helpers
  const daysInMonth = new Date(calMonth.year, calMonth.month + 1, 0).getDate();
  const firstDayOfWeek = new Date(calMonth.year, calMonth.month, 1).getDay();
  const monthName = new Date(calMonth.year, calMonth.month).toLocaleDateString('en', { month: 'long', year: 'numeric' });

  const isGuide = user?.role === 'guide';

  const tabs = [
    { id: 'profile', label: 'Profile Information', icon: User },
    { id: 'security', label: 'Password & Security', icon: Shield },
    ...(isGuide ? [
      { id: 'guide', label: 'Edit Guide Profile', icon: Award },
      { id: 'availability', label: 'Manage Availability', icon: Calendar },
    ] : []),
  ];

  return (
    <main className="pt-24 min-h-screen bg-dark-900 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-muted hover:text-gold transition-colors mb-8">
            <ChevronLeft size={16} />
            <span className="text-sm">Back to Dashboard</span>
          </Link>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-cream mb-2">Account Settings</h1>
          <p className="text-muted mb-10">Manage your profile, security, and preferences.</p>
        </ScrollReveal>

        {/* Message toast */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl text-sm animate-fade-in ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
            {message.text}
          </div>
        )}

        {/* Profile Header (Always visible) */}
        <ScrollReveal delay={50} className="mb-8">
          <div className="card-dark p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-dark-700 border-2 border-gold overflow-hidden">
                {photoUploading ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" />
                  </div>
                ) : (
                  <img 
                    src={user?.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-gold text-dark-900 flex items-center justify-center border-2 border-dark-900 group-hover:scale-110 transition-transform shadow-lg"
                title="Change profile photo"
              >
                <Camera size={14} />
              </button>
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>
            <div className="text-center sm:text-left flex-1">
              <h3 className="text-2xl font-bold text-cream">{user?.name}</h3>
              <p className="text-gold text-sm font-medium flex items-center gap-2 justify-center sm:justify-start mt-1">
                {isGuide ? (
                  <> <Award size={14} /> Local Guide Account</>
                ) : (
                  <> <User size={14} /> Visitor Account</>
                )}
              </p>
              <p className="text-muted-dark text-xs mt-2">Member since {user?.createdAt?.toDate ? new Date(user.createdAt.toDate()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'recently'}</p>
            </div>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Tabs */}
          <ScrollReveal delay={80}>
            <div className="space-y-1.5">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-gold-100 text-gold'
                      : 'text-muted hover:text-cream hover:bg-dark-800'
                  }`}
                >
                  <tab.icon size={18} /> {tab.label}
                </button>
              ))}
            </div>
          </ScrollReveal>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <ScrollReveal>
                <div className="card-dark p-6 sm:p-8">
                  <form onSubmit={handleSaveProfile} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-muted mb-2">Display Name</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-dark" size={18} />
                          <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-dark !pl-11" placeholder="Your full name" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted mb-2">Email Address</label>
                        <div className="relative opacity-60 cursor-not-allowed">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-dark" size={18} />
                          <input type="email" value={user?.email || ''} className="input-dark !pl-11" disabled />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            <CheckCircle2 size={16} className={user?.emailVerified ? 'text-green-500' : 'text-yellow-500'} />
                          </div>
                        </div>
                        <p className="text-[10px] text-muted-dark mt-2 italic px-1">
                          {user?.emailVerified ? 'Email verified ✓' : 'Email not yet verified'}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <button type="submit" disabled={loading} className="btn-gold flex items-center gap-2 px-8">
                        {loading ? 'Saving...' : <><Save size={18} /> Save Changes</>}
                      </button>
                    </div>
                  </form>
                </div>
              </ScrollReveal>
            )}

            {/* ===== SECURITY TAB ===== */}
            {activeTab === 'security' && (
              <ScrollReveal>
                <div className="card-dark p-6 sm:p-8">
                  <h2 className="font-heading text-xl font-bold text-cream mb-6 flex items-center gap-2">
                    <Shield size={20} className="text-gold" /> Password & Security
                  </h2>
                  <form onSubmit={handleChangePassword} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-muted mb-2">Current Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-dark" size={18} />
                        <input 
                          type={showPasswords ? 'text' : 'password'} 
                          value={currentPassword} 
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="input-dark !pl-11 !pr-12" 
                          placeholder="Enter current password"
                          required
                        />
                        <button type="button" onClick={() => setShowPasswords(!showPasswords)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-dark hover:text-cream">
                          {showPasswords ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted mb-2">New Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-dark" size={18} />
                        <input 
                          type={showPasswords ? 'text' : 'password'} 
                          value={newPassword} 
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="input-dark !pl-11" 
                          placeholder="Enter new password (6+ characters)"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted mb-2">Confirm New Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-dark" size={18} />
                        <input 
                          type={showPasswords ? 'text' : 'password'} 
                          value={confirmNewPassword} 
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          className="input-dark !pl-11" 
                          placeholder="Confirm new password"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex justify-end pt-4">
                      <button type="submit" disabled={loading} className="btn-gold flex items-center gap-2 px-8">
                        {loading ? 'Updating...' : <><Shield size={18} /> Update Password</>}
                      </button>
                    </div>
                  </form>
                </div>
              </ScrollReveal>
            )}

            {/* ===== GUIDE PROFILE TAB ===== */}
            {activeTab === 'guide' && isGuide && (
              <ScrollReveal>
                <div className="card-dark p-6 sm:p-8">
                  <h2 className="font-heading text-xl font-bold text-cream mb-6 flex items-center gap-2">
                    <Award size={20} className="text-gold" /> Edit Guide Profile
                  </h2>
                  <form onSubmit={handleSaveGuideProfile} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-muted mb-2">Bio / About You</label>
                      <textarea 
                        value={bio} 
                        onChange={(e) => setBio(e.target.value)} 
                        className="input-dark min-h-[120px] resize-none" 
                        placeholder="Tell visitors about yourself, your experience, and what makes your tours special..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted mb-2">Specialties (comma-separated)</label>
                      <div className="relative">
                        <Award className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-dark" size={18} />
                        <input type="text" value={specialties} onChange={(e) => setSpecialties(e.target.value)} className="input-dark !pl-11" placeholder="e.g. Cultural Tours, Food Tours, Photography" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted mb-2">Languages (comma-separated)</label>
                      <div className="relative">
                        <Languages className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-dark" size={18} />
                        <input type="text" value={guideLanguages} onChange={(e) => setGuideLanguages(e.target.value)} className="input-dark !pl-11" placeholder="e.g. English, Hausa, Arabic" />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-dark-600">
                      <h3 className="text-cream font-semibold mb-4 flex items-center gap-2">
                        <DollarSign size={18} className="text-gold" /> Pricing
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs text-muted mb-1.5">Half Day (4hrs)</label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gold font-bold">$</span>
                            <input type="number" value={priceHalfDay} onChange={(e) => setPriceHalfDay(e.target.value)} className="input-dark !pl-9" placeholder="0" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-muted mb-1.5">Full Day (8hrs)</label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gold font-bold">$</span>
                            <input type="number" value={priceFullDay} onChange={(e) => setPriceFullDay(e.target.value)} className="input-dark !pl-9" placeholder="0" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-muted mb-1.5">Custom (per hour)</label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gold font-bold">$</span>
                            <input type="number" value={priceCustom} onChange={(e) => setPriceCustom(e.target.value)} className="input-dark !pl-9" placeholder="0" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <button type="submit" disabled={loading} className="btn-gold flex items-center gap-2 px-8">
                        {loading ? 'Saving...' : <><Save size={18} /> Save Guide Profile</>}
                      </button>
                    </div>
                  </form>
                </div>
              </ScrollReveal>
            )}

            {/* ===== AVAILABILITY TAB ===== */}
            {activeTab === 'availability' && isGuide && (
              <ScrollReveal>
                <div className="card-dark p-6 sm:p-8">
                  <h2 className="font-heading text-xl font-bold text-cream mb-2 flex items-center gap-2">
                    <Calendar size={20} className="text-gold" /> Manage Availability
                  </h2>
                  <p className="text-muted text-sm mb-6">Click on dates to mark them as available (gold) or unavailable.</p>

                  <div className="flex items-center justify-between mb-6">
                    <button 
                      type="button"
                      onClick={() => setCalMonth(prev => prev.month === 0 ? { year: prev.year - 1, month: 11 } : { ...prev, month: prev.month - 1 })}
                      className="w-10 h-10 rounded-full border border-dark-500 flex items-center justify-center text-cream hover:border-gold transition-colors"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <h3 className="font-heading text-lg text-cream font-semibold">{monthName}</h3>
                    <button 
                      type="button"
                      onClick={() => setCalMonth(prev => prev.month === 11 ? { year: prev.year + 1, month: 0 } : { ...prev, month: prev.month + 1 })}
                      className="w-10 h-10 rounded-full border border-dark-500 flex items-center justify-center text-cream hover:border-gold transition-colors"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-1.5">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                      <div key={day} className="text-center text-xs text-muted-dark py-2 font-medium">{day}</div>
                    ))}
                    {Array.from({ length: firstDayOfWeek }, (_, i) => (
                      <div key={`empty-${i}`} />
                    ))}
                    {Array.from({ length: daysInMonth }, (_, i) => {
                      const day = i + 1;
                      const dateStr = `${calMonth.year}-${String(calMonth.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                      const isAvail = availability[dateStr];
                      return (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleDay(dateStr)}
                          className={`text-center py-3 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                            isAvail
                              ? 'bg-gold text-dark-900 font-bold shadow-lg'
                              : 'bg-dark-700 text-muted hover:bg-dark-600'
                          }`}
                        >
                          {day}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center gap-6 mt-4 pt-4 border-t border-dark-600">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-gold" />
                      <span className="text-xs text-muted">Available</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-dark-700" />
                      <span className="text-xs text-muted">Unavailable</span>
                    </div>
                  </div>

                  <div className="flex justify-end pt-6">
                    <button onClick={handleSaveAvailability} disabled={loading} className="btn-gold flex items-center gap-2 px-8">
                      {loading ? 'Saving...' : <><Save size={18} /> Save Availability</>}
                    </button>
                  </div>
                </div>
              </ScrollReveal>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
