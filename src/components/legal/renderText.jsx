import { Link } from 'react-router-dom';

// Renders legal copy: highlights owner placeholders (`[OWNER MUST PROVIDE: …]`)
// so they can't be mistaken for finished copy, and turns `[label](href)` into a
// link (router Link for site paths, plain <a> for mailto:/tel:).
const TOKEN = /(\[OWNER MUST PROVIDE:[^\]]*\]|\[[^\]]+\]\([^)]+\))/g;
const LINK = /^\[([^\]]+)\]\(([^)]+)\)$/;
const linkClass = 'text-gold underline underline-offset-2 hover:text-gold-light';

export function renderText(text) {
  return text.split(TOKEN).map((p, i) => {
    if (p.startsWith('[OWNER MUST PROVIDE:')) {
      return <mark key={i} className="bg-amber-500/20 text-amber-200 px-1 rounded not-italic">{p}</mark>;
    }
    const m = p.match(LINK);
    if (m) {
      const [, label, href] = m;
      return href.startsWith('/')
        ? <Link key={i} to={href} className={linkClass}>{label}</Link>
        : <a key={i} href={href} className={linkClass}>{label}</a>;
    }
    return p;
  });
}
