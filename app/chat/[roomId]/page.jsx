'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, use } from 'react';
import Timer from './timer';

export default function ChatRoom({ params }) {
  const router = useRouter();
  const { roomId } = use(params);

  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [guessed, setGuessed] = useState(true);
  const [userId, setUserId] = useState('');
  const [remaining, setRemaining] = useState(0);

  const chatDuration = 0.5 * 60 * 1000;
  const checkDuration = 2 * 1000;

  // Get userId from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const id = localStorage.getItem('userId');
      setUserId(id);
    }
  }, []);

  // Fetch messages
  useEffect(() => {
    if (!roomId) return;
    const interval = setInterval(async () => {
      const res = await fetch(`/api/messages?roomId=${roomId}`);
      const data = await res.json();
      setMessages(data);
    }, checkDuration);

    return () => clearInterval(interval);
  }, [roomId]);

  // Check if user has guessed
  useEffect(() => {
    if (!roomId || !userId) return;
    const checkGuessed = async () => {
      const res = await fetch(`/api/check-guessed?roomId=${roomId}&userId=${userId}`);
      const data = await res.json();
      setGuessed(!!data.guessed);
    };
    checkGuessed();
  }, [roomId, userId]);

  // Handle chat duration and redirect
  useEffect(() => {
    if (!roomId || !userId) return;

    fetch(`/api/room-info?roomId=${roomId}`)
      .then(res => res.json())
      .then(data => {
        const startTime = data.startTime;
        const now = Date.now();
        const elapsed = now - startTime;
        const remaining = chatDuration - elapsed;
        setRemaining(remaining);

        if (remaining <= 0) {
          router.push(`/result?roomId=${roomId}&userId=${userId}`);
        } else {
          setTimeout(() => {
            router.push(`/result?roomId=${roomId}&userId=${userId}`);
          }, remaining);
        }
      });
  }, [roomId, userId]);

  // Always use userId from state
  const sendMessage = async () => {
    if (!userId) return;
    await fetch('/api/send', {
      method: 'POST',
      body: JSON.stringify({
        roomId,
        senderId: userId,
        content,
      }),
      headers: { 'Content-Type': 'application/json' },
    });
    setContent('');
  };

  const handleGuess = async (guess) => {
    if (guessed || !userId) {
      alert('You have already made a guess or userId is missing!');
      return;
    }
    const res = await fetch('/api/submit-guess', {
      method: 'POST',
      body: JSON.stringify({ roomId, userId, guess }),
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) {
      alert('Failed to submit guess');
    } else {
      alert('Guess submitted successfully!');
      setGuessed(true);
    }
    return;
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Room: {roomId}</h1>
      <Timer remaining={remaining} setRemaining={setRemaining} />
      <div className="border p-4 h-64 overflow-y-scroll mb-4 bg-white">
        {messages.map((m, i) => (
          <div className='text-gray-800' key={i}><strong>{m.senderId}</strong>: {m.content}</div>
        ))}
      </div>
      <input
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type a message..."
        className="border px-2 py-1 mr-2"
      />
      <button onClick={sendMessage} className="bg-blue-600 text-white px-4 py-1 rounded">
        Send
      </button>
      <div className="p-4 text-center">
        <h2 className="text-xl font-bold mb-4">Who are you chatting with?</h2>
        <button
          onClick={() => handleGuess('HUMAN')}
          className="m-2 px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          disabled={guessed}
        >
          A Human 👤
        </button>
        <button
          onClick={() => handleGuess('BOT')}
          className="m-2 px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
          disabled={guessed}
        >
          An AI 🤖
        </button>
      </div>
    </div>
  );
}