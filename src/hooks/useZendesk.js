import { useEffect } from 'react';

export function useZendesk() {
  useEffect(() => {
    // Only load if a key is provided
    const zendeskKey = import.meta.env.VITE_ZENDESK_KEY;
    if (!zendeskKey) {
      console.log('No Zendesk key found in environment variables.');
      return;
    }

    // Check if it's already loaded to prevent duplicate scripts
    if (document.getElementById('ze-snippet')) {
      return;
    }

    const script = document.createElement('script');
    script.id = 'ze-snippet';
    script.src = `https://static.zdassets.com/ekr/snippet.js?key=${zendeskKey}`;
    script.async = true;
    
    // Hide the native Zendesk launcher bubble if you want to use the custom FloatingContact button
    script.onload = () => {
      if (window.zE) {
        window.zE('webWidget', 'hide');
        window.zE('webWidget:on', 'close', () => {
          window.zE('webWidget', 'hide');
        });
      }
    };
    
    document.body.appendChild(script);

    return () => {
      // Cleanup if needed
    };
  }, []);
}
