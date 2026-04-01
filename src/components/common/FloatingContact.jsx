import { useState, useEffect } from 'react';
import { MessageSquare, X, MessageCircle, Headset } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FloatingContact() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Correct WhatsApp number: +90 543 508 28 86
  const whatsappNumber = "905435082886"; 
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  // Show tooltip after 3 seconds, then hide after 8
  useEffect(() => {
    const timer = setTimeout(() => setShowTooltip(true), 3000);
    const hideTimer = setTimeout(() => setShowTooltip(false), 8000);
    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-4">
      {/* Tooltip / Welcome Message */}
      <AnimatePresence>
        {showTooltip && !isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.8 }}
            className="bg-white text-dark-900 px-4 py-2 rounded-2xl shadow-2xl border border-gold/20 mb-2 relative mr-2"
          >
            <p className="text-sm font-medium">Need help? Chat with us! 👋</p>
            <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-3 h-3 bg-white rotate-45 border-r border-t border-gold/20" />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="flex flex-col gap-3 mb-2 w-64 pb-4"
          >
            <div className="bg-dark-800/90 backdrop-blur-xl border border-gold/30 rounded-3xl p-4 shadow-2xl overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent pointer-events-none" />
              
              <div className="relative space-y-3">
                <div className="pb-2 border-b border-white/10">
                  <h4 className="text-cream font-semibold">Customer Support</h4>
                  <p className="text-cream/50 text-xs">We typically reply in minutes</p>
                </div>

                {/* WhatsApp Option */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 bg-[#25D366] hover:bg-[#1ebd5a] text-white p-3 rounded-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-lg group/btn"
                >
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <MessageCircle size={22} fill="currentColor" className="text-white" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold leading-tight">WhatsApp</span>
                    <span className="text-[10px] opacity-80">Instant connection</span>
                  </div>
                </a>

                {/* Live Chat Option */}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    if (window.zE) {
                      // Support Classic Web Widget
                      try {
                        window.zE('webWidget', 'show');
                        window.zE('webWidget', 'open');
                      } catch (e) {
                         // silently ignore
                      }
                      
                      // Support Modern Zendesk Messaging
                      try {
                        window.zE('messenger', 'show');
                        window.zE('messenger', 'open');
                      } catch (e) {
                         // silently ignore
                      }
                    } else {
                      alert("Live Support is currently offline or missing configuration.");
                    }
                  }}
                  className="flex items-center gap-3 bg-dark-700 hover:bg-dark-600 border border-gold/30 text-cream p-3 rounded-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-lg group/btn w-full text-left"
                >
                  <div className="w-10 h-10 bg-gold/20 rounded-xl flex items-center justify-center text-gold">
                    <Headset size={22} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold leading-tight">Live Chat</span>
                    <span className="text-[10px] text-cream/50">Speak with an agent</span>
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Floating Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          // If they click the golden button, force Zendesk to hide instantly
          if (window.zE) {
            try { window.zE('messenger', 'close'); } catch(e) {}
            try { window.zE('webWidget', 'close'); } catch(e) {}
            try { window.zE('messenger', 'hide'); } catch(e) {}
            try { window.zE('webWidget', 'hide'); } catch(e) {}
          }
        }}
        className={`relative w-16 h-16 rounded-3xl flex items-center justify-center shadow-2xl transition-all duration-500 overflow-hidden group ${
          isOpen 
            ? 'bg-dark-800 border border-gold/50 rotate-90' 
            : 'bg-gradient-to-br from-gold via-gold/90 to-gold-dark text-dark-900 border border-gold-light/30'
        }`}
      >
        {/* Glow effect */}
        {!isOpen && (
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        )}
        
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ opacity: 0, rotate: -45 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 45 }}
              transition={{ duration: 0.2 }}
            >
              <X size={28} className="text-gold" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center justify-center"
            >
              <MessageSquare size={28} />
              {/* Optional: Notification Badge */}
              <span className="absolute top-3 right-3 w-3 h-3 bg-red-500 border-2 border-gold rounded-full animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      {/* Background Dim - Only when open */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[-1]"
          />
        )}
      </AnimatePresence>
    </div>
  );
}

