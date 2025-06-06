const queue = [];
const userToRoom = {}; // userId -> roomId
const roomStartTime = {}; // roomId -> startTime

export function addToQueue(userId) {
  queue.push(userId);
}

export function popFromQueue() {
  return queue.shift();
}

export function removeFromQueue(userId) {
  const index = queue.indexOf(userId);
  if (index !== -1) {
    queue.splice(index, 1);
  }
}

export function isQueueEmpty() {
  return queue.length === 0;
}

export function setRoom(userA, userB, roomId) {
  userToRoom[userA] = roomId;
  userToRoom[userB] = roomId;
  roomStartTime[roomId] = Date.now();
}

export function getUserRoom(userId) {
  return userToRoom[userId];
}

export function getRoomParticipants(roomId) {
  return Object.keys(userToRoom).filter(user => userToRoom[user] === roomId);
}

export function getRoomStartTime(roomId) {
  console.log('here')
  if (!roomStartTime[roomId]) {
    throw new Error(`Room ${roomId} does not exist.`);
  }
  return roomStartTime[roomId];
}

export function removeUserFromRoom(userId) {
  const roomId = userToRoom[userId];
  if (roomId) {
    delete userToRoom[userId];
    const participants = getRoomParticipants(roomId);
    if (participants.length === 0 || participants.length === 1 && participants[0].startsWith('BOT-')) {
      delete roomStartTime[roomId]; // Clean up if no participants left
    }
  }
}