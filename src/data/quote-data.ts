export interface Industry {
  id: string
  name: string
  icon: string
  baseCost: number
  avgDeploymentDays: number
  maxConcurrentUsers: number
  proofPoint: { title: string; description: string; metric: string }
  recommendedAiFeatures: string[]
  recommendedModules: string[]
  isSpecial?: boolean
}

export interface AiFeature {
  id: string
  name: string
  description: string
  cost: number
  tier: 'basic' | 'advanced' | 'specialized'
  category: string
  monthlyLimit: number
  integrations: string[]
  icon: string
}

export interface OdooModule {
  id: string
  name: string
  description: string
  cost: number
  category: 'core' | 'advanced' | 'integration'
  features: string[]
  integrations: string[]
  icon: string
}

export const INDUSTRIES: Industry[] = [
  {
    id: 'real-estate',
    name: 'Real Estate',
    icon: 'building',
    baseCost: 12000,
    avgDeploymentDays: 21,
    maxConcurrentUsers: 100,
    proofPoint: { title: 'OSUS Real Estate', description: 'AED 1.15B transaction volume, 70 agents, 580 deals tracked', metric: '1.15B AED' },
    recommendedAiFeatures: ['chatbot', 'lead-qualification'],
    recommendedModules: ['crm', 'accounting', 'commission-tracking'],
  },
  {
    id: 'finance',
    name: 'Finance & Banking',
    icon: 'landmark',
    baseCost: 15000,
    avgDeploymentDays: 28,
    maxConcurrentUsers: 200,
    proofPoint: { title: 'Vertex Financial Group', description: 'Risk analysis, compliance reporting, fraud detection', metric: 'Enterprise-Grade' },
    recommendedAiFeatures: ['aml-screening', 'predictive-analytics'],
    recommendedModules: ['accounting', 'dashboard'],
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    icon: 'heart',
    baseCost: 14000,
    avgDeploymentDays: 30,
    maxConcurrentUsers: 150,
    proofPoint: { title: 'Hospital Operations', description: 'AED 1,200 avg patient total, automated triage', metric: 'AED 1,200/patient' },
    recommendedAiFeatures: ['chatbot', 'support-agent'],
    recommendedModules: ['hr', 'accounting', 'inventory'],
  },
  {
    id: 'retail',
    name: 'Retail & eCommerce',
    icon: 'shopping-bag',
    baseCost: 10000,
    avgDeploymentDays: 16,
    maxConcurrentUsers: 500,
    proofPoint: { title: 'Northwind Retail', description: '63% reduction in support ticket resolution time', metric: '63% faster' },
    recommendedAiFeatures: ['chatbot', 'support-agent'],
    recommendedModules: ['crm', 'inventory', 'pos'],
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    icon: 'factory',
    baseCost: 13000,
    avgDeploymentDays: 25,
    maxConcurrentUsers: 250,
    proofPoint: { title: 'QA Automation', description: '1.2% reject rate via vision-based quality control', metric: '1.2% defect rate' },
    recommendedAiFeatures: ['predictive-analytics', 'vision-qc'],
    recommendedModules: ['inventory', 'manufacturing', 'dashboard'],
  },
  {
    id: 'logistics',
    name: 'Logistics & Supply Chain',
    icon: 'truck',
    baseCost: 11000,
    avgDeploymentDays: 19,
    maxConcurrentUsers: 300,
    proofPoint: { title: 'Route Optimization', description: '$340K saved in Q1 via AI route agent', metric: '$340K saved' },
    recommendedAiFeatures: ['process-automation', 'predictive-analytics'],
    recommendedModules: ['inventory', 'dashboard'],
  },
  {
    id: 'education',
    name: 'Education',
    icon: 'book',
    baseCost: 9000,
    avgDeploymentDays: 14,
    maxConcurrentUsers: 1000,
    proofPoint: { title: 'Student Engagement', description: '92% attendance rate with AI-assisted learning', metric: '92% attendance' },
    recommendedAiFeatures: ['chatbot', 'process-automation'],
    recommendedModules: ['hr', 'dashboard', 'lms'],
  },
  {
    id: 'construction',
    name: 'Construction',
    icon: 'hammer',
    baseCost: 13000,
    avgDeploymentDays: 24,
    maxConcurrentUsers: 150,
    proofPoint: { title: 'Progress Tracking', description: '75% work completion visibility, real-time updates', metric: '75% tracked' },
    recommendedAiFeatures: ['process-automation', 'predictive-analytics'],
    recommendedModules: ['project-mgmt', 'inventory', 'accounting'],
  },
  {
    id: 'hospitality',
    name: 'Hospitality & F&B',
    icon: 'utensils',
    baseCost: 12000,
    avgDeploymentDays: 18,
    maxConcurrentUsers: 200,
    proofPoint: { title: 'Daily Revenue Tracking', description: 'AED 75,320 daily revenue tracked end-to-end', metric: 'AED 75,320/day' },
    recommendedAiFeatures: ['chatbot', 'support-agent'],
    recommendedModules: ['pos', 'hr', 'hotel-pms'],
  },
  {
    id: 'legal',
    name: 'Legal Services',
    icon: 'scale',
    baseCost: 14000,
    avgDeploymentDays: 26,
    maxConcurrentUsers: 100,
    proofPoint: { title: 'Contract Automation', description: 'Contract review & discovery acceleration', metric: '60% faster' },
    recommendedAiFeatures: ['aml-screening', 'process-automation'],
    recommendedModules: ['crm', 'document-mgmt', 'dashboard'],
  },
  // Special: AI Implementation only (no base industry)
  {
    id: 'ai-implementation',
    name: 'AI Implementation',
    icon: 'brain',
    baseCost: 0,
    avgDeploymentDays: 45,
    maxConcurrentUsers: 50,
    proofPoint: { title: 'Custom AI Integration', description: 'Integrate AI into your existing systems', metric: 'Custom' },
    recommendedAiFeatures: [],
    recommendedModules: [],
    isSpecial: true,
  },
  // Special: Odoo Custom Modules only
  {
    id: 'odoo-modules',
    name: 'Odoo Custom Modules',
    icon: 'box',
    baseCost: 0,
    avgDeploymentDays: 60,
    maxConcurrentUsers: 100,
    proofPoint: { title: 'Bespoke Odoo Modules', description: 'Custom modules for your workflows', metric: 'Custom' },
    recommendedAiFeatures: [],
    recommendedModules: [],
    isSpecial: true,
  },
]

