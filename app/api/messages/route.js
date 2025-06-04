import clientPromise from '../../lib/mongodb';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const roomId = searchParams.get('roomId');
  const since = searchParams.get('since');

  const client = await clientPromise;
  const db = client.db('ismp');
  const messages = db.collection('messages');

  const query = { roomId };
  if (since) {
    query.timestamp = { $gt: new Date(since) };
  }

  const result = await messages
    .find(query)
    .sort({ timestamp: 1 })
    .toArray();

  return Response.json(result);
}