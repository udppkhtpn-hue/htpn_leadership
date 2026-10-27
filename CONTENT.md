# What each page still needs

Audited against the 60-minute running order. Page numbers are what you press on
the console. Everything lives in `src/content/sections.ts` unless noted.

Two kinds of problem:

- **Empty** — marked `TODO_WRITE`, nothing to show. Pages 7, 9, 10, 14, 15, 18.
- **Mine** — I wrote placeholder copy so the screen was not blank. It is
  competent filler, not your argument. Pages 6, 17, and the clipping on 13.

Everything else is your own words from the brief and needs nothing.

---

## Length limits that matter

The display type scales to fit, so a long line is not broken — it is just
smaller. These are the thresholds where a line stops being a hall-sized
statement:

| Field | Keep under | Why |
|---|---|---|
| Statement headline | **30 characters** | Full height. Up to 52 is still strong; past 88 it reads as a paragraph. |
| Data figure | **4 characters** | `1889`, `62%`, `+.54` all sit at full size. |
| Data label | ~90 characters | One line under the figure. |
| Clipping body | 200–320 characters | A newspaper column; longer overflows the cutting. |
| Quote | **88 characters** | Set in the serif, slightly smaller than a headline. |
| Timeline entry | ~60 characters each | Four entries side by side with the time. |
| Vote option | ~110 characters | Four of them have to fit on one sheet with the vignette. |

---

## Page 6 — "You have already led today"  *(mine, rewrite)*

**Job:** the first turn in Act I. The room has just told you what the opposite
of leadership is; this is where you say they are already doing the opposite of
that.

**On screen now:** "You have already led today. You just did not call it that."
plus an invented clipping about a 3am call.

**What I need from you:** one true story, three or four sentences, of someone
at HTPN doing something nobody asked them to do. Not a famous example — a ward
one. Who, what, and the detail that makes it real. I will cut it into the
headline and the clipping beside it.

If you would rather keep the headline, say so and I will only replace the
clipping.

## Page 7 — the cost figure  *(empty)*

**Job:** the number that makes Act I uncomfortable. It sits in a pasted
clipping with the figure split-flapping into place.

**What I need:**

1. **The figure** — four characters or fewer (`62%`, `1 in 4`, `18`)
2. **What it measures** — one line, under 90 characters
3. **The source** — publication and year, shown as a stamp
4. **Two or three sentences of context** for the clipping beside it

Any of these work: the MOH burnout or attrition figures, a housemen turnover
number, a published incident-reporting rate. It should hurt a little.

## Page 9 — the Swenson video  *(empty)*

**Job:** four minutes where someone else makes the argument.

**What I need:**

1. **The file** — `public/media/swenson.mp4`, under 10 MB, trimmed to the part
   you actually play. Tell me the URL and I will trim and compress it.
2. **One line of attribution** for under the frame — speaker, talk, year.

It plays on entering the page and pauses on `B`. If the clip is longer than
four minutes, say where to cut it.

## Page 10 — what it costs  *(empty)*

**Job:** closes Act I. The room should be uncomfortable before the interval in
tone.

**What I need:** one sentence, **88 characters or fewer**, naming what bad
seniority costs a patient — plus who said it, if it is a quotation. This is the
hardest line in the talk and it should be yours, not a borrowed aphorism.

## Page 13 — the climate figure  *(mine, check)*

The figure `+.54` and the Goleman framing are from your brief and are correct.
The clipping beside it is my summary of the HBR finding. Read it and tell me if
you want it in your words.

## Page 14 — the second scenario  *(empty)*

**Job:** the second "Boss or Leader?" vote, after the K+ 6.8 one has landed.

**What I need, in `src/content/scenarios.ts`:**

1. **A vignette** — two or three sentences, a real ward moment
2. **Four options**, each under 110 characters
3. **Which Goleman style each option is** — coercive, pacesetting, affiliative,
   democratic, coaching, authoritative

The first scenario works because every option is defensible and the trap (D,
warmth without standards) is the one people pick. Aim for the same shape.
Scenarios 3 and 4 exist as placeholders and are not in the running order; write
them only if you want more than two votes.

## Page 15 — the empathy video  *(empty)*

Same as page 9: `public/media/empathy.mp4` and one line of attribution.

## Page 17 — "the smallest unit of leadership"  *(mine, rewrite)*

**Job:** turns Act II from theory into something to do on the next shift.

**On screen now:** "The smallest unit of leadership is one handover done
properly." — my line.

**What I need:** the three concrete things you will actually name. Small enough
that an HO can do one tomorrow. I will set the strongest as the headline and
the other two beneath, or fold them into page 18.

## Page 18 — one shift, hour by hour  *(empty)*

**Job:** the practical core of Act II.

**What I need:** four moments in one on-call shift, each with a time and one
line under 60 characters.

The four slots are `07:00`, `11:00`, `16:00`, `22:00` and the placeholders read:
handover · the HO who is drowning · the call you do not want to make · what you
write in the notes. Keep those beats or replace them — but the times should be
real ones from your own shifts.

---

## Still missing, not copy

| File | Page |
|---|---|
| `public/media/swenson.mp4` | 9 |
| `public/media/empathy.mp4` | 15 |
| `public/images/hands-handover.jpg` | 6 — margin |
| `public/images/night-window.jpg` | 10 — margin |

Both images fall back to a labelled placeholder, so those pages are usable
without them. The videos are not.

---

## The fastest way through this

Send me, in one message:

1. The page 7 figure, its line, and its source
2. The page 10 sentence
3. The page 6 story
4. The four page 18 moments
5. The page 14 scenario with its four options and styles
6. Attribution lines for both videos, and URLs if you want me to fetch and trim them

That is every empty screen in the 60-minute run. The 45-minute cut drops pages
7, 14, 15, 16 and 18, so if you are short of time, items 2, 3 and 6 alone make
the shorter version complete.
