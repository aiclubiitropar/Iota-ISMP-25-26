import { getRoomStartTime } from '../../lib/matchQueue'

export function GET(request) {
  const { searchParams } = new URL(request.url);
  const roomId = searchParams.get('roomId');

  console.log('Fetching room info for roomId:', roomId);
  const roomStartTime = getRoomStartTime(roomId);
  console.log('roomStartTime', roomStartTime);

  if (!roomStartTime) {
    return new Response(JSON.stringify({ error: 'Room not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({
    startTime: getRoomStartTime(roomId),
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}