import React, { useState, useRef, useEffect, useCallback } from 'react';
import { SareeLook } from '../types';
import { RotateCw, Eye, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';

interface CylindricalRingProps {
  looks: SareeLook[];
  activeLookIndex: number;
  onSelectLook: (index: number) => void;
  onAddToTrunk: (look: SareeLook) => void;
  activeAngleView: 'front' | 'pallu' | 'pleats';
  onAngleViewChange: (view: 'front' | 'pallu' | 'pleats') => void;
}

export const CylindricalRing: React.FC<CylindricalRingProps> = ({
  looks,
  activeLookIndex,
  onSelectLook,
  onAddToTrunk,
  activeAngleView,
  onAngleViewChange,
}) => {
  const [currentAngle, setCurrentAngle] = useState(0);
  const [targetAngle, setTargetAngle] = useState(0);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const startAngleRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);

  const totalItems = looks.length;
  const angleStep = (2 * Math.PI) / totalItems;
  const radius = 340; // virtual cylinder radius

  // Spring physics loop
  useEffect(() => {
    let velocity = 0;
    const springK = 0.09;
    const damping = 0.76;

    const tick = () => {
      if (!isDraggingRef.current) {
        const force = (targetAngle - currentAngle) * springK;
        velocity = (velocity + force) * damping;
        const newAngle = currentAngle + velocity;

        if (Math.abs(targetAngle - newAngle) > 0.0005 || Math.abs(velocity) > 0.0005) {
          setCurrentAngle(newAngle);
          animFrameRef.current = requestAnimationFrame(tick);
        } else {
          setCurrentAngle(targetAngle);
        }
      }
    };

    animFrameRef.current = requestAnimationFrame(tick);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [targetAngle, currentAngle]);

  const snapToActive = useCallback(
    (index: number) => {
      const desiredAngle = -index * angleStep;
      let diff = (desiredAngle - targetAngle) % (2 * Math.PI);
      if (diff > Math.PI) diff -= 2 * Math.PI;
      if (diff < -Math.PI) diff += 2 * Math.PI;
      setTargetAngle((prev) => prev + diff);
    },
    [angleStep, targetAngle]
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
    startAngleRef.current = currentAngle;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - startXRef.current;
    const angleDelta = (deltaX / radius) * 0.9;
    const newAngle = startAngleRef.current + angleDelta;
    setCurrentAngle(newAngle);
    setTargetAngle(newAngle);
  };

  const handleMouseUp = () => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    let normalized = -currentAngle / angleStep;
    let nearestIdx = Math.round(normalized) % totalItems;
    if (nearestIdx < 0) nearestIdx += totalItems;
    onSelectLook(nearestIdx);
    snapToActive(nearestIdx);
  };

  const activeLook = looks[activeLookIndex];

  return (
    <div className="relative w-full max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-obsidian-900/10 pb-6">
        <div>
          <span className="text-xs uppercase tracking-[0.25em] font-semibold text-gold-600 block mb-1">
            Spatial Atelier Studio
          </span>
          <h3 className="font-serif text-3xl sm:text-4xl text-obsidian-950 tracking-tight">
            Try The Look: 360° Runway Ring
          </h3>
        </div>

        {/* View Angle Switcher */}
        <div className="flex items-center gap-2 bg-parchment-200/80 p-1.5 rounded-full border border-obsidian-900/10 backdrop-blur-sm self-start md:self-auto">
          {(['front', 'pallu', 'pleats'] as const).map((angle) => (
            <button
              key={angle}
              onClick={() => onAngleViewChange(angle)}
              className={`px-4 py-1.5 text-xs font-medium uppercase tracking-wider rounded-full transition-all duration-300 ${
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* 3D Cylindrical Runway Stage (7 cols) */}
        <div
          className="lg:col-span-7 relative h-[540px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none overflow-hidden rounded-3xl bg-gradient-to-b from-parchment-50 to-parchment-200/60 border border-obsidian-900/10 shadow-lg"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ perspective: '1200px' }}
        >
          {/* Stage Pedestal Rings Background */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25">
            <div
              className="w-[460px] h-[460px] rounded-full border border-gold-600/70 border-dashed animate-spin"
              style={{ animationDuration: '60s' }}
            />
            <div className="absolute w-[360px] h-[360px] rounded-full border border-gold-500/40" />
            <div className="absolute bottom-8 w-[400px] h-20 rounded-full bg-gold-400/15 blur-2xl" />
          </div>

          {/* Left / Right Chevron Controls */}
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

          {/* 3D Ring Items Carousel */}
          <div
            className="relative w-full h-full flex items-center justify-center pointer-events-none"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {looks.map((look, i) => {
              const itemAngle = i * angleStep + currentAngle;
              const x = Math.sin(itemAngle) * radius;
              const z = Math.cos(itemAngle) * radius - radius * 0.3;
              const scale = Math.max(0.68, ((z + radius) / (2 * radius)) * 0.55 + 0.45);
              const opacity = Math.max(0.3, (z + radius) / (2 * radius));
              const blur = Math.max(0, (1 - (z + radius) / (2 * radius)) * 3.5);
              const isSelected = i === activeLookIndex;

              return (
                <div
                  key={look.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(i);
                  }}
                  className="absolute pointer-events-auto transition-transform duration-100 ease-out cursor-pointer group"
                  style={{
                    transform: `translate3d(${x}px, ${isSelected ? -10 : 0}px, ${z}px) scale(${
                      isSelected ? 1.08 : scale
                    })`,
                    zIndex: Math.round(z + 1000),
                    opacity: isSelected ? 1.0 : opacity,
                    filter: isSelected ? 'none' : `blur(${blur}px)`,
                  }}
                >
                  <div
                    className={`relative flex flex-col items-center p-3 rounded-2xl transition-all duration-300 ${
                      isSelected
                        ? 'bg-parchment-50/90 border border-gold-500/50 shadow-2xl backdrop-blur-md'
                        : 'bg-parchment-100/60 border border-obsidian-900/10 hover:opacity-100'
                    }`}
                  >
                    {/* Model Saree Presentation */}
                    <div className="w-48 sm:w-52 h-[340px] relative flex items-center justify-center overflow-hidden">
                      <img
                        src={look.image}
                        alt={look.title}
                        className={`max-h-full object-contain filter drop-shadow-xl transition-all duration-500 ${
                          activeAngleView === 'pallu' && isSelected
                            ? 'scale-110 translate-x-3 rotate-1'
                            : ''
                        } ${
                          activeAngleView === 'pleats' && isSelected
                            ? 'scale-110 -translate-y-3'
                            : ''
                        } ${!isSelected ? 'group-hover:scale-105' : ''}`}
                      />
                    </div>

                    {/* Saree Info Pill */}
                    <div className="mt-2 text-center w-full">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-gold-600 block">
                        {look.craft}
                      </span>
                      <h4 className="font-serif text-sm font-semibold text-obsidian-950 truncate px-2">
                        {look.title}
                      </h4>
                      <p className="text-xs font-bold text-obsidian-900">
                        ₹{look.price.toLocaleString('en-IN')}
                      </p>
                    </div>

                    {isSelected && (
                      <div className="absolute -top-3 bg-obsidian-950 text-gold-400 text-[10px] tracking-widest uppercase font-semibold px-3 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                        <Sparkles className="w-3 h-3 text-gold-400" />
                        Active Look
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Drag Hint & Index Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-obsidian-950/80 text-parchment-100 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-medium tracking-wide shadow-md pointer-events-none">
            <RotateCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
            <span>
              {activeLookIndex + 1} of {totalItems} • Drag or click arrows to spin
            </span>
          </div>
        </div>

        {/* Ensemble Breakdown & Price Summary (5 cols) */}
        <div className="lg:col-span-5 bg-parchment-50 border border-obsidian-900/10 rounded-3xl p-6 sm:p-8 shadow-md">
          <div className="flex items-center justify-between border-b border-obsidian-900/10 pb-4">
            <div>
              <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-gold-600 block">
                {activeLook.origin} • {activeLook.craft}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-obsidian-950 mt-1">
                {activeLook.title}
              </h3>
            </div>
            <div
              className="w-7 h-7 rounded-full border-2 border-white shadow-md flex-shrink-0"
              style={{ backgroundColor: activeLook.colorHex }}
              title={activeLook.subtitle}
            />
          </div>

          <p className="text-sm text-obsidian-700 mt-4 leading-relaxed font-light">
            {activeAngleView === 'front' && activeLook.subtitle}
            {activeAngleView === 'pallu' && activeLook.palluDetail}
            {activeAngleView === 'pleats' && activeLook.pleatsDetail}
          </p>

          {/* Itemized Atelier Breakdown */}
          <div className="mt-6 space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-obsidian-900 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-gold-600" />
              In This Complete Look
            </h4>

            <div className="bg-parchment-100 rounded-2xl p-4 space-y-2.5 border border-obsidian-900/5 text-sm">
              <div className="flex justify-between items-center text-obsidian-800">
                <span className="font-normal">1. {activeLook.ensemble.saree.name}</span>
                <span className="font-medium">
                  ₹{activeLook.ensemble.saree.price.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between items-center text-obsidian-800">
                <span className="font-normal">2. {activeLook.ensemble.choli.name}</span>
                <span className="font-medium">
                  ₹{activeLook.ensemble.choli.price.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between items-center text-obsidian-800">
                <span className="font-normal">3. {activeLook.ensemble.pallu.name}</span>
                <span className="font-medium">
                  ₹{activeLook.ensemble.pallu.price.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between items-center text-obsidian-800">
                <span className="font-normal">4. {activeLook.ensemble.jewels.name}</span>
                <span className="font-medium">
                  ₹{activeLook.ensemble.jewels.price.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="border-t border-obsidian-900/10 pt-2.5 mt-2 flex justify-between items-baseline">
                <span className="font-semibold text-obsidian-950 text-base">
                  Complete Bridal Look
                </span>
                <div className="text-right">
                  <span className="font-serif text-2xl font-bold text-obsidian-950">
                    ₹{activeLook.price.toLocaleString('en-IN')}
                  </span>
                  <span className="block text-[10px] text-emerald-800 font-medium">
                    10% Bespoke Suite Privilege Included
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTA */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => onAddToTrunk(activeLook)}
              className="flex-1 bg-obsidian-950 hover:bg-obsidian-900 text-parchment-50 py-3.5 px-6 rounded-2xl font-medium text-xs uppercase tracking-widest transition-all duration-300 shadow-md hover:shadow-xl flex items-center justify-center gap-2 group"
            >
              <span>Add Ensemble to Bespoke Trunk</span>
              <Sparkles className="w-3.5 h-3.5 text-gold-400 group-hover:rotate-12 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
