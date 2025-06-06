// check whether the user has already guessed human or ai

import clientPromise from '../../lib/mongodb';

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
    const existing = await db.collection('guesses').findOne({ userId, roomId });
    const guessed = !!existing; // true if guess found, false otherwise

    return new Response(JSON.stringify({ guessed }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[check-guessed error]', err);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}