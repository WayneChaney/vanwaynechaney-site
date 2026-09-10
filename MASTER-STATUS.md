# Current Direction — 2026-09-06

## Identity and Visual Decisions

- **Public name is locked: Vanwayne Chaney Jr.** Use `Jr.` consistently across the homepage, About page, titles, metadata, image alt text, and calls to action. Do not use `II` on the professional site.
- **Vanwayne visual identity is intentionally separate from Zulvan.** Use a restrained blue-and-gold system: deep navy `#0B1F3A`, civic blue `#2F6E9E`, light blue canvas `#EAF4FB`, gold `#C9A24A`, and white `#FCFCFA`. Use gold as a selective proof/action accent, not as a full-page fill. No gradients.
- **Zulvan retains its separate industrial identity** from research #453: Forged Iron `#1E2922`, Machine Paper `#F4F4F0`, Safety Oxide `#D95D39`, Galvanized Gray `#647067`. Do not blend Zulvan's orange or slate-green palette into Vanwayne.
- **Real portrait first.** The Vanwayne homepage hero uses an optimized real founder portrait. The Remotion promo and all embedded product/demo videos stay below the first viewport.
- **Motion system is locked.** `intro-preloader.mp4` is the 5.06-second site-entry preloader and plays once on the initial Vanwayne site load before the homepage becomes interactive. `vc2-ai-intro.mp4` is the 4.06-second VC2 logo transition and plays as a full-screen overlay on every internal Vanwayne page transition. Both use the blue-and-gold V mark and support the new visual identity.
- When implemented, preload both clips, never place either as a hero video, skip the motion for users who prefer reduced motion, and do not play the page-transition clip for external links, calendar links, phone links, or mailto links.
## Brand and Funnel Decisions

- **VanwayneChaney.com is the personal trust hub.** It sells Vanwayne as the credible builder for the job: computer engineer, Miami University graduate, and operator across civic, legal, small-business, real-estate, and trade contexts.
- **Primary homepage CTA:** `Book a System Audit`. It can live on VanwayneChaney.com but must route to the active Zulvan booking flow: `https://zulvan.com/#book` or `https://cal.com/vanwaynechaney/zulvan`.
- **Zulvan is live.** It is the broader systems-and-automation consulting business, with a live demo and an active 30-minute teardown booking flow. The older rebuild brief statement that Zulvan is empty is obsolete.
- **Website builds are a supporting capability, not the main homepage funnel.** They belong on Services and inside a scoped system-audit solution when lead capture or conversion is the bottleneck.
- **Solthane remains a focused trade-business branch for now.** Keep it below the primary personal-brand CTA as a clear optional route. Its final scope is still under review, so do not elevate it into the homepage hero or rewrite its offer without a separate decision.

## Current Build State

- A 30-second kinetic automation-optimization promo has been built and rendered at `commercial/automation-optimization-promo/remotion/out/automation-optimization-promo.mp4`.
- The promo uses animated Lead Generation, Follow-Up, and Operations scenes with on-camera slots for Vanwayne. It is ready for four short talking-head clips and final assembly in Premiere Pro.
- **No live Vanwayne homepage, About, or Services file has been changed in this work session.** The current work was strategy, production assets, and status correction.

## Before Editing The Homepage

- Resolve the canonical source conflict: `_MAP.md` identifies `index-new.html` as the real homepage, while this older status file identifies `index.html`. Verify the active deployment route before making homepage changes.
- The next page to redesign is `about.html`: make it a trust and conversion page with clear positioning, proof, a practical capability section, and a System Audit CTA.

---
# VanWayne / VC2 AI — Master Status
_Single source of truth. Updated: 2026-07-11_
_Site: vanwaynechaney.com — professional consulting + VC2 AI product_

---

## LIVE vs ARCHIVED — check this before editing any page

**`index.html` is the ONE live homepage** — Cloudflare serves this at `/`. Confirmed 2026-07-11.

