import { createContext, useContext } from 'react';

// Head-collection context. Kept in a plain module (not the provider component
// file) so the provider file can export only a component — keeps React Fast
// Refresh happy. See HeadProvider.jsx / Seo.jsx for usage.
export const HeadContext = createContext(null);

export const useHeadCollector = () => useContext(HeadContext);
