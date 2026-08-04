import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import firebaseConfig from '../firebase-applet-config.json' with { type: 'json' };

const adminApp = admin.apps.length ? admin.app() : admin.initializeApp({
  projectId: process.env.FIREBASE_PROJECT_ID || firebaseConfig.projectId,
});

export const db = getFirestore(adminApp, process.env.FIREBASE_FIRESTORE_DATABASE_ID || firebaseConfig.firestoreDatabaseId);
export const auth = admin.auth(adminApp);
export default admin;
