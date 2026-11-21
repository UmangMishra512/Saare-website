import React, { useState } from 'react';
import { WeaveSwatch } from '../types';
import { Sparkles, Layers } from 'lucide-react';

interface FannedDeckProps {
  swatches: WeaveSwatch[];
}

export const FannedDeck: React.FC<FannedDeckProps> = ({ swatches }) => {
  const [selectedSwatch, setSelectedSwatch] = useState<WeaveSwatch | null>(swatches[0]);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const centerIdx = (swatches.length - 1) / 2;

  return (
    <div className="relative w-full max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs uppercase tracking-[0.25em] font-medium text-gold-600 block mb-2">
          Heritage Handloom Archive
        </span>
        <h3 className="font-serif text-3xl sm:text-5xl text-obsidian-950 tracking-tight">
          Pick a Silk: Master Weave Arc
        </h3>
        <p className="text-sm text-obsidian-700 mt-3 font-light leading-relaxed">
          Cards fanned across a parabolic arc. Select any master handloom swatch to explore its metallurgical gold thread count and warp composition.
        </p>
      </div>

      {/* The Fanned Deck Container */}
      <div className="relative h-[360px] flex items-center justify-center my-8" style={{ perspective: '1200px' }}>
        <div className="relative flex items-center justify-center w-full max-w-2xl h-full">
          {swatches.map((swatch, idx) => {
            const offset = idx - centerIdx;
            const rotationDeg = offset * 11;
            const translateY = Math.abs(offset) * 16;
            const translateX = offset * 70;
            const isHovered = hoveredIdx === idx;
            const isSelected = selectedSwatch?.id === swatch.id;

            return (
              <div
                key={swatch.id}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                onClick={() => setSelectedSwatch(swatch)}
                className="absolute w-48 sm:w-56 h-72 rounded-2xl cursor-pointer transition-all duration-300 ease-out shadow-xl overflow-hidden group select-none border border-obsidian-900/15"
                style={{
                  transform: isHovered
                    ? `translate3d(${translateX}px, ${translateY - 35}px, 60px) rotateZ(${rotationDeg * 0.4}deg) scale(1.08)`
                    : `translate3d(${translateX}px, ${translateY}px, 0px) rotateZ(${rotationDeg}deg) scale(1.0)`,
                  zIndex: isSelected ? 40 : isHovered ? 35 : 10 + idx,
                }}
              >
                {/* Swatch Silk Texture Preview */}
                <div className={`w-full h-full p-5 flex flex-col justify-between text-parchment-50 relative ${swatch.colorClass}`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/80 via-transparent to-obsidian-950/30" />

                  {/* Top Badge */}
                  <div className="relative z-10 flex justify-between items-start">
                    <span className="text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md">
                      0{idx + 1}
                    </span>
                    <Sparkles className="w-4 h-4 text-gold-300 opacity-80 group-hover:rotate-45 transition-transform" />
                  </div>

                  {/* Bottom Text */}
                  <div className="relative z-10">
                    <span className="text-[10px] uppercase tracking-widest text-gold-300 block font-medium">
                      {swatch.cluster}
                    </span>
                    <h4 className="font-serif text-lg font-semibold text-parchment-50 mt-0.5">
                      {swatch.name}
                    </h4>
                    <p className="text-[11px] text-parchment-200/90 mt-1 line-clamp-2">
                      {swatch.warpWeft}
                    </p>
                  </div>

                  {isSelected && (
                    <div className="absolute inset-0 border-2 border-gold-400 rounded-2xl pointer-events-none" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Swatch Detailed Panel */}
      {selectedSwatch && (
        <div className="max-w-3xl mx-auto mt-8 bg-parchment-50 border border-obsidian-900/10 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-obsidian-900/10 pb-4">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] font-semibold text-gold-600 block">
                Cluster: {selectedSwatch.cluster}
              </span>
              <h4 className="font-serif text-2xl font-semibold text-obsidian-950 mt-1">
                {selectedSwatch.name}
              </h4>
            </div>
            <div className="flex items-center gap-2 bg-parchment-200/60 px-3.5 py-1.5 rounded-full border border-obsidian-900/10 self-start sm:self-auto text-xs font-medium text-obsidian-800">
              <Layers className="w-3.5 h-3.5 text-gold-600" />
              <span>{selectedSwatch.goldContent}</span>
            </div>
          </div>

          <p className="text-sm text-obsidian-700 mt-4 leading-relaxed font-light">
            {selectedSwatch.description}
          </p>

          <div className="mt-4 pt-4 border-t border-obsidian-900/5 flex flex-wrap gap-4 text-xs text-obsidian-800">
            <div>
              <span className="text-obsidian-800 font-normal">Warp & Weft: </span>
              <span className="font-medium">{selectedSwatch.warpWeft}</span>
            </div>
            <div>
              <span className="text-obsidian-800 font-normal">Authenticity Certificate: </span>
              <span className="font-medium text-emerald-800">GI Tag Certified Handloom</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
