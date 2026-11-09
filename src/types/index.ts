export type ProductCategory = 'semua' | 'makanan' | 'snack' | 'minuman';

export interface Product {
  id: string;
  name: string;
  category: 'makanan' | 'snack' | 'minuman';
  price: number;
  description: string;
  emoji: string;
  badge?: string;
  rating: number;
  soldCount: number;
  imageBg: string;
  imageUrl?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderRecord {
  id: string;
  timestamp: string;
  items: CartItem[];
  totalAmount: number;
  startingBalance: number;
  remainingBalance: number;
}

export interface StudentReflection {
  reasons: string[];
  customReason: string;
  bundleChoice?: 'basket_a' | 'basket_b' | 'indifferent';
}

export interface TeacherConfig {
  startingBalance: number;
  allowNegativeBalance: boolean;
  schoolName: string;
  teacherName: string;
}

export type LearningPhase = 
  | 'shopping'       // Fase 1: Siswa belanja di marketplace
  | 'checkout'       // Fase 2: Transaksi berhasil & Refleksi
  | 'concept_reveal' // Fase 3: Pengungkapan konsep Pendekatan Ordinal
  | 'bundle_compare' // Fase 4: Perbandingan 2 keranjang (A vs B vs Indiferen)
  | 'indifference_curve' // Fase 5: Visualisasi kurva indiferensi
  | 'completed';     // Selesai & Sertifikat Pembelajaran
