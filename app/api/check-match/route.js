import { getUserRoom } from '../../lib/matchQueue';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const roomId = await getUserRoom(userId);

  if (roomId) {
    return Response.json({ paired: true, roomId }, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } else {
    return Response.json({ paired: false }, {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
