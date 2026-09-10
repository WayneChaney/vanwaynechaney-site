## Post-Brief Motion Requirement — Locked 2026-09-06

- `intro-preloader.mp4` is the site-entry preloader. It plays once on the initial Vanwayne site load before the homepage becomes interactive.
- `vc2-ai-intro.mp4` is the full-screen internal page-transition overlay. It plays on every internal navigation between Vanwayne pages.
- Keep the source clips intact. Their blue-and-gold V logo is an intentional anchor for the Vanwayne visual system.
- Skip motion for `prefers-reduced-motion` users. Do not intercept external, calendar, telephone, or email links with the transition.

---
# VC2 Site Rebuild — Codex Build Brief

_Written by Claude for Codex to execute. Nothing in this brief has been built yet — no live files have been touched. Wayne reviews this doc, then hands it to Codex._

---

## Naming (locked, confirmed 2026-08-26)

| Name | What it is | Where it appears |
|---|---|---|
| **VC2 AI LLC** | Legal entity. Never spoken publicly. | ONLY in legally-required text: intake.html SMS/A2P consent checkbox, schema.org `legalName` if used, contracts/W-9s (out of scope here). |
| **VC2** | Public spoken/written name. Replaces "VC2 AI" everywhere else. Works for both government work and teaching content — one name, no split. | Nav, hero copy, meta tags, page titles, alt text, schema `name`/`alternateName`. |
| **Zulvan** | The actual consulting business. Sells outcomes, not gadgets. | zulvan.com — **currently empty, not built.** See gap #2 below. |
| **Solthane** | A product Zulvan sells — AI phone receptionist for contractors/trades. | solthanecalls.com — live. |

🔴 **Rule:** before changing any "VC2 AI" string, check if it's in a compliance/legal context (SMS consent text, schema legalName) — those stay exactly as-is. Everywhere else, "VC2 AI" → "VC2."

---

## Per-page changes

### 1. `index.html` (Homepage) — FULL REBUILD
**Current state:** Not a bio page — it's a full Solthane sales page. Hero: "Your AI Intake Agent answers, qualifies, and books every job automatically." CTA: "Call Intake Agent Now." Meta description pitches AI phone systems to contractors/local government. JSON-LD `alternateName: "VC2 AI"`.

**Rebuild to:**
- Hero: photo slideshow of Wayne (see gap #1 below for image sourcing), reusing the `.about-photo-slide` carousel pattern already built in `about.html` (auto-rotating, 3.5s interval, works today).
- Hero copy: VC2 positioning — government/civic AI systems + teaching authority. Zero contractor/"Intake Agent" language.
- CTA: replace "Call Intake Agent Now" with something in the same register as about.html's existing CTA (e.g. "Start the Conversation" → mailto or intake.html).
- Meta description / OG tags: rewrite off contractor/AI-phone framing.
- JSON-LD: `alternateName` → `"VC2"`.
- Remove the `aigains.html` link (see item 8).

### 2. `services.html` — FUNNEL REBUILD
**Current state:** Pure trades pitch — "Built for the trades," "Two ways to start," "One system. Two jobs." This is Solthane's pitch sitting on VC2's site.

**Rebuild to:** VC2 capability overview (gov/teaching register, no pitch) that routes visitors two ways:
- **Zulvan** (consulting) — ⚠️ zulvan.com is empty (gap #2). Route to `intake.html` or a mailto as a placeholder until Zulvan's own site exists.
- **Solthane** (product) — real live target, link directly to solthanecalls.com.

Drop all trades/contractor-specific copy from this page entirely — that content belongs on Solthane's own site, not here.

### 3. `live-demos.html` — GOV-PROOF REBUILD
**Current state:** "AI Intake Agent Demo + Websites." Built around calling the Solthane demo line, a trade-picker voice script, and contractor site examples.

**Rebuild to:** Government & Civic Demos. Feature real proof — Oakwood Village civic assistant (live, safe to name), Glenwillow (in progress, don't overclaim status). Website demo examples can stay bundled — legit adjacent capability to show a village. Remove the "pick a trade" voice script and contractor site examples entirely.

### 4. `about.html` — RENAME + STRIP PASS
(A version of this was drafted and reverted earlier this session — same edits, corrected to say "VC2" not "VC2 AI.")
- Hero strip: "AI Phone Intake Agents" → "Government & Civic Systems"
- Photo badge: "VC2 Professional Brand" / "AI · Engineering · Real Estate Investors" → "VC2" / "AI Systems · Government & Enterprise"
- About paragraph: reference "VC2," gov/enterprise focus — don't need to name "VC2 AI LLC" in the narrative copy at all
- Ask-widget starter question, skills card bullets: "VC2 AI" → "VC2" throughout
- Remove the Stripe "Buy Now" / "Talk First" button pair from the hero (digital-product CTA, doesn't belong on a gov-facing page)
- Sticky bottom nav: "Buy" (Stripe link) → "Contact" (→ intake.html)

### 5. `intake.html`
- **SMS consent checkbox text ("VC2 AI LLC"): DO NOT TOUCH.** Compliance-required, tied to the actual A2P/TCR registration.
- "Contractor / trades" dropdown option: **keep it**, but route that selection toward **Solthane** — ⚠️ confirm this before building, see open item below. Don't route trades leads into VC2's own gov/teaching funnel.
- Sweep the rest of the page for any other "VC2 AI" → "VC2" instances not yet caught.

### 6. `call.html`
- One change only: `"VC2 AI · Cleveland"` label → `"VC2 · Cleveland"`. Nothing else on this page needs touching — it's lean by design.

### 7. RE tools cluster — UNLINK AND ARCHIVE
Files: `tools-resources.html`, `real-estate.html`, `lenders.html`, `finance.html`, `finance-strategies.html`, `products.html` (root-level).
- Confirmed zero inbound links from the live site already (index/about/services/live-demos/intake don't point here — they only link to each other).
- Move all six into `archive/`, matching how `index-archive.html` etc. are already handled.
- Note the move in `MASTER-STATUS.md`.

### 8. `aigains.html` — DELETE
- Dead brand (AI Gains → Overclock rename already happened elsewhere). Delete the file and remove its link from `index.html`.

### Leave alone, no action needed
- `delivery.html` — generic "check your email" opt-in confirmation, unrelated to any of this.
- `call.html`'s lack of nav linkage — intentional, it's a spoken/card short-link by design.
- Everything already in `archive/`, `index-archive.html`, `index-new-archive.html` — already correctly dead, per `MASTER-STATUS.md`.

---

## Open items — need Wayne's confirmation before Codex builds

1. **Homepage/hero slideshow images.** No real footage of Wayne teaching exists anywhere in the repo (audited VanWayne, VideoStudio, personal-brand/content — nothing). Options: real personal photos (graduation, existing headshots) only, Higgsfield-generated "teaching" images to fill gaps, or both mixed. Codex can build the slideshow mechanism now with placeholders; images get swapped in once Wayne supplies them.
2. **Zulvan funnel target.** zulvan.com is empty. Until it's built, "route to Zulvan" in services.html needs to land somewhere real — proposing intake.html or a mailto as a placeholder.
3. **Intake trades routing — confirm Solthane, not Zulvan.** Wayne's answer said "Zulvan" for where trades leads should funnel, but trades/contractors is Solthane's exact locked audience per `BRANDS.md`. This brief defaults to Solthane. One-word confirm needed before Codex wires this.

---

_Once items 1–3 are settled, this brief is Codex-ready. Claude's role after Codex builds: audit the actual changes against this spec, not write the code._
