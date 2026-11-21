import React from 'react';
import { ShoppingBag, Volume2, VolumeX, Store } from 'lucide-react';

interface NavbarProps {
  brandName: string;
  trunkCount: number;
  onOpenPitchMode: () => void;
  onOpenTrunk: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  brandName,
  trunkCount,
  onOpenPitchMode,
  onOpenTrunk,
  isMuted,
  onToggleMute,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-parchment-100/80 backdrop-blur-md border-b border-obsidian-900/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-obsidian-950 flex items-center justify-center text-gold-400 font-serif font-bold text-lg shadow-sm">
            {brandName.charAt(0)}
          </div>
          <div>
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-obsidian-950 uppercase block">
              {brandName}
            </span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-gold-600 font-medium block -mt-1">
              Haute Saree Atelier
            </span>
          </div>
        </div>

        {/* Center Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-medium uppercase tracking-widest text-obsidian-800">
          <a href="#hero" className="hover:text-obsidian-950 transition-colors">
            Atelier
          </a>
          <a href="#try-look" className="hover:text-obsidian-950 transition-colors">
            360° Runway
          </a>
          <a href="#rack" className="hover:text-obsidian-950 transition-colors">
            Wardrobe Rail
          </a>
          <a href="#weaves" className="hover:text-obsidian-950 transition-colors">
            Silk Archive
          </a>
          <a href="#concierge" className="hover:text-obsidian-950 transition-colors">
            Concierge
          </a>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Pitch Mode Switcher */}
          <button
            onClick={onOpenPitchMode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold-500/15 hover:bg-gold-500/25 border border-gold-500/30 text-obsidian-900 text-xs font-medium transition-all group"
            title="Switch Boutique Pitch Mode"
          >
            <Store className="w-3.5 h-3.5 text-gold-600 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Pitch Mode</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </button>

          {/* Sound Ambiance Toggle */}
          <button
            onClick={onToggleMute}
            className="w-9 h-9 rounded-full bg-parchment-200/80 hover:bg-parchment-300 text-obsidian-800 flex items-center justify-center transition-colors"
            title={isMuted ? 'Unmute Atelier Sitar Ambiance' : 'Mute Ambiance'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-gold-600" />}
          </button>

          {/* Bespoke Trunk Drawer Button */}
          <button
            onClick={onOpenTrunk}
            className="flex items-center gap-2 bg-obsidian-950 hover:bg-obsidian-900 text-parchment-50 px-3.5 py-2 rounded-full text-xs font-medium transition-all shadow-md group"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-gold-400 group-hover:rotate-6 transition-transform" />
            <span className="hidden sm:inline">Bespoke Trunk</span>
            <span className="bg-gold-500 text-obsidian-950 w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center">
              {trunkCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
