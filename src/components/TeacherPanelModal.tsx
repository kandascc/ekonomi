import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  DollarSign, 
  Package, 
  RotateCcw, 
  BarChart3, 
  BookOpen, 
  Save, 
  Check, 
  Plus, 
  Trash2, 
  Users,
  Sparkles
} from 'lucide-react';
import { Product, TeacherConfig, CartItem, StudentReflection } from '../types';
import { formatRupiah } from '../utils/formatters';

interface TeacherPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: TeacherConfig;
  onUpdateConfig: (newConfig: TeacherConfig) => void;
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
  onResetProductsToDefault: () => void;
  onResetStudentSession: () => void;
  currentCart: CartItem[];
  studentReflection: StudentReflection;
  bundleChoice?: 'basket_a' | 'basket_b' | 'indifferent';
}

export const TeacherPanelModal: React.FC<TeacherPanelModalProps> = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
  products,
  onUpdateProducts,
  onResetProductsToDefault,
  onResetStudentSession,
  currentCart,
  studentReflection,
  bundleChoice,
}) => {
  const [activeTab, setActiveTab] = useState<'balance' | 'products' | 'analytics' | 'guide'>('balance');
  const [tempBalance, setTempBalance] = useState<number>(config.startingBalance);
  const [editingPrices, setEditingPrices] = useState<{ [id: string]: number }>(() => {
    const map: { [id: string]: number } = {};
    products.forEach(p => (map[p.id] = p.price));
    return map;
  });
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const showNotice = (msg: string) => {
    setSavedNotice(msg);
    setTimeout(() => setSavedNotice(null), 3000);
  };

  const handleSaveBalance = () => {
    onUpdateConfig({
      ...config,
      startingBalance: tempBalance,
    });
    showNotice('Saldo awal siswa berhasil diperbarui!');
  };

  const handlePriceChange = (id: string, newPrice: number) => {
    setEditingPrices(prev => ({ ...prev, [id]: newPrice }));
  };

  const handleSaveProductPrices = () => {
    const updated = products.map(p => ({
      ...p,
      price: editingPrices[p.id] !== undefined ? editingPrices[p.id] : p.price,
    }));
    onUpdateProducts(updated);
    showNotice('Daftar harga produk berhasil diperbarui!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="bg-[#1E293B] text-white p-5 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500 rounded-xl">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base sm:text-lg">Panel Kendali Guru</h2>
                <span className="text-[10px] bg-orange-500/30 text-orange-300 font-bold px-2 py-0.5 rounded-full border border-orange-500/40">
                  Labstar Teacher Mode
                </span>
              </div>
              <p className="text-xs text-slate-400">
                SMA Labschool Bintaro · Pengaturan Simulasi & Analisis Refleksi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 overflow-x-auto scrollbar-none">
          {[
            { id: 'balance', label: '💰 Saldo Siswa', icon: DollarSign },
            { id: 'products', label: '🛍️ Katalog & Harga', icon: Package },
            { id: 'analytics', label: '📊 Rekap Sesi Siswa', icon: BarChart3 },
            { id: 'guide', label: '📖 Panduan Mengajar', icon: BookOpen },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-3.5 text-xs sm:text-sm font-bold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-[#EE4D2D] text-[#EE4D2D] bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Notification Toast */}
        {savedNotice && (
          <div className="bg-emerald-50 text-emerald-800 border-b border-emerald-200 px-4 py-2 text-xs font-semibold flex items-center gap-1.5 animate-fadeIn">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{savedNotice}</span>
          </div>
        )}

        {/* Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: SALDO SISWA */}
          {activeTab === 'balance' && (
            <div className="space-y-6">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Atur Saldo Virtual Awal Siswa
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tentukan anggaran belanja yang diterima setiap siswa saat pertama kali membuka marketplace.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[30000, 50000, 75000, 100000].map(amt => (
                    <button
                      key={amt}
                      onClick={() => setTempBalance(amt)}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        tempBalance === amt
                          ? 'bg-[#EE4D2D] text-white border-[#EE4D2D] shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {formatRupiah(amt)}
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Atau Masukkan Nilai Saldo Kustom (Rp):
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step={5000}
                      min={10000}
                      value={tempBalance}
                      onChange={e => setTempBalance(Number(e.target.value))}
                      className="p-2.5 bg-white border border-slate-300 rounded-xl text-sm font-mono font-bold text-slate-900 w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-[#EE4D2D]/30"
                    />
                    <button
                      onClick={handleSaveBalance}
                      className="px-4 py-2.5 bg-[#EE4D2D] hover:bg-[#D93F20] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Simpan Saldo</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Reset Session Section */}
              <div className="p-5 rounded-2xl border border-rose-200 bg-rose-50/50 space-y-3">
                <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
                  <RotateCcw className="w-4 h-4 text-rose-600" />
                  <span>Ulang / Reset Sesi Simulasi Siswa</span>
                </div>
                <p className="text-xs text-rose-700 leading-relaxed">
                  Gunakan tombol ini untuk mengosongkan keranjang belanja siswa dan mengembalikan seluruh alur pembelajaran ke Fase 1 (Belanja). Cocok digunakan saat pergantian kelompok siswa atau memulai demonstrasi kelas baru.
                </p>
                <button
                  onClick={() => {
                    onResetStudentSession();
                    showNotice('Sesi simulasi telah di-reset ke Fase Belanja!');
                  }}
                  className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset Simulasi Sekarang</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: KATALOG & HARGA */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    Kelola Harga Produk Marketplace
                  </h3>
                  <p className="text-xs text-slate-500">
                    Ubah harga barang untuk melihat bagaimana perubahan harga memengaruhi kombinasi belanja siswa.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={onResetProductsToDefault}
                    className="px-3 py-1.5 border border-slate-300 hover:bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    Reset Default
                  </button>
                  <button
                    onClick={handleSaveProductPrices}
                    className="px-4 py-1.5 bg-[#EE4D2D] hover:bg-[#D93F20] text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Simpan Harga</span>
                  </button>
                </div>
              </div>

              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                {products.map(prod => (
                  <div key={prod.id} className="p-3 sm:p-4 flex items-center gap-3 hover:bg-slate-50/60">
                    <span className="text-2xl p-2 bg-slate-100 rounded-xl">{prod.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-xs sm:text-sm text-slate-900 truncate">
                        {prod.name}
                      </div>
                      <span className="text-[11px] text-slate-400 capitalize">
                        Kategori: {prod.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-medium">Rp</span>
                      <input
                        type="number"
                        step={1000}
                        min={1000}
                        value={editingPrices[prod.id] ?? prod.price}
                        onChange={e => handlePriceChange(prod.id, Number(e.target.value))}
                        className="w-24 p-1.5 text-xs sm:text-sm font-mono font-bold text-slate-900 border border-slate-200 rounded-lg text-right focus:outline-none focus:ring-2 focus:ring-[#EE4D2D]/30"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: REKAP SESI SISWA */}
          {activeTab === 'analytics' && (
            <div className="space-y-4">
              <h3 className="font-extrabold text-slate-900 text-base">
                Ringkasan Pilihan & Refleksi Siswa di Sesi Ini
              </h3>

              {currentCart.length === 0 ? (
                <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-2xl text-slate-400">
                  <p className="text-2xl mb-1">🛒</p>
                  <p className="text-xs font-semibold text-slate-600">
                    Belum ada transaksi checkout dari siswa pada sesi ini.
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Setelah siswa checkout dan mengisi refleksi, datanya akan tampil di sini secara real-time.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Cart items checked out */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block text-[#EE4D2D]">
                      Barang yang Di-Checkout Siswa:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {currentCart.map(item => (
                        <div
                          key={item.product.id}
                          className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                        >
                          <span className="font-semibold text-slate-800">
                            {item.product.emoji} {item.product.name}
                          </span>
                          <span className="font-mono font-bold text-[#EE4D2D]">
                            {item.quantity} porsi
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reflection reasons chosen */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block text-[#EE4D2D]">
                      Alasan Pemilihan Produk (Refleksi):
                    </span>
                    {studentReflection.reasons.length > 0 ? (
                      <ul className="space-y-1.5">
                        {studentReflection.reasons.map((r, i) => (
                          <li
                            key={i}
                            className="bg-white p-2 rounded-lg border border-slate-200 text-xs text-slate-700 font-medium flex items-center gap-2"
                          >
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-slate-400 italic">Siswa belum mengirim refleksi.</p>
                    )}

                    {studentReflection.customReason && (
                      <div className="bg-white p-3 rounded-lg border border-slate-200 text-xs text-slate-800">
                        <span className="font-bold text-[#EE4D2D] block mb-0.5">
                          Alasan Kustom Siswa:
                        </span>
                        "{studentReflection.customReason}"
                      </div>
                    )}
                  </div>

                  {/* Bundle choice */}
                  {bundleChoice && (
                    <div className="bg-orange-50/80 p-4 rounded-2xl border border-orange-200 text-xs text-slate-800">
                      <span className="font-bold text-orange-950 block mb-1">
                        Pilihan Perbandingan Bundel (Fase 4):
                      </span>
                      <p className="font-semibold">
                        {bundleChoice === 'basket_a' && 'Keranjang A (2 Burger + 3 Boba)'}
                        {bundleChoice === 'basket_b' && 'Keranjang B (3 Burger + 2 Boba)'}
                        {bundleChoice === 'indifferent' && 'Sama-Sama Disukai (Indiferen: A ~ B)'}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: PANDUAN MENGAJAR */}
          {activeTab === 'guide' && (
            <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl text-blue-950 space-y-2">
                <h4 className="font-extrabold text-base flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <span>Prinsip Pedagogis Labstar Economics Teacher</span>
                </h4>
                <p>
                  <strong>"Experience First, Formalize Later" (Belanja Dulu, Teori Kemudian):</strong> Siswa belajar paling efektif ketika mereka mengalami sendiri situasi pengambilan keputusan sebelum dihadapkan pada istilah teknis abstrak seperti <em>Pendekatan Ordinal</em> atau <em>Kurva Indiferensi</em>.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-extrabold text-slate-900 text-sm">
                  Rekomendasi Pertanyaan Pemantik untuk Diskusi Kelas:
                </h4>
                <div className="space-y-2">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="font-bold text-slate-800">
                      1. "Mengapa tidak ada dua siswa di kelas ini yang isi keranjangnya sama persis?"
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Kaitkan dengan konsep: Subjektivitas selera dan keunikan preferensi setiap individu.
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="font-bold text-slate-800">
                      2. "Saat checkout tadi, apakah kamu sempat berpikir: 'Mi ini bernilai 45 poin kenikmatan'?"
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Kaitkan dengan kritik terhadap Pendekatan Kardinal (utilitas tak terukur) dan keunggulan Pendekatan Ordinal (cukup mengurutkan kesukaan).
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="font-bold text-slate-800">
                      3. "Jika kamu diberikan pilihan Keranjang A (2 burger, 3 boba) vs Keranjang B (3 burger, 2 boba), apa yang kamu pertimbangkan?"
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Kaitkan dengan konsep <em>Marginal Rate of Substitution (MRS)</em> dan pembentukan Kurva Indiferensi.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs cursor-pointer"
          >
            Tutup Panel
          </button>
        </div>
      </div>
    </div>
  );
};
