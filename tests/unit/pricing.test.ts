import { describe, it, expect } from 'vitest'
import { calculateQuote } from '../../src/utils/pricing'
import { INDUSTRIES, AI_FEATURES, ODOO_MODULES } from '../../src/data/quote-data'

// ── Helpers ────────────────────────────────────────────────────────────────

const getIndustry = (id: string) => INDUSTRIES.find(i => i.id === id)!
const realEstate = getIndustry('real-estate')
const retail = getIndustry('retail')

// ── calculateQuote: base cases ─────────────────────────────────────────────

describe('calculateQuote — base (no features/modules/retainer)', () => {
  it('returns baseCost equal to industry baseCost', () => {
    const q = calculateQuote({ industryId: 'real-estate', selectedAiFeatures: [], selectedModules: [], includeOperationsRetainer: false })
    expect(q.baseCost).toBe(realEstate.baseCost)
  })

  it('aiFeaturesCost and modulesCost are 0 when nothing selected', () => {
    const q = calculateQuote({ industryId: 'retail', selectedAiFeatures: [], selectedModules: [], includeOperationsRetainer: false })
    expect(q.aiFeaturesCost).toBe(0)
    expect(q.modulesCost).toBe(0)
  })

  it('estimatedDeploymentDays equals avgDeploymentDays when no extras (ceil of same)', () => {
    const q = calculateQuote({ industryId: 'real-estate', selectedAiFeatures: [], selectedModules: [], includeOperationsRetainer: false })
    // complexity = 0/10 * 0.15 = 0, days = ceil(21 * 1) = 21
    expect(q.estimatedDeploymentDays).toBe(realEstate.avgDeploymentDays)
  })

  it('implementationSupportCost = days × 800', () => {
    const q = calculateQuote({ industryId: 'real-estate', selectedAiFeatures: [], selectedModules: [], includeOperationsRetainer: false })
    expect(q.implementationSupportCost).toBe(q.estimatedDeploymentDays * 800)
  })

  it('operationsRetainerCost is 0 when retainer not included', () => {
    const q = calculateQuote({ industryId: 'real-estate', selectedAiFeatures: [], selectedModules: [], includeOperationsRetainer: false })
    expect(q.operationsRetainerCost).toBe(0)
  })
})

// ── VAT and total ──────────────────────────────────────────────────────────

describe('calculateQuote — VAT and totals', () => {
  it('vat5Percent = round(subtotal * 0.05)', () => {
    const q = calculateQuote({ industryId: 'retail', selectedAiFeatures: [], selectedModules: [], includeOperationsRetainer: false })
    expect(q.vat5Percent).toBe(Math.round(q.subtotal * 0.05))
  })

  it('totalCost = subtotal + vat5Percent', () => {
    const q = calculateQuote({ industryId: 'retail', selectedAiFeatures: [], selectedModules: [], includeOperationsRetainer: false })
    expect(q.totalCost).toBe(q.subtotal + q.vat5Percent)
  })

  it('subtotal = baseCost + aiFeaturesCost + modulesCost + implementationSupportCost + retainerCost', () => {
    const q = calculateQuote({
      industryId: 'real-estate',
      selectedAiFeatures: ['chatbot'],
      selectedModules: ['crm'],
      includeOperationsRetainer: true,
    })
    const expected = q.baseCost + q.aiFeaturesCost + q.modulesCost + q.implementationSupportCost + q.operationsRetainerCost
    expect(q.subtotal).toBe(expected)
  })
})

// ── Retainer ───────────────────────────────────────────────────────────────

describe('calculateQuote — operations retainer', () => {
  it('adds AED 8,000 when retainer is true', () => {
    const without = calculateQuote({ industryId: 'retail', selectedAiFeatures: [], selectedModules: [], includeOperationsRetainer: false })
    const with_ = calculateQuote({ industryId: 'retail', selectedAiFeatures: [], selectedModules: [], includeOperationsRetainer: true })
    expect(with_.operationsRetainerCost).toBe(8000)
    expect(with_.subtotal - without.subtotal).toBe(8000)
  })

  it('retainer cost is 0 when false', () => {
    const q = calculateQuote({ industryId: 'retail', selectedAiFeatures: [], selectedModules: [], includeOperationsRetainer: false })
    expect(q.operationsRetainerCost).toBe(0)
  })
})

// ── AI features ────────────────────────────────────────────────────────────

describe('calculateQuote — AI features', () => {
  it('accumulates AI feature costs correctly', () => {
    const chatbot = AI_FEATURES.find(f => f.id === 'chatbot')!
    const supportAgent = AI_FEATURES.find(f => f.id === 'support-agent')!
    const q = calculateQuote({ industryId: 'retail', selectedAiFeatures: ['chatbot', 'support-agent'], selectedModules: [], includeOperationsRetainer: false })
    expect(q.aiFeaturesCost).toBe(chatbot.cost + supportAgent.cost)
  })

  it('ignores unknown AI feature IDs gracefully (adds 0)', () => {
    const q = calculateQuote({ industryId: 'retail', selectedAiFeatures: ['nonexistent-id'], selectedModules: [], includeOperationsRetainer: false })
    expect(q.aiFeaturesCost).toBe(0)
  })
})

