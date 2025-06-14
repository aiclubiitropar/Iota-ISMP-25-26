'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ResultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const roomId = searchParams.get('roomId');

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || !roomId) return;

    async function fetchResult() {
      try {
        const res = await fetch(`/api/get-result?userId=${userId}&roomId=${roomId}`);
        const data = await res.json();
        setResult(data.guess);
      } catch (err) {
        console.error('Failed to fetch result', err);
      } finally {
        setLoading(false);
      }
    }

    fetchResult();
  }, [userId, roomId]);

  if (loading) return <div className="p-4">Loading result...</div>;

  if (!result) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-600 mb-4">No result found for this session.</p>
          <button
          onClick={() => router.push('/leaderboard')}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
        Proceed to Leaderboard
      </button>
      </div>
    );
  }

  const correct = result.guess === result.actual;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-4">Your Guess Was...</h1>
      <div
        className={`text-4xl font-semibold mb-6 ${
          correct ? 'text-green-600' : 'text-red-600'
        }`}
      >
        {correct ? 'Correct 🎉' : 'Incorrect ❌'}
      </div>

      <p className="mb-2 text-gray-700">
        You guessed: <strong>{result.guess}</strong>
      </p>
      <p className="mb-8 text-gray-700">
        Actual identity: <strong>{result.actual}</strong>
      </p>

      <button
        onClick={() => router.push('/leaderboard')}
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Proceed to Leaderboard
      </button>
    </div>
  );
}