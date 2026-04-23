import { INDUSTRIES, AI_FEATURES, ODOO_MODULES } from '../data/quote-data'

export interface QuoteInput {
  industryId: string
  selectedAiFeatures: string[]
  selectedModules: string[]
  includeOperationsRetainer: boolean
}

export interface LineItem {
  description: string
  quantity: number
  unitPrice: number
  totalAmount: number
}

export interface QuoteOutput {
  baseCost: number
  aiFeaturesCost: number
  modulesCost: number
  implementationSupportCost: number
  operationsRetainerCost: number
  subtotal: number
  vat5Percent: number
  totalCost: number
  estimatedDeploymentDays: number
  estimatedGoLiveDate: string
  lineItems: LineItem[]
}

export function calculateQuote(input: QuoteInput): QuoteOutput {
  const industry = INDUSTRIES.find(i => i.id === input.industryId)
  if (!industry) throw new Error(`Industry not found: ${input.industryId}`)

  const baseCost = industry.baseCost

  const aiFeaturesCost = input.selectedAiFeatures.reduce((sum, id) => {
    const f = AI_FEATURES.find(f => f.id === id)
    return sum + (f?.cost ?? 0)
  }, 0)

  const modulesCost = input.selectedModules.reduce((sum, id) => {
    const m = ODOO_MODULES.find(m => m.id === id)
    return sum + (m?.cost ?? 0)
  }, 0)

  const totalSelections = input.selectedAiFeatures.length + input.selectedModules.length
  const complexityMultiplier = totalSelections / 10
  const estimatedDeploymentDays = Math.ceil(
    industry.avgDeploymentDays * (1 + complexityMultiplier * 0.15)
  )

  const implementationSupportCost = estimatedDeploymentDays * 800
  const operationsRetainerCost = input.includeOperationsRetainer ? 8000 : 0
  const subtotal = baseCost + aiFeaturesCost + modulesCost + implementationSupportCost + operationsRetainerCost
  const vat5Percent = Math.round(subtotal * 0.05)
  const totalCost = subtotal + vat5Percent

  const goLive = new Date()
  goLive.setDate(goLive.getDate() + estimatedDeploymentDays)
  const estimatedGoLiveDate = goLive.toISOString().split('T')[0]

  const lineItems: LineItem[] = [
    { description: `Base Implementation (${industry.name})`, quantity: 1, unitPrice: baseCost, totalAmount: baseCost },
    ...input.selectedAiFeatures.flatMap(id => {
      const f = AI_FEATURES.find(f => f.id === id)
      if (!f) return []
      return [{ description: f.name, quantity: 1, unitPrice: f.cost, totalAmount: f.cost }]
    }),
    ...input.selectedModules.flatMap(id => {
      const m = ODOO_MODULES.find(m => m.id === id)
      if (!m) return []
      return [{ description: m.name, quantity: 1, unitPrice: m.cost, totalAmount: m.cost }]
    }),
    {
      description: `Implementation Support (${estimatedDeploymentDays} days × AED 800)`,
      quantity: estimatedDeploymentDays,
      unitPrice: 800,
      totalAmount: implementationSupportCost,
    },
  ]

  if (input.includeOperationsRetainer) {
    lineItems.push({ description: '90-Day Operations Retainer', quantity: 1, unitPrice: 8000, totalAmount: 8000 })
  }

  return {
    baseCost,
    aiFeaturesCost,
    modulesCost,
    implementationSupportCost,
    operationsRetainerCost,
    subtotal,
    vat5Percent,
    totalCost,
    estimatedDeploymentDays,
    estimatedGoLiveDate,
    lineItems,
  }
}
