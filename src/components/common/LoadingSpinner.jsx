import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ fullScreen = true }) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4 text-gold">
      <Loader2 className="w-12 h-12 animate-spin" />
      <span className="font-heading text-sm uppercase tracking-widest animate-pulse text-cream">
        YMY Consultancy
      </span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[9999] bg-dark-900 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}
