import clientPromise from '../../lib/mongodb';
import { getRoomParticipants, removeUserFromRoom } from '../../lib/matchQueue';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const roomId = searchParams.get('roomId');

  if (!userId || !roomId) {
    return new Response(JSON.stringify({ error: 'Missing userId or roomId' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const db = (await clientPromise).db();
    const guess = await db.collection('guesses').findOne({ userId, roomId });

    const participants = getRoomParticipants(roomId);
    participants.forEach(u => {
      if (u === userId) removeUserFromRoom(u);
    });

    if (!guess) {
      return new Response(JSON.stringify({ error: 'Guess not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ guess }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[get-result error]', err);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}