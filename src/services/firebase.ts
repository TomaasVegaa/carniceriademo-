import { initializeApp } from 'firebase/app';
import { getFirestore, enableMultiTabIndexedDbPersistence } from 'firebase/firestore';

// Configuración de Firebase (Se debe reemplazar con las credenciales reales del cliente)
// Puedes obtener estos valores creando un proyecto en la consola de Firebase (https://console.firebase.google.com/)
const firebaseConfig = {
  apiKey: "AIzaSyDws9pMbb-NoTQ1vju3W-LcvocRElIUYRE",
  authDomain: "carniceria-17356.firebaseapp.com",
  projectId: "carniceria-17356",
  storageBucket: "carniceria-17356.firebasestorage.app",
  messagingSenderId: "292084901944",
  appId: "1:292084901944:web:03d75f506c2b91cd675ecd"
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
