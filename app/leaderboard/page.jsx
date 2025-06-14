'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const currentUserId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const res = await fetch('/api/leaderboard');
        const data = await res.json();
        setLeaderboard(data.leaderboard);
      } catch (err) {
        console.error('Failed to load leaderboard', err);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, []);

  if (loading) return <div className="p-4">Loading leaderboard...</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Leaderboard</h1>
      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200 text-left text-gray-700">
            <th className="border px-4 py-2">#</th>
            <th className="border px-4 py-2">User ID</th>
            <th className="border px-4 py-2">Score</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((user, index) => (
            <tr key={user.userId} className={`hover:bg-gray-100 ${
        user.userId === currentUserId ? 'bg-blue-700 text-white-300 font-bold' : ''
      }`}>
              <td className="border px-4 py-2">{index + 1}</td>
              <td className="border px-4 py-2">{user.userId}</td>
              <td className="border px-4 py-2">{user.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center mt-8">
        <button
          onClick={() => router.push('/')}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
