import { useEffect, useState } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { mockGuides } from '../../data/mockData';

export default function SeedData() {
  const [status, setStatus] = useState('Idle');

  const seedDatabase = async () => {
    setStatus('Seeding guides...');
    try {
      const guidesRef = collection(db, 'guides');
      
      for (let i = 0; i < mockGuides.length; i++) {
        const { id, ...guideData } = mockGuides[i];
        await addDoc(guidesRef, {
          ...guideData,
          createdAt: new Date()
        });
      }

      setStatus('Seeding complete! Refresh the search page.');
    } catch (err) {
      console.error(err);
      setStatus(`Error seeding: ${err.message}`);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-dark-600 p-4 rounded-xl border border-gold z-50">
      <h3 className="text-cream font-bold mb-2">Dev Tools: Firebase Seeder</h3>
      <p className="text-muted text-sm mb-4">Status: {status}</p>
      <button 
        onClick={seedDatabase}
        className="btn-gold w-full text-sm py-2"
        disabled={status.includes('Seeding')}
      >
        Run Seed Script
      </button>
    </div>
  );
}
