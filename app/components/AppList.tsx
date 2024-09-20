"use client";

import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import Image from "next/image";
import { db } from "../utils/firebase/config";
import {
  doc,
  updateDoc,
  increment,
  onSnapshot,
  collection,
} from "firebase/firestore";
import { AppOverlay } from "./AppOverlay";

export interface CryptoApp {
  id: string;
  name: string;
  description: string;
  logo: string;
  likes: number;
  screenshot: string[];
  liked: boolean;
  award?: string;
}

interface AppListProps {
  view: "list" | "card";
  data: CryptoApp[];
}

const AppList: React.FC<AppListProps> = ({ view, data: initialData }) => {
  const [data, setData] = useState(initialData);
  const [selectedApp, setSelectedApp] = useState<CryptoApp | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "cryptoApps"), (snapshot) => {
      const updatedData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as CryptoApp[];
      setData(updatedData);
    });

    return () => unsubscribe();
  }, []);

  const handleLike = async (appId: string) => {
    const appRef = doc(db, "cryptoApps", appId);
    await updateDoc(appRef, {
      likes: increment(1),
    });
  };

  const handleAppClick = (app: CryptoApp) => {
    setSelectedApp(app);
  };

  const handleLikeApp = (appId: string) => {
    handleLike(appId);
  };

  const renderAppItem = (app: CryptoApp) => (
    <div
      key={app.id}
      className="cursor-pointer"
      onClick={() => handleAppClick(app)}
    >
      {view === "list" ? (
        <div className="flex items-start border-b pb-4">
          <Image
            src={app.logo}
            alt={`${app.name} logo`}
            width={48}
            height={48}
            className="mr-4"
          />
          <div className="flex-grow">
            <h3 className="text-lg font-semibold">{app.name}</h3>
            <p className="text-sm text-gray-600">{app.description}</p>
          </div>
          <button
            className="flex items-center"
            onClick={(e) => {
              e.stopPropagation();
              handleLike(app.id);
            }}
          >
            <Heart className={app.liked ? "text-red-500" : "text-yellow-400"} />
            <span className="ml-1 text-yellow-400">{app.likes}</span>
          </button>
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="relative mb-2 rounded-lg overflow-hidden">
            <Image
              src={app.screenshot[0]}
              alt={`${app.name} screenshot`}
              width={400}
              height={192}
              className="object-cover"
            />
          </div>
          <div className="flex items-start">
            <Image
              src={app.logo}
              alt={`${app.name} logo`}
              width={40}
              height={40}
              className="mr-2"
            />
            <div className="flex-grow">
              <h3 className="text-lg font-semibold">{app.name}</h3>
              <p className="text-sm text-gray-600 mt-2">{app.description}</p>
            </div>
            <button
              className="flex items-center"
              onClick={(e) => {
                e.stopPropagation();
                handleLike(app.id);
              }}
            >
              <Heart
                className={app.liked ? "text-red-500" : "text-yellow-400"}
              />
              <span className="ml-1 text-yellow-400">{app.likes}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <div
        className={
          view === "list"
            ? "space-y-4"
            : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        }
      >
        {data.map(renderAppItem)}
      </div>
      {selectedApp && (
        <AppOverlay
          app={selectedApp}
          onClose={() => setSelectedApp(null)}
          onLike={handleLikeApp}
        />
      )}
    </>
  );
};

export default AppList;
