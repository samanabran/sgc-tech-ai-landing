# SGC TECH AI — 60-Second Marketing Video Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generate a 60-second cinematic marketing video (`public/sgcclaw-promo.mp4`) showcasing sgcclaw's AI capabilities with voiceover script and background music.

**Architecture:** Single rendervid JSON template spanning 1800 frames at 30fps, submitted to the locally-built rendervid MCP server (`render_video` tool). The template uses one continuous scene with per-layer `from`/`duration` values to sequence the 4 acts. Audio layers reference public URLs for music; voiceover audio is a placeholder the user replaces after recording or generating with TTS.

**Tech Stack:** rendervid MCP server built at `C:/Users/branm/.local/rendervid/mcp/build/index.js`, FFmpeg (system install required), Node.js 25.x

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `docs/sgcclaw-voiceover-script.txt` | Create | Full voiceover script with timestamps |
| `public/sgcclaw-promo-template.json` | Create | Complete rendervid JSON template |
| `public/sgcclaw-promo.mp4` | Generated | Rendered video output |

---

## Frame Reference (30fps)

| Act | Seconds | Frames |
|-----|---------|--------|
| Act 1 — Pain | 0–12s | 0–360 |
| Act 2 — The Shift | 12–22s | 360–660 |
| Act 3 — Capabilities | 22–50s | 660–1500 |
| Act 4 — Manifesto | 50–60s | 1500–1800 |

---

## Task 1: Install FFmpeg

**Files:** System install only — no project files modified.

- [ ] **Step 1: Check if FFmpeg is already available**

```bash
ffmpeg -version
```

Expected if missing: `ffmpeg: command not found`

- [ ] **Step 2: Install FFmpeg via winget**

```bash
winget install Gyan.FFmpeg
```

Expected output: `Successfully installed`

If winget is unavailable, download the static build from https://www.gyan.dev/ffmpeg/builds/ and add the `bin/` folder to your PATH.

- [ ] **Step 3: Verify install**

Close and reopen your terminal, then run:

```bash
ffmpeg -version
```

Expected: `ffmpeg version 7.x ...`

- [ ] **Step 4: Commit**

No project files changed — nothing to commit for this task.

---

## Task 2: Write Voiceover Script

**Files:**
- Create: `docs/sgcclaw-voiceover-script.txt`

- [ ] **Step 1: Create the script file**

Create `docs/sgcclaw-voiceover-script.txt` with exactly this content:

```
SGC TECH AI — sgcclaw Promo Video
60-Second Voiceover Script
Generated: 2026-04-21

===== ACT 1: THE PAIN (0:00 – 0:12) =====
[Tone: low, slightly tired, empathetic]

"Sound familiar? Most businesses are still running on human limits."

===== ACT 2: THE SHIFT (0:12 – 0:22) =====
[Tone: confident, measured, a breath of relief]

"Meet sgcclaw — an AI-powered centralized brain that never sleeps,
never calls in sick, and never asks for a raise."

===== ACT 3: CAPABILITY CASCADE (0:22 – 0:50) =====
[Tone: building momentum, crisp, authoritative]

"Predict outcomes before you act."               [0:22–0:27]
"Plugs into your entire software stack."         [0:27–0:32]
"Reports in seconds, not days."                  [0:32–0:37]
"Captures leads, answers questions, books appointments."  [0:37–0:42]
"Over a thousand real-world workflows — running around the clock."  [0:42–0:47]
"Fixed price. Compounding returns. No drama."    [0:47–0:50]

===== ACT 4: THE MANIFESTO (0:50 – 1:00) =====
[Tone: quiet, direct, final]

"Contact us. Tell us your use case. We've got you."

===== RECORDING NOTES =====
Total runtime: ~55 seconds of speech across 60s video
Recommend 3-second pause before Act 4 begins (pure music moment at 0:47-0:50)
ElevenLabs recommended voice: "Adam" (authoritative male) or "Rachel" (professional female)
Export as MP3 or WAV, 44.1kHz stereo
Save as: public/assets/sgcclaw-voiceover.mp3
```

- [ ] **Step 2: Commit**

```bash
git add docs/sgcclaw-voiceover-script.txt
git commit -m "docs: sgcclaw voiceover script with timestamps"
```

---

## Task 3: Build Rendervid Template

**Files:**
- Create: `public/sgcclaw-promo-template.json`

The template uses a single scene (frames 0–1800). Position coordinates are top-left anchored. All timing is in frames (30fps). The background is a dark gradient. Circuit-line decorations provide ambient brand texture. Each act's layers carry explicit `from` + `duration` to ensure clean transitions.

> **Music note:** The template references a royalty-free public-domain orchestral track from the Internet Archive. After Task 5 renders successfully, replace the `src` in the `bg-music` audio layer with your preferred track if desired.

> **Voiceover note:** The `voiceover` audio layer references `./assets/sgcclaw-voiceover.mp3` — a relative path from the output directory. Record or TTS-generate this file (see Task 2 script) and place it at `public/assets/sgcclaw-voiceover.mp3` before rendering. If you want to render the video first without VO, delete the `voiceover` layer from the template.

- [ ] **Step 1: Create `public/sgcclaw-promo-template.json`**

