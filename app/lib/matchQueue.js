const queue = [];
const userToRoom = {}; // userId -> roomId

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
}

export function getUserRoom(userId) {
  return userToRoom[userId];
}
