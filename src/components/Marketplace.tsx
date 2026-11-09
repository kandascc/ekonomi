import React, { useState, useMemo } from 'react';
import { Search, Plus, Minus, Check, Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';
import { Product, ProductCategory, CartItem } from '../types';
import { formatRupiah } from '../utils/formatters';
import { soundFX } from '../utils/audioEffects';

interface MarketplaceProps {
  products: Product[];
  cart: CartItem[];
  startingBalance: number;
  remainingBalance: number;
  totalSpent: number;
  onAddToCart: (product: Product) => void;
  onRemoveFromCart: (productId: string) => void;
  onOpenCart: () => void;
  onCheckout: () => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({
  products,
  cart,
  startingBalance,
  remainingBalance,
  totalSpent,
  onAddToCart,
  onRemoveFromCart,
  onOpenCart,
  onCheckout,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Map product quantities in cart for fast lookup
  const cartQuantityMap = useMemo(() => {
    const map = new Map<string, number>();
    cart.forEach(item => map.set(item.product.id, item.quantity));
    return map;
  }, [cart]);

  // Total item count in cart
  const totalItemCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Filtered products by category and search
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory =
        selectedCategory === 'semua' || product.category === selectedCategory;
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const isOverBudget = remainingBalance < 0;

  return (
    <div className="pb-24">
      {/* Hero Welcome Banner (Friendly Gen-Z Marketplace Promo) */}
      <section className="bg-gradient-to-r from-[#EE4D2D] via-[#FF6A3D] to-[#F25C38] text-white py-6 px-4 shadow-sm mb-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-xs font-semibold text-orange-100">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>Kantin & Jajanan Online Labstar</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Pilih Jajanan & Makanan Favoritmu!
            </h1>
            <p className="text-xs sm:text-sm text-orange-100 max-w-xl">
              Kamu dibekali saldo virtual <strong className="text-white font-bold underline decoration-yellow-300">{formatRupiah(startingBalance)}</strong>. Bebas pilih kombinasi makanan, camilan, dan minuman yang paling kamu sukai!
            </p>
          </div>

          {/* Quick Balance Status Widget */}
          <div className="bg-white/10 backdrop-blur-md border border-white/25 rounded-xl p-3.5 text-center min-w-[240px] shadow-sm">
            <div className="text-[11px] font-medium text-orange-100 uppercase tracking-wider">
              Status Belanja Kamu
            </div>
            <div className="flex items-center justify-center gap-3 my-1">
              <div>
                <span className="text-[10px] text-orange-200 block">Total Belanja</span>
                <span className="font-mono text-base font-bold text-white">
                  {formatRupiah(totalSpent)}
                </span>
              </div>
              <div className="h-6 w-px bg-white/20" />
              <div>
                <span className="text-[10px] text-orange-200 block">Sisa Saldo</span>
                <span
                  className={`font-mono text-base font-bold ${
                    isOverBudget ? 'text-yellow-300 animate-pulse' : 'text-white'
                  }`}
                >
                  {formatRupiah(remainingBalance)}
                </span>
              </div>
            </div>
            {isOverBudget && (
              <div className="text-[11px] text-yellow-200 font-medium bg-red-900/40 rounded px-2 py-0.5 mt-1">
                ⚠️ Melebihi batas anggaran!
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Search & Filter Bar */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-3 sm:p-4 mb-6 flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {[
              { id: 'semua', label: 'Semua Produk' },
              { id: 'makanan', label: '🍜 Makanan Berat' },
              { id: 'snack', label: '🥐 Snack & Roti' },
              { id: 'minuman', label: '🧋 Minuman Segar' },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as ProductCategory)}
                className={`px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#EE4D2D] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari mi, roti, boba, kentang..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EE4D2D]/30 focus:border-[#EE4D2D] transition-colors"
            />
          </div>
        </div>

        {/* Product Catalog Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {filteredProducts.map(product => {
            const qty = cartQuantityMap.get(product.id) || 0;
            return (
              <div
                key={product.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
              >
                {/* Product Visual Container with realistic photography */}
                <div className="relative h-36 sm:h-44 bg-slate-100 overflow-hidden group">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div
                      className={`w-full h-full bg-gradient-to-br ${product.imageBg} flex items-center justify-center`}
                    >
                      <span className="text-6xl drop-shadow-md select-none">{product.emoji}</span>
                    </div>
                  )}

                  {/* Subtle Gradient Scrim at bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                  {/* Badge */}
                  {product.badge && (
                    <span className="absolute top-2 left-2 bg-amber-400 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs z-10">
                      {product.badge}
                    </span>
                  )}

                  {/* Rating / Sold count overlay */}
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[10px] text-white font-medium bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-md z-10">
                    <span>⭐ {product.rating}</span>
                    <span>{product.soldCount}+ terjual</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-1 mb-1">
                      {product.name}
                    </h3>
                    <p className="text-slate-500 text-xs line-clamp-2 mb-3 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Price & Action Button */}
                  <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-medium">Harga</span>
                      <span className="text-base sm:text-lg font-extrabold text-[#EE4D2D] font-mono">
                        {formatRupiah(product.price)}
                      </span>
                    </div>

                    {/* Stepper or Add button */}
                    {qty === 0 ? (
                      <button
                        onClick={() => {
                          soundFX.playAddToCart();
                          onAddToCart(product);
                        }}
                        className="w-full sm:w-auto px-3 py-1.5 bg-[#EE4D2D] hover:bg-[#D93F20] active:scale-95 text-white font-semibold text-xs sm:text-sm rounded-lg flex items-center justify-center gap-1 transition-all shadow-xs cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Beli</span>
                      </button>
                    ) : (
                      <div className="flex items-center justify-center sm:justify-end gap-1.5 bg-orange-50 border border-orange-200 rounded-lg p-1">
                        <button
                          onClick={() => {
                            soundFX.playQuantityStep(false);
                            onRemoveFromCart(product.id);
                          }}
                          className="w-6 h-6 rounded bg-white hover:bg-orange-100 text-[#EE4D2D] font-bold flex items-center justify-center transition-colors cursor-pointer"
                          aria-label="Kurangi jumlah"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center font-bold text-sm text-slate-900 font-mono">
                          {qty}
                        </span>
                        <button
                          onClick={() => {
                            soundFX.playQuantityStep(true);
                            onAddToCart(product);
                          }}
                          className="w-6 h-6 rounded bg-[#EE4D2D] hover:bg-[#D93F20] text-white font-bold flex items-center justify-center transition-colors cursor-pointer"
                          aria-label="Tambah jumlah"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state if search returns nothing */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200 mt-4 p-8">
            <p className="text-3xl mb-2">🔍</p>
            <h4 className="font-bold text-slate-800 text-base">Produk tidak ditemukan</h4>
            <p className="text-xs text-slate-500 mt-1">
              Coba kata kunci lain atau pilih tab kategori 'Semua Produk'.
            </p>
          </div>
        )}
      </div>

      {/* Floating Bottom Checkout Bar (Like Shopee Mobile & Desktop Sticky Bar) */}
      {totalItemCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 shadow-xl px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            {/* Summary preview */}
            <div className="flex items-center gap-3">
              <button
                onClick={onOpenCart}
                className="relative p-2 bg-orange-50 rounded-xl border border-orange-200 text-[#EE4D2D] hover:bg-orange-100 transition-colors cursor-pointer"
                aria-label="Buka Rincian Keranjang"
              >
                <ShoppingBag className="w-6 h-6" />
                <span className="absolute -top-1.5 -right-1.5 bg-[#EE4D2D] text-white text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow">
                  {totalItemCount}
                </span>
              </button>
              <div>
                <div className="text-xs text-slate-500 flex items-center gap-1">
                  <span>Total Belanja:</span>
                  <span className="font-extrabold font-mono text-slate-900 text-sm sm:text-base">
                    {formatRupiah(totalSpent)}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">
                  Sisa Saldo:{' '}
                  <span
                    className={`font-semibold font-mono ${
                      isOverBudget ? 'text-rose-600' : 'text-emerald-600'
                    }`}
                  >
                    {formatRupiah(remainingBalance)}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions: View Cart & Direct Checkout */}
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenCart}
                className="hidden sm:inline-flex px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                Rincian Keranjang
              </button>
              <button
                onClick={() => {
                  soundFX.playCheckoutSuccess();
                  onCheckout();
                }}
                disabled={isOverBudget || totalItemCount === 0}
                className={`px-5 py-2.5 rounded-lg text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-md ${
                  isOverBudget || totalItemCount === 0
                    ? 'bg-slate-300 cursor-not-allowed text-slate-500 shadow-none'
                    : 'bg-[#EE4D2D] hover:bg-[#D93F20] active:scale-95 cursor-pointer'
                }`}
              >
                <span>Checkout Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
