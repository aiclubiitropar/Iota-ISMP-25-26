import clientPromise from '../../lib/mongodb';
import { getRoomParticipants, getUserRoom, getRoomStartTime } from '../../lib/matchQueue';

export async function POST(request) {

  try {
    const body = await request.json();
    const { roomId, userId, guess } = body;
    const db = (await clientPromise).db();

    if (!roomId || !userId || !guess) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const expectedRoom = await getUserRoom(userId);
    if (!expectedRoom || expectedRoom !== roomId) {
      return new Response(JSON.stringify({ error: 'User not in this room' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const alreadyGuessed = await db.collection('guesses').findOne({ userId, roomId });
    if (alreadyGuessed) {
      return new Response(JSON.stringify({ error: 'User has already guessed' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const participants = await getRoomParticipants(roomId);
    const otherUserId = participants.find(uid => uid !== userId);
    const actual = otherUserId.startsWith('BOT-') ? 'BOT' : 'HUMAN';
    const timeTaken = Date.now() - await getRoomStartTime(roomId);

    const isCorrect = guess === actual;
    const scoreDelta = getScoreDelta(isCorrect, timeTaken);

    // Upsert the user's score
    await db.collection('scores').updateOne(
      { userId },
      { $inc: { score: scoreDelta } },
      { upsert: true }
    );

    const result = {
      roomId,
      userId,
      guess,
      actual,
      timestamp: new Date(),
      timeTaken,
      scoreDelta,
    };

    await db.collection('guesses').insertOne(result);
    return new Response(JSON.stringify({ success: true, result }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

function getScoreDelta(isCorrect, timeTaken) {
  const MAX_SCORE = Number(process.env.MAX_SCORE);
  const DECAY_RATE = Number(process.env.DECAY_RATE);
  const timeInSeconds = timeTaken / 1000;
  const baseScore = Math.round(MAX_SCORE * Math.exp(-DECAY_RATE * timeInSeconds));
  const scoreDelta = isCorrect ? baseScore : -Math.round(MAX_SCORE / 2);
  return scoreDelta;
}
