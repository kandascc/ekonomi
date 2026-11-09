import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Sparkles, ArrowRight, MessageSquareText, HelpCircle, Receipt } from 'lucide-react';
import { CartItem, StudentReflection } from '../types';
import { formatRupiah } from '../utils/formatters';
import { REFLECTION_OPTIONS } from '../data/defaultProducts';
import { soundFX } from '../utils/audioEffects';

interface CheckoutSuccessProps {
  orderId: string;
  cart: CartItem[];
  totalSpent: number;
  startingBalance: number;
  remainingBalance: number;
  onProceedToConcept: (reflection: StudentReflection) => void;
}

export const CheckoutSuccess: React.FC<CheckoutSuccessProps> = ({
  orderId,
  cart,
  totalSpent,
  startingBalance,
  remainingBalance,
  onProceedToConcept,
}) => {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [customReason, setCustomReason] = useState<string>('');
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Fire festive celebration confetti and fanfare
    try {
      soundFX.playCheckoutSuccess();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#EE4D2D', '#FF9800', '#22C55E', '#3B82F6'],
      });
    } catch {
      // ignore if canvas-confetti is not loaded
    }
  }, []);

  const toggleReason = (reason: string) => {
    soundFX.playSelectChoice();
    setHasError(false);
    setSelectedReasons(prev =>
      prev.includes(reason) ? prev.filter(r => r !== reason) : [...prev, reason]
    );
  };

  const handleContinue = () => {
    if (selectedReasons.length === 0 && !customReason.trim()) {
      setHasError(true);
      return;
    }
    soundFX.playSelectChoice();
    onProceedToConcept({
      reasons: selectedReasons,
      customReason: customReason.trim(),
    });
  };

  const isOtherSelected = selectedReasons.includes('Alasan lainnya');

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Transaction Success Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 text-center shadow-sm relative overflow-hidden">
        {/* Background accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-[#EE4D2D] to-yellow-400" />
        
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="inline-block text-xs uppercase tracking-wider font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full mb-1">
          Transaksi Belanja Berhasil!
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Pesananmu Telah Dikonfirmasi 🎉
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
          Nomor Pesanan: <span className="font-mono font-bold text-slate-700">{orderId}</span> · Kantin Online Labstar
        </p>

        {/* Itemized purchased cards */}
        <div className="mt-6 pt-6 border-t border-slate-100 text-left">
          <div className="flex items-center gap-2 mb-3 text-slate-700 font-bold text-sm">
            <Receipt className="w-4 h-4 text-[#EE4D2D]" />
            <span>Rincian Barang yang Kamu Checkout</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {cart.map(item => (
              <div
                key={item.product.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80"
              >
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
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-800 text-xs sm:text-sm truncate">
                    {item.product.name}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {item.quantity} x {formatRupiah(item.product.price)}
                  </div>
                </div>
                <div className="font-mono font-bold text-xs sm:text-sm text-slate-900">
                  {formatRupiah(item.product.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          {/* Financial summary row */}
          <div className="bg-orange-50/60 rounded-xl p-4 border border-orange-100 grid grid-cols-3 gap-2 text-center">
            <div>
              <span className="text-[10px] sm:text-xs text-slate-500 block">Saldo Awal</span>
              <span className="font-mono text-xs sm:text-sm font-semibold text-slate-700">
                {formatRupiah(startingBalance)}
              </span>
            </div>
            <div className="border-x border-orange-200/60">
              <span className="text-[10px] sm:text-xs text-slate-500 block">Total Belanja</span>
              <span className="font-mono text-xs sm:text-sm font-extrabold text-[#EE4D2D]">
                {formatRupiah(totalSpent)}
              </span>
            </div>
            <div>
              <span className="text-[10px] sm:text-xs text-slate-500 block">Sisa Saldo</span>
              <span className="font-mono text-xs sm:text-sm font-bold text-emerald-600">
                {formatRupiah(remainingBalance)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Reflection Section (Crucial Pedagogical Bridge!) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#EE4D2D] flex items-center justify-center shrink-0">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-[#EE4D2D] uppercase tracking-wider block">
              Refleksi Pengambilan Keputusan
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
              Kenapa kamu memilih barang-barang tersebut?
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pilih satu atau beberapa alasan yang paling menggambarkan pertimbanganmu saat berbelanja tadi.
            </p>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-2.5 mt-4">
          {REFLECTION_OPTIONS.map(reason => {
            const isChecked = selectedReasons.includes(reason);
            return (
              <label
                key={reason}
                onClick={() => toggleReason(reason)}
                className={`flex items-center gap-3 p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                  isChecked
                    ? 'bg-orange-50/80 border-[#EE4D2D] text-slate-900 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => {}} // handled by label onClick
                  className="w-4 h-4 rounded text-[#EE4D2D] accent-[#EE4D2D] focus:ring-[#EE4D2D]"
                />
                <span className="flex-1">{reason}</span>
              </label>
            );
          })}
        </div>

        {/* Custom Reason Textarea if "Alasan lainnya" is selected or user wants to add details */}
        {isOtherSelected && (
          <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 animate-fadeIn">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
              <MessageSquareText className="w-3.5 h-3.5 text-[#EE4D2D]" />
              <span>Tuliskan alasan unikmu sendiri:</span>
            </label>
            <textarea
              rows={2}
              value={customReason}
              onChange={e => {
                setCustomReason(e.target.value);
                setHasError(false);
              }}
              placeholder="Contoh: 'Saya memilih mi instan karena sedang ingin makanan berkuah gurih, dan susunya untuk pelepas dahaga...'"
              className="w-full p-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EE4D2D]/30 focus:border-[#EE4D2D]"
            />
          </div>
        )}

        {hasError && (
          <p className="text-rose-600 text-xs font-semibold mt-3">
            ⚠️ Silakan pilih minimal satu alasan atau ketik alasanmu sebelum melanjutkan.
          </p>
        )}

        {/* Submission CTA */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400 hidden sm:inline">
            Langkah 2 dari 5 · Teori Perilaku Konsumen
          </span>
          <button
            onClick={handleContinue}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#EE4D2D] hover:bg-[#D93F20] active:scale-95 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ml-auto"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>Kirim Refleksi & Buka Rahasia Belanja</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
