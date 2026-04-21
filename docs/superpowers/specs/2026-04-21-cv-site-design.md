# CV Site — Design Spec
_Date: 2026-04-21_

## Context

Emilio Spatola's CV exists as a single-file HTML prototype from Claude Design (`index.html`, ~870 lines). The goal is to re-implement it as a maintainable 11ty project: content editable without touching HTML, sections independently modifiable, and interactive behaviors in focused JS modules.

**Stack:** 11ty + Nunjucks + Tailwind CSS CLI + Vanilla JS  
**No React, no JSX. CSS Grid preferred over Flex.**

---

## Visual Design (from prototype)

- Dark background `#080808` with a subtle carbon-fiber weave pattern
- Accent color: **Violet** `oklch(0.71 0.22 285)` — fixed, no runtime switcher
- Fonts: `Rajdhani` (headings/body) + `JetBrains Mono` (labels/code/nav)
- HUD panels: semi-transparent with `clip-path` chamfered corners, 1px border `#2a2a2a`
- Boot screen: terminal-style text sequence that fades out before the main content appears (skipped on subsequent same-session visits via `sessionStorage`)
- Sections: Profile · Driver Brief · Experience · Skills · Education · Contact

---

## Project Structure

```
/
├── .eleventy.js            # 11ty config: input=src, output=_site, Nunjucks engine
├── package.json            # Scripts: dev, build
├── tailwind.config.js      # Content scan: src/**/*.njk, src/**/*.html, src/**/*.js
│
├── src/
│   ├── index.njk           # Page entry: layout + section includes
│   │
│   ├── _data/              # ← CONTENT LAYER — edit here to update the CV
│   │   ├── site.yaml       # Name, title, tagline, links, copyright year
│   │   ├── experience.yaml # Array of jobs: team, role, period, season, intro, bullets[], links[], stack[]
│   │   ├── skills.yaml     # Array of { cat, items[] }
│   │   ├── education.yaml  # degrees[], patents[], certs[]
│   │   └── boot.yaml       # Array of { text, type } for boot sequence
│   │
│   ├── _includes/
│   │   ├── layouts/
│   │   │   └── base.njk    # HTML shell, <head>, font links, CSS/JS refs
│   │   └── sections/
│   │       ├── header.njk   # Fixed top nav with live clock placeholder
│   │       ├── hero.njk     # Full-height profile section
│   │       ├── brief.njk    # Pull quote + My Story + In a Nutshell
│   │       ├── experience.njk  # Accordion cards ({% for %} over experience data)
│   │       ├── skills.njk      # Skill category grid ({% for %} over skills data)
│   │       ├── education.njk   # Degrees + patents + certs
│   │       ├── contact.njk     # Email / LinkedIn / GitHub cards
│   │       └── footer.njk
│   │
│   ├── css/
│   │   └── styles.css      # CSS variables, HUD component, animations, scrollbar
│   │
│   └── js/
│       ├── boot.js          # Boot screen: renders lines, fades out, sessionStorage guard
│       ├── interactions.js  # Live clock + experience card accordion
│       └── main.js          # init(): calls boot + interactions
│
└── _site/                  # Build output — git-ignored
```

---

## Layer Responsibilities

### `_data/` — Content
All CV content lives here in YAML files (natively supported by 11ty — no extra dependencies). To update a job, edit `experience.yaml`. No template or JS changes needed.

### `_includes/sections/` — Structure
Each `.njk` file owns one section's HTML structure. Uses `{% for %}` and `{% if %}` to iterate over data. No logic beyond iteration/conditionals — styling is done via CSS classes, behavior via JS data attributes.

### `css/styles.css` — Visual Design System
Contains:
- CSS custom properties: `--accent`, `--glow`
- Component classes: `.hud`, `.hud-sm`, `.btn-primary`, `.btn-ghost`, `.tag`, `.nav-link`, `.rail`, `.accent-rule`
- Animation keyframes: `bline`, `blink`, `sweep`, `fadeUp`
- Body texture: carbon-fiber `::before`, scanlines `::after`
- Scrollbar styles
- Section/container helpers: `.section`, `.container`, `.stat-strip`, `.stat-cell`
- Tailwind `@layer` directives where Tailwind utilities augment custom styles

Tailwind utility classes are used **in templates** for grid layout and spacing. Custom design-system classes are defined in `styles.css`.

### `js/` — Behavior
- `boot.js`: Reads boot sequence from a `data-boot` attribute on the `#boot` element (JSON-encoded from 11ty template), animates lines, fades out, reveals `#app`
- `interactions.js`: `startClock()` updates `#clock` every second; `initAccordion()` wires click handlers on `.exp-header` elements to toggle `.exp-body.open` and `.exp-chevron.open`
- `main.js`: Calls `init()` on `DOMContentLoaded`

---

## Grid-over-Flex Decisions

| Section | Original | New |
|---|---|---|
| Stat strip | `display:flex` | `display:grid; grid-template-columns: repeat(4, auto)` |
| Brief grid | already `display:grid` | keep |
| Contact cards | `display:flex; flex-wrap:wrap` | `display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr))` |
| Nav bar | `display:flex` | keep flex (single-axis horizontal nav) |
| CTA buttons | `display:flex` | keep flex (inline button row) |

---

## Build

```json
"scripts": {
  "dev":   "concurrently \"eleventy --serve\" \"tailwindcss -i src/css/styles.css -o _site/css/styles.css --watch\"",
  "build": "tailwindcss -i src/css/styles.css -o _site/css/styles.css --minify && eleventy"
}
```

Tailwind writes directly to `_site/css/styles.css`. 11ty writes HTML to `_site/`. No conflict.

---

## Verification

1. `npm run dev` — site serves at `http://localhost:8080`
2. Boot screen plays on first visit, skipped on page refresh (same session)
3. Experience cards expand/collapse on click
4. Clock in header ticks in real time
5. Accent color is violet throughout
6. All sections render data from `_data/*.json` (verify by changing a value and rebuilding)
7. `npm run build` produces a clean `_site/` with minified CSS
