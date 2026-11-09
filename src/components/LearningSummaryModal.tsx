import React, { useState } from 'react';
import { Award, CheckCircle2, RotateCcw, Copy, Check, Share2, Sparkles, X } from 'lucide-react';
import { CartItem, StudentReflection } from '../types';
import { formatRupiah } from '../utils/formatters';
import { soundFX } from '../utils/audioEffects';

interface LearningSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  totalSpent: number;
  reflection: StudentReflection;
  bundleChoice?: 'basket_a' | 'basket_b' | 'indifferent';
  onRestartSimulation: () => void;
}

export const LearningSummaryModal: React.FC<LearningSummaryModalProps> = ({
  isOpen,
  onClose,
  cart,
  totalSpent,
  reflection,
  bundleChoice,
  onRestartSimulation,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const bundleChoiceLabel = 
    bundleChoice === 'basket_a' 
      ? 'Lebih memilih Keranjang A (2 Burger + 3 Boba)'
      : bundleChoice === 'basket_b'
      ? 'Lebih memilih Keranjang B (3 Burger + 2 Boba)'
      : 'Menganggap keduanya sama-sama disukai (Indiferen)';

  const summaryReportText = `
[LAPORAN PEMBELAJARAN EKONOMI: PENDEKATAN ORDINAL]
Labstar Economics Market - Labstar Economics Teacher & SMA Labschool Bintaro

1. Pengalaman Belanja:
- Total Belanja: ${formatRupiah(totalSpent)}
- Barang yang Dipilih: ${cart.map(c => `${c.product.name} (${c.quantity}x)`).join(', ')}

2. Refleksi Pengambilan Keputusan:
- Alasan: ${reflection.reasons.join('; ')}
${reflection.customReason ? `- Catatan Tambahan: "${reflection.customReason}"` : ''}

3. Perbandingan Bundel (Eksperimen Konsumen):
- Pilihan: ${bundleChoiceLabel}

4. Pemahaman Konsep:
- Memahami bahwa pendekatan ordinal mengurutkan preferensi konsumen tanpa mengukur kepuasan secara absolut.
- Memahami representasi kurva indiferensi dan bahwa kurva yang lebih jauh dari origin (U₂) lebih disukai (Asumsi Monotonisitas).
`.trim();

  const handleCopyReport = () => {
    soundFX.playSelectChoice();
    navigator.clipboard.writeText(summaryReportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8">
        {/* Certificate Header with Labstar & Labschool branding */}
        <div className="bg-gradient-to-r from-[#EE4D2D] via-[#FF6A3D] to-orange-600 p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center justify-center gap-3 mb-2">
            <img
              src="/assets/aistudio/logo-labstar_6de4b5a9.png"
              alt="Labstar"
              className="h-10 w-10 object-contain rounded-lg bg-white p-0.5 shadow-sm"
            />
            <img
              src="/assets/aistudio/logo-SMA-1024x360_c7c9ce59.png"
              alt="SMA Labschool Bintaro"
              className="h-7 object-contain bg-white px-2 py-0.5 rounded shadow-sm"
            />
          </div>

          <div className="inline-flex items-center gap-1.5 bg-yellow-400 text-slate-900 text-xs font-black px-3 py-0.5 rounded-full uppercase tracking-wider mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>Sertifikat Capaian Eksplorasi</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            LABSTAR ECONOMICS MARKET
          </h2>
          <p className="text-xs text-orange-100 font-medium">
            Ordinal Shopping & Consumer Behavior Mastery
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Status highlight */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3 text-emerald-900">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
            <div>
              <h4 className="font-bold text-sm">Pembelajaran Berhasil Dituntaskan!</h4>
              <p className="text-xs text-emerald-800 mt-0.5">
                Kamu telah membuktikan pemahaman Pendekatan Ordinal melalui praktik nyata dari belanja hingga kurva indiferensi.
              </p>
            </div>
          </div>

          {/* Student Journey Recap */}
          <div className="space-y-3 text-xs text-slate-700">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 text-xs uppercase tracking-wider block text-[#EE4D2D]">
                1. Keranjang Belanjamu:
              </span>
              <p>
                {cart.map(c => `${c.product.name} (${c.quantity}x)`).join(', ')} · Total: <strong>{formatRupiah(totalSpent)}</strong>
              </p>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 text-xs uppercase tracking-wider block text-[#EE4D2D]">
                2. Refleksi Mengapa Memilih:
              </span>
              <ul className="list-disc pl-4 space-y-0.5">
                {reflection.reasons.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
                {reflection.customReason && (
                  <li className="italic">"{reflection.customReason}"</li>
                )}
              </ul>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 text-xs uppercase tracking-wider block text-[#EE4D2D]">
                3. Pilihan Bundel Konsumsi:
              </span>
              <p>{bundleChoiceLabel}</p>
            </div>

            <div className="bg-orange-50/60 p-3.5 rounded-xl border border-orange-200 space-y-1 text-slate-800">
              <span className="font-bold text-orange-950 text-xs uppercase tracking-wider block">
                4. Inti Teori yang Dipelajari:
              </span>
              <p className="leading-relaxed">
                Kepuasan konsumen bersifat ordinal (diurutkan berdasarkan preferensi tanpa angka utilitas). Kurva indiferensi menghubungkan kombinasi yang memberikan kepuasan sama, dan kurva yang lebih tinggi ($U_2$) lebih disukai karena lebih banyak barang (*monotonicity*).
              </p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handleCopyReport}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Tersalin ke Clipboard!' : 'Salin Laporan untuk Guru'}</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onRestartSimulation();
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#EE4D2D] hover:bg-[#D93F20] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Mulai Simulasi Belanja Baru</span>
          </button>
        </div>
      </div>
    </div>
  );
};
