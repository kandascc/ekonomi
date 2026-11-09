import React from 'react';
import { Sparkles, ArrowRight, BrainCircuit, CheckCircle, Scale, Lightbulb, ShoppingBag } from 'lucide-react';
import { CartItem, StudentReflection } from '../types';
import { formatRupiah } from '../utils/formatters';
import { soundFX } from '../utils/audioEffects';

interface ConceptRevealProps {
  cart: CartItem[];
  reflection: StudentReflection;
  onProceedToCompare: () => void;
}

export const ConceptReveal: React.FC<ConceptRevealProps> = ({
  cart,
  reflection,
  onProceedToCompare,
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Mind-Blowing Visual Header */}
      <div className="bg-gradient-to-br from-amber-500 via-[#EE4D2D] to-red-600 rounded-3xl p-6 sm:p-10 text-white shadow-lg text-center relative overflow-hidden">
        {/* Background particle glows */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-yellow-300/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-orange-950/20 rounded-full blur-2xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold text-yellow-100 uppercase tracking-wider mb-3">
          <BrainCircuit className="w-4 h-4 text-yellow-300" />
          <span>Fase 3 · Pengungkapan Konsep Teori Ekonomi</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight max-w-2xl mx-auto">
          Ternyata, Kamu Baru Saja Mempraktikkan Pendekatan Ordinal! 🤯
        </h1>

        <p className="mt-4 text-sm sm:text-base text-orange-100 max-w-2xl mx-auto leading-relaxed">
          Saat berbelanja tadi, kamu memilih barang yang lebih kamu sukai dibandingkan barang lainnya. Kamu juga menentukan kombinasi barang yang menurutmu paling sesuai dengan preferensimu.
        </p>

        <div className="mt-4 inline-block bg-black/20 backdrop-blur-xs px-4 py-2 rounded-xl text-xs sm:text-sm text-yellow-200 font-medium">
          💡 Kamu tidak perlu mengetahui angka pasti kepuasanmu. Kamu cukup tahu mana yang lebih kamu sukai!
        </div>
      </div>

      {/* Official Definition Box */}
      <div className="bg-white rounded-2xl border-2 border-orange-200 p-6 sm:p-8 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-100 text-[#EE4D2D] flex items-center justify-center shrink-0">
            <Lightbulb className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#EE4D2D]">
              Definisi Kunci Teori Perilaku Konsumen
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
              Apa itu Pendekatan Ordinal?
            </h2>
            <div className="p-4 bg-orange-50/70 rounded-xl border border-orange-100 text-slate-800 text-sm sm:text-base leading-relaxed">
              <strong className="text-[#EE4D2D] font-bold">Pendekatan Ordinal (Ordinal Approach)</strong> adalah pendekatan teori perilaku konsumen yang menjelaskan bahwa konsumen dapat <span className="bg-yellow-200/60 px-1 py-0.5 rounded font-semibold text-slate-900">mengurutkan (ranking)</span> berbagai kombinasi barang berdasarkan tingkat preferensinya, <strong className="underline decoration-[#EE4D2D]">tanpa harus mengukur kepuasan secara absolut dengan angka</strong>.
            </div>
          </div>
        </div>
      </div>

      {/* Connection to Student's Real Cart */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-[#EE4D2D]" />
          <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
            Buktinya Ada di Keranjang Belanjamu Sendiri!
          </h3>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Lihat kembali pilihan belanja yang baru saja kamu checkout dengan anggaran Rp50.000:
        </p>

        {/* Selected items pills/cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {cart.map(item => (
            <div
              key={item.product.id}
              className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center flex flex-col items-center justify-between"
            >
              <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-200 bg-white mb-2 shadow-xs">
                {item.product.imageUrl ? (
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl flex items-center justify-center h-full">
                    {item.product.emoji}
                  </span>
                )}
              </div>
              <span className="font-bold text-xs text-slate-800 line-clamp-1">{item.product.name}</span>
              <span className="text-[11px] font-mono text-[#EE4D2D] font-semibold mt-0.5">
                {item.quantity} porsi ({formatRupiah(item.product.price * item.quantity)})
              </span>
            </div>
          ))}
        </div>

        {/* Student's Reason Recall */}
        {reflection.reasons.length > 0 && (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
              Alasan yang Kamu Pilih Saat Refleksi:
            </span>
            <ul className="space-y-1">
              {reflection.reasons.map((r, i) => (
                <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{r}</span>
                </li>
              ))}
              {reflection.customReason && (
                <li className="text-xs text-slate-700 flex items-start gap-2 italic">
                  <span className="font-bold text-[#EE4D2D]">Catatanmu:</span> "{reflection.customReason}"
                </li>
              )}
            </ul>
          </div>
        )}

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs sm:text-sm text-blue-900 leading-relaxed">
          <p>
            🧠 <strong>Insight Ekonomi:</strong> Dari ribuan kombinasi jajanan yang mungkin dibeli dengan uang Rp50.000, kamu memilih kombinasi di atas karena bagi dirimu, kombinasi ini memberikan <span className="font-bold underline decoration-blue-500">tingkat kepuasan tertinggi</span> dibanding kombinasi lainnya. Ini membuktikan bahwa manusia adalah pengambil keputusan yang rasional dalam menentukan urutan preferensinya!
          </p>
        </div>
      </div>

      {/* Difference: Kardinal vs Ordinal */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Scale className="w-5 h-5 text-[#EE4D2D]" />
          <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
            Perbedaan Kunci: Pendekatan Kardinal vs Ordinal
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
          {/* Kardinal */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700 text-sm">Pendekatan Kardinal</span>
              <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-semibold">
                Kurang Realistis
              </span>
            </div>
            <p className="text-slate-600">
              Menganggap kepuasan bisa diukur secara pasti dengan satuan angka fiktif bernama <strong className="text-slate-800">"Util"</strong>.
            </p>
            <div className="p-2 bg-white rounded border border-slate-200 text-slate-600 text-xs italic">
              Contoh: "Makan 1 mi goreng bernilai 50 util, sedangkan 1 boba bernilai 30 util."
            </div>
            <p className="text-[11px] text-slate-500">
              Kelemahan: Dalam dunia nyata, perasaan kepuasan manusia tidak bisa ditakar dengan meteran atau timbangan angka pasti.
            </p>
          </div>

          {/* Ordinal */}
          <div className="p-4 rounded-xl border-2 border-emerald-300 bg-emerald-50/50 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-900 text-sm">Pendekatan Ordinal</span>
              <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded font-semibold">
                Praktek Nyata Kamu!
              </span>
            </div>
            <p className="text-emerald-900">
              Kepuasan <strong className="text-emerald-950">tidak dapat diukur dengan angka</strong>, melainkan hanya diurutkan (ranking) berdasarkan urutan kesukaan.
            </p>
            <div className="p-2 bg-white rounded border border-emerald-200 text-emerald-900 text-xs font-medium">
              Contoh: "Saya lebih menyukai Paket Mi + Susu (A) dibandingkan Roti + Boba (B), atau menganggap keduanya setara."
            </div>
            <p className="text-[11px] text-emerald-800">
              Keunggulan: Jauh lebih logis dan nyata, persis seperti pertimbangan yang kamu buat saat checkout tadi!
            </p>
          </div>
        </div>
      </div>

      {/* Next Step CTA */}
      <div className="flex justify-end pt-2">
        <button
          onClick={() => {
            soundFX.playSelectChoice();
            onProceedToCompare();
          }}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#EE4D2D] hover:bg-[#D93F20] active:scale-95 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
        >
          <span>Lanjut ke Fase 4: Bandingkan 3 Pilihan Keranjang</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
