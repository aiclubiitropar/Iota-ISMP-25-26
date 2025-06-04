'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, use } from 'react';

export default function ChatRoom({ params }) {
  const router = useRouter();
  const { roomId } = use(params);

  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');

  useEffect(() => {
    if (!roomId) return;

    const interval = setInterval(async () => {
      const res = await fetch(`/api/messages?roomId=${roomId}`);
      const data = await res.json();
      setMessages(data);
    }, 10000);

    return () => clearInterval(interval);
  }, [roomId]);

  const sendMessage = async () => {
    await fetch('/api/send', {
      method: 'POST',
      body: JSON.stringify({
        roomId,
        senderId: localStorage.getItem('userId'), // Replace with real user ID or random
        content,
      }),
    });
    setContent('');
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Room: {roomId}</h1>
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
    </div>
  );
}
