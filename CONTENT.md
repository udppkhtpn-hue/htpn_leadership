# What each page still needs

Audited on 28 October 2026 against the running order in
`src/content/sections.ts`. Page numbers are what you press on the console;
they move whenever a screen is added, so each item also gives the screen's
title. Copy lives in `src/content/sections.ts`, scenarios in
`src/content/scenarios.ts`.

Every teaching model is drawn, and nothing on the projector is copy I made up
for you. What is left is the empathy clip, two loose ends on the Swenson clip,
and a timing problem with the short version.

| Page | Screen | What is missing | In the 45-minute cut? |
|---|---|---|---|
| 21 | Show — empathy clip | The video and its caption | No |
| 34–36 | Try — Boss or Leader? scenarios 2–4 | Drafted — read them and change what does not ring true | 34 only |

Nothing now blocks the 45-minute version except the Swenson timing.

---

## Page 21 — Show: empathy clip  *(empty)*

**Job:** the Show beat of Block 3, straight after the five EI cards. It has a
3-minute slot.

**What I need:**

1. **The file**, dropped into `public/media/` like the Swenson clip. Any name
   is fine; I will rename it to `empathy.mp4`.
2. **One line of attribution** for under the frame: who, what, year.

Until then the screen shows a labelled placeholder, and the caption reads
`TODO_WRITE`. The 45-minute cut skips this page.

## Pages 34–36 — Try: Boss or Leader? scenarios 2, 3 and 4  *(drafted)*

**Job:** more votes after the K+ 6.8 scenario (page 33), each revealing which
of Goleman's six styles the room reached for.

**On screen now:** three drafted scenarios, in `src/content/scenarios.ts`.
They work as they stand; the details are mine, so change them for ones the
room will recognise.

| Page | Scenario | The right answer | The trap |
|---|---|---|---|
| 33 | K+ 6.8, four hours | C, coaching | D — warmth with no standards |
| 34 | A patient arrests on the round | A, coercive | C — coaching, in the wrong ninety seconds |
| 35 | Discharge summaries a week late | C or D, authoritative or democratic | A — pacesetting: clearing it yourself teaches nobody |
| 36 | The specialist who stops answering | C or D, authoritative or coaching | A — keeping the peace, which is indifference |

Each one makes a different style right and sets a different trap. That is
deliberate: four scenarios that all reward warmth would teach the room "be
nice" four times and send them home with nothing.

**When you edit:** keep a vignette under about 100 characters, which is two
lines on the sheet. At three lines, the fourth option's attribution falls off
the bottom of a projector that cannot scroll. Options stay under 110.

Scenario 2 is in both versions of the talk. Scenarios 3 and 4 are only in the
60-minute version.

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
| 10 | Show — bullying | **59%** of 1,074 house officers named medical officers as a source of negative acts at work. Samsudin et al., Malays J Med Sci, 2021. CodeBlue's 41% poll is in the notes only |
| 26 | Show — Swenson | Video in place, captioned |

Screens the first draft asked about that the teaching spine has since removed:
"You have already led today" (the story now lives on page 5), the single cost
figure (now pages 8–10), "what it costs", the climate clipping, "the smallest
unit of leadership" and the one-shift timeline. Nothing is needed for them.

---

## The fastest way through this

Send me, in one message:

1. Scenario 2: vignette, four options, a style for each (page 34)
2. Scenarios 3 and 4 the same way, or "drop them"
3. The empathy clip and its attribution line (page 21)

Item 1 alone finishes the 45-minute version.