```json
{
  "name": "SGC TECH AI — sgcclaw 60s Promo",
  "description": "60-second cinematic marketing video for sgcclaw AI platform",
  "version": "1.0.0",
  "output": {
    "type": "video",
    "width": 1920,
    "height": 1080,
    "fps": 30,
    "duration": 60
  },
  "composition": {
    "scenes": [
      {
        "id": "main",
        "startFrame": 0,
        "endFrame": 1800,
        "layers": [

          {
            "id": "bg",
            "type": "shape",
            "position": { "x": 0, "y": 0 },
            "size": { "width": 1920, "height": 1080 },
            "props": {
              "shape": "rectangle",
              "gradient": {
                "type": "linear",
                "angle": 135,
                "colors": [
                  { "offset": 0, "color": "#050508" },
                  { "offset": 1, "color": "#0a0a14" }
                ]
              }
            }
          },

          {
            "id": "circuit-h1",
            "type": "shape",
            "position": { "x": 0, "y": 200 },
            "size": { "width": 1920, "height": 1 },
            "opacity": 0.08,
            "props": { "shape": "rectangle", "fill": "#00d9ff" }
          },
          {
            "id": "circuit-h2",
            "type": "shape",
            "position": { "x": 0, "y": 600 },
            "size": { "width": 1920, "height": 1 },
            "opacity": 0.06,
            "props": { "shape": "rectangle", "fill": "#00d9ff" }
          },
          {
            "id": "circuit-h3",
            "type": "shape",
            "position": { "x": 0, "y": 880 },
            "size": { "width": 1920, "height": 1 },
            "opacity": 0.05,
            "props": { "shape": "rectangle", "fill": "#00d9ff" }
          },
          {
            "id": "circuit-v1",
            "type": "shape",
            "position": { "x": 320, "y": 0 },
            "size": { "width": 1, "height": 1080 },
            "opacity": 0.05,
            "props": { "shape": "rectangle", "fill": "#00d9ff" }
          },
          {
            "id": "circuit-v2",
            "type": "shape",
            "position": { "x": 1600, "y": 0 },
            "size": { "width": 1, "height": 1080 },
            "opacity": 0.05,
            "props": { "shape": "rectangle", "fill": "#00d9ff" }
          },
          {
            "id": "circuit-node1",
            "type": "shape",
            "position": { "x": 316, "y": 196 },
            "size": { "width": 8, "height": 8 },
            "opacity": 0.25,
            "props": { "shape": "ellipse", "fill": "#00d9ff" }
          },
          {
            "id": "circuit-node2",
            "type": "shape",
            "position": { "x": 1596, "y": 596 },
            "size": { "width": 8, "height": 8 },
            "opacity": 0.2,
            "props": { "shape": "ellipse", "fill": "#00d9ff" }
          },

          {
            "id": "act1-pain1",
            "type": "text",
            "position": { "x": 160, "y": 360 },
            "size": { "width": 1600, "height": 100 },
            "from": 30,
            "duration": 300,
            "props": {
              "text": "Leads going cold at 2am.",
              "fontSize": 52,
              "fontWeight": "300",
              "color": "#e0e0e0",
              "textAlign": "left",
              "fontFamily": "Inter, system-ui, sans-serif",
              "letterSpacing": 1
            },
            "animations": [
              {
                "type": "entrance",
                "effect": "slideInLeft",
                "delay": 0,
                "duration": 25,
                "easing": "easeOutCubic"
              },
              {
                "type": "exit",
                "effect": "fadeOut",
                "delay": 0,
                "duration": 20,
                "easing": "easeInCubic"
              }
            ]
          },
          {
            "id": "act1-pain1-underline",
            "type": "shape",
            "position": { "x": 160, "y": 460 },
            "size": { "width": 340, "height": 2 },
            "from": 50,
            "duration": 280,
            "opacity": 0.9,
            "props": { "shape": "rectangle", "fill": "#dc2626" },
            "animations": [
              {
                "type": "entrance",
                "effect": "scaleIn",
                "delay": 0,
                "duration": 20,
                "easing": "easeOutCubic"
              },
              {
                "type": "exit",
                "effect": "fadeOut",
                "delay": 0,
                "duration": 20,
                "easing": "easeInCubic"
              }
            ]
          },

          {
            "id": "act1-pain2",
            "type": "text",
            "position": { "x": 160, "y": 490 },
            "size": { "width": 1600, "height": 100 },
            "from": 150,
            "duration": 180,
            "props": {
              "text": "Reports that take 3 days to pull.",
              "fontSize": 52,
              "fontWeight": "300",
              "color": "#e0e0e0",
              "textAlign": "left",
              "fontFamily": "Inter, system-ui, sans-serif",
              "letterSpacing": 1
            },
            "animations": [
              {
                "type": "entrance",
                "effect": "slideInLeft",
                "delay": 0,
                "duration": 25,
                "easing": "easeOutCubic"
              },
              {
                "type": "exit",
                "effect": "fadeOut",
                "delay": 0,
                "duration": 20,
                "easing": "easeInCubic"
              }
            ]
          },
          {
            "id": "act1-pain2-underline",
            "type": "shape",
            "position": { "x": 160, "y": 590 },
            "size": { "width": 120, "height": 2 },
            "from": 170,
            "duration": 160,
            "opacity": 0.9,
            "props": { "shape": "rectangle", "fill": "#dc2626" },
            "animations": [
              {
                "type": "entrance",
                "effect": "scaleIn",
                "delay": 0,
                "duration": 20,
                "easing": "easeOutCubic"
              },
              {
                "type": "exit",
                "effect": "fadeOut",
                "delay": 0,
                "duration": 20,
                "easing": "easeInCubic"
              }
            ]
          },

          {
            "id": "act1-pain3",
            "type": "text",
            "position": { "x": 160, "y": 620 },
            "size": { "width": 1600, "height": 100 },
            "from": 270,
            "duration": 70,
            "props": {
              "text": "Your team: burned out. Your pipeline: leaking.",
              "fontSize": 52,
              "fontWeight": "300",
              "color": "#f87171",
              "textAlign": "left",
              "fontFamily": "Inter, system-ui, sans-serif",
              "letterSpacing": 1
            },
            "animations": [
              {
                "type": "entrance",
                "effect": "slideInLeft",
                "delay": 0,
                "duration": 25,
                "easing": "easeOutCubic"
              },
              {
                "type": "exit",
                "effect": "fadeOut",
                "delay": 0,
                "duration": 20,
                "easing": "easeInCubic"
              }
            ]
          },

          {
            "id": "act1-vo-text",
            "type": "text",
            "position": { "x": 480, "y": 900 },
            "size": { "width": 960, "height": 60 },
            "from": 60,
            "duration": 240,
            "opacity": 0.5,
            "props": {
              "text": "Sound familiar? Most businesses are still running on human limits.",
              "fontSize": 22,
              "fontWeight": "300",
              "color": "#aaaaaa",
              "textAlign": "center",
              "fontFamily": "Inter, system-ui, sans-serif",
              "letterSpacing": 0.5
            },
            "animations": [
              {
                "type": "entrance",
                "effect": "fadeIn",
                "delay": 0,
                "duration": 30,
                "easing": "easeOutCubic"
              },
              {
                "type": "exit",
                "effect": "fadeOut",
                "delay": 0,
                "duration": 20,
                "easing": "easeInCubic"
              }
            ]
          },

          {
            "id": "act2-flash",
            "type": "shape",
            "position": { "x": 0, "y": 0 },
            "size": { "width": 1920, "height": 1080 },
            "from": 355,
            "duration": 15,
            "opacity": 0.7,
            "props": { "shape": "rectangle", "fill": "#00d9ff" },
            "animations": [
              {
                "type": "entrance",
                "effect": "fadeIn",
                "delay": 0,
                "duration": 5,
                "easing": "easeOutCubic"
              },
              {
                "type": "exit",
                "effect": "fadeOut",
                "delay": 0,
                "duration": 10,
                "easing": "easeInCubic"
              }
            ]
          },

          {
            "id": "act2-logo-text",
            "type": "text",
            "position": { "x": 360, "y": 380 },
            "size": { "width": 1200, "height": 140 },
            "from": 390,
            "duration": 240,
            "props": {
              "text": "SGC TECH AI",
              "fontSize": 112,
              "fontWeight": "700",
              "color": "#00d9ff",
              "textAlign": "center",
              "fontFamily": "Inter, system-ui, sans-serif",
              "letterSpacing": 8
            },
            "animations": [
              {
                "type": "entrance",
                "effect": "slideInUp",
                "delay": 0,
                "duration": 30,
                "easing": "easeOutCubic"
              },
              {
                "type": "exit",
                "effect": "fadeOut",
                "delay": 0,
                "duration": 20,
                "easing": "easeInCubic"
              }
            ]
          },
          {
            "id": "act2-meet-line",
            "type": "shape",
            "position": { "x": 760, "y": 535 },
            "size": { "width": 400, "height": 2 },
            "from": 420,
            "duration": 210,
            "opacity": 0.6,
            "props": { "shape": "rectangle", "fill": "#00d9ff" },
            "animations": [
              {
                "type": "entrance",
                "effect": "scaleIn",
                "delay": 0,
                "duration": 20,
                "easing": "easeOutCubic"
              },
              {
                "type": "exit",
                "effect": "fadeOut",
                "delay": 0,
                "duration": 15,
                "easing": "easeInCubic"
              }
            ]
          },
          {
            "id": "act2-sgcclaw",
            "type": "text",
            "position": { "x": 360, "y": 550 },
            "size": { "width": 1200, "height": 90 },
            "from": 440,
            "duration": 190,
            "props": {
              "text": "sgcclaw",
              "fontSize": 72,
              "fontWeight": "300",
              "color": "#ffffff",
              "textAlign": "center",
              "fontFamily": "Inter, system-ui, sans-serif",
              "letterSpacing": 12
            },
            "animations": [
              {
                "type": "entrance",
                "effect": "fadeIn",
                "delay": 0,
                "duration": 30,
                "easing": "easeOutCubic"
              },
              {
                "type": "exit",
                "effect": "fadeOut",
                "delay": 0,
                "duration": 20,
                "easing": "easeInCubic"
              }
            ]
          },
          {
            "id": "act2-tagline",
            "type": "text",
            "position": { "x": 160, "y": 680 },
            "size": { "width": 1600, "height": 70 },
            "from": 480,
            "duration": 150,
            "opacity": 0.75,
            "props": {
              "text": "An AI-powered centralized brain that never sleeps, never calls in sick, and never asks for a raise.",
              "fontSize": 26,
              "fontWeight": "300",
              "color": "#a0c4d8",
              "textAlign": "center",
              "fontFamily": "Inter, system-ui, sans-serif",
              "letterSpacing": 0.5
            },
            "animations": [
              {
                "type": "entrance",
                "effect": "fadeIn",
                "delay": 0,
                "duration": 30,
                "easing": "easeOutCubic"
              },
              {
                "type": "exit",
                "effect": "fadeOut",
                "delay": 0,
                "duration": 20,
                "easing": "easeInCubic"
              }
            ]
          },

          {
            "id": "act3-card1-bg",
            "type": "shape",
            "position": { "x": 160, "y": 320 },
            "size": { "width": 760, "height": 440 },
            "from": 660,
            "duration": 180,
            "opacity": 0.15,
            "props": {
              "shape": "rectangle",
              "fill": "#00d9ff",
              "borderRadius": 16
            },
            "animations": [
              { "type": "entrance", "effect": "slideInUp", "delay": 0, "duration": 25, "easing": "easeOutCubic" },
              { "type": "exit", "effect": "fadeOut", "delay": 0, "duration": 20, "easing": "easeInCubic" }
            ]
          },
          {
            "id": "act3-card1-num",
            "type": "text",
            "position": { "x": 200, "y": 350 },
            "size": { "width": 100, "height": 80 },
            "from": 680,
            "duration": 160,
            "props": {
              "text": "01",
              "fontSize": 56,
              "fontWeight": "700",
              "color": "#00d9ff",
              "textAlign": "left",
              "fontFamily": "Inter, system-ui, sans-serif"
            },
            "animations": [
              { "type": "entrance", "effect": "fadeIn", "delay": 0, "duration": 20, "easing": "easeOutCubic" },
              { "type": "exit", "effect": "fadeOut", "delay": 0, "duration": 20, "easing": "easeInCubic" }
            ]
          },
          {
            "id": "act3-card1-title",
            "type": "text",
            "position": { "x": 200, "y": 440 },
            "size": { "width": 680, "height": 80 },
            "from": 680,
            "duration": 160,
            "props": {
              "text": "Predict & Simulate",
              "fontSize": 42,
              "fontWeight": "700",
              "color": "#ffffff",
              "textAlign": "left",
              "fontFamily": "Inter, system-ui, sans-serif"
            },
            "animations": [
              { "type": "entrance", "effect": "slideInLeft", "delay": 5, "duration": 20, "easing": "easeOutCubic" },
              { "type": "exit", "effect": "fadeOut", "delay": 0, "duration": 20, "easing": "easeInCubic" }
            ]
          },
          {
            "id": "act3-card1-sub",
            "type": "text",
            "position": { "x": 200, "y": 530 },
            "size": { "width": 680, "height": 60 },
            "from": 695,
            "duration": 145,
            "opacity": 0.7,
            "props": {
              "text": "Predict outcomes before you act.",
              "fontSize": 28,
              "fontWeight": "300",
              "color": "#a0c4d8",
              "textAlign": "left",
              "fontFamily": "Inter, system-ui, sans-serif"
            },
            "animations": [
              { "type": "entrance", "effect": "fadeIn", "delay": 0, "duration": 20, "easing": "easeOutCubic" },
              { "type": "exit", "effect": "fadeOut", "delay": 0, "duration": 20, "easing": "easeInCubic" }
            ]
          },

          {
            "id": "act3-card2-bg",
            "type": "shape",
            "position": { "x": 1000, "y": 320 },
            "size": { "width": 760, "height": 440 },
            "from": 800,
            "duration": 180,
            "opacity": 0.15,
            "props": { "shape": "rectangle", "fill": "#00d9ff", "borderRadius": 16 },
            "animations": [
              { "type": "entrance", "effect": "slideInUp", "delay": 0, "duration": 25, "easing": "easeOutCubic" },
              { "type": "exit", "effect": "fadeOut", "delay": 0, "duration": 20, "easing": "easeInCubic" }
            ]
          },
          {
            "id": "act3-card2-num",
            "type": "text",
            "position": { "x": 1040, "y": 350 },
            "size": { "width": 100, "height": 80 },
            "from": 820,
            "duration": 160,
            "props": {
              "text": "02",
              "fontSize": 56,
              "fontWeight": "700",
              "color": "#00d9ff",
              "textAlign": "left",
              "fontFamily": "Inter, system-ui, sans-serif"
            },
            "animations": [
              { "type": "entrance", "effect": "fadeIn", "delay": 0, "duration": 20, "easing": "easeOutCubic" },
              { "type": "exit", "effect": "fadeOut", "delay": 0, "duration": 20, "easing": "easeInCubic" }
            ]
          },
          {
            "id": "act3-card2-title",
            "type": "text",
            "position": { "x": 1040, "y": 440 },
            "size": { "width": 680, "height": 80 },
            "from": 820,
            "duration": 160,
            "props": {
              "text": "Connect & Integrate",
              "fontSize": 42,
              "fontWeight": "700",
              "color": "#ffffff",
              "textAlign": "left",
              "fontFamily": "Inter, system-ui, sans-serif"
            },
            "animations": [
              { "type": "entrance", "effect": "slideInRight", "delay": 5, "duration": 20, "easing": "easeOutCubic" },
              { "type": "exit", "effect": "fadeOut", "delay": 0, "duration": 20, "easing": "easeInCubic" }
            ]
          },
          {
            "id": "act3-card2-sub",
            "type": "text",
            "position": { "x": 1040, "y": 530 },
            "size": { "width": 680, "height": 60 },
            "from": 835,
            "duration": 145,
            "opacity": 0.7,
            "props": {
              "text": "Plugs into your entire software stack.",
              "fontSize": 28,
              "fontWeight": "300",
              "color": "#a0c4d8",
              "textAlign": "left",
              "fontFamily": "Inter, system-ui, sans-serif"
            },
            "animations": [
              { "type": "entrance", "effect": "fadeIn", "delay": 0, "duration": 20, "easing": "easeOutCubic" },
              { "type": "exit", "effect": "fadeOut", "delay": 0, "duration": 20, "easing": "easeInCubic" }
            ]
          },

          {
            "id": "act3-card3-bg",
            "type": "shape",
            "position": { "x": 160, "y": 320 },
            "size": { "width": 760, "height": 440 },
            "from": 940,
            "duration": 180,
            "opacity": 0.15,
            "props": { "shape": "rectangle", "fill": "#00d9ff", "borderRadius": 16 },
            "animations": [
              { "type": "entrance", "effect": "slideInUp", "delay": 0, "duration": 25, "easing": "easeOutCubic" },
              { "type": "exit", "effect": "fadeOut", "delay": 0, "duration": 20, "easing": "easeInCubic" }
            ]
          },
          {
            "id": "act3-card3-num",
            "type": "text",
            "position": { "x": 200, "y": 350 },
            "size": { "width": 100, "height": 80 },
            "from": 960,
            "duration": 160,
            "props": {
              "text": "03",
              "fontSize": 56,
              "fontWeight": "700",
              "color": "#00d9ff",
              "textAlign": "left",
              "fontFamily": "Inter, system-ui, sans-serif"
            },
            "animations": [
              { "type": "entrance", "effect": "fadeIn", "delay": 0, "duration": 20, "easing": "easeOutCubic" },
              { "type": "exit", "effect": "fadeOut", "delay": 0, "duration": 20, "easing": "easeInCubic" }
            ]
          },
          {
            "id": "act3-card3-title",
            "type": "text",
            "position": { "x": 200, "y": 440 },
            "size": { "width": 680, "height": 80 },
            "from": 960,
            "duration": 160,
            "props": {
              "text": "Pull & Analyze",
              "fontSize": 42,
              "fontWeight": "700",
              "color": "#ffffff",
              "textAlign": "left",
              "fontFamily": "Inter, system-ui, sans-serif"
            },
            "animations": [
              { "type": "entrance", "effect": "slideInLeft", "delay": 5, "duration": 20, "easing": "easeOutCubic" },
              { "type": "exit", "effect": "fadeOut", "delay": 0, "duration": 20, "easing": "easeInCubic" }
            ]
          },
          {
            "id": "act3-card3-sub",
            "type": "text",
            "position": { "x": 200, "y": 530 },
            "size": { "width": 680, "height": 60 },
            "from": 975,
            "duration": 145,
            "opacity": 0.7,
            "props": {
              "text": "Reports in seconds, not days.",
              "fontSize": 28,
              "fontWeight": "300",
              "color": "#a0c4d8",
              "textAlign": "left",
              "fontFamily": "Inter, system-ui, sans-serif"
            },
            "animations": [
              { "type": "entrance", "effect": "fadeIn", "delay": 0, "duration": 20, "easing": "easeOutCubic" },
              { "type": "exit", "effect": "fadeOut", "delay": 0, "duration": 20, "easing": "easeInCubic" }
            ]
          },

          {
            "id": "act3-card4-bg",
            "type": "shape",
            "position": { "x": 1000, "y": 320 },
            "size": { "width": 760, "height": 440 },
            "from": 1080,
            "duration": 180,
            "opacity": 0.15,
            "props": { "shape": "rectangle", "fill": "#00d9ff", "borderRadius": 16 },
            "animations": [
              { "type": "entrance", "effect": "slideInUp", "delay": 0, "duration": 25, "easing": "easeOutCubic" },
              { "type": "exit", "effect": "fadeOut", "delay": 0, "duration": 20, "easing": "easeInCubic" }
            ]
          },
          {
            "id": "act3-card4-num",
            "type": "text",
            "position": { "x": 1040, "y": 350 },
            "size": { "width": 100, "height": 80 },
            "from": 1100,
            "duration": 160,
            "props": {
              "text": "04",
              "fontSize": 56,
              "fontWeight": "700",
              "color": "#00d9ff",
              "textAlign": "left",
              "fontFamily": "Inter, system-ui, sans-serif"
            },
            "animations": [
              { "type": "entrance", "effect": "fadeIn", "delay": 0, "duration": 20, "easing": "easeOutCubic" },
              { "type": "exit", "effect": "fadeOut", "delay": 0, "duration": 20, "easing": "easeInCubic" }
            ]
          },
          {
            "id": "act3-card4-title",
            "type": "text",
            "position": { "x": 1040, "y": 440 },
            "size": { "width": 680, "height": 80 },
            "from": 1100,
            "duration": 160,
            "props": {
              "text": "Generate & Convert",
              "fontSize": 42,
              "fontWeight": "700",
              "color": "#ffffff",
              "textAlign": "left",
              "fontFamily": "Inter, system-ui, sans-serif"
            },
            "animations": [
              { "type": "entrance", "effect": "slideInRight", "delay": 5, "duration": 20, "easing": "easeOutCubic" },
              { "type": "exit", "effect": "fadeOut", "delay": 0, "duration": 20, "easing": "easeInCubic" }
            ]
          },
          {
            "id": "act3-card4-sub",
            "type": "text",
            "position": { "x": 1040, "y": 530 },
            "size": { "width": 680, "height": 60 },
            "from": 1115,
            "duration": 145,
            "opacity": 0.7,
            "props": {
              "text": "Captures leads, answers questions, books appointments.",
              "fontSize": 26,
              "fontWeight": "300",
              "color": "#a0c4d8",
              "textAlign": "left",
              "fontFamily": "Inter, system-ui, sans-serif"
            },
            "animations": [
              { "type": "entrance", "effect": "fadeIn", "delay": 0, "duration": 20, "easing": "easeOutCubic" },
              { "type": "exit", "effect": "fadeOut", "delay": 0, "duration": 20, "easing": "easeInCubic" }
            ]
          },

          {
            "id": "act3-card5-bg",
            "type": "shape",
            "position": { "x": 160, "y": 320 },
            "size": { "width": 760, "height": 440 },
            "from": 1220,
            "duration": 180,
            "opacity": 0.15,
            "props": { "shape": "rectangle", "fill": "#00d9ff", "borderRadius": 16 },
            "animations": [
              { "type": "entrance", "effect": "slideInUp", "delay": 0, "duration": 25, "easing": "easeOutCubic" },
              { "type": "exit", "effect": "fadeOut", "delay": 0, "duration": 20, "easing": "easeInCubic" }
            ]
          },
          {
            "id": "act3-card5-num",
            "type": "text",
            "position": { "x": 200, "y": 350 },
            "size": { "width": 100, "height": 80 },
            "from": 1240,
            "duration": 160,
            "props": {
              "text": "05",
              "fontSize": 56,
              "fontWeight": "700",
              "color": "#00d9ff",
              "textAlign": "left",
              "fontFamily": "Inter, system-ui, sans-serif"
            },
            "animations": [
              { "type": "entrance", "effect": "fadeIn", "delay": 0, "duration": 20, "easing": "easeOutCubic" },
              { "type": "exit", "effect": "fadeOut", "delay": 0, "duration": 20, "easing": "easeInCubic" }
            ]
          },
          {
            "id": "act3-card5-title",
            "type": "text",
            "position": { "x": 200, "y": 440 },
            "size": { "width": 680, "height": 80 },
            "from": 1240,
            "duration": 160,
            "props": {
              "text": "Trigger & Automate",
              "fontSize": 42,
              "fontWeight": "700",
              "color": "#ffffff",
              "textAlign": "left",
              "fontFamily": "Inter, system-ui, sans-serif"
            },
            "animations": [
              { "type": "entrance", "effect": "slideInLeft", "delay": 5, "duration": 20, "easing": "easeOutCubic" },
              { "type": "exit", "effect": "fadeOut", "delay": 0, "duration": 20, "easing": "easeInCubic" }
            ]
          },
          {
            "id": "act3-card5-sub",
            "type": "text",
            "position": { "x": 200, "y": 530 },
            "size": { "width": 680, "height": 60 },
            "from": 1255,
            "duration": 145,
            "opacity": 0.7,
            "props": {
              "text": "1000+ real-world workflows — 24/7, no downtime.",
              "fontSize": 28,
              "fontWeight": "300",
              "color": "#a0c4d8",
              "textAlign": "left",
              "fontFamily": "Inter, system-ui, sans-serif"
            },
            "animations": [
              { "type": "entrance", "effect": "fadeIn", "delay": 0, "duration": 20, "easing": "easeOutCubic" },
              { "type": "exit", "effect": "fadeOut", "delay": 0, "duration": 20, "easing": "easeInCubic" }
            ]
          },

          {
            "id": "act3-card6-bg",
            "type": "shape",
            "position": { "x": 1000, "y": 320 },
            "size": { "width": 760, "height": 440 },
            "from": 1360,
            "duration": 140,
            "opacity": 0.15,
            "props": { "shape": "rectangle", "fill": "#dc2626", "borderRadius": 16 },
            "animations": [
              { "type": "entrance", "effect": "slideInUp", "delay": 0, "duration": 25, "easing": "easeOutCubic" },
              { "type": "exit", "effect": "fadeOut", "delay": 0, "duration": 20, "easing": "easeInCubic" }
            ]
          },
          {
            "id": "act3-card6-num",
            "type": "text",
            "position": { "x": 1040, "y": 350 },
            "size": { "width": 100, "height": 80 },
            "from": 1380,
            "duration": 120,
            "props": {
              "text": "06",
              "fontSize": 56,
              "fontWeight": "700",
              "color": "#dc2626",
              "textAlign": "left",
              "fontFamily": "Inter, system-ui, sans-serif"
            },
            "animations": [
              { "type": "entrance", "effect": "fadeIn", "delay": 0, "duration": 20, "easing": "easeOutCubic" },
              { "type": "exit", "effect": "fadeOut", "delay": 0, "duration": 20, "easing": "easeInCubic" }
            ]
          },
          {
            "id": "act3-card6-title",
            "type": "text",
            "position": { "x": 1040, "y": 440 },
            "size": { "width": 680, "height": 80 },
            "from": 1380,
            "duration": 120,
            "props": {
              "text": "Compound ROI",
              "fontSize": 42,
              "fontWeight": "700",
              "color": "#ffffff",
              "textAlign": "left",
              "fontFamily": "Inter, system-ui, sans-serif"
            },
            "animations": [
              { "type": "entrance", "effect": "slideInRight", "delay": 5, "duration": 20, "easing": "easeOutCubic" },
              { "type": "exit", "effect": "fadeOut", "delay": 0, "duration": 20, "easing": "easeInCubic" }
            ]
          },
          {
            "id": "act3-card6-sub",
            "type": "text",
            "position": { "x": 1040, "y": 530 },
            "size": { "width": 680, "height": 60 },
            "from": 1395,
            "duration": 105,
            "opacity": 0.8,
            "props": {
              "text": "Fixed price. No drama. Just results.",
              "fontSize": 28,
              "fontWeight": "300",
              "color": "#fca5a5",
              "textAlign": "left",
              "fontFamily": "Inter, system-ui, sans-serif"
            },
            "animations": [
              { "type": "entrance", "effect": "fadeIn", "delay": 0, "duration": 20, "easing": "easeOutCubic" },
              { "type": "exit", "effect": "fadeOut", "delay": 0, "duration": 20, "easing": "easeInCubic" }
            ]
          },

          {
            "id": "act4-blackout",
            "type": "shape",
            "position": { "x": 0, "y": 0 },
            "size": { "width": 1920, "height": 1080 },
            "from": 1500,
            "duration": 300,
            "props": { "shape": "rectangle", "fill": "#000000" },
            "animations": [
              { "type": "entrance", "effect": "fadeIn", "delay": 0, "duration": 20, "easing": "easeInCubic" }
            ]
          },

          {
            "id": "act4-ai-coming",
            "type": "text",
            "position": { "x": 360, "y": 440 },
            "size": { "width": 1200, "height": 120 },
            "from": 1530,
            "duration": 120,
            "props": {
              "text": "AI is coming.",
              "fontSize": 80,
              "fontWeight": "700",
              "color": "#dc2626",
              "textAlign": "center",
              "fontFamily": "Inter, system-ui, sans-serif",
              "letterSpacing": 2
            },
            "animations": [
              { "type": "entrance", "effect": "fadeIn", "delay": 0, "duration": 30, "easing": "easeOutCubic" },
              { "type": "exit", "effect": "fadeOut", "delay": 0, "duration": 20, "easing": "easeInCubic" }
            ]
          },

          {
            "id": "act4-white-flash",
            "type": "shape",
            "position": { "x": 0, "y": 0 },
            "size": { "width": 1920, "height": 1080 },
            "from": 1650,
            "duration": 10,
            "opacity": 0.95,
            "props": { "shape": "rectangle", "fill": "#ffffff" },
            "animations": [
              { "type": "entrance", "effect": "fadeIn", "delay": 0, "duration": 5, "easing": "linear" },
              { "type": "exit", "effect": "fadeOut", "delay": 0, "duration": 5, "easing": "linear" }
            ]
          },

          {
            "id": "act4-dont-follow",
            "type": "text",
            "position": { "x": 60, "y": 320 },
            "size": { "width": 1800, "height": 200 },
            "from": 1660,
            "duration": 140,
            "props": {
              "text": "Don't follow.",
              "fontSize": 128,
              "fontWeight": "700",
              "color": "#ffffff",
              "textAlign": "center",
              "fontFamily": "Inter, system-ui, sans-serif",
              "letterSpacing": -2
            },
            "animations": [
              { "type": "entrance", "effect": "slideInUp", "delay": 0, "duration": 20, "easing": "easeOutCubic" }
            ]
          },
          {
            "id": "act4-lead",
            "type": "text",
            "position": { "x": 60, "y": 520 },
            "size": { "width": 1800, "height": 200 },
            "from": 1680,
            "duration": 120,
            "props": {
              "text": "Lead.",
              "fontSize": 128,
              "fontWeight": "700",
              "color": "#dc2626",
              "textAlign": "center",
              "fontFamily": "Inter, system-ui, sans-serif",
              "letterSpacing": -2
            },
            "animations": [
              { "type": "entrance", "effect": "slideInUp", "delay": 0, "duration": 20, "easing": "easeOutCubic" }
            ]
          },
          {
            "id": "act4-logo-bottom",
            "type": "text",
            "position": { "x": 460, "y": 780 },
            "size": { "width": 1000, "height": 60 },
            "from": 1710,
            "duration": 90,
            "props": {
              "text": "SGC TECH AI  •  sgcclaw",
              "fontSize": 28,
              "fontWeight": "600",
              "color": "#888888",
              "textAlign": "center",
              "fontFamily": "Inter, system-ui, sans-serif",
              "letterSpacing": 4
            },
            "animations": [
              { "type": "entrance", "effect": "fadeIn", "delay": 0, "duration": 20, "easing": "easeOutCubic" }
            ]
          },
          {
            "id": "act4-cta",
            "type": "text",
            "position": { "x": 460, "y": 860 },
            "size": { "width": 1000, "height": 50 },
            "from": 1730,
            "duration": 70,
            "opacity": 0.7,
            "props": {
              "text": "Contact us. Tell us your use case. We've got you.",
              "fontSize": 22,
              "fontWeight": "300",
              "color": "#aaaaaa",
              "textAlign": "center",
              "fontFamily": "Inter, system-ui, sans-serif",
              "letterSpacing": 0.5
            },
            "animations": [
              { "type": "entrance", "effect": "fadeIn", "delay": 0, "duration": 20, "easing": "easeOutCubic" }
            ]
          },

          {
            "id": "bg-music",
            "type": "audio",
            "position": { "x": 0, "y": 0 },
            "size": { "width": 0, "height": 0 },
            "from": 0,
            "props": {
              "src": "https://archive.org/download/EdvardGrieg-PeerGyntSuite1Op.46/01-InTheHallOfTheMountainKing.mp3",
              "volume": 0.35,
              "fadeIn": 30,
              "fadeOut": 60,
              "volumeEnvelope": [
                { "frame": 0, "volume": 0 },
                { "frame": 30, "volume": 0.25 },
                { "frame": 360, "volume": 0.25 },
                { "frame": 420, "volume": 0.4 },
                { "frame": 660, "volume": 0.4 },
                { "frame": 900, "volume": 0.55 },
                { "frame": 1400, "volume": 0.65 },
                { "frame": 1500, "volume": 0.3 },
                { "frame": 1650, "volume": 0.8 },
                { "frame": 1700, "volume": 0.4 },
                { "frame": 1800, "volume": 0 }
              ]
            }
          },

          {
            "id": "voiceover",
            "type": "audio",
            "position": { "x": 0, "y": 0 },
            "size": { "width": 0, "height": 0 },
            "from": 0,
            "props": {
              "src": "./assets/sgcclaw-voiceover.mp3",
              "volume": 1.0,
              "effects": [
                { "type": "highpass", "frequency": 80, "Q": 0.707 },
                { "type": "compressor", "threshold": -18, "ratio": 3, "attack": 5, "release": 150, "knee": 4 }
              ]
            }
          }

        ]
      }
    ]
  }
}
```

