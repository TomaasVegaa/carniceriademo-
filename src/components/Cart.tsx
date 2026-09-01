import React, { useState } from 'react';
import { Trash2, FileText, Banknote, CreditCard, Smartphone } from 'lucide-react';
import { CartItem } from '../types';

interface CartProps {
  items: CartItem[];
  isShiftOpen: boolean;
  onRemoveItem: (id: string) => void;
  onCheckout: (paymentMethod: string, invoice: boolean) => void;
  onClear: () => void;
}

export function Cart({ items, isShiftOpen, onRemoveItem, onCheckout, onClear }: CartProps) {
  const [paymentMethod, setPaymentMethod] = useState('Efectivo');
  const [wantsInvoice, setWantsInvoice] = useState(false);
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="h-full flex flex-col bg-white rounded-3xl border-2 border-[#D7CCC8] shadow-lg overflow-hidden">
      <div className="p-6 border-b border-[#EFEBE9]">
        <h2 className="text-xl font-bold uppercase text-[#5D4037] mb-1">Detalle de Venta</h2>
        <p className="text-sm text-gray-500">Cliente: Consumidor Final</p>
      </div>

      <div className="flex-1 p-6 space-y-4 overflow-y-auto">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <p className="text-lg">No hay productos</p>
            <p className="text-sm">Seleccione un producto a la izquierda</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center bg-[#FDFBF7] p-3 rounded-lg border border-[#EFEBE9]">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-lg">{item.product.name} ({item.quantity} {item.product.unit})</p>
                    <button 
                      onClick={() => onRemoveItem(item.id)}
                      className="text-[#A52A2A] hover:opacity-80 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500">${item.product.price.toLocaleString('es-AR')} x {item.quantity}</p>
                </div>
                <p className="font-bold text-lg">
                  ${(item.quantity * item.product.price).toLocaleString('es-AR')}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-6 bg-[#EFEBE9]">
        <div className="flex justify-between items-center mb-6">
          <span className="text-xl font-medium">TOTAL A COBRAR:</span>
          <span className="text-4xl font-black text-[#A52A2A]">
            ${total.toLocaleString('es-AR')}
          </span>
        </div>

        {/* Metodo de Pago y Factura */}
        <div className="mb-4">
          <p className="text-sm font-bold text-[#5D4037] mb-2 uppercase">Método de Pago</p>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {[
              { id: 'Efectivo', icon: Banknote },
              { id: 'Tarjeta', icon: CreditCard },
              { id: 'Transferencia', icon: Smartphone }
            ].map(method => {
              const Icon = method.icon;
              return (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`flex items-center justify-center gap-2 py-2 rounded-xl border-2 font-bold transition-colors ${
                    paymentMethod === method.id 
                      ? 'bg-[#8B4513] text-white border-[#8B4513]' 
                      : 'bg-white text-[#3C2A21] border-[#D7CCC8] hover:bg-[#EFEBE9]'
                  }`}
                >
                  <Icon size={16} /> <span className="text-sm">{method.id}</span>
                </button>
              )
            })}
          </div>
          <label className="flex items-center gap-3 p-3 bg-[#FDFBF7] border border-[#D7CCC8] rounded-xl cursor-pointer hover:bg-[#EFEBE9] transition-colors">
            <input 
              type="checkbox" 
              checked={wantsInvoice} 
              onChange={(e) => setWantsInvoice(e.target.checked)}
              className="w-5 h-5 accent-[#8B4513] rounded cursor-pointer shrink-0"
            />
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-[#8B4513]" />
              <span className="font-bold text-[#3C2A21] text-sm">Generar Factura (Cons. Final)</span>
            </div>
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onClear}
            className="py-5 bg-white border-2 border-[#A52A2A] text-[#A52A2A] rounded-2xl font-bold text-xl shadow-sm uppercase hover:bg-gray-50"
          >
            Limpiar
          </button>
          <button
            onClick={() => onCheckout(paymentMethod, wantsInvoice)}
            disabled={items.length === 0 || !isShiftOpen}
            className={`py-5 text-white rounded-2xl font-bold text-xl shadow-sm uppercase border-b-4 transition-all ${
              !isShiftOpen 
                ? 'bg-gray-400 border-gray-500 cursor-not-allowed'
                : 'bg-[#4F7942] disabled:bg-[#A3B89E] disabled:border-[#8FA38B] disabled:text-white/70 border-[#2D4226] hover:brightness-110'
            }`}
          >
            {!isShiftOpen ? 'CAJA CERRADA' : 'Cobrar'}
          </button>
        </div>
      </div>
    </div>
  );
}