// ── ERP modules ────────────────────────────────────────────────────────────

describe('calculateQuote — ERP modules', () => {
  it('accumulates module costs correctly', () => {
    const crm = ODOO_MODULES.find(m => m.id === 'crm')!
    const inv = ODOO_MODULES.find(m => m.id === 'inventory')!
    const q = calculateQuote({ industryId: 'retail', selectedAiFeatures: [], selectedModules: ['crm', 'inventory'], includeOperationsRetainer: false })
    expect(q.modulesCost).toBe(crm.cost + inv.cost)
  })
})

// ── Complexity-adjusted days ───────────────────────────────────────────────

describe('calculateQuote — complexity-adjusted days', () => {
  it('scales days up when many features selected', () => {
    const base = calculateQuote({ industryId: 'real-estate', selectedAiFeatures: [], selectedModules: [], includeOperationsRetainer: false })
    const complex = calculateQuote({ industryId: 'real-estate', selectedAiFeatures: ['chatbot', 'support-agent', 'aml-screening'], selectedModules: ['crm', 'accounting', 'inventory'], includeOperationsRetainer: false })
    expect(complex.estimatedDeploymentDays).toBeGreaterThan(base.estimatedDeploymentDays)
  })

  it('applies ceil correctly: days = ceil(avgDays * (1 + count/10 * 0.15))', () => {
    // real-estate avgDeploymentDays = 21, selecting 4 items
    // multiplier = 1 + 4/10 * 0.15 = 1.06
    // raw = 21 * 1.06 = 22.26 → ceil = 23
    const q = calculateQuote({ industryId: 'real-estate', selectedAiFeatures: ['chatbot', 'support-agent'], selectedModules: ['crm', 'accounting'], includeOperationsRetainer: false })
    const aiCount = 2
    const modCount = 2
    const expected = Math.ceil(21 * (1 + ((aiCount + modCount) / 10) * 0.15))
    expect(q.estimatedDeploymentDays).toBe(expected)
  })

  it('1 item selection increases days minimally', () => {
    const q = calculateQuote({ industryId: 'real-estate', selectedAiFeatures: ['chatbot'], selectedModules: [], includeOperationsRetainer: false })
    // 1 item: ceil(21 * (1 + 1/10 * 0.15)) = ceil(21 * 1.015) = ceil(21.315) = 22
    expect(q.estimatedDeploymentDays).toBe(22)
  })
})

// ── Line items ─────────────────────────────────────────────────────────────

describe('calculateQuote — lineItems', () => {
  it('always includes base implementation as first line item', () => {
    const q = calculateQuote({ industryId: 'retail', selectedAiFeatures: [], selectedModules: [], includeOperationsRetainer: false })
    expect(q.lineItems[0].description).toContain('Base Implementation')
    expect(q.lineItems[0].totalAmount).toBe(retail.baseCost)
  })

  it('includes AI feature line items', () => {
    const q = calculateQuote({ industryId: 'retail', selectedAiFeatures: ['chatbot'], selectedModules: [], includeOperationsRetainer: false })
    const chatbot = AI_FEATURES.find(f => f.id === 'chatbot')!
    const item = q.lineItems.find(li => li.description === chatbot.name)
    expect(item).toBeDefined()
    expect(item!.totalAmount).toBe(chatbot.cost)
  })

  it('includes ERP module line items', () => {
    const q = calculateQuote({ industryId: 'retail', selectedAiFeatures: [], selectedModules: ['crm'], includeOperationsRetainer: false })
    const crm = ODOO_MODULES.find(m => m.id === 'crm')!
    const item = q.lineItems.find(li => li.description === crm.name)
    expect(item).toBeDefined()
    expect(item!.totalAmount).toBe(crm.cost)
  })

  it('includes retainer line item when selected', () => {
    const q = calculateQuote({ industryId: 'retail', selectedAiFeatures: [], selectedModules: [], includeOperationsRetainer: true })
    const item = q.lineItems.find(li => li.description.includes('Retainer'))
    expect(item).toBeDefined()
    expect(item!.totalAmount).toBe(8000)
  })

  it('does NOT include retainer line item when not selected', () => {
    const q = calculateQuote({ industryId: 'retail', selectedAiFeatures: [], selectedModules: [], includeOperationsRetainer: false })
    const item = q.lineItems.find(li => li.description.includes('Retainer'))
    expect(item).toBeUndefined()
  })

  it('support line item quantity equals estimatedDeploymentDays', () => {
    const q = calculateQuote({ industryId: 'retail', selectedAiFeatures: [], selectedModules: [], includeOperationsRetainer: false })
    const support = q.lineItems.find(li => li.description.includes('Implementation Support'))!
    expect(support.quantity).toBe(q.estimatedDeploymentDays)
    expect(support.totalAmount).toBe(q.estimatedDeploymentDays * 800)
  })
})

