# Backend setup — HTPN Lead Live

The back end is one Google Sheet plus one Apps Script web app. There is no
server to run and nothing to pay for. These steps are manual and take about ten
minutes; do them once, well before the talk, and then again a week before as a
rehearsal.

Everything in `/backend` is source to paste into the Apps Script editor.

---

## 1. Create the Sheet

1. Go to [sheets.new](https://sheets.new) while signed in as the account that
   will own the talk.
2. Name it **HTPN Lead Live**.
3. Leave the tabs alone — the script creates `State`, `Responses`, `Votes` and
   `Log` for you.

## 2. Open the script editor

In the Sheet: **Extensions → Apps Script**. This creates a script bound to the
Sheet, which is what lets the code find it without an ID.

Rename the project to **HTPN Lead Live backend** (click the title, top left).

## 3. Paste the code

1. In the editor, select everything in `Code.gs` and replace it with the
   contents of [`backend/Code.gs`](backend/Code.gs).
2. Open **Project Settings** (the cog, left sidebar) and tick
   **Show "appsscript.json" manifest file in editor**.
3. Back in the editor, open `appsscript.json` and replace it with the contents
   of [`backend/appsscript.json`](backend/appsscript.json).
4. Save (⌘S).

## 4. Set the PIN

The presenter PIN is never in the front-end code. It lives here.

1. **Project Settings → Script Properties → Add script property**
2. Property: `PRESENTER_PIN`
3. Value: a PIN you will remember on stage — four to six digits is plenty.
4. Save.

Optional: if you ever move the script out of the Sheet, add `SHEET_ID` with the
long id from the Sheet's URL. While the script stays bound to the Sheet you do
not need it.

## 5. Run `setup` once

1. In the editor's function dropdown, choose **setup**, then **Run**.
2. Google will ask you to authorise the script. Choose your account →
   **Advanced** → **Go to HTPN Lead Live backend (unsafe)** → **Allow**. The
   warning is normal for a script that has not been through Google's review; it
   is your own code, running as you.
3. The execution log should end with `ready`. If it throws
   "Set PRESENTER_PIN…", go back to step 4.
4. Check the Sheet: four tabs, with headers, and `State` seeded.

## 6. Deploy as a web app

1. **Deploy → New deployment**
2. Select type (the cog) → **Web app**
3. Description: `v1`
4. **Execute as: Me**
5. **Who has access: Anyone** — not "Anyone with Google account". The audience
   must not have to sign in.
6. **Deploy**, then copy the **Web app URL**. It ends in `/exec`.

## 7. Put the URL in the front end

Open [`src/config.ts`](src/config.ts) and paste it:

```ts
backendUrl: 'https://script.google.com/macros/s/AKfy…/exec',
```

The URL is public by design and is not a secret — it is in the front-end bundle
of a public repo. What protects the controls is the PIN, which is not.

## 8. Check it works

Replace `URL` with your `/exec` URL and `PIN` with your PIN.

```bash
curl -sL "URL?action=ping"
```

```bash
curl -sL -X POST "URL" -H 'Content-Type: text/plain' -d '{"action":"control","pin":"PIN","op":"set","sectionId":"wc-opposite","moduleKind":"wordcloud","promptId":"wc-opposite","open":true}'
```

```bash
curl -sL -X POST "URL" -H 'Content-Type: text/plain' -d '{"action":"submit","kind":"wordcloud","promptId":"wc-opposite","deviceId":"test-1","text":"ego"}'
```

```bash
curl -sL "URL?action=results&kind=wordcloud"
```

The last call should report `ego` with a count of 1. `-L` matters: Apps Script
answers with a redirect to `script.googleusercontent.com`, and the browser and
curl both have to follow it.

Then clear the test data: in the editor, run **clearAllResponses**.

---

## Re-deploying after a change

This catches everyone once. Editing the code does **not** change what the `/exec`
URL serves.

**Deploy → Manage deployments → the pencil icon → Version: New version → Deploy.**

The URL stays the same, so nothing in `src/config.ts` needs touching.

---

## What the endpoints do

| Call | Method | Who uses it |
|---|---|---|
| `?action=ping` | GET | The console's health light |
| `?action=state` | GET | Phones, every ~9 s with jitter, paused when the tab is hidden |
| `?action=results&kind=…&promptId=…` | GET | Projector and console, every 2.5 s while a module is open |
| `{"action":"submit",…}` | POST | Phones, once per device per prompt |
| `{"action":"control","pin":…}` | POST | The console only |
| `?action=export&pin=…` | GET | CSV of responses and votes, after the talk |

POSTs send `Content-Type: text/plain` on purpose: it avoids the CORS preflight
that Apps Script cannot answer. The body is JSON, parsed from
`e.postData.contents`.

## Moderation, in one line each

- **Word cloud** entries appear on screen immediately; you can hide a word.
- **Board notes** arrive as `pending` and reach the projector only after you
  approve them. Anything containing "Dr ", "Dato", "Prof" or two capitalised
  words in a row is flagged for a second look — the flag does not hide it, it
  just marks it.
- **Votes** are counted immediately but stay hidden until you press `R`.

## Load

Apps Script allows roughly 30 simultaneous executions, which is the real
constraint with 150 phones in the room. The design keeps well inside it: reads
come from `CacheService` with a 30-second TTL, rebuilt on every write; phones
poll state only every ~9 seconds and stop entirely when the screen is off; only
two devices in the room poll results. Writes are serialised with `LockService`.

`#/test` (Phase 4) simulates 150 phones against the real deployment so you can
confirm this before the day.

## Privacy

No names, emails, phone numbers, IC numbers or clinical details are accepted or
stored. `deviceId` is a random UUID generated in the browser, used only to stop
one phone voting twice. Text is stripped of markup and capped at 30 characters
for word clouds and 80 for notes. Tell the room this in your own words — the
`#/join` screen already says: *"Anonymous. I can't see who wrote what, and
neither can your HOD."*

## If it breaks during the talk

`#/presenter` shows a warning when the backend cannot be reached. The static
sections keep working offline. Fall back to the printed A/B/C/D cards and hands
up, and carry on — nothing about the talk depends on the live modules working.

## Testing the logic without deploying

```bash
npm run test:backend
```

This runs `Code.gs` against a stubbed Apps Script runtime (`backend/test/harness.cjs`)
and checks the PIN gate, deduplication, validation, word merging, moderation,
flagging, the vote tally, reset and the CSV export.
