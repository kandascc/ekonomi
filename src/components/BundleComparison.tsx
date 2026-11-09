import React, { useState } from 'react';
import { Sparkles, ArrowRight, Check, Scale, ThumbsUp, Info } from 'lucide-react';
import { soundFX } from '../utils/audioEffects';

interface BundleComparisonProps {
  onProceedToCurve: (choice: 'basket_a' | 'basket_b' | 'indifferent') => void;
  savedChoice?: 'basket_a' | 'basket_b' | 'indifferent';
}

export const BundleComparison: React.FC<BundleComparisonProps> = ({
  onProceedToCurve,
  savedChoice,
}) => {
  const [selectedChoice, setSelectedChoice] = useState<'basket_a' | 'basket_b' | 'indifferent' | null>(
    savedChoice || null
  );

  const handleSelect = (choice: 'basket_a' | 'basket_b' | 'indifferent') => {
    setSelectedChoice(choice);
    if (choice === 'indifferent') {
      soundFX.playIndifferenceChord();
    } else {
      soundFX.playSelectChoice();
    }
  };

  const handleContinue = () => {
    if (selectedChoice) {
      soundFX.playSelectChoice();
      onProceedToCurve(selectedChoice);
    }
  };

  const burgerImg = '/src/assets/images/food_burger_gourmet_1794196388175.jpg';
  const bobaImg = '/src/assets/images/food_boba_milktea_1794196389423.jpg';

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm text-center md:text-left">
        <div className="inline-flex items-center gap-2 bg-orange-50 text-[#EE4D2D] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
          <Scale className="w-3.5 h-3.5" />
          <span>Fase 4 · Eksperimen Perbandingan Preferensi Konsumen</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Bandingkan Tiga Pilihan Kombinasi Belanja
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
          Jika kamu ditawari paket konsumsi di bawah ini secara cuma-cuma dengan kondisi yang sesuai, mana opsi yang paling sesuai dengan seleramu?
        </p>
      </div>

      {/* The 3 Equal Cards in a Balanced 3-Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
        {/* PILIHAN 1: KERANJANG A */}
        <div
          onClick={() => handleSelect('basket_a')}
          className={`relative rounded-2xl p-5 border-2 transition-all cursor-pointer bg-white flex flex-col justify-between ${
            selectedChoice === 'basket_a'
              ? 'border-[#EE4D2D] shadow-xl ring-2 ring-[#EE4D2D]/20 scale-[1.02]'
              : 'border-slate-200 hover:border-orange-300 hover:shadow-md'
          }`}
        >
          {selectedChoice === 'basket_a' && (
            <div className="absolute top-3 right-3 bg-[#EE4D2D] text-white p-1 rounded-full shadow-md z-10">
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
          )}

          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-8 h-8 rounded-xl bg-orange-100 text-[#EE4D2D] flex items-center justify-center font-extrabold text-sm shadow-xs">
                A
              </span>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Keranjang A</h3>
                <span className="text-[11px] text-slate-500 font-medium">Fokus Lebih Banyak Minuman</span>
              </div>
            </div>

            {/* Realistic Product Photography Showcase */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-square group">
                <img
                  src={burgerImg}
                  alt="2 Burger Daging Keju"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-1.5 left-1.5 right-1.5 bg-black/75 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded text-center">
                  2x Burger Sapi
                </div>
              </div>
              <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-square group">
                <img
                  src={bobaImg}
                  alt="3 Boba Brown Sugar"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-1.5 left-1.5 right-1.5 bg-black/75 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded text-center">
                  3x Boba Milk Tea
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 bg-orange-50/60 p-2.5 rounded-xl border border-orange-100 leading-relaxed text-center">
              "Lebih mengutamakan kesegaran dahaga dengan 3 porsi boba dan 2 burger."
            </p>
          </div>

          <button
            type="button"
            className={`w-full mt-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              selectedChoice === 'basket_a'
                ? 'bg-[#EE4D2D] text-white shadow-md'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {selectedChoice === 'basket_a' ? '✓ Dipilih: Keranjang A' : 'Pilih Keranjang A'}
          </button>
        </div>

        {/* PILIHAN 2: KERANJANG B */}
        <div
          onClick={() => handleSelect('basket_b')}
          className={`relative rounded-2xl p-5 border-2 transition-all cursor-pointer bg-white flex flex-col justify-between ${
            selectedChoice === 'basket_b'
              ? 'border-[#EE4D2D] shadow-xl ring-2 ring-[#EE4D2D]/20 scale-[1.02]'
              : 'border-slate-200 hover:border-orange-300 hover:shadow-md'
          }`}
        >
          {selectedChoice === 'basket_b' && (
            <div className="absolute top-3 right-3 bg-[#EE4D2D] text-white p-1 rounded-full shadow-md z-10">
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
          )}

          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-8 h-8 rounded-xl bg-orange-100 text-[#EE4D2D] flex items-center justify-center font-extrabold text-sm shadow-xs">
                B
              </span>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Keranjang B</h3>
                <span className="text-[11px] text-slate-500 font-medium">Fokus Lebih Banyak Makanan</span>
              </div>
            </div>

            {/* Realistic Product Photography Showcase */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-square group">
                <img
                  src={burgerImg}
                  alt="3 Burger Daging Keju"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-1.5 left-1.5 right-1.5 bg-black/75 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded text-center">
                  3x Burger Sapi
                </div>
              </div>
              <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-square group">
                <img
                  src={bobaImg}
                  alt="2 Boba Brown Sugar"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-1.5 left-1.5 right-1.5 bg-black/75 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded text-center">
                  2x Boba Milk Tea
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 bg-orange-50/60 p-2.5 rounded-xl border border-orange-100 leading-relaxed text-center">
              "Lebih mengutamakan rasa kenyang dengan 3 porsi burger dan 2 boba."
            </p>
          </div>

          <button
            type="button"
            className={`w-full mt-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              selectedChoice === 'basket_b'
                ? 'bg-[#EE4D2D] text-white shadow-md'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {selectedChoice === 'basket_b' ? '✓ Dipilih: Keranjang B' : 'Pilih Keranjang B'}
          </button>
        </div>

        {/* PILIHAN 3: SAMA-SAMA DISUKAI (INDIFEREN) - EQUAL SETARA */}
        <div
          onClick={() => handleSelect('indifferent')}
          className={`relative rounded-2xl p-5 border-2 transition-all cursor-pointer bg-white flex flex-col justify-between ${
            selectedChoice === 'indifferent'
              ? 'border-[#EE4D2D] shadow-xl ring-2 ring-[#EE4D2D]/20 scale-[1.02]'
              : 'border-slate-200 hover:border-orange-300 hover:shadow-md'
          }`}
        >
          {selectedChoice === 'indifferent' && (
            <div className="absolute top-3 right-3 bg-[#EE4D2D] text-white p-1 rounded-full shadow-md z-10">
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
          )}

          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-extrabold text-sm shadow-xs">
                ⚖️
              </span>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Sama Disukai (Indiferen)</h3>
                <span className="text-[11px] text-slate-500 font-medium">Kepuasan Setara (A ~ B)</span>
              </div>
            </div>

            {/* Realistic Dual Photography Balancing Visual */}
            <div className="grid grid-cols-2 gap-2 mb-3 relative">
              <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-square group">
                <img
                  src={burgerImg}
                  alt="Burger Sapi"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-blue-900/20" />
                <div className="absolute bottom-1.5 left-1.5 right-1.5 bg-blue-950/80 backdrop-blur-xs text-white text-[11px] font-bold px-1.5 py-0.5 rounded text-center">
                  Makanan
                </div>
              </div>
              <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-square group">
                <img
                  src={bobaImg}
                  alt="Boba Milk Tea"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-blue-900/20" />
                <div className="absolute bottom-1.5 left-1.5 right-1.5 bg-blue-950/80 backdrop-blur-xs text-white text-[11px] font-bold px-1.5 py-0.5 rounded text-center">
                  Minuman
                </div>
              </div>
              {/* Balance scale badge badge overlay */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-blue-700 font-black text-xs px-2 py-0.5 rounded-full shadow-md border border-blue-200">
                A = B
              </div>
            </div>

            <p className="text-xs text-slate-600 bg-blue-50/70 p-2.5 rounded-xl border border-blue-100 leading-relaxed text-center">
              "Bagi saya, 2 burger + 3 boba setara nikmatnya dengan 3 burger + 2 boba. Dikasih yang mana saja sama-sama puas!"
            </p>
          </div>

          <button
            type="button"
            className={`w-full mt-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              selectedChoice === 'indifferent'
                ? 'bg-[#EE4D2D] text-white shadow-md'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {selectedChoice === 'indifferent' ? '✓ Dipilih: Sama Disukai (Indiferen)' : 'Pilih Sama Puas (Indiferen)'}
          </button>
        </div>
      </div>

      {/* Dynamic Feedback Explanation after choosing */}
      {selectedChoice && (
        <div className="bg-white rounded-2xl border-2 border-emerald-300 p-6 shadow-sm space-y-3 animate-fadeIn">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm sm:text-base">
            <ThumbsUp className="w-5 h-5 text-emerald-600" />
            <span>Pilihanmu Sangat Valid & Menggambarkan Preferensi Konsumen!</span>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {selectedChoice === 'basket_a' && (
              <>
                Kamu lebih memilih <strong>Keranjang A (2 Burger + 3 Boba)</strong> dibanding Keranjang B. Ini artinya dalam preferensi ordinalmu: <code className="bg-orange-100 text-[#EE4D2D] px-1.5 py-0.5 rounded font-mono font-bold">Keranjang A ≻ Keranjang B</code>.
              </>
            )}
            {selectedChoice === 'basket_b' && (
              <>
                Kamu lebih memilih <strong>Keranjang B (3 Burger + 2 Boba)</strong> dibanding Keranjang A. Ini artinya dalam preferensi ordinalmu: <code className="bg-orange-100 text-[#EE4D2D] px-1.5 py-0.5 rounded font-mono font-bold">Keranjang B ≻ Keranjang A</code>.
              </>
            )}
            {selectedChoice === 'indifferent' && (
              <>
                Kamu menganggap <strong>kedua keranjang sama-sama disukai</strong>. Dalam notasi ekonomi, kondisi ini ditulis sebagai <code className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono font-bold">Keranjang A ~ Keranjang B</code> (konsumen berada dalam kondisi <em>Indifference</em>).
              </>
            )}
          </p>

          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Poin Kunci Teori Ekonomi Labstar:</strong> Preferensi setiap individu bersifat unik dan subjektif. Dalam model ekonomi, berbagai kombinasi barang yang dianggap <em>sama-sama disukai</em> (seperti pilihan Indiferen) dihubungkan membentuk satu kurva bernama: <strong>KURVA INDIFERENSI (Indifference Curve)</strong>!
            </div>
          </div>
        </div>
      )}

      {/* CTA Button */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs text-slate-400">
          Langkah 4 dari 5 · Menuju Visualisasi Kurva Indiferensi
        </span>
        <button
          onClick={handleContinue}
          disabled={!selectedChoice}
          className={`px-6 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md ${
            !selectedChoice
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
              : 'bg-[#EE4D2D] hover:bg-[#D93F20] active:scale-95 text-white cursor-pointer'
          }`}
        >
          <span>Visualisasikan Kurva Indiferensi</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
