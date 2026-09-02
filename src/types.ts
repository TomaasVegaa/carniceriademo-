export type Category = string;

export interface Product {
  id: string;
  name: string;
  price: number;
  category: Category;
  unit: 'kg' | 'unidad';
  color?: string;
}

export interface CartItem {
  id: string; // unique cart item id
  product: Product;
  quantity: number;
}

export type InvoiceType = 'FACTURA_B' | 'FACTURA_C' | 'TICKET_NO_FISCAL';
export type DocType = '99' | '96' | '80'; // 99: Consumidor Final, 96: DNI, 80: CUIT

export interface FiscalData {
  invoiceType: InvoiceType;
  ptoVta: number;
  cbteNro: number;
  docTipo: DocType;
  docNro: string;
  cae: string;
  caeVto: string; // YYYY-MM-DD
  qrDataUrl: string;
  razonSocialEmisor: string;
  cuitEmisor: string;
  inicioActividades: string;
  iibb: string;
  condicionIva: string;
  domicilioComercial: string;
}

export interface Sale {
  id: string;
  items: CartItem[];
  total: number;
  paymentMethod: 'Efectivo' | 'Tarjeta' | 'Transferencia' | string;
  invoice: boolean;
  fiscalData?: FiscalData;
  timestamp: Date;
  shift: 'Mañana' | 'Tarde';
  cashierName?: string;
}

export interface ShiftState {
  isOpen: boolean;
  shift: 'Mañana' | 'Tarde' | null;
  initialBalance: number;
  openedAt?: Date | null;
}

export interface AuthUser {
  id: string;
  name: string;
  role: 'cajero' | 'administrador';
  pin: string;
}
