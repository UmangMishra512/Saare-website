import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SareeLook } from '../system/types';
import { ArrowDown, Sparkles, Award, RotateCw, Eye, ChevronLeft, ChevronRight, ShieldCheck, Feather } from 'lucide-react';

interface ChoreographedHeroAtelierProps {
  brandName: string;
  looks: SareeLook[];
  activeLookIndex: number;
  onSelectLook: (index: number) => void;
  onAddToTrunk: (look: SareeLook) => void;
  activeAngleView: 'front' | 'pallu' | 'pleats';
  onAngleViewChange: (view: 'front' | 'pallu' | 'pleats') => void;
}

export const ChoreographedHeroAtelier: React.FC<ChoreographedHeroAtelierProps> = ({
  brandName,
  looks,
  activeLookIndex,
  onSelectLook,
  onAddToTrunk,
  activeAngleView,
  onAngleViewChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0); // 0.0 (Hero) to 1.0 (Try The Look)

  // Carousel ring state with persistent physics refs (ZERO vibration)
  const [displayAngle, setDisplayAngle] = useState(0);
  const currentAngleRef = useRef(0);
  const targetAngleRef = useRef(0);
  const velocityRef = useRef(0);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startAngleRef = useRef(0);

  const totalItems = looks.length;
  const angleStep = (2 * Math.PI) / totalItems;
  const radius = 230; // 3D ring radius

  // Pinned scroll progress calculation
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const totalScrollable = containerRef.current.offsetHeight - window.innerHeight;
      if (totalScrollable <= 0) return;

      const scrolled = -rect.top;
      const progress = Math.min(1, Math.max(0, scrolled / totalScrollable));
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Single persistent physics loop - never resets velocity or cancels every frame
  useEffect(() => {
    let animId: number;
    const springK = 0.075;
    const damping = 0.79;

    const tick = () => {
      if (!isDraggingRef.current) {
        const force = (targetAngleRef.current - currentAngleRef.current) * springK;
        velocityRef.current = (velocityRef.current + force) * damping;
        currentAngleRef.current += velocityRef.current;

        const delta = Math.abs(targetAngleRef.current - currentAngleRef.current);
        const vel = Math.abs(velocityRef.current);

        if (delta > 0.0001 || vel > 0.0001) {
          setDisplayAngle(currentAngleRef.current);
        } else {
          currentAngleRef.current = targetAngleRef.current;
          velocityRef.current = 0;
          setDisplayAngle(targetAngleRef.current);
        }
      }
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Snap to active index using shortest angular rotation
  const snapToActive = useCallback(
    (index: number) => {
      const desiredAngle = -index * angleStep;
      let diff = (desiredAngle - currentAngleRef.current) % (2 * Math.PI);
      if (diff > Math.PI) diff -= 2 * Math.PI;
      if (diff < -Math.PI) diff += 2 * Math.PI;
      targetAngleRef.current = currentAngleRef.current + diff;
    },
    [angleStep]
  );

  const handleSelect = (idx: number) => {
    onSelectLook(idx);
    snapToActive(idx);
  };

  const handlePrev = () => {
    const prevIdx = (activeLookIndex - 1 + totalItems) % totalItems;
    handleSelect(prevIdx);
  };

  const handleNext = () => {
    const nextIdx = (activeLookIndex + 1) % totalItems;
    handleSelect(nextIdx);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    startXRef.current = e.clientX;
    startAngleRef.current = currentAngleRef.current;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - startXRef.current;
    const angleDelta = (deltaX / radius) * 0.85;
    const newAngle = startAngleRef.current + angleDelta;
    currentAngleRef.current = newAngle;
    targetAngleRef.current = newAngle;
    setDisplayAngle(newAngle);
  };

  const handleMouseUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    let normalized = -currentAngleRef.current / angleStep;
    let nearestIdx = Math.round(normalized) % totalItems;
    if (nearestIdx < 0) nearestIdx += totalItems;
    onSelectLook(nearestIdx);
    snapToActive(nearestIdx);
  };

  const scrollToAtelier = () => {
    if (!containerRef.current) return;
    const totalScrollable = containerRef.current.offsetHeight - window.innerHeight;
    const targetY = containerRef.current.offsetTop + totalScrollable * 0.85;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  // Easing curve for flight transition
  const flightT = Math.min(1, Math.max(0, scrollProgress / 0.65));
  const easedFlight =
    flightT < 0.5 ? 4 * flightT * flightT * flightT : 1 - Math.pow(-2 * flightT + 2, 3) / 2;

  // Hero layer fades out during 0.0 -> 0.35
  const heroOpacity = Math.max(0, 1 - scrollProgress / 0.3);
  const heroTranslateY = -scrollProgress * 60;

  // Atelier layer fades in during 0.35 -> 0.75
  const atelierOpacity = Math.min(1, Math.max(0, (scrollProgress - 0.25) / 0.45));

  // 3D Model Flight Coordinates:
  // IN HERO: Right Column (x = +18.5vw, y = 0px, scale = 1.22 -> Large, Grand, full face & jewelry visible!)
  // IN ATELIER: Left Column Stage (x = -21.5vw, y = 14px, scale = 0.78 -> Petite, perfectly fitted inside the carousel!)
  const isDesktop = typeof window !== 'undefined' ? window.innerWidth >= 1024 : true;
  const startX = isDesktop ? 18.5 : 0; // vw
  const targetX = isDesktop ? -21.5 : 0; // vw
  const currentModelX = startX + (targetX - startX) * easedFlight;
  const currentModelY = 0 + (14 - 0) * easedFlight; // px
  const currentModelScale = 1.22 + (0.78 - 1.22) * easedFlight; // Scales down from 1.22 in Hero to 0.78 in Atelier!
  const currentModelRotY = Math.sin(easedFlight * Math.PI) * 24;

  const activeLook = looks[activeLookIndex];

  return (
    <div
      ref={containerRef}
      id="hero-atelier-track"
      className="relative"
      style={{ height: '230vh' }}
    >
      {/* Pinned Viewport Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center items-center">
        {/* Background Editorial Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
          <h1 className="font-serif text-[18vw] font-black uppercase tracking-tighter text-obsidian-900/[0.035] leading-none select-none">
            KANCHI
          </h1>
        </div>

        {/* ============================================================ */}
        {/* STAGE 1: ASYMMETRIC EDITORIAL HERO (Left: Text • Right: Grand Model) */}
        {/* ============================================================ */}
        <div
          className="absolute inset-0 z-20 flex items-center justify-center px-4 sm:px-8 lg:px-12 max-w-7xl mx-auto w-full pointer-events-none"
          style={{
            opacity: heroOpacity,
            transform: `translateY(${heroTranslateY}px)`,
            pointerEvents: heroOpacity > 0.4 ? 'auto' : 'none',
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full pt-16">
            {/* Left Column (7 cols): Editorial Typography & Actions */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              {/* Curated Heritage Crest */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-parchment-200/90 border border-obsidian-900/10 shadow-sm backdrop-blur-sm mb-5">
                <Award className="w-3.5 h-3.5 text-gold-600" />
                <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-obsidian-800">
                  GI-Tag Certified Pure Handloom Silks
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
                <span className="text-[11px] font-mono text-obsidian-800">Edition 2026</span>
              </div>

              {/* Main Headline */}
              <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl font-normal text-obsidian-950 tracking-tight leading-[1.08] max-w-2xl">
                Where Architectural Form Meets Sacred Silk.
              </h2>

              {/* Subtitle */}
              <p className="mt-5 text-sm sm:text-base text-obsidian-700 max-w-lg font-light leading-relaxed">
                Step inside <span className="font-medium text-obsidian-950">{brandName}</span>. Experience pure Kanchipuram and Banarasi handlooms draped over 3D spatial mannequins with real-time 360° inspection.
              </p>

              {/* Accolade Tags */}
              <div className="mt-5 flex flex-wrap gap-4 text-xs text-obsidian-800">
                <div className="flex items-center gap-1.5">
                  <Feather className="w-3.5 h-3.5 text-gold-600" />
                  <span>4-Ply Mulberry Silk</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-800" />
                  <span>Certified 24K Gold Zari</span>
                </div>
              </div>

              {/* Call to Action Buttons */}
              <div className="mt-7 flex flex-col sm:flex-row items-center gap-4">
                <button
                  onClick={scrollToAtelier}
                  className="bg-obsidian-950 hover:bg-obsidian-900 text-parchment-50 px-8 py-3.5 sm:py-4 rounded-full text-xs uppercase tracking-widest font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center gap-2 group"
                >
                  <span>Enter The 3D Runway Atelier</span>
                  <Sparkles className="w-4 h-4 text-gold-400 group-hover:rotate-45 transition-transform" />
                </button>

                <a
                  href="#rack"
                  className="px-6 py-3.5 sm:py-4 rounded-full text-xs uppercase tracking-widest font-semibold text-obsidian-800 hover:text-obsidian-950 hover:bg-parchment-200/60 transition-all border border-obsidian-900/10"
                >
                  Explore Wardrobe Rail
                </a>
              </div>

              {/* Scroll Cue Indicator */}
              <div className="mt-8 flex items-center gap-2 text-obsidian-800">
                <ArrowDown className="w-4 h-4 text-gold-600 animate-bounce" />
                <span className="text-[10px] uppercase tracking-widest font-medium text-obsidian-800">
                  Scroll down to glide model into Try The Look
                </span>
              </div>
            </div>

            {/* Right Column (5 cols): Reserved open space for the Grand 3D Model */}
            <div className="lg:col-span-5 hidden lg:block" />
          </div>
        </div>

        {/* ============================================================ */}
        {/* THE TRAVELLING 3D MODEL */}
        {/* Starts Grand on Right (+18.5vw, scale 1.22) -> Glides to Left Stage (-21.5vw, scale 0.78) */}
        {/* ============================================================ */}
        <div
          className="absolute z-30 pointer-events-none flex items-center justify-center will-change-transform"
          style={{
            transform: `translate3d(${currentModelX}vw, ${currentModelY}px, 0px) scale(${currentModelScale}) rotateY(${currentModelRotY}deg)`,
            transformStyle: 'preserve-3d',
            perspective: '1200px',
            top: isDesktop ? '50%' : '54%',
            marginTop: '-190px',
          }}
        >
          {/* Ambient Warm Golden Halo beneath Model */}
          <div className="absolute w-80 h-80 rounded-full bg-gold-400/25 blur-3xl -z-10" />

          {/* Saree Model Cutout with Angle Animation */}
          <div className="w-64 sm:w-72 h-[390px] sm:h-[410px] relative flex items-center justify-center">
            <img
              src={activeLook.image}
              alt={activeLook.title}
              className={`max-h-full object-contain filter drop-shadow-2xl transition-all duration-500 ${
                activeAngleView === 'pallu' && scrollProgress > 0.5 ? 'scale-110 translate-x-3 rotate-1' : ''
              } ${
                activeAngleView === 'pleats' && scrollProgress > 0.5 ? 'scale-110 -translate-y-3' : ''
              }`}
            />
          </div>
        </div>

        {/* ============================================================ */}
        {/* STAGE 2: ATELIER OVERLAY (Fades in as model docks into stage) */}
        {/* ============================================================ */}
        <div
          id="try-look"
          className="absolute inset-0 z-20 flex flex-col justify-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pointer-events-none pt-16"
          style={{
            opacity: atelierOpacity,
            pointerEvents: atelierOpacity > 0.6 ? 'auto' : 'none',
          }}
        >
          {/* Atelier Top Controls */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 gap-3 border-b border-obsidian-900/10 pb-4">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] font-semibold text-gold-600 block mb-1">
                Spatial Atelier Studio
              </span>
              <h3 className="font-serif text-2xl sm:text-4xl text-obsidian-950 tracking-tight">
                Try The Look: 360° Runway Ring
              </h3>
            </div>

            {/* View Angle Switcher */}
            <div className="flex items-center gap-2 bg-parchment-200/80 p-1.5 rounded-full border border-obsidian-900/10 backdrop-blur-sm self-start md:self-auto">
              {(['front', 'pallu', 'pleats'] as const).map((angle) => (
                <button
                  key={angle}
                  onClick={() => onAngleViewChange(angle)}
                  className={`px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider rounded-full transition-all duration-300 ${
                    activeAngleView === angle
                      ? 'bg-obsidian-950 text-parchment-50 shadow-md'
                      : 'text-obsidian-800 hover:text-obsidian-950'
                  }`}
                >
                  {angle === 'front' && 'Front Silhouette'}
                  {angle === 'pallu' && 'Zari Pallu'}
                  {angle === 'pleats' && 'Drape Pleats'}
                </button>
              ))}
            </div>
          </div>

          {/* Atelier Two-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left 3D Carousel Arena (7 cols) */}
            <div
              className="lg:col-span-7 relative h-[480px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none rounded-3xl bg-gradient-to-b from-parchment-50/90 to-parchment-200/60 border border-obsidian-900/10 shadow-lg overflow-hidden"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{ perspective: '1200px' }}
            >
              {/* Pedestal Stage Halo Graphic */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25">
                <div
                  className="w-[420px] h-[420px] rounded-full border border-gold-600/70 border-dashed animate-spin"
                  style={{ animationDuration: '60s' }}
                />
                <div className="absolute w-[320px] h-[320px] rounded-full border border-gold-500/40" />
                <div className="absolute bottom-6 w-[360px] h-16 rounded-full bg-gold-400/20 blur-2xl" />
              </div>

              {/* Prev / Next Arrows */}
              <button
                onClick={handlePrev}
                className="absolute left-4 z-40 w-10 h-10 rounded-full bg-parchment-100/90 hover:bg-parchment-50 text-obsidian-900 border border-obsidian-900/10 shadow-md flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                title="Previous Saree Look"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 z-40 w-10 h-10 rounded-full bg-parchment-100/90 hover:bg-parchment-50 text-obsidian-900 border border-obsidian-900/10 shadow-md flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                title="Next Saree Look"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Orbiting Flanker Cards (Zero Vibration with GPU will-change) */}
              <div
                className="relative w-full h-full flex items-center justify-center pointer-events-none"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {looks.map((look, i) => {
                  const itemAngle = i * angleStep + displayAngle;
                  const x = Math.sin(itemAngle) * radius;
                  const z = Math.cos(itemAngle) * radius - radius * 0.35;
                  const scale = Math.max(0.65, ((z + radius) / (2 * radius)) * 0.5 + 0.45);
                  const opacity = Math.max(0.28, (z + radius) / (2 * radius));
                  const isSelected = i === activeLookIndex;

                  if (isSelected) {
                    // Center active look: completely clean stage halo without overlapping cards
                    return (
                      <div
                        key={look.id}
                        className="absolute pointer-events-auto will-change-transform"
                        style={{
                          transform: `translate3d(${x}px, 0px, ${z}px) scale(1.0)`,
                          zIndex: Math.round(z + 1000),
                        }}
                      >
                        {/* Clean stage placeholder - allows model's drape and feet to be completely visible */}
                        <div className="w-52 h-[380px] flex flex-col justify-end items-center pb-1">
                          {/* Subtle Stage Inlay Line */}
                          <div className="w-36 h-2 rounded-full bg-gold-500/20 blur-[1px]" />
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={look.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(i);
                      }}
                      className="absolute pointer-events-auto cursor-pointer group will-change-transform"
                      style={{
                        transform: `translate3d(${x}px, 0px, ${z}px) scale(${scale})`,
                        zIndex: Math.round(z + 1000),
                        opacity,
                      }}
                    >
                      <div className="relative flex flex-col items-center p-2 rounded-2xl bg-parchment-100/80 border border-obsidian-900/10 shadow-sm hover:opacity-100 transition-opacity">
                        <div className="w-36 h-64 relative flex items-center justify-center overflow-hidden">
                          <img
                            src={look.image}
                            alt={look.title}
                            className="max-h-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="mt-1 text-center w-full">
                          <h4 className="font-serif text-[11px] font-medium text-obsidian-950 truncate px-1">
                            {look.title}
                          </h4>
                          <p className="text-[10px] font-semibold text-obsidian-800">
                            ₹{look.price.toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Drag Hint & Clean Counter */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-obsidian-950/80 text-parchment-100 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-medium tracking-wide shadow-md pointer-events-none">
                <RotateCw className="w-3 h-3 animate-spin" style={{ animationDuration: '6s' }} />
                <span>
                  Look {activeLookIndex + 1} of {totalItems} • {activeLook.title}
                </span>
              </div>
            </div>

            {/* Right Column: In This Complete Look (5 cols) */}
            <div className="lg:col-span-5 bg-parchment-50 border border-obsidian-900/10 rounded-3xl p-6 sm:p-7 shadow-md">
              <div className="flex items-center justify-between border-b border-obsidian-900/10 pb-3">
                <div>
                  <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-gold-600 block">
                    {activeLook.origin} • {activeLook.craft}
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl font-semibold text-obsidian-950 mt-0.5">
                    {activeLook.title}
                  </h3>
                </div>
                <div
                  className="w-6 h-6 rounded-full border-2 border-white shadow-md flex-shrink-0"
                  style={{ backgroundColor: activeLook.colorHex }}
                  title={activeLook.subtitle}
                />
              </div>

              <p className="text-xs text-obsidian-700 mt-3 leading-relaxed font-light">
                {activeAngleView === 'front' && activeLook.subtitle}
                {activeAngleView === 'pallu' && activeLook.palluDetail}
                {activeAngleView === 'pleats' && activeLook.pleatsDetail}
              </p>

              {/* Itemized Atelier Breakdown */}
              <div className="mt-4 space-y-2">
                <h4 className="text-[11px] uppercase tracking-widest font-semibold text-obsidian-900 flex items-center gap-1.5">
                  <Eye className="w-3 h-3 text-gold-600" />
                  In This Complete Look
                </h4>

                <div className="bg-parchment-100 rounded-xl p-3.5 space-y-2 border border-obsidian-900/5 text-xs">
                  <div className="flex justify-between items-center text-obsidian-800">
                    <span>1. {activeLook.ensemble.saree.name}</span>
                    <span className="font-medium">
                      ₹{activeLook.ensemble.saree.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-obsidian-800">
                    <span>2. {activeLook.ensemble.choli.name}</span>
                    <span className="font-medium">
                      ₹{activeLook.ensemble.choli.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-obsidian-800">
                    <span>3. {activeLook.ensemble.pallu.name}</span>
                    <span className="font-medium">
                      ₹{activeLook.ensemble.pallu.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-obsidian-800">
                    <span>4. {activeLook.ensemble.jewels.name}</span>
                    <span className="font-medium">
                      ₹{activeLook.ensemble.jewels.price.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="border-t border-obsidian-900/10 pt-2 mt-1.5 flex justify-between items-baseline">
                    <span className="font-semibold text-obsidian-950 text-sm">
                      Complete Bridal Look
                    </span>
                    <div className="text-right">
                      <span className="font-serif text-xl font-bold text-obsidian-950">
                        ₹{activeLook.price.toLocaleString('en-IN')}
                      </span>
                      <span className="block text-[9px] text-emerald-800 font-medium">
                        10% Bespoke Suite Privilege Included
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action CTA */}
              <div className="mt-5">
                <button
                  onClick={() => onAddToTrunk(activeLook)}
                  className="w-full bg-obsidian-950 hover:bg-obsidian-900 text-parchment-50 py-3.5 px-6 rounded-xl font-medium text-xs uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-xl flex items-center justify-center gap-2 group"
                >
                  <span>Add Ensemble to Bespoke Trunk</span>
                  <Sparkles className="w-3.5 h-3.5 text-gold-400 group-hover:rotate-12 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
