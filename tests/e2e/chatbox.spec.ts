import { test, expect } from '@playwright/test'

test.describe('Aira Chatbox', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Clear any accumulated chat history so the panel height is deterministic
    await page.evaluate(() => {
      localStorage.clear()
      sessionStorage.clear()
    })
    await page.reload()
    // Wait for app.js to initialize
    await page.waitForLoadState('networkidle')
  })

  /** Open the panel and wait for its animation to settle */
  async function openPanel(page: any) {
    await page.locator('[data-chat-launcher]').click({ force: true })
    await page.locator('.aira-chat-panel.is-open').waitFor({ state: 'attached', timeout: 5000 })
    // Wait for opening animation to complete (0.32s transition)
    await page.waitForTimeout(380)
  }

  // ── Launcher button ───────────────────────────────────────────────
  test.describe('Launcher button', () => {
    test('is visible and uses brand glow button class', async ({ page }) => {
      await expect(page.locator('.floating-ai-btn[data-chat-launcher]')).toBeVisible()
    })

    test('has aria-expanded=false initially', async ({ page }) => {
      await expect(page.locator('[data-chat-launcher]')).toHaveAttribute('aria-expanded', 'false')
    })

    test('click sets aria-expanded=true and adds is-active class', async ({ page }) => {
      const launcher = page.locator('[data-chat-launcher]')
      await launcher.click({ force: true })
      await expect(launcher).toHaveAttribute('aria-expanded', 'true')
      await expect(launcher).toHaveClass(/is-active/)
    })

    test('bot icon visible when closed, close icon visible when open', async ({ page }) => {
      const launcher = page.locator('[data-chat-launcher]')
      await expect(launcher.locator('.icon-bot')).toBeVisible()
      await expect(launcher.locator('.icon-close')).toBeHidden()

      await launcher.click({ force: true })

      await expect(launcher.locator('.icon-bot')).toBeHidden()
      await expect(launcher.locator('.icon-close')).toBeVisible()
    })
  })

  // ── Panel open / close ────────────────────────────────────────────
  test.describe('Panel open/close', () => {
    test('clicking launcher opens chat panel', async ({ page }) => {
      await openPanel(page)
      await expect(page.locator('[data-chat-panel]')).toBeVisible()
    })

    test('close button hides panel', async ({ page }) => {
      await openPanel(page)
      // Use dispatchEvent to bypass viewport edge-cases with fixed/absolute panels
      await page.locator('[data-chat-close]').dispatchEvent('click')
      await expect(page.locator('[data-chat-panel]')).not.toBeVisible()
    })

    test('close button removes is-active from launcher', async ({ page }) => {
      const launcher = page.locator('[data-chat-launcher]')
      await openPanel(page)
      await page.locator('[data-chat-close]').dispatchEvent('click')
      await expect(launcher).not.toHaveClass(/is-active/)
    })

    test('Escape key closes panel', async ({ page }) => {
      await openPanel(page)
      await page.keyboard.press('Escape')
      await expect(page.locator('[data-chat-panel]')).not.toBeVisible()
    })

    test('clicking outside panel closes it', async ({ page }) => {
      await openPanel(page)
      await page.mouse.click(50, 50)
      await expect(page.locator('[data-chat-panel]')).not.toBeVisible()
    })
  })

  // ── Panel header ──────────────────────────────────────────────────
  test.describe('Panel header', () => {
    test.beforeEach(async ({ page }) => { await openPanel(page) })

    test('shows status dot', async ({ page }) => {
      await expect(page.locator('.aira-status-dot').first()).toBeVisible()
    })

    test('shows SGC TECH badge', async ({ page }) => {
      await expect(page.locator('.aira-badge-model')).toContainText('SGC TECH')
    })

    test('shows Pro badge', async ({ page }) => {
      await expect(page.locator('.aira-badge-pro')).toContainText('Pro')
    })
  })

  // ── Chat textarea & input ─────────────────────────────────────────
  test.describe('Chat input', () => {
    test.beforeEach(async ({ page }) => { await openPanel(page) })

    test('textarea input is visible', async ({ page }) => {
      await expect(page.locator('[data-chat-input]')).toBeVisible()
    })

    test('textarea has correct placeholder', async ({ page }) => {
      await expect(page.locator('[data-chat-input]')).toHaveAttribute('placeholder', /Ask Aira/)
    })

    test('character counter starts at 0/2000', async ({ page }) => {
      await expect(page.locator('[data-char-counter]')).toHaveText('0/2000')
    })

    test('character counter updates as user types', async ({ page }) => {
      await page.locator('[data-chat-input]').fill('Hello Aira')
      await expect(page.locator('[data-char-counter]')).toHaveText('10/2000')
    })

    test('empty message Enter does not submit (input stays focused)', async ({ page }) => {
      const input = page.locator('[data-chat-input]')
      await input.click()
      await input.press('Enter')
      await expect(input).toBeFocused()
    })

    test('Shift+Enter inserts newline instead of submitting', async ({ page }) => {
      const input = page.locator('[data-chat-input]')
      await input.fill('line one')
      await input.press('Shift+Enter')
      const value = await input.inputValue()
      expect(value).toContain('\n')
    })
  })

  // ── Mode switch (Chat / Voice) ────────────────────────────────────
  test.describe('Mode switch', () => {
    test.beforeEach(async ({ page }) => { await openPanel(page) })

    test('chat mode is active by default', async ({ page }) => {
      await expect(page.locator('[data-mode="chat"]')).toHaveClass(/active/)
      await expect(page.locator('[data-chat-form]')).toBeVisible()
      await expect(page.locator('[data-voice-panel]')).toBeHidden()
    })

    test('clicking Voice tab switches mode', async ({ page }) => {
      await page.locator('[data-mode="voice"]').dispatchEvent('click')
      await expect(page.locator('[data-mode="voice"]')).toHaveClass(/active/)
      await expect(page.locator('[data-voice-panel]')).toBeVisible()
      await expect(page.locator('[data-chat-form]')).toBeHidden()
    })

    test('mic shortcut button switches to voice mode', async ({ page }) => {
      await page.locator('[data-mode-trigger="voice"]').dispatchEvent('click')
      await expect(page.locator('[data-mode="voice"]')).toHaveClass(/active/)
    })

    test('switching back to chat shows form', async ({ page }) => {
      await page.locator('[data-mode="voice"]').dispatchEvent('click')
      await page.locator('[data-mode="chat"]').dispatchEvent('click')
      await expect(page.locator('[data-chat-form]')).toBeVisible()
    })
  })

  // ── Quick actions ─────────────────────────────────────────────────
  test.describe('Quick actions', () => {
    test.beforeEach(async ({ page }) => { await openPanel(page) })

    test('Book Demo button is visible', async ({ page }) => {
      await expect(page.locator('[data-book-demo]')).toBeVisible()
    })

    test('Talk to Human button is visible', async ({ page }) => {
      await expect(page.locator('[data-talk-human]')).toBeVisible()
    })

    test('Talk to Human reveals alert links', async ({ page }) => {
      await page.locator('[data-talk-human]').dispatchEvent('click')
      await expect(page.locator('[data-alert-links]')).toBeVisible()
      await expect(page.locator('[data-alert-whatsapp]')).toBeVisible()
      await expect(page.locator('[data-alert-telegram]')).toBeVisible()
    })
  })

  // ── Aira chat API round-trip (mocked) ─────────────────────────────
  test.describe('Chat API', () => {
    test('sending a message shows typing indicator then an assistant reply', async ({ page }) => {
      await openPanel(page)
      const input = page.locator('[data-chat-input]')
      await input.fill('What can you do?')
      await input.press('Enter')

      // User message appears synchronously
      await expect(page.locator('[data-chat-log] .aira-msg.user')).toContainText('What can you do?')

      // Typing indicator should appear while waiting for the reply
      await expect(page.locator('.aira-typing')).toBeVisible({ timeout: 5000 })

      // An assistant reply (real API or connection-error fallback) should arrive within 20 s
      await expect(page.locator('[data-chat-log] .aira-msg.assistant').last())
        .not.toHaveText(/Hello, welcome/, { timeout: 20000 })
    })

    test('char counter resets to 0/2000 after send', async ({ page }) => {
      await page.route('/api/aira/chat', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ ok: true, reply: 'Got it!', sessionId: 's1' }),
        })
      })

      await openPanel(page)
      const input = page.locator('[data-chat-input]')
      await input.fill('Hello')
      await expect(page.locator('[data-char-counter]')).toHaveText('5/2000')
      await input.press('Enter')
      await expect(page.locator('[data-char-counter]')).toHaveText('0/2000')
    })
  })
})
