# Bitumad — Website UI kit

High-fidelity, interactive recreation of the Bitumad marketing site (the real Next.js homepage,
`app/page.tsx`), rebuilt in React + Babel against the design-system tokens.

## Files
- `index.html` — mounts the full page; handles smooth-scroll nav + scroll-reveal.
- `kit.css` — page styles adapted from the codebase (`globals.css`, `Navbar.css`, `page.css`). Tokens come from `../../styles.css`.
- `Navbar.jsx` — fixed nav + mobile menu; `SiteFooter`.
- `Sections.jsx` — `Hero` (grid + Ken-Burns photo + ticker), `VideoStrip`, `About` (feature tiles), `SpecSheet` (ASTM table), `Process` (3 steps).
- `Devis.jsx` — interactive quote form: selectable project radios, fake submit → success state.

## Interactions
- Nav / footer links and hero CTAs **smooth-scroll** to sections.
- Mobile hamburger toggles the menu.
- Quote form: pick a project type (custom green radios), fill fields, **Envoyer ma demande** → success panel.
- Scroll-reveal staggers content in; the ticker loops; the hero video autoplays muted.

## Assets
- Logo: `../../assets/bitumad-logo-simple.webp`. Hero photo: `../../assets/bitumad-hero-route.jpg`.
- Video strip streams from the project's public R2 media domain (external).

This is a recreation for design reference — not production code.
