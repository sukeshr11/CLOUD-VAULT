
import { initializeApp, getApps, cert } from 'firebase-admin/app';

let firebaseReady = false;

export const initFirebase = (): boolean => {
  const projectId = process.env.FIREBASE_PROJECT_ID?.trim();
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
    ?.trim()
    .replace(/^["']|["']$/g, '');

  const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ?.trim()
    .replace(/^["']|["']$/g, '')
    .replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    console.warn('Firebase credentials missing. Check server/.env');
    return false;
  }

  if (
    privateKey.includes('YOUR_ACTUAL_PRIVATE_KEY_CONTENT') ||
    !privateKey.includes('-----BEGIN PRIVATE KEY-----') ||
    !privateKey.includes('-----END PRIVATE KEY-----')
  ) {
    console.error('Firebase private key format is invalid.');
    return false;
  }

  try {
    if (getApps().length === 0) {
      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    }

    firebaseReady = true;
    console.log('Firebase Admin initialized successfully');
    return true;
  } catch (error) {
    firebaseReady = false;
    console.error('Firebase initialization failed:', error);
    return false;
  }
};

export const isFirebaseReady = (): boolean =>
  firebaseReady && getApps().length > 0;
