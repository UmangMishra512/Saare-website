import { useState, useEffect, useRef } from 'react';
import { SharedClock } from './system/stage/SharedClock';
import { Stage3D } from './system/stage/Stage3D';
import { Navbar } from './components/Navbar';
import { ChoreographedHeroAtelier } from './components/ChoreographedHeroAtelier';
import { ClothesRail } from './system/interactions/ClothesRail';
import { FannedDeck } from './system/interactions/FannedDeck';
import { SalonConciergeSection } from './components/SalonConciergeSection';
import { TrunkDrawer } from './components/TrunkDrawer';
import { PitchModeModal } from './components/PitchModeModal';
import { SAREE_LOOKS, RACK_ITEMS, WEAVE_SWATCHES } from './data/coutureData';
import { TrunkItem, SareeLook, RackItem } from './system/types';
import confetti from 'canvas-confetti';

export function App() {
  const [brandName, setBrandName] = useState("MAISON D'OR");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeLookIndex, setActiveLookIndex] = useState(0);
  const [activeAngleView, setActiveAngleView] = useState<'front' | 'pallu' | 'pleats'>('front');
  const [isPitchModeOpen, setIsPitchModeOpen] = useState(false);
  const [isTrunkOpen, setIsTrunkOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [trunkItems, setTrunkItems] = useState<TrunkItem[]>([]);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);

  // Initialize Lenis Smooth Inertia Scroll and bind to SharedClock
  useEffect(() => {
    const clock = SharedClock.getInstance();
    clock.initLenis();

    const unsubscribe = clock.subscribe((_time, _delta, progress) => {
      setScrollProgress(progress);
    });

    return () => {
      unsubscribe();
      clock.destroy();
    };
  }, []);

  // Web Audio ambient drone (Tanpura harmonic frequency simulation)
  useEffect(() => {
    if (!isMuted) {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // 136.1 Hz (Om/Sadhana frequency in Indian classical music)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(136.1, ctx.currentTime);

        gain.gain.setValueAtTime(0.015, ctx.currentTime);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        oscillatorRef.current = osc;
      } catch {
        // Fallback gracefully if Web Audio is blocked
      }
    } else {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
        oscillatorRef.current = null;
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    }

    return () => {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, [isMuted]);

  // Cart / Trunk operations
  const handleAddLookToTrunk = (look: SareeLook) => {
    setTrunkItems((prev) => {
      const existing = prev.find((item) => item.id === look.id);
      if (existing) {
        return prev.map((item) =>
          item.id === look.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: look.id,
          title: look.title,
          craft: look.craft,
          price: look.price,
          image: look.image,
          colorHex: look.colorHex,
          quantity: 1,
        },
      ];
    });

    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#D4AF37', '#8B1E1E', '#144634'],
    });

    setIsTrunkOpen(true);
  };

  const handleAddRackItemToTrunk = (rackItem: RackItem) => {
    setTrunkItems((prev) => {
      const existing = prev.find((item) => item.id === rackItem.id);
      if (existing) {
        return prev.map((item) =>
          item.id === rackItem.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: rackItem.id,
          title: rackItem.title,
          craft: rackItem.weave,
          price: rackItem.price,
          image: rackItem.image,
          colorHex: '#8B1E1E',
          quantity: 1,
        },
      ];
    });

    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.85 },
      colors: ['#D4AF37', '#DFCA76'],
    });

    setIsTrunkOpen(true);
  };

  const handleRemoveTrunkItem = (id: string) => {
    setTrunkItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateTrunkQuantity = (id: string, delta: number) => {
    setTrunkItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter((item): item is TrunkItem => item !== null)
    );
  };

  const activeColorHex = SAREE_LOOKS[activeLookIndex]?.colorHex || '#8B1E1E';

  return (
    <div className="relative min-h-screen bg-parchment-100 text-obsidian-900 selection:bg-gold-500/30">
      {/* 1. Ambient 3D Three.js Spatial Atmosphere */}
      <Stage3D
        scrollProgress={scrollProgress}
        activeColorHex={activeColorHex}
      />

      {/* 2. Top Navigation Bar */}
      <Navbar
        brandName={brandName}
        trunkCount={trunkItems.reduce((acc, it) => acc + it.quantity, 0)}
        onOpenPitchMode={() => setIsPitchModeOpen(true)}
        onOpenTrunk={() => setIsTrunkOpen(true)}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted(!isMuted)}
      />

      {/* 3. Main Content Journey */}
      <main className="relative z-20">
        {/* Section 1 & 2: Pinned Choreographed Hero-to-Atelier 3D Scroll Journey */}
        <ChoreographedHeroAtelier
          brandName={brandName}
          looks={SAREE_LOOKS}
          activeLookIndex={activeLookIndex}
          onSelectLook={(idx) => setActiveLookIndex(idx)}
          onAddToTrunk={handleAddLookToTrunk}
          activeAngleView={activeAngleView}
          onAngleViewChange={setActiveAngleView}
        />

        {/* Section 3: The Wardrobe Clothes Rail */}
        <section id="rack" className="scroll-mt-24">
          <ClothesRail
            items={RACK_ITEMS}
            onAddToTrunk={handleAddRackItemToTrunk}
          />
        </section>

        {/* Section 4: Master Handloom Silk Swatch Arc */}
        <section id="weaves" className="scroll-mt-24">
          <FannedDeck swatches={WEAVE_SWATCHES} />
        </section>

        {/* Section 5: Flagship Salon & Concierge */}
        <SalonConciergeSection brandName={brandName} />
      </main>

      {/* 4. Editorial Footer */}
      <footer className="relative z-20 border-t border-obsidian-900/10 bg-parchment-200/40 py-12 px-4 sm:px-6 lg:px-8 text-center text-xs text-obsidian-800">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="font-serif text-2xl font-bold uppercase tracking-wider text-obsidian-950">
            {brandName}
          </div>
          <p className="font-light text-obsidian-700 max-w-xl mx-auto">
            Preserving India's sacred handloom heritage through contemporary 3D spatial technology. All silks woven by master guild artisans holding Geographical Indication (GI) accreditation.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-[11px] uppercase tracking-widest text-obsidian-800 pt-4 border-t border-obsidian-900/5">
            <span>Kanchipuram Guild</span>
            <span>•</span>
            <span>Varanasi Loom Cluster</span>
            <span>•</span>
            <span>Chanderi Weaver Syndicate</span>
            <span>•</span>
            <span>Patna Flagship Salon</span>
          </div>
          <div className="text-[10px] text-obsidian-800/80 pt-2">
            © 2026 {brandName}. Crafted with Alagappan Spatial Stage Architecture.
          </div>
        </div>
      </footer>

      {/* 5. Bespoke Trunk Drawer */}
      <TrunkDrawer
        isOpen={isTrunkOpen}
        onClose={() => setIsTrunkOpen(false)}
        items={trunkItems}
        onRemoveItem={handleRemoveTrunkItem}
        onUpdateQuantity={handleUpdateTrunkQuantity}
        brandName={brandName}
      />

      {/* 6. Pitch Mode Personalization Modal */}
      <PitchModeModal
        isOpen={isPitchModeOpen}
        onClose={() => setIsPitchModeOpen(false)}
        currentBrand={brandName}
        onUpdateBrand={(newBrand) => setBrandName(newBrand)}
      />
    </div>
  );
}
export default App;