export const AI_FEATURES: AiFeature[] = [
  // Tier 1: Basic (AED 2,000–5,000)
  {
    id: 'chatbot',
    name: 'AI Chatbot / Virtual Assistant',
    description: 'Customer support, onboarding, FAQ automation. Multi-language (EN, AR), 50 intents, 10k queries/mo.',
    cost: 3000,
    tier: 'basic',
    category: 'Support',
    monthlyLimit: 10000,
    integrations: ['crm', 'slack', 'telegram'],
    icon: 'message',
  },
  {
    id: 'social-automation',
    name: 'Social Media Automation',
    description: 'Scheduled posting, AI content generation, analytics. 100 posts/mo across LinkedIn, Facebook, Instagram.',
    cost: 2500,
    tier: 'basic',
    category: 'Marketing',
    monthlyLimit: 100,
    integrations: ['google-drive', 'cloudinary'],
    icon: 'share',
  },
  {
    id: 'process-automation',
    name: 'Basic Process Automation (n8n)',
    description: 'Workflow automation, data sync, form processing. 5 workflows, 5,000 executions/mo.',
    cost: 2000,
    tier: 'basic',
    category: 'Automation',
    monthlyLimit: 5000,
    integrations: ['slack', 'email', 'google-sheets'],
    icon: 'workflow',
  },
  // Tier 2: Advanced (AED 5,000–8,000)
  {
    id: 'support-agent',
    name: 'AI Support Agent (24/7)',
    description: 'Ticket routing, resolution automation, escalation rules. 10k tickets/mo, sentiment analysis.',
    cost: 6000,
    tier: 'advanced',
    category: 'Support',
    monthlyLimit: 10000,
    integrations: ['zendesk', 'freshdesk', 'hubspot'],
    icon: 'headset',
  },
  {
    id: 'lead-qualification',
    name: 'Sales & Lead Qualification Agent',
    description: 'Lead scoring, qualification, outreach automation. 1,000 leads/mo via Voiceflow + n8n.',
    cost: 5500,
    tier: 'advanced',
    category: 'Sales',
    monthlyLimit: 1000,
    integrations: ['hubspot', 'salesforce', 'linkedin'],
    icon: 'target',
  },
  {
    id: 'calling-agent',
    name: 'Outbound Calling Agent (VAPI)',
    description: 'Automated dialing, call completion, transcription. 1,000 calls/mo, EN + AR support.',
    cost: 7500,
    tier: 'advanced',
    category: 'Sales',
    monthlyLimit: 1000,
    integrations: ['crm', 'hubspot'],
    icon: 'phone',
  },
  // Tier 3: Specialized (AED 8,000–12,000)
  {
    id: 'aml-screening',
    name: 'AML/PEP Compliance Screening',
    description: 'OpenSanctions integration, UAE DNFBP compliant. Real-time screening vs OFAC, IATA, local lists.',
    cost: 10000,
    tier: 'specialized',
    category: 'Compliance',
    monthlyLimit: 10000,
    integrations: ['odoo', 'hubspot'],
    icon: 'shield',
  },
  {
    id: 'predictive-analytics',
    name: 'Predictive Analytics & Forecasting',
    description: 'Demand forecasting, churn prediction, anomaly detection. ML models trained on your data.',
    cost: 8500,
    tier: 'specialized',
    category: 'Analytics',
    monthlyLimit: -1,
    integrations: ['snowflake', 'tableau'],
    icon: 'chart',
  },
  {
    id: 'vision-qc',
    name: 'Vision-Based Quality Control',
    description: 'Image-based defect detection, visual inspection automation. Camera/mobile integration.',
    cost: 12000,
    tier: 'specialized',
    category: 'Manufacturing',
    monthlyLimit: -1,
    integrations: ['odoo', 'mes'],
    icon: 'eye',
  },
]

