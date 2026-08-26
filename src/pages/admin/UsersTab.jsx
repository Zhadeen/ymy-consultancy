import { Search, Eye, Ban, CheckCircle2 } from 'lucide-react';
import ScrollReveal from '../../components/common/ScrollReveal';

export default function UsersTab({ users, currentUserId, actionLoading, onToggleDisabled }) {
  return (
    <div>
      <ScrollReveal>
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-heading text-3xl font-bold text-cream">Users</h1>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-dark" />
            <input placeholder="Search users..." className="input-dark !pl-9 !py-2.5 text-sm w-64" />
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={80}>
        <div className="card-dark overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-600">
                  <th className="text-left text-xs text-muted uppercase tracking-wider font-medium px-5 py-4">Name</th>
                  <th className="text-left text-xs text-muted uppercase tracking-wider font-medium px-5 py-4">Email</th>
                  <th className="text-left text-xs text-muted uppercase tracking-wider font-medium px-5 py-4">Role</th>
                  <th className="text-left text-xs text-muted uppercase tracking-wider font-medium px-5 py-4">Join Date</th>
                  <th className="text-left text-xs text-muted uppercase tracking-wider font-medium px-5 py-4">Status</th>
                  <th className="text-left text-xs text-muted uppercase tracking-wider font-medium px-5 py-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const isSelf = user.id === currentUserId;
                  const isDisabled = !!user.disabled;
                  const busy = actionLoading === user.id;

                  return (
                    <tr key={user.id} className="border-b border-dark-700/50 hover:bg-dark-700/30 transition-colors">
                      <td className="px-5 py-4 text-cream text-sm font-medium">
                        {user.name}
                        {isSelf && <span className="text-muted-dark text-xs ml-2">(you)</span>}
                      </td>
                      <td className="px-5 py-4 text-muted text-sm">{user.email}</td>
                      <td className="px-5 py-4">
                        <span className="text-xs text-muted capitalize">{user.role || 'visitor'}</span>
                      </td>
                      <td className="px-5 py-4 text-muted text-sm">{user.createdAt?.toDate ? user.createdAt.toDate().toLocaleDateString() : 'New'}</td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          isDisabled ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'
                        }`}>
                          {isDisabled ? 'Disabled' : 'Active'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button className="w-8 h-8 rounded-lg bg-dark-600 flex items-center justify-center text-muted hover:text-cream transition-colors" title="View">
                            <Eye size={14} />
                          </button>

                          {/* An admin locking themselves out of their own panel is
                              not a state worth supporting, so self is never togglable. */}
                          {!isSelf && (
                            <button
                              onClick={() => onToggleDisabled(user)}
                              disabled={busy}
                              title={isDisabled ? 'Re-enable this account' : 'Disable this account'}
                              className={`h-8 px-3 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors disabled:opacity-50 ${
                                isDisabled
                                  ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                                  : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                              }`}
                            >
                              {busy
                                ? '...'
                                : isDisabled
                                  ? <><CheckCircle2 size={13} /> Enable</>
                                  : <><Ban size={13} /> Disable</>}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