- [ ] **Step 2: Verify valid JSON**

```bash
node -e "JSON.parse(require('fs').readFileSync('public/sgcclaw-promo-template.json','utf8')); console.log('JSON valid')"
```

Expected: `JSON valid`

- [ ] **Step 3: Commit**

```bash
git add public/sgcclaw-promo-template.json
git commit -m "feat: sgcclaw promo rendervid template (60s, 4 acts)"
```

---

## Task 4: Validate Template via MCP

**Files:** No file changes — MCP tool call only.

> Requires Claude Code session restart to load the rendervid MCP server. If `mcp__rendervid__*` tools are not yet available, run `/mcp` in Claude Code to verify the server is connected, or restart the session.

- [ ] **Step 1: Call `validate_template` MCP tool**

Pass the full JSON object from `public/sgcclaw-promo-template.json` as the `template` argument to `mcp__rendervid__validate_template`.

Expected result:
```json
{ "valid": true, "errors": [], "warnings": [] }
```

- [ ] **Step 2: Fix any validation errors**

If errors are returned, they include `{ "path": "...", "message": "..." }`. Fix the field at the reported path in `public/sgcclaw-promo-template.json`.

Common issues:
- Missing required field: `output.type` must be `"video"` or `"image"`
- Invalid animation `effect`: use values from `mcp__rendervid__get_capabilities` → `animations.entrance[]`
- Layer `from`/`duration` out of range: must be within `0` to `endFrame`

