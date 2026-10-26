import { useState, type ReactNode } from 'react'
import '../styles/collage.css'
import '../styles/styleguide.css'
import {
  Clipping,
  Drop,
  EffectsProvider,
  InkBlot,
  LineDrawing,
  PaperGrain,
  PeelAway,
  PhotoCutout,
  Sheet,
  SplitFlapNumber,
  Stamp,
  TapeStrip,
  TornSheet,
  type DrawingName,
} from '../collage'
import { WordField, SAMPLE_WORDS } from '../modules/WordCloud/WordField'
import { VoteBars } from '../modules/Vote/VoteBars'
import { Note, SAMPLE_NOTES } from '../modules/Board/Note'
import { SCENARIOS } from '../content/scenarios'
import { go } from '../lib/router'

const PALETTE = [
  { name: 'Cobalt', hex: '#1D3FC4', use: 'Accent, big type, ink blots' },
  { name: 'Cream', hex: '#EFE6D2', use: 'Paper base' },
  { name: 'Black', hex: '#141210', use: 'Type, line drawings' },
  { name: 'Sepia', hex: '#8A6640', use: 'Photographs, aged clippings' },
  { name: 'Light sepia', hex: '#C9AE88', use: 'Clipping stock, tape' },
]

const TYPE_SCALE = [
  { token: '--text-number', face: 'var(--font-display)', sample: '1889' },
  { token: '--text-hero', face: 'var(--font-display)', sample: 'Be the senior you needed.' },
  { token: '--text-statement', face: 'var(--font-serif)', sample: 'Leadership is a choice.' },
  { token: '--text-title', face: 'var(--font-serif)', sample: 'What drains you?' },
  { token: '--text-lead', face: 'var(--font-body)', sample: 'The smallest unit of leadership is one handover done properly.' },
  { token: '--text-body', face: 'var(--font-body)', sample: 'Body copy, used on clippings and the phone screen.' },
  { token: '--text-stamp', face: 'var(--font-type)', sample: 'WARD 7 · 1910' },
]

const DRAWINGS: DrawingName[] = ['hand', 'stethoscope', 'lamp', 'window', 'circle-of-figures']

function Plate({
  id,
  title,
  note,
  children,
}: {
  id: string
  title: string
  note?: string
  children: ReactNode
}) {
  return (
    <section className="sg__plate" id={id}>
      <div className="sg__plate-head">
        <h2 className="sg__plate-title">{title}</h2>
        {note ? <p className="sg__plate-note">{note}</p> : null}
      </div>
      {children}
    </section>
  )
}

