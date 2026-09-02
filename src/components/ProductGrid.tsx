import React, { useState } from 'react';
import { Search, Beef, Sparkles } from 'lucide-react';
import { Product, Category } from '../types';

interface ProductGridProps {
  products: Product[];
  categories: Category[];
  onProductClick: (product: Product) => void;
}

export function ProductGrid({ products, categories, onProductClick }: ProductGridProps) {
  const [activeCategory, setActiveCategory] = useState<Category>(categories[0] || '');
  const [searchQuery, setSearchQuery] = useState('');

  // Asegurar que si borran la categoría activa, cambie a la primera disponible
  if (categories.length > 0 && !categories.includes(activeCategory)) {
    setActiveCategory(categories[0]);
  }

  const filteredProducts = products.filter(p => {
    const matchesCategory = searchQuery ? true : p.category === activeCategory;
    const matchesSearch = searchQuery 
      ? p.name.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="h-full flex flex-col gap-2 overflow-hidden">
      {/* Search Bar */}
      <div className="relative shrink-0">
        <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B4513]" />
        <input
          type="text"
          placeholder="Buscar corte o producto..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-[#D7CCC8] rounded-2xl text-sm font-semibold text-[#3C2A21] placeholder-gray-400 outline-none focus:border-[#8B4513] shadow-xs transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500 bg-[#EFEBE9] px-2 py-0.5 rounded-full"
          >
            Limpiar
          </button>
        )}
      </div>

      {/* Category Pills (Hidden if actively searching across everything) */}
      {!searchQuery && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none shrink-0">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wide transition-all shrink-0 active:scale-95 shadow-xs ${
                activeCategory === category
                  ? 'bg-[#A52A2A] text-white border-b-3 border-[#6E1A1A] shadow-sm'
                  : 'bg-white border border-[#D7CCC8] text-[#5D4037] hover:bg-[#EFEBE9]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Products Grid */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-0.5 pb-24 sm:pb-8">
        {filteredProducts.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-center text-gray-400 p-4">
            <Beef size={40} className="text-[#D7CCC8] mb-2" />
            <p className="text-sm font-bold text-[#5D4037]">No se encontraron productos</p>
            <p className="text-xs text-gray-400">Pruebe con otra búsqueda o categoría</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => onProductClick(product)}
                className="bg-white p-3.5 min-h-[105px] rounded-2xl border-2 border-[#D7CCC8] hover:border-[#8B4513] active:border-[#8B4513] active:scale-95 active:bg-[#FDFBF7] flex flex-col items-center justify-between text-center cursor-pointer shadow-xs transition-all relative overflow-hidden group"
              >
                <div className="w-full">
                  <span className="text-[10px] font-bold text-[#8B4513]/70 uppercase tracking-wider block mb-0.5">
                    {product.category}
                  </span>
                  <p className="font-extrabold text-sm sm:text-base text-[#3C2A21] leading-tight line-clamp-2">
                    {product.name}
                  </p>
                </div>
                <div className="mt-2 w-full pt-1.5 border-t border-[#EFEBE9] flex items-baseline justify-center gap-1">
                  <span className="text-sm sm:text-base font-black text-[#A52A2A]">
                    ${product.price.toLocaleString('es-AR')}
                  </span>
                  <span className="text-[11px] font-bold text-gray-500">
                    /{product.unit}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
