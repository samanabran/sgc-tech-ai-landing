import { test, expect } from '@playwright/test'

test.describe('Aira Chatbox', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  // ── Page load ────────────────────────────────────────────────────
  test.describe('Chatbox launcher', () => {
    test('chatbox launcher button is visible', async ({ page }) => {
      const launcher = page.locator('#chatbox-launcher')
      await expect(launcher).toBeVisible()
    })

    test('launcher shows chat icon', async ({ page }) => {
      const launcher = page.locator('#chatbox-launcher')
      await expect(launcher).toContainText('Chat')
    })

    test('clicking launcher opens chat panel', async ({ page }) => {
      const launcher = page.locator('#chatbox-launcher')
      await launcher.click()
      const panel = page.locator('#chatbox-panel')
      await expect(panel).toBeVisible()
      await expect(launcher).toHaveAttribute('aria-expanded', 'true')
    })
  })

  // ── Chat panel ───────────────────────────────────────────────────
  test.describe('Chat panel', () => {
    test.beforeEach(async ({ page }) => {
      await page.locator('#chatbox-launcher').click()
    })

    test('panel displays header with title', async ({ page }) => {
      await expect(page.locator('#chatbox-header')).toBeVisible()
    })

    test('panel displays chat input field', async ({ page }) => {
      const input = page.locator('#chat-input')
      await expect(input).toBeVisible()
      await expect(input).toHaveAttribute('placeholder', /type|message|ask/i)
    })

    test('panel displays send button', async ({ page }) => {
      const sendBtn = page.locator('#chat-send')
      await expect(sendBtn).toBeVisible()
    })

    test('chat log is visible', async ({ page }) => {
      const chatLog = page.locator('#chat-log')
      await expect(chatLog).toBeVisible()
    })
  })

  // ── Send message ─────────────────────────────────────────────────
  test.describe('Send message', () => {
    test.beforeEach(async ({ page }) => {
      await page.locator('#chatbox-launcher').click()
    })

    test('typing and pressing Enter sends message', async ({ page }) => {
      const input = page.locator('#chat-input')
      await input.fill('Hello')
      await input.press('Enter')

      // User message should appear
      const userMsg = page.locator('.chat-msg.user').first()
      await expect(userMsg).toBeVisible()
      await expect(userMsg).toContainText('Hello')
    })

    test('clicking send button sends message', async ({ page }) => {
      const input = page.locator('#chat-input')
      const sendBtn = page.locator('#chat-send')
      await input.fill('Test message')
      await sendBtn.click()

      const userMsg = page.locator('.chat-msg.user').first()
      await expect(userMsg).toBeVisible()
      await expect(userMsg).toContainText('Test message')
    })

    test('input clears after sending', async ({ page }) => {
      const input = page.locator('#chat-input')
      await input.fill('Hello')
      await input.press('Enter')
      await expect(input).toHaveValue('')
    })

    test('empty message does not send', async ({ page }) => {
      const input = page.locator('#chat-input')
      await input.press('Enter')

      // No new messages should appear
      const userMsgs = page.locator('.chat-msg.user')
      await expect(userMsgs).toHaveCount(0)
    })
  })

  // ── AIRA proxy integration ───────────────────────────────────────
  test.describe('AIRA proxy response', () => {
    test.beforeEach(async ({ page }) => {
      await page.locator('#chatbox-launcher').click()
    })

    test('displays typing indicator while waiting for response', async ({ page }) => {
      const input = page.locator('#chat-input')
      await input.fill('Hello')
      await input.press('Enter')

      // Typing indicator should appear
      const typingIndicator = page.locator('.aira-typing')
      await expect(typingIndicator).toBeVisible()
    })

    test('displays assistant response after typing', async ({ page }) => {
      const input = page.locator('#chat-input')
      await input.fill('What services do you offer?')
      await input.press('Enter')

      // Wait for typing indicator to disappear and response to appear
      const typingIndicator = page.locator('.aira-typing')
      await expect(typingIndicator).toBeVisible()
      await expect(typingIndicator).not.toBeVisible({ timeout: 30000 })

      // Assistant response should appear
      const assistantMsg = page.locator('.chat-msg.assistant, .aira-msg').filter({ hasText: /.+/ }).last()
      await expect(assistantMsg).toBeVisible({ timeout: 30000 })
    })

    test('chat log scrolls to latest message', async ({ page }) => {
      const input = page.locator('#chat-input')
      const chatLog = page.locator('#chat-log')

      await input.fill('Message 1')
      await input.press('Enter')
      await expect(page.locator('.aira-typing')).toBeVisible()
      await expect(page.locator('.aira-typing')).not.toBeVisible({ timeout: 30000 })

      await input.fill('Message 2')
      await input.press('Enter')

      // Latest message should be in view
      await expect(chatLog).toBeInViewport()
    })
  })

  // ── Session management ───────────────────────────────────────────
  test.describe('Session management', () => {
    test('maintains session across multiple messages', async ({ page }) => {
      await page.locator('#chatbox-launcher').click()

      const input = page.locator('#chat-input')

      // Send first message
      await input.fill('Hello')
      await input.press('Enter')
      await expect(page.locator('.aira-typing')).toBeVisible()
      await expect(page.locator('.aira-typing')).not.toBeVisible({ timeout: 30000 })

      // Send second message
      await input.fill('Tell me more')
      await input.press('Enter')
      await expect(page.locator('.aira-typing')).toBeVisible()
      await expect(page.locator('.aira-typing')).not.toBeVisible({ timeout: 30000 })

      // Both messages should be in chat log
      const userMsgs = page.locator('.chat-msg.user')
      await expect(userMsgs).toHaveCount(2)
    })
  })

  // ── Voice mode ───────────────────────────────────────────────────
  test.describe('Voice mode', () => {
    test('voice toggle button is visible', async ({ page }) => {
      await page.locator('#chatbox-launcher').click()
      const voiceBtn = page.locator('#voice-toggle')
      await expect(voiceBtn).toBeVisible()
    })

    test('voice button shows "Start Voice Conversation" initially', async ({ page }) => {
      await page.locator('#chatbox-launcher').click()
      const voiceBtn = page.locator('#voice-toggle')
      await expect(voiceBtn).toContainText(/start|voice/i)
    })
  })

  // ── Close panel ──────────────────────────────────────────────────
  test.describe('Close panel', () => {
    test('close button hides panel', async ({ page }) => {
      const launcher = page.locator('#chatbox-launcher')
      await launcher.click()

      const closeBtn = page.locator('#chatbox-close')
      await closeBtn.click()

      const panel = page.locator('#chatbox-panel')
      await expect(panel).not.toBeVisible()
      await expect(launcher).toHaveAttribute('aria-expanded', 'false')
    })

    test('clicking launcher when open closes panel', async ({ page }) => {
      const launcher = page.locator('#chatbox-launcher')
      await launcher.click()
      await launcher.click()

      const panel = page.locator('#chatbox-panel')
      await expect(panel).not.toBeVisible()
    })
  })

  // ── Accessibility ────────────────────────────────────────────────
  test.describe('Accessibility', () => {
    test('launcher has aria-expanded attribute', async ({ page }) => {
      const launcher = page.locator('#chatbox-launcher')
      await expect(launcher).toHaveAttribute('aria-expanded', 'false')
      await launcher.click()
      await expect(launcher).toHaveAttribute('aria-expanded', 'true')
    })

    test('launcher has aria-label', async ({ page }) => {
      const launcher = page.locator('#chatbox-launcher')
      await expect(launcher).toHaveAttribute('aria-label', /open|chat|aira/i)
    })

    test('chat input has label or aria-label', async ({ page }) => {
      await page.locator('#chatbox-launcher').click()
      const input = page.locator('#chat-input')
      await expect(input).toHaveAttribute('aria-label', /message|type|chat/i)
    })

    test('messages have role="log" or aria-live region', async ({ page }) => {
      await page.locator('#chatbox-launcher').click()
      const chatLog = page.locator('#chat-log')
      // Chat log should be a live region or have role="log"
      const role = await chatLog.getAttribute('role')
      const ariaLive = await chatLog.getAttribute('aria-live')
      expect(role === 'log' || ariaLive !== null).toBeTruthy()
    })
  })
})
