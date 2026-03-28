import { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';

const PaymentContext = createContext(null);

export function PaymentProvider({ children }) {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addons, setAddons] = useState([]);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const subDoc = await getDoc(doc(db, 'subscriptions', user.uid));
        if (subDoc.exists()) {
          setSubscription(subDoc.data());
          setAddons(subDoc.data().addons || []);
        }
      } catch (err) {
        console.error('Error fetching subscription:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSubscription();
  }, [user]);

  const subscribe = async (planId, paymentMethodId = null) => {
    if (!user) throw new Error('Must be logged in');
    
    const subscriptionData = {
      planId,
      status: 'active',
      startDate: new Date().toISOString(),
      addons: [],
      paymentMethodId,
    };

    await setDoc(doc(db, 'subscriptions', user.uid), subscriptionData);
    setSubscription(subscriptionData);
    setAddons([]);
    return subscriptionData;
  };

  const cancelSubscription = async () => {
    if (!user) throw new Error('Must be logged in');
    
    await updateDoc(doc(db, 'subscriptions', user.uid), {
      status: 'cancelled',
      cancelDate: new Date().toISOString(),
    });
    setSubscription(prev => ({ ...prev, status: 'cancelled' }));
  };

  const addAddon = async (addonId) => {
    if (!user) throw new Error('Must be logged in');
    
    const newAddons = [...addons, addonId];
    await updateDoc(doc(db, 'subscriptions', user.uid), {
      addons: newAddons,
    });
    setAddons(newAddons);
  };

  const removeAddon = async (addonId) => {
    if (!user) throw new Error('Must be logged in');
    
    const newAddons = addons.filter(a => a !== addonId);
    await updateDoc(doc(db, 'subscriptions', user.uid), {
      addons: newAddons,
    });
    setAddons(newAddons);
  };

  const getPlan = (planId) => {
    const { SUBSCRIPTION_PLANS } = require('../config/stripe');
    return SUBSCRIPTION_PLANS.find(p => p.id === planId);
  };

  return (
    <PaymentContext.Provider value={{
      subscription,
      loading,
      addons,
      subscribe,
      cancelSubscription,
      addAddon,
      removeAddon,
      getPlan,
    }}>
      {children}
    </PaymentContext.Provider>
  );
}

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) throw new Error('usePayment must be used within PaymentProvider');
  return context;
};
