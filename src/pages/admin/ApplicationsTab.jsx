import { Clock, Eye, CheckCircle, XCircle } from 'lucide-react';
import ScrollReveal from '../../components/common/ScrollReveal';

export default function ApplicationsTab({ applications, actionLoading, onSelect, onApprove, onReject }) {
  return (
    <div>
      <ScrollReveal>
        <h1 className="font-heading text-3xl font-bold text-cream mb-6">Guide Applications</h1>
      </ScrollReveal>

      <div className="grid grid-cols-1 gap-6">
        {applications.length === 0 ? (
          <div className="card-dark p-12 text-center">
            <Clock size={48} className="text-muted-dark mx-auto mb-4" />
            <p className="text-muted">No pending applications at the moment.</p>
          </div>
        ) : (
          applications.map((app, i) => (
            <ScrollReveal key={app.id} delay={i * 50}>
              <div className="card-dark p-6 flex flex-col md:flex-row gap-6 cursor-pointer hover:border-gold/50 transition-colors" onClick={() => onSelect(app)}>
                <img src={app.photo} alt={app.name} className="w-32 h-32 rounded-2xl object-cover border border-dark-500" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-heading text-xl font-bold text-cream">{app.name}</h3>
                    <span className="text-xs font-semibold px-2 px-1 text-gold bg-gold-100 rounded-full uppercase">Pending Review</span>
                  </div>
                  <p className="text-muted text-sm mb-4 line-clamp-2">{app.bio}</p>
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6 text-xs">
                    <div><span className="text-muted-dark block">Location</span><span className="text-cream">{app.city}</span></div>
                    <div><span className="text-muted-dark block">Languages</span><span className="text-cream">{app.languages?.join(', ')}</span></div>
                    <div><span className="text-muted-dark block">Pricing</span><span className="text-gold font-bold">${app.priceHalfDay} / ${app.priceFullDay}</span></div>
                    <div><span className="text-muted-dark block">Email</span><span className="text-cream">{app.email}</span></div>
                    <div>
                      <span className="text-muted-dark block">ID Verification</span>
                      <a
                        href={app.idDocumentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gold hover:text-gold-light flex items-center gap-1 mt-0.5 font-medium underline"
                      >
                        <Eye size={12} /> View {app.idType}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onApprove(app)}
                      disabled={actionLoading === app.id}
                      className="btn-gold !py-2 !px-6 text-sm flex items-center gap-2"
                    >
                      {actionLoading === app.id ? 'Processing...' : <><CheckCircle size={16} /> Approve Application</>}
                    </button>
                    <button
                      onClick={() => onReject(app)}
                      disabled={actionLoading === app.id}
                      className="text-red-400 hover:text-red-300 transition-colors text-sm font-medium flex items-center gap-2 px-4"
                    >
                      <XCircle size={16} /> Reject
                    </button>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))
        )}
      </div>
    </div>
  );
}
