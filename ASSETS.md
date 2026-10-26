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
| `swenson.mp4` | Act I, after the drains board |
| `empathy.mp4` | Act II, after the climate figure |

Both play on entering the section and pause on `B`. Add burned-in or sidecar
captions if you can: a hall of 150 will not all hear a laptop's audio.

## Photographs — `public/images/`

| File | Used on |
|---|---|
| `kajang-hospital-1984.jpg` ✅ | Cold open, and again in Act III — the same element returns |
| `ward-corridor.jpg` ✅ | Cold open margin |
| `ward-corridor-collage.jpg` ✅ | Cold open margin — arrives already torn and taped, so it is not cut out again (`plain: true`) |
| `hands-handover.jpg` | "You have already led today" |
| `night-window.jpg` | Act I close |
| `staff-portrait-1.jpg` | spare, for any Act II screen |
| `staff-portrait-2.jpg` | spare |
| `staff-portrait-3.jpg` | spare |
| `htpn-facade-today.jpg` | spare |

The cold-open photograph carries the most weight: it opens the talk and returns
in Act III as the same element. It is captioned **1984**, the year the
photograph was taken, on both screens.

Images dropped in here are resized to fit under 500 KB and converted to JPEG;
PNG screenshots of photographs are several times larger for no visible gain.

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
