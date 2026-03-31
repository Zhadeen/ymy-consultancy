import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Camera, Save, CheckCircle2, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../components/common/ScrollReveal';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function AccountSettings() {
  const { user, updateUserLocal } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setMessage(null);

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        name: name
      });
      
      if (updateUserLocal) {
        updateUserLocal({ ...user, name });
      }

      setMessage({ type: 'success', text: 'Settings updated successfully!' });
    } catch (err) {
      console.error("Update error:", err);
      setMessage({ type: 'error', text: 'Failed to update settings. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="pt-24 min-h-screen bg-dark-900 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal>
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-muted hover:text-gold transition-colors mb-8">
            <ChevronLeft size={16} />
            <span className="text-sm">Back to Dashboard</span>
          </Link>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-cream mb-2">Account Settings</h1>
          <p className="text-muted mb-10">Manage your profile information and account preferences.</p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <ScrollReveal delay={80}>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gold-100 text-gold text-sm font-medium">
                <User size={18} /> Profile Information
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted hover:text-cream hover:bg-dark-800 text-sm font-medium transition-all">
                <Shield size={18} /> Password & Security
              </button>
            </div>
          </ScrollReveal>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <ScrollReveal delay={160}>
              <div className="card-dark p-6 sm:p-8">
                <form onSubmit={handleSave} className="space-y-8">
                  {/* Profile Header */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 pb-8 border-b border-dark-600">
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-full bg-dark-700 border-2 border-gold overflow-hidden">
                        <img 
                          src={user?.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button type="button" className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-gold text-dark-900 flex items-center justify-center border-2 border-dark-900 group-hover:scale-110 transition-transform">
                        <Camera size={14} />
                      </button>
                    </div>
                    <div className="text-center sm:text-left">
                      <h3 className="text-xl font-bold text-cream underline decoration-gold/50">{user?.name}</h3>
                      <p className="text-muted text-sm">{user?.role === 'guide' ? 'Local Guide' : 'Visitor Account'}</p>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-muted mb-2">Display Name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-dark" size={18} />
                        <input 
                          type="text" 
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="input-dark !pl-11"
                          placeholder="Your full name"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-muted mb-2">Email Address</label>
                      <div className="relative opacity-60 cursor-not-allowed">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-dark" size={18} />
                        <input 
                          type="email" 
                          value={user?.email || ''} 
                          className="input-dark !pl-11" 
                          disabled 
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          <CheckCircle2 size={16} className="text-green-500" title="Verified" />
                        </div>
                      </div>
                      <p className="text-[10px] text-muted-dark mt-2 italic px-1">Email cannot be changed for security reasons.</p>
                    </div>
                  </div>

                  {/* Message */}
                  {message && (
                    <div className={`p-4 rounded-xl text-sm ${message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                      {message.text}
                    </div>
                  )}

                  {/* Action */}
                  <div className="flex justify-end pt-4">
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="btn-gold flex items-center gap-2 px-8"
                    >
                      {loading ? 'Saving...' : <><Save size={18} /> Save Changes</>}
                    </button>
                  </div>
                </form>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </main>
  );
}
