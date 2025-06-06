import clientPromise from '../../lib/mongodb';

export async function POST(request) {
  try {
    const { userId } = await request.json();
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Missing userId' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const db = (await clientPromise).db();
    const existing = await db.collection('scores').findOne({ userId });
    if (!existing) {
      await db.collection('scores').insertOne({ userId, score: 0 });
    }

    return new Response(JSON.stringify({ message: 'User registered or already exists' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[register-user error]', err);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}