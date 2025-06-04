import clientPromise from '../../lib/mongodb';
import { getRoomParticipants } from '../../lib/matchQueue';
import { askBot } from '../../lib/groq';

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

  const participants = getRoomParticipants(roomId);
  console.log('Participants in room:', participants);
  const otherParticipant = getRoomParticipants(roomId).find(user => user !== senderId);
  console.log('Other participant:', otherParticipant);
  if (otherParticipant.startsWith('BOT-')) {
    console.log(`Simulating bot response for room ${roomId} from user ${senderId}`);
    // Simulate bot response
    const botResponse = await askBot(content);
    await messages.insertOne({
      roomId,
      senderId: 'BOT',
      content: botResponse,
      timestamp: new Date(),
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}