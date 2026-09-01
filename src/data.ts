import { Product, Category } from './types';

export const INITIAL_CATEGORIES: Category[] = ['Vaca', 'Cerdo', 'Achuras', 'Pollo', 'Elaborados'];

export const INITIAL_PRODUCTS: Product[] = [
  // Vaca
  { id: 'v1', name: 'Asado', price: 6500, category: 'Vaca', unit: 'kg', color: 'bg-red-100 text-red-900 border-red-300' },
  { id: 'v2', name: 'Vacío', price: 7200, category: 'Vaca', unit: 'kg', color: 'bg-red-100 text-red-900 border-red-300' },
  { id: 'v3', name: 'Matambre', price: 7500, category: 'Vaca', unit: 'kg', color: 'bg-red-100 text-red-900 border-red-300' },
  { id: 'v4', name: 'Carne Picada', price: 4500, category: 'Vaca', unit: 'kg', color: 'bg-red-100 text-red-900 border-red-300' },
  { id: 'v5', name: 'Roast Beef', price: 5800, category: 'Vaca', unit: 'kg', color: 'bg-red-100 text-red-900 border-red-300' },
  { id: 'v6', name: 'Bife de Chorizo', price: 8500, category: 'Vaca', unit: 'kg', color: 'bg-red-100 text-red-900 border-red-300' },
  { id: 'v7', name: 'Cuadril', price: 7800, category: 'Vaca', unit: 'kg', color: 'bg-red-100 text-red-900 border-red-300' },
  { id: 'v8', name: 'Paleta', price: 5500, category: 'Vaca', unit: 'kg', color: 'bg-red-100 text-red-900 border-red-300' },

  // Cerdo
  { id: 'c1', name: 'Pechito de Cerdo', price: 4800, category: 'Cerdo', unit: 'kg', color: 'bg-pink-100 text-pink-900 border-pink-300' },
  { id: 'c2', name: 'Bondiola', price: 6200, category: 'Cerdo', unit: 'kg', color: 'bg-pink-100 text-pink-900 border-pink-300' },
  { id: 'c3', name: 'Matambre de Cerdo', price: 6800, category: 'Cerdo', unit: 'kg', color: 'bg-pink-100 text-pink-900 border-pink-300' },
  { id: 'c4', name: 'Costillitas', price: 5000, category: 'Cerdo', unit: 'kg', color: 'bg-pink-100 text-pink-900 border-pink-300' },

  // Achuras
  { id: 'a1', name: 'Chorizo', price: 4000, category: 'Achuras', unit: 'kg', color: 'bg-orange-100 text-orange-900 border-orange-300' },
  { id: 'a2', name: 'Morcilla', price: 3500, category: 'Achuras', unit: 'kg', color: 'bg-orange-100 text-orange-900 border-orange-300' },
  { id: 'a3', name: 'Chinchulín', price: 3000, category: 'Achuras', unit: 'kg', color: 'bg-orange-100 text-orange-900 border-orange-300' },
  { id: 'a4', name: 'Molleja', price: 9500, category: 'Achuras', unit: 'kg', color: 'bg-orange-100 text-orange-900 border-orange-300' },
  { id: 'a5', name: 'Riñón', price: 2500, category: 'Achuras', unit: 'kg', color: 'bg-orange-100 text-orange-900 border-orange-300' },

  // Pollo
  { id: 'p1', name: 'Pollo Entero', price: 2500, category: 'Pollo', unit: 'kg', color: 'bg-yellow-100 text-yellow-900 border-yellow-300' },
  { id: 'p2', name: 'Pechuga', price: 4800, category: 'Pollo', unit: 'kg', color: 'bg-yellow-100 text-yellow-900 border-yellow-300' },
  { id: 'p3', name: 'Pata Muslo', price: 3000, category: 'Pollo', unit: 'kg', color: 'bg-yellow-100 text-yellow-900 border-yellow-300' },
  { id: 'p4', name: 'Alitas', price: 1800, category: 'Pollo', unit: 'kg', color: 'bg-yellow-100 text-yellow-900 border-yellow-300' },

  // Elaborados
  { id: 'e1', name: 'Milanesa de Carne', price: 5500, category: 'Elaborados', unit: 'kg', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
  { id: 'e2', name: 'Milanesa de Pollo', price: 4500, category: 'Elaborados', unit: 'kg', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
  { id: 'e3', name: 'Hamburguesas', price: 5000, category: 'Elaborados', unit: 'kg', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
  { id: 'e4', name: 'Carbón', price: 1500, category: 'Elaborados', unit: 'unidad', color: 'bg-stone-200 text-stone-900 border-stone-400' },
];
