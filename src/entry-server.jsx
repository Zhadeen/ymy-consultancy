import { renderToString } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { AppTree } from './App.jsx';
import { HeadProvider } from './seo/HeadProvider';
import { PRERENDER_ROUTES } from './config/site';

// Used by scripts/prerender.mjs. Renders the app for one URL and returns the
// HTML plus the head the <Seo> components collected during that render.
export function render(url) {
  const head = {};
  const html = renderToString(
    <MemoryRouter initialEntries={[url]}>
      <HeadProvider collector={head}>
        <AppTree />
      </HeadProvider>
    </MemoryRouter>
  );
  return { html, head };
}

export const routes = PRERENDER_ROUTES;