Any file ending in `-archive.html` (`index-archive.html`, `index-new-archive.html`) is **dead weight kept for reference only — not served, not linked, never edit these.** If a redesign is ever wanted, build it in a new file, verify it's actually wired up as live before treating it as canonical.

---

## WHERE EVERYTHING LIVES

| What | Location |
|------|----------|
| Website files | `C:\Users\wayne\Projects\VanWayne\` |
| VC2 AI Receptionist (product) | `C:\Users\wayne\Projects\Contractor-Receptionist\` |
| Commercial script + Fiverr brief | `C:\Users\wayne\Projects\VanWayne\HERO-VIDEO-SCRIPT.md` |
| n8n workflows | n8n.srv1471000.hstgr.cloud |
| Onboarding script | `Contractor-Receptionist\onboard-client.js` |

---

## WHAT IS DONE ✅

### VC2 AI Receptionist — Product
- [x] n8n workflows — 6 live on Hostinger (missed call text-back, SMS qualifier, form follow-up, review request, Vapi voice, Slack hot lead alert)
- [x] Stripe — $197 setup + $297/mo product + payment link live
- [x] Client intake form — live (Google Forms, 3 fields: business name, owner cell, review link)
- [x] Service agreement — live (Google Docs)
- [x] `onboard-client.js` — unified client onboarding script ready (live in 15 min per client)
- [x] Google Sheets lead dashboard — 4 tabs (Leads, SMS, Missed Calls, Reviews)
- [x] Twilio A2P — Brand "Van Wayne" APPROVED. Campaign resubmitted (pending)

### Commercial
- [x] Script written — 5 scenes, 45-60 sec, production-ready
- [x] Fiverr brief written — copy-paste ready in HERO-VIDEO-SCRIPT.md
- [x] Delivery guide written — how to record each scene
- [x] Higgsfield prompt written — Scene 1D customer texting clip
- [x] Screen recordings of system working — B-roll for Scene 4 ready

### Website
- [x] index.html — rebuilt (old products removed, clean)
- [x] index-new.html — newer homepage version (untracked, not pushed yet)
- [x] services.html — mobile nav added (not pushed yet)
- [x] intake.html — mobile nav added (not pushed yet)
- [x] All other pages — mobile nav live

---

## WHAT IS PENDING ⏳

### Commercial — CURRENT PRIORITY
- [ ] **Record Scenes 2, 3, 5 on camera** (30-45 min, multiple takes)
- [ ] **Record Scene 4 voiceover** (audio only, 10 min, 2-sec pauses between lines)
- [ ] Send footage + Fiverr brief to editor ($150-200 budget)
- [ ] Receive finished commercial from Fiverr
- [ ] Upload to YouTube (unlisted)
- [ ] Embed in vanwaynechaney.com hero section

### VC2 AI Receptionist
- [ ] Twilio A2P campaign approval — pending (brand approved, campaign resubmitted)
- [ ] **Demo video** — webhook fires → sheet populates live, ~30 sec, 5x speed. This is step 2 of the sales flow — can't close clients without it. Do right after Twilio is live.
- [ ] First client outreach — post in Facebook Cleveland trades groups + DM contractors

### Milestones
- [ ] 5 testimonials → raise setup fee from $197 → $497 (keep early clients at $297/mo forever)
- [ ] Future upsell: calendar booking (AI books qualified leads on client's Google Calendar)

### Website — after commercial is done
- [ ] Push index-new.html, services.html, intake.html live
- [ ] Build scrolling testimonial/logo bar (bottom of page)
  - Trucking company
  - Wholesaling company
  - Food company
  - City of Oakwood Village (chase this — municipal testimonial is tier-1 credibility)
- [ ] Embed commercial in hero section
- [ ] Commit + push all pending changes

---

## FUTURE 🔭

- [ ] Consulting commercial — "I build AI workflows for your business" (after first enterprise client)
- [ ] Oakwood Village proposal → close → testimonial → case study
- [ ] 15-second teaser cut from commercial (LinkedIn/Instagram pre-roll)