export const ODOO_MODULES: OdooModule[] = [
  // Core Modules
  {
    id: 'crm',
    name: 'CRM & Sales Management',
    description: 'Lead & opportunity tracking, sales pipeline, team analytics, forecasting.',
    cost: 3500,
    category: 'core',
    features: ['lead-tracking', 'pipeline', 'forecasting'],
    integrations: ['email', 'calendar', 'linkedin'],
    icon: 'briefcase',
  },
  {
    id: 'accounting',
    name: 'Accounting & Invoicing',
    description: 'Chart of accounts, invoices, UAE VAT compliance, eInvoicing (April 2026 ready).',
    cost: 3500,
    category: 'core',
    features: ['invoicing', 'vat-compliance', 'einvoicing', 'reconciliation'],
    integrations: ['payment-gateway', 'bank-sync'],
    icon: 'calculator',
  },
  {
    id: 'inventory',
    name: 'Inventory & Warehouse Mgmt',
    description: 'Stock tracking, multi-location, barcode scanning, automated reorder points.',
    cost: 4000,
    category: 'core',
    features: ['stock-tracking', 'multi-location', 'barcode', 'reorder-points'],
    integrations: ['pos', 'crm'],
    icon: 'box',
  },
  {
    id: 'hr',
    name: 'Human Resources & Payroll',
    description: 'Employee data, attendance, UAE-compliant payroll, performance reviews.',
    cost: 3500,
    category: 'core',
    features: ['attendance', 'payroll', 'leave-mgmt', 'performance-review'],
    integrations: ['email', 'calendar'],
    icon: 'users',
  },
  {
    id: 'dashboard',
    name: 'Dashboard & BI',
    description: 'Real-time KPI dashboards, custom report builder, data export, scheduled delivery.',
    cost: 2500,
    category: 'core',
    features: ['kpi-dashboard', 'custom-reports', 'export', 'alerts'],
    integrations: ['email', 'slack'],
    icon: 'chart',
  },
  // Advanced Modules
  {
    id: 'commission-tracking',
    name: 'Commission & Agent Tracking',
    description: 'Agent performance tiers, multi-tier commission engine, automated payout. Used by OSUS (70 agents).',
    cost: 5000,
    category: 'advanced',
    features: ['agent-ranking', 'commission-calc', 'payout-automation'],
    integrations: ['crm', 'accounting'],
    icon: 'trophy',
  },
  {
    id: 'project-mgmt',
    name: 'Project Management & Billing',
    description: 'Project setup, resource allocation, progress billing, BoQ management, Gantt charts.',
    cost: 4500,
    category: 'advanced',
    features: ['task-mgmt', 'resource-planning', 'progress-billing', 'boq'],
    integrations: ['accounting', 'inventory'],
    icon: 'kanban',
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing & MRP',
    description: 'Bill of materials, production planning, QC checklists, shop-floor dashboards.',
    cost: 5500,
    category: 'advanced',
    features: ['bom', 'production-planning', 'qc-checklist', 'shop-floor'],
    integrations: ['inventory', 'dashboard'],
    icon: 'factory',
  },
  {
    id: 'pos',
    name: 'Point of Sale (POS) & Retail',
    description: 'Multi-register POS, barcode scanning, customer loyalty, inventory sync.',
    cost: 4000,
    category: 'advanced',
    features: ['multi-pos', 'barcode', 'loyalty', 'payment-processing'],
    integrations: ['inventory', 'accounting'],
    icon: 'cart',
  },
  {
    id: 'hotel-pms',
    name: 'Hotel & Property Management (PMS)',
    description: 'Room inventory, reservation engine, housekeeping, billing & folio management.',
    cost: 6000,
    category: 'advanced',
    features: ['room-mgmt', 'reservations', 'housekeeping', 'folio'],
    integrations: ['accounting', 'crm'],
    icon: 'bed',
  },
  {
    id: 'lms',
    name: 'E-Learning & Course Management',
    description: 'Course creation, student enrollment, grading, certificate generation, live class integration.',
    cost: 4500,
    category: 'advanced',
    features: ['course-mgmt', 'enrollment', 'grading', 'certificates'],
    integrations: ['hr', 'dashboard'],
    icon: 'book',
  },
  {
    id: 'document-mgmt',
    name: 'Contract & Document Management',
    description: 'Contract templates, e-signature, versioning, deadline tracking, obligation compliance.',
    cost: 3500,
    category: 'advanced',
    features: ['contracts', 'e-signature', 'versioning', 'deadline-tracking'],
    integrations: ['crm', 'accounting'],
    icon: 'file',
  },
  // Integration Add-ons
  {
    id: 'payment-gateway',
    name: 'Payment Gateway Integration',
    description: 'Foloosi, Stripe, PayPal. 1.99% transaction fee (Foloosi). Automatic reconciliation.',
    cost: 1500,
    category: 'integration',
    features: ['foloosi', 'stripe', 'paypal', 'auto-reconciliation'],
    integrations: ['accounting'],
    icon: 'card',
  },
  {
    id: 'google-workspace',
    name: 'Google Workspace Integration',
    description: 'Calendar sync, Gmail thread tracking, Drive embed, auto contact creation from emails.',
    cost: 1000,
    category: 'integration',
    features: ['calendar-sync', 'gmail', 'drive', 'contacts'],
    integrations: ['crm'],
    icon: 'mail',
  },
  {
    id: 'slack-teams',
    name: 'Slack & Teams Integration',
    description: 'Notification routing, command-driven actions, two-way sync for urgent items.',
    cost: 1200,
    category: 'integration',
    features: ['notifications', 'commands', 'sync'],
    integrations: ['all'],
    icon: 'message',
  },
]

export const QUOTE_DATA = {
  industries: INDUSTRIES,
  aiFeatures: AI_FEATURES,
  odooModules: ODOO_MODULES,
}
