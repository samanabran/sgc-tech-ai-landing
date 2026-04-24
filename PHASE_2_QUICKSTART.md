# Phase 2: Quick Implementation Guide

> **Status**: Ready to code  
> **Estimated Time**: 3-4 hours  
> **Complexity**: Moderate (markup + styling + state management)

---

## Quick Visual Reference

### Desktop Layout (360px+ width)
```
┌────────────────────────────────────────┐
│          VOICE CONFIRMATION            │
├────────────────────────────────────────┤
│                                        │
│        What did you say?               │  ← Heading (Satoshi 1rem/600wt)
│                                        │
│  ┌────────────────────────────────────┐│
│  │ ╎ User's recognized speech text    ││  ← Transcript preview
│  │ ╎ displayed here, word-wrapped,    ││     (navy-800 bg, cyan left border)
│  │ ╎ with vertical scroll if long.    ││
│  └────────────────────────────────────┘│
│                                        │
│  ┌───────────────┬───────────────────┐ │
│  │    Cancel     │      Send        │ │  ← Action buttons
│  │  (outline)    │   (cyan gradient) │ │
│  └───────────────┴───────────────────┘ │
│                                        │
└────────────────────────────────────────┘
```

### Mobile Layout (< 360px)
```
Same as desktop but:
- Transcript box: min-height 80px
- Buttons: full width, stack vertically
- Padding: 0.8rem → 1rem
```

### State Flow Visual

```
START
  ↓
[1] User holds mic button
  ↓
RECORDING STATE
  │ (pulsing mic, visualizer bars animate)
  ↓
[2] User releases/stops speaking
  ↓
PROCESSING STATE
  │ (spinner shows, "Processing...")
  ├─ Web Speech API processes audio
  └─ Recognition engine generates transcript
  ↓
[3] recognition.onresult fires ← **INTERCEPTION POINT**
  ↓
CONFIRMING STATE ← **NEW: SHOW PANEL**
  │ (confirmation panel appears with transcript)
  │
  ├─→ [Cancel] clicked
  │     ↓
  │   IDLE (dismiss panel, no API call)
  │
  ├─→ [Send] clicked
  │     ↓
  │   SENDING STATE
  │     │ (spinner, "Sending...")
  │     ↓
  │   API receives transcript
  │     ↓
  │   SUCCESS STATE
  │     │ (message in chat, audio response plays)
  │     ↓
  │   IDLE (return to start)
  │
  └─→ Escape key pressed
       ↓
     IDLE (same as Cancel)
```

---

## Code Changes Summary

### 1️⃣ **src/index.tsx** (Add markup ~20 lines)

**Location**: After line 1268 (inside `.aira-voice-panel`)

**What to add**: Confirmation panel markup with heading, transcript preview box, and buttons

**Key points**:
- Use `class` (not `className`)
- Use `data-` attributes for JS hooks
- Include `hidden` attribute initially

---

### 2️⃣ **public/static/style.css** (Add styling ~150 lines)

**Location**: After line 873 (after `.aira-voice-hint`)

**What to add**:
- `.aira-voice-confirmation` (container)
- `.aira-confirmation-content` (glass card)
- `.aira-confirmation-heading` (heading text)
- `.aira-transcript-preview` (quote box with left border)
- `.aira-confirmation-actions` (button row)
- `.aira-btn-cancel` (outline button)
- `.aira-btn-send-voice` (cyan gradient button)
- `@keyframes airaFadeInUp` (entry animation)

**Key points**:
- Use CSS variables from `:root`
- Glassmorphism: `backdrop-filter: blur(12px)`
- Cyan left border: `border-left: 3px solid var(--cyan)`
- Animations: 200ms fade-in-up with staggered children
- Scrollbar styling for long transcripts

---

### 3️⃣ **public/static/app.js** (Add functions + handlers ~80 lines)

**Changes**:
1. Modify `recognition.onresult` (line 1165) to call `showVoiceConfirmation()` instead of `handleVoiceUserInput()`

2. Add three new functions:
   - `showVoiceConfirmation(transcript)` - Display panel
   - `hideVoiceConfirmation(cancelled)` - Hide panel
   - `confirmVoiceTranscript()` - Send the message

3. Add state variable:
   - `let pendingVoiceTranscript = null`

4. Add event listeners:
   - Cancel button: calls `hideVoiceConfirmation(true)`
   - Send button: calls `confirmVoiceTranscript()`
   - Escape key: calls `hideVoiceConfirmation(true)`

**Key points**:
- State variable holds transcript during confirmation
- Clear visual feedback: update voice-status text
- Stop visualizer/mic animation when panel shows
- Chain function calls: `showVoiceConfirmation()` → `hideVoiceConfirmation()` → `handleVoiceUserInput()`

---

## Step-by-Step Walkthrough

### Step 1: Markup (10 minutes)

Open `src/index.tsx` and find line 1250 (the voice panel):

```jsx
{/* Voice panel */}
<div class="aira-voice-panel" data-voice-panel hidden>
  <div class="aira-voice-recorder">
    {/* existing content */}
  </div>
</div>
```

After the closing `</div>` of `.aira-voice-recorder` (line 1268), add:

