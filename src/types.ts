export type Category = string;

export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
  unit: 'kg' | 'unidad';
  color: string;
}

export interface CartItem {
  id: string; // unique cart item id
  product: Product;
  quantity: number;
}

export interface Sale {
  id: string;
  items: CartItem[];
  total: number;
  paymentMethod: string;
  invoice: boolean;
  timestamp: Date;
  shift: 'Mañana' | 'Tarde';
}

export interface ShiftState {
  isOpen: boolean;
  shift: 'Mañana' | 'Tarde' | null;
  initialBalance: number;
}
