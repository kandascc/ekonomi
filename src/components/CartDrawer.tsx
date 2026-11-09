import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, AlertTriangle } from 'lucide-react';
import { CartItem } from '../types';
import { formatRupiah } from '../utils/formatters';
import { soundFX } from '../utils/audioEffects';

interface CartDrawerProps {
  isOpen: boolean;
  cart: CartItem[];
  startingBalance: number;
  totalSpent: number;
  remainingBalance: number;
  onClose: () => void;
  onAddToCart: (product: CartItem['product']) => void;
  onRemoveFromCart: (productId: string) => void;
  onClearCart: () => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  cart,
  startingBalance,
  totalSpent,
  remainingBalance,
  onClose,
  onAddToCart,
  onRemoveFromCart,
  onClearCart,
  onCheckout,
}) => {
  if (!isOpen) return null;

  const isOverBudget = remainingBalance < 0;
  const isCartEmpty = cart.length === 0;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 bg-[#EE4D2D] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              <h2 className="font-bold text-base">Keranjang Belanja</h2>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-medium">
                {cart.reduce((sum, item) => sum + item.quantity, 0)} item
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
              aria-label="Tutup keranjang"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Saldo Status Banner */}
          <div className="bg-orange-50/80 border-b border-orange-100 p-3 text-xs">
            <div className="flex items-center justify-between text-slate-600 mb-1">
              <span>Saldo Virtual Kamu:</span>
              <span className="font-bold font-mono text-slate-800">{formatRupiah(startingBalance)}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Sisa Saldo:</span>
              <span
                className={`font-bold font-mono ${
                  isOverBudget ? 'text-rose-600 animate-pulse' : 'text-emerald-700'
                }`}
              >
                {formatRupiah(remainingBalance)}
              </span>
            </div>
            {isOverBudget && (
              <div className="mt-2 flex items-start gap-1.5 p-2 bg-rose-50 border border-rose-200 rounded text-rose-700 text-[11px] leading-tight">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                <span>Total belanja melebihi saldo virtualmu! Kurangi jumlah barang untuk bisa checkout.</span>
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100">
            {isCartEmpty ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <ShoppingBag className="w-16 h-16 text-slate-200 stroke-1 mb-3" />
                <p className="font-semibold text-slate-600 text-sm">Keranjang belanjamu masih kosong</p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  Yuk pilih jajanan, camilan, atau minuman favoritmu di katalog!
                </p>
                <button
                  onClick={onClose}
                  className="mt-4 px-4 py-2 bg-[#EE4D2D] hover:bg-[#D93F20] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Mulai Belanja
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map(item => (
                  <div key={item.product.id} className="pt-3 first:pt-0 flex items-center gap-3">
                    {/* Realistic Product Image */}
                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                      {item.product.imageUrl ? (
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div
                          className={`w-full h-full bg-gradient-to-br ${item.product.imageBg} flex items-center justify-center text-2xl`}
                        >
                          {item.product.emoji}
                        </div>
                      )}
                    </div>

                    {/* Name & price */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-800 text-xs sm:text-sm truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-slate-500 text-xs font-mono">
                        {formatRupiah(item.product.price)}
                      </p>
                    </div>

                    {/* Quantity stepper with sound */}
                    <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                      <button
                        onClick={() => {
                          soundFX.playQuantityStep(false);
                          onRemoveFromCart(item.product.id);
                        }}
                        className="w-6 h-6 rounded bg-white hover:bg-slate-200 text-slate-700 flex items-center justify-center text-xs font-bold cursor-pointer"
                        title="Kurangi"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold font-mono text-slate-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => {
                          soundFX.playQuantityStep(true);
                          onAddToCart(item.product);
                        }}
                        className="w-6 h-6 rounded bg-[#EE4D2D] hover:bg-[#D93F20] text-white flex items-center justify-center text-xs font-bold cursor-pointer"
                        title="Tambah"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right w-16">
                      <span className="text-xs font-bold font-mono text-[#EE4D2D] block">
                        {formatRupiah(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Checkout Summary */}
          {!isCartEmpty && (
            <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal Belanja</span>
                  <span className="font-mono font-semibold text-slate-900">{formatRupiah(totalSpent)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Ongkir Virtual</span>
                  <span className="font-semibold text-emerald-600">GRATIS</span>
                </div>
                <div className="h-px bg-slate-200 my-1" />
                <div className="flex justify-between text-sm font-bold text-slate-900">
                  <span>Total Pengeluaran</span>
                  <span className="font-mono text-[#EE4D2D] text-base">{formatRupiah(totalSpent)}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  onClick={onClearCart}
                  className="px-3 py-2 border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                  title="Kosongkan Keranjang"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
                <button
                  onClick={() => {
                    soundFX.playCheckoutSuccess();
                    onClose();
                    onCheckout();
                  }}
                  disabled={isOverBudget || isCartEmpty}
                  className={`flex-1 py-2.5 px-4 rounded-lg font-bold text-xs sm:text-sm text-white flex items-center justify-center gap-2 transition-all shadow-md ${
                    isOverBudget || isCartEmpty
                      ? 'bg-slate-300 cursor-not-allowed text-slate-500 shadow-none'
                      : 'bg-[#EE4D2D] hover:bg-[#D93F20] active:scale-98 cursor-pointer'
                  }`}
                >
                  <span>Lanjut Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
