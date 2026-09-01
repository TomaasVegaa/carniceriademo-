/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Beef, CheckCircle2, Receipt } from 'lucide-react';
import { ProductGrid } from './components/ProductGrid';
import { Cart } from './components/Cart';
import { KeypadModal } from './components/KeypadModal';
import { HelpModal, PricesModal, ScaleModal, CashRegisterModal } from './components/FooterModals';
import { Product, CartItem, Category, Sale, ShiftState } from './types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from './data';

export default function App() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [checkoutInfo, setCheckoutInfo] = useState<{payment: string, invoice: boolean} | null>(null);
  const [activeModal, setActiveModal] = useState<'help' | 'prices' | 'scale' | 'register' | null>(null);

  const [sales, setSales] = useState<Sale[]>([]);
  const [shift, setShift] = useState<ShiftState>({ isOpen: false, shift: null, initialBalance: 0 });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F1') {
        e.preventDefault();
        setActiveModal('help');
      }
      if (e.key === 'F2') {
        e.preventDefault();
        setActiveModal('prices');
      }
      if (e.key === 'F3') {
        e.preventDefault();
        setActiveModal('scale');
      }
      if (e.key === 'F4') {
        e.preventDefault();
        setActiveModal('register');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleConfirmWeight = (quantity: number) => {
    if (selectedProduct) {
      const newItem: CartItem = {
        id: Math.random().toString(36).substring(2, 9),
        product: selectedProduct,
        quantity,
      };
      setCart((prev) => [...prev, newItem]);
      setSelectedProduct(null);
    }
  };

  const handleRemoveItem = (id: string) => {
    setCart((prev) => prev.filter(item => item.id !== id));
  };

  const handleClear = () => {
    setCart([]);
  };

  const handleCheckout = (payment: string, invoice: boolean) => {
    if (!shift.isOpen) {
      setActiveModal('register');
      return;
    }

    const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

    const newSale: Sale = {
      id: Math.random().toString(36).substring(2, 9),
      items: cart,
      total,
      paymentMethod: payment,
      invoice,
      timestamp: new Date(),
      shift: shift.shift!
    };
    
    setSales(prev => [newSale, ...prev]);
    setCheckoutInfo({ payment, invoice });
    setShowSuccess(true);
    setCart([]);
    setTimeout(() => {
      setShowSuccess(false);
      setCheckoutInfo(null);
    }, 3500);
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-[#FDFBF7] font-sans text-[#3C2A21]">
      {/* Header */}
      <header className="h-16 bg-[#8B4513] text-white flex items-center justify-between px-8 shadow-md z-20">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <span className="text-[#8B4513] font-bold text-xl">C</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Sistema Carnicería - Terminal de Venta</h1>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-sm opacity-90">Vendedor: Principal</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex gap-4 p-4 overflow-hidden">
        {/* Left Side: Products */}
        <section className="flex-[1.5] min-w-0 flex flex-col">
          <ProductGrid products={products} categories={categories} onProductClick={handleProductClick} />
        </section>

        {/* Right Side: Cart */}
        <aside className="w-[350px] lg:w-[450px] shrink-0 flex flex-col z-10">
          <Cart 
            items={cart} 
            isShiftOpen={shift.isOpen}
            onRemoveItem={handleRemoveItem} 
            onCheckout={handleCheckout}
            onClear={handleClear}
          />
        </aside>
      </main>

      {/* Footer */}
      <footer className="h-12 bg-[#D7CCC8] flex items-center justify-between px-8 text-sm font-medium z-10 shrink-0">
        <div className="flex gap-6">
          <span>📦 Stock: OK</span>
          <span className="font-bold text-[#8B4513]">
            💰 Caja: {shift.isOpen ? (
              <span className="text-[#4F7942] uppercase ml-1">Abierta ({shift.shift})</span>
            ) : (
              <span className="text-[#A52A2A] uppercase ml-1">Cerrada</span>
            )}
          </span>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setActiveModal('help')} className="bg-white px-3 py-1 rounded shadow-sm hover:bg-[#EFEBE9] transition-colors cursor-pointer border border-[#D7CCC8]">F1: Ayuda</button>
          <button onClick={() => setActiveModal('prices')} className="bg-white px-3 py-1 rounded shadow-sm hover:bg-[#EFEBE9] transition-colors cursor-pointer border border-[#D7CCC8]">F2: Precios</button>
          <button onClick={() => setActiveModal('scale')} className="bg-white px-3 py-1 rounded shadow-sm hover:bg-[#EFEBE9] transition-colors cursor-pointer border border-[#D7CCC8]">F3: Balanza</button>
          <button onClick={() => setActiveModal('register')} className="bg-[#4F7942] text-white px-3 py-1 rounded shadow-sm hover:brightness-110 transition-colors cursor-pointer border-b-2 border-[#2D4226]">F4: Caja / Ventas</button>
        </div>
      </footer>

      {/* Modals */}
      {activeModal === 'help' && <HelpModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'prices' && (
        <PricesModal 
          onClose={() => setActiveModal(null)}
          categories={categories}
          products={products}
          setCategories={setCategories}
          setProducts={setProducts}
        />
      )}
      {activeModal === 'scale' && <ScaleModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'register' && (
        <CashRegisterModal 
          onClose={() => setActiveModal(null)} 
          shift={shift} 
          setShift={setShift} 
          sales={sales} 
        />
      )}

      {selectedProduct && (
        <KeypadModal
          title={`Ingrese Peso: ${selectedProduct.name}`}
          unit={selectedProduct.unit}
          onConfirm={handleConfirmWeight}
          onCancel={() => setSelectedProduct(null)}
        />
      )}

      {showSuccess && (
        <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
          <div className="bg-[#FDFBF7] rounded-3xl p-10 flex flex-col items-center shadow-2xl border-4 border-[#4F7942] animate-in zoom-in duration-200 max-w-md text-center">
            <CheckCircle2 size={80} className="text-[#4F7942] mb-4" />
            <h2 className="text-4xl font-bold text-[#3C2A21] mb-2">Venta Registrada</h2>
            <p className="text-xl text-[#5D4037] mb-6 font-medium">Cobro exitoso mediante {checkoutInfo?.payment}</p>
            
            {checkoutInfo?.invoice && (
              <div className="flex items-center justify-center gap-2 bg-[#EFEBE9] text-[#8B4513] px-6 py-3 rounded-xl font-bold border-2 border-[#D7CCC8] mb-6 w-full shadow-sm">
                <Receipt size={24} />
                Factura Generada
              </div>
            )}
            
            <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Preparando nueva venta...</p>
          </div>
        </div>
      )}
    </div>
  );
}
