'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getOrCreateUserId } from './utils/userId';

export default function Home() {
  const router = useRouter();
  const [isWaiting, setIsWaiting] = useState(false);

  const startMatching = async () => {
    const userId = getOrCreateUserId();

    const res = await fetch(`/api/match?userId=${userId}`);
    const data = await res.json();

    if (data.status === 'paired') {
      router.push(`/chat/${data.roomId}`);
    } else {
      setIsWaiting(true);
    }
  };

  useEffect(() => {
    if (!isWaiting) return;

    const interval = setInterval(async () => {
      const userId = getOrCreateUserId();
      const res = await fetch(`/api/check-match?userId=${userId}`);
      const data = await res.json();
      console.log('paired status:', data.paired);

      if (data.paired) {
        clearInterval(interval);
        router.push(`/chat/${data.roomId}`);
      }
    }, 3000); // check every 3 seconds

    return () => clearInterval(interval);
  }, [isWaiting]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4">Anonymous Chat</h1>
      <button
        onClick={startMatching}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Start Chat
      </button>
      {isWaiting && <p className="mt-4 text-gray-600">Looking for a partner...</p>}
    </div>
  );
}
