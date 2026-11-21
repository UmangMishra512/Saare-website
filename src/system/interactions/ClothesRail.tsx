import React, { useState } from 'react';
import { RackItem } from '../types';
import { Tag, ShieldCheck, Feather, Sparkles, X } from 'lucide-react';

interface ClothesRailProps {
  items: RackItem[];
  onAddToTrunk: (item: RackItem) => void;
}

export const ClothesRail: React.FC<ClothesRailProps> = ({ items, onAddToTrunk }) => {
  const [activeItem, setActiveItem] = useState<RackItem | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="relative w-full max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-xs uppercase tracking-[0.25em] font-medium text-gold-600 block mb-2">
          Tactile Garment Exploration
        </span>
        <h3 className="font-serif text-3xl sm:text-5xl text-obsidian-950 tracking-tight">
          The Boutique Wardrobe Rail
        </h3>
        <p className="text-sm text-obsidian-700 mt-3 font-light leading-relaxed">
          Hover or tap any hanger to pull the garment off the brass rail for tactile inspection.
        </p>
      </div>

      {/* The Brass Rail Container */}
      <div className="relative pt-12 pb-8">
        {/* Horizontal Brass Bar */}
        <div className="absolute top-12 left-0 right-0 h-3 bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-700 rounded-full shadow-lg z-10 flex items-center justify-between px-6">
          {/* Wall Mount Brackets */}
          <div className="w-4 h-8 -mt-2 bg-gradient-to-b from-obsidian-800 to-obsidian-950 rounded-sm shadow-md" />
          <div className="w-4 h-8 -mt-2 bg-gradient-to-b from-obsidian-800 to-obsidian-950 rounded-sm shadow-md" />
          <div className="w-4 h-8 -mt-2 bg-gradient-to-b from-obsidian-800 to-obsidian-950 rounded-sm shadow-md" />
        </div>

        {/* Hanging Items Flex Row */}
        <div className="relative z-20 flex justify-around items-start min-h-[460px] pt-4 overflow-x-auto gap-4 no-scrollbar">
          {items.map((item) => {
            const isHovered = hoveredId === item.id;

            return (
              <div
                key={item.id}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => setActiveItem(item)}
                className="group relative flex flex-col items-center cursor-pointer transition-all duration-500 ease-out flex-shrink-0"
                style={{
                  transform: isHovered
                    ? 'translateY(-28px) scale(1.06) translateZ(30px)'
                    : 'translateY(0px) scale(1.0) translateZ(0px)',
                }}
              >
                {/* Brass Hanger Hook */}
                <div className="w-8 h-10 border-t-2 border-l-2 border-r-0 border-yellow-500 rounded-t-full -mb-1 transform -rotate-12 transition-transform duration-300 group-hover:rotate-0" />

                {/* Wooden Hanger Shoulders */}
                <div className="w-36 h-3 bg-gradient-to-r from-amber-900 via-amber-800 to-amber-900 rounded-full shadow-md -mb-2 z-10" />

                {/* Garment Silhouette Card */}
                <div className="relative w-44 h-80 rounded-2xl bg-parchment-50/80 backdrop-blur-sm border border-obsidian-900/10 shadow-md group-hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col items-center justify-between p-3">
                  <div className="relative w-full h-56 flex items-center justify-center overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="max-h-full object-contain filter drop-shadow-md group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  <div className="w-full text-center mt-1">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-gold-600 block">
                      {item.weave}
                    </span>
                    <h5 className="font-serif text-sm font-medium text-obsidian-950 truncate">
                      {item.title}
                    </h5>
                    <p className="text-xs font-semibold text-obsidian-900">
                      ₹{item.price.toLocaleString('en-IN')}
                    </p>
                  </div>

                  {/* Lift-off Badge */}
                  <div className={`mt-1 text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded-full transition-opacity duration-300 ${
                    isHovered ? 'bg-obsidian-950 text-parchment-50' : 'bg-transparent text-transparent'
                  }`}>
                    Inspect Garment
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Inspect Lift-off Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative bg-parchment-50 border border-obsidian-900/15 rounded-3xl max-w-2xl w-full p-8 shadow-2xl overflow-hidden">
            <button
              onClick={() => setActiveItem(null)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-parchment-200/80 hover:bg-parchment-300 text-obsidian-900 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="h-80 flex items-center justify-center bg-parchment-200/40 rounded-2xl p-4 border border-obsidian-900/5">
                <img
                  src={activeItem.image}
                  alt={activeItem.title}
                  className="max-h-full object-contain filter drop-shadow-2xl"
                />
              </div>

              <div>
                <span className="text-xs uppercase tracking-[0.2em] font-semibold text-gold-600 block">
                  {activeItem.weave} Atelier
                </span>
                <h4 className="font-serif text-2xl sm:text-3xl font-semibold text-obsidian-950 mt-1">
                  {activeItem.title}
                </h4>
                <p className="text-xl font-serif font-bold text-obsidian-900 mt-2">
                  ₹{activeItem.price.toLocaleString('en-IN')}
                </p>

                <div className="mt-6 space-y-2.5 text-xs text-obsidian-800">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-parchment-100 border border-obsidian-900/5">
                    <ShieldCheck className="w-4 h-4 text-emerald-800" />
                    <span><b>Zari Purity:</b> {activeItem.zariPurity}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-parchment-100 border border-obsidian-900/5">
                    <Feather className="w-4 h-4 text-gold-600" />
                    <span><b>Silk Weight:</b> {activeItem.weightGrams}g Pure Mulberry Silk</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-parchment-100 border border-obsidian-900/5">
                    <Tag className="w-4 h-4 text-crimson-800" />
                    <span><b>Collection:</b> {activeItem.tag}</span>
                  </div>
                </div>

                <div className="mt-8 flex gap-3">
                  <button
                    onClick={() => {
                      onAddToTrunk(activeItem);
                      setActiveItem(null);
                    }}
                    className="flex-1 bg-obsidian-950 hover:bg-obsidian-900 text-parchment-50 py-3 rounded-xl font-medium text-xs uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                    <span>Add to Trunk</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
