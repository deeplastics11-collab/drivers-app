
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, serverTimestamp, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const REQUIRED_FIREBASE_KEYS = [
  'apiKey',
  'authDomain',
  'projectId',
  'storageBucket',
  'messagingSenderId',
  'appId',
] as const;

const getMissingFirebaseKeys = (config: Record<string, unknown>): string[] => {
  return REQUIRED_FIREBASE_KEYS.filter((key) => {
    const value = config[key];
    return typeof value !== 'string' || value.trim() === '' || value.includes('REPLACE_ME');
  });
};

const missingFirebaseKeys = getMissingFirebaseKeys(firebaseConfig as Record<string, unknown>);

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId); 
export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        return result.user;
    } catch (error) {
        console.error("Firebase Login Error:", error);
        throw error;
    }
};

export const logout = () => auth.signOut();

export const checkUserRegistration = async (userId: string) => {
    const path = `users/${userId}`;
    try {
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);
        return docSnap.exists();
    } catch (error) {
        handleFirestoreError(error, OperationType.GET, path);
        return false;
    }
};

export const checkUserPremium = async (userId: string) => {
    const path = `users/${userId}`;
    try {
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data().isPremium === true;
        }
        return false;
    } catch (error) {
        console.error("Failed to check premium status:", error);
        return false;
    }
};

export const upgradeUserPremium = async (userId: string) => {
    const path = `users/${userId}`;
    try {
        const docRef = doc(db, 'users', userId);
        await setDoc(docRef, { isPremium: true }, { merge: true });
        return true;
    } catch (error) {
        console.error("Failed to upgrade to premium:", error);
        return false;
    }
};

export const registerUser = async (userData: {
    userId: string;
    email: string;
    displayName: string;
    expertise?: string;
    location?: string;
}) => {
    const path = `users/${userData.userId}`;
    try {
        const docRef = doc(db, 'users', userData.userId);
        await setDoc(docRef, {
            ...userData,
            isPremium: false, // Default to free on register
            registeredAt: serverTimestamp(),
            lastActiveAt: serverTimestamp()
        }, { merge: true }); // Use merge just in case
    } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
    }
};

export const updateLastActive = async (userId: string) => {
    const path = `users/${userId}`;
    try {
        const docRef = doc(db, 'users', userId);
        await setDoc(docRef, {
            lastActiveAt: serverTimestamp()
        }, { merge: true });
    } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
    }
};

async function testConnection() {
  if (missingFirebaseKeys.length > 0) {
    console.error(
      `Invalid Firebase configuration. Missing/placeholder keys: ${missingFirebaseKeys.join(', ')}. Update firebase-applet-config.json.`
    );
    return;
  }

  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('the client is offline')) {
        console.error('Unable to reach Firestore. Check network access and Firebase configuration values.');
        return;
      }

      console.error(`Firebase connection test failed: ${error.message}`);
      return;
    }

    console.error('Firebase connection test failed with an unknown error.');
  }
}
testConnection();
