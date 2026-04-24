# Phase 2: Voice Confirmation Panel Design & Implementation Spec

## Executive Summary

**Goal**: Add a transcript confirmation panel that appears after voice recognition completes, before the message is sent to the API.

**Framework**: Hono.js (native JSX, not React)
**Status**: Ready to implement
**Estimated Effort**: 3-4 hours (implementation) + 1 hour (testing)
**Bundle Impact**: +~8-12 KB (CSS + minimal JS state)

---

## 1. Design Mockup & Visual Specification

### State Diagram
```
    IDLE (default)
      ↓ [user holds mic]
    RECORDING (pulsing mic, visualizer active)
      ↓ [user releases/stops speaking]
    PROCESSING (spinner, "Processing...")
      ↓ [recognition fires onresult]
    CONFIRMING ← **NEW STATE** (transcript preview panel + buttons)
      ├→ [Send] → SENDING → API call → SUCCESS → IDLE
      ├→ [Cancel] → (closes panel) → IDLE
      └→ [Edit] → EDITING (Phase 2.5 optional)
```

### Confirmation Panel Layout

```
┌─────────────────────────────────────────┐
│         CONFIRMING STATE PANEL          │
├─────────────────────────────────────────┤
│                                         │
│  What did you say?                      │ (heading)
│                                         │
│  ╭─────────────────────────────────────╮│
│  │                                     ││
│  │  User's recognized transcript text  ││ (quote/preview box)
│  │  displayed in full, word-wrapped.   ││
│  │  Can be multiple lines.             ││
│  │                                     ││
│  ╰─────────────────────────────────────╯│
│                                         │
│  [Cancel]      [Send]                   │ (action buttons)
│                                         │
└─────────────────────────────────────────┘
```

### Color & Styling Guide

| Element | Color | CSS Variable | Comment |
|---------|-------|--------------|---------|
| Panel BG | navy-900 with glassmorphism | `--glass-bg-strong` | semi-transparent with backdrop blur |
| Border | cyan 15% | `--glass-border` | subtle neon frame |
| Heading | gray-100 | `--gray-100` | secondary heading style |
| Transcript BG | navy-800 | `--navy-800` | darker container for contrast |
| Transcript Text | gray-100 | `--gray-100` | readable foreground |
| Transcript Border | cyan 30% | `--glass-border-hover` | citation/quote styling |
| [Send] Button | cyan gradient | N/A | primary action (similar to mic button) |
| [Cancel] Button | navy-border outline | `--glass-border` | secondary action |
| Hover Effects | scale + glow | N/A | consistent with existing buttons |

### Typography

| Element | Font | Size | Weight | Letter-spacing |
|---------|------|------|--------|-----------------|
| "What did you say?" | Satoshi | 1rem | 600 | -0.01em |
| Transcript text | Satoshi | 0.95rem | 400 | 0 |
| Button text | Satoshi | 0.85rem | 700 | -0.01em |

### Animations & Transitions

1. **Panel Entry** (PROCESSING → CONFIRMING):
   - Fade in + slide up (200ms, ease-out-expo)
   - Stagger: heading (0ms), transcript box (40ms), buttons (80ms)

2. **Button Interactions**:
   - Hover: scale(1.05) + enhance glow (120ms ease)
   - Press: scale(0.95) (100ms ease)

3. **Panel Exit** (CONFIRMING → IDLE):
   - Fade out (150ms) if Cancel
   - Fade to SUCCESS message if Send succeeds

---

## 2. HTML/JSX Structure (Hono Syntax)

Add this new markup **inside** `.aira-voice-panel` (after the existing recorder div):

```jsx
{/* Confirmation Panel - NEW */}
<div class="aira-voice-confirmation" data-voice-confirmation hidden>
  <div class="aira-confirmation-content">
    <h3 class="aira-confirmation-heading">What did you say?</h3>
    
    <div class="aira-transcript-preview" id="aira-transcript-preview">
      {/* Transcript text will be inserted here by JS */}
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

### Location in src/index.tsx
Insert after line 1268 (after `.aira-voice-hint` closing), before line 1271 (before `/* Quick action buttons */`):

```jsx
              </div>
            </div>

            {/* Confirmation Panel - NEW */}
            <div class="aira-voice-confirmation" data-voice-confirmation hidden>
              {/* ...markup from above... */}
            </div>

            {/* Quick action buttons */}
