import { Award, Languages, DollarSign, Save } from 'lucide-react';
import ScrollReveal from '../../components/common/ScrollReveal';

export default function GuideProfileTab({
  bio, setBio,
  specialties, setSpecialties,
  guideLanguages, setGuideLanguages,
  priceHalfDay, setPriceHalfDay,
  priceFullDay, setPriceFullDay,
  priceCustom, setPriceCustom,
  loading, onSubmit
}) {
  return (
    <ScrollReveal>
      <div className="card-dark p-6 sm:p-8">
        <h2 className="font-heading text-xl font-bold text-cream mb-6 flex items-center gap-2">
          <Award size={20} className="text-gold" /> Edit Guide Profile
        </h2>
        <form onSubmit={onSubmit} className="space-y-6">
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
  );
}
