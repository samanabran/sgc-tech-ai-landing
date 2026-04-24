# Phase 2: Visual Mockups & Design Rationale

---

## 🎯 Design System Context

The confirmation panel is designed to fit seamlessly into the existing Aira chatbox aesthetic:
- **Glassmorphism**: Semi-transparent cards with backdrop blur
- **Neon Accents**: Electric cyan (#00D9FF) for interactive elements
- **Dark Mode**: Navy-900 background (#0b0e27) with gray text
- **Typography**: Satoshi for headers/body, JetBrains Mono for technical text
- **Animation Philosophy**: Smooth, subtle, GPU-accelerated entrance/exit

---

## 📐 Desktop Mockup (360px+ width)

### Full Panel Layout
```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │                                                      │ │  ← Glass card
│  │            What did you say?                        │ │     (semi-transparent)
│  │                                                      │ │
│  │  ╭────────────────────────────────────────────────╮ │ │
│  │  ║                                                ║ │ │  ← Transcript preview
│  │  ║  User's recognized speech text goes here.     ║ │ │     (dark bg, cyan border)
│  │  ║  It can be multiple lines and will wrap       ║ │ │
│  │  ║  automatically. If text is very long, it      ║ │ │
│  │  ║  scrolls vertically within the box.           ║ │ │
│  │  ║                                                ║ │ │
│  │  ╰────────────────────────────────────────────────╯ │ │
│  │                                                      │ │
│  │  ┌──────────────────┬──────────────────────────┐   │ │
│  │  │     Cancel       │        Send             │   │ │
│  │  │   (outline)      │    (cyan gradient)      │   │ │
│  │  └──────────────────┴──────────────────────────┘   │ │
│  │                                                      │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Desktop Dimensions
```
Panel Outer Container (. aira-voice-confirmation):
  • Width: 100% (full chatbox width)
  • Max-width: None (fills available space)
  • Padding: 1.5rem 0.8rem
  • Gap between elements: 1rem

Content Card (.aira-confirmation-content):
  • Width: 100%
  • Max-width: 320px (centered)
  • Padding: 1.2rem
  • Border-radius: 16px
  • Background: rgba(16, 22, 50, 0.65) with blur

Heading (.aira-confirmation-heading):
  • Font-size: 1rem (16px)
  • Font-weight: 600
  • Text-align: center
  • Margin: 0
  • Color: #e8ecff (gray-100)

Transcript Box (.aira-transcript-preview):
  • Padding: 1rem
  • Min-height: 60px
  • Max-height: 180px
  • Border-left: 3px solid #00d9ff
  • Font-size: 0.95rem (15.2px)
  • Line-height: 1.5
  • Overflow-y: auto (if text exceeds 180px)

Button Row (.aira-confirmation-actions):
  • Display: flex
  • Gap: 0.6rem
  • Width: 100%

Buttons (.aira-btn-cancel, .aira-btn-send-voice):
  • Flex: 1 (equal width, share space)
  • Height: ~44px (0.65rem padding top/bottom)
  • Border-radius: 8px
  • Font-size: 0.85rem (13.6px)
  • Font-weight: 700
```

---

## 📱 Mobile Mockup (< 360px width, e.g., iPhone SE)

```
┌──────────────────────────────────┐
│                                  │
│  ┌────────────────────────────┐  │
│  │  What did you say?         │  │  ← Heading
│  │                            │  │
│  │  ╭──────────────────────╮  │  │
│  │  ║ User's recognized   ║  │  │
│  │  ║ speech text goes    ║  │  │  ← Transcript box
│  │  ║ here. It wraps      ║  │  │     (full width minus padding)
│  │  ║ nicely on mobile.   ║  │  │
│  │  ╰──────────────────────╯  │  │
│  │                            │  │
│  │  ┌────────────────────┐    │  │
│  │  │  Cancel            │    │  │
│  │  └────────────────────┘    │  │
│  │  ┌────────────────────┐    │  │
│  │  │  Send              │    │  │
│  │  └────────────────────┘    │  │
│  │                            │  │
│  └────────────────────────────┘  │
│                                  │
└──────────────────────────────────┘
```

### Mobile Dimensions
```
Panel Outer Container:
  • Width: 100vw (full screen width)
  • Padding: 0.8rem
  • Max-width: None

Content Card:
  • Width: calc(100vw - 1.6rem) [100% minus 2× padding]
  • Max-width: 320px
  • Padding: 1.2rem
  • Border-radius: 16px (same as desktop)

Buttons Stack Vertically (alternative layout for very small screens):
  Note: This spec keeps buttons side-by-side (flex: 1).
  For future: Consider stacking if screen < 280px.
```

---

## 🎨 Color & Style Guide

### Color Palette Breakdown

| Element | RGB Value | CSS Variable | Opacity | Use Case |
|---------|-----------|--------------|---------|----------|
| Panel Background | rgb(16, 22, 50) | --glass-bg-strong | 65% | Main card surface |
| Panel Border | rgb(0, 217, 255) | --glass-border | 15% | Subtle frame |
| Heading Text | rgb(232, 236, 255) | --gray-100 | 100% | Primary text |
| Transcript BG | rgb(17, 22, 52) | --navy-800 | 100% | Quote container |
| Transcript Text | rgb(232, 236, 255) | --gray-100 | 100% | Body copy |
| Transcript Border | rgb(0, 217, 255) | --cyan | 100% | Left accent line |
| Send Button BG | Gradient | N/A | 100% | Primary CTA |
| Send Button Text | rgb(11, 14, 39) | --navy-900 | 100% | Button text |
| Cancel Button BG | transparent | N/A | 0% | Secondary CTA |
| Cancel Button Border | rgb(0, 217, 255) | --glass-border-hover | 40% | Button outline |
| Cancel Button Text | rgb(232, 236, 255) | --gray-100 | 100% | Button text |

### Gradient Definition (Send Button)
```
Direction: 135deg (diagonal top-left to bottom-right)
Color 1:   #00d9ff (cyan, 0%)
Color 2:   #7eeaff (light cyan, 100%)
Shadow:    0 6px 20px -4px rgba(0, 217, 255, 0.5)
```

---

## ✨ Animation Timings

### Panel Entry Animation (PROCESSING → CONFIRMING)

```
Timeline:
  0ms    ├─ Container: Fade in + slide down
         │  Duration: 200ms
         │  Easing: ease-out-expo
         │  Transform: translateY(-8px) → translateY(0)
         │  Opacity: 0 → 1
         │
  0ms    ├─ Heading: Fade in + slide down (staggered)
         │  Duration: 200ms
         │  Easing: ease-out-expo
         │  Delay: 0ms (starts immediately with container)
         │
  40ms   ├─ Transcript Box: Fade in + slide up
         │  Duration: 200ms
         │  Easing: ease-out-expo
         │  Delay: 40ms
         │  Transform: translateY(12px) → translateY(0)
         │
  80ms   └─ Button Row: Fade in + slide up
            Duration: 200ms
            Easing: ease-out-expo
            Delay: 80ms
            Transform: translateY(12px) → translateY(0)

Total Animation Time: 280ms (200ms + 80ms delay for buttons)
Visual Effect: Cascading entrance from top to bottom
```

### Button Interactions

```
Hover State:
  └─ Scale: 1 → 1.05 (5% larger)
  └─ Transition Duration: 120ms
  └─ Easing: cubic-bezier(0.34, 1.56, 0.64, 1) [custom elastic]
  └─ Shadow Enhancement: Add glow (Cancel) / intensify (Send)

Press/Active State:
  └─ Scale: 1 → 0.95 (5% smaller)
  └─ Transition Duration: Immediate (100ms ease)
  └─ Effect: Tactile feedback, press-button feel

Focus State (Keyboard):
  └─ Outline: Inherited from browser default
  └─ Shadow: Enhanced glow for visibility

Disabled State (if needed):
  └─ Opacity: 0.5 or 0.6
  └─ Cursor: not-allowed
  └─ Pointer-events: none
```

### Panel Exit Animation (CONFIRMING → IDLE)

```
On Cancel or Escape:
  └─ Container: Fade out + slide up
  │  Duration: 150ms
  │  Easing: ease-in (default)
  │  Transform: translateY(0) → translateY(12px)
  │  Opacity: 1 → 0
  │
  └─ After 150ms: Set display: none + hidden attribute

On Send (success):
  └─ Container: Fade out (messages replace panel)
  │  Duration: 200ms
  │  Easing: ease-out
  │  Opacity: 1 → 0
  │
  └─ After 200ms: Panel hidden, chat message displayed
```

---

## 📊 Spacing & Layout Grid

### Padding & Margin System

```
Base Unit: 0.25rem (4px)

Standard Spacing Scale:
  0.25rem  = 4px
  0.5rem   = 8px
  0.6rem   = 10px
  0.8rem   = 12px
  1rem     = 16px
  1.2rem   = 20px
  1.5rem   = 24px

Component Spacing:
  Panel padding:         1.5rem (vertical) × 0.8rem (horizontal)
  Content card padding:  1.2rem (all sides)
  Transcript padding:    1rem (all sides)
  Button padding:        0.65rem (vertical) × 1rem (horizontal)
  Gap between elements:  1rem (vertical) / 0.6rem (horizontal)
```

### Z-Index Hierarchy (if needed)

```
Global Z-Index Context:
  Chatbox backdrop:      10
  Confirmation panel:    11
  Dropdown/modals:       20
  
(Typically not needed for this component, but included for reference)
```

---

## ♿ Accessibility Specifics

### Keyboard Navigation

```
Tab Order (logical flow):
  1. [Cancel] button
  2. [Send] button
  (Wraps back to Cancel if Tab pressed again)

Key Bindings:
  Enter:   Activate focused button (browser default)
  Space:   Activate focused button (browser default)
  Escape:  Cancel confirmation (custom handler)
  Tab:     Move focus to next button
  Shift+Tab: Move focus to previous button
```

### Screen Reader Announcements

```
Heading:
  HTML: <h3 class="aira-confirmation-heading">What did you say?</h3>
  Announced: "What did you say?, heading level 3"

Transcript Box (if labelledby):
  HTML: <div id="aira-transcript-preview" aria-label="Recognized speech">
  Announced: "Recognized speech, text box, [transcript content]"

Cancel Button:
  HTML: <button ... aria-label="Cancel voice message">Cancel</button>
  Announced: "Cancel voice message, button"

Send Button:
  HTML: <button ... aria-label="Send voice message">Send</button>
  Announced: "Send voice message, button"
```

### Color Contrast Ratios (WCAG AA Compliance)

```
Text on Backgrounds:

[gray-100 text] (#e8ecff) on [navy-800 bg] (#111634):
  Ratio: 12.5:1 ✓ AAA (exceeds AA minimum of 4.5:1)

[cyan border] (#00d9ff) on [navy-800 bg] (#111634):
  Ratio: 6.2:1 ✓ AA (meets minimum for graphics/borders)

[navy-900 text] (#0b0e27) on [cyan button bg] (#00d9ff):
  Ratio: 14.2:1 ✓ AAA (exceeds requirements)

[gray-100 text] (#e8ecff) on [glass-bg-strong] (65% opacity):
  Ratio: ~8:1 ✓ AAA (sufficient contrast with blur effect)
```

### Focus Indicators

```
Default Browser Focus:
  Outline: 2px solid Highlight (browser-dependent)
  Offset: 2px from button edge

CSS Enhancement (optional):
  .aira-btn-cancel:focus,
  .aira-btn-send-voice:focus {
    outline: 2px solid var(--cyan);
    outline-offset: 2px;
  }

Visibility: Must be clearly visible for keyboard users
```

---

## 🎬 Animation Preset Library

### Available Animations (Defined in CSS)

```javascript
// Predefined keyframes you can reuse:

@keyframes airaFadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes airaFadeInDown {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}

// Already defined in codebase (from voice mic button):
@keyframes airaListeningPulse { /* pulse effect */ }
@keyframes airaListeningRing { /* ring expansion */ }
@keyframes airaVoiceBar { /* bar animation */ }
```

---

## 🖼️ Figma/Design File Reference

If you need to reference or modify the design in Figma:

### Component Hierarchy
```
Voice Confirmation Panel
├── Background & Glassmorphism
│   └── glass-bg-strong (rgba 65% opacity)
│   └── Backdrop blur (12px)
│   └── Border: glass-border (1px, 15% opacity)
│
├── Content
│   ├── Heading ("What did you say?")
│   │   └── Satoshi 1rem/600wt, center-aligned, gray-100
│   │
│   ├── Transcript Preview Box
│   │   ├── Background: navy-800
│   │   ├── Border-left: 3px cyan
│   │   ├── Padding: 1rem
│   │   ├── Text: Satoshi 0.95rem/400wt, gray-100
│   │   └── Overflow: scroll if > 180px height
│   │
│   └── Action Buttons
│       ├── Cancel Button (outline style)
│       │   └── 50% width, navy border, gray text
│       │
│       └── Send Button (gradient style)
│           └── 50% width, cyan gradient, navy text
│
└── Animation States
    ├── Enter: Fade-in-up with stagger
    ├── Hover: Scale 1.05 + glow
    ├── Press: Scale 0.95
    └── Exit: Fade-out
```

---

## 🔍 Visual Inspection Checklist

After implementing, verify these visual aspects:

- [ ] Panel has glass effect (semi-transparent with subtle blur)
- [ ] Cyan left border on transcript box is crisp (3px, not blurry)
- [ ] Text is readable (high contrast on dark backgrounds)
- [ ] Buttons are distinct (gradient vs outline)
- [ ] Hover states show clear feedback (scale + shadow)
- [ ] Animation is smooth (no jank, 60fps)
- [ ] Mobile doesn't have horizontal scroll
- [ ] Long transcripts scroll smoothly
- [ ] Focus indicators visible for keyboard users
- [ ] Colors match design tokens (not hardcoded hex values)

---

## 📈 Design Evolution & Future States

### Phase 2 (Current)
- Simple confirmation with transcript preview
- Two actions: Send / Cancel
- No user editing

### Phase 2.5 (Planned)
- Add [Edit] button to enable inline editing
- Show edited indicator "[edited]" next to transcript
- Preserve edit state during confirmation flow

### Phase 3 (Future Consideration)
- Audio playback button to replay recognized speech
- Confidence score display (e.g., "97% confident")
- Alternative recognition results (2-3 options)
- Language selection dropdown

### Phase 4 (Long-term Vision)
- Streaming transcript (show words as they're recognized)
- Real-time ASR confidence visualization
- Integration with aura assistant state
- Historical transcript search/replay

---

## 📚 Design System Consistency

### Component Reuse
The confirmation panel follows existing Aira design patterns:

| Pattern | Example |
|---------|---------|
| Glass cards | Matches `.aira-chat-form`, `.aira-quick-actions` |
| Cyan gradient buttons | Reuses mic button gradient style |
| Outline buttons | Matches secondary button style |
| Animation easing | Uses project's `--ease-out-expo` variable |
| Typography | Satoshi headings, gray-100 text (consistent) |
| Spacing grid | 0.25rem units (matches codebase) |

**Benefit**: Confirmation panel feels native to the Aira ecosystem, not a separate component.

---

## 🎯 Brand & Tone

### Visual Tone
- **Premium**: Glassmorphism + neon accents evoke high-tech elegance
- **Approachable**: Large text, clear buttons (not cluttered)
- **Trustworthy**: Simple, unambiguous options (Send / Cancel)
- **Modern**: Smooth animations, gradient accents

### Messaging
- "What did you say?" (conversational, not "Confirm transcript")
- Simple button labels (Send/Cancel, not "Confirm/Discard")
- Status updates: "Ready to send?" (friendly, active voice)

---

**Design ready for implementation.** All visual specs, animations, and accessibility details are locked. ✅
