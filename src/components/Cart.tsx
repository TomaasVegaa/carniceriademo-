import React, { useState } from 'react';
import { Trash2, Banknote, CreditCard, Smartphone, ShieldCheck, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { CartItem, InvoiceType, DocType } from '../types';

interface CartProps {
  items: CartItem[];
  isShiftOpen: boolean;
  onRemoveItem: (id: string) => void;
  onCheckout: (
    paymentMethod: string, 
    invoice: boolean, 
    invoiceType?: InvoiceType, 
    docTipo?: DocType, 
    docNro?: string
  ) => void;
  onClear: () => void;
}

export function Cart({ items, isShiftOpen, onRemoveItem, onCheckout, onClear }: CartProps) {
  const [paymentMethod, setPaymentMethod] = useState('Efectivo');
  const [wantsInvoice, setWantsInvoice] = useState(true); // Facturación rápida por defecto
  
  // Opciones avanzadas ocultas por defecto para máxima velocidad
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [docTipo, setDocTipo] = useState<DocType>('99');
  const [docNro, setDocNro] = useState('');

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleCobrar = () => {
    onCheckout(
      paymentMethod, 
      wantsInvoice, 
      'FACTURA_C', // Monotributista SIEMPRE Factura C
      docTipo, 
      docTipo === '99' ? '0' : docNro
    );
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-3xl border-2 border-[#D7CCC8] shadow-md overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-[#FDFBF7] border-b border-[#EFEBE9] flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-base sm:text-lg font-black uppercase text-[#5D4037] leading-none">
            Detalle del Pedido
          </h2>
          <span className="text-xs text-gray-500 font-medium">
            {items.length} {items.length === 1 ? 'ítem agregado' : 'ítems agregados'}
          </span>
        </div>
        {items.length > 0 && (
          <button
            onClick={onClear}
            className="text-xs font-bold text-[#A52A2A] hover:bg-red-50 px-2.5 py-1 rounded-lg border border-red-200 transition-colors"
          >
            Vaciar
          </button>
        )}
      </div>

      {/* Item List */}
      <div className="flex-1 min-h-0 p-3 sm:p-4 space-y-2 overflow-y-auto">
        {items.length === 0 ? (
          <div className="h-48 sm:h-full flex flex-col items-center justify-center text-center text-gray-400 p-6">
            <p className="text-base font-bold text-[#5D4037]">El pedido está vacío</p>
            <p className="text-xs text-gray-400 mt-1">Seleccione cortes en la pestaña de Venta</p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center bg-[#FDFBF7] p-3 rounded-2xl border border-[#EFEBE9] shadow-2xs"
              >
                <div className="flex-1 pr-2">
                  <p className="font-extrabold text-sm sm:text-base text-[#3C2A21] leading-tight">
                    {item.product.name}
                  </p>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">
                    {item.quantity} {item.product.unit} × ${item.product.price.toLocaleString('es-AR')}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-black text-sm sm:text-base text-[#A52A2A]">
                    ${(item.quantity * item.product.price).toLocaleString('es-AR')}
                  </span>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="text-[#A52A2A] hover:bg-red-100 p-1.5 rounded-xl transition-colors active:scale-90"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer & Checkout Panel */}
      <div className="p-4 bg-[#EFEBE9] border-t border-[#D7CCC8] shrink-0 space-y-3.5">
        {/* Total Display */}
        <div className="flex justify-between items-center bg-white px-4 py-3 rounded-2xl border border-[#D7CCC8] shadow-xs">
          <span className="text-sm font-black text-[#5D4037] uppercase">Total a Cobrar:</span>
          <span className="text-2xl sm:text-3xl font-black text-[#A52A2A]">
            ${total.toLocaleString('es-AR')}
          </span>
        </div>

        {/* Métodos de Pago */}
        <div>
          <span className="block text-[11px] font-bold text-[#5D4037] mb-1.5 uppercase tracking-wider">
            Forma de Pago
          </span>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'Efectivo', icon: Banknote },
              { id: 'Tarjeta', icon: CreditCard },
              { id: 'Transferencia', icon: Smartphone }
            ].map((method) => {
              const Icon = method.icon;
              return (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-2 px-1 rounded-xl border-2 font-bold text-xs transition-all active:scale-95 ${
                    paymentMethod === method.id
                      ? 'bg-[#8B4513] text-white border-[#8B4513] shadow-xs'
                      : 'bg-white text-[#3C2A21] border-[#D7CCC8] hover:bg-[#FDFBF7]'
                  }`}
                >
                  <Icon size={16} />
                  <span>{method.id}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Facturación Ultra Rápida ARCA (Factura C) */}
        <div className="bg-white p-3 rounded-2xl border border-[#D7CCC8] space-y-2.5 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <ShieldCheck size={18} className="text-[#4F7942]" />
              <div>
                <span className="text-xs font-black text-[#3C2A21] uppercase block leading-none">Factura C (ARCA)</span>
                {wantsInvoice && !showAdvanced && <span className="text-[10px] text-gray-500 font-bold">Consumidor Final</span>}
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={wantsInvoice} 
                onChange={(e) => setWantsInvoice(e.target.checked)} 
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4F7942]"></div>
            </label>
          </div>

          {wantsInvoice && (
            <div className="pt-1">
              <button 
                onClick={() => {
                  setShowAdvanced(!showAdvanced);
                  if (showAdvanced) {
                    setDocTipo('99');
                    setDocNro('');
                  }
                }}
                className="flex items-center gap-1 text-[10px] font-bold text-[#8B4513] hover:text-[#5D2E0C]"
              >
                {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                {showAdvanced ? 'Ocultar opciones avanzadas' : 'Facturar a un CUIT/DNI específico'}
              </button>

              {showAdvanced && (
                <div className="mt-2 space-y-2 border-t border-[#EFEBE9] pt-2 animate-in fade-in">
                  <div className="flex gap-1.5 text-xs font-semibold">
                    <button
                      onClick={() => { setDocTipo('99'); setDocNro(''); }}
                      className={`flex-1 py-1 px-1 rounded-lg border text-center truncate transition-colors ${
                        docTipo === '99'
                          ? 'bg-amber-100 border-amber-400 text-amber-900 font-bold'
                          : 'bg-[#FDFBF7] border-gray-200 text-gray-500'
                      }`}
                    >
                      Cons. Final
                    </button>
                    <button
                      onClick={() => setDocTipo('96')}
                      className={`flex-1 py-1 px-1 rounded-lg border text-center transition-colors ${
                        docTipo === '96'
                          ? 'bg-amber-100 border-amber-400 text-amber-900 font-bold'
                          : 'bg-[#FDFBF7] border-gray-200 text-gray-500'
                      }`}
                    >
                      DNI
                    </button>
                    <button
                      onClick={() => setDocTipo('80')}
                      className={`flex-1 py-1 px-1 rounded-lg border text-center transition-colors ${
                        docTipo === '80'
                          ? 'bg-amber-100 border-amber-400 text-amber-900 font-bold'
                          : 'bg-[#FDFBF7] border-gray-200 text-gray-500'
                      }`}
                    >
                      CUIT
                    </button>
                  </div>

                  {/* Input para DNI o CUIT */}
                  {docTipo !== '99' && (
                    <input
                      type="number"
                      placeholder={docTipo === '80' ? 'Ingrese CUIT (11 dígitos)' : 'Ingrese DNI del cliente'}
                      value={docNro}
                      onChange={(e) => setDocNro(e.target.value)}
                      className="w-full p-2 bg-[#FDFBF7] border border-[#D7CCC8] rounded-xl text-xs font-bold outline-none focus:border-[#8B4513]"
                    />
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Warning if Shift is closed */}
        {!isShiftOpen && (
          <div className="p-2.5 bg-red-100 border border-red-300 rounded-xl flex items-center gap-2 text-red-800 text-xs font-bold">
            <AlertCircle size={16} className="shrink-0" />
            <span>Debe abrir la caja desde la pestaña Caja para poder cobrar.</span>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleCobrar}
          disabled={items.length === 0 || !isShiftOpen || (wantsInvoice && docTipo !== '99' && !docNro)}
          className={`w-full py-4 text-white rounded-2xl font-black text-lg shadow-md uppercase border-b-4 transition-all active:scale-98 ${
            !isShiftOpen
              ? 'bg-gray-400 border-gray-500 cursor-not-allowed opacity-75'
              : 'bg-[#4F7942] disabled:bg-[#A3B89E] disabled:border-[#8FA38B] disabled:text-white/70 border-[#2D4226] hover:brightness-110 shadow-lg'
          }`}
        >
          {!isShiftOpen 
            ? 'CAJA CERRADA' 
            : wantsInvoice 
            ? 'COBRAR Y FACTURAR' 
            : 'COBRAR TICKET'}
        </button>
      </div>
    </div>
  );
}
