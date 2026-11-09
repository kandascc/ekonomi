import React, { useState } from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  CheckCircle, 
  TrendingUp, 
  Layers, 
  ArrowRight, 
  Award, 
  Maximize2,
  Info
} from 'lucide-react';
import { soundFX } from '../utils/audioEffects';

interface PointData {
  id: string;
  name: string;
  x: number; // Makanan (Burger/Rice Bowl)
  y: number; // Minuman (Boba/Susu)
  curve: 'U1' | 'U2';
  color: string;
  label: string;
}

const POINTS_ON_U1: PointData[] = [
  { id: 'A', name: 'Titik A', x: 2, y: 6, curve: 'U1', color: '#0284C7', label: '2 Makanan + 6 Minuman' },
  { id: 'B', name: 'Titik B', x: 3, y: 4, curve: 'U1', color: '#0284C7', label: '3 Makanan + 4 Minuman' },
  { id: 'C', name: 'Titik C', x: 6, y: 2, curve: 'U1', color: '#0284C7', label: '6 Makanan + 2 Minuman' },
];

const POINTS_ON_U2: PointData[] = [
  { id: 'D', name: 'Titik D', x: 4, y: 6, curve: 'U2', color: '#EE4D2D', label: '4 Makanan + 6 Minuman' },
  { id: 'E', name: 'Titik E', x: 6, y: 4, curve: 'U2', color: '#EE4D2D', label: '6 Makanan + 4 Minuman' },
];

const ALL_POINTS = [...POINTS_ON_U1, ...POINTS_ON_U2];

interface IndifferenceCurveLabProps {
  onFinishSimulation: () => void;
}

