# MAISON D'OR — Haute Saree Atelier

> Preserving India's sacred handloom heritage through contemporary 3D spatial technology. All silks woven by master guild artisans holding Geographical Indication (GI) accreditation.

Inspired by Alagappan's spatial stage architecture, featuring a synchronized 3D scroll choreography from the asymmetric editorial Hero to the 360° Runway Ring.

---

## 🌟 Architectural Highlights

1. **Synchronized 3D Flight Choreography (`ChoreographedHeroAtelier.tsx`)**:
   - Pinned 2.3vh sticky viewport driven by container scroll progress.
   - **Hero Phase**: Asymmetric layout — Editorial story & GI crest on the left (7 columns), Grand Bridal Model on the right (5 columns, scale 1.22).
   - **Scroll Flight**: Model glides from $+18.5\text{vw}$ to $-21.5\text{vw}$, shrinking smoothly from scale $1.22 \to 0.78$ with a $24^\circ$ 3D yaw swoop.
   - **Try The Look Phase**: Center model docks into the pedestal stage with flanker sarees orbiting on a cylindrical ring ($R = 230\text{px}$).

2. **Theatrical Studio Lighting & Dust (`Stage3D.tsx`)**:
   - High-performance Three.js WebGL rendering with ACES Filmic tone mapping.
   - Floating gold zari dust particles (`THREE.Points`) synced with `SharedClock` requestAnimationFrame.

3. **Interactive Garment Rail (`ClothesRail.tsx`)**:
   - Tactile horizontal clothes rail with smooth hanger lift-off animations on hover/selection.

4. **Handloom Silk Archive Deck (`FannedDeck.tsx`)**:
   - Parabolic fanned handloom silk swatch deck showcasing Kanchipuram, Banarasi, Chanderi, and Tussar weaves.

5. **Salon Concierge & Bespoke Trunk**:
   - WhatsApp concierge consultation pre-fill for private flagship appointments.
   - Slide-over bespoke cart drawer tracking customized bridal ensembles.
   - Real-time **Pitch Mode** boutique re-brander modal.

---

## 🚀 Quick Start

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

---

## 🛠️ Tech Stack
- **Framework**: React 18 + TypeScript + Vite
- **3D & Graphics**: Three.js (r128+)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Physics & Motion**: Custom requestAnimationFrame Spring Physics Loop
