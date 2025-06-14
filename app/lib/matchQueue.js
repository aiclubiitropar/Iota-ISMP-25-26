// matchQueue.js — with MongoDB (wrapped for consistent await)

import clientPromise from './mongodb';

// MongoDB collections: queues, rooms

const dbPromise = clientPromise.then(client => client.db('ismp'));

export async function addToQueue(userId) {
  const db = await dbPromise;
  await db.collection('queues').insertOne({ userId });
}

export async function popFromQueue() {
  const db = await dbPromise;
  const count = await db.collection('queues').countDocuments();
  console.log('Queue count:', count);
  const doc = await db.collection('queues').findOneAndDelete({}, { sort: { _id: 1 } });
  console.log('Popped from queue:', doc);
  return doc?.userId || null;
}

export async function removeFromQueue(userId) {
  const db = await dbPromise;
  await db.collection('queues').deleteOne({ userId });
}

export async function isQueueEmpty() {
  const db = await dbPromise;
  const count = await db.collection('queues').countDocuments();
  return count === 0;
}

export async function setRoom(userA, userB, roomId) {
  const db = await dbPromise;
  const now = Date.now();
  await db.collection('rooms').insertOne({
    roomId,
    participants: [userA, userB],
    startTime: now,
  });
}

export async function getUserRoom(userId) {
  const db = await dbPromise;
  const room = await db.collection('rooms').findOne({ participants: userId });
  return room?.roomId || null;
}

export async function getRoomParticipants(roomId) {
  const db = await dbPromise;
  const room = await db.collection('rooms').findOne({ roomId });
  return room?.participants || [];
}

export async function getRoomStartTime(roomId) {
  const db = await dbPromise;
  const room = await db.collection('rooms').findOne({ roomId });
  if (!room) throw new Error(`Room ${roomId} does not exist.`);
  return room.startTime;
}

export async function removeUserFromRoom(userId) {
  const db = await dbPromise;
  const room = await db.collection('rooms').findOne({ participants: userId });
  if (!room) return;

  const remaining = room.participants.filter(p => p !== userId);

  if (remaining.length === 0 || (remaining.length === 1 && remaining[0].startsWith('BOT-'))) {
    await db.collection('rooms').deleteOne({ roomId: room.roomId });
  } else {
    await db.collection('rooms').updateOne(
      { roomId: room.roomId },
      { $pull: { participants: userId } }
    );
  }
}
