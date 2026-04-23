import { test, expect } from '@playwright/test'

test.describe('Quote Builder Page', () => {
  test.beforeEach(async ({ page }) => {
    // Block CDN scripts (jsPDF) so load event fires quickly
    await page.route('**/cdnjs.cloudflare.com/**', route => route.abort())
    // Inject mock jspdf so PDF modal flow can be tested without the CDN
    await page.addInitScript(() => {
      (window as any).jspdf = {
        jsPDF: class MockJsPDF {
          autoTable() { return this }
          addPage() { return this }
          setFillColor() { return this }
          setTextColor() { return this }
          setFontSize() { return this }
          setFont() { return this }
          setDrawColor() { return this }
          setLineWidth() { return this }
          rect() { return this }
          roundedRect() { return this }
          line() { return this }
          text() { return this }
          circle() { return this }
          setPage() { return this }
          save() { return this }
          internal = { pageSize: { getWidth: () => 210, getHeight: () => 297 }, getNumberOfPages: () => 3 }
          lastAutoTable = { finalY: 100 }
        }
      }
    })
    await page.goto('/quote-builder')
    // Wait for quote-builder.js to finish initializing
    await page.waitForFunction(() => (window as any).QBInitialized === true, { timeout: 15000 })
  })

  // ── Page load ────────────────────────────────────────────────────
  test.describe('Page load', () => {
    test('renders hero heading', async ({ page }) => {
      await expect(page.locator('h1')).toContainText('Implementation Package')
    })

    test('renders 10 industry cards', async ({ page }) => {
      await expect(page.locator('.qb-industry-card')).toHaveCount(10)
    })

    test('builder section is hidden until industry selected', async ({ page }) => {
      await expect(page.locator('#qb-builder')).toBeHidden()
    })

    test('all industry cards have aria-pressed="false" initially', async ({ page }) => {
      const cards = page.locator('.qb-industry-card')
      const count = await cards.count()
      for (let i = 0; i < count; i++) {
        await expect(cards.nth(i)).toHaveAttribute('aria-pressed', 'false')
      }
    })

    test('modal is hidden on load', async ({ page }) => {
      await expect(page.locator('#qb-modal')).toBeHidden()
    })
  })

  // ── Industry selection ───────────────────────────────────────────
  test.describe('Industry selection', () => {
    test('clicking a card reveals the builder', async ({ page }) => {
      await page.locator('.qb-industry-card').first().click()
      await expect(page.locator('#qb-builder')).toBeVisible()
    })

    test('selected card gets aria-pressed="true"', async ({ page }) => {
      const card = page.locator('.qb-industry-card').first()
      await card.click()
      await expect(card).toHaveAttribute('aria-pressed', 'true')
    })

    test('only one card is selected at a time', async ({ page }) => {
      const cards = page.locator('.qb-industry-card')
      await cards.first().click()
      await cards.nth(1).click()
      await expect(cards.first()).toHaveAttribute('aria-pressed', 'false')
      await expect(cards.nth(1)).toHaveAttribute('aria-pressed', 'true')
    })

    test('context bar shows industry name after selection', async ({ page }) => {
      const card = page.locator('.qb-industry-card').first()
      await card.click()
      await expect(page.locator('#qb-context-industry')).not.toBeEmpty()
    })

    test('context bar shows deployment days', async ({ page }) => {
      await page.locator('.qb-industry-card').first().click()
      await expect(page.locator('#qb-context-days')).toContainText('day')
    })

    test('pricing sidebar shows base cost after selection', async ({ page }) => {
      await page.locator('.qb-industry-card').first().click()
      await expect(page.locator('#qb-base-cost')).toContainText('AED')
    })
  })

  // ── Real-time pricing ────────────────────────────────────────────
  test.describe('Real-time pricing updates', () => {
    test.beforeEach(async ({ page }) => {
      await page.locator('.qb-industry-card').first().click()
    })

    test('AI feature cost starts at AED 0', async ({ page }) => {
      await expect(page.locator('#qb-ai-cost')).toHaveText('AED 0')
    })

    test('ERP module cost starts at AED 0', async ({ page }) => {
      await expect(page.locator('#qb-mod-cost')).toHaveText('AED 0')
    })

    test('checking AI feature increases AI cost', async ({ page }) => {
      // Click the visible label — hidden inputs (opacity:0, size:0) can't be force-checked
      await page.locator('.qb-checkbox-item[data-feature-type="ai"]').first().click()
      const text = await page.locator('#qb-ai-cost').textContent()
      expect(text).not.toBe('AED 0')
      expect(text).toContain('AED')
    })

    test('checking ERP module increases module cost', async ({ page }) => {
      await page.locator('.qb-checkbox-item[data-feature-type="module"]').first().click()
      const text = await page.locator('#qb-mod-cost').textContent()
      expect(text).not.toBe('AED 0')
      expect(text).toContain('AED')
    })

    test('unchecking a feature removes its cost', async ({ page }) => {
      const label = page.locator('.qb-checkbox-item[data-feature-type="ai"]').first()
      await label.click() // check
      await label.click() // uncheck
      await expect(page.locator('#qb-ai-cost')).toHaveText('AED 0')
    })

    test('retainer toggle reveals retainer row', async ({ page }) => {
      await expect(page.locator('#qb-retainer-row')).toBeHidden()
      await page.locator('#qb-retainer-cb').check()
      await expect(page.locator('#qb-retainer-row')).toBeVisible()
    })

    test('retainer toggle increases total by ~AED 8,400 (8000 + 5% VAT)', async ({ page }) => {
      const parseAed = (text: string | null) => parseInt((text ?? '').replace(/[^0-9]/g, ''))

      const totalBefore = parseAed(await page.locator('#qb-total').textContent())
      await page.locator('#qb-retainer-cb').check()
      const totalAfter = parseAed(await page.locator('#qb-total').textContent())

      const delta = totalAfter - totalBefore
      // 8000 + 5% VAT = 8400; allow ±1 for floating-point rounding
      expect(delta).toBeGreaterThanOrEqual(8399)
      expect(delta).toBeLessThanOrEqual(8401)
    })

    test('pricing matches formula for known industry + one AI feature', async ({ page }) => {
      // Read the server-embedded data (now stored in data-json attribute)
      const data = await page.evaluate(() => {
        const el = document.getElementById('qb-data') as HTMLElement | null
        return JSON.parse((el as any)?.dataset?.json ?? '{}')
      })

      // Identify which industry (first card) and feature (first AI checkbox) are selected
      const industryId = await page.locator('.qb-industry-card').first().getAttribute('data-industry-id')
      const firstAiCbId = await page.locator('.qb-cb[data-feature-kind="ai"]').first().getAttribute('data-feature-id')

      const ind = data.industries.find((i: { id: string }) => i.id === industryId)
      const feat = data.aiFeatures.find((f: { id: string }) => f.id === firstAiCbId)

      await page.locator('.qb-checkbox-item[data-feature-type="ai"]').first().click()

      // Mirror the pricing formula from pricing.ts / quote-builder.js
      const totalSel = 1
      const days = Math.ceil(ind.avgDeploymentDays * (1 + (totalSel / 10) * 0.15))
      const supportCost = days * 800
      const subtotal = ind.baseCost + feat.cost + supportCost
      const vat = Math.round(subtotal * 0.05)
      const expectedTotal = subtotal + vat

      const displayedTotal = await page.locator('#qb-total').textContent()
      const displayedNum = parseInt((displayedTotal ?? '').replace(/[^0-9]/g, ''))

      expect(displayedNum).toBe(expectedTotal)
    })

    test('deployment days increase when features are added', async ({ page }) => {
      const daysBefore = await page.locator('#qb-days').textContent()
      // Click visible labels — hidden inputs (opacity:0, size:0) can't be interacted with directly
      const labels = page.locator('.qb-checkbox-item[data-feature-type="ai"]')
      const count = await labels.count()
      for (let i = 0; i < Math.min(5, count); i++) await labels.nth(i).click()
      const daysAfter = await page.locator('#qb-days').textContent()
      expect(parseInt(daysAfter ?? '0')).toBeGreaterThanOrEqual(parseInt(daysBefore ?? '0'))
    })
  })

  // ── PDF Modal ────────────────────────────────────────────────────
  test.describe('PDF modal', () => {
    test.beforeEach(async ({ page }) => {
      await page.locator('.qb-industry-card').first().click()
    })

    test('PDF button opens modal when industry selected', async ({ page }) => {
      await page.locator('#qb-pdf-btn').click()
      await expect(page.locator('#qb-modal')).toBeVisible()
    })

    test('modal has dialog role and aria-modal attribute', async ({ page }) => {
      await page.locator('#qb-pdf-btn').click()
      const modal = page.locator('#qb-modal')
      await expect(modal).toHaveAttribute('role', 'dialog')
      await expect(modal).toHaveAttribute('aria-modal', 'true')
    })

    test('modal focuses name input on open', async ({ page }) => {
      await page.locator('#qb-pdf-btn').click()
      await expect(page.locator('#qb-name')).toBeFocused()
    })

    test('generate without name shows error message', async ({ page }) => {
      await page.locator('#qb-pdf-btn').click()
      await page.locator('#qb-modal-generate').click()
      await expect(page.locator('#qb-modal-error')).toBeVisible()
      await expect(page.locator('#qb-modal-error')).toContainText('Please enter your name')
    })

    test('close (×) button dismisses modal', async ({ page }) => {
      await page.locator('#qb-pdf-btn').click()
      await page.locator('#qb-modal-close').click()
      await expect(page.locator('#qb-modal')).toBeHidden()
    })

    test('cancel button dismisses modal', async ({ page }) => {
      await page.locator('#qb-pdf-btn').click()
      await page.locator('#qb-modal-cancel').click()
      await expect(page.locator('#qb-modal')).toBeHidden()
    })

    test('Escape key dismisses modal', async ({ page }) => {
      await page.locator('#qb-pdf-btn').click()
      await page.keyboard.press('Escape')
      await expect(page.locator('#qb-modal')).toBeHidden()
    })

    test('clicking overlay (outside card) dismisses modal', async ({ page }) => {
      await page.locator('#qb-pdf-btn').click()
      await expect(page.locator('#qb-modal')).toBeVisible()
      // Click top-left corner of overlay (outside the card)
      await page.locator('#qb-modal').click({ position: { x: 5, y: 5 } })
      await expect(page.locator('#qb-modal')).toBeHidden()
    })

    test('error message hidden when modal reopened', async ({ page }) => {
      // Trigger validation error
      await page.locator('#qb-pdf-btn').click()
      await page.locator('#qb-modal-generate').click()
      await expect(page.locator('#qb-modal-error')).toBeVisible()

      // Close and reopen
      await page.locator('#qb-modal-close').click()
      await page.locator('#qb-pdf-btn').click()
      await expect(page.locator('#qb-modal-error')).toBeHidden()
    })
  })

  // ── Accessibility ────────────────────────────────────────────────
  test.describe('Accessibility', () => {
    test('industry cards use button element', async ({ page }) => {
      const card = page.locator('.qb-industry-card').first()
      await expect(card).toHaveAttribute('type', 'button')
    })

    test('selected card transitions aria-pressed to "true"', async ({ page }) => {
      const card = page.locator('.qb-industry-card').first()
      await expect(card).toHaveAttribute('aria-pressed', 'false')
      await card.click()
      await expect(card).toHaveAttribute('aria-pressed', 'true')
    })

    test('deselecting a card (by selecting another) sets aria-pressed back to "false"', async ({ page }) => {
      const cards = page.locator('.qb-industry-card')
      await cards.first().click()
      await expect(cards.first()).toHaveAttribute('aria-pressed', 'true')
      await cards.nth(2).click()
      await expect(cards.first()).toHaveAttribute('aria-pressed', 'false')
    })

    test('modal title is labelled with aria-labelledby', async ({ page }) => {
      await page.locator('.qb-industry-card').first().click()
      await page.locator('#qb-pdf-btn').click()
      const modal = page.locator('#qb-modal')
      await expect(modal).toHaveAttribute('aria-labelledby', 'qb-modal-title')
      await expect(page.locator('#qb-modal-title')).toBeVisible()
    })

    test('name input has correct autocomplete attribute', async ({ page }) => {
      await expect(page.locator('#qb-name')).toHaveAttribute('autocomplete', 'name')
    })
  })
})
