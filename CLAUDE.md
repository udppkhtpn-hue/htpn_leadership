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
npm run test:load     # simulates N independent phones against the deployment
npm run backend:push  # clasp push of backend/ to the Apps Script project
npm run backend:deploy # push, then update the live deployment to a new version
```

The backend deploys with `clasp`, logged in as the account that owns the Sheet
(`ffairis@gmail.com`), with the Apps Script API enabled for that account. The
script id is in `.clasp.json`; neither it nor the `/exec` URL is a secret.

## Folder structure

```
backend/                 Code.gs + appsscript.json, pasted into the Apps Script editor
backend/test/harness.cjs Stubbed Apps Script runtime, run with npm run test:backend
public/media/            swenson.mp4, empathy.mp4
public/images/           1910-building.jpg and the rest of the archival photos
public/textures/         pre-rendered paper grain, tape, torn edges, halftone, ink blots
src/config.ts            Apps Script URL, join URL, poll intervals. No secrets.
src/lib/                 router, BroadcastChannel, deviceId, keys, time, api, polling
src/state/               PresentationProvider — the shared live state
src/content/             sections.ts, prompts.ts, scenarios.ts, goleman.ts, types.ts
src/collage/             PhotoCutout, Clipping, TapeStrip, InkBlot, LineDrawing, Stamp, TornSheet
src/sections/            one component per section type
src/modules/             WordCloud, Board, Vote — Screen (projector) + Phone (audience)
src/routes/              Present, Presenter, Join, Placeholder, Styleguide, Test, Print
src/styles/              theme.css (tokens), global.css, presenter.css
```

## The teaching spine

The talk is one spine, "Leading Self and Others", in seven blocks. Every block
repeats the same four beats:

| Beat | What it is |
|---|---|
| Teach | `framework` screens — one model drawn per screen, revealed element by element |
| Show | a story, a number or a clip that makes the model real |
| Try | the room does something: a word cloud, a board, a vote |
| Key | a `keyidea` screen: one line, typed, closing the block |

- A `framework` screen is a specimen sheet: small typewritten header (name,
  one-sentence definition), the model drawn large as the hero, source stamped
  into the corner. **No claim reaches the projector without its author and
  year.**
- **Progressive reveal.** `steps` on a section is how many clicker presses it
  takes before moving on; `stepNotes[]` is what to say at each one. The reveal
  step lives in `LiveState.step`, so `#/present` and `#/presenter` stay in
  step over BroadcastChannel. Stepping *backwards* into a screen lands on its
  last step, so a model is never replayed by accident.
- **`block` puts a screen on the progress map** (`src/content/blocks.ts`):
  four stations, Leadership → Leading Self (Purpose · EI) → Leading Others
  (Trust · Styles) → Legacy. The map is suppressed on act cards, the cold open
  and the close.
- **A model that is specified but not drawn renders a visible `[TODO]` plate**,
  never an empty sheet, so a gap is obvious in rehearsal. Every model kind in
  `types.ts` is now drawn; a new kind needs its own component before it ships.
- **Framework figures are sized height-first** — `height: 100%` plus
  `aspect-ratio`, with `max-width` as the cap. Sizing one width-first clamps
  only its height, and the parts inside, which take their size from the width,
  then hang off the bottom of a sheet that cannot scroll. For the same reason a
  figure's grid row is `minmax(0, 1fr)`, never `1fr`.
- **One source of truth for the six styles:** `src/content/styles.ts`. The vote
  reveal reads its labels and correlations from the same cards the framework
  screen reveals, so the two can never disagree about a number.

## Rules

- **The session's own facts live on the title screen** (`titlecard`), and the
  index page reads them from there through `SESSION`, so the projector and the
  link can never disagree about the date or who is giving it.
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
  results, every 2.5 s, and only while a module is open. Measured on this
  deployment: 150 independent clients reading state in parallel all answer
  within 4.3 s (p50 2.2 s), with no failures.
- **Every sheet write calls `SpreadsheetApp.flush()`,** and results cache for 4 s,
  not 30 s. An append is not reliably visible to the next execution, so without
  the flush a short-lived stale read gets cached as the truth and a vote appears
  to vanish for the rest of the TTL.
- **Apps Script serialises requests sharing one client session.** Any load test
  driven from a single browser tab queues behind itself and reports failures
  that will not happen in the room — use `npm run test:load` for real numbers.
- **Static sections must work offline** once loaded. Live sections degrade to a
  printed-card fallback when the backend is unreachable, and `#/presenter` says
  so loudly.
- **Respect `prefers-reduced-motion`,** plus the "Reduced effects" toggle on the
  console. 60 fps on an average office laptop driving a projector: pre-rendered
  textures, no per-frame SVG filters.
- **Display type is sized against the length of its line** (`displaySize` in
  `SectionScreen.tsx`), not by the viewport alone. A projector cannot scroll, so
  a long headline at a fixed fluid size runs off the sheet.
- **Never size a hero column in `ch`.** It resolves against the inherited 16px
  body font, not the display face, so a column meant to be 1100px comes out at
  180px and the headline wraps to shreds.
- **Only the phone route loads eagerly.** Everything else is `lazy`, so `#/join`
  never downloads Motion or the collage components (74 KB gzipped, not 148).
- **No Tailwind utility soup for the collage.** Tokens and purpose-named classes;
  Tailwind is there for layout plumbing, not as the visual layer.
- **No base64 images in source.** Media lives in `public/` and is referenced by
  path. Images under 500 KB, videos under 10 MB.
- **Never `git push` without Ferwahn's explicit approval.**

## Build phases

1. ✅ Scaffold, routing, BroadcastChannel sync, presenter controls, placeholder sections.
2. ✅ `#/styleguide` — every collage component, palette, type scale, each motion. Awaiting the check on the hospital projector.
3. ✅ `/backend` Apps Script + `SETUP.md`. Deployed; the URL is in `src/config.ts`.
4. ✅ Live modules wired to the backend, phone UIs, moderation queue, `#/test` and `npm run test:load`.
5. ✅ Full content screens, `#/print`, service worker, `web-design-guidelines` audit, deployed.

Live at **https://udppkhtpn-hue.github.io/htpn_leadership/** — `#/present` on the
projector, `#/presenter` on the laptop, `#/join` on phones (the QR code on screen
points there). Every push to `main` redeploys it.

Media and copy still outstanding: see `ASSETS.md`.

## Working on another machine

`git clone` then `npm ci` gets you a working checkout — Node 24, the same
version CI builds with. Three things the repository deliberately does not
carry:

- **`reference/`** — the four source PDFs (ASB's deck, the two HBR articles,
  the Iclif piece). Gitignored: the Goleman reprint is watermarked for NHS
  Leadership Academy use only and the ASB deck is not for public sharing, so
  they are never committed and never served. Copy the folder across by hand.
- **`public/media/`** — `swenson.mp4` and `empathy.mp4` still do not exist
  anywhere. Those two screens show a labelled placeholder until they do.
- **clasp's credentials** — `.clasp.json` is in the repository and is not a
  secret, but the login lives in `~/.clasprc.json`. Run `clasp login` as
  `ffairis@gmail.com` before `npm run backend:push`.

Nothing else is machine-specific. The Apps Script URL is in `src/config.ts`
and is public by design; the presenter PIN lives only in Apps Script
Properties, so there is nothing local to copy.

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
