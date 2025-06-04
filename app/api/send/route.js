import clientPromise from '../../lib/mongodb';

export async function POST(req) {
  const body = await req.json();
  const { roomId, senderId, content } = body;
  const timestamp = new Date();

  if (!roomId || !senderId || !content) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const client = await clientPromise;
  const db = client.db('ismp');
  const messages = db.collection('messages');
  await messages.insertOne({ roomId, senderId, content, timestamp });

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}