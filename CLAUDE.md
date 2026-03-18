# 3YN Billboard Analyzer - Claude Code Instructions

## Project Overview

AI-powered billboard readability analysis platform for the MENA market, focusing on Oman. B2B SaaS with bilingual (Arabic/English) support.

## Tech Stack

- React 18 + TypeScript + Vite
- Tailwind CSS
- Supabase (auth, database)
- OpenAI GPT-4 Vision API
- i18next (internationalization)

---

## Design Context

### Users

**Primary:** Marketing managers, creative directors, and media planners at advertising agencies and brands in Oman and the GCC. They're reviewing billboard designs before production, often under deadline pressure. They need confidence that their creative will perform—not another layer of complexity.

**Secondary:** Enterprise clients (in-house marketing teams at companies like Omantel) who need to ensure brand consistency and regulatory compliance across campaigns.

**Context:** Users access this tool during the creative approval process. They upload a design, need a quick verdict, and want actionable recommendations. They're visual professionals who will judge the tool's credibility by its own visual quality.

### Brand Personality

**Voice:** Confident, technical, premium—speaks like a trusted expert consultant, not a chatbot.

**Tone:** Direct and authoritative without being cold. Delivers clear verdicts, not hedged opinions. Respects users' time.

**3 Words:** **Expert. Precise. Confident.**

**Emotional Goal:** Users should feel they've gained an unfair advantage—like having a senior creative director review every billboard before it goes live.

### Aesthetic Direction

**Visual Tone:** Minimal and focused. Let the content (the billboard being analyzed) be the hero. The interface should feel like a precision instrument—confident, quiet, purposeful.

**Color Palette:**
- **Primary:** Navy blue (#1e3a5f range) — from the logo, conveys expertise and trust
- **Accent:** Emerald (#10b981 range) — for actions, success states, positive feedback
- **Neutrals:** Warm grays with slight navy tint, never pure black or white
- **Avoid:** Bright colors, gradients, glows, anything that competes with the uploaded creative

**Typography:**
- English: Plus Jakarta Sans
- Arabic: Cairo, Tajawal
- Use type scale with clear hierarchy. Headlines should be confident but not shouty.

**Theme:** Light mode primary. Dark sections only where they create meaningful contrast (not as default).

**Anti-References:**
- Generic AI/SaaS dark mode (purple gradients, glassmorphism, glowing accents)
- Playful startup aesthetics (too casual for enterprise clients)
- Cluttered analytics dashboards (overwhelming, not actionable)
- Government/institutional design (dated, bureaucratic)

**References:**
- Linear (precision, clarity, confidence)
- Stripe Dashboard (professional, functional, premium)
- Notion (clean, focused, lets content breathe)

### Design Principles

1. **Content is king.** The billboard being analyzed is always the most important visual element. Everything else supports it, nothing competes with it.

2. **Confidence over cleverness.** Clear verdicts, obvious actions, no ambiguity. Users should never wonder what to do next.

3. **Precision, not decoration.** Every element earns its place. No gradients for impact, no shadows for depth, no animations for delight—unless they serve function.

4. **Quiet authority.** Premium doesn't mean ornate. It means restraint, consistency, and attention to detail. The interface should feel inevitable, not designed.

5. **Respect the professionals.** These are visual experts. Don't patronize with heavy-handed UI. Trust them to understand a clean interface.

---

## Technical Notes

- **Bilingual:** Full RTL support for Arabic. Numbers stay LTR.
- **Responsive:** Desktop-first (primary use case is at desk during reviews), mobile-functional.
- **Accessibility:** WCAG 2.1 AA minimum. High contrast ratios given the visual analysis context.