```jsx
{/* Confirmation Panel - NEW */}
<div class="aira-voice-confirmation" data-voice-confirmation hidden>
  <div class="aira-confirmation-content">
    <h3 class="aira-confirmation-heading">What did you say?</h3>
    
    <div class="aira-transcript-preview" id="aira-transcript-preview">
    </div>
    
    <div class="aira-confirmation-actions">
      <button 
        type="button" 
        class="aira-btn-cancel" 
        data-voice-confirm-cancel
        aria-label="Cancel voice message"
      >
        Cancel
      </button>
      <button 
        type="button" 
        class="aira-btn-send-voice" 
        data-voice-confirm-send
        aria-label="Send voice message"
      >
        Send
      </button>
    </div>
  </div>
</div>
```

**Verify**: Browser doesn't throw JSX errors when you reload.

---

### Step 2: Styling (15 minutes)

Open `public/static/style.css` and go to line 873 (after `.aira-voice-hint`).

Paste the entire CSS block from **Section 3 of the design spec** above.

**Key CSS rules to understand**:
- `.aira-voice-confirmation[hidden]` → `display: none` with transition
- `.aira-confirmation-content` → Glass card with `backdrop-filter`
- `.aira-transcript-preview` → Dark box with cyan left border
- `.aira-btn-send-voice` → Cyan gradient (like mic button)
- `@keyframes airaFadeInUp` → Staggered entry animation

**Verify**: 
```bash
npm run build  # No CSS errors
```

---

### Step 3: JavaScript - State & Functions (30 minutes)

Open `public/static/app.js` and find line 957 (after `handleVoiceUserInput` function).

Add these new functions:

```javascript
// Voice confirmation state
let pendingVoiceTranscript = null;

function showVoiceConfirmation(transcript) {
  pendingVoiceTranscript = transcript;
  
  const confirmationPanel = document.querySelector('[data-voice-confirmation]');
  const transcriptPreview = document.getElementById('aira-transcript-preview');
  const voiceStatus = document.getElementById('aira-voice-status');
  
  if (!confirmationPanel || !transcriptPreview) return;
  
  // Stop listening visuals
  isVoiceListening = false;
  if (voiceVisualizer) voiceVisualizer.classList.remove('recording');
  if (voiceToggleBtn) {
    voiceToggleBtn.classList.remove('listening');
    // Reset mic icon to default
    voiceToggleBtn.innerHTML = '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>';
  }
  
  // Update status text
  if (voiceStatus) voiceStatus.textContent = 'Ready to send?';
  
  // Show transcript
  transcriptPreview.textContent = transcript;
  
  // Animate panel in
  confirmationPanel.hidden = false;
  requestAnimationFrame(() => {
    confirmationPanel.classList.add('visible');
  });
  
  appendEvent('voice_confirmation_shown', { transcript: transcript });
}

function hideVoiceConfirmation(cancelled = false) {
  const confirmationPanel = document.querySelector('[data-voice-confirmation]');
  const voiceStatus = document.getElementById('aira-voice-status');
  
  if (!confirmationPanel) return;
  
  confirmationPanel.classList.remove('visible');
  setTimeout(() => {
    if (!confirmationPanel.classList.contains('visible')) {
      confirmationPanel.hidden = true;
      pendingVoiceTranscript = null;
      if (voiceStatus) voiceStatus.textContent = 'Tap the microphone to start';
    }
  }, 150);
  
  if (cancelled) {
    appendEvent('voice_confirmation_cancelled', {});
  }
}

function confirmVoiceTranscript() {
  if (!pendingVoiceTranscript) return;
  
  hideVoiceConfirmation(false);
  handleVoiceUserInput(pendingVoiceTranscript);
  pendingVoiceTranscript = null;
}
```

**Verify**: No console errors when you open the app.

---

### Step 4: Modify Event Handler (5 minutes)

Find line 1164-1171 in `public/static/app.js`:

```javascript
recognition.onresult = (event) => {
  const transcript = event.results?.[0]?.[0]?.transcript?.trim() || '';
  if (!transcript) {
    return;
  }
  handleVoiceUserInput(transcript);  // ← CHANGE THIS
};
```

Replace `handleVoiceUserInput(transcript)` with `showVoiceConfirmation(transcript)`:

```javascript
recognition.onresult = (event) => {
  const transcript = event.results?.[0]?.[0]?.transcript?.trim() || '';
  if (!transcript) {
    return;
  }
  showVoiceConfirmation(transcript);  // ← CHANGED
};
```

---

### Step 5: Add Button & Keyboard Handlers (10 minutes)

Find line 1192 in `public/static/app.js` (after `recognition.onend`).

Add these event listeners:

```javascript
// Voice confirmation panel buttons
const voiceConfirmCancelBtn = document.querySelector('[data-voice-confirm-cancel]');
const voiceConfirmSendBtn = document.querySelector('[data-voice-confirm-send]');

if (voiceConfirmCancelBtn) {
  voiceConfirmCancelBtn.addEventListener('click', () => {
    hideVoiceConfirmation(true);
  });
}

if (voiceConfirmSendBtn) {
  voiceConfirmSendBtn.addEventListener('click', () => {
    confirmVoiceTranscript();
  });
}

// Escape key cancels confirmation
document.addEventListener('keydown', (e) => {
  const confirmationPanel = document.querySelector('[data-voice-confirmation]');
  if (e.key === 'Escape' && confirmationPanel && !confirmationPanel.hidden) {
    hideVoiceConfirmation(true);
  }
});
```

