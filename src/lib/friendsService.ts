import { getPublicProfileByUsername } from './firebaseService';
import { getFirebaseDb, isFirebaseConfigured } from './firebase';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';

export interface FrequentFriend {
  id: string;
  username: string;
  displayName?: string;
  avatar: string;
  photoURL?: string;
  level: number;
  status: 'online' | 'away' | 'offline';
  currentlyPlaying?: string;
  lastSeen: string;
  gamesTogether: number;
  gameId?: string;
}

const STORAGE_KEY_PREFIX = 'gullyverse_squad_friends_';

/**
 * Loads the current user's saved squad friends from localStorage.
 */
export const getSavedFriends = (userId: string): FrequentFriend[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${userId}`);
    if (!raw) return [];
    return JSON.parse(raw) as FrequentFriend[];
  } catch (err) {
    console.warn('Failed to load friends from storage:', err);
    return [];
  }
};

/**
 * Checks whether a specific player is already in the user's friend list.
 */
export const isFriend = (userId: string, usernameOrId: string): boolean => {
  if (!usernameOrId) return false;
  const friends = getSavedFriends(userId);
  const target = usernameOrId.toLowerCase().replace(/^@/, '').trim();
  return friends.some(
    (f) =>
      f.id.toLowerCase() === target ||
      f.username.toLowerCase().replace(/^@/, '').trim() === target
  );
};

/**
 * Saves a new friend to the local and cloud squad lists.
 */
export const saveFriend = async (
  userId: string,
  friend: FrequentFriend
): Promise<boolean> => {
  if (typeof window === 'undefined') return false;
  try {
    const currentFriends = getSavedFriends(userId);
    const targetClean = friend.username.toLowerCase().replace(/^@/, '').trim();

    // Prevent duplicates
    if (
      currentFriends.some(
        (f) => f.username.toLowerCase().replace(/^@/, '').trim() === targetClean
      )
    ) {
      return true;
    }

    const updated = [friend, ...currentFriends];
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${userId}`, JSON.stringify(updated));

    // Optional cloud sync
    const db = getFirebaseDb();
    if (db && isFirebaseConfigured() && userId && !userId.startsWith('usr_guest')) {
      try {
        const friendRef = doc(db, 'users', userId, 'friends', friend.id);
        await setDoc(friendRef, {
          username: friend.username,
          avatar: friend.avatar,
          photoURL: friend.photoURL || null,
          level: friend.level,
          addedAt: new Date().toISOString()
        });
      } catch (cloudErr) {
        // Safe failover to local
      }
    }

    // Broadcast change to other components
    window.dispatchEvent(new CustomEvent('gullyverse_friends_updated'));
    return true;
  } catch (err) {
    console.error('Error saving friend:', err);
    return false;
  }
};

/**
 * Removes a friend from the squad list.
 */
export const removeFriend = async (
  userId: string,
  friendId: string
): Promise<boolean> => {
  if (typeof window === 'undefined') return false;
  try {
    const currentFriends = getSavedFriends(userId);
    const updated = currentFriends.filter((f) => f.id !== friendId && f.username !== friendId);
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${userId}`, JSON.stringify(updated));

    const db = getFirebaseDb();
    if (db && isFirebaseConfigured() && userId && !userId.startsWith('usr_guest')) {
      try {
        const friendRef = doc(db, 'users', userId, 'friends', friendId);
        await deleteDoc(friendRef);
      } catch {
        // Safe failover
      }
    }

    window.dispatchEvent(new CustomEvent('gullyverse_friends_updated'));
    return true;
  } catch (err) {
    console.error('Error removing friend:', err);
    return false;
  }
};

/**
 * Adds a friend by typing their username.
 * Looks up Firebase Firestore first, and if found, uses their actual stats and avatar.
 */
export const addFriendByUsername = async (
  currentUserId: string,
  currentUsername: string,
  targetUsername: string
): Promise<{ success: boolean; message: string; friend?: FrequentFriend }> => {
  const cleanTarget = targetUsername.replace(/^@/, '').trim();
  const cleanCurrent = (currentUsername || '').replace(/^@/, '').trim();

  if (!cleanTarget) {
    return { success: false, message: 'Please enter a valid gamer username.' };
  }

  if (cleanTarget.toLowerCase() === cleanCurrent.toLowerCase()) {
    return { success: false, message: 'You cannot add yourself as a friend!' };
  }

  if (isFriend(currentUserId, cleanTarget)) {
    return { success: false, message: `@${cleanTarget} is already in your squad!` };
  }

  // Look up in Firestore
  let publicProfile = null;
  try {
    publicProfile = await getPublicProfileByUsername(cleanTarget);
  } catch {
    // Continue with fallback profile creation
  }

  const friend: FrequentFriend = {
    id: publicProfile?.id ? `f_${publicProfile.id}` : `f_${cleanTarget.toLowerCase()}`,
    username: publicProfile?.username || cleanTarget,
    displayName: publicProfile?.displayName || publicProfile?.username || cleanTarget,
    avatar: publicProfile?.avatar || '🚀',
    photoURL: publicProfile?.photoURL,
    level: publicProfile?.level || 1,
    status: 'online',
    currentlyPlaying: 'Ready for Gully Battle 🎮',
    lastSeen: 'Active now',
    gamesTogether: 1,
    gameId: 'fun-race'
  };

  await saveFriend(currentUserId, friend);

  return {
    success: true,
    message: `Added @${friend.username} to your Squad! 🎉`,
    friend
  };
};
