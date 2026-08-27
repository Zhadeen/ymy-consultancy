import { useEffect, useRef } from 'react';

// Calls `onIdle` once the user has been inactive for `timeoutMs`, while `enabled`.
//
// Uses a polling interval against a last-activity timestamp rather than a single
// setTimeout, because browsers heavily throttle timers in background tabs — a
// plain 30-minute setTimeout can fire late or not while hidden. Checking elapsed
// wall-clock time on an interval (and again when the tab regains focus) makes the
// timeout hold even if the admin left the tab in the background overnight.
export function useIdleTimeout(enabled, timeoutMs, onIdle) {
  // Keep the latest callback without making it a dependency of the timer effect,
  // so re-renders don't restart the idle clock. Assigned in an effect (not during
  // render) to satisfy the rules of hooks.
  const onIdleRef = useRef(onIdle);
  useEffect(() => { onIdleRef.current = onIdle; }, [onIdle]);

  useEffect(() => {
    if (!enabled) return undefined;

    let lastActivity = Date.now();
    let fired = false;

    const markActive = () => { lastActivity = Date.now(); };
    const activityEvents = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];
    activityEvents.forEach((e) => window.addEventListener(e, markActive, { passive: true }));

    const check = () => {
      if (fired) return;
      if (Date.now() - lastActivity >= timeoutMs) {
        fired = true;
        onIdleRef.current?.();
      }
    };

    const intervalId = setInterval(check, 15000); // check every 15s
    const onVisibility = () => { if (document.visibilityState === 'visible') check(); };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      clearInterval(intervalId);
      activityEvents.forEach((e) => window.removeEventListener(e, markActive));
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [enabled, timeoutMs]);
}
