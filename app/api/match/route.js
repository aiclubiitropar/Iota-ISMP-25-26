import { addToQueue, popFromQueue, removeFromQueue, isQueueEmpty, getUserRoom, setRoom } from '../../lib/matchQueue';
import { v4 as uuidv4 } from 'uuid';

export function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  const existingRoom = getUserRoom(userId);
  if (existingRoom) {
    // Already matched
    // Clean up: if somehow in queue, remove from queue
    removeFromQueue(userId);
    return new Response(JSON.stringify({ status: 'paired', roomId: existingRoom }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 💡 Randomly pair with AI bot
  const shouldPairWithBot = Math.random() < 1;

  if (shouldPairWithBot) {
    const roomId = uuidv4();
    const botId = `BOT-${uuidv4()}`;
    setRoom(userId, botId, roomId); // 'BOT-...' is the second participant
    return new Response(JSON.stringify({ status: 'paired', roomId }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (isQueueEmpty()) {
    addToQueue(userId);
    return new Response(JSON.stringify({ status: 'waiting' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } else {
    const otherUser = popFromQueue();
    const roomId = uuidv4();

    setRoom(userId, otherUser, roomId);

    return new Response(JSON.stringify({ status: 'paired', roomId }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}