Re-run validate after each fix until `"valid": true`.

- [ ] **Step 3: Commit fixes (if any)**

```bash
git add public/sgcclaw-promo-template.json
git commit -m "fix: rendervid template validation fixes"
```

---

## Task 5: Render the Video

**Files:**
- Generated: `public/sgcclaw-promo.mp4`

> **Voiceover prerequisite:** If you have generated/recorded the voiceover, place it at `public/assets/sgcclaw-voiceover.mp3` before rendering. If not yet ready, remove the `"voiceover"` layer from the template before proceeding — rendervid will fail if the audio file path is not resolvable.

> **FFmpeg must be installed** (Task 1). The rendervid renderer-node uses system FFmpeg for MP4 encoding.

- [ ] **Step 1: Create assets directory**

```bash
mkdir -p public/assets
```

- [ ] **Step 2: Call `render_video` MCP tool**

Use `mcp__rendervid__render_video` with these arguments:
```json
{
  "template": <contents of public/sgcclaw-promo-template.json>,
  "outputPath": "C:/Users/branm/sgc-tech-ai-landing/public/sgcclaw-promo.mp4",
  "format": "mp4",
  "quality": "high",
  "fps": 30
}
```

Expected: render completes in 60–300 seconds. Result:
```json
{
  "success": true,
  "outputPath": "C:/Users/branm/sgc-tech-ai-landing/public/sgcclaw-promo.mp4",
  "duration": 60,
  "fileSize": <bytes>,
  "width": 1920,
  "height": 1080
}
```

