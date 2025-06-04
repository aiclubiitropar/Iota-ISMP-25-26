import { v4 as uuidv4 } from 'uuid';

export function getOrCreateUserId() {
  let userId = localStorage.getItem('userId');
  if (!userId) {
    userId = uuidv4(); // Generates something like "9a56e1ba-1c59-4a2a-a48a-5c8d9fd0d9d4"
    localStorage.setItem('userId', userId);
  }
  return userId;
}
