import React, { useState, useMemo } from 'react';
import { 
  X, Info, Tag, Plus, Edit2, Trash2, Save, Store, Calculator, Clock, 
  ReceiptText, ArrowLeft, CheckCircle2, ChevronDown, ChevronUp, 
  Calendar, ShieldCheck, Share2, Copy, Check, FileText 
} from 'lucide-react';
import { Product, Sale, ShiftState } from '../types';
import { saveProductToDB, deleteProductFromDB, saveCategoriesToDB, saveShiftToDB, saveShiftClosureToDB } from '../services/dbService';

interface PricesViewProps {
  categories: string[];
  products: Product[];
  onBack?: () => void;
}

export function PricesView({ categories, products, onBack }: PricesViewProps) {
  const [activeCategory, setActiveCategory] = useState(categories[0] || '');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});

  const filteredProducts = products.filter(p => p.category === activeCategory);

  const handleAddCategory = () => {
    if (newCategoryName.trim() && !categories.includes(newCategoryName.trim())) {
      const trimmed = newCategoryName.trim();
      saveCategoriesToDB([...categories, trimmed]);
      setActiveCategory(trimmed);
      setNewCategoryName('');
    }
  };

  const handleDeleteCategory = (cat: string) => {
    saveCategoriesToDB(categories.filter(c => c !== cat));
    
    // Eliminar también los productos de esa categoría
    const productsToDelete = products.filter(p => p.category === cat);
    productsToDelete.forEach(p => deleteProductFromDB(p.id));

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
    saveProductToDB(newProd); // Guarda directamente en DB, el listener actualiza el estado
    setEditingProductId(newId);
    setEditForm(newProd);
  };

  const handleSaveProduct = () => {
    if (editingProductId) {
      const currentProduct = products.find(p => p.id === editingProductId);
      if (currentProduct) {
        saveProductToDB({ ...currentProduct, ...editForm } as Product);
      }
      setEditingProductId(null);
    }
  };

  const handleDeleteProduct = (id: string) => {
    deleteProductFromDB(id);
  };

  return (
    <div className="h-full flex flex-col bg-[#FDFBF7] rounded-3xl border-2 border-[#D7CCC8] shadow-md overflow-hidden">
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
      <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-2.5 bg-white">
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
  sales: Sale[];
  onSelectSaleForInvoice?: (sale: Sale) => void;
  onBack?: () => void;
}

