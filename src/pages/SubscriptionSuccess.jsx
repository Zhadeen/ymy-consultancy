import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function SubscriptionSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const [errorMsg, setErrorMsg] = useState('');
  const processingRef = useRef(false);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      setStatus('error');
      setErrorMsg('No session ID found.');
      return;
    }

    if (processingRef.current) return;
    processingRef.current = true;

    const verifySubscription = async () => {
      try {
        const res = await fetch('/api/verify-subscription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });

        const data = await res.json();

        if (!res.ok || data.payment_status !== 'paid') {
          throw new Error(data.message || 'Payment verification failed.');
        }

        const metadata = data.metadata;
        const isTourist = metadata?.type === 'tourist_subscription';
        const isGuide = metadata?.type === 'guide_subscription';

        if (!isTourist && !isGuide) {
           throw new Error('Invalid subscription context.');
        }

        const userId = isTourist ? metadata.userId : metadata.guideId;
        const planId = metadata.planId || 'tourist_pass';
        const planName = metadata.planName || 'Tourist Pass';

        // Process Database Updates
        await setDoc(doc(db, 'subscriptions', userId), {
          planId,
          planName,
          status: 'active',
          paymentStatus: 'paid',
          subscriptionId: data.subscription_id,
          stripeSessionId: sessionId,
          type: metadata.type,
          updatedAt: new Date().toISOString()
        }, { merge: true });

        // Update the primary user document to unlock features
        await updateDoc(doc(db, 'users', userId), {
          isSubscribed: true
        });

        // If guide, also update the guides collection
        if (isGuide) {
          await updateDoc(doc(db, 'guides', userId), {
            isSubscribed: true
          });
        }

        setStatus(isTourist ? 'success_tourist' : 'success_guide');

      } catch (err) {
        console.error('Subscription verification error:', err);
        setStatus('error');
        setErrorMsg(err.message || 'An error occurred during verification.');
      }
    };

    verifySubscription();
  }, [searchParams]);

  return (
    <main className="pt-20 min-h-screen bg-dark-900 flex items-center justify-center p-4">
      <div className="card-dark max-w-md w-full p-8 text-center border-gold/20">
        {status === 'verifying' && (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mb-4" />
            <h2 className="font-heading text-xl font-bold text-cream mb-2">Verifying Subscription...</h2>
            <p className="text-muted text-sm">Please wait while we confirm your payment with Stripe.</p>
          </div>
        )}

        {(status === 'success_guide' || status === 'success_tourist') && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
              <CheckCircle2 size={32} className="text-green-500" />
            </div>
            <h2 className="font-heading text-2xl font-bold text-cream mb-4">
              {status === 'success_guide' ? 'You are now Live!' : 'Welcome to YMY!'}
            </h2>
            <p className="text-muted mb-8 leading-relaxed">
              {status === 'success_guide' 
                ? 'Your subscription is active. Your profile is now eligible to receive bookings from tourists.'
                : 'Your Tourist Pass is active. You can now message and book any of our verified guides.'
              }
            </p>
            <button 
              onClick={() => navigate(status === 'success_guide' ? '/guide-dashboard' : '/search')} 
              className="btn-gold w-full flex items-center justify-center gap-2"
            >
              {status === 'success_guide' ? 'Go to Dashboard' : 'Find Your Guide'} <ArrowRight size={18} />
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
              <AlertCircle size={32} className="text-red-400" />
            </div>
            <h2 className="font-heading text-2xl font-bold text-cream mb-4">Verification Failed</h2>
            <p className="text-red-400 mb-8">{errorMsg}</p>
            <div className="flex gap-4 w-full">
              <button onClick={() => navigate('/pricing')} className="btn-ghost flex-1">
                Back to Pricing
              </button>
              <button onClick={() => window.location.reload()} className="btn-gold flex-1">
                Retry
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
