import React, { useState, useEffect } from 'react';
import { 
  Beef, 
  ShoppingCart, 
  Store, 
  Tag, 
  LogOut, 
  ReceiptText, 
  CheckCircle2, 
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { ProductGrid } from './components/ProductGrid';
import { Cart } from './components/Cart';
import { KeypadModal } from './components/KeypadModal';
import { CashRegisterView, PricesView } from './components/FooterModals';
import { LoginScreen } from './components/LoginScreen';
import { InvoiceModal } from './components/InvoiceModal';
import { Product, CartItem, Category, Sale, ShiftState, AuthUser, InvoiceType, DocType } from './types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from './data';
import { generateArcaInvoice } from './services/arcaService';
import { 
  subscribeToProducts, 
  subscribeToCategories, 
  subscribeToShift, 
  subscribeToSales,
  saveSaleToDB,
  initializeDemoData
} from './services/dbService';

export default function App() {
  // Estado de Autenticación
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('pos_auth_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Estado de Catálogo y Categorías (Sincronizado con Firebase)
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Estado del Carrito y Modal de Peso
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Estado de Navegación Móvil
  const [activeTab, setActiveTab] = useState<'pos' | 'cart' | 'shift' | 'prices'>('pos');

  // Estado de Caja y Ventas (Sincronizado con Firebase)
  const [shift, setShift] = useState<ShiftState>({ isOpen: false, shift: null, initialBalance: 0, openedAt: null });
  const [sales, setSales] = useState<Sale[]>([]);

  // Configurar Listeners de Firebase
  useEffect(() => {
    // Inicializar datos si la DB está vacía
    initializeDemoData(INITIAL_PRODUCTS, INITIAL_CATEGORIES);

    // Suscripciones en tiempo real
    const unsubProducts = subscribeToProducts(setProducts);
    const unsubCategories = subscribeToCategories(setCategories);
    const unsubShift = subscribeToShift(setShift);
    const unsubSales = subscribeToSales(setSales);

    // Limpieza al desmontar
    return () => {
      unsubProducts();
      unsubCategories();
      unsubShift();
      unsubSales();
    };
  }, []);

  // Modal de Comprobante Fiscal ARCA
  const [activeInvoiceSale, setActiveInvoiceSale] = useState<Sale | null>(null);

  // Manejador de Login y Logout
  const handleLogin = (user: AuthUser) => {
    setCurrentUser(user);
    localStorage.setItem('pos_auth_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('pos_auth_user');
  };

  // Manejo de Carrito
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleConfirmWeight = (quantity: number) => {
    if (selectedProduct) {
      const newItem: CartItem = {
        id: Math.random().toString(36).substring(2, 9),
        product: selectedProduct,
        quantity
      };
      setCart((prev) => [...prev, newItem]);
      setSelectedProduct(null);
    }
  };

  const handleRemoveItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Cobro y Facturación ARCA
  const handleCheckout = (
    paymentMethod: string, 
    invoice: boolean,
    invoiceType: InvoiceType = 'FACTURA_B',
    docTipo: DocType = '99',
    docNro: string = '0'
  ) => {
    if (!shift.isOpen) {
      setActiveTab('shift');
      return;
    }

    const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    let fiscalData = undefined;
    if (invoice) {
      fiscalData = generateArcaInvoice(cart, total, invoiceType, docTipo, docNro);
    }

    const newSale: Sale = {
      id: Math.random().toString(36).substring(2, 9),
      items: [...cart],
      total,
      paymentMethod,
      invoice,
      fiscalData,
      timestamp: new Date(),
      shift: shift.shift!,
      cashierName: currentUser?.name
    };

    // Guardar en Firebase (la vista se actualiza sola gracias al onSnapshot)
    saveSaleToDB(newSale);
    setCart([]);

    // Si generó factura ARCA, abrir inmediatamente el visor del comprobante con QR y WhatsApp
    if (invoice && fiscalData) {
      setActiveInvoiceSale(newSale);
    }
  };

  // Si no está autenticado, mostrar pantalla de acceso
  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="h-dvh w-full bg-[#FDFBF7] font-sans text-[#3C2A21] flex flex-col overflow-hidden">
      {/* Top Header Mobile */}
      <header className="h-14 bg-[#8B4513] text-white flex items-center justify-between px-4 shadow-md z-30 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-xs">
            <Beef size={20} className="text-[#8B4513]" />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-tight leading-none">POS CARNICERÍA</h1>
            <span className="text-[10px] text-amber-200 font-semibold">{currentUser.name}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Badge de Estado de Caja */}
          <button
            onClick={() => setActiveTab('shift')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all border ${
              shift.isOpen
                ? 'bg-[#4F7942] border-emerald-400 text-white shadow-2xs'
                : 'bg-[#A52A2A] border-red-400 text-white animate-pulse'
            }`}
          >
            {shift.isOpen ? `Caja: ${shift.shift}` : 'Caja Cerrada'}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            title="Cerrar sesión"
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors text-amber-100"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Main Screen Content */}
      <main className="flex-1 overflow-hidden p-2 sm:p-4 max-w-5xl mx-auto w-full relative">
        {activeTab === 'pos' && (
          <ProductGrid
            products={products}
            categories={categories}
            onProductClick={handleProductClick}
          />
        )}

        {activeTab === 'cart' && (
          <Cart
            items={cart}
            isShiftOpen={shift.isOpen}
            onRemoveItem={handleRemoveItem}
            onCheckout={handleCheckout}
            onClear={handleClearCart}
          />
        )}

        {activeTab === 'shift' && (
          <CashRegisterView
            shift={shift}
            sales={sales}
            onSelectSaleForInvoice={(sale) => setActiveInvoiceSale(sale)}
          />
        )}

        {activeTab === 'prices' && (
          <PricesView
            categories={categories}
            products={products}
          />
        )}

        {/* Floating Quick Checkout Bar (Visible en Venta si hay ítems en carrito) */}
        {activeTab === 'pos' && cart.length > 0 && (
          <div className="absolute bottom-16 inset-x-2 sm:inset-x-4 z-20">
            <button
              onClick={() => setActiveTab('cart')}
              className="w-full bg-[#4F7942] hover:brightness-110 text-white px-4 py-3 rounded-2xl shadow-xl border-2 border-[#2D4226] flex items-center justify-between active:scale-98 transition-all"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-black text-sm">
                  {cart.length}
                </div>
                <div className="text-left leading-tight">
                  <span className="text-xs uppercase tracking-wider block text-emerald-100 font-bold">Ver Pedido</span>
                  <span className="text-lg font-black">${cartTotal.toLocaleString('es-AR')}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 font-bold text-sm bg-white/20 px-3 py-1.5 rounded-xl">
                <span>Cobrar</span>
                <ChevronRight size={18} />
              </div>
            </button>
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="h-16 bg-white border-t-2 border-[#D7CCC8] grid grid-cols-4 px-2 z-30 shrink-0 shadow-lg select-none">
        <button
          onClick={() => setActiveTab('pos')}
          className={`flex flex-col items-center justify-center gap-1 transition-colors ${
            activeTab === 'pos' ? 'text-[#8B4513] font-black' : 'text-gray-400 font-medium'
          }`}
        >
          <Beef size={22} className={activeTab === 'pos' ? 'scale-110 transition-transform' : ''} />
          <span className="text-[10px] tracking-tight">Venta</span>
        </button>

        <button
          onClick={() => setActiveTab('cart')}
          className={`flex flex-col items-center justify-center gap-1 relative transition-colors ${
            activeTab === 'cart' ? 'text-[#8B4513] font-black' : 'text-gray-400 font-medium'
          }`}
        >
          <div className="relative">
            <ShoppingCart size={22} className={activeTab === 'cart' ? 'scale-110 transition-transform' : ''} />
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-[#A52A2A] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {cart.length}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight">Carrito</span>
        </button>

        <button
          onClick={() => setActiveTab('shift')}
          className={`flex flex-col items-center justify-center gap-1 transition-colors ${
            activeTab === 'shift' ? 'text-[#8B4513] font-black' : 'text-gray-400 font-medium'
          }`}
        >
          <div className="relative">
            <Store size={22} className={activeTab === 'shift' ? 'scale-110 transition-transform' : ''} />
            {shift.isOpen && (
              <span className="absolute -top-0.5 -right-1 w-2.5 h-2.5 bg-[#4F7942] rounded-full border border-white"></span>
            )}
          </div>
          <span className="text-[10px] tracking-tight">Caja</span>
        </button>

        <button
          onClick={() => setActiveTab('prices')}
          className={`flex flex-col items-center justify-center gap-1 transition-colors ${
            activeTab === 'prices' ? 'text-[#8B4513] font-black' : 'text-gray-400 font-medium'
          }`}
        >
          <Tag size={22} className={activeTab === 'prices' ? 'scale-110 transition-transform' : ''} />
          <span className="text-[10px] tracking-tight">Precios</span>
        </button>
      </nav>

      {/* Keypad Modal para ingreso de kilos o unidades */}
      {selectedProduct && (
        <KeypadModal
          title={`${selectedProduct.name}`}
          unit={selectedProduct.unit}
          onConfirm={handleConfirmWeight}
          onCancel={() => setSelectedProduct(null)}
        />
      )}

      {/* Invoice Modal para Comprobante Fiscal ARCA con QR y WhatsApp */}
      {activeInvoiceSale && (
        <InvoiceModal
          sale={activeInvoiceSale}
          onClose={() => setActiveInvoiceSale(null)}
        />
      )}
    </div>
  );
}
