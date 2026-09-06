import { LEGAL } from '../../config/legal';

// Visible "DRAFT — not legal advice, review with counsel" banner shown at the
// top of every legal page. Required by COMPLIANCE.md — no legal page may present
// itself as final or "compliant".
export default function DraftBanner() {
  return (
    <div
      role="note"
      className="mb-8 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 sm:p-5 flex items-start gap-3"
    >
      <span className="text-amber-400 text-lg leading-none mt-0.5" aria-hidden="true">⚠️</span>
      <p className="text-amber-200/90 text-sm leading-relaxed">
        <strong className="text-amber-100">DRAFT — not legal advice.</strong>{' '}
        {LEGAL.draftNotice}
      </p>
    </div>
  );
}
