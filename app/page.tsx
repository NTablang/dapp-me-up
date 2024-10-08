"use client";

import AppList, { CryptoApp } from "./components/AppList";
import { useState, useEffect } from "react";
import { db } from "./utils/firebase/config";
import { collection, getDocs } from "firebase/firestore";
import clsx from "clsx";

export default function Home() {
  const [view, setView] = useState<"list" | "card">("list");
  const [cryptoApps, setCryptoApps] = useState<CryptoApp[]>([]);

  useEffect(() => {
    const fetchCryptoApps = async () => {
      const querySnapshot = await getDocs(collection(db, "cryptoApps"));
      const apps = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as CryptoApp[];
      setCryptoApps(apps);
    };

    fetchCryptoApps();
  }, []);

  return (
    <div className="container mx-auto p-4 px-36">
      <main className="pt-6 px-20">
        <div className="flex justify-between items-center border-b mb-6 pb-3">
          <h2 className="text-2xl font-bold mb-4">Crypto Apps On Your Radar</h2>
          <div className="flex justify-end mb-4 gap-2 items-center">
            <button
              className={clsx(
                "opacity-60 px-3 py-2 rounded-[38px] cursor-pointer transition-all justify-center items-center gap-2.5 inline-flex",
                view == "list" ? "sign-in-button" : ""
              )}
              onClick={() => setView("list")}
            >
              List
            </button>
            <button
              className={clsx(
                "opacity-60 px-3 py-2 rounded-[38px] cursor-pointer transition-all justify-center items-center gap-2.5 inline-flex",
                view == "card" ? "sign-in-button" : ""
              )}
              onClick={() => setView("card")}
            >
              Card
            </button>
          </div>
        </div>

        <AppList view={view} data={cryptoApps} />
      </main>
    </div>
  );
}
