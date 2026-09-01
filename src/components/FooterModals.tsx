import React, { useState } from 'react';
import { X, Info, Tag, Scale, Plus, Edit2, Trash2, Save, Store, Calculator, Clock } from 'lucide-react';
import { Product, Sale, ShiftState } from '../types';

interface ModalProps {
  onClose: () => void;
}

export function HelpModal({ onClose }: ModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-[#FDFBF7] rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border-2 border-[#D7CCC8]">
        <div className="bg-[#8B4513] text-white p-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Info size={28} />
            <h2 className="text-2xl font-bold">Ayuda del Sistema</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="p-6 text-[#3C2A21] space-y-4">
          <p className="text-lg mb-4">El sistema está diseñado para ser rápido y fácil de usar:</p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="bg-[#A52A2A] text-white font-bold w-8 h-8 rounded-full flex items-center justify-center shrink-0">1</span>
              <p className="text-lg"><strong>Seleccione un producto</strong> usando los botones de las categorías.</p>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-[#A52A2A] text-white font-bold w-8 h-8 rounded-full flex items-center justify-center shrink-0">2</span>
              <p className="text-lg"><strong>Ingrese el peso</strong> (en kilos o unidades) usando el teclado numérico en pantalla.</p>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-[#A52A2A] text-white font-bold w-8 h-8 rounded-full flex items-center justify-center shrink-0">3</span>
              <p className="text-lg">Presione <strong>CONFIRMAR</strong>. El producto se agregará al detalle de venta a la derecha.</p>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-[#A52A2A] text-white font-bold w-8 h-8 rounded-full flex items-center justify-center shrink-0">4</span>
              <p className="text-lg">Presione el botón verde <strong>COBRAR</strong> para finalizar la venta y limpiar la pantalla para el siguiente cliente.</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export function ScaleModal({ onClose }: ModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-[#FDFBF7] rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border-2 border-[#D7CCC8]">
        <div className="bg-[#8B4513] text-white p-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Scale size={28} />
            <h2 className="text-2xl font-bold">Balanza Electrónica</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>
        <div className="p-8 text-center text-[#3C2A21] flex flex-col items-center">
          <div className="w-32 h-32 bg-[#EFEBE9] rounded-full flex items-center justify-center mb-6 border-4 border-[#D7CCC8]">
            <Scale size={64} className="text-[#8B4513]" />
          </div>
          <h3 className="text-2xl font-bold mb-3">Integración de Hardware</h3>
          <p className="text-lg text-[#5D4037] mb-6">
            El sistema está preparado para conectarse automáticamente a balanzas electrónicas (USB, RS232 o Bluetooth) en su versión instalada.
          </p>
          <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-xl text-left w-full">
            <p className="font-semibold">ℹ️ Para esta demostración:</p>
            <p className="text-sm mt-1">El peso se ingresa de forma manual utilizando el teclado táctil en pantalla al seleccionar cada producto.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface PricesModalProps {
  onClose: () => void;
  categories: string[];
  products: Product[];
  setCategories: (cats: string[]) => void;
  setProducts: (prods: Product[]) => void;
}

export function PricesModal({ onClose, categories, products, setCategories, setProducts }: PricesModalProps) {
  const [activeCategory, setActiveCategory] = useState(categories[0] || '');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});

  const filteredProducts = products.filter(p => p.category === activeCategory);

  const handleAddCategory = () => {
    if (newCategoryName.trim() && !categories.includes(newCategoryName.trim())) {
      setCategories([...categories, newCategoryName.trim()]);
      setActiveCategory(newCategoryName.trim());
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
      name: '', 
      price: 0, 
      category: activeCategory, 
      unit: 'kg', 
      color: 'bg-white text-[#3C2A21] border-[#D7CCC8]' 
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
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
      <div className="bg-[#FDFBF7] rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden border-2 border-[#D7CCC8] flex flex-col h-[85vh]">
        <div className="bg-[#8B4513] text-white p-5 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <Tag size={28} />
            <h2 className="text-2xl font-bold">Gestión de Catálogo y Precios</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar - Categories */}
          <div className="w-64 bg-[#EFEBE9] border-r border-[#D7CCC8] flex flex-col">
            <div className="p-4 font-bold text-[#5D4037] border-b border-[#D7CCC8] uppercase tracking-wider">
              Categorías
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {categories.map(cat => (
                <div 
                  key={cat} 
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${activeCategory === cat ? 'bg-[#8B4513] text-white shadow-md' : 'hover:bg-white text-[#3C2A21]'}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  <span className="font-bold truncate">{cat}</span>
                  <button onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat); }} className={`p-1 rounded-md transition-colors ${activeCategory === cat ? 'hover:bg-white/20 text-white' : 'hover:bg-red-50 text-red-500'}`}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            <div className="p-4 bg-white border-t border-[#D7CCC8]">
              <input 
                type="text" 
                placeholder="Nueva categoría..."
                value={newCategoryName}
                onChange={e => setNewCategoryName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddCategory()}
                className="w-full p-2 border-2 border-[#EFEBE9] rounded-lg mb-2 outline-none focus:border-[#8B4513] bg-[#FDFBF7]"
              />
              <button onClick={handleAddCategory} className="w-full py-2 bg-[#4F7942] hover:brightness-110 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-all">
                <Plus size={18} /> Agregar
              </button>
            </div>
          </div>

          {/* Right Content - Products */}
          <div className="flex-1 flex flex-col bg-white">
            <div className="p-4 border-b border-[#D7CCC8] flex justify-between items-center bg-[#FDFBF7]">
              <h3 className="text-xl font-bold text-[#3C2A21]">
                Productos: <span className="text-[#8B4513] ml-2">{activeCategory}</span>
              </h3>
              <button onClick={handleAddProduct} disabled={!activeCategory} className="px-4 py-2 bg-[#8B4513] hover:brightness-110 text-white rounded-lg font-bold flex items-center gap-2 disabled:opacity-50 transition-all">
                <Plus size={18} /> Nuevo Producto
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-[#D7CCC8] text-[#5D4037]">
                    <th className="pb-3 font-bold text-lg">Nombre</th>
                    <th className="pb-3 font-bold text-lg w-32">Precio ($)</th>
                    <th className="pb-3 font-bold text-lg w-28">Unidad</th>
                    <th className="pb-3 font-bold text-lg text-right w-32">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(product => {
                    const isEditing = editingProductId === product.id;
                    return (
                      <tr key={product.id} className="border-b border-[#EFEBE9] hover:bg-[#FDFBF7] transition-colors">
                        <td className="py-3 pr-2">
                          {isEditing ? (
                            <input autoFocus type="text" value={editForm.name || ''} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full p-2 border-2 border-[#8B4513] rounded-lg outline-none font-bold" />
                          ) : (
                            <span className="font-bold text-[#3C2A21] text-lg">{product.name}</span>
                          )}
                        </td>
                        <td className="py-3 pr-2">
                          {isEditing ? (
                            <input type="number" value={editForm.price || ''} onChange={e => setEditForm({...editForm, price: parseFloat(e.target.value) || 0})} className="w-full p-2 border-2 border-[#8B4513] rounded-lg outline-none font-bold" />
                          ) : (
                            <span className="font-black text-[#A52A2A] text-lg">${product.price.toLocaleString('es-AR')}</span>
                          )}
                        </td>
                        <td className="py-3 pr-2">
                          {isEditing ? (
                            <select value={editForm.unit || 'kg'} onChange={e => setEditForm({...editForm, unit: e.target.value as 'kg'|'unidad'})} className="w-full p-2 border-2 border-[#8B4513] rounded-lg outline-none bg-white font-bold">
                              <option value="kg">kg</option>
                              <option value="unidad">unidad</option>
                            </select>
                          ) : (
                            <span className="text-[#5D4037] font-semibold">{product.unit}</span>
                          )}
                        </td>
                        <td className="py-3 text-right">
                          {isEditing ? (
                            <button onClick={handleSaveProduct} className="p-2 bg-[#4F7942] text-white rounded-lg hover:brightness-110 shadow-sm transition-all inline-flex">
                              <Save size={20} />
                            </button>
                          ) : (
                            <div className="flex justify-end gap-2">
                              <button onClick={() => { setEditingProductId(product.id); setEditForm(product); }} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                                <Edit2 size={20} />
                              </button>
                              <button onClick={() => handleDeleteProduct(product.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                                <Trash2 size={20} />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-gray-400 font-medium text-lg">No hay productos en esta categoría</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface CashRegisterModalProps {
  onClose: () => void;
  shift: ShiftState;
  setShift: (s: ShiftState) => void;
  sales: Sale[];
}

export function CashRegisterModal({ onClose, shift, setShift, sales }: CashRegisterModalProps) {
  const [initialBalanceInput, setInitialBalanceInput] = useState('');
  
  const currentShiftSales = sales.filter(s => s.shift === shift.shift);
  
  const totalEfectivo = currentShiftSales.filter(s => s.paymentMethod === 'Efectivo').reduce((sum, s) => sum + s.total, 0);
  const totalTarjeta = currentShiftSales.filter(s => s.paymentMethod === 'Tarjeta').reduce((sum, s) => sum + s.total, 0);
  const totalTransferencia = currentShiftSales.filter(s => s.paymentMethod === 'Transferencia').reduce((sum, s) => sum + s.total, 0);
  
  const totalVentas = totalEfectivo + totalTarjeta + totalTransferencia;
  const totalEnCaja = shift.initialBalance + totalEfectivo;

  const [showConfirmClose, setShowConfirmClose] = useState(false);

  const handleOpenShift = (turno: 'Mañana' | 'Tarde') => {
    const balance = parseFloat(initialBalanceInput) || 0;
    setShift({ isOpen: true, shift: turno, initialBalance: balance });
  };

  const confirmCloseShift = () => {
    setShift({ isOpen: false, shift: null, initialBalance: 0 });
    setShowConfirmClose(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
      <div className="bg-[#FDFBF7] rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden border-2 border-[#D7CCC8] flex flex-col max-h-[85vh]">
        <div className="bg-[#8B4513] text-white p-5 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <Store size={28} />
            <h2 className="text-2xl font-bold">Control de Caja y Ventas</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6 text-[#3C2A21]">
          {!shift.isOpen ? (
            <div className="flex flex-col items-center justify-center p-10 bg-white border-2 border-[#D7CCC8] rounded-2xl">
              <Calculator size={64} className="text-[#8B4513] mb-4" />
              <h3 className="text-2xl font-bold mb-6 text-[#5D4037]">La caja está cerrada</h3>
              
              <div className="w-full max-w-md space-y-4">
                <div>
                  <label className="block text-sm font-bold text-[#5D4037] mb-2 uppercase">Fondo de Caja Inicial ($)</label>
                  <input 
                    type="number" 
                    placeholder="Ej. 15000"
                    value={initialBalanceInput}
                    onChange={(e) => setInitialBalanceInput(e.target.value)}
                    className="w-full p-4 border-2 border-[#EFEBE9] rounded-xl text-xl outline-none focus:border-[#8B4513] bg-[#FDFBF7]"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <button 
                    onClick={() => handleOpenShift('Mañana')}
                    className="py-4 bg-[#4F7942] text-white rounded-xl font-bold text-lg hover:brightness-110 shadow-sm border-b-4 border-[#2D4226]"
                  >
                    Abrir Turno Mañana
                  </button>
                  <button 
                    onClick={() => handleOpenShift('Tarde')}
                    className="py-4 bg-[#8B4513] text-white rounded-xl font-bold text-lg hover:brightness-110 shadow-sm border-b-4 border-[#5D2E0C]"
                  >
                    Abrir Turno Tarde
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-3 bg-white p-6 rounded-2xl border-2 border-[#D7CCC8] flex justify-between items-center shadow-sm">
                  <div>
                    <p className="text-sm font-bold text-[#5D4037] uppercase tracking-wider mb-1">Turno Activo</p>
                    <div className="flex items-center gap-2">
                      <Clock className="text-[#8B4513]" />
                      <span className="text-2xl font-black text-[#3C2A21]">{shift.shift}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[#5D4037] uppercase tracking-wider mb-1">Total Físico en Caja</p>
                    <p className="text-3xl font-black text-[#4F7942]">${totalEnCaja.toLocaleString('es-AR')}</p>
                    <p className="text-sm text-gray-500 font-medium">Incluye fondo inicial de ${shift.initialBalance.toLocaleString('es-AR')}</p>
                  </div>
                  {!showConfirmClose ? (
                    <button 
                      onClick={() => setShowConfirmClose(true)}
                      className="py-3 px-8 bg-[#A52A2A] text-white rounded-xl font-bold text-lg hover:brightness-110 shadow-sm border-b-4 border-[#6E1A1A]"
                    >
                      CERRAR TURNO
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setShowConfirmClose(false)}
                        className="py-3 px-4 bg-gray-500 text-white rounded-xl font-bold hover:brightness-110 shadow-sm border-b-4 border-gray-700"
                      >
                        Cancelar
                      </button>
                      <button 
                        onClick={confirmCloseShift}
                        className="py-3 px-4 bg-red-600 text-white rounded-xl font-bold hover:brightness-110 shadow-sm border-b-4 border-red-800"
                      >
                        Sí, Cerrar
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-[#FDFBF7] p-4 rounded-xl border border-[#D7CCC8]">
                  <p className="text-sm font-bold text-gray-500 uppercase">Total Efectivo</p>
                  <p className="text-2xl font-bold text-[#3C2A21]">${totalEfectivo.toLocaleString('es-AR')}</p>
                </div>
                <div className="bg-[#FDFBF7] p-4 rounded-xl border border-[#D7CCC8]">
                  <p className="text-sm font-bold text-gray-500 uppercase">Total Tarjeta</p>
                  <p className="text-2xl font-bold text-[#3C2A21]">${totalTarjeta.toLocaleString('es-AR')}</p>
                </div>
                <div className="bg-[#FDFBF7] p-4 rounded-xl border border-[#D7CCC8]">
                  <p className="text-sm font-bold text-gray-500 uppercase">Total Transferencia</p>
                  <p className="text-2xl font-bold text-[#3C2A21]">${totalTransferencia.toLocaleString('es-AR')}</p>
                </div>
              </div>

              <div className="flex-1 bg-white rounded-2xl border-2 border-[#D7CCC8] overflow-hidden flex flex-col min-h-[300px]">
                <div className="p-4 bg-[#EFEBE9] border-b border-[#D7CCC8] font-bold text-[#5D4037]">
                  Historial de Ventas ({currentShiftSales.length})
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                  {currentShiftSales.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-gray-400 font-medium">
                      No hay ventas registradas en este turno.
                    </div>
                  ) : (
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b-2 border-[#EFEBE9] text-[#5D4037] text-sm">
                          <th className="pb-2">Hora</th>
                          <th className="pb-2">Detalle</th>
                          <th className="pb-2">Pago</th>
                          <th className="pb-2 text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentShiftSales.map((s, i) => (
                          <tr key={s.id} className="border-b border-[#EFEBE9] hover:bg-[#FDFBF7]">
                            <td className="py-3 text-sm font-medium">{s.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                            <td className="py-3 text-sm">
                              {s.items.map(item => `${item.product.name} (${item.quantity}${item.product.unit})`).join(', ')}
                            </td>
                            <td className="py-3 text-sm font-semibold text-[#8B4513]">{s.paymentMethod} {s.invoice && '(Fact.)'}</td>
                            <td className="py-3 text-right font-bold text-[#A52A2A]">${s.total.toLocaleString('es-AR')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