// ── Go-live date ───────────────────────────────────────────────────────────

describe('calculateQuote — estimatedGoLiveDate', () => {
  it('returns a valid ISO date string', () => {
    const q = calculateQuote({ industryId: 'retail', selectedAiFeatures: [], selectedModules: [], includeOperationsRetainer: false })
    expect(q.estimatedGoLiveDate).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('go-live date is in the future', () => {
    const q = calculateQuote({ industryId: 'retail', selectedAiFeatures: [], selectedModules: [], includeOperationsRetainer: false })
    const goLive = new Date(q.estimatedGoLiveDate)
    expect(goLive.getTime()).toBeGreaterThan(Date.now())
  })
})

// ── Error handling ─────────────────────────────────────────────────────────

describe('calculateQuote — error handling', () => {
  it('throws when industryId is not found', () => {
    expect(() =>
      calculateQuote({ industryId: 'nonexistent-industry', selectedAiFeatures: [], selectedModules: [], includeOperationsRetainer: false })
    ).toThrow()
  })
})

// ── Data integrity ─────────────────────────────────────────────────────────

describe('data integrity — INDUSTRIES', () => {
  it('has exactly 10 industries', () => {
    expect(INDUSTRIES).toHaveLength(10)
  })

  it('all industry IDs are unique', () => {
    const ids = INDUSTRIES.map(i => i.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('all recommendedAiFeatures reference valid AI_FEATURES IDs', () => {
    const aiIds = new Set(AI_FEATURES.map(f => f.id))
    for (const ind of INDUSTRIES) {
      for (const id of ind.recommendedAiFeatures) {
        expect(aiIds.has(id), `Industry "${ind.id}" references unknown AI feature "${id}"`).toBe(true)
      }
    }
  })

  it('all recommendedModules reference valid ODOO_MODULES IDs', () => {
    const modIds = new Set(ODOO_MODULES.map(m => m.id))
    for (const ind of INDUSTRIES) {
      for (const id of ind.recommendedModules) {
        expect(modIds.has(id), `Industry "${ind.id}" references unknown module "${id}"`).toBe(true)
      }
    }
  })

  it('all baseCosts are positive numbers', () => {
    for (const ind of INDUSTRIES) {
      expect(ind.baseCost).toBeGreaterThan(0)
    }
  })

  it('all avgDeploymentDays are positive integers', () => {
    for (const ind of INDUSTRIES) {
      expect(ind.avgDeploymentDays).toBeGreaterThan(0)
      expect(Number.isInteger(ind.avgDeploymentDays)).toBe(true)
    }
  })
})

describe('data integrity — AI_FEATURES', () => {
  it('has exactly 9 features', () => {
    expect(AI_FEATURES).toHaveLength(9)
  })

  it('all feature IDs are unique', () => {
    const ids = AI_FEATURES.map(f => f.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('all tiers are basic | advanced | specialized', () => {
    const valid = new Set(['basic', 'advanced', 'specialized'])
    for (const f of AI_FEATURES) {
      expect(valid.has(f.tier), `Feature "${f.id}" has invalid tier "${f.tier}"`).toBe(true)
    }
  })

  it('basic tier features cost 2000–5000', () => {
    for (const f of AI_FEATURES.filter(f => f.tier === 'basic')) {
      expect(f.cost).toBeGreaterThanOrEqual(2000)
      expect(f.cost).toBeLessThanOrEqual(5000)
    }
  })

  it('advanced tier features cost 5000–8000', () => {
    for (const f of AI_FEATURES.filter(f => f.tier === 'advanced')) {
      expect(f.cost).toBeGreaterThanOrEqual(5000)
      expect(f.cost).toBeLessThanOrEqual(8000)
    }
  })

  it('specialized tier features cost 8000–12000', () => {
    for (const f of AI_FEATURES.filter(f => f.tier === 'specialized')) {
      expect(f.cost).toBeGreaterThanOrEqual(8000)
      expect(f.cost).toBeLessThanOrEqual(12000)
    }
  })
})

describe('data integrity — ODOO_MODULES', () => {
  it('has exactly 15 modules', () => {
    expect(ODOO_MODULES).toHaveLength(15)
  })

  it('all module IDs are unique', () => {
    const ids = ODOO_MODULES.map(m => m.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('all categories are core | advanced | integration', () => {
    const valid = new Set(['core', 'advanced', 'integration'])
    for (const m of ODOO_MODULES) {
      expect(valid.has(m.category), `Module "${m.id}" has invalid category "${m.category}"`).toBe(true)
    }
  })

  it('integration add-ons cost less than core modules', () => {
    const integrationCosts = ODOO_MODULES.filter(m => m.category === 'integration').map(m => m.cost)
    const coreCosts = ODOO_MODULES.filter(m => m.category === 'core').map(m => m.cost)
    const maxIntegration = Math.max(...integrationCosts)
    const minCore = Math.min(...coreCosts)
    expect(maxIntegration).toBeLessThan(minCore)
  })
})
