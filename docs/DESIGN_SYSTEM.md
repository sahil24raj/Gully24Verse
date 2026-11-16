# GULLYVERSE — DESIGN SYSTEM SPECIFICATION
**Version:** 1.0.0 (Production)  
**Framework:** Next.js 15, Tailwind CSS v4, Three.js, Lucide Icons

---

## 1. Color Palette Tokens & CSS Custom Properties

```css
:root {
  /* GullyVerse Core Brand Colors */
  --gv-primary: #FF9F1C;          /* Electric Saffron */
  --gv-primary-hover: #F08C0A;
  --gv-primary-glow: rgba(255, 159, 28, 0.35);

  --gv-secondary: #00BFA6;        /* Desi Teal */
  --gv-secondary-hover: #00A892;
  --gv-secondary-glow: rgba(0, 191, 166, 0.35);

  --gv-accent: #F04438;           /* Street Red */
  --gv-accent-glow: rgba(240, 68, 56, 0.35);

  --gv-gold: #FACC15;             /* Chai Gold */
  --gv-bg: #101014;               /* Midnight Charcoal */
  --gv-surface: #1B1B22;          /* Arcade Slate */
  --gv-surface-elevated: #262630;
  --gv-surface-high: #32323E;
  
  --gv-text-primary: #F8FAFC;
  --gv-text-secondary: #94A3B8;
  --gv-text-muted: #64748B;
  
  --gv-border-subtle: rgba(255, 255, 255, 0.08);
  --gv-border-brand: rgba(255, 159, 28, 0.3);
  --gv-border-teal: rgba(0, 191, 166, 0.3);
}
```

---

## 2. Component System Standards

### A. Action Buttons

1. **Primary Play CTA (`btn-gully-primary`):**
   - Background: `bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600`
   - Text: `text-slate-950 font-black tracking-wide uppercase`
   - Shadow: `shadow-[0_0_24px_rgba(255,159,28,0.4)]`
   - Hover: `hover:scale-[1.03] active:scale-[0.98] transition-all`
   - Click Sound: `soundFx.playGameStart()` or `soundFx.playClick()`

2. **Secondary Squad CTA (`btn-gully-secondary`):**
   - Background: `bg-gradient-to-r from-teal-500 to-emerald-500`
   - Text: `text-slate-950 font-black tracking-wide uppercase`
   - Shadow: `shadow-[0_0_24px_rgba(0,191,166,0.4)]`
   - Hover: `hover:scale-[1.03] active:scale-[0.98] transition-all`

3. **Ghost / Tertiary Action (`btn-gully-ghost`):**
   - Background: `bg-white/5 hover:bg-white/10`
   - Border: `border border-white/10 hover:border-amber-500/40`
   - Text: `text-slate-200 font-bold`

### B. Game Cards & 3D Tilt

- Base: Rounded 2xl or 3xl container with `bg-[#1B1B22]` and `border border-white/10`.
- Artwork: 16:9 or 4:3 high-res game banner with subtle inner vignette and custom genre tag (e.g., `3D DESI HIGHWAY`, `ENDLESS RUNNER`, `MULTIPLAYER BLUFFING`).
- Interactive State: Smooth CSS transition `group-hover:scale-[1.02]` with responsive glow reflection and audio feedback on click.

### C. 3D Canvas Scene Integration

- Canvas Container: Responsive height (380px mobile to 520px desktop), absolute/relative overlay.
- Low-poly procedural geometry: Indian Street Arcade machine, neon sign with Saffron & Teal point lights, animated Tata 1613 elements.
- WebGL Context Recovery: Handles `webglcontextlost` and `webglcontextrestored` safely.
- Motion Preferences: Automatically disables rotation if `prefers-reduced-motion` is active.

---

## 3. Responsive Breakpoints

- Mobile Small: `375px` (Zero horizontal overflow, compact 1-column layouts)
- Mobile Large: `390px - 480px`
- Tablet: `768px - 1023px` (2-column bento grid)
- Desktop: `1024px - 1439px` (3-column layout)
- Ultrawide: `1440px - 1920px` (Max container constrained to 1720px)
