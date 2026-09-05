import { HeadContext } from './headContext';

// Zero-dependency head management (react-helmet-async doesn't support React 19).
//
// Two modes, one <Seo> component:
//  - CLIENT: collector is null; <Seo> updates document.title/meta via an effect
//    so SPA navigation keeps the head correct.
//  - SERVER (prerender): collector is a mutable object; <Seo> writes the head
//    into it during render, and the prerender script serialises it into the
//    static file's real <head> so crawlers (which don't run JS) see it.
export function HeadProvider({ collector = null, children }) {
  return <HeadContext.Provider value={collector}>{children}</HeadContext.Provider>;
}
