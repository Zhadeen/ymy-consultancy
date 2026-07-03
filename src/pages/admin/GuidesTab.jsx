import { Eye } from 'lucide-react';
import ScrollReveal from '../../components/common/ScrollReveal';

export default function GuidesTab({ guides }) {
  return (
    <div>
      <ScrollReveal>
        <h1 className="font-heading text-3xl font-bold text-cream mb-6">Guides</h1>
      </ScrollReveal>

      <ScrollReveal delay={80}>
        <div className="card-dark overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-600">
                  <th className="text-left text-xs text-muted uppercase tracking-wider font-medium px-5 py-4">Guide</th>
                  <th className="text-left text-xs text-muted uppercase tracking-wider font-medium px-5 py-4">City</th>
                  <th className="text-left text-xs text-muted uppercase tracking-wider font-medium px-5 py-4">Rating</th>
                  <th className="text-left text-xs text-muted uppercase tracking-wider font-medium px-5 py-4">Status</th>
                  <th className="text-left text-xs text-muted uppercase tracking-wider font-medium px-5 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {guides.map((guide) => (
                  <tr key={guide.id} className="border-b border-dark-700/50 hover:bg-dark-700/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img src={guide.photo} alt={guide.name} className="w-9 h-9 rounded-full object-cover border border-dark-500" />
                        <span className="text-cream text-sm font-medium">{guide.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-muted text-sm">{guide.city}</td>
                    <td className="px-5 py-4 text-gold text-sm font-semibold">{guide.rating}</td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider bg-green-500/10 text-green-400">
                        Approved
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button className="w-8 h-8 rounded-lg bg-dark-600 flex items-center justify-center text-muted hover:text-cream transition-colors" title="View">
                          <Eye size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
