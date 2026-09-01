import React, { useState } from 'react';
import { Product, Category } from '../types';

interface ProductGridProps {
  products: Product[];
  categories: Category[];
  onProductClick: (product: Product) => void;
}

export function ProductGrid({ products, categories, onProductClick }: ProductGridProps) {
  const [activeCategory, setActiveCategory] = useState<Category>(categories[0] || '');

  // Asegurar que si borran la categoría activa, cambie a la primera disponible
  if (categories.length > 0 && !categories.includes(activeCategory)) {
    setActiveCategory(categories[0]);
  }

  const filteredProducts = products.filter(p => p.category === activeCategory);

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex gap-2 mb-2 overflow-x-auto pb-2 scrollbar-hide shrink-0">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-6 py-3 rounded-xl font-bold uppercase transition-colors shadow-sm ${
              activeCategory === category 
                ? 'bg-[#A52A2A] text-white border-b-4 border-[#6E1A1A]' 
                : 'bg-white border border-[#D7CCC8] text-[#3C2A21] hover:bg-[#EFEBE9]'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 flex-1 overflow-y-auto pr-2 pb-16">
        {filteredProducts.map(product => (
          <button
            key={product.id}
            onClick={() => onProductClick(product)}
            className="bg-white p-4 h-36 rounded-2xl border-2 border-[#D7CCC8] flex flex-col items-center justify-center text-center cursor-pointer hover:border-[#8B4513] transition-colors shadow-sm active:scale-95"
          >
            <p className="font-bold text-lg uppercase leading-tight line-clamp-2">{product.name}</p>
            <p className="text-[#8B4513] font-black mt-2">
              ${product.price.toLocaleString('es-AR')} <span className="text-sm font-bold">/{product.unit}</span>
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
