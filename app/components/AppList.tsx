"use client";

import React, { useState, useEffect, useRef, MouseEvent } from "react";
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
import clsx from "clsx";

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
  const [heartBubbles, setHeartBubbles] = useState<
    { x: number; y: number; id: string; path: string }[]
  >([]);
  const heartButtonRef = useRef<HTMLButtonElement>(null);
  const [hoveredApp, setHoveredApp] = useState<CryptoApp | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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

  const handleMouseMove = (e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleLike = async (appId: string) => {
    const appRef = doc(db, "cryptoApps", appId);
    await updateDoc(appRef, {
      likes: increment(1),
    });

    if (heartButtonRef.current) {
      const { left, top, width, height } =
        heartButtonRef.current.getBoundingClientRect();
      const x = left + width / 2;
      const y = top + height / 2;
      const newBubbles = Array.from({ length: 10 }).map((_, index) => ({
        x,
        y,
        id: `heart-bubble-${heartBubbles.length + index}`,
        path: `bubble-path-${Math.floor(Math.random() * 5) + 1}`,
      }));
      setHeartBubbles([...heartBubbles, ...newBubbles]);
    }
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
      className="relative cursor-pointer"
      onClick={() => handleAppClick(app)}
      onMouseEnter={() => setHoveredApp(app)}
      onMouseLeave={() => setHoveredApp(null)}
      onMouseMove={handleMouseMove}
    >
      {view === "list" ? (
        <>
          <div className="flex items-start pb-4 transition-all ">
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
              className="flex items-center flex-col justify-center"
              onClick={(e) => {
                e.stopPropagation();
                handleLike(app.id);
              }}
              ref={heartButtonRef}
            >
              <Image
                alt="heart"
                src="/Marshki.png"
                className="opacity-80 hover:opacity-100 transition-all"
                width={72}
                height={72}
                unoptimized
                priority
              />
              <span className="ml-1 text-yellow-400">{app.likes}</span>
            </button>
          </div>
          {hoveredApp && hoveredApp.id === app.id && (
            <div
              className="fixed z-10 bg-white shadow-lg rounded-lg p-4 w-64"
              style={{
                left: `${mousePosition.x + 16}px`,
                top: `${mousePosition.y + 16}px`,
              }}
            >
              <div className="relative mb-2 rounded-lg overflow-hidden">
                <Image
                  src={app.screenshot[0]}
                  alt={`${app.name} screenshot`}
                  width={240}
                  height={120}
                  className="object-cover"
                />
              </div>
              <h3 className="text-lg font-semibold">{app.name}</h3>
              <p className="text-sm text-gray-600 mt-2">{app.description}</p>
              <div className="flex items-center mt-2">
                <Image alt="heart" src="/Marshki.png" width={16} height={16} />
                <span className="ml-1 text-yellow-400">{app.likes}</span>
              </div>
            </div>
          )}
        </>
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
              ref={heartButtonRef}
            >
              <Image alt="heart" src="/Marshki.png" width={16} height={16} />
              <span className="ml-1 text-yellow-400">{app.likes}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="app-list-container">
      <div
        className={clsx(
          view === "list"
            ? "space-y-4"
            : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        )}
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
      {heartBubbles.map((bubble, index) => (
        <div
          key={index}
          className={clsx(
            `heart-bubble absolute bg-yellow-500 rounded-full w-4 h-4 ${bubble.path}`
          )}
          style={{ left: bubble.x, top: bubble.y }}
        >
          ❤️
        </div>
      ))}
    </div>
  );
};

export default AppList;