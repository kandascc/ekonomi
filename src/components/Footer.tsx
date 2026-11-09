import React from 'react';
import { Settings, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onOpenTeacherPanel: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenTeacherPanel }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-800">
          {/* Brand lockup with logos */}
          <div className="flex items-center gap-3 text-center md:text-left">
            <img
              src="/assets/aistudio/logo-labstar_6de4b5a9.png"
              alt="Labstar Logo"
              className="h-10 w-10 object-contain rounded-lg bg-white p-0.5 shadow-sm"
            />
            <img
              src="/assets/aistudio/logo-SMA-1024x360_c7c9ce59.png"
              alt="SMA Labschool Bintaro Logo"
              className="h-8 object-contain bg-white px-2 py-0.5 rounded shadow-sm"
            />
            <div>
              <div className="font-extrabold text-sm text-white tracking-tight">
                LABSTAR ECONOMICS MARKET
              </div>
              <div className="text-[11px] text-orange-400 italic">
                An Interactive Economics Learning Experience — Labstar Economics Teacher
              </div>
            </div>
          </div>

          {/* Quick links & teacher entry */}
          <div className="flex items-center gap-4 text-xs">
            <span className="text-slate-500 hidden sm:inline">
              Materi: Teori Perilaku Konsumen (Pendekatan Ordinal)
            </span>
            <button
              onClick={onOpenTeacherPanel}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-orange-300 font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Akses Panel Guru</span>
            </button>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500 text-center sm:text-left">
          <p>
            © {new Date().getFullYear()} Labstar Economics Teacher & SMA Labschool Bintaro. All rights reserved.
          </p>
          <div className="flex items-center gap-1">
            <span>Didesain dengan pendekatan aktif untuk siswa Gen-Z</span>
            <span className="text-orange-500">✨</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
