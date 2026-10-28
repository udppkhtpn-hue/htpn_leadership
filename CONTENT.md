# What each page still needs

Audited on 28 October 2026 against the running order in
`src/content/sections.ts`. Page numbers are what you press on the console;
they move whenever a screen is added, so each item also gives the screen's
title. Copy lives in `src/content/sections.ts`, scenarios in
`src/content/scenarios.ts`.

Every teaching model is drawn, and nothing on the projector is copy I made up
for you. What is left is five things only you can supply, two loose ends on
the Swenson clip, and a timing problem with the short version.

| Page | Screen | What is missing | In the 45-minute cut? |
|---|---|---|---|
| 10 | Show — bullying | The figure, what it measured, the source | Yes |
| 21 | Show — empathy clip | The video and its caption | No |
| 34 | Try — Boss or Leader? scenario 2 | The whole scenario | Yes |
| 35 | Try — Boss or Leader? scenario 3 | The whole scenario, or drop it | No |
| 36 | Try — Boss or Leader? scenario 4 | The whole scenario, or drop it | No |

Pages 10 and 34 are all that stand between the 45-minute version and done.

---

## Page 10 — Show: bullying  *(empty)*

**Job:** the third number in Block 1, after 6,212 doctors who left and 13,072
empty posts. Your note for it: the one the room already knows; do not labour it.

**On screen now:** `TODO_WRITE %` and two `TODO_WRITE` lines.

**What I need:**

1. **The figure.** Four characters or fewer, so it sits at full size: `62%`,
   `1 in 4`.
2. **What it measures.** One line, under 90 characters.
3. **The source.** Study, journal and year, for the stamp. A link is enough:
   I will check the number against it before it goes on the projector, as I
   did for 6,212.

A Malaysian figure on junior doctors or housemen lands hardest after two MOH
numbers.

## Page 21 — Show: empathy clip  *(empty)*

**Job:** the Show beat of Block 3, straight after the five EI cards. It has a
3-minute slot.

**What I need:**

1. **The file**, dropped into `public/media/` like the Swenson clip. Any name
   is fine; I will rename it to `empathy.mp4`.
2. **One line of attribution** for under the frame: who, what, year.

Until then the screen shows a labelled placeholder, and the caption reads
`TODO_WRITE`. The 45-minute cut skips this page.

## Pages 34–36 — Try: Boss or Leader? scenarios 2, 3 and 4  *(empty)*

**Job:** more votes after the K+ 6.8 scenario (page 33), each revealing which
of Goleman's six styles the room reached for.

**On screen now:** `TODO_WRITE` as the vignette and as all four options, on all
three pages, and on the audience's phones when the vote opens.

**What I need for each, in `src/content/scenarios.ts`:**

1. **A vignette.** Two or three sentences, a real ward moment.
2. **Four options**, each under 110 characters.
3. **Which style each option is:** coercive, pacesetting, affiliative,
   democratic, coaching or authoritative.

The K+ 6.8 scenario works because every option is defensible and the trap (D,
warmth without standards) is the one people pick. Aim for the same shape.

Scenario 2 is in both versions of the talk. Scenarios 3 and 4 are only in the
60-minute version, but they are in it: if you do not want four votes, say so
and I will take them out of the running order rather than leave two blank
pages in the hour.

---

## The Swenson clip, page 26  *(plays, two loose ends)*

`public/media/swenson.mp4` plays on entering the page, captioned "Capt.
William Swenson, Ganjgal, Afghanistan, 2009. US Army helmet-camera footage."

- **It is longer than its slot.** The clip runs 2:32; the running order gives
  it 2 minutes. Either press `B` at two minutes, or tell me which half-minute
  to take from elsewhere so the slot can be 2.5.
- **It is 13.3 MB,** over the 10 MB limit in `ASSETS.md`. It still plays and is
  cached for offline use (the service worker takes up to 24 MB per file), so
  this is about load time on the hospital wifi, not about it working.
  Compressing it needs ffmpeg, which is not installed on this machine.

Check the caption is right for this footage before the talk: it is the
standard description of the Swenson clip, not something read off the file.

---

## The 45-minute cut runs 50 minutes

The short version drops the empathy clip, the five dysfunctions, the
drains/energises board, compassionate leadership and scenarios 3 and 4. Those
add up to 10 minutes, so the cut is 50 minutes, not 45. Tell me what else to
drop, or which slots to shorten, if 45 is a hard stop.

---

## Done since the first draft of this file

| Page | Screen | What changed |
|---|---|---|
| 4, 11, 20, 24, 29, 40 | Every framework screen | All six remaining models drawn; none shows a `[TODO]` plate |
| 5 | Show — the security guard | Your story: "Not her job. She did it anyway." with the clipping beside it |
| 8 | Show — resignations | **6,212** medical officers resigned, 2021–2025. Dzulkefly Ahmad, written Dewan Negara reply, 4 August 2026 |
| 9 | Show — vacant posts | **13,072** sourced: 1,660 specialist + 11,412 non-specialist, as at 30 June 2026. Written Dewan Rakyat reply, 21 October 2026 |
| 26 | Show — Swenson | Video in place, captioned |

Screens the first draft asked about that the teaching spine has since removed:
"You have already led today" (the story now lives on page 5), the single cost
figure (now pages 8–10), "what it costs", the climate clipping, "the smallest
unit of leadership" and the one-shift timeline. Nothing is needed for them.

---

## The fastest way through this

Send me, in one message:

1. The bullying figure, its line, and a link to the study (page 10)
2. Scenario 2: vignette, four options, a style for each (page 34)
3. Scenarios 3 and 4 the same way, or "drop them"
4. The empathy clip and its attribution line (page 21)

Items 1 and 2 alone finish the 45-minute version.
