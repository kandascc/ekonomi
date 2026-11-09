import React, { useState, useEffect } from 'react';
import { 
  LearningPhase, 
  Product, 
  CartItem, 
  OrderRecord, 
  StudentReflection, 
  TeacherConfig 
} from './types';
import { INITIAL_PRODUCTS, INITIAL_TEACHER_CONFIG } from './data/defaultProducts';
import { generateOrderId } from './utils/formatters';

import { Navbar } from './components/Navbar';
import { Marketplace } from './components/Marketplace';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutSuccess } from './components/CheckoutSuccess';
import { ConceptReveal } from './components/ConceptReveal';
import { BundleComparison } from './components/BundleComparison';
import { IndifferenceCurveLab } from './components/IndifferenceCurveLab';
import { LearningSummaryModal } from './components/LearningSummaryModal';
import { TeacherPanelModal } from './components/TeacherPanelModal';
import { Footer } from './components/Footer';

export default function App() {
  // 1. Teacher Configuration
  const [teacherConfig, setTeacherConfig] = useState<TeacherConfig>(() => {
    try {
      const saved = localStorage.getItem('labstar_config');
      return saved ? JSON.parse(saved) : INITIAL_TEACHER_CONFIG;
    } catch {
      return INITIAL_TEACHER_CONFIG;
    }
  });

  // 2. Product Catalog
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('labstar_products');
      if (saved) {
        const parsed: Product[] = JSON.parse(saved);
        return parsed.map(p => {
          const def = INITIAL_PRODUCTS.find(d => d.id === p.id);
          return {
            ...p,
            imageUrl: p.imageUrl || def?.imageUrl,
          };
        });
      }
      return INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // 3. Learning Phase: defaults strictly to 'shopping'
  const [currentPhase, setCurrentPhase] = useState<LearningPhase>(() => {
    try {
      const saved = localStorage.getItem('labstar_phase');
      return (saved as LearningPhase) || 'shopping';
    } catch {
      return 'shopping';
    }
  });

  // 4. Shopping Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('labstar_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 5. Order Record
  const [currentOrder, setCurrentOrder] = useState<OrderRecord | null>(() => {
    try {
      const saved = localStorage.getItem('labstar_order');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // 6. Student Reflection
  const [reflection, setReflection] = useState<StudentReflection>(() => {
    try {
      const saved = localStorage.getItem('labstar_reflection');
      return saved ? JSON.parse(saved) : { reasons: [], customReason: '' };
    } catch {
      return { reasons: [], customReason: '' };
    }
  });

  // 7. Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isTeacherPanelOpen, setIsTeacherPanelOpen] = useState(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);

  // Sync state changes with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('labstar_config', JSON.stringify(teacherConfig));
      localStorage.setItem('labstar_products', JSON.stringify(products));
      localStorage.setItem('labstar_phase', currentPhase);
      localStorage.setItem('labstar_cart', JSON.stringify(cart));
      if (currentOrder) localStorage.setItem('labstar_order', JSON.stringify(currentOrder));
      localStorage.setItem('labstar_reflection', JSON.stringify(reflection));
    } catch {
      // storage quota or incognito
    }
  }, [teacherConfig, products, currentPhase, cart, currentOrder, reflection]);

  // Financial calculations
  const totalSpent = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const remainingBalance = teacherConfig.startingBalance - totalSpent;
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Cart Handlers
  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === productId);
      if (!existing) return prev;
      if (existing.quantity <= 1) {
        return prev.filter(item => item.product.id !== productId);
      }
      return prev.map(item =>
        item.product.id === productId ? { ...item, quantity: item.quantity - 1 } : item
      );
    });
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Checkout Handler: Transition from Phase 1 to Phase 2
  const handleCheckout = () => {
    if (cart.length === 0 || remainingBalance < 0) return;

    const newOrder: OrderRecord = {
      id: generateOrderId(),
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      items: [...cart],
      totalAmount: totalSpent,
      startingBalance: teacherConfig.startingBalance,
      remainingBalance: remainingBalance,
    };

    setCurrentOrder(newOrder);
    setIsCartOpen(false);
    setCurrentPhase('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Transition from Phase 2 (Checkout) to Phase 3 (Concept Reveal)
  const handleProceedToConcept = (studentRef: StudentReflection) => {
    setReflection(prev => ({
      ...prev,
      reasons: studentRef.reasons,
      customReason: studentRef.customReason,
    }));
    setCurrentPhase('concept_reveal');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Transition from Phase 3 (Concept) to Phase 4 (Bundle Comparison)
  const handleProceedToCompare = () => {
    setCurrentPhase('bundle_compare');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Transition from Phase 4 (Bundle Comparison) to Phase 5 (Indifference Curve)
  const handleProceedToCurve = (choice: 'basket_a' | 'basket_b' | 'indifferent') => {
    setReflection(prev => ({
      ...prev,
      bundleChoice: choice,
    }));
    setCurrentPhase('indifference_curve');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Finish Simulation: Show Learning Summary Certificate
  const handleFinishSimulation = () => {
    setIsSummaryModalOpen(true);
  };

  // Reset entire simulation to shop fresh
  const handleRestartSimulation = () => {
    setCart([]);
    setCurrentOrder(null);
    setReflection({ reasons: [], customReason: '' });
    setCurrentPhase('shopping');
    setIsSummaryModalOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset from teacher panel
  const handleTeacherResetSession = () => {
    handleRestartSimulation();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-[#EE4D2D] selection:text-white">
      {/* Shopee-style Header Navbar */}
      <Navbar
        currentPhase={currentPhase}
        startingBalance={teacherConfig.startingBalance}
        remainingBalance={remainingBalance}
        cartCount={cartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTeacherPanel={() => setIsTeacherPanelOpen(true)}
        onBackToShopping={() => setCurrentPhase('shopping')}
      />

      {/* Main Flow Controller based on Phase */}
      <main className="flex-1">
        {currentPhase === 'shopping' && (
          <Marketplace
            products={products}
            cart={cart}
            startingBalance={teacherConfig.startingBalance}
            remainingBalance={remainingBalance}
            totalSpent={totalSpent}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
            onOpenCart={() => setIsCartOpen(true)}
            onCheckout={handleCheckout}
          />
        )}

        {currentPhase === 'checkout' && currentOrder && (
          <CheckoutSuccess
            orderId={currentOrder.id}
            cart={currentOrder.items}
            totalSpent={currentOrder.totalAmount}
            startingBalance={currentOrder.startingBalance}
            remainingBalance={currentOrder.remainingBalance}
            onProceedToConcept={handleProceedToConcept}
          />
        )}

        {currentPhase === 'concept_reveal' && currentOrder && (
          <ConceptReveal
            cart={currentOrder.items}
            reflection={reflection}
            onProceedToCompare={handleProceedToCompare}
          />
        )}

        {currentPhase === 'bundle_compare' && (
          <BundleComparison
            onProceedToCurve={handleProceedToCurve}
            savedChoice={reflection.bundleChoice}
          />
        )}

        {currentPhase === 'indifference_curve' && (
          <IndifferenceCurveLab
            onFinishSimulation={handleFinishSimulation}
          />
        )}
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        cart={cart}
        startingBalance={teacherConfig.startingBalance}
        totalSpent={totalSpent}
        remainingBalance={remainingBalance}
        onClose={() => setIsCartOpen(false)}
        onAddToCart={handleAddToCart}
        onRemoveFromCart={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onCheckout={handleCheckout}
      />

      {/* Student Learning Summary & Certificate Modal */}
      <LearningSummaryModal
        isOpen={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
        cart={currentOrder ? currentOrder.items : cart}
        totalSpent={currentOrder ? currentOrder.totalAmount : totalSpent}
        reflection={reflection}
        bundleChoice={reflection.bundleChoice}
        onRestartSimulation={handleRestartSimulation}
      />

      {/* Teacher Panel Modal */}
      <TeacherPanelModal
        isOpen={isTeacherPanelOpen}
        onClose={() => setIsTeacherPanelOpen(false)}
        config={teacherConfig}
        onUpdateConfig={setTeacherConfig}
        products={products}
        onUpdateProducts={setProducts}
        onResetProductsToDefault={() => setProducts(INITIAL_PRODUCTS)}
        onResetStudentSession={handleTeacherResetSession}
        currentCart={currentOrder ? currentOrder.items : cart}
        studentReflection={reflection}
        bundleChoice={reflection.bundleChoice}
      />

      {/* Footer */}
      <Footer onOpenTeacherPanel={() => setIsTeacherPanelOpen(true)} />
    </div>
  );
}
