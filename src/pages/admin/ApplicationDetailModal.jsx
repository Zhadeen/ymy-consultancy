import { Eye, CheckCircle, XCircle } from 'lucide-react';

export default function ApplicationDetailModal({ app, actionLoading, onClose, onApprove, onReject }) {
  if (!app) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="card-dark max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-2xl font-bold text-cream">Application Details</h2>
          <button onClick={onClose} className="text-muted hover:text-cream text-2xl">&times;</button>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <img src={app.photo} alt={app.name} className="w-40 h-40 rounded-2xl object-cover border-2 border-gold" />
          <div className="flex-1">
            <h3 className="font-heading text-xl font-bold text-cream mb-1">{app.name}</h3>
            <p className="text-gold text-sm mb-3">Pending Review</p>
            <p className="text-muted text-sm">{app.bio || 'No bio provided'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div className="card-dark !bg-dark-600 p-4">
            <span className="text-muted-dark block text-xs mb-1">Email</span>
            <span className="text-cream">{app.email}</span>
          </div>
          <div className="card-dark !bg-dark-600 p-4">
            <span className="text-muted-dark block text-xs mb-1">Phone</span>
            <span className="text-cream">{app.phoneCode} {app.phone}</span>
          </div>
          <div className="card-dark !bg-dark-600 p-4">
            <span className="text-muted-dark block text-xs mb-1">Country</span>
            <span className="text-cream">{app.country} ({app.countryCode})</span>
          </div>
          <div className="card-dark !bg-dark-600 p-4">
            <span className="text-muted-dark block text-xs mb-1">City</span>
            <span className="text-cream">{app.city || 'Not specified'}</span>
          </div>
          <div className="card-dark !bg-dark-600 p-4">
            <span className="text-muted-dark block text-xs mb-1">Languages</span>
            <span className="text-cream">{app.languages?.join(', ') || 'Not specified'}</span>
          </div>
          <div className="card-dark !bg-dark-600 p-4">
            <span className="text-muted-dark block text-xs mb-1">Specialties</span>
            <span className="text-cream">{app.specialties || 'Not specified'}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="card-dark !bg-dark-600 p-4 text-center">
            <span className="text-muted-dark block text-xs mb-1">Half Day</span>
            <span className="text-gold font-bold text-lg">${app.priceHalfDay || '—'}</span>
          </div>
          <div className="card-dark !bg-dark-600 p-4 text-center">
            <span className="text-muted-dark block text-xs mb-1">Full Day</span>
            <span className="text-gold font-bold text-lg">${app.priceFullDay || '—'}</span>
          </div>
          <div className="card-dark !bg-dark-600 p-4 text-center">
            <span className="text-muted-dark block text-xs mb-1">Custom (/hr)</span>
            <span className="text-gold font-bold text-lg">${app.priceCustom || '—'}</span>
          </div>
        </div>

        <div className="card-dark !bg-dark-600 p-4 mb-6">
          <span className="text-muted-dark block text-xs mb-2">ID Document</span>
          {app.idDocumentUrl ? (
            <a
              href={app.idDocumentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold inline-flex items-center gap-2"
            >
              <Eye size={16} /> View {app.idType || 'ID Document'}
            </a>
          ) : (
            <span className="text-red-400">No ID document uploaded</span>
          )}
        </div>

        <div className="flex items-center gap-3 pt-4 border-t border-dark-600">
          <button
            onClick={() => { onApprove(app); onClose(); }}
            disabled={actionLoading === app.id}
            className="btn-gold flex-1 !py-3 flex items-center justify-center gap-2"
          >
            {actionLoading === app.id ? 'Processing...' : <><CheckCircle size={18} /> Approve Application</>}
          </button>
          <button
            onClick={() => { onReject(app); onClose(); }}
            disabled={actionLoading === app.id}
            className="flex-1 py-3 px-6 border border-red-500/50 text-red-400 hover:bg-red-500/10 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <XCircle size={18} /> Reject
          </button>
        </div>
      </div>
    </div>
  );
}
