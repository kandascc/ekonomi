import React, { useState } from 'react';
import { ShoppingBag, Wallet, Settings, ArrowLeft, Volume2, VolumeX } from 'lucide-react';
import { formatRupiah } from '../utils/formatters';
import { LearningPhase } from '../types';
import { soundFX } from '../utils/audioEffects';

interface NavbarProps {
  currentPhase: LearningPhase;
  startingBalance: number;
  remainingBalance: number;
  cartCount: number;
  onOpenCart: () => void;
  onOpenTeacherPanel: () => void;
  onBackToShopping?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPhase,
  remainingBalance,
  cartCount,
  onOpenCart,
  onOpenTeacherPanel,
  onBackToShopping,
}) => {
  const [soundEnabled, setSoundEnabled] = useState(soundFX.enabled);
  const isOverBudget = remainingBalance < 0;

  const toggleSound = () => {
    soundFX.enabled = !soundFX.enabled;
    setSoundEnabled(soundFX.enabled);
    if (soundFX.enabled) {
      soundFX.playSelectChoice();
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#EE4D2D] text-white shadow-md">
      {/* Top micro bar for school partnership */}
      <div className="bg-[#D03E1F] text-orange-100 text-[11px] px-4 py-1 flex items-center justify-between border-b border-orange-400/20">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white tracking-wide">LABSTAR ECONOMICS</span>
            <span className="text-orange-200/70">·</span>
            <span>SMA Labschool Bintaro</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSound}
              className="flex items-center gap-1 hover:text-white transition-colors text-[11px] font-medium opacity-90 hover:opacity-100 cursor-pointer"
              title={soundEnabled ? 'Matikan Suara Efek' : 'Aktifkan Suara Efek'}
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-yellow-300" />
                  <span>Suara: Aktif</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-slate-300" />
                  <span className="text-slate-300">Suara: Mute</span>
                </>
              )}
            </button>
            <span className="text-orange-200/40">|</span>
            <button
              onClick={onOpenTeacherPanel}
              className="flex items-center gap-1.5 hover:text-white transition-colors text-[11px] font-medium opacity-90 hover:opacity-100 cursor-pointer"
              title="Buka Pengaturan Panel Guru"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Panel Guru</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main navigation row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Brand Zone: Logos & Title */}
        <div className="flex items-center gap-3">
          {currentPhase !== 'shopping' && onBackToShopping && (
            <button
              onClick={onBackToShopping}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1 text-xs font-semibold mr-1"
              title="Kembali Belanja"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Belanja Lagi</span>
            </button>
          )}

          <div className="flex items-center gap-2.5">
            {/* Labstar Falcon Logo */}
            <img
              src="/assets/aistudio/logo-labstar_6de4b5a9.png"
              alt="Labstar Economics Logo"
              className="h-10 w-10 sm:h-11 sm:w-11 object-contain rounded-lg bg-white p-0.5 shadow-sm"
            />
            {/* Labschool Logo */}
            <img
              src="/assets/aistudio/logo-SMA-1024x360_c7c9ce59.png"
              alt="SMA Labschool Bintaro"
              className="h-7 hidden md:block object-contain bg-white px-2 py-0.5 rounded shadow-sm"
            />
            <div className="leading-tight">
              <span className="text-base sm:text-lg font-extrabold tracking-tight block text-white drop-shadow-sm">
                LABSTAR MARKET
              </span>
              <span className="text-[10px] sm:text-xs text-orange-100 font-medium tracking-wide">
                Simulasi Belanja Siswa
              </span>
            </div>
          </div>
        </div>

        {/* Phase Indicator Bar for Active Learning (when progressed past shopping) */}
        {currentPhase !== 'shopping' && (
          <div className="hidden lg:flex items-center gap-1 bg-black/15 px-3 py-1 rounded-full text-xs font-medium text-orange-100">
            <span className={currentPhase === 'checkout' ? 'text-white font-bold' : ''}>1. Checkout</span>
            <span className="opacity-50">→</span>
            <span className={currentPhase === 'concept_reveal' ? 'text-white font-bold' : ''}>2. Konsep Ordinal</span>
            <span className="opacity-50">→</span>
            <span className={currentPhase === 'bundle_compare' ? 'text-white font-bold' : ''}>3. Pilihan Bundel</span>
            <span className="opacity-50">→</span>
            <span className={currentPhase === 'indifference_curve' ? 'text-white font-bold' : ''}>4. Kurva Indiferensi</span>
          </div>
        )}

        {/* Right Zone: Virtual Wallet & Cart */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Virtual Wallet Saldo */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs sm:text-sm font-semibold transition-all shadow-sm ${
              isOverBudget
                ? 'bg-rose-950/80 border-rose-300 text-rose-100 animate-pulse'
                : 'bg-white text-slate-800 border-white/90 shadow'
            }`}
          >
            <Wallet className={`w-4 h-4 ${isOverBudget ? 'text-rose-300' : 'text-[#EE4D2D]'}`} />
            <div className="text-left">
              <div className="text-[10px] uppercase tracking-wider text-slate-500 font-medium leading-none">
                Saldo Virtual
              </div>
              <div className={`font-mono font-bold leading-tight ${isOverBudget ? 'text-rose-200' : 'text-slate-900'}`}>
                {formatRupiah(remainingBalance)}
              </div>
            </div>
          </div>

          {/* Cart Button */}
          {currentPhase === 'shopping' && (
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 transition-all text-white border border-white/20 font-semibold text-xs sm:text-sm cursor-pointer"
              aria-label="Buka Keranjang Belanja"
            >
              <ShoppingBag className="w-5 h-5 text-white" />
              <span className="hidden sm:inline">Keranjang</span>
              {cartCount > 0 && (
                <span className="bg-yellow-400 text-slate-900 font-extrabold text-xs px-2 py-0.5 rounded-full shadow-md scale-100 animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