```

---

## 3. CSS Styling (All States)

Add to `public/static/style.css` after the existing `.aira-voice-hint` rule (around line 873):

```css
/* ---- Voice Confirmation Panel ---- */
.aira-voice-confirmation[hidden],
.aira-voice-confirmation {
  display: flex !important;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem 0.8rem;
  opacity: 1;
  transform: translateY(0);
  transition: all 200ms var(--ease-out-expo);
}

.aira-voice-confirmation[hidden] {
  display: none !important;
  opacity: 0;
  transform: translateY(12px);
  pointer-events: none;
}

.aira-confirmation-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 320px;
  padding: 1.2rem;
  background: var(--glass-bg-strong);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-md);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.aira-confirmation-heading {
  font-family: 'Satoshi', system-ui, sans-serif;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--gray-100);
  text-align: center;
  margin: 0;
}

.aira-transcript-preview {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background: var(--navy-800);
  border-left: 3px solid var(--cyan);
  border-radius: 6px;
  color: var(--gray-100);
  font-family: 'Satoshi', system-ui, sans-serif;
  font-size: 0.95rem;
  font-weight: 400;
  line-height: 1.5;
  word-break: break-word;
  overflow-wrap: break-word;
  max-height: 180px;
  overflow-y: auto;
  animation: airaFadeInUp 200ms 40ms var(--ease-out-expo) both;
}

.aira-confirmation-actions {
  display: flex;
  gap: 0.6rem;
  width: 100%;
  animation: airaFadeInUp 200ms 80ms var(--ease-out-expo) both;
}

.aira-btn-cancel,
.aira-btn-send-voice {
  flex: 1;
  padding: 0.65rem 1rem;
  border-radius: 8px;
  font-family: 'Satoshi', system-ui, sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  cursor: pointer;
  transition: all 120ms cubic-bezier(0.34, 1.56, 0.64, 1);
  border: 1px solid transparent;
  white-space: nowrap;
}

.aira-btn-cancel {
  background: transparent;
  border: 1px solid var(--glass-border-hover);
  color: var(--gray-100);
}

.aira-btn-cancel:hover {
  background: rgba(0, 217, 255, 0.08);
  border-color: var(--cyan);
  transform: scale(1.05);
  box-shadow: 0 4px 12px -2px rgba(0, 217, 255, 0.2);
}

.aira-btn-cancel:active {
  transform: scale(0.95);
}

.aira-btn-send-voice {
  background: linear-gradient(135deg, var(--cyan) 0%, #7eeaff 100%);
  color: var(--navy-900);
  box-shadow: 0 6px 20px -4px rgba(0, 217, 255, 0.5);
}

.aira-btn-send-voice:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 28px -4px rgba(0, 217, 255, 0.7);
}

.aira-btn-send-voice:active {
  transform: scale(0.95);
}

/* Scrollbar styling for transcript preview */
.aira-transcript-preview::-webkit-scrollbar {
  width: 6px;
}

.aira-transcript-preview::-webkit-scrollbar-track {
  background: transparent;
}

.aira-transcript-preview::-webkit-scrollbar-thumb {
  background: rgba(0, 217, 255, 0.2);
  border-radius: 3px;
}

.aira-transcript-preview::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 217, 255, 0.4);
}

/* Existing animations - ensure these are defined (may already exist) */
@keyframes airaFadeInUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

## 4. JavaScript Implementation (public/static/app.js)

### Changes to recognition.onresult Handler

**Current Code (lines 1164-1171):**
```javascript
recognition.onresult = (event) => {
  const transcript = event.results?.[0]?.[0]?.transcript?.trim() || '';
  if (!transcript) {
    return;
  }
  handleVoiceUserInput(transcript);
};
```

**New Code:**
```javascript
recognition.onresult = (event) => {
  const transcript = event.results?.[0]?.[0]?.transcript?.trim() || '';
  if (!transcript) {
    return;
  }
  // NEW: Show confirmation panel instead of directly calling API
  showVoiceConfirmation(transcript);
};
```

### New Functions to Add (after handleVoiceUserInput, around line 957)

