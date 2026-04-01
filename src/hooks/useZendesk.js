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
    
    // Hide the native Zendesk launcher bubble so it doesn't overlap with our custom FloatingContact
    script.onload = () => {
      if (window.zE) {
        // Aggressively hide the launcher during the 3-second async boot window
        let attempts = 0;
        const hideInterval = setInterval(() => {
          if (window.zE) window.zE('webWidget', 'hide');
          attempts++;
          if (attempts > 30) clearInterval(hideInterval); // Stop after 3 seconds
        }, 100);

        // Ensure when the user closes the chat, the launcher is explicitly hidden again
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
