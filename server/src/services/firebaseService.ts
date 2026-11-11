import { getApps } from 'firebase-admin/app';
import { getDatabase, ServerValue } from 'firebase-admin/database';

export const logActivityToFirebase = async (activityData: any) => {
  if (!getApps().length) {
    console.warn('Firebase not initialized. Skipping RTDB write.');
    return;
  }
  
  try {
    const db = getDatabase();
    const ref = db.ref('activities');
    await ref.push({
      ...activityData,
      timestamp: ServerValue.TIMESTAMP
    });
  } catch (error) {
    console.error('Firebase DB write error:', error);
  }
};
