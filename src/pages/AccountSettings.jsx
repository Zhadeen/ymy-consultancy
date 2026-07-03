import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSearchParams } from 'react-router-dom';
import { User, Shield, ChevronLeft, Calendar, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../components/common/ScrollReveal';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth } from '../config/firebase';
import { uploadFile } from '../utils/firebaseHelpers';
import { getGuideByUid, updateGuide } from '../infrastructure/firebase/repositories/guidesRepository';
import { updateUser } from '../infrastructure/firebase/repositories/usersRepository';
import ProfileHeader from './settings/ProfileHeader';
import ProfileTab from './settings/ProfileTab';
import SecurityTab from './settings/SecurityTab';
import GuideProfileTab from './settings/GuideProfileTab';
import AvailabilityTab from './settings/AvailabilityTab';

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
        const gData = await getGuideByUid(user.uid);
        if (gData) {
          setGuideData(gData);
          setGuideId(gData.id);
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
      await updateUser(user.uid, { name });
      if (guideId) {
        await updateGuide(guideId, { name });
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
      // Structure the path so the UID is a folder. This is standard for Firebase security rules.
      // Final path: profile_photos/{uid}/{timestamp}
      const storagePath = `profile_photos/${user.uid}`;
      const fileName = `${Date.now()}`;

      // Use the robust uploadFile helper which includes timeouts and better error handling
      const downloadURL = await uploadFile(file, storagePath, fileName);

      if (!downloadURL) {
        throw new Error("Failed to receive a valid download URL from Firebase.");
      }

      await updateUser(user.uid, { photo: downloadURL });
      if (guideId) {
        await updateGuide(guideId, { photo: downloadURL });
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
      await updateGuide(guideId, {
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
      await updateGuide(guideId, { availability });
      showMessage('success', 'Availability updated!');
    } catch (err) {
      console.error('Availability update error:', err);
      showMessage('error', 'Failed to save availability.');
    } finally {
      setLoading(false);
    }
  };

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

        <ProfileHeader
          user={user}
          guideData={guideData}
          isGuide={isGuide}
          photoUploading={photoUploading}
          fileInputRef={fileInputRef}
          onPhotoChange={handlePhotoUpload}
        />

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
              <ProfileTab user={user} name={name} setName={setName} loading={loading} onSubmit={handleSaveProfile} />
            )}

            {activeTab === 'security' && (
              <SecurityTab
                currentPassword={currentPassword} setCurrentPassword={setCurrentPassword}
                newPassword={newPassword} setNewPassword={setNewPassword}
                confirmNewPassword={confirmNewPassword} setConfirmNewPassword={setConfirmNewPassword}
                showPasswords={showPasswords} setShowPasswords={setShowPasswords}
                loading={loading} onSubmit={handleChangePassword}
              />
            )}

            {activeTab === 'guide' && isGuide && (
              <GuideProfileTab
                bio={bio} setBio={setBio}
                specialties={specialties} setSpecialties={setSpecialties}
                guideLanguages={guideLanguages} setGuideLanguages={setGuideLanguages}
                priceHalfDay={priceHalfDay} setPriceHalfDay={setPriceHalfDay}
                priceFullDay={priceFullDay} setPriceFullDay={setPriceFullDay}
                priceCustom={priceCustom} setPriceCustom={setPriceCustom}
                loading={loading} onSubmit={handleSaveGuideProfile}
              />
            )}

            {activeTab === 'availability' && isGuide && (
              <AvailabilityTab
                calMonth={calMonth} setCalMonth={setCalMonth}
                availability={availability} toggleDay={toggleDay}
                loading={loading} onSave={handleSaveAvailability}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
