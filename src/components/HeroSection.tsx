import React from 'react';
import { ArrowDown, Sparkles, Award } from 'lucide-react';

interface HeroSectionProps {
  brandName: string;
  onExploreClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ brandName, onExploreClick }) => {
  return (
    <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-4 overflow-hidden select-none">
      {/* Middle Layer: Massive Editorial Background Typography */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <h1 className="font-serif text-[18vw] font-black uppercase tracking-tighter text-obsidian-900/[0.04] leading-none select-none">
          KANCHI
        </h1>
      </div>

      <div className="relative z-20 max-w-5xl mx-auto text-center flex flex-col items-center">
        {/* Curated Heritage Crest */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-parchment-200/90 border border-obsidian-900/10 shadow-sm backdrop-blur-sm mb-6">
          <Award className="w-3.5 h-3.5 text-gold-600" />
          <span className="text-[11px] uppercase tracking-[0.2em] font-semibold text-obsidian-800">
            GI-Tag Certified Pure Handloom Silks
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
          <span className="text-[11px] font-mono text-obsidian-800">Edition 2026</span>
        </div>

        {/* Main Headline */}
        <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-normal text-obsidian-950 tracking-tight leading-[1.08] max-w-4xl">
          Where Architectural Form Meets Sacred Silk.
        </h2>

        {/* Brand Subtitle */}
        <p className="mt-6 text-base sm:text-lg text-obsidian-700 max-w-2xl font-light leading-relaxed">
          Step inside <span className="font-medium text-obsidian-950">{brandName}</span>. Experience pure Kanchipuram and Banarasi handlooms draped over 3D spatial mannequins with real-time 360° inspection.
        </p>

        {/* Call to Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
          <button
            onClick={onExploreClick}
            className="bg-obsidian-950 hover:bg-obsidian-900 text-parchment-50 px-8 py-4 rounded-full text-xs uppercase tracking-widest font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center gap-2 group"
          >
            <span>Enter The 3D Runway Atelier</span>
            <Sparkles className="w-4 h-4 text-gold-400 group-hover:rotate-45 transition-transform" />
          </button>

          <a
            href="#rack"
            className="px-6 py-4 rounded-full text-xs uppercase tracking-widest font-semibold text-obsidian-800 hover:text-obsidian-950 hover:bg-parchment-200/60 transition-all border border-obsidian-900/10"
          >
            Explore Wardrobe Rail
          </a>
        </div>

        {/* Central Featured Bridal Saree Model (Full Head, Face, Jewelry and Drape 100% Visible) */}
        <div 
          onClick={onExploreClick}
          className="mt-8 relative w-72 sm:w-84 h-[440px] flex items-center justify-center pointer-events-auto cursor-pointer group"
          title="Click to explore 360° Runway Atelier"
        >
          {/* Ambient Warm Golden Halo */}
          <div className="absolute w-72 h-72 rounded-full bg-gold-400/25 blur-3xl -z-10 group-hover:bg-gold-400/40 transition-all duration-700" />
          
          <img
            src="/images/look-crimson.png"
            alt="The Empress Vermilion Bridal Saree"
            className="max-h-full object-contain filter drop-shadow-2xl transform group-hover:scale-105 transition-transform duration-700"
          />
        </div>

        {/* Scroll Cue Indicator */}
        <div className="mt-8 flex flex-col items-center gap-2 text-obsidian-800 animate-bounce">
          <span className="text-[10px] uppercase tracking-widest font-medium text-obsidian-800">
            Scroll to descend into the fitting atelier
          </span>
          <ArrowDown className="w-4 h-4 text-gold-600" />
        </div>
      </div>
    </section>
  );
};
