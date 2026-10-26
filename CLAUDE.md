# HTPN Leadership — Project Instructions

"HTPN Lead Live" — the live presentation web app for *Be the Senior You Needed:
Leadership Is a Choice, Not a Rank*, a 45–60 minute leadership talk to doctors at
Hospital Tengku Permaisuri Norashikin, Kajang. It replaces PowerPoint entirely.

Three views, one app:

| Route | Who sees it |
|---|---|
| `#/present` | The projector. Fullscreen, no UI chrome, ever. |
| `#/presenter` | The laptop console. PIN-gated. Current + next section, notes, timers, moderation. |
| `#/join` | The audience's phones, reached by the QR code on screen. |

Support routes: `#/styleguide` (collage components), `#/test` (150 simulated
phones), `#/print` (backup PDF of the static sections).

## Stack

| Package | Version |
|---|---|
| vite | 8.3.5 |
| @vitejs/plugin-react | 6.1.2 |
| react / react-dom | 19.3.1 |
| typescript | 7.0.2 |
| tailwindcss + @tailwindcss/vite | 4.3.3 |
| motion | 14.6.0 |
| qrcode | 1.5.4 |
| @fontsource Anton · Playfair Display · Libre Caslon Text · Special Elite · IBM Plex Mono | 5.3.0 |

Back end: Google Sheets + Apps Script web app, source in `/backend`, deployed by
hand (see `SETUP.md`). Front end: static, GitHub Pages, repo
`udppkhtpn-hue/htpn_leadership`, so **Vite `base` is `/htpn_leadership/`** and
routing is hash-based — GitHub Pages has no server-side rewrites.

## Commands

```bash
npm run dev        # vite dev server on :5173
npm run build      # tsc --noEmit && vite build
npm run preview    # serve dist on :4173
npm run typecheck  # tsc --noEmit
npm run test:backend  # runs backend/Code.gs against a stubbed Apps Script runtime
```

## Folder structure

```
backend/                 Code.gs + appsscript.json, pasted into the Apps Script editor
backend/test/harness.cjs Stubbed Apps Script runtime, run with npm run test:backend
public/media/            swenson.mp4, empathy.mp4
public/images/           1910-building.jpg and the rest of the archival photos
public/textures/         pre-rendered paper grain, tape, torn edges, halftone, ink blots
src/config.ts            Apps Script URL, join URL, poll intervals. No secrets.
src/lib/                 router, BroadcastChannel, deviceId, keys, time
src/state/               PresentationProvider — the shared live state
src/content/             sections.ts, prompts.ts, scenarios.ts, goleman.ts, types.ts
src/collage/             PhotoCutout, Clipping, TapeStrip, InkBlot, LineDrawing, Stamp, TornSheet
src/sections/            one component per section type
src/modules/             WordCloud, Board, Vote — Screen (projector) + Phone (audience)
src/routes/              Present, Presenter, Join, Placeholder, Styleguide, Test, Print
src/styles/              theme.css (tokens), global.css, presenter.css
```

## Rules

- **All content lives in `src/content/sections.ts`.** Copy, order, timings and
  presenter notes change there, never in a component. `TODO_WRITE` marks copy
  still waiting on Ferwahn's words.
- **The palette is closed:** cobalt `#1D3FC4`, cream `#EFE6D2`, black `#141210`,
  sepia `#8A6640`, light sepia `#C9AE88`. Nothing outside it but transparency of
  those five. Tokens are defined once in `src/styles/theme.css`.
- **One hero per `#/present` screen,** readable from the back row of a 150-seat
  hall on a dim projector. Rotation no more than ±3°. Collage layers sit behind
  it at reduced contrast and never obscure it. Live results sit on a torn cream
  sheet.
- **Dark only.** No light/dark toggle anywhere.
- **No personal data, ever.** No names, emails, phone numbers, IC numbers or
  patient details are collected or displayed. `deviceId` is a random UUID in
  `localStorage`.
- **No secrets in the front end.** The presenter PIN lives in Apps Script
  Properties as `PRESENTER_PIN`. The Apps Script URL is public by design.
- **Browser POSTs to Apps Script use `Content-Type: text/plain`** to avoid a CORS
  preflight, and must follow Apps Script's redirect.
- **Design for ~30 concurrent Apps Script executions:** phones poll state every
  9 s with jitter and pause when hidden; only the projector and console poll
  results, every 2.5 s, and only while a module is open.
- **Static sections must work offline** once loaded. Live sections degrade to a
  printed-card fallback when the backend is unreachable, and `#/presenter` says
  so loudly.
- **Respect `prefers-reduced-motion`,** plus the "Reduced effects" toggle on the
  console. 60 fps on an average office laptop driving a projector: pre-rendered
  textures, no per-frame SVG filters.
- **No Tailwind utility soup for the collage.** Tokens and purpose-named classes;
  Tailwind is there for layout plumbing, not as the visual layer.
- **No base64 images in source.** Media lives in `public/` and is referenced by
  path. Images under 500 KB, videos under 10 MB.
- **Never `git push` without Ferwahn's explicit approval.**

## Build phases

1. ✅ Scaffold, routing, BroadcastChannel sync, presenter controls, placeholder sections.
2. ✅ `#/styleguide` — every collage component, palette, type scale, each motion. Awaiting the check on the hospital projector.
3. ✅ `/backend` Apps Script + `SETUP.md` written and logic-tested. Still to be deployed by hand; the URL then goes in `src/config.ts`.
4. Live modules wired to the backend, then `#/test` with 150 simulated phones.
5. Full content screens, `#/print`, service worker, `web-design-guidelines` audit, GitHub Pages deploy.

## Design tools

### Always load `frontend-design` first
Before building or changing **any** UI in this project, load the `frontend-design`
skill (`.claude/skills/frontend-design/`). No exceptions — new components, layout
changes, restyling, or copy-level visual tweaks all count. It sets the aesthetic
direction so we never ship templated defaults.

### 21st.dev MCP — patterns only, never styling
Use the 21st.dev MCP (server `21st`) to pull **component patterns** — structure,
states, interaction behaviour, accessibility wiring. Then restyle every component
into our collage design system before it goes anywhere near a commit.

The tools are `search` (find a catalog component), `get_component` (fetch its
code), `search_logo` (brand logo as JSX/TSX), `get_inspiration` and `get_theme`.
There is no `/ui` command, and the old "Magic" tool names
(`21st_magic_component_builder`, `logo_search`) are legacy aliases — don't use
them. Before reaching for `generate`, check `get_usage.aiGenerationEnabled`:
hosted AI is a separate entitlement, and when it's off, use `search` +
`get_component` and build the UI yourself rather than working around it.

**Never ship 21st.dev default styling.** That means no stock Tailwind utility
soup, no default shadcn tokens, no borrowed colour palettes or type scales.
Treat whatever `get_component` returns as a wireframe: keep the markup and logic,
replace the entire visual layer with our own CSS custom properties, collage
textures, hard offset shadows, and type stack.

### Pre-deploy audit with `web-design-guidelines`
Before **every** deploy, run the `web-design-guidelines` skill
(`.claude/skills/web-design-guidelines/`) as an audit against both routes:

- `#/present`
- `#/join`

Fix everything it flags — accessibility, semantics, focus handling, contrast,
touch targets, reduced-motion.

**Constraint:** fixes must not change the collage style. The audit is there to
make the collage accessible and correct, not to sand it into a generic
component-library look. If a guideline appears to conflict with the collage
aesthetic, satisfy the guideline's *intent* (contrast ratio, focus visibility,
hit area) while keeping the visual language intact.