```javascript
// Current voice state tracking
let pendingVoiceTranscript = null;

function showVoiceConfirmation(transcript) {
  pendingVoiceTranscript = transcript;
  
  const confirmationPanel = document.querySelector('[data-voice-confirmation]');
  const transcriptPreview = document.getElementById('aira-transcript-preview');
  const voiceStatus = document.getElementById('aira-voice-status');
  
  if (!confirmationPanel || !transcriptPreview) return;
  
  // Stop the listening visual
  isVoiceListening = false;
  if (voiceVisualizer) voiceVisualizer.classList.remove('recording');
  if (voiceToggleBtn) {
    voiceToggleBtn.classList.remove('listening');
    voiceToggleBtn.innerHTML = '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>';
  }
  
  // Update status
  if (voiceStatus) voiceStatus.textContent = 'Ready to send?';
  
  // Insert transcript into preview
  transcriptPreview.textContent = transcript;
  
  // Show confirmation panel
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
  
  // Now proceed with the original flow
  handleVoiceUserInput(pendingVoiceTranscript);
  pendingVoiceTranscript = null;
}
```

### Event Listeners for Confirmation Panel Buttons

Add this code after the voice recognition handlers (around line 1192, after the existing recognition.onend handler):

```javascript
// Voice confirmation panel button handlers
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

// Escape key to cancel confirmation
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !document.querySelector('[data-voice-confirmation]').hidden) {
    hideVoiceConfirmation(true);
  }
});
```

---

## 5. Integration Checklist

- [ ] Add confirmation panel JSX to src/index.tsx (lines 1250-1270)
- [ ] Add CSS rules to public/static/style.css
- [ ] Modify recognition.onresult handler in public/static/app.js
- [ ] Add showVoiceConfirmation() function
- [ ] Add hideVoiceConfirmation() function
- [ ] Add confirmVoiceTranscript() function
- [ ] Add pendingVoiceTranscript state variable
- [ ] Add event listeners for [Cancel] and [Send] buttons
- [ ] Add Escape key handler for confirmation panel
- [ ] Update voiceStatus text messaging
- [ ] Test on desktop + mobile

---

## 6. Implementation Timeline

### Phase 2.0 (3-4 hours)
1. **30 min** - Add markup to index.tsx
2. **30 min** - Add CSS styling
3. **1 hour** - Add JS functions and event handlers
4. **30 min** - Wire up button handlers
5. **30-60 min** - Test and debug on desktop + mobile

### Phase 2.5 (Optional, +2 hours)
- Add [Edit] button to open inline text editor
- Allow user to modify transcript before sending
- Save edited version to chat history with [edited] marker

### Phase 3 (Future consideration)
- Audio playback of recognized speech
- Multiple recognition results (confidence scores)
- Language selection dropdown

---

## 7. Testing Strategy

### Manual Testing Checklist

**Desktop (Chrome):**
- [ ] Say something → confirmation panel appears with correct text
- [ ] Click [Send] → message appears in chat, audio response plays
- [ ] Click [Cancel] → panel closes, message NOT sent
- [ ] Press Escape → panel closes
- [ ] Long transcript (30+ words) → text wraps, scrolls if needed
- [ ] Confirm multiple messages in sequence

**Mobile (iOS Safari / Android Chrome):**
- [ ] Same flow as desktop
- [ ] Buttons are tappable (minimum 48px)
- [ ] Text doesn't overflow on narrow screens
- [ ] Panel animates smoothly

**Accessibility:**
- [ ] Tab through buttons (keyboard nav)
- [ ] Screen reader announces "What did you say?" heading
- [ ] aria-label on buttons read correctly
- [ ] Color contrast meets WCAG AA

### E2E Test (Playwright)

```javascript
// tests/voice-confirmation.spec.ts (example structure)
test('shows confirmation panel after voice recognition', async ({ page }) => {
  // Mock Web Speech API
  // Trigger recognition.onresult with test transcript
  // Assert confirmation panel is visible
  // Assert transcript text matches
});

test('sends message on Send button click', async ({ page }) => {
  // Show confirmation panel
  // Click [Send]
  // Assert message appears in chat
  // Assert API was called
});

test('cancels on Cancel button click', async ({ page }) => {
  // Show confirmation panel
  // Click [Cancel]
  // Assert panel is hidden
  // Assert message NOT in chat
  // Assert API was NOT called
});
```

