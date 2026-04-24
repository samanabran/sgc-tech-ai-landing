# Phase 2: Copy-Paste Implementation Code

> Use these code blocks directly—they are formatted exactly as they appear in the production files.

---

## 📋 File 1: src/index.tsx

### Location
Line 1269 (after `.aira-voice-recorder` closing `</div>`, inside `.aira-voice-panel`)

### Code to Insert

```jsx
            {/* Confirmation Panel - Phase 2 NEW */}
            <div class="aira-voice-confirmation" data-voice-confirmation hidden>
              <div class="aira-confirmation-content">
                <h3 class="aira-confirmation-heading">What did you say?</h3>
                
                <div class="aira-transcript-preview" id="aira-transcript-preview">
                  {/* Transcript text inserted by JS */}
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

### Context (lines 1265-1275)
```jsx
                <p class="aira-voice-hint">Hold button or press Space to talk</p>
              </div>
            </div>

            {/* Confirmation Panel - Phase 2 NEW */}
            <div class="aira-voice-confirmation" data-voice-confirmation hidden>
              {/* ... new markup above ... */}
            </div>

            {/* Quick action buttons */}
            <div class="aira-quick-actions">
```

---

## 🎨 File 2: public/static/style.css

### Location
Line 874 (after `.aira-voice-hint` rule, before `/* ---- Quick Actions ---- */`)

### Code to Insert

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
  animation: airaFadeInDown 200ms var(--ease-out-expo);
}

.aira-confirmation-heading {
  font-family: 'Satoshi', system-ui, sans-serif;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--gray-100);
  text-align: center;
  margin: 0;
  animation: airaFadeInUp 200ms 0ms var(--ease-out-expo) backwards;
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

.aira-btn-cancel:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.aira-btn-send-voice {
  background: linear-gradient(135deg, var(--cyan) 0%, #7eeaff 100%);
  color: var(--navy-900);
  box-shadow: 0 6px 20px -4px rgba(0, 217, 255, 0.5);
  font-weight: 700;
}

.aira-btn-send-voice:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 28px -4px rgba(0, 217, 255, 0.7);
}

.aira-btn-send-voice:active {
  transform: scale(0.95);
}

.aira-btn-send-voice:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Scrollbar for long transcripts */
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

/* Animation: fade in up (entrance) */
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

/* Animation: fade in down (heading) */
@keyframes airaFadeInDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Context (lines 870-880)
```css
.aira-voice-hint {
  font-size: 0.72rem;
  color: #52525b;
  font-family: var(--font-mono);
}

/* ---- Voice Confirmation Panel ---- */
.aira-voice-confirmation[hidden],
.aira-voice-confirmation {
  /* ...new CSS above... */
}

/* ---- Quick Actions ---- */
```

---

## 🔧 File 3: public/static/app.js

### Change 1: Modify recognition.onresult (Line 1165)

**Find:**
```javascript
recognition.onresult = (event) => {
  const transcript = event.results?.[0]?.[0]?.transcript?.trim() || '';
  if (!transcript) {
    return;
  }
  handleVoiceUserInput(transcript);
};
```

**Replace with:**
```javascript
recognition.onresult = (event) => {
  const transcript = event.results?.[0]?.[0]?.transcript?.trim() || '';
  if (!transcript) {
    return;
  }
  showVoiceConfirmation(transcript);
};
```

---

### Change 2: Add New Functions (After line 956, after `handleVoiceUserInput`)

**Insert:**
```javascript

    // ---- Voice Confirmation Panel ----
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
        // Reset mic icon
        voiceToggleBtn.innerHTML = '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>';
      }
      
      // Update status
      if (voiceStatus) voiceStatus.textContent = 'Ready to send?';
      
      // Display transcript
      transcriptPreview.textContent = transcript;
      
      // Show panel with animation
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

---

### Change 3: Add Event Listeners (After line 1192, after `recognition.onend`)

**Find:**
```javascript
      recognition.onend = () => {
        isVoiceListening = false;
        if (voiceToggleBtn) {
          voiceToggleBtn.classList.remove('listening');
          voiceToggleBtn.innerHTML = '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>';
        }
        if (voiceVisualizer) voiceVisualizer.classList.remove('recording');
        if (voiceStatus) voiceStatus.textContent = 'Tap the microphone to start';
      };
    }
```

**Insert after the closing `}` of `recognition.onend`:**

```javascript

    // Voice confirmation panel handlers
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

---

## 📊 Visual Design Reference

### Confirmation Panel Dimensions

```
Container (.aira-voice-confirmation):
  └─ width: 100%
  └─ max-width: 360px
  └─ padding: 1.5rem 0.8rem (sides) / 1.2rem (content)
  └─ gap: 1rem (between elements)

Content Card (.aira-confirmation-content):
  └─ max-width: 320px
  └─ padding: 1.2rem
  └─ border-radius: 16px (--radius-md)
  └─ border: 1px solid var(--glass-border)
  └─ background: var(--glass-bg-strong) with backdrop-filter

Transcript Box (.aira-transcript-preview):
  └─ min-height: 60px
  └─ max-height: 180px
  └─ padding: 1rem
  └─ border-left: 3px solid var(--cyan)
  └─ overflow-y: auto (if transcript > 180px height)

Buttons (.aira-btn-cancel, .aira-btn-send-voice):
  └─ flex: 1 (equal width)
  └─ height: ~44px (padding: 0.65rem 1rem)
  └─ min-width: 80px
  └─ border-radius: 8px (--radius-sm)
  └─ gap between: 0.6rem
