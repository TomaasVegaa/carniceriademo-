import { initializeApp } from 'firebase/app';
import { getFirestore, enableMultiTabIndexedDbPersistence } from 'firebase/firestore';

// Configuración de Firebase (Se debe reemplazar con las credenciales reales del cliente)
// Puedes obtener estos valores creando un proyecto en la consola de Firebase (https://console.firebase.google.com/)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDummyKey-CambiarPorReal",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "carniceria-demo.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "carniceria-demo",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "carniceria-demo.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
const db = getFirestore(app);

// Habilitar persistencia offline para que funcione incluso con cortes de internet cortos
enableMultiTabIndexedDbPersistence(db).catch((err) => {
  console.warn('Firebase Offline Persistence Error:', err);
});

export { db };
