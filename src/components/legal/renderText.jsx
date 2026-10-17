// Highlights owner placeholders (`[OWNER MUST PROVIDE: …]`) so they're obvious
// and can't be mistaken for finished copy.
export function renderText(text) {
  const parts = text.split(/(\[OWNER MUST PROVIDE:[^\]]*\])/g);
  return parts.map((p, i) =>
    p.startsWith('[OWNER MUST PROVIDE:')
      ? <mark key={i} className="bg-amber-500/20 text-amber-200 px-1 rounded not-italic">{p}</mark>
      : p
  );
}