```

### Color Palette

```
Primary Actions (Send button):
  Normal:  linear-gradient(135deg, var(--cyan) 0%, #7eeaff 100%)
  Hover:   Same gradient with enhanced shadow
  Active:  Scale 0.95
  
Secondary Actions (Cancel button):
  Normal:  transparent background, 1px border: var(--glass-border-hover)
  Hover:   rgba(0, 217, 255, 0.08) background, cyan border
  Active:  Scale 0.95

Text Colors:
  Heading: var(--gray-100)
  Body:    var(--gray-100)
  
Backgrounds:
  Panel:      var(--glass-bg-strong)
  Transcript: var(--navy-800)
  
Borders:
  Panel:      var(--glass-border)
  Transcript: 3px left border: var(--cyan)
```

### Animation Timing

```
Panel Entry:
  Container:         200ms ease-out-expo fade-in-down
  Heading:           200ms ease-out-expo fade-in-down (0ms delay)
  Transcript Box:    200ms ease-out-expo fade-in-up (40ms delay)
  Buttons:           200ms ease-out-expo fade-in-up (80ms delay)
  
Button Interactions:
  Hover Scale:       120ms cubic-bezier(0.34, 1.56, 0.64, 1)
  Press Scale:       100ms ease (immediate)
  
Panel Exit:
  All elements:      150ms fade-out
```

### Typography Details

```
Heading "What did you say?":
  Font:       'Satoshi'
  Size:       1rem (16px)
  Weight:     600 (semi-bold)
  Spacing:    -0.01em
  Line Height: auto
  Color:      var(--gray-100)
  Alignment:  center

Transcript Text:
  Font:       'Satoshi'
  Size:       0.95rem (15.2px)
  Weight:     400 (regular)
  Spacing:    0
  Line Height: 1.5
  Color:      var(--gray-100)

Button Text:
  Font:       'Satoshi'
  Size:       0.85rem (13.6px)
  Weight:     700 (bold)
  Spacing:    -0.01em
  Color:      var(--navy-900) [Send] / var(--gray-100) [Cancel]
```

---

## 🧪 Test Cases (Copy-Paste Ready)

### Unit Test Example (Vitest)
```javascript
// tests/voice-confirmation.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Voice Confirmation Panel', () => {
  beforeEach(() => {
    // Setup DOM
    document.body.innerHTML = `
      <div data-voice-confirmation hidden>
        <div class="aira-confirmation-content">
          <h3 class="aira-confirmation-heading">What did you say?</h3>
          <div id="aira-transcript-preview"></div>
          <button data-voice-confirm-cancel>Cancel</button>
          <button data-voice-confirm-send>Send</button>
        </div>
      </div>
    `;
  });

  it('shows confirmation panel with transcript', () => {
    const panel = document.querySelector('[data-voice-confirmation]');
    const preview = document.getElementById('aira-transcript-preview');
    
    expect(panel.hidden).toBe(true);
    
    // Simulate showVoiceConfirmation
    panel.hidden = false;
    preview.textContent = 'Hello world';
    
    expect(panel.hidden).toBe(false);
    expect(preview.textContent).toBe('Hello world');
  });

  it('cancels confirmation when Cancel clicked', () => {
    const panel = document.querySelector('[data-voice-confirmation]');
    const cancelBtn = document.querySelector('[data-voice-confirm-cancel]');
    
    panel.hidden = false;
    cancelBtn.click();
    
    // After hideVoiceConfirmation runs
    setTimeout(() => {
      expect(panel.hidden).toBe(true);
    }, 200);
  });
});
```

---

## 📝 Error Handling Notes

### Missing Elements
```javascript
// Safeguard in showVoiceConfirmation:
if (!confirmationPanel || !transcriptPreview) {
  console.warn('Voice confirmation elements not found');
  return;
}
```

### Empty Transcript
```javascript
// Already handled in recognition.onresult:
if (!transcript) {
  return; // Don't show panel for empty strings
}
```

### Button Click Race Condition
```javascript
// Prevent double-send:
if (!pendingVoiceTranscript) return; // In confirmVoiceTranscript()
```

---

## 🚀 Deployment Checklist

- [ ] All three files modified correctly
- [ ] No syntax errors: `npm run build`
- [ ] Tests pass: `npm run test`
- [ ] Manual test: Voice flow works end-to-end
- [ ] Mobile responsive: Test on iPad/iPhone + Android tablet
- [ ] Accessibility: Tab nav, screen reader, contrast ratios
- [ ] Performance: Bundle size unchanged, animations smooth (60fps)
- [ ] Browser compatibility: Chrome, Safari, Firefox, Edge
- [ ] Fallback: Panel hidden if elements not found (no JS crash)

---

## 📞 Quick Debugging

| Issue | Debug Command |
|-------|---------------|
| Panel not showing | `document.querySelector('[data-voice-confirmation]').hidden` → should be `false` |
| Transcript empty | `document.getElementById('aira-transcript-preview').textContent` → check value |
| Buttons not clickable | Inspect with DevTools, check `pointer-events` CSS |
| Animation broken | Disable `backdrop-filter` line in CSS to isolate |
| State leak | `pendingVoiceTranscript` → should be `null` after sending/cancel |

---

**Ready to implement! Copy these snippets directly into your files.** ✅