**Verify**: 
- Click Cancel → panel closes, no message sent
- Click Send → message appears in chat
- Press Escape on open panel → panel closes

---

## Testing Checklist

After implementing all changes:

### ✅ Visual Testing
- [ ] Panel appears with cyan border, glassmorphism background
- [ ] Transcript text displays correctly
- [ ] Buttons are cyan (Send) and outline (Cancel)
- [ ] Buttons hover with scale + glow effect
- [ ] Panel fades in smoothly (no jumpy animation)

### ✅ Functional Testing
- [ ] Say something into mic
- [ ] Confirmation panel appears (not empty)
- [ ] [Send] button works → message in chat, API called
- [ ] [Cancel] button works → panel closes, no message sent
- [ ] [Escape] key works → panel closes
- [ ] Audio response plays after sending
- [ ] Can confirm multiple messages in sequence

### ✅ Edge Cases
- [ ] Very short transcript ("yes") → displays, sends correctly
- [ ] Very long transcript (100+ words) → scrolls in preview box
- [ ] Repeated confirmations → state clears properly each time
- [ ] Network error during send → error message displays (existing behavior)

### ✅ Mobile (iPhone + Android)
- [ ] Panel displays full width
- [ ] Buttons are large enough to tap (48px+)
- [ ] Text doesn't overflow
- [ ] Scroll works in transcript preview
- [ ] All interactions work on touch

### ✅ Accessibility
- [ ] Tab through buttons (keyboard nav)
- [ ] Screen reader reads "What did you say?" heading
- [ ] Buttons have aria-label attributes
- [ ] Color contrast passes WCAG AA

---

## Troubleshooting

### Panel doesn't appear
**Check**:
- Is `data-voice-confirmation` selector correct in JS?
- Is confirmation panel HTML in the correct place (inside `.aira-voice-panel`)?
- Check browser console for JS errors

### Panel appears but text is empty
**Check**:
- Is `#aira-transcript-preview` ID present in HTML?
- Is `transcriptPreview.textContent = transcript` line being executed?
- Use `console.log(transcript)` to verify the transcript string is valid

### Buttons don't work
**Check**:
- Are `data-voice-confirm-cancel` and `data-voice-confirm-send` selectors present?
- Are event listeners attached (check console for errors)?
- Try clicking in browser DevTools → verify element is clickable

### Animation is choppy
**Check**:
- Is `.aira-voice-confirmation[hidden] { display: none !important; }` rule present?
- Try removing `backdrop-filter` temporarily to isolate the issue
- Check browser DevTools → Performance tab for dropped frames

### Text overflows in preview box
**Check**:
- Is `word-break: break-word; overflow-wrap: break-word;` present in CSS?
- Is `max-height: 180px; overflow-y: auto;` set?
- Test with very long single word (no spaces) to verify wrapping

---

## File Changes Summary

| File | Lines | Change | Effort |
|------|-------|--------|--------|
| `src/index.tsx` | 1269-1288 | Add confirmation panel markup | 10 min |
| `public/static/style.css` | 874-1030 | Add confirmation styling | 15 min |
| `public/static/app.js` | 957-1007 | Add functions | 20 min |
| `public/static/app.js` | 1165 | Modify `recognition.onresult` | 2 min |
| `public/static/app.js` | 1193-1215 | Add event listeners | 10 min |
| **Total** | **~140 lines** | **5 changes** | **~60 min** |

---

## Performance Impact

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| CSS Bundle | ~45 KB | ~45 KB | +150 bytes |
| JS Bundle | ~175 KB | ~175 KB | +~1 KB minified |
| Voice flow latency | <50ms | <50ms | None (state only) |
| Initial page load | ~2.5s | ~2.5s | None |
| Memory (pending transcript) | N/A | ~100 bytes | Negligible |

**No performance regression expected.** ✓

---

## Next Steps After Phase 2

**Phase 2.5 Ideas**:
- [ ] Add [Edit] button to modify transcript before sending
- [ ] Add audio playback: "Replay" button to hear the recognized speech
- [ ] Show recognition confidence score (0-100%)
- [ ] Multiple alternatives: Show 2-3 recognition results

**Phase 3 Ideas**:
- [ ] Language selection dropdown
- [ ] Punctuation toggle (normalize: "hello world" vs "Hello, world.")
- [ ] Search/replace within transcript

---

## Questions?

Refer back to:
- **Full Spec**: `PHASE_2_DESIGN_SPEC.md`
- **Design Tokens**: `public/static/style.css` lines 13-44
- **Existing Voice Code**: `public/static/app.js` lines 1026-1192
- **Hono JSX Syntax**: https://hono.dev/docs/guides/jsx

---

**Phase 2 Ready**: 🚀 Begin implementation
