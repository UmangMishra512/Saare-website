import React, { useState } from 'react';
import { Store, Check, X, Sparkles } from 'lucide-react';

interface PitchModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBrand: string;
  onUpdateBrand: (newBrand: string) => void;
}

const PRESET_BOUTIQUES = [
  'Maison D\'Or Heritage',
  'Varanasi Silk Emporium',
  'Kanjeevaram Royal Weaves',
  'Roop Milan Bridal Studio',
  'Banaras Bunkar Atelier',
  'Sitaara Luxury Couture',
];

export const PitchModeModal: React.FC<PitchModeModalProps> = ({
  isOpen,
  onClose,
  currentBrand,
  onUpdateBrand,
}) => {
  const [customName, setCustomName] = useState('');

  if (!isOpen) return null;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customName.trim()) {
      onUpdateBrand(customName.trim());
      setCustomName('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative bg-parchment-50 border border-obsidian-900/15 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-parchment-200 hover:bg-parchment-300 text-obsidian-900 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-full bg-gold-500/20 text-gold-600 flex items-center justify-center">
            <Store className="w-4 h-4" />
          </div>
          <span className="text-xs uppercase tracking-widest font-semibold text-gold-600">
            B2B Pitch Mode
          </span>
        </div>

        <h3 className="font-serif text-2xl font-bold text-obsidian-950">
          Personalize Storefront Demo
        </h3>
        <p className="text-xs text-obsidian-700 mt-1 leading-relaxed">
          Switch the entire website branding in real time to match any saree or bridal boutique you are pitching to.
        </p>

        {/* Preset Boutiques */}
        <div className="mt-6 space-y-2">
          <label className="text-[11px] uppercase tracking-wider font-semibold text-obsidian-800">
            Quick Select Preset Boutique:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PRESET_BOUTIQUES.map((boutique) => {
              const isSelected = currentBrand.toLowerCase() === boutique.toLowerCase();
              return (
                <button
                  key={boutique}
                  onClick={() => {
                    onUpdateBrand(boutique);
                    onClose();
                  }}
                  className={`text-left px-3 py-2.5 rounded-xl text-xs font-medium transition-all flex items-center justify-between border ${
                    isSelected
                      ? 'bg-obsidian-950 text-parchment-50 border-obsidian-950 shadow-sm'
                      : 'bg-parchment-100 hover:bg-parchment-200 text-obsidian-900 border-obsidian-900/10'
                  }`}
                >
                  <span className="truncate">{boutique}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-gold-400 flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Input */}
        <form onSubmit={handleCustomSubmit} className="mt-6 pt-5 border-t border-obsidian-900/10">
          <label className="text-[11px] uppercase tracking-wider font-semibold text-obsidian-800 block mb-2">
            Or Type Any Merchant Name:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Abhishek Bridal Heritage"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="flex-1 bg-parchment-100 border border-obsidian-900/15 rounded-xl px-3.5 py-2.5 text-xs text-obsidian-950 focus:outline-none focus:ring-2 focus:ring-gold-500/50"
            />
            <button
              type="submit"
              disabled={!customName.trim()}
              className="bg-gold-500 hover:bg-gold-600 disabled:opacity-50 text-obsidian-950 font-semibold px-4 py-2.5 rounded-xl text-xs transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Apply
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
