"use client";

import AppList, { CryptoApp } from "./components/AppList";
import Navbar from "./components/Navbar";
import { useState, useEffect } from "react";
import { db } from "./utils/firebase/config";
import { collection, getDocs } from "firebase/firestore";

export default function Home() {
  const [view, setView] = useState<"list" | "card">("list");
  const [cryptoApps, setCryptoApps] = useState<CryptoApp[]>([]);

  useEffect(() => {
    const fetchCryptoApps = async () => {
      const querySnapshot = await getDocs(collection(db, "cryptoApps"));
      const apps = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as CryptoApp[];
      setCryptoApps(apps);
    };

    fetchCryptoApps();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <Navbar />

      <main>
        <h2 className="text-2xl font-bold mb-4">Crypto Apps On Your Radar</h2>
        <div className="flex justify-end mb-4">
          <button
            className={`mr-2 ${view === 'list' ? 'text-yellow-400' : 'text-gray-500'}`}
            onClick={() => setView('list')}
          >
            List
          </button>
          <button
            className={view === 'card' ? 'text-yellow-400' : 'text-gray-500'}
            onClick={() => setView('card')}
          >
            Card
          </button>
        </div>
        
        <AppList view={view} data={cryptoApps} />
      </main>
    </div>
  );
}