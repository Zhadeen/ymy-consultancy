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

    // This is the modern Zendesk "messaging" widget (Web SDK). The old
    // Web Widget (Classic) APIs (zE('webWidget', ...)) no longer exist here
    // and throw if called, so we only use the 'messenger' namespace.
    script.onload = () => {
      if (!window.zE) return;

      // Hide the native launcher bubble so it doesn't overlap our custom
      // FloatingContact button. The widget boots asynchronously, so retry
      // for ~3 seconds until 'messenger' is ready to accept the command.
      let attempts = 0;
      const hideInterval = setInterval(() => {
        try {
          window.zE('messenger', 'hide');
        } catch (e) {
          // messenger not ready yet — keep retrying until it is
        }
        attempts++;
        if (attempts > 30) clearInterval(hideInterval);
      }, 100);

      // When the user closes the chat, hide the launcher again so it stays
      // out of the way of our custom button.
      try {
        window.zE('messenger:on', 'close', () => {
          try { window.zE('messenger', 'hide'); } catch (e) { /* ignore */ }
        });
      } catch (e) { /* ignore */ }
    };

    document.body.appendChild(script);

    return () => {
      // Cleanup if needed
    };
  }, []);
}