---

## 8. Performance Considerations

- **CSS**: Glassmorphism uses `backdrop-filter` (GPU-accelerated on modern browsers)
- **JS State**: One simple variable (`pendingVoiceTranscript`) to track confirmation state
- **Bundle**: ~8 KB CSS + ~1 KB minified JS
- **Animations**: GPU-accelerated with `will-change` implicit in `transform`
- **No new dependencies**: Pure vanilla JS, no libraries needed

---

## 9. Accessibility Notes

| Feature | Implementation |
|---------|-----------------|
| ARIA Labels | `aria-label` on buttons |
| Keyboard Nav | Tab order, Enter to confirm, Escape to cancel |
| Color Contrast | Cyan on navy meets WCAG AA (7:1) |
| Focus States | Inherit from button styles (transform/glow provides feedback) |
| Screen Reader | Semantic HTML (`<h3>`, `<button>`) |
| Reduced Motion | Consider adding `prefers-reduced-motion` media query |

---

## 10. Design Rationale & Alternatives

### Why This Approach?
1. **Non-blocking**: Users see the transcript before irreversible action
2. **Builds trust**: Reduces anxiety about misrecognition
3. **Minimal UI**: Doesn't compete with existing mic button/visualizer
4. **Mobile-friendly**: Single-column layout, large touch targets
5. **Consistent**: Uses existing design tokens, glassmorphism aesthetic

### Alternative Approaches Considered
| Approach | Pros | Cons | Status |
|----------|------|------|--------|
| **Modal overlay** (this spec) | Clear interruption, dedicated focus | Blocks other UI | ✓ Selected |
| **Inline card expansion** | Smooth, less modal feel | Hard to ensure visibility on mobile | Rejected |
| **Toast notification** | Fast, non-disruptive | Too easy to miss | Rejected |
| **Editable text field** | More control | Adds complexity, Phase 2.5 alternative | Deferred |

---

## 11. Known Limitations & Future Improvements

1. **Currently**: Single recognition result (highest confidence)
   - Future: Show 2-3 alternatives with confidence scores

2. **Currently**: No audio playback
   - Future: "Replay" button to hear recognized audio

3. **Currently**: No editing
   - Future: Phase 2.5 adds inline text editor

4. **Currently**: No error handling for malformed transcripts
   - Future: Validate transcript, show warning for empty/garbage input

5. **Mobile speech focus**: Assumes device microphone permission already granted
   - Current behavior: Error handler already in place if denied

---

## 12. Rollout Strategy

### Phase 2 Rollout Steps:
1. Implement locally (this spec)
2. Test on desktop + mobile
3. Code review (check accessibility, performance)
4. Deploy to staging
5. QA on multiple devices/browsers
6. Deploy to production with feature flag (optional)
7. Monitor analytics: `voice_confirmation_shown`, `voice_confirmation_cancelled`, `voice_user_message`

### Rollback Plan:
If issues arise:
- Remove `.hidden` attribute from confirmation panel in index.tsx
- Revert recognition.onresult to direct `handleVoiceUserInput()` call
- Verify existing voice flow still works

---

## 13. Metrics to Track

Add these events to analytics (use existing `appendEvent()` function):

```javascript
// Success metrics
appendEvent('voice_confirmation_shown', { transcript });        // When panel appears
appendEvent('voice_confirmation_sent', { transcript });         // When user clicks Send
appendEvent('voice_confirmation_cancelled', {});                // When user cancels

// Quality metrics
appendEvent('transcript_length', { length: transcript.length }); // Avg transcript size
appendEvent('confirmation_time', { ms: timeToConfirm });       // User decision speed
```

---

## References

- **Current Voice Code**: `public/static/app.js` lines 1026-1192
- **Current Voice Panel**: `src/index.tsx` lines 1250-1270
- **Design Tokens**: `public/static/style.css` lines 13-44
- **Hono JSX Docs**: https://hono.dev/docs/guides/jsx
- **Web Speech API**: https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API

---

**Last Updated**: 2025-04-24
**Version**: 2.0 (Phase 2 Design Spec)
**Status**: Ready for implementation ✓
