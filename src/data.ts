import { Product, Category } from './types';

export const INITIAL_CATEGORIES: Category[] = ['Blandos especiales', 'Asado especial', 'Pollos', 'Cerdo'];

export const INITIAL_PRODUCTS: Product[] = [
  // Blandos especiales
  { id: 'b1', name: 'Nalga', price: 22000, category: 'Blandos especiales', unit: 'kg', color: 'bg-red-100 text-red-900 border-red-300' },
  { id: 'b2', name: 'Verija', price: 22000, category: 'Blandos especiales', unit: 'kg', color: 'bg-red-100 text-red-900 border-red-300' },
  { id: 'b3', name: 'Picana', price: 22000, category: 'Blandos especiales', unit: 'kg', color: 'bg-red-100 text-red-900 border-red-300' },
  { id: 'b4', name: 'Filet', price: 22000, category: 'Blandos especiales', unit: 'kg', color: 'bg-red-100 text-red-900 border-red-300' },
  { id: 'b5', name: 'Jamón', price: 22000, category: 'Blandos especiales', unit: 'kg', color: 'bg-red-100 text-red-900 border-red-300' },
  { id: 'b6', name: 'Lomo', price: 24000, category: 'Blandos especiales', unit: 'kg', color: 'bg-red-100 text-red-900 border-red-300' },
  { id: 'b7', name: 'Costeletas', price: 16000, category: 'Blandos especiales', unit: 'kg', color: 'bg-red-100 text-red-900 border-red-300' },
  { id: 'b8', name: 'Punta de Lomo', price: 18000, category: 'Blandos especiales', unit: 'kg', color: 'bg-red-100 text-red-900 border-red-300' },
  { id: 'b9', name: 'Tortuguita', price: 18000, category: 'Blandos especiales', unit: 'kg', color: 'bg-red-100 text-red-900 border-red-300' },
  { id: 'b10', name: 'Chiquizuela', price: 21000, category: 'Blandos especiales', unit: 'kg', color: 'bg-red-100 text-red-900 border-red-300' },
  { id: 'b11', name: 'Trasjamon', price: 21000, category: 'Blandos especiales', unit: 'kg', color: 'bg-red-100 text-red-900 border-red-300' },
  { id: 'b12', name: 'Paleta rollisa', price: 20000, category: 'Blandos especiales', unit: 'kg', color: 'bg-red-100 text-red-900 border-red-300' },
  { id: 'b13', name: 'Paleta chata', price: 18000, category: 'Blandos especiales', unit: 'kg', color: 'bg-red-100 text-red-900 border-red-300' },
  { id: 'b14', name: 'Jamón de paleta', price: 18000, category: 'Blandos especiales', unit: 'kg', color: 'bg-red-100 text-red-900 border-red-300' },
  { id: 'b15', name: 'Primo', price: 15500, category: 'Blandos especiales', unit: 'kg', color: 'bg-red-100 text-red-900 border-red-300' },
  { id: 'b16', name: 'Duro', price: 15500, category: 'Blandos especiales', unit: 'kg', color: 'bg-red-100 text-red-900 border-red-300' },
  { id: 'b17', name: 'Puchero especial', price: 13500, category: 'Blandos especiales', unit: 'kg', color: 'bg-red-100 text-red-900 border-red-300' },
  { id: 'b18', name: 'Matambre', price: 18000, category: 'Blandos especiales', unit: 'kg', color: 'bg-red-100 text-red-900 border-red-300' },

  // Asado especial
  { id: 'a1', name: 'Vacío', price: 21000, category: 'Asado especial', unit: 'kg', color: 'bg-orange-100 text-orange-900 border-orange-300' },
  { id: 'a2', name: 'Costilla especial', price: 21000, category: 'Asado especial', unit: 'kg', color: 'bg-orange-100 text-orange-900 border-orange-300' },
  { id: 'a3', name: 'Entraña', price: 21000, category: 'Asado especial', unit: 'kg', color: 'bg-orange-100 text-orange-900 border-orange-300' },
  { id: 'a4', name: 'Kepperi', price: 21000, category: 'Asado especial', unit: 'kg', color: 'bg-orange-100 text-orange-900 border-orange-300' },
  { id: 'a5', name: 'Tapa de nalga', price: 21000, category: 'Asado especial', unit: 'kg', color: 'bg-orange-100 text-orange-900 border-orange-300' },
  { id: 'a6', name: 'Faldita', price: 21000, category: 'Asado especial', unit: 'kg', color: 'bg-orange-100 text-orange-900 border-orange-300' },
  { id: 'a7', name: 'Tapa de asado', price: 21000, category: 'Asado especial', unit: 'kg', color: 'bg-orange-100 text-orange-900 border-orange-300' },
  { id: 'a8', name: 'Chorizos parrilleros', price: 13000, category: 'Asado especial', unit: 'kg', color: 'bg-orange-100 text-orange-900 border-orange-300' },
  { id: 'a9', name: 'Chorizo criollos', price: 13000, category: 'Asado especial', unit: 'kg', color: 'bg-orange-100 text-orange-900 border-orange-300' },
  { id: 'a10', name: 'Morcilla', price: 7500, category: 'Asado especial', unit: 'kg', color: 'bg-orange-100 text-orange-900 border-orange-300' },

  // Pollos
  { id: 'p1', name: 'Filet', price: 10000, category: 'Pollos', unit: 'kg', color: 'bg-yellow-100 text-yellow-900 border-yellow-300' },
  { id: 'p2', name: 'Pechuga', price: 6000, category: 'Pollos', unit: 'kg', color: 'bg-yellow-100 text-yellow-900 border-yellow-300' },
  { id: 'p3', name: 'Pata muslo', price: 5000, category: 'Pollos', unit: 'kg', color: 'bg-yellow-100 text-yellow-900 border-yellow-300' },
  { id: 'p4', name: 'Alita de pollo', price: 2500, category: 'Pollos', unit: 'kg', color: 'bg-yellow-100 text-yellow-900 border-yellow-300' },

  // Cerdo
  { id: 'c1', name: 'Costilla', price: 9500, category: 'Cerdo', unit: 'kg', color: 'bg-pink-100 text-pink-900 border-pink-300' },
  { id: 'c2', name: 'Vacío', price: 9500, category: 'Cerdo', unit: 'kg', color: 'bg-pink-100 text-pink-900 border-pink-300' },
  { id: 'c3', name: 'Costeleta', price: 9500, category: 'Cerdo', unit: 'kg', color: 'bg-pink-100 text-pink-900 border-pink-300' },
  { id: 'c4', name: 'Bondiola', price: 10000, category: 'Cerdo', unit: 'kg', color: 'bg-pink-100 text-pink-900 border-pink-300' },
  { id: 'c5', name: 'Matambre de cerdo', price: 17000, category: 'Cerdo', unit: 'kg', color: 'bg-pink-100 text-pink-900 border-pink-300' },
];
