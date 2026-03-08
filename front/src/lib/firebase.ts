import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyBulvgAhKb_h0HIW1O5J5t0VzwVKPHVIiQ",
  authDomain: "minha-vaga-e8ab2.firebaseapp.com",
  projectId: "minha-vaga-e8ab2",
  storageBucket: "minha-vaga-e8ab2.firebasestorage.app",
  messagingSenderId: "123218304272",
  appId: "1:123218304272:web:5216a4bbced338f5b1d995"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

export const storage = getStorage(app);

export const functions = getFunctions(app);

export default app; 