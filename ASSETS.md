# Media the talk still needs

Drop these into the paths below and they appear automatically — every one is
already referenced from `src/content/sections.ts`. Until a file exists, the
screen shows a labelled sepia placeholder rather than a broken image, so the
talk runs either way.

Keep images under 500 KB and videos under 10 MB. Grayscale or sepia, no stock
photography of models.

## Video — `public/media/`

| File | Used on |
|---|---|
| `swenson.mp4` | Block 4, after the circle of safety |
| `empathy.mp4` | Block 3, after the five EI cards |

Both play on entering the section and pause on `B`. Add burned-in or sidecar
captions if you can: a hall of 150 will not all hear a laptop's audio.

## Photographs — `public/images/`

| File | Used on |
|---|---|
| `kajang-hospital-1984.jpg` ✅ | Cold open, the 135-year timeline, and the return — the same element each time |
| `landing-collage.jpg` ✅ | The title screen, mounted whole down the right of the sheet |
| `ward-corridor.jpg` ✅ | Cold open margin |
| `ward-corridor-collage.jpg` ✅ | Cold open margin — arrives already torn and taped, so it is not cut out again (`plain: true`) |

Nothing else is referenced. Any further photograph needs a line in
`src/content/sections.ts` before it will appear.

The cold-open photograph carries the most weight: it opens the talk and returns
in the legacy block as the same element. It is captioned **1984**, the year the
photograph was taken, on both screens.

Images dropped in here are resized to fit under 500 KB and converted to JPEG;
PNG screenshots of photographs are several times larger for no visible gain.
A piece that was assembled by hand and already carries the palette is mounted
with `tone="none"` so it is not greyed and sepia'd a second time.

## Design sources — `design/`

The full-resolution originals, kept out of `public/` so they are never served:

| File | Shipped as |
|---|---|
| `Landing Page.png` | `public/images/landing-collage.jpg`, cropped to drop the black band across the lower third and saved at 201 KB |

An image that already arrives as a collage piece — torn, taped, on its own
ground — gets `plain: true` in its `extras` entry so `PhotoCutout` does not cut
it out a second time.

## Textures — `public/textures/`

Already generated as SVG (`paper-grain.svg`, `paper-fibre.svg`, `halftone.svg`).
If you have scanned paper, tape or ink PNGs, drop them in and say so — the
components will be pointed at them instead.

## Copy still to write

`TODO_WRITE` in `src/content/sections.ts` and `src/content/scenarios.ts`:

- the Act I cost statistic, its label and its source
- the sentence that closes Act I
- attribution lines for both videos
- the four lines of the one-shift timeline
- three of the four "Boss or Leader?" scenarios (the K+ 6.8 one is complete)
