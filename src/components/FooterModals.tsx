import React, { useState } from 'react';
import { X, Info, Tag, Plus, Edit2, Trash2, Save, Store, Calculator, Clock, ReceiptText, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Product, Sale, ShiftState } from '../types';

interface PricesViewProps {
  categories: string[];
  products: Product[];
  setCategories: (cats: string[]) => void;
  setProducts: (prods: Product[]) => void;
  onBack?: () => void;
}

export function PricesView({ categories, products, setCategories, setProducts, onBack }: PricesViewProps) {
  const [activeCategory, setActiveCategory] = useState(categories[0] || '');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});

  const filteredProducts = products.filter(p => p.category === activeCategory);

  const handleAddCategory = () => {
    if (newCategoryName.trim() && !categories.includes(newCategoryName.trim())) {
      const trimmed = newCategoryName.trim();
      setCategories([...categories, trimmed]);
      setActiveCategory(trimmed);
      setNewCategoryName('');
    }
  };

  const handleDeleteCategory = (cat: string) => {
    setCategories(categories.filter(c => c !== cat));
    setProducts(products.filter(p => p.category !== cat));
    if (activeCategory === cat) setActiveCategory(categories[0] || '');
  };

  const handleAddProduct = () => {
    const newId = Math.random().toString(36).substring(2, 9);
    const newProd: Product = { 
      id: newId, 
      name: 'Nuevo Corte', 
      price: 5000, 
      category: activeCategory, 
      unit: 'kg'
    };
    setProducts([...products, newProd]);
    setEditingProductId(newId);
    setEditForm(newProd);
  };

  const handleSaveProduct = () => {
    if (editingProductId) {
      setProducts(products.map(p => p.id === editingProductId ? { ...p, ...editForm } as Product : p));
      setEditingProductId(null);
    }
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  return (
    <div className="h-full flex flex-col bg-[#FDFBF7] rounded-3xl border-2 border-[#D7CCC8] shadow-md overflow-hidden pb-16 sm:pb-0">
      {/* Header */}
      <div className="bg-[#8B4513] text-white p-3.5 sm:p-4 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          {onBack && (
            <button onClick={onBack} className="p-1 hover:bg-white/20 rounded-full sm:hidden">
              <ArrowLeft size={20} />
            </button>
          )}
          <Tag size={22} className="text-amber-300" />
          <h2 className="text-base sm:text-lg font-black tracking-tight">Catálogo y Precios</h2>
        </div>
        <button
          onClick={handleAddProduct}
          disabled={!activeCategory}
          className="px-3 py-1.5 bg-[#4F7942] hover:brightness-110 active:scale-95 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition-all border border-[#2D4226]"
        >
          <Plus size={16} /> + Corte
        </button>
      </div>

      {/* Category Pills Slider */}
      <div className="p-2.5 bg-[#EFEBE9] border-b border-[#D7CCC8] shrink-0">
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <div
              key={cat}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase transition-all shrink-0 cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#8B4513] text-white shadow-xs'
                  : 'bg-white text-[#3C2A21] border border-[#D7CCC8]'
              }`}
              onClick={() => setActiveCategory(cat)}
            >
              <span>{cat}</span>
              {categories.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCategory(cat);
                  }}
                  className="opacity-70 hover:opacity-100"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          ))}
        </div>
        
        {/* Quick Add Category Bar */}
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            placeholder="Nueva categoría..."
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
            className="flex-1 px-3 py-1.5 bg-white border border-[#D7CCC8] rounded-xl text-xs font-semibold outline-none focus:border-[#8B4513]"
          />
          <button
            onClick={handleAddCategory}
            disabled={!newCategoryName.trim()}
            className="px-3 py-1.5 bg-[#8B4513] text-white rounded-xl text-xs font-bold disabled:opacity-50"
          >
            Agregar
          </button>
        </div>
      </div>

      {/* Product List for Mobile */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-white">
        {filteredProducts.map((product) => {
          const isEditing = editingProductId === product.id;

          if (isEditing) {
            return (
              <div key={product.id} className="p-3 bg-[#FDFBF7] rounded-2xl border-2 border-[#8B4513] space-y-2 shadow-xs">
                <input
                  type="text"
                  placeholder="Nombre del corte"
                  value={editForm.name || ''}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full p-2 bg-white border border-[#D7CCC8] rounded-xl text-sm font-bold outline-none"
                />
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-[#5D4037] uppercase">Precio ($)</label>
                    <input
                      type="number"
                      value={editForm.price || ''}
                      onChange={(e) => setEditForm({ ...editForm, price: parseFloat(e.target.value) || 0 })}
                      className="w-full p-2 bg-white border border-[#D7CCC8] rounded-xl text-sm font-black text-[#A52A2A] outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#5D4037] uppercase">Unidad</label>
                    <select
                      value={editForm.unit || 'kg'}
                      onChange={(e) => setEditForm({ ...editForm, unit: e.target.value as 'kg' | 'unidad' })}
                      className="w-full p-2 bg-white border border-[#D7CCC8] rounded-xl text-sm font-bold outline-none"
                    >
                      <option value="kg">kg (Kilos)</option>
                      <option value="unidad">unidad (Pieza)</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    onClick={() => setEditingProductId(null)}
                    className="px-3 py-1.5 bg-gray-200 text-[#3C2A21] rounded-xl text-xs font-bold"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveProduct}
                    className="px-4 py-1.5 bg-[#4F7942] text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs"
                  >
                    <Save size={14} /> Guardar
                  </button>
                </div>
              </div>
            );
          }

          return (
            <div
              key={product.id}
              className="p-3 bg-[#FDFBF7] rounded-2xl border border-[#EFEBE9] flex justify-between items-center shadow-2xs hover:border-[#D7CCC8] transition-colors"
            >
              <div>
                <p className="font-extrabold text-sm sm:text-base text-[#3C2A21] leading-tight">
                  {product.name}
                </p>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="font-black text-sm text-[#A52A2A]">
                    ${product.price.toLocaleString('es-AR')}
                  </span>
                  <span className="text-xs text-gray-500 font-semibold">/{product.unit}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setEditingProductId(product.id);
                    setEditForm(product);
                  }}
                  className="p-2 bg-white hover:bg-[#EFEBE9] border border-[#D7CCC8] text-[#8B4513] rounded-xl active:scale-95 transition-all"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  className="p-2 bg-white hover:bg-red-50 border border-[#D7CCC8] text-red-500 rounded-xl active:scale-95 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          );
        })}

        {filteredProducts.length === 0 && (
          <div className="py-12 text-center text-gray-400 font-semibold text-sm">
            No hay productos cargados en esta categoría.
          </div>
        )}
      </div>
    </div>
  );
}

interface CashRegisterViewProps {
  shift: ShiftState;
  setShift: (s: ShiftState) => void;
  sales: Sale[];
  onSelectSaleForInvoice?: (sale: Sale) => void;
  onBack?: () => void;
}

export function CashRegisterView({ shift, setShift, sales, onSelectSaleForInvoice, onBack }: CashRegisterViewProps) {
  const [initialBalanceInput, setInitialBalanceInput] = useState('');
  const [showConfirmClose, setShowConfirmClose] = useState(false);

  const currentShiftSales = sales.filter((s) => s.shift === shift.shift);

  const totalEfectivo = currentShiftSales
    .filter((s) => s.paymentMethod === 'Efectivo')
    .reduce((sum, s) => sum + s.total, 0);
  const totalTarjeta = currentShiftSales
    .filter((s) => s.paymentMethod === 'Tarjeta')
    .reduce((sum, s) => sum + s.total, 0);
  const totalTransferencia = currentShiftSales
    .filter((s) => s.paymentMethod === 'Transferencia')
    .reduce((sum, s) => sum + s.total, 0);

  const totalVentas = totalEfectivo + totalTarjeta + totalTransferencia;
  const totalEnCajaFisica = shift.initialBalance + totalEfectivo;

  const handleOpenShift = (turno: 'Mañana' | 'Tarde') => {
    const balance = parseFloat(initialBalanceInput) || 0;
    setShift({ 
      isOpen: true, 
      shift: turno, 
      initialBalance: balance,
      openedAt: new Date()
    });
  };

  const confirmCloseShift = () => {
    setShift({ isOpen: false, shift: null, initialBalance: 0, openedAt: null });
    setShowConfirmClose(false);
  };

  return (
    <div className="h-full flex flex-col bg-[#FDFBF7] rounded-3xl border-2 border-[#D7CCC8] shadow-md overflow-hidden pb-16 sm:pb-0">
      {/* Header */}
      <div className="bg-[#8B4513] text-white p-3.5 sm:p-4 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          {onBack && (
            <button onClick={onBack} className="p-1 hover:bg-white/20 rounded-full sm:hidden">
              <ArrowLeft size={20} />
            </button>
          )}
          <Store size={22} className="text-amber-300" />
          <h2 className="text-base sm:text-lg font-black tracking-tight">Caja y Arqueo de Turno</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3.5">
        {!shift.isOpen ? (
          /* Caja Cerrada - Pantalla de Apertura */
          <div className="bg-white p-5 rounded-2xl border-2 border-[#D7CCC8] flex flex-col items-center text-center shadow-xs">
            <div className="w-16 h-16 bg-[#EFEBE9] rounded-2xl flex items-center justify-center mb-3 border-2 border-[#D7CCC8]">
              <Calculator size={36} className="text-[#8B4513]" />
            </div>
            <h3 className="text-lg font-black text-[#3C2A21] mb-1">Apertura de Caja</h3>
            <p className="text-xs text-[#5D4037] mb-4">
              Ingrese el fondo inicial en efectivo y seleccione el turno de trabajo.
            </p>

            <div className="w-full space-y-3">
              <div className="text-left">
                <label className="block text-xs font-bold text-[#5D4037] uppercase mb-1">
                  Fondo Inicial en Efectivo ($)
                </label>
                <input
                  type="number"
                  placeholder="Ej. 15000"
                  value={initialBalanceInput}
                  onChange={(e) => setInitialBalanceInput(e.target.value)}
                  className="w-full p-3 bg-[#FDFBF7] border-2 border-[#D7CCC8] rounded-xl text-lg font-bold outline-none focus:border-[#8B4513]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => handleOpenShift('Mañana')}
                  className="py-3 bg-[#4F7942] text-white rounded-xl font-black text-sm uppercase shadow-sm border-b-3 border-[#2D4226] active:scale-95 transition-all"
                >
                  Turno Mañana
                </button>
                <button
                  onClick={() => handleOpenShift('Tarde')}
                  className="py-3 bg-[#8B4513] text-white rounded-xl font-black text-sm uppercase shadow-sm border-b-3 border-[#5D2E0C] active:scale-95 transition-all"
                >
                  Turno Tarde
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Caja Abierta - Arqueo y Cierre */
          <>
            {/* Banner de Turno Activo */}
            <div className="bg-white p-4 rounded-2xl border-2 border-[#D7CCC8] shadow-xs">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="text-[10px] font-bold text-[#5D4037] uppercase tracking-wider block">
                    Turno en Curso
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Clock size={16} className="text-[#8B4513]" />
                    <span className="text-xl font-black text-[#3C2A21]">{shift.shift}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-[#5D4037] uppercase tracking-wider block">
                    Físico en Caja
                  </span>
                  <span className="text-2xl font-black text-[#4F7942]">
                    ${totalEnCajaFisica.toLocaleString('es-AR')}
                  </span>
                </div>
              </div>

              <div className="text-xs text-gray-500 font-medium pb-3 border-b border-[#EFEBE9]">
                Fondo inicial: <strong className="text-[#3C2A21]">${shift.initialBalance.toLocaleString('es-AR')}</strong> | Cobros efectivo: <strong className="text-[#3C2A21]">${totalEfectivo.toLocaleString('es-AR')}</strong>
              </div>

              {/* Botón de Cierre */}
              <div className="pt-3">
                {!showConfirmClose ? (
                  <button
                    onClick={() => setShowConfirmClose(true)}
                    className="w-full py-2.5 bg-[#A52A2A] hover:bg-[#8B2323] text-white rounded-xl font-black text-xs uppercase tracking-wider border-b-3 border-[#6E1A1A] shadow-xs active:scale-98 transition-all"
                  >
                    CERRAR TURNO Y REALIZAR ARQUEO
                  </button>
                ) : (
                  <div className="bg-red-50 p-2.5 rounded-xl border border-red-200 text-center space-y-2 animate-in fade-in">
                    <p className="text-xs font-bold text-red-800">
                      ¿Confirmar cierre de turno y reiniciar caja?
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowConfirmClose(false)}
                        className="flex-1 py-2 bg-gray-200 text-gray-800 rounded-lg text-xs font-bold"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={confirmCloseShift}
                        className="flex-1 py-2 bg-red-600 text-white rounded-lg text-xs font-bold"
                      >
                        Sí, Cerrar Caja
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Tarjetas de Medios de Pago */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white p-2.5 rounded-xl border border-[#D7CCC8] text-center shadow-2xs">
                <span className="text-[10px] font-bold text-gray-500 uppercase block">Efectivo</span>
                <span className="text-sm font-black text-[#3C2A21] mt-0.5 block">
                  ${totalEfectivo.toLocaleString('es-AR')}
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-[#D7CCC8] text-center shadow-2xs">
                <span className="text-[10px] font-bold text-gray-500 uppercase block">Tarjeta</span>
                <span className="text-sm font-black text-[#3C2A21] mt-0.5 block">
                  ${totalTarjeta.toLocaleString('es-AR')}
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-[#D7CCC8] text-center shadow-2xs">
                <span className="text-[10px] font-bold text-gray-500 uppercase block">Transfer.</span>
                <span className="text-sm font-black text-[#3C2A21] mt-0.5 block">
                  ${totalTransferencia.toLocaleString('es-AR')}
                </span>
              </div>
            </div>

            {/* Historial de Ventas */}
            <div className="bg-white rounded-2xl border-2 border-[#D7CCC8] overflow-hidden shadow-xs">
              <div className="p-3 bg-[#EFEBE9] border-b border-[#D7CCC8] flex justify-between items-center font-bold text-xs text-[#5D4037]">
                <span>Ventas del Turno ({currentShiftSales.length})</span>
                <span className="font-black text-[#A52A2A] text-sm">${totalVentas.toLocaleString('es-AR')}</span>
              </div>
              <div className="p-2 divide-y divide-[#EFEBE9] max-h-60 overflow-y-auto">
                {currentShiftSales.length === 0 ? (
                  <div className="py-8 text-center text-gray-400 text-xs font-semibold">
                    Aún no hay ventas registradas en este turno.
                  </div>
                ) : (
                  currentShiftSales.map((sale) => (
                    <div
                      key={sale.id}
                      className="py-2.5 px-1 flex justify-between items-center hover:bg-[#FDFBF7] transition-colors"
                    >
                      <div className="flex-1 pr-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black text-[#3C2A21]">
                            {sale.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span className="text-[10px] font-bold bg-[#EFEBE9] text-[#8B4513] px-1.5 py-0.5 rounded">
                            {sale.paymentMethod}
                          </span>
                          {sale.invoice && (
                            <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                              ARCA
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-600 truncate mt-0.5">
                          {sale.items.map((i) => `${i.product.name} (${i.quantity}${i.product.unit})`).join(', ')}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-[#A52A2A]">
                          ${sale.total.toLocaleString('es-AR')}
                        </span>
                        {sale.invoice && onSelectSaleForInvoice && (
                          <button
                            onClick={() => onSelectSaleForInvoice(sale)}
                            className="p-1.5 bg-[#EFEBE9] hover:bg-[#D7CCC8] text-[#8B4513] rounded-lg transition-colors"
                            title="Ver Factura ARCA"
                          >
                            <ReceiptText size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
