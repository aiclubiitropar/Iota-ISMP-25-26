import clientPromise from '../../lib/mongodb';

export async function GET(request) {
  try {
    const db = (await clientPromise).db();

    const topUsers = await db
      .collection('scores')
      .find({})
      .sort({ score: -1 })
      .limit(50)
      .toArray();

    return new Response(JSON.stringify({ leaderboard: topUsers }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[leaderboard error]', err);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}