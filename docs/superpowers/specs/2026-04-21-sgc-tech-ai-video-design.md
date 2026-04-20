# SGC TECH AI — 60-Second Marketing Video Design

**Date:** 2026-04-21
**Product:** sgcclaw
**Format:** 60-second cinematic marketing video with voiceover and music
**Renderer:** rendervid MCP server (`@rendervid/mcp-server`, built at `~/.local/rendervid/mcp/build/index.js`)
**Output:** MP4, 1920×1080, high quality

---

## Visual Identity

| Element | Value |
|---------|-------|
| Background | `#0a0a0f` (near-black) |
| Primary accent | `#00d9ff` (cyan) |
| Secondary accent | `#0047ff` (blue) |
| Urgency accent | `#dc2626` (red) |
| Font | Satoshi (matches landing page) |
| Motion style | Circuit-board pulse BG, glassmorphism panels, typewriter text |

---

## Structure — 4 Acts, 60 Seconds

### Act 1: The Pain (0–12s)

**Visuals**
- Dark background with slow circuit-board SVG animation (opacity 0.15)
- Three pain-point lines appear sequentially via typewriter entrance
- Key word on each line gets a red underline animation

**Pain-point lines**
1. `"Leads going cold at 2am."`
2. `"Reports that take 3 days to pull."`
3. `"Your team: burned out. Your pipeline: leaking."`

**Voiceover**
> *"Sound familiar? Most businesses are still running on human limits."*

---

### Act 2: The Shift (12–22s)

**Visuals**
- Hard cut with cyan light-burst particle effect
- SGC TECH AI logo assembles from circuit nodes (draw-on animation)
- Bold headline slides in from left

**Headline**
> `"Meet sgcclaw."`

**Voiceover**
> *"An AI-powered centralized brain that never sleeps, never calls in sick, and never asks for a raise."*

---

### Act 3: Capability Cascade (22–50s)

Six glassmorphism capability cards animate in sequentially (~4.5s each). Each card: dark glass panel, cyan icon, bold white label, grey subtitle.

| # | Label | Subtitle | Voiceover line |
|---|-------|----------|----------------|
| 1 | Predict & Simulate | Agentic outcome modeling | *"Predict outcomes before you act."* |
| 2 | Connect & Integrate | 1000+ software integrations | *"Plugs into your entire software stack."* |
| 3 | Pull & Analyze | Instant data & reporting | *"Reports in seconds, not days."* |
| 4 | Generate & Convert | Lead capture, Q&A, booking | *"Captures leads, answers questions, books appointments."* |
| 5 | Trigger & Automate | 24/7 workflow intelligence | *"Over a thousand real-world workflows — running around the clock."* |
| 6 | Compound ROI | Fixed price. No drama. | *"Fixed price. Compounding returns. No drama."* |

---

### Act 4: The Manifesto (50–60s)

**Visuals**
- Screen cuts to pure black
- `"AI is coming."` — appears in red, center screen, fade-in
- Wipe to white — `"Don't follow. Lead."` — bold black, maximum size
- SGC TECH AI logo + contact CTA fades in below

**Voiceover**
> *"Contact us. Tell us your use case. We've got you."*

---

## Audio Layers

| Layer | Description |
|-------|-------------|
| Voiceover | Script above, recorded or TTS (ElevenLabs recommended) |
| Background music | Cinematic orchestral: tense/sparse in Act 1 → builds through Act 3 → single powerful hit on "Lead." |
| SFX | Optional: subtle whoosh on card entrances, typing SFX in Act 1 |

---

## Rendervid Template Structure

The video will be authored as a single rendervid JSON template with these top-level layers:
1. `background` — solid color + circuit SVG (group layer, persistent)
2. `act1_text` — group of 3 text layers with typewriter animations
3. `act2_logo` — image layer (logo) + headline text
4. `act3_cards` — group of 6 card layers, each a sub-group of shape + text
5. `act4_manifesto` — sequence of text layers on black/white backgrounds
6. `audio_music` — audio layer, cinematic track URL
7. `audio_vo` — audio layer, voiceover file

---

## Output Deliverables

1. `public/sgcclaw-promo.mp4` — rendered video file
2. `docs/sgcclaw-voiceover-script.txt` — full voiceover script
3. `.mcp.json` — rendervid MCP server config (already created)