export function CashRegisterView({ shift, sales, onSelectSaleForInvoice, onBack }: CashRegisterViewProps) {
  const [initialBalanceInput, setInitialBalanceInput] = useState('');
  const [showConfirmClose, setShowConfirmClose] = useState(false);

  const currentShiftSales = sales.filter((s) => {
    if (s.shift !== shift.shift) return false;
    if (shift.openedAt) {
      // Filtrar solo las ventas que ocurrieron DESPUÉS de abrir la caja actual
      return s.timestamp.getTime() >= shift.openedAt.getTime();
    }
    return true;
  });

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
    saveShiftToDB({ 
      isOpen: true, 
      shift: turno, 
      initialBalance: balance,
      openedAt: new Date()
    });
  };

  const confirmCloseShift = () => {
    // Guardar el historial del turno cerrado
    saveShiftClosureToDB({
      shift: shift.shift,
      openedAt: shift.openedAt,
      closedAt: new Date(),
      initialBalance: shift.initialBalance,
      totalEfectivo,
      totalTarjeta,
      totalTransferencia,
      totalVentas,
      salesCount: currentShiftSales.length
    });

    saveShiftToDB({ isOpen: false, shift: null, initialBalance: 0, openedAt: null });
    setShowConfirmClose(false);
  };

  return (
    <div className="h-full flex flex-col bg-[#FDFBF7] rounded-3xl border-2 border-[#D7CCC8] shadow-md overflow-hidden">
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

      <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 space-y-3.5">
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

// ==========================================
// VISTA DE ESTADÍSTICAS Y REPORTES
// ==========================================

interface StatsViewProps {
  sales: Sale[];
  onSelectSaleForInvoice?: (sale: Sale) => void;
  onBack?: () => void;
}

export function StatsView({ sales, onSelectSaleForInvoice, onBack }: StatsViewProps) {
  const [filterPeriod, setFilterPeriod] = useState<'week' | 'month' | 'all'>('week');
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  // Helper para verificar si una venta tiene CAE oficial de ARCA
  const isArcaInvoice = (s: Sale) => Boolean(s.invoice && s.fiscalData?.cae);

  // Helper functions para fechas
  const now = new Date();
  
  // Principio de la semana (Lunes a las 00:00:00)
  const startOfWeek = new Date(now);
  const day = startOfWeek.getDay();
  const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
  startOfWeek.setDate(diff);
  startOfWeek.setHours(0, 0, 0, 0);

  // Principio del mes
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);

  // Filtrado según período seleccionado
  const currentSales = useMemo(() => {
    if (filterPeriod === 'week') {
      return sales.filter(s => s.timestamp >= startOfWeek);
    }
    if (filterPeriod === 'month') {
      return sales.filter(s => s.timestamp >= startOfMonth);
    }
    return sales;
  }, [sales, filterPeriod]);

  // Totales globales del período
  const total = currentSales.reduce((acc, s) => acc + s.total, 0);
  const facturado = currentSales.filter(isArcaInvoice).reduce((acc, s) => acc + s.total, 0);
  const noFacturado = total - facturado;
  const facturadoPercent = total > 0 ? Math.round((facturado / total) * 100) : 0;

  // Agrupación día por día
  const dailyGroups = useMemo(() => {
    const groups: { [key: string]: { dateStr: string; total: number; facturado: number; noFacturado: number; sales: Sale[] } } = {};
    
    currentSales.forEach(s => {
      const year = s.timestamp.getFullYear();
      const month = String(s.timestamp.getMonth() + 1).padStart(2, '0');
      const day = String(s.timestamp.getDate()).padStart(2, '0');
      const dateKey = `${year}-${month}-${day}`;

      if (!groups[dateKey]) {
        groups[dateKey] = {
          dateStr: dateKey,
          total: 0,
          facturado: 0,
          noFacturado: 0,
          sales: []
        };
      }

      const hasCae = isArcaInvoice(s);
      groups[dateKey].total += s.total;
      if (hasCae) {
        groups[dateKey].facturado += s.total;
      } else {
        groups[dateKey].noFacturado += s.total;
      }
      groups[dateKey].sales.push(s);
    });

    // Ordenar días del más reciente al más antiguo
    const sorted = Object.values(groups).sort((a, b) => b.dateStr.localeCompare(a.dateStr));

    // Ordenar las ventas de cada día de más reciente a más antigua
    sorted.forEach(g => {
      g.sales.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    });

    return sorted;
  }, [currentSales]);

  // Formato de nombre del día
  const formatDateLabel = (dateStr: string) => {
    const [year, month, dayNum] = dateStr.split('-').map(Number);
    const d = new Date(year, month - 1, dayNum);
    
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    const yesterday = new Date(Date.now() - 86400000);
    const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

    const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    const dayName = daysOfWeek[d.getDay()];
    const monthName = months[d.getMonth()];

    if (dateStr === todayStr) {
      return { title: 'Hoy', subtitle: `${dayName} ${dayNum} de ${monthName}`, isToday: true };
    }
    if (dateStr === yesterdayStr) {
      return { title: 'Ayer', subtitle: `${dayName} ${dayNum} de ${monthName}`, isToday: false };
    }
    return { title: `${dayName} ${dayNum}`, subtitle: `${monthName} ${year}`, isToday: false };
  };

  const toggleDay = (dateStr: string) => {
    setExpandedDays(prev => ({
      ...prev,
      [dateStr]: !prev[dateStr]
    }));
  };

  // Copiar reporte listo para enviar a la contadora
  const handleCopyReport = () => {
    const periodName = filterPeriod === 'week' ? 'Esta Semana' : filterPeriod === 'month' ? 'Este Mes' : 'Histórico Total';
    let text = `🥩 *REPORTE DE VENTAS Y FACTURACIÓN ARCA*\n`;
    text += `🗓 *Período:* ${periodName}\n`;
    text += `💰 *Total Ventas:* $${total.toLocaleString('es-AR')}\n`;
    text += `✅ *Facturado ARCA (con CAE):* $${facturado.toLocaleString('es-AR')} (${facturadoPercent}%)\n`;
    text += `⚠️ *Sin Facturar:* $${noFacturado.toLocaleString('es-AR')} (${100 - facturadoPercent}%)\n`;
    text += `🧾 *Cantidad de Operaciones:* ${currentSales.length}\n\n`;
    text += `📅 *DESGLOSE DÍA POR DÍA:*\n`;

    dailyGroups.forEach(g => {
      const { title, subtitle } = formatDateLabel(g.dateStr);
      text += `\n📌 *${title} (${subtitle})*\n`;
      text += `   • Total: $${g.total.toLocaleString('es-AR')}\n`;
      text += `   • Facturado ARCA: $${g.facturado.toLocaleString('es-AR')}\n`;
      if (g.noFacturado > 0) {
        text += `   • No Facturado: $${g.noFacturado.toLocaleString('es-AR')}\n`;
      }
      text += `   • Operaciones: ${g.sales.length}\n`;
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="h-full flex flex-col bg-[#FDFBF7] rounded-3xl border-2 border-[#D7CCC8] shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-[#8B4513] text-white p-3.5 sm:p-4 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
          {onBack && (
            <button onClick={onBack} className="p-1 hover:bg-white/20 rounded-full sm:hidden">
              <ArrowLeft size={20} />
            </button>
          )}
          <div>
            <h2 className="text-base sm:text-lg font-black tracking-tight leading-none">Reporte de Facturación</h2>
            <span className="text-[10px] text-amber-200 font-semibold">Control Monotributo & ARCA</span>
          </div>
        </div>

        {/* Botón Copiar Reporte */}
        <button
          onClick={handleCopyReport}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all active:scale-95 shadow-xs ${
            copied 
              ? 'bg-emerald-600 text-white' 
              : 'bg-white/20 hover:bg-white/30 text-white border border-white/30'
          }`}
          title="Copiar reporte formateado para WhatsApp o contadora"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          <span>{copied ? '¡Copiado!' : 'Copiar Reporte'}</span>
        </button>
      </div>

      {/* Tabs Selector de Período */}
      <div className="p-2.5 bg-[#EFEBE9] border-b border-[#D7CCC8] flex gap-2 shrink-0">
        {[
          { id: 'week', label: 'Esta Semana' },
          { id: 'month', label: 'Este Mes' },
          { id: 'all', label: 'Todo el Historial' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterPeriod(tab.id as any)}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-black transition-all active:scale-95 ${
              filterPeriod === tab.id
                ? 'bg-[#8B4513] text-white shadow-xs'
                : 'bg-white text-[#5D4037] hover:bg-[#FDFBF7] border border-[#D7CCC8]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenido scrolleable */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4">
        
        {/* TARJETA DE RESUMEN GLOBAL */}
        <div className="bg-white p-4 rounded-2xl border-2 border-[#D7CCC8] shadow-xs space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-[#EFEBE9]">
            <span className="text-xs font-bold text-[#5D4037] uppercase tracking-wider">
              {filterPeriod === 'week' ? 'Resumen Semanal' : filterPeriod === 'month' ? 'Resumen Mensual' : 'Resumen Total'}
            </span>
            <span className="text-[11px] font-black bg-[#EFEBE9] text-[#8B4513] px-2 py-0.5 rounded-lg">
              {currentSales.length} {currentSales.length === 1 ? 'venta' : 'ventas'}
            </span>
          </div>

          <div className="flex justify-between items-baseline">
            <span className="text-sm font-semibold text-gray-600">Total en Ventas:</span>
            <span className="text-2xl font-black text-[#3C2A21]">${total.toLocaleString('es-AR')}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 flex flex-col">
              <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                <ShieldCheck size={14} className="text-emerald-700" /> Facturado (ARCA):
              </span>
              <span className="text-base sm:text-lg font-black text-emerald-700 mt-0.5">
                ${facturado.toLocaleString('es-AR')}
              </span>
              <span className="text-[10px] font-extrabold text-emerald-600 mt-auto">
                {facturadoPercent}% del total
              </span>
            </div>

            <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 flex flex-col">
              <span className="text-[11px] font-bold text-amber-800 flex items-center gap-1">
                <Info size={14} className="text-amber-700" /> Sin Facturar:
              </span>
              <span className="text-base sm:text-lg font-black text-amber-700 mt-0.5">
                ${noFacturado.toLocaleString('es-AR')}
              </span>
              <span className="text-[10px] font-extrabold text-amber-600 mt-auto">
                {100 - facturadoPercent}% del total
              </span>
            </div>
          </div>

          {/* Barra de progreso visual */}
          <div className="w-full bg-amber-200 rounded-full h-2.5 flex overflow-hidden">
            <div 
              className="bg-emerald-500 h-full transition-all duration-500" 
              style={{ width: `${facturadoPercent}%` }}
              title={`Facturado: ${facturadoPercent}%`}
            ></div>
          </div>
        </div>

        {/* SECCIÓN DÍA POR DÍA */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-black text-[#5D4037] uppercase tracking-wider flex items-center gap-1.5">
              <Calendar size={14} className="text-[#8B4513]" /> Detalle Día por Día
            </h3>
            <span className="text-[10px] text-gray-500 font-bold">
              {dailyGroups.length} {dailyGroups.length === 1 ? 'día registrado' : 'días registrados'}
            </span>
          </div>

          {dailyGroups.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-[#D7CCC8] text-gray-400 font-semibold text-xs">
              No hay ventas registradas en el período seleccionado.
            </div>
          ) : (
            dailyGroups.map((group) => {
              const { title, subtitle, isToday } = formatDateLabel(group.dateStr);
              const isExpanded = expandedDays[group.dateStr] ?? isToday; // Abierto por defecto si es Hoy

              return (
                <div
                  key={group.dateStr}
                  className="bg-white rounded-2xl border border-[#D7CCC8] shadow-2xs overflow-hidden transition-all"
                >
                  {/* Fila Cabecera del Día */}
                  <div
                    onClick={() => toggleDay(group.dateStr)}
                    className="p-3.5 flex justify-between items-center cursor-pointer hover:bg-[#FDFBF7] transition-colors select-none"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                        isToday ? 'bg-[#8B4513] text-white' : 'bg-[#EFEBE9] text-[#5D4037]'
                      }`}>
                        {group.dateStr.split('-')[2]}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-sm text-[#3C2A21]">{title}</span>
                          {isToday && (
                            <span className="text-[9px] font-black bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-full uppercase">
                              Hoy
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-gray-500 font-semibold block">{subtitle}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="font-black text-sm sm:text-base text-[#3C2A21] block leading-tight">
                          ${group.total.toLocaleString('es-AR')}
                        </span>
                        <div className="flex items-center gap-1.5 justify-end mt-0.5">
                          <span className="text-[10px] font-extrabold text-emerald-700">
                            ARCA: ${group.facturado.toLocaleString('es-AR')}
                          </span>
                          {group.noFacturado > 0 && (
                            <span className="text-[10px] font-bold text-amber-700">
                              | Sin fac: ${group.noFacturado.toLocaleString('es-AR')}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-[#8B4513] p-1 rounded-lg bg-[#FDFBF7] border border-[#EFEBE9]">
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </div>
                  </div>

                  {/* Listado de Ventas Desplegado para ese Día */}
                  {isExpanded && (
                    <div className="border-t border-[#EFEBE9] bg-[#FDFBF7]/60 p-2.5 space-y-2">
                      <div className="flex justify-between items-center px-1 text-[10px] font-bold text-gray-400 uppercase">
                        <span>Ventas del día ({group.sales.length})</span>
                        <span>Hora / Medio / Estado</span>
                      </div>

                      <div className="space-y-1.5">
                        {group.sales.map((sale) => {
                          const hasCae = isArcaInvoice(sale);
                          return (
                            <div
                              key={sale.id}
                              className="p-2.5 bg-white rounded-xl border border-[#EFEBE9] flex justify-between items-center shadow-2xs hover:border-[#D7CCC8] transition-colors"
                            >
                              <div className="flex-1 pr-2 min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="text-xs font-black text-[#3C2A21]">
                                    {sale.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                  <span className="text-[10px] font-bold bg-[#EFEBE9] text-[#8B4513] px-1.5 py-0.5 rounded">
                                    {sale.paymentMethod}
                                  </span>
                                  {hasCae ? (
                                    <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                      <CheckCircle2 size={10} /> Factura C #{sale.fiscalData?.cbteNro}
                                    </span>
                                  ) : (
                                    <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                                      Sin Factura
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-gray-600 truncate mt-1">
                                  {sale.items.map((i) => `${i.product.name} (${i.quantity}${i.product.unit})`).join(', ')}
                                </p>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <span className="font-black text-sm text-[#A52A2A]">
                                  ${sale.total.toLocaleString('es-AR')}
                                </span>
                                {hasCae && onSelectSaleForInvoice && (
                                  <button
                                    onClick={() => onSelectSaleForInvoice(sale)}
                                    className="p-1.5 bg-[#EFEBE9] hover:bg-[#D7CCC8] text-[#8B4513] rounded-lg transition-colors active:scale-95"
                                    title="Ver comprobante oficial ARCA con QR"
                                  >
                                    <ReceiptText size={16} />
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