export const IndifferenceCurveLab: React.FC<IndifferenceCurveLabProps> = ({
  onFinishSimulation,
}) => {
  const [selectedPointId, setSelectedPointId] = useState<string>('A');
  const [activeTab, setActiveTab] = useState<'interactive' | 'properties'>('interactive');

  const selectedPoint = ALL_POINTS.find(p => p.id === selectedPointId) || ALL_POINTS[0];

  // SVG coordinate transformation helpers
  // Graph domain: X from 0 to 8, Y from 0 to 8
  const svgWidth = 460;
  const svgHeight = 360;
  const padding = { top: 30, right: 30, bottom: 50, left: 55 };
  const plotWidth = svgWidth - padding.left - padding.right;
  const plotHeight = svgHeight - padding.top - padding.bottom;

  const toSvgX = (x: number) => padding.left + (x / 8) * plotWidth;
  const toSvgY = (y: number) => padding.top + plotHeight - (y / 8) * plotHeight;

  // Generate smooth curve points for U1: Y = 12 / X (clamped from X=1.6 to X=7.5)
  const generateCurvePath = (constant: number, minX: number, maxX: number) => {
    const segments = 40;
    const step = (maxX - minX) / segments;
    const points: string[] = [];
    for (let i = 0; i <= segments; i++) {
      const x = minX + i * step;
      const y = Math.min(8, constant / x);
      const px = toSvgX(x);
      const py = toSvgY(y);
      if (i === 0) {
        points.push(`M ${px} ${py}`);
      } else {
        points.push(`L ${px} ${py}`);
      }
    }
    return points.join(' ');
  };

  const pathU1 = generateCurvePath(12, 1.6, 7.5);
  const pathU2 = generateCurvePath(24, 3.2, 7.8);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="inline-flex items-center gap-2 bg-orange-50 text-[#EE4D2D] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Fase 5 · Laboratorium Visual Kurva Indiferensi</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Visualisasi Kurva Indiferensi (Indifference Curve)
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Setelah merasakan proses memilih dan membandingkan kombinasi belanja, kini mari kita visualisasikan bagaimana teori ekonomi merepresentasikan preferensi konsumen ke dalam model kurva grafis.
        </p>

        {/* Mode Tabs */}
        <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
          <button
            onClick={() => setActiveTab('interactive')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'interactive'
                ? 'bg-[#EE4D2D] text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            📊 Eksplorasi Interaktif Titik & Kurva
          </button>
          <button
            onClick={() => setActiveTab('properties')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'properties'
                ? 'bg-[#EE4D2D] text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            📚 4 Karakteristik Kurva Indiferensi
          </button>
        </div>
      </div>

      {activeTab === 'interactive' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Interactive SVG Canvas (Left 7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Bidang Grafik Preferensi Konsumen
              </span>
              <span className="text-[11px] text-slate-400">Klik titik mana pun</span>
            </div>

            <div className="relative w-full flex items-center justify-center bg-slate-50/70 rounded-xl border border-slate-100 p-2">
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-auto select-none overflow-visible"
              >
                {/* Background Grid Lines */}
                {[1, 2, 3, 4, 5, 6, 7].map(val => (
                  <g key={`grid-${val}`}>
                    {/* Vertical grid */}
                    <line
                      x1={toSvgX(val)}
                      y1={padding.top}
                      x2={toSvgX(val)}
                      y2={padding.top + plotHeight}
                      stroke="#E2E8F0"
                      strokeDasharray="3 3"
                    />
                    {/* Horizontal grid */}
                    <line
                      x1={padding.left}
                      y1={toSvgY(val)}
                      x2={padding.left + plotWidth}
                      y2={toSvgY(val)}
                      stroke="#E2E8F0"
                      strokeDasharray="3 3"
                    />
                    {/* X-axis labels */}
                    <text
                      x={toSvgX(val)}
                      y={padding.top + plotHeight + 18}
                      fontSize="10"
                      fill="#64748B"
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      {val}
                    </text>
                    {/* Y-axis labels */}
                    <text
                      x={padding.left - 12}
                      y={toSvgY(val) + 3}
                      fontSize="10"
                      fill="#64748B"
                      textAnchor="end"
                      fontWeight="bold"
                    >
                      {val}
                    </text>
                  </g>
                ))}

                {/* X and Y Main Axes */}
                <line
                  x1={padding.left}
                  y1={padding.top + plotHeight}
                  x2={padding.left + plotWidth + 15}
                  y2={padding.top + plotHeight}
                  stroke="#334155"
                  strokeWidth="2"
                  markerEnd="url(#arrow)"
                />
                <line
                  x1={padding.left}
                  y1={padding.top + plotHeight}
                  x2={padding.left}
                  y2={padding.top - 15}
                  stroke="#334155"
                  strokeWidth="2"
                />

                {/* Axis Labels */}
                <text
                  x={padding.left + plotWidth / 2}
                  y={padding.top + plotHeight + 36}
                  fontSize="12"
                  fontWeight="bold"
                  fill="#0F172A"
                  textAnchor="middle"
                >
                  Barang X: Jumlah Makanan (Porsi) 🍔
                </text>
                <text
                  transform={`rotate(-90)`}
                  x={-(padding.top + plotHeight / 2)}
                  y={padding.left - 34}
                  fontSize="12"
                  fontWeight="bold"
                  fill="#0F172A"
                  textAnchor="middle"
                >
                  Barang Y: Jumlah Minuman (Gelas) 🧋
                </text>

                {/* Origin point (0,0) */}
                <text
                  x={padding.left - 10}
                  y={padding.top + plotHeight + 16}
                  fontSize="10"
                  fill="#94A3B8"
                  textAnchor="end"
                >
                  0
                </text>

                {/* Indifference Curve U1 (Level Kepuasan 1) */}
                <path
                  d={pathU1}
                  fill="none"
                  stroke="#0284C7"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <text
                  x={toSvgX(7.3)}
                  y={toSvgY(1.9) - 8}
                  fill="#0284C7"
                  fontSize="12"
                  fontWeight="bold"
                >
                  U₁
                </text>

                {/* Indifference Curve U2 (Level Kepuasan 2 - Higher) */}
                <path
                  d={pathU2}
                  fill="none"
                  stroke="#EE4D2D"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <text
                  x={toSvgX(7.6)}
                  y={toSvgY(3.4) - 8}
                  fill="#EE4D2D"
                  fontSize="12"
                  fontWeight="bold"
                >
                  U₂ (Lebih Tinggi)
                </text>

                {/* Coordinate Projection Lines for Selected Point */}
                <line
                  x1={toSvgX(selectedPoint.x)}
                  y1={toSvgY(selectedPoint.y)}
                  x2={toSvgX(selectedPoint.x)}
                  y2={padding.top + plotHeight}
                  stroke={selectedPoint.curve === 'U1' ? '#0284C7' : '#EE4D2D'}
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                />
                <line
                  x1={padding.left}
                  y1={toSvgY(selectedPoint.y)}
                  x2={toSvgX(selectedPoint.x)}
                  y2={toSvgY(selectedPoint.y)}
                  stroke={selectedPoint.curve === 'U1' ? '#0284C7' : '#EE4D2D'}
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                />

                {/* Render Interactive Clickable Points */}
                {ALL_POINTS.map(p => {
                  const isSelected = p.id === selectedPointId;
                  const cx = toSvgX(p.x);
                  const cy = toSvgY(p.y);
                  return (
                    <g
                      key={p.id}
                      onClick={() => {
                        soundFX.playSelectChoice();
                        setSelectedPointId(p.id);
                      }}
                      className="cursor-pointer group"
                    >
                      {/* Outer pulse if selected */}
                      {isSelected && (
                        <circle
                          cx={cx}
                          cy={cy}
                          r="14"
                          fill={p.color}
                          opacity="0.25"
                          className="animate-ping"
                        />
                      )}
                      {/* Selection ring */}
                      {isSelected && (
                        <circle
                          cx={cx}
                          cy={cy}
                          r="11"
                          fill="none"
                          stroke={p.color}
                          strokeWidth="2.5"
                        />
                      )}
                      {/* Point dot */}
                      <circle
                        cx={cx}
                        cy={cy}
                        r="6.5"
                        fill={p.color}
                        stroke="#FFFFFF"
                        strokeWidth="2"
                        className="transition-transform group-hover:scale-125"
                      />
                      {/* Label Text */}
                      <text
                        x={cx + 10}
                        y={cy - 8}
                        fontSize="12"
                        fontWeight="extrabold"
                        fill={p.color}
                        className="pointer-events-none drop-shadow-xs"
                      >
                        {p.name} ({p.x}, {p.y})
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Quick point selector buttons */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-500">Pilih Titik Langsung:</span>
              <div className="flex gap-1.5">
                {ALL_POINTS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      soundFX.playSelectChoice();
                      setSelectedPointId(p.id);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      selectedPointId === p.id
                        ? p.curve === 'U1'
                          ? 'bg-[#0284C7] text-white shadow-xs'
                          : 'bg-[#EE4D2D] text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Point Inspector & Analytical Explanation (Right 5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Selected Point Detail Card */}
            <div className="bg-white rounded-2xl border-2 border-slate-200 p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span
                    className="w-8 h-8 rounded-xl text-white font-black text-sm flex items-center justify-center shadow-xs"
                    style={{ backgroundColor: selectedPoint.color }}
                  >
                    {selectedPoint.id}
                  </span>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">
                      {selectedPoint.name}
                    </h3>
                    <span className="text-[11px] font-semibold text-slate-500">
                      Terletak di Kurva {selectedPoint.curve}
                    </span>
                  </div>
                </div>

                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full text-white"
                  style={{ backgroundColor: selectedPoint.color }}
                >
                  Kurva {selectedPoint.curve}
                </span>
              </div>

              {/* Bundles inside this point */}
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Kombinasi Barang yang Didapat:
                </span>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex flex-col items-center">
                    <img
                      src="/src/assets/images/food_burger_gourmet_1794196388175.jpg"
                      alt="Burger Sapi"
                      className="w-12 h-12 rounded-lg object-cover mb-1 shadow-xs"
                    />
                    <span className="text-[11px] text-slate-500 font-medium">Makanan (X)</span>
                    <span className="font-mono font-bold text-sm text-slate-900 block">
                      {selectedPoint.x} Porsi
                    </span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex flex-col items-center">
                    <img
                      src="/src/assets/images/food_boba_milktea_1794196389423.jpg"
                      alt="Boba Milk Tea"
                      className="w-12 h-12 rounded-lg object-cover mb-1 shadow-xs"
                    />
                    <span className="text-[11px] text-slate-500 font-medium">Minuman (Y)</span>
                    <span className="font-mono font-bold text-sm text-slate-900 block">
                      {selectedPoint.y} Gelas
                    </span>
                  </div>
                </div>
              </div>

              {/* Theoretical Implication */}
              <div className="text-xs text-slate-700 leading-relaxed space-y-2 pt-1">
                {selectedPoint.curve === 'U1' ? (
                  <p className="bg-sky-50 border border-sky-200 p-2.5 rounded-lg text-sky-950">
                    ⚖️ <strong>Kepuasan Sama (Indiferen):</strong> Karena Titik A, B, dan C berada pada kurva yang sama (<strong>U₁</strong>), konsumen menganggap ketiga kombinasi ini memberikan <span className="font-bold underline decoration-sky-600">kepuasan yang setara</span>. Konsumen rela menukar minuman untuk mendapat makanan (Marginal Rate of Substitution).
                  </p>
                ) : (
                  <p className="bg-orange-50 border border-orange-200 p-2.5 rounded-lg text-orange-950">
                    🚀 <strong>Kepuasan Lebih Tinggi:</strong> Titik {selectedPoint.id} berada pada kurva <strong>U₂</strong> yang posisinya lebih jauh dari titik asal (0,0). Berdasarkan asas <em>Monotonic Preference</em> (More is Better), kombinasi pada kurva U₂ selalu <span className="font-bold underline decoration-[#EE4D2D]">lebih disukai</span> daripada kombinasi pada kurva U₁!
                  </p>
                )}
              </div>
            </div>

            {/* Model Clarification Note (Per User Prompt Requirement) */}
            <div className="bg-amber-50/70 rounded-xl p-4 border border-amber-200 text-xs text-amber-900 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-amber-950">
                <Info className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Catatan Penting Model Kurva:</span>
              </div>
              <p className="leading-relaxed">
                Grafik ini menggunakan model preferensi matematis konsisten untuk memvisualisasikan teori. Pilihan belanja pribadimu tadi membuktikan bahwa kamu memiliki urutan preferensi, sedangkan kurva ini adalah representasi matematis tentang bagaimana preferensi yang konsisten dipetakan dalam teori ekonomi.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: 4 Characteristics of Indifference Curve */}
      {activeTab === 'properties' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              num: '1',
              title: 'Berlereng Negatif (Downsloping)',
              desc: 'Kurva miring turun dari kiri atas ke kanan bawah. Artinya, untuk menambah konsumsi satu barang, konsumen harus bersedia mengorbankan (mengurangi) barang lainnya demi menjaga tingkat kepuasan tetap sama (adanya trade-off).',
              icon: '📉',
            },
            {
              num: '2',
              title: 'Cembung ke Titik Origin (Convex)',
              desc: 'Bentuk kurva melengkung ke dalam (cembung ke arah (0,0)) akibat berlakunya Diminishing Marginal Rate of Substitution (MRS). Semakin banyak barang X yang dimiliki, konsumen semakin kurang rela mengorbankan barang Y untuk mendapatkan X tambahan.',
              icon: '🔄',
            },
            {
              num: '3',
              title: 'Tidak Pernah Saling Berpotongan',
              desc: 'Jika dua kurva indiferensi berpotongan, maka logika konsistensi preferensi (Aksioma Transitivitas) akan runtuh. Dalam teori ordinal, satu kombinasi barang tidak mungkin memberikan dua tingkat kepuasan yang berbeda sekaligus.',
              icon: '✖️',
            },
            {
              num: '4',
              title: 'Semakin Jauh dari Origin, Semakin Disukai',
              desc: 'Kurva U₂ yang berada lebih jauh dari titik (0,0) menggambarkan tingkat preferensi yang lebih tinggi dibanding U₁ karena mengandung jumlah barang yang lebih banyak (Asumsi Monotonisitas: Lebih banyak barang lebih disukai).',
              icon: '🌟',
            },
          ].map(prop => (
            <div
              key={prop.num}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-start gap-3.5"
            >
              <span className="text-3xl shrink-0 p-2 bg-slate-50 rounded-xl border border-slate-100">
                {prop.icon}
              </span>
              <div>
                <span className="text-[11px] font-bold text-[#EE4D2D] uppercase tracking-wider block">
                  Karakteristik #{prop.num}
                </span>
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base mb-1">
                  {prop.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">{prop.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Completion CTA */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-6 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs text-yellow-400 font-bold uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>Misi Pembelajaran Selesai</span>
          </span>
          <h3 className="text-lg sm:text-xl font-bold mt-0.5">
            Selamat! Kamu Telah Menuntaskan Seluruh Alur Belajar
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            Mulai dari belanja kantin hingga memahami hakikat Kurva Indiferensi.
          </p>
        </div>

        <button
          onClick={onFinishSimulation}
          className="px-6 py-3 rounded-xl bg-[#EE4D2D] hover:bg-[#D93F20] text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md shrink-0 cursor-pointer"
        >
          <span>Lihat Ringkasan & Sertifikat Belajar</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
