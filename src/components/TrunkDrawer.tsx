import React from 'react';
import { TrunkItem } from '../system/types';
import { X, Trash2, ShoppingBag, MessageSquare, Sparkles } from 'lucide-react';

interface TrunkDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: TrunkItem[];
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  brandName: string;
}

export const TrunkDrawer: React.FC<TrunkDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onUpdateQuantity,
  brandName,
}) => {
  if (!isOpen) return null;

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleWhatsAppCheckout = () => {
    let orderDetails = items
      .map((item, idx) => `${idx + 1}. ${item.title} (${item.craft}) x${item.quantity} - ₹${(item.price * item.quantity).toLocaleString('en-IN')}`)
      .join('%0A');

    const message = `Namaste ${brandName} Concierge,%0A%0AI would like to place a bespoke order / enquiry for my Bespoke Trunk:%0A%0A${orderDetails}%0A%0ATotal Estimated Amount: ₹${totalAmount.toLocaleString(
      'en-IN'
    )}%0A%0APlease arrange my private drape trial and bespoke shipping details.`;

    window.open(`https://wa.me/919999999999?text=${message}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-obsidian-950/60 backdrop-blur-sm transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-parchment-50 shadow-2xl flex flex-col border-l border-obsidian-900/10">
          {/* Header */}
          <div className="p-6 border-b border-obsidian-900/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-gold-600" />
              <h3 className="font-serif text-xl font-bold text-obsidian-950">
                Bespoke Bridal Trunk
              </h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-parchment-200 hover:bg-parchment-300 text-obsidian-900 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingBag className="w-12 h-12 text-obsidian-800/40 mx-auto mb-3" />
                <p className="text-sm font-serif text-obsidian-800">Your Bespoke Trunk is Empty</p>
                <p className="text-xs text-obsidian-800/70 mt-1">
                  Add full looks from the 360° Runway or pull items from the Boutique Wardrobe Rail.
                </p>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="bg-parchment-100 rounded-2xl p-4 border border-obsidian-900/5 flex gap-4 items-center"
                >
                  <div className="w-16 h-20 bg-parchment-200/50 rounded-xl p-1 flex items-center justify-center flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="max-h-full object-contain filter drop-shadow-sm"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] uppercase font-semibold text-gold-600 tracking-wider block">
                      {item.craft}
                    </span>
                    <h5 className="font-serif text-sm font-semibold text-obsidian-950 truncate">
                      {item.title}
                    </h5>
                    <p className="text-xs font-bold text-obsidian-900 mt-0.5">
                      ₹{item.price.toLocaleString('en-IN')}
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="w-6 h-6 rounded-md bg-parchment-200 hover:bg-parchment-300 text-xs font-semibold flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="text-xs font-medium w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="w-6 h-6 rounded-md bg-parchment-200 hover:bg-parchment-300 text-xs font-semibold flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="text-obsidian-800 hover:text-crimson-800 p-1.5 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Inquiry */}
          {items.length > 0 && (
            <div className="p-6 border-t border-obsidian-900/10 bg-parchment-100/50">
              <div className="flex justify-between items-baseline mb-4">
                <span className="text-xs uppercase tracking-widest font-semibold text-obsidian-800">
                  Estimated Trunk Value:
                </span>
                <span className="font-serif text-2xl font-bold text-obsidian-950">
                  ₹{totalAmount.toLocaleString('en-IN')}
                </span>
              </div>

              <button
                onClick={handleWhatsAppCheckout}
                className="w-full bg-emerald-800 hover:bg-emerald-900 text-parchment-50 py-3.5 rounded-xl text-xs font-semibold uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 group"
              >
                <MessageSquare className="w-4 h-4 text-emerald-300" />
                <span>Submit Trunk to WhatsApp Concierge</span>
                <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
