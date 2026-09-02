import { 
  collection, 
  doc, 
  setDoc, 
  onSnapshot, 
  getDocs, 
  query, 
  orderBy, 
  deleteDoc, 
  updateDoc,
  getDoc
} from 'firebase/firestore';
import { db } from './firebase';
import { Product, Sale, ShiftState } from '../types';

// ==========================================
// OBSERVADORES EN TIEMPO REAL (ON SNAPSHOT)
// ==========================================

export const subscribeToProducts = (callback: (products: Product[]) => void) => {
  const q = query(collection(db, 'products'));
  return onSnapshot(q, (snapshot) => {
    const products: Product[] = [];
    snapshot.forEach((doc) => {
      products.push(doc.data() as Product);
    });
    callback(products);
  });
};

export const subscribeToCategories = (callback: (categories: string[]) => void) => {
  const docRef = doc(db, 'settings', 'categories');
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data().list || []);
    } else {
      callback([]);
    }
  });
};

export const subscribeToShift = (callback: (shift: ShiftState) => void) => {
  const docRef = doc(db, 'settings', 'shift');
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      callback({
        isOpen: data.isOpen,
        shift: data.shift,
        initialBalance: data.initialBalance,
        openedAt: data.openedAt ? new Date(data.openedAt.seconds * 1000) : null
      });
    } else {
      callback({ isOpen: false, shift: null, initialBalance: 0, openedAt: null });
    }
  });
};

export const subscribeToSales = (callback: (sales: Sale[]) => void) => {
  const q = query(collection(db, 'sales'), orderBy('timestamp', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const sales: Sale[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      sales.push({
        ...data,
        timestamp: new Date(data.timestamp.seconds * 1000)
      } as Sale);
    });
    callback(sales);
  });
};

// ==========================================
// ESCRITURA EN LA BASE DE DATOS
// ==========================================

export const saveProductToDB = async (product: Product) => {
  const docRef = doc(db, 'products', product.id);
  await setDoc(docRef, product);
};

export const deleteProductFromDB = async (productId: string) => {
  const docRef = doc(db, 'products', productId);
  await deleteDoc(docRef);
};

export const saveCategoriesToDB = async (categories: string[]) => {
  const docRef = doc(db, 'settings', 'categories');
  await setDoc(docRef, { list: categories });
};

export const saveShiftToDB = async (shift: ShiftState) => {
  const docRef = doc(db, 'settings', 'shift');
  await setDoc(docRef, {
    isOpen: shift.isOpen,
    shift: shift.shift,
    initialBalance: shift.initialBalance,
    openedAt: shift.openedAt || null
  });
};

export const saveSaleToDB = async (sale: Sale) => {
  const docRef = doc(db, 'sales', sale.id);
  await setDoc(docRef, {
    ...sale,
    timestamp: sale.timestamp // Firestore automatically converts JS Date objects
  });
};

// ==========================================
// MIGRACIÓN INICIAL (PARA LA DEMO)
// ==========================================
export const initializeDemoData = async (
  initialProducts: Product[], 
  initialCategories: string[]
) => {
  try {
    // Check si ya hay categorías para no sobreescribir
    const catDoc = await getDoc(doc(db, 'settings', 'categories'));
    if (!catDoc.exists()) {
      await saveCategoriesToDB(initialCategories);
      
      // Inicializar productos
      for (const prod of initialProducts) {
        await saveProductToDB(prod);
      }
      console.log('Datos iniciales de demostración subidos a Firebase.');
    }
  } catch (error) {
    console.error('Error inicializando datos demo:', error);
  }
};
