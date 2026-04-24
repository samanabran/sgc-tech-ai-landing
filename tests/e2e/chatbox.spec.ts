import { test, expect } from '@playwright/test'

test.describe('Aira Chatbox', () => {
  test.beforeEach(async ({ page }) => {
    // Dismiss the welcome popup so it doesn't block interactions
    await page.goto('/')
    await page.evaluate(() => sessionStorage.setItem('aira-welcomed', '1'))
    await page.reload()
  })

  // ── Launcher button ───────────────────────────────────────────────
  test.describe('Launcher button', () => {
    test('is visible and uses brand glow button class', async ({ page }) => {
      const launcher = page.locator('.floating-ai-btn[data-chat-launcher]')
      await expect(launcher).toBeVisible()
    })

    test('has aria-expanded=false initially', async ({ page }) => {
      const launcher = page.locator('[data-chat-launcher]')
      await expect(launcher).toHaveAttribute('aria-expanded', 'false')
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
      await page.locator('[data-chat-launcher]').click({ force: true })
      const panel = page.locator('[data-chat-panel]')
      await expect(panel).toBeVisible()
    })

    test('close button hides panel', async ({ page }) => {
      await page.locator('[data-chat-launcher]').click({ force: true })
      await page.locator('[data-chat-close]').click({ force: true })
      await expect(page.locator('[data-chat-panel]')).not.toBeVisible()
    })

    test('close button removes is-active from launcher', async ({ page }) => {
      const launcher = page.locator('[data-chat-launcher]')
      await launcher.click({ force: true })
      await page.locator('[data-chat-close]').click({ force: true })
      await expect(launcher).not.toHaveClass(/is-active/)
    })

    test('Escape key closes panel', async ({ page }) => {
      await page.locator('[data-chat-launcher]').click({ force: true })
      await page.keyboard.press('Escape')
      await expect(page.locator('[data-chat-panel]')).not.toBeVisible()
    })

    test('clicking outside panel closes it', async ({ page }) => {
      await page.locator('[data-chat-launcher]').click({ force: true })
      await page.mouse.click(50, 50)
      await expect(page.locator('[data-chat-panel]')).not.toBeVisible()
    })
  })

  // ── Header elements ───────────────────────────────────────────────
  test.describe('Panel header', () => {
    test.beforeEach(async ({ page }) => {
      await page.locator('[data-chat-launcher]').click({ force: true })
    })

    test('shows status dot', async ({ page }) => {
      await expect(page.locator('.aira-status-dot')).toBeVisible()
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
    test.beforeEach(async ({ page }) => {
      await page.locator('[data-chat-launcher]').click({ force: true })
    })

    test('textarea input is visible', async ({ page }) => {
      await expect(page.locator('[data-chat-input]')).toBeVisible()
    })

    test('textarea has correct placeholder', async ({ page }) => {
      const input = page.locator('[data-chat-input]')
      await expect(input).toHaveAttribute('placeholder', /Ask Aira/)
    })

    test('character counter starts at 0/2000', async ({ page }) => {
      await expect(page.locator('[data-char-counter]')).toHaveText('0/2000')
    })

    test('character counter updates as user types', async ({ page }) => {
      const input = page.locator('[data-chat-input]')
      await input.fill('Hello Aira')
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
    test.beforeEach(async ({ page }) => {
      await page.locator('[data-chat-launcher]').click({ force: true })
    })

    test('chat mode is active by default', async ({ page }) => {
      await expect(page.locator('[data-mode="chat"]')).toHaveClass(/active/)
      await expect(page.locator('[data-chat-form]')).toBeVisible()
      await expect(page.locator('[data-voice-panel]')).toBeHidden()
    })

    test('clicking Voice tab switches mode', async ({ page }) => {
      await page.locator('[data-mode="voice"]').click()
      await expect(page.locator('[data-mode="voice"]')).toHaveClass(/active/)
      await expect(page.locator('[data-voice-panel]')).toBeVisible()
      await expect(page.locator('[data-chat-form]')).toBeHidden()
    })

    test('mic shortcut button switches to voice mode', async ({ page }) => {
      await page.locator('[data-mode-trigger="voice"]').click()
      await expect(page.locator('[data-mode="voice"]')).toHaveClass(/active/)
    })

    test('switching back to chat shows form', async ({ page }) => {
      await page.locator('[data-mode="voice"]').click()
      await page.locator('[data-mode="chat"]').click()
      await expect(page.locator('[data-chat-form]')).toBeVisible()
    })
  })

  // ── Quick actions ─────────────────────────────────────────────────
  test.describe('Quick actions', () => {
    test.beforeEach(async ({ page }) => {
      await page.locator('[data-chat-launcher]').click({ force: true })
    })

    test('Book Demo button is visible', async ({ page }) => {
      await expect(page.locator('[data-book-demo]')).toBeVisible()
    })

    test('Talk to Human button is visible', async ({ page }) => {
      await expect(page.locator('[data-talk-human]')).toBeVisible()
    })

    test('Talk to Human reveals alert links', async ({ page }) => {
      await page.locator('[data-talk-human]').click()
      await expect(page.locator('[data-alert-links]')).toBeVisible()
      await expect(page.locator('[data-alert-whatsapp]')).toBeVisible()
      await expect(page.locator('[data-alert-telegram]')).toBeVisible()
    })
  })

  // ── Aira chat API round-trip (mocked) ─────────────────────────────
  test.describe('Chat API', () => {
    test('typing a message and pressing Enter calls /api/aira/chat and shows reply', async ({ page }) => {
      await page.route('/api/aira/chat', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ ok: true, reply: 'Hello from Aira!', sessionId: 'test-session' }),
        })
      })

      await page.locator('[data-chat-launcher]').click({ force: true })
      const input = page.locator('[data-chat-input]')
      await input.fill('What can you do?')
      await input.press('Enter')

      // Message should appear in the log
      await expect(page.locator('[data-chat-log] .aira-msg.user')).toContainText('What can you do?')
      await expect(page.locator('[data-chat-log] .aira-msg.assistant')).toContainText('Hello from Aira!', { timeout: 10000 })
    })

    test('char counter resets to 0/2000 after send', async ({ page }) => {
      await page.route('/api/aira/chat', async route => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ ok: true, reply: 'Got it!', sessionId: 's1' }),
        })
      })

      await page.locator('[data-chat-launcher]').click({ force: true })
      const input = page.locator('[data-chat-input]')
      await input.fill('Hello')
      await expect(page.locator('[data-char-counter]')).toHaveText('5/2000')
      await input.press('Enter')
      await expect(page.locator('[data-char-counter]')).toHaveText('0/2000')
    })
  })
})