export function Styleguide() {
  const [cycle, setCycle] = useState(0)
  const [reduced, setReduced] = useState(false)
  const [idle, setIdle] = useState(true)
  const [sheet, setSheet] = useState(0)
  const [peeled, setPeeled] = useState(false)
  const [morphSlot, setMorphSlot] = useState<'a' | 'b'>('a')
  const [revealed, setRevealed] = useState(false)
  const scenario = SCENARIOS[0]

  const replay = () => {
    setCycle((c) => c + 1)
    setPeeled(false)
    setRevealed(false)
  }

  const morphPhoto = (
    <PhotoCutout
      key="morph"
      seed="sg-morph"
      morphId="sg-morph-photo"
      alt="1910 building"
      rotate={-2}
      idle={false}
      style={{ width: '100%', aspectRatio: '4 / 3' }}
    />
  )

  return (
    <EffectsProvider reduced={reduced}>
      <div className="sg" data-idle={idle}>
        <div className="sg__bar">
          <strong style={{ fontWeight: 500 }}>Styleguide</strong>
          <button type="button" onClick={replay}>
            Replay motion
          </button>
          <button type="button" aria-pressed={reduced} onClick={() => setReduced((v) => !v)}>
            Reduced effects
          </button>
          <button type="button" aria-pressed={idle} onClick={() => setIdle((v) => !v)}>
            Idle motion
          </button>
          <span style={{ flex: 1 }} />
          <button type="button" onClick={() => go('present')}>
            #/present
          </button>
          <button type="button" onClick={() => go('home')}>
            Index
          </button>
        </div>

        <Plate
          id="palette"
          title="Palette"
          note="Five values and nothing else but their transparency. Cobalt carries every accent; sepia and light sepia carry everything photographic or aged."
        >
          <div className="sg__grid">
            {PALETTE.map((colour) => (
              <div key={colour.hex}>
                <div className="sg__swatch" style={{ background: colour.hex }} />
                <p className="sg__caption">
                  {colour.name} · {colour.hex}
                  <br />
                  {colour.use}
                </p>
              </div>
            ))}
          </div>
        </Plate>

        <Plate
          id="type"
          title="Type scale"
          note="Anton for statements and figures, Playfair Display for quotes and questions, Libre Caslon Text for body and clippings, Special Elite for stamps and data labels. Sizes are fluid; the top of the scale is set for the back row of a 150-seat hall."
        >
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {TYPE_SCALE.map((step) => (
              <div key={step.token}>
                <p
                  style={{
                    margin: 0,
                    fontFamily: step.face,
                    fontSize: `var(${step.token})`,
                    lineHeight: 1.05,
                  }}
                >
                  {step.sample}
                </p>
                <p className="sg__caption">{step.token}</p>
              </div>
            ))}
          </div>
        </Plate>

        <Plate
          id="paper"
          title="Paper"
          note="Cream base, pre-rendered grain multiplied over it, coarse fibre blotching, two fold creases with a highlight beside the shadow, and darkened edges. Density follows the act: 3 in Act I, 2 in Act II, 1 in Act III."
        >
          <div className="sg__grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
            {([3, 2, 1] as const).map((density) => (
              <div key={density}>
                <div className="sg__stage poster" data-act={density === 3 ? 1 : density === 2 ? 2 : 3}>
                  <div className="poster-creases" aria-hidden="true" />
                  <PaperGrain density={density} />
                </div>
                <p className="sg__caption">
                  Grain density {density} · Act {density === 3 ? 'I' : density === 2 ? 'II' : 'III'}
                </p>
              </div>
            ))}
          </div>
        </Plate>

        <Plate
          id="photos"
          title="PhotoCutout"
          note="Grayscale or sepia photographs with torn or scissor-cut edges, optional newsprint halftone, rotated between −6° and +6°. The tear is deterministic per seed, so a piece lands in the same place on every reload. Placeholders stand in until the archival photographs arrive."
        >
          <div className="sg__grid">
            {(
              [
                { seed: 'sg-a', edge: 'torn', tone: 'sepia', halftone: false, label: 'torn · sepia' },
                { seed: 'sg-b', edge: 'scissor', tone: 'grayscale', halftone: false, label: 'scissor · grayscale' },
                { seed: 'sg-c', edge: 'torn', tone: 'sepia', halftone: true, label: 'torn · halftone' },
                { seed: 'sg-d', edge: 'scissor', tone: 'sepia', halftone: true, label: 'scissor · halftone' },
              ] as const
            ).map((variant) => (
              <div key={variant.seed}>
                <PhotoCutout
                  seed={variant.seed}
                  alt="ward corridor"
                  edge={variant.edge}
                  tone={variant.tone}
                  halftone={variant.halftone}
                  style={{ width: '100%', aspectRatio: '4 / 3' }}
                />
                <p className="sg__caption">{variant.label}</p>
              </div>
            ))}
          </div>
        </Plate>

        <Plate
          id="clippings"
          title="Clipping"
          note="A column cut from a newspaper: kicker, rule, serif headline, justified body on yellowed stock. Statistics and quotations live here rather than on the bare paper."
        >
          <div className="sg__grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            <Clipping
              seed="sg-clip-1"
              kicker="Ward report · 1910"
              headline="The hospital was here before you"
              body="Opened in 1889 and still receiving patients, the building has outlasted every roster, every reorganisation and every head of department who ever worked in it. What it keeps is not the names on the door but the habits handed from one shift to the next."
            />
            <Clipping
              seed="sg-clip-2"
              columns={1}
              kicker="Finding"
              headline="Climate follows the senior"
              body="Of the six styles measured, authoritative leadership showed the strongest single correlation with working climate at +.54, while coercive leadership ran against it at −.26."
            />
          </div>
        </Plate>

        <Plate
          id="tape-stamps"
          title="TapeStrip and Stamp"
          note="Masking tape with frayed ends, laid over edges at a slight angle. Stamps are typewriter labels or rubber-stamped boxes, used for dates, ward numbers and sources."
        >
          <div className="sg__grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            <div>
              <div
                style={{
                  position: 'relative',
                  height: '9rem',
                  background: 'color-mix(in srgb, var(--color-sepia-light) 30%, var(--color-cream))',
                }}
              >
                <TapeStrip seed="sg-tape-1" length="10rem" style={{ top: '1.2rem', left: '-1rem' }} />
                <TapeStrip seed="sg-tape-2" length="7rem" style={{ bottom: '1.5rem', right: '-0.5rem' }} />
              </div>
              <p className="sg__caption">Two strips, angled and frayed</p>
            </div>
            <div style={{ display: 'grid', gap: '1rem', alignContent: 'start' }}>
              <Stamp seed="sg-stamp-1">WARD 7 · 1910</Stamp>
              <Stamp seed="sg-stamp-2" variant="rubber">
                HTPN · KAJANG
              </Stamp>
              <Stamp seed="sg-stamp-3">Goleman, HBR, 2000</Stamp>
              <p className="sg__caption">Typewriter label and rubber stamp</p>
            </div>
          </div>
        </Plate>

        <Plate
          id="ink"
          title="InkBlot"
          note="Organic cobalt blots with a watercolour bleed, multiplied into the paper. They mark act cards and the close, and sit in the margins everywhere else."
        >
          <div className="sg__grid">
            {(
              [
                { seed: 'sg-blot-1', size: '9rem', opacity: 0.6, bleed: true },
                { seed: 'sg-blot-2', size: '12rem', opacity: 0.45, bleed: true },
                { seed: 'sg-blot-3', size: '7rem', opacity: 0.75, bleed: false },
              ] as const
            ).map((blot) => (
              <div key={blot.seed}>
                <div style={{ position: 'relative', height: '13rem' }}>
                  <InkBlot
                    seed={blot.seed}
                    size={blot.size}
                    opacity={blot.opacity}
                    bleed={blot.bleed}
                    style={{ top: '0.5rem', left: '1rem' }}
                  />
                </div>
                <p className="sg__caption">
                  {blot.size} · opacity {blot.opacity}
                  {blot.bleed ? ' · bleed' : ''}
                </p>
              </div>
            ))}
          </div>
        </Plate>

        <Plate
          id="drawings"
          title="LineDrawing"
          note="Single-line black illustrations. They can be drawn on as a section arrives — press Replay motion to see the stroke land."
        >
          <div className="sg__grid">
            {DRAWINGS.map((name, index) => (
              <div key={name}>
                <div style={{ position: 'relative', height: '11rem' }}>
                  <LineDrawing
                    key={`${name}-${cycle}`}
                    name={name}
                    size="10rem"
                    draw
                    delay={index * 0.12}
                    style={{ top: 0, left: '50%', translate: '-50% 0' }}
                  />
                </div>
                <p className="sg__caption">{name}</p>
              </div>
            ))}
          </div>
        </Plate>

        <Plate
          id="live"
          title="Live results"
          note="Every live module sits on a torn cream sheet pinned into the collage, so results stay clean. Words spring in and push their neighbours aside; vote bars grow like paper strips and flip to show their Goleman style on reveal; notes flutter in and are taped down."
        >
          <div style={{ display: 'grid', gap: 'clamp(1.5rem, 4vw, 3rem)' }}>
            <TornSheet seed={`sg-words-${cycle}`}>
              <WordField key={`words-${cycle}`} words={SAMPLE_WORDS} />
            </TornSheet>

            <TornSheet seed="sg-vote">
              <div style={{ display: 'grid', gap: '1.25rem' }}>
                <p style={{ margin: 0, fontFamily: 'var(--font-body)', fontSize: 'var(--text-title)', lineHeight: 1.3 }}>
                  {scenario.vignette}
                </p>
                <VoteBars
                  key={`vote-${cycle}-${revealed}`}
                  options={scenario.options}
                  counts={{ A: 11, B: 24, C: 57, D: 19 }}
                  revealed={revealed}
                />
                <button
                  type="button"
                  onClick={() => setRevealed((v) => !v)}
                  style={{
                    justifySelf: 'start',
                    font: 'inherit',
                    fontFamily: 'var(--font-type)',
                    background: 'transparent',
                    border: '2px solid var(--color-cobalt)',
                    color: 'var(--color-cobalt)',
                    padding: '0.5rem 0.9rem',
                    minHeight: '44px',
                    cursor: 'pointer',
                  }}
                >
                  {revealed ? 'Hide results (R)' : 'Reveal results (R)'}
                </button>
              </div>
            </TornSheet>

            <TornSheet seed="sg-board">
              <div className="sg__grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
                {(['drains', 'energises'] as const).map((column) => (
                  <div key={column}>
                    <p
                      style={{
                        margin: '0 0 1rem',
                        fontFamily: 'var(--font-display)',
                        fontSize: 'var(--text-title)',
                        color: column === 'drains' ? 'var(--color-sepia)' : 'var(--color-cobalt)',
                      }}
                    >
                      {column === 'drains' ? 'Drains me' : 'Energises me'}
                    </p>
                    <ul style={{ display: 'grid', gap: '1.4rem', margin: 0, padding: 0 }}>
                      {SAMPLE_NOTES.filter((note) => note.column === column).map((note, index) => (
                        <Note key={`${note.id}-${cycle}`} note={note} index={index} />
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </TornSheet>
          </div>
        </Plate>

        <Plate
          id="motion"
          title="Motion"
          note="Pieces are dropped onto the poster and settle on a spring, their shadow tightening as they land. A section change lays a new sheet over the old one. Figures arrive like a split-flap board. The close peels the collage away. The 1910 photograph morphs between sections rather than being redrawn."
        >
          <div className="sg__grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            <div>
              <div style={{ position: 'relative', height: '15rem' }}>
                <Drop key={`drop-${cycle}`} seed="sg-drop" delay={0.1} style={{ width: '70%' }}>
                  <PhotoCutout seed="sg-drop-photo" alt="staff portrait" idle={false} style={{ width: '100%', aspectRatio: '3 / 4' }} />
                </Drop>
              </div>
              <p className="sg__caption">Drop · spring settle, shadow tightens on landing</p>
            </div>

            <div>
              <div className="sg__stage" style={{ aspectRatio: '4 / 3', background: 'var(--color-cream)' }}>
                <Sheet sheetKey={`sheet-${sheet}`}>
                  <div
                    className="poster"
                    style={{ display: 'grid', placeContent: 'center', textAlign: 'center', padding: '1.5rem' }}
                  >
                    <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 'var(--text-title)' }}>
                      Sheet {sheet + 1}
                    </p>
                  </div>
                </Sheet>
              </div>
              <button type="button" className="sg__caption" onClick={() => setSheet((s) => s + 1)} style={{ background: 'none', border: 0, padding: '0.5rem 0', cursor: 'pointer', minHeight: '44px' }}>
                Lay the next sheet over this one →
              </button>
            </div>

            <div>
              <p
                key={`flap-${cycle}`}
                style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 'var(--text-number)', lineHeight: 0.8, color: 'var(--color-cobalt)' }}
              >
                <SplitFlapNumber value="1889" delay={0.1} />
              </p>
              <p className="sg__caption">SplitFlapNumber · figures lock left to right</p>
            </div>

            <div>
              <div className="sg__stage" style={{ aspectRatio: '4 / 3', background: 'var(--color-cream)' }}>
                {[0, 1, 2].map((index) => (
                  <PeelAway key={`peel-${index}-${cycle}`} peeled={peeled} index={index}>
                    <div style={{ position: 'absolute', inset: 0, display: 'grid', placeContent: 'center' }}>
                      <PhotoCutout
                        seed={`sg-peel-${index}`}
                        alt="archive photograph"
                        idle={false}
                        rotate={index * 4 - 4}
                        style={{ width: '9rem', aspectRatio: '4 / 3' }}
                      />
                    </div>
                  </PeelAway>
                ))}
              </div>
              <button type="button" className="sg__caption" onClick={() => setPeeled((v) => !v)} style={{ background: 'none', border: 0, padding: '0.5rem 0', cursor: 'pointer', minHeight: '44px' }}>
                {peeled ? 'Put the pieces back →' : 'Peel the collage away →'}
              </button>
            </div>

            <div>
              <div className="sg__grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ minHeight: '7rem', outline: '1px dashed color-mix(in srgb, var(--color-sepia) 55%, transparent)' }}>
                  {morphSlot === 'a' ? morphPhoto : null}
                </div>
                <div style={{ minHeight: '7rem', outline: '1px dashed color-mix(in srgb, var(--color-sepia) 55%, transparent)' }}>
                  {morphSlot === 'b' ? morphPhoto : null}
                </div>
              </div>
              <button type="button" className="sg__caption" onClick={() => setMorphSlot((s) => (s === 'a' ? 'b' : 'a'))} style={{ background: 'none', border: 0, padding: '0.5rem 0', cursor: 'pointer', minHeight: '44px' }}>
                Morph the 1910 photograph across →
              </button>
            </div>
          </div>
        </Plate>

        <Plate
          id="acts"
          title="The three acts, at projector proportions"
          note="This is the legibility check: one hero per screen, rotated no more than ±3°, never obscured, with the collage in the margins and behind it at reduced contrast. Act I is dense and worn, Act II opens up and turns cobalt, Act III is nearly bare."
        >
          <div style={{ display: 'grid', gap: 'clamp(1.5rem, 4vw, 3rem)' }}>
            {/* Act I */}
            <div>
              <div className="sg__stage poster" data-act={1}>
                <div className="poster-creases" aria-hidden="true" />
                <PaperGrain density={3} />
                <div className="collage-layer">
                  <PhotoCutout seed="act1-ward" alt="ward corridor, 1970s" halftone style={{ position: 'absolute', top: '6%', left: '3%', width: '21%', aspectRatio: '4 / 3' }} />
                  <PhotoCutout seed="act1-hands" alt="hands at handover" style={{ position: 'absolute', bottom: '7%', left: '5%', width: '16%', aspectRatio: '1 / 1' }} />
                  <Clipping seed="act1-clip" kicker="Ward report" headline="Nobody said anything" body="The roster was short again. The note in the file said the patient had been reviewed. No one asked who had reviewed them, or when, or whether anyone had slept." style={{ position: 'absolute', top: '6%', right: '3%', width: '21%', opacity: 0.92 }} />
                  <InkBlot seed="act1-blot" size="13rem" opacity={0.3} style={{ bottom: '-3rem', right: '8%' }} />
                  <TapeStrip seed="act1-tape" length="7rem" style={{ top: '3%', left: '17%' }} />
                  <LineDrawing name="stethoscope" size="7rem" style={{ bottom: '6%', right: '3%', opacity: 0.5 }} />
                </div>
                <div style={{ position: 'absolute', inset: 0, display: 'grid', placeContent: 'center', justifyItems: 'center', padding: '2rem' }}>
                  <div className="hero" style={{ rotate: '-1.2deg', textAlign: 'center', maxWidth: 'min(58%, 26ch)' }}>
                    <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 'var(--text-hero)', lineHeight: 0.9 }}>
                      You have already led today.
                    </h3>
                  </div>
                </div>
              </div>
              <p className="sg__caption">Act I · dense, sepia, creased</p>
            </div>

            {/* Act II */}
            <div>
              <div className="sg__stage poster" data-act={2}>
                <div className="poster-creases" aria-hidden="true" />
                <PaperGrain density={2} />
                <div className="collage-layer">
                  <InkBlot seed="act2-blot-1" size="18rem" opacity={0.42} style={{ top: '-4rem', left: '-3rem' }} />
                  <InkBlot seed="act2-blot-2" size="10rem" opacity={0.3} style={{ bottom: '6%', right: '6%' }} />
                  <PhotoCutout seed="act2-portrait" alt="staff portrait" edge="scissor" style={{ position: 'absolute', bottom: '10%', left: '7%', width: '18%', aspectRatio: '3 / 4' }} />
                  <LineDrawing name="circle-of-figures" size="9rem" tone="cobalt" style={{ top: '12%', right: '8%', opacity: 0.55 }} />
                </div>
                <div style={{ position: 'absolute', inset: 0, display: 'grid', placeContent: 'center', justifyItems: 'center', padding: '2rem' }}>
                  <div className="hero" style={{ rotate: '0.8deg', textAlign: 'center', maxWidth: 'min(62%, 28ch)' }}>
                    <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 'var(--text-number)', lineHeight: 0.8, color: 'var(--color-cobalt)' }}>
                      <SplitFlapNumber key={`act2-${cycle}`} value="54" delay={0.2} />
                    </p>
                    <p style={{ margin: '0.5rem 0 0', fontFamily: 'var(--font-body)', fontSize: 'var(--text-title)' }}>
                      Authoritative leadership, correlation with climate.
                    </p>
                  </div>
                </div>
              </div>
              <p className="sg__caption">Act II · cobalt, open, fewer layers</p>
            </div>

            {/* Act III */}
            <div>
              <div className="sg__stage poster" data-act={3}>
                <div className="poster-creases" aria-hidden="true" />
                <PaperGrain density={1} />
                <div className="collage-layer">
                  <InkBlot seed="act3-blot" size="11rem" opacity={0.5} style={{ bottom: '12%', left: '12%' }} />
                </div>
                <div style={{ position: 'absolute', inset: 0, display: 'grid', placeContent: 'center', justifyItems: 'center', padding: '2rem' }}>
                  <div className="hero" style={{ textAlign: 'center', maxWidth: 'min(72%, 24ch)' }}>
                    <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: 'var(--text-hero)', lineHeight: 0.9 }}>
                      Be the senior you needed.
                    </h3>
                  </div>
                </div>
              </div>
              <p className="sg__caption">Act III · quiet, one blot, one line</p>
            </div>
          </div>
        </Plate>
      </div>
    </EffectsProvider>
  )
}