- [ ] **Step 3: Verify output file exists**

```bash
ls -lh public/sgcclaw-promo.mp4
```

Expected: file exists, size > 10MB for a 60s high-quality video.

- [ ] **Step 4: Spot-check with a still frame**

Use `mcp__rendervid__render_image` to check Act 4 visually:
```json
{
  "template": <contents of public/sgcclaw-promo-template.json>,
  "outputPath": "C:/Users/branm/sgc-tech-ai-landing/public/sgcclaw-promo-act4-preview.png",
  "format": "png",
  "frame": 1680
}
```

Open `public/sgcclaw-promo-act4-preview.png` and verify "Don't follow." / "Lead." is visible with correct colors.

---

## Task 6: Commit Deliverables

**Files:**
- Commit: `public/sgcclaw-promo.mp4`
- Commit: `public/sgcclaw-promo-act4-preview.png`

- [ ] **Step 1: Add .gitignore for large assets (optional)**

If the video file is too large for git, add to `.gitignore`:
```
public/sgcclaw-promo.mp4
```

Otherwise, proceed to commit.

- [ ] **Step 2: Commit all deliverables**

```bash
git add public/sgcclaw-promo-template.json public/sgcclaw-promo-act4-preview.png docs/sgcclaw-voiceover-script.txt
git commit -m "feat: sgcclaw 60s promo video — template, script, preview frame"
```

---

## Post-Render Checklist

- [ ] Video plays from 0:00 to 1:00 without gaps
- [ ] Act 1 pain-point lines appear and disappear cleanly
- [ ] Act 2 cyan flash transitions correctly at 12s
- [ ] Act 3 all 6 capability cards appear in sequence (01–06)
- [ ] Act 4 "Don't follow. Lead." is bold white + red at 50s
- [ ] Music builds through Act 3 and hits hard at Act 4
- [ ] Voiceover (if included) is audible above music in all acts
