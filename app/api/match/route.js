import { addToQueue, popFromQueue, removeFromQueue, isQueueEmpty, getUserRoom, setRoom } from '../../lib/matchQueue';
import { v4 as uuidv4 } from 'uuid';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  const existingRoom = await getUserRoom(userId);
  if (existingRoom) {
    // Already matched
    // Clean up: if somehow in queue, remove from queue
    await removeFromQueue(userId);
    return new Response(JSON.stringify({ status: 'paired', roomId: existingRoom }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 💡 Randomly pair with AI bot
  let probability = Number(process.env.PAIR_WITH_BOT_PROBABILITY);
  if (isNaN(probability) || probability < 0 || probability > 1) {
    probability = 1/3; // Default to 1/3 if invalid
  }
  console.log('PAIR_WITH_BOT_PROBABILITY:', probability);
  const a = Math.random();
  console.log('Random value for pairing with bot:', a);
  const shouldPairWithBot = a < probability;
  console.log('shouldPairWithBot:', shouldPairWithBot);

  if (shouldPairWithBot) {
    const roomId = uuidv4();
    const botId = `BOT-${uuidv4()}`;
    await setRoom(userId, botId, roomId); // 'BOT-...' is the second participant
    return new Response(JSON.stringify({ status: 'paired', roomId }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (await isQueueEmpty()) {
    await addToQueue(userId);
    return new Response(JSON.stringify({ status: 'waiting' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } else {
    console.log('Queue is not empty, pairing with another user');
    const otherUser = await popFromQueue();
    console.log('Other user found:', otherUser);
    const roomId = uuidv4();

    await setRoom(userId, otherUser, roomId);

    return new Response(JSON.stringify({ status: 'paired', roomId }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}