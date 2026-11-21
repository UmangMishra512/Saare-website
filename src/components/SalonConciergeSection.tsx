import React, { useState } from 'react';
import { Calendar, Clock, MessageSquare, MapPin, Sparkles, PhoneCall } from 'lucide-react';

interface SalonConciergeSectionProps {
  brandName: string;
}

export const SalonConciergeSection: React.FC<SalonConciergeSectionProps> = ({ brandName }) => {
  const [selectedCity, setSelectedCity] = useState('Patna Flagship Salon (Fraser Road)');
  const [guestName, setGuestName] = useState('');
  const [weddingDate, setWeddingDate] = useState('');

  const handleWhatsAppBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `Namaste ${brandName} Concierge,%0A%0AI would like to reserve a Private Bridal Consultation.%0AName: ${encodeURIComponent(
      guestName || 'Valued Patron'
    )}%0ALocation: ${encodeURIComponent(selectedCity)}%0AWedding/Occasion Date: ${encodeURIComponent(
      weddingDate || 'Upcoming Season'
    )}%0A%0APlease share available appointment slots.`;

    window.open(`https://wa.me/919999999999?text=${message}`, '_blank');
  };

  return (
    <section id="concierge" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="bg-gradient-to-br from-obsidian-950 via-obsidian-900 to-obsidian-950 text-parchment-50 rounded-3xl p-8 sm:p-12 lg:p-16 shadow-2xl border border-gold-500/20 relative overflow-hidden">
        {/* Subtle Gold Ambient Mesh */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Column: Salon Experience */}
          <div className="lg:col-span-6">
            <span className="text-xs uppercase tracking-[0.25em] font-semibold text-gold-400 block mb-3">
              Private Haute Couture Salon
            </span>
            <h3 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-parchment-50 leading-tight">
              Reserve a Private Appointment with {brandName}.
            </h3>
            <p className="text-sm text-parchment-200/80 mt-4 font-light leading-relaxed">
              Every bridal ensemble is custom-crafted to your family heirloom specifications. Experience private drape trials, customized zari borders, and bespoke color-matching in our flagship salons.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-3.5">
                <MapPin className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-sm font-semibold text-parchment-100">Patna Flagship Atelier</h5>
                  <p className="text-xs text-parchment-300">Fraser Road Heritage Row, Patna, Bihar</p>
                </div>
              </div>
              <div className="flex items-start gap-3.5">
                <Clock className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-sm font-semibold text-parchment-100">Consultation Timings</h5>
                  <p className="text-xs text-parchment-300">Tuesday – Sunday: 11:00 AM – 8:30 PM (By Private Appointment)</p>
                </div>
              </div>
              <div className="flex items-start gap-3.5">
                <PhoneCall className="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-sm font-semibold text-parchment-100">Direct Atelier WhatsApp</h5>
                  <p className="text-xs text-parchment-300">+91 99999 99999 • Dedicated Master Drapist</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Appointment Reservation Form */}
          <div className="lg:col-span-6 bg-parchment-50 text-obsidian-950 p-6 sm:p-8 rounded-2xl shadow-xl border border-obsidian-900/10">
            <h4 className="font-serif text-2xl font-semibold text-obsidian-950">
              Reserve Private Consultation
            </h4>
            <p className="text-xs text-obsidian-700 mt-1">
              Connect directly with our master drapist over WhatsApp to confirm dates.
            </p>

            <form onSubmit={handleWhatsAppBooking} className="mt-6 space-y-4 text-xs">
              <div>
                <label className="font-semibold uppercase tracking-wider text-obsidian-800 block mb-1">
                  Patron Name:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Radhika Sharma"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="w-full bg-parchment-100 border border-obsidian-900/15 rounded-xl px-3.5 py-2.5 text-xs text-obsidian-950 focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>

              <div>
                <label className="font-semibold uppercase tracking-wider text-obsidian-800 block mb-1">
                  Preferred Salon / Location:
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full bg-parchment-100 border border-obsidian-900/15 rounded-xl px-3.5 py-2.5 text-xs text-obsidian-950 focus:outline-none focus:ring-2 focus:ring-gold-500"
                >
                  <option value="Patna Flagship Salon (Fraser Road)">Patna Flagship Salon (Fraser Road)</option>
                  <option value="Varanasi Loom Quarter">Varanasi Loom Quarter Studio</option>
                  <option value="Virtual 3D Video Consultation">Virtual 3D High-Definition Video Call</option>
                </select>
              </div>

              <div>
                <label className="font-semibold uppercase tracking-wider text-obsidian-800 block mb-1">
                  Wedding / Ceremony Date:
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={weddingDate}
                    onChange={(e) => setWeddingDate(e.target.value)}
                    className="w-full bg-parchment-100 border border-obsidian-900/15 rounded-xl px-3.5 py-2.5 text-xs text-obsidian-950 focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                  <Calendar className="w-4 h-4 text-obsidian-800 absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 bg-emerald-800 hover:bg-emerald-900 text-parchment-50 py-3.5 rounded-xl font-semibold uppercase tracking-widest text-xs transition-all shadow-md flex items-center justify-center gap-2 group"
              >
                <MessageSquare className="w-4 h-4 text-emerald-300 group-hover:scale-110 transition-transform" />
                <span>Confirm via Atelier WhatsApp</span>
                <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
