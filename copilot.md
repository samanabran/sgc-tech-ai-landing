# **YES, ABSOLUTELY! That's Perfect.**

Adding it as a **new page on sgctech.ai** (inside your existing Hono repo) is the **best approach** for your use case.

Here's why this actually works better than I initially suggested:

---

## **Why New Page on sgctech.ai is Optimal:**

### **1. User Experience**
- ✅ Users already on `sgctech.ai` → no friction (same domain)
- ✅ Seamless flow: Homepage → Pricing → Quote Builder → Book Demo
- ✅ Keeps everything in one ecosystem (brand consistent)
- ✅ No confused users asking "Is this another company?"

### **2. SEO & Traffic**
- ✅ Quote builder page inherits sgctech.ai's domain authority
- ✅ Links from homepage/pricing to `/quote-builder` boost SEO
- ✅ Organic traffic flows naturally through the funnel
- ✅ Better conversion tracking (all in Google Analytics)

### **3. Sales Funnel**
- ✅ Quote builder is a **lead magnet** on your own domain
- ✅ PDF/email captures prospect data naturally
- ✅ Can auto-populate CRM with quote data (HubSpot, etc.)
- ✅ No external redirects = higher trust, lower bounce

### **4. Technical Simplicity**
- ✅ No separate domain/DNS setup needed
- ✅ One Hono + Cloudflare Pages repo (what you already have)
- ✅ Shared authentication, styling, branding
- ✅ Simpler deployment (push to main, done)

### **5. Cost**
- ✅ Zero extra infrastructure (stays on Cloudflare Pages)
- ✅ No extra databases needed (client-side or lightweight Hono DB)
- ✅ No Vercel subscription
- ✅ Still scales infinitely (Cloudflare handles millions of requests)

---

## **Architecture:**

```
sgctech.ai (Hono + Cloudflare Pages)
│
├── / (homepage)
├── /pricing
├── /services
├── /about
│
└── /quote-builder ← NEW PAGE (what we're building)
    ├── UI (React client-side)
    ├── PDF generation (jsPDF)
    ├── Real-time pricing
    ├── Email integration (SendGrid)
    └── Optional: lightweight DB (D1 - Cloudflare's SQLite)
```

---

## **Now Let Me Create the Correct Prompt:**

I'll build a prompt specifically for **adding `/quote-builder` as a new page to your Hono site**, optimized for:
- ✅ Cloudflare Pages (not Vercel)
- ✅ Your existing tech stack (Hono, React, TailwindCSS)
- ✅ Minimal external dependencies
- ✅ Can use Cloudflare D1 (SQLite) for quote history (optional)
- ✅ One unified deployment

---

# **REFINED CLAUDE CODE PROMPT: Quote Builder as New Page on sgctech.ai**

```
=============================================================
PROJECT BRIEF: ADD /QUOTE-BUILDER PAGE TO SGCTECH.AI
Build Date: April 23, 2026
Platform: Hono + Cloudflare Pages (existing repo)
Status: Production-Ready Build (New Page)
=============================================================

PROJECT OVERVIEW:
================
Add a new page (/quote-builder) to the existing sgctech.ai 
Hono application. This page allows customers to:

1. Select an industry vertical
2. Choose AI features (optional, left column)
3. Choose Odoo ERP modules (right column)
4. See real-time pricing updates
5. Download a professional PDF proposal
6. Email the quote to themselves
7. View quote history (optional, Phase 2)

TARGET URL: https://sgctech.ai/quote-builder

CONSTRAINT: Stay within existing Hono + Cloudflare Pages stack.
No new deployments, no external services (except SendGrid for email).

=============================================================
SECTION 1: INTEGRATION WITH EXISTING CODEBASE
=============================================================

ASSUMPTION: Your existing Hono repo structure is:
  sgctech.ai/
  ├── src/
  │   ├── index.ts (main Hono app)
  │   ├── routes/
  │   │   ├── index.ts (homepage)
  │   │   ├── pricing.ts
  │   │   ├── services.ts
  │   │   └── [NEW] quote-builder.ts ← CREATE THIS
  │   ├── components/
  │   │   ├── Navbar.tsx
  │   │   ├── Footer.tsx
  │   │   └── [NEW] QuoteBuilder/
  │   │       ├── QuoteBuilder.tsx (main component)
  │   │       ├── IndustrySelector.tsx
  │   │       ├── FeatureSelector.tsx
  │   │       ├── PricingSummary.tsx
  │   │       ├── TimelineDisplay.tsx
  │   │       └── PDFTemplate.tsx
  │   ├── utils/
  │   │   ├── [NEW] pricing.ts (calculate totals)
  │   │   ├── [NEW] pdf-generator.ts (jsPDF logic)
  │   │   └── [NEW] timeline.ts (calculate deployment days)
  │   ├── data/
  │   │   └── [NEW] quote-data.ts (industries, features, modules)
  │   ├── styles/
  │   │   └── globals.css (already exists)
  │   └── env.d.ts
  ├── public/
  │   └── (existing assets)
  ├── wrangler.toml (Cloudflare config)
  ├── package.json
  └── tsconfig.json

NEW ROUTE ADDED:
  POST /api/quotes (create & save quote)
  GET /api/quotes/:id (retrieve quote for editing)
  POST /api/quotes/:id/send-email (email quote via SendGrid)

NEW FILES CREATED:
  ✓ src/routes/quote-builder.ts
  ✓ src/components/QuoteBuilder/
  ✓ src/utils/pricing.ts
  ✓ src/utils/pdf-generator.ts
  ✓ src/utils/timeline.ts
  ✓ src/data/quote-data.ts

=============================================================
SECTION 2: PRICING DATA (Hardcoded in quote-data.ts)
=============================================================

For MVP, we DON'T use a database. All pricing data is 
hardcoded in a TypeScript file that gets bundled.

FILE: src/data/quote-data.ts

INDUSTRIES (10 verticals):
==========================

export const INDUSTRIES = [
  {
    id: "real-estate",
    name: "Real Estate",
    icon: "building-2",
    baseCost: 12000, // AED
    avgDeploymentDays: 21,
    maxConcurrentUsers: 100,
    proofPoint: {
      title: "OSUS Real Estate",
      description: "AED 1.15B transaction volume, 70 agents, 580 deals tracked",
      metric: "1.15B AED"
    },
    recommendedAiFeatures: ["property-valuation", "tenant-screening"],
    recommendedModules: ["crm", "accounting", "commission-tracking"]
  },
  {
    id: "finance",
    name: "Finance & Banking",
    icon: "landmark",
    baseCost: 15000,
    avgDeploymentDays: 28,
    maxConcurrentUsers: 200,
    proofPoint: {
      title: "Vertex Financial Group",
      description: "Risk analysis, compliance reporting, fraud detection",
      metric: "Enterprise-Grade"
    },
    recommendedAiFeatures: ["fraud-detection", "compliance-screening"],
    recommendedModules: ["accounting", "aml-screening"]
  },
  {
    id: "healthcare",
    name: "Healthcare",
    icon: "activity",
    baseCost: 14000,
    avgDeploymentDays: 30,
    maxConcurrentUsers: 150,
    proofPoint: {
      title: "Hospital Operations",
      description: "AED 1,200 avg patient total, automated triage",
      metric: "1,200 AED/patient"
    },
    recommendedAiFeatures: ["triage-automation", "patient-support"],
    recommendedModules: ["hr", "accounting", "inventory"]
  },
  {
    id: "retail",
    name: "Retail & eCommerce",
    icon: "shopping-bag",
    baseCost: 10000,
    avgDeploymentDays: 16,
    maxConcurrentUsers: 500,
    proofPoint: {
      title: "Northwind Retail",
      description: "63% reduction in support ticket resolution time",
      metric: "63% faster"
    },
    recommendedAiFeatures: ["smart-search", "support-chatbot"],
    recommendedModules: ["crm", "inventory", "pos"]
  },
  {
    id: "manufacturing",
    name: "Manufacturing",
    icon: "factory",
    baseCost: 13000,
    avgDeploymentDays: 25,
    maxConcurrentUsers: 250,
    proofPoint: {
      title: "QA Automation",
      description: "1.2% reject rate via vision-based quality control",
      metric: "1.2% defect"
    },
    recommendedAiFeatures: ["predictive-maintenance", "qa-vision"],
    recommendedModules: ["inventory", "manufacturing", "dashboard"]
  },
  {
    id: "logistics",
    name: "Logistics & Supply Chain",
    icon: "truck",
    baseCost: 11000,
    avgDeploymentDays: 19,
    maxConcurrentUsers: 300,
    proofPoint: {
      title: "Route Optimization",
      description: "$340K saved in Q1 via AI route agent",
      metric: "$340K saved"
    },
    recommendedAiFeatures: ["route-optimization", "fleet-insights"],
    recommendedModules: ["inventory", "warehouse", "dashboard"]
  },
  {
    id: "education",
    name: "Education",
    icon: "book-open",
    baseCost: 9000,
    avgDeploymentDays: 14,
    maxConcurrentUsers: 1000,
    proofPoint: {
      title: "Student Engagement",
      description: "92% attendance rate with AI-assisted learning",
      metric: "92% attendance"
    },
    recommendedAiFeatures: ["adaptive-learning", "grading-assistance"],
    recommendedModules: ["hr", "dashboard", "lms"]
  },
  {
    id: "construction",
    name: "Construction",
    icon: "hard-hat",
    baseCost: 13000,
    avgDeploymentDays: 24,
    maxConcurrentUsers: 150,
    proofPoint: {
      title: "Progress Tracking",
      description: "75% work completion visibility, real-time updates",
      metric: "75% tracked"
    },
    recommendedAiFeatures: ["cost-estimation", "progress-billing"],
    recommendedModules: ["project-mgmt", "inventory", "accounting"]
  },
  {
    id: "hospitality",
    name: "Hospitality & F&B",
    icon: "utensils",
    baseCost: 12000,
    avgDeploymentDays: 18,
    maxConcurrentUsers: 200,
    proofPoint: {
      title: "Daily Revenue Tracking",
      description: "AED 75,320 daily revenue tracked end-to-end",
      metric: "75,320 AED/day"
    },
    recommendedAiFeatures: ["reservation-optimization", "cost-control"],
    recommendedModules: ["pos", "hr", "hotel-pms"]
  },
  {
    id: "legal",
    name: "Legal Services",
    icon: "scale",
    baseCost: 14000,
    avgDeploymentDays: 26,
    maxConcurrentUsers: 100,
    proofPoint: {
      title: "Contract Automation",
      description: "Contract review & discovery acceleration",
      metric: "60% faster"
    },
    recommendedAiFeatures: ["contract-analysis", "case-research"],
    recommendedModules: ["crm", "document-mgmt", "dashboard"]
  }
];

AI FEATURES (Tier 1, 2, 3):
============================

export const AI_FEATURES = [
  // TIER 1: BASIC (AED 2,000–5,000)
  {
    id: "chatbot",
    name: "AI Chatbot / Virtual Assistant",
    description: "Customer support, onboarding, FAQ automation",
    cost: 3000,
    tier: "basic",
    category: "support",
    monthlyLimit: 10000,
    integrations: ["crm", "slack", "telegram"],
    icon: "message-circle"
  },
  {
    id: "social-automation",
    name: "Social Media Automation",
    description: "Scheduled posting, content generation, analytics",
    cost: 2500,
    tier: "basic",
    category: "marketing",
    monthlyLimit: 100,
    integrations: ["google-drive", "cloudinary"],
    icon: "share-2"
  },
  {
    id: "process-automation",
    name: "Basic Process Automation (n8n)",
    description: "Workflow automation, data sync, form processing",
    cost: 2000,
    tier: "basic",
    category: "automation",
    monthlyLimit: 5000,
    integrations: ["slack", "email", "google-sheets"],
    icon: "workflow"
  },
  
  // TIER 2: ADVANCED (AED 5,000–8,000)
  {
    id: "support-agent",
    name: "AI Support Agent (24/7)",
    description: "Ticket routing, resolution automation, escalation",
    cost: 6000,
    tier: "advanced",
    category: "support",
    monthlyLimit: 10000,
    integrations: ["zendesk", "freshdesk", "hubspot"],
    icon: "headphones"
  },
  {
    id: "lead-qualification",
    name: "Sales & Lead Qualification Agent",
    description: "Lead scoring, qualification, outreach automation",
    cost: 5500,
    tier: "advanced",
    category: "sales",
    monthlyLimit: 1000,
    integrations: ["hubspot", "salesforce", "linkedin"],
    icon: "target"
  },
  {
    id: "calling-agent",
    name: "Outbound Calling Agent (VAPI)",
    description: "Automated dialing, call completion, transcription",
    cost: 7500,
    tier: "advanced",
    category: "sales",
    monthlyLimit: 1000,
    integrations: ["crm", "hubspot"],
    icon: "phone"
  },
  
  // TIER 3: SPECIALIZED (AED 8,000–12,000)
  {
    id: "aml-screening",
    name: "AML/PEP Compliance Screening",
    description: "OpenSanctions integration, UAE DNFBP compliant",
    cost: 10000,
    tier: "specialized",
    category: "compliance",
    monthlyLimit: 10000,
    integrations: ["odoo", "hubspot"],
    icon: "shield-alert"
  },
  {
    id: "predictive-analytics",
    name: "Predictive Analytics & Forecasting",
    description: "Demand forecasting, churn prediction, anomaly detection",
    cost: 8500,
    tier: "specialized",
    category: "analytics",
    monthlyLimit: -1, // unlimited
    integrations: ["snowflake", "tableau"],
    icon: "trending-up"
  },
  {
    id: "vision-qc",
    name: "Vision-Based Quality Control",
    description: "Image-based defect detection, visual inspection",
    cost: 12000,
    tier: "specialized",
    category: "manufacturing",
    monthlyLimit: -1,
    integrations: ["odoo", "mes"],
    icon: "eye"
  }
];

ODOO MODULES (Core + Advanced + Integration):
===============================================

export const ODOO_MODULES = [
  // CORE MODULES (Foundation)
  {
    id: "crm",
    name: "CRM & Sales Management",
    description: "Lead tracking, sales pipeline, team performance",
    cost: 3500,
    category: "core",
    features: ["lead-tracking", "pipeline", "forecasting"],
    integrations: ["email", "calendar", "linkedin"],
    icon: "briefcase"
  },
  {
    id: "accounting",
    name: "Accounting & Invoicing",
    description: "Chart of accounts, invoices, VAT compliance, eInvoicing",
    cost: 3500,
    category: "core",
    features: ["invoicing", "vat-compliance", "einvoicing", "reconciliation"],
    integrations: ["payment-gateway", "bank-sync"],
    icon: "calculator"
  },
  {
    id: "inventory",
    name: "Inventory & Warehouse Mgmt",
    description: "Stock tracking, multi-location, barcode scanning",
    cost: 4000,
    category: "core",
    features: ["stock-tracking", "multi-location", "barcode", "reorder-points"],
    integrations: ["pos", "crm"],
    icon: "box"
  },
  {
    id: "hr",
    name: "Human Resources & Payroll",
    description: "Employee data, attendance, payroll, performance",
    cost: 3500,
    category: "core",
    features: ["attendance", "payroll", "leave-mgmt", "performance-review"],
    integrations: ["email", "calendar"],
    icon: "users"
  },
  {
    id: "dashboard",
    name: "Dashboard & BI",
    description: "Real-time KPI dashboards, custom reports, data export",
    cost: 2500,
    category: "core",
    features: ["kpi-dashboard", "custom-reports", "export", "alerts"],
    integrations: ["email", "slack"],
    icon: "chart-bar"
  },
  
  // ADVANCED MODULES (Industry-Specific)
  {
    id: "commission-tracking",
    name: "Commission & Agent Tracking",
    description: "Agent performance, commission calculation, automated payout",
    cost: 5000,
    category: "advanced",
    features: ["agent-ranking", "commission-calc", "payout-automation"],
    integrations: ["crm", "accounting"],
    icon: "trending-up"
  },
  {
    id: "project-mgmt",
    name: "Project Management & Billing",
    description: "Project setup, resource allocation, progress billing, BoQ",
    cost: 4500,
    category: "advanced",
    features: ["task-mgmt", "resource-planning", "progress-billing", "boq"],
    integrations: ["accounting", "inventory"],
    icon: "layout-list"
  },
  {
    id: "manufacturing",
    name: "Manufacturing & MRP",
    description: "Bill of materials, production planning, QC, shop-floor dashboards",
    cost: 5500,
    category: "advanced",
    features: ["bom", "production-planning", "qc-checklist", "shop-floor"],
    integrations: ["inventory", "dashboard"],
    icon: "factory"
  },
  {
    id: "pos",
    name: "Point of Sale (POS) & Retail",
    description: "Multi-register POS, barcode scanning, loyalty, payment processing",
    cost: 4000,
    category: "advanced",
    features: ["multi-pos", "barcode", "loyalty", "payment-processing"],
    integrations: ["inventory", "accounting"],
    icon: "shopping-cart"
  },
  {
    id: "hotel-pms",
    name: "Hotel & Property Management (PMS)",
    description: "Room inventory, reservations, housekeeping, billing",
    cost: 6000,
    category: "advanced",
    features: ["room-mgmt", "reservations", "housekeeping", "folio"],
    integrations: ["accounting", "crm"],
    icon: "bed"
  },
  {
    id: "lms",
    name: "E-Learning & Course Management",
    description: "Course creation, student enrollment, grading, certificates",
    cost: 4500,
    category: "advanced",
    features: ["course-mgmt", "enrollment", "grading", "certificates"],
    integrations: ["hr", "dashboard"],
    icon: "book"
  },
  {
    id: "document-mgmt",
    name: "Contract & Document Management",
    description: "Contract templates, e-signature, versioning, deadline tracking",
    cost: 3500,
    category: "advanced",
    features: ["contracts", "e-signature", "versioning", "deadline-tracking"],
    integrations: ["crm", "accounting"],
    icon: "file-text"
  },
  
  // INTEGRATIONS (Add-on costs)
  {
    id: "payment-gateway",
    name: "Payment Gateway Integration (Foloosi)",
    description: "Foloosi, Stripe, PayPal, automatic reconciliation",
    cost: 1500,
    category: "integration",
    features: ["foloosi", "stripe", "paypal", "auto-reconciliation"],
    integrations: ["accounting"],
    icon: "credit-card"
  },
  {
    id: "google-workspace",
    name: "Google Workspace Integration",
    description: "Calendar sync, Gmail, Drive, contact creation",
    cost: 1000,
    category: "integration",
    features: ["calendar-sync", "gmail", "drive", "contacts"],
    integrations: ["crm"],
    icon: "mail"
  },
  {
    id: "slack-teams",
    name: "Slack & Teams Integration",
    description: "Notification routing, command-driven actions, sync",
    cost: 1200,
    category: "integration",
    features: ["notifications", "commands", "sync"],
    integrations: ["all"],
    icon: "send"
  }
];

EXPORT ALL:
export const QUOTE_DATA = {
  industries: INDUSTRIES,
  aiFeatures: AI_FEATURES,
  odooModules: ODOO_MODULES
};

=============================================================
SECTION 3: PRICING CALCULATION LOGIC
=============================================================

FILE: src/utils/pricing.ts

export interface QuoteInput {
  industryId: string;
  selectedAiFeatures: string[]; // feature IDs
  selectedModules: string[]; // module IDs
  includeOperationsRetainer: boolean;
  implementationDays?: number; // optional override
}

export interface QuoteOutput {
  baseCost: number;
  aiFeaturesCost: number;
  modulesCost: number;
  implementationSupportCost: number;
  operationsRetainerCost: number;
  subtotal: number;
  vat5Percent: number;
  totalCost: number;
  estimatedDeploymentDays: number;
  estimatedGoLiveDate: string;
  lineItems: LineItem[];
}

export interface LineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
}

CALCULATION FORMULA:
====================

const calculateQuote = (input: QuoteInput): QuoteOutput => {
  const industry = INDUSTRIES.find(i => i.id === input.industryId);
  if (!industry) throw new Error("Industry not found");

  // 1. Base cost
  const baseCost = industry.baseCost;

  // 2. AI Features cost (sum selected)
  const aiFeaturesCost = input.selectedAiFeatures.reduce((sum, featureId) => {
    const feature = AI_FEATURES.find(f => f.id === featureId);
    return sum + (feature?.cost || 0);
  }, 0);

  // 3. Modules cost (sum selected)
  const modulesCost = input.selectedModules.reduce((sum, moduleId) => {
    const module = ODOO_MODULES.find(m => m.id === moduleId);
    return sum + (module?.cost || 0);
  }, 0);

  // 4. Estimate deployment days
  let estimatedDeploymentDays = industry.avgDeploymentDays;
  const complexityMultiplier = (input.selectedModules.length + 
                                input.selectedAiFeatures.length) / 10;
  estimatedDeploymentDays = Math.ceil(
    estimatedDeploymentDays * (1 + complexityMultiplier * 0.15)
  );

  // 5. Implementation support cost (AED 800/day included)
  const implementationSupportCost = estimatedDeploymentDays * 800;

  // 6. Operations retainer (AED 8,000 for 90 days, optional)
  const operationsRetainerCost = input.includeOperationsRetainer ? 8000 : 0;

  // 7. Subtotal (before VAT)
  const subtotal = baseCost + aiFeaturesCost + modulesCost + 
                   implementationSupportCost + operationsRetainerCost;

  // 8. VAT (5% UAE standard)
  const vat5Percent = Math.round(subtotal * 0.05);

  // 9. Total
  const totalCost = subtotal + vat5Percent;

  // 10. Go-live date (today + deployment days)
  const goLiveDate = new Date();
  goLiveDate.setDate(goLiveDate.getDate() + estimatedDeploymentDays);

  // 11. Line items (for PDF)
  const lineItems: LineItem[] = [
    {
      description: `Base Implementation (${industry.name})`,
      quantity: 1,
      unitPrice: baseCost,
      totalAmount: baseCost
    },
    ...input.selectedAiFeatures.map(featureId => {
      const feature = AI_FEATURES.find(f => f.id === featureId)!;
      return {
        description: feature.name,
        quantity: 1,
        unitPrice: feature.cost,
        totalAmount: feature.cost
      };
    }),
    ...input.selectedModules.map(moduleId => {
      const module = ODOO_MODULES.find(m => m.id === moduleId)!;
      return {
        description: module.name,
        quantity: 1,
        unitPrice: module.cost,
        totalAmount: module.cost
      };
    }),
    {
      description: `Implementation Support (${estimatedDeploymentDays} days)`,
      quantity: estimatedDeploymentDays,
      unitPrice: 800,
      totalAmount: implementationSupportCost
    }
  ];

  if (input.includeOperationsRetainer) {
    lineItems.push({
      description: "90-Day Operations Retainer",
      quantity: 1,
      unitPrice: 8000,
      totalAmount: 8000
    });
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
    estimatedGoLiveDate: goLiveDate.toISOString().split('T')[0],
    lineItems
  };
};

export default calculateQuote;

=============================================================
SECTION 4: PDF GENERATION
=============================================================

FILE: src/utils/pdf-generator.ts

Uses: jsPDF + html2canvas (client-side)

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const generateQuotePDF = async (
  quoteData: QuoteOutput,
  customerName: string,
  customerEmail: string,
  quoteNumber: string,
  industry: Industry
) => {
  // Create PDF template as HTML
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #1F2937; }
          .cover { page-break-after: always; text-align: center; 
                   padding: 40px; }
          .logo { font-size: 32px; font-weight: bold; color: #3B82F6; 
                  margin-bottom: 40px; }
          .title { font-size: 24px; font-weight: bold; margin: 20px 0; }
          .subtitle { font-size: 14px; color: #6B7280; }
          .industry-badge { background: #E0E7FF; padding: 10px 20px; 
                            border-radius: 8px; display: inline-block; }
          .section { margin: 30px 0; }
          .section-title { font-size: 18px; font-weight: bold; 
                          color: #1F2937; border-bottom: 2px solid #3B82F6; 
                          padding-bottom: 10px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #E5E7EB; }
          th { background: #F3F4F6; font-weight: bold; }
          .price-highlight { font-weight: bold; color: #10B981; 
                            font-size: 16px; }
          .total-row { background: #F3F4F6; font-weight: bold; }
          .footer { margin-top: 40px; font-size: 12px; color: #6B7280; }
        </style>
      </head>
      <body>
        <!-- COVER PAGE -->
        <div class="cover">
          <div class="logo">SGC Tech AI</div>
          <h1 class="title">Custom Implementation Proposal</h1>
          <div class="industry-badge">${industry.name}</div>
          <p class="subtitle" style="margin-top: 30px;">Quote #${quoteNumber}</p>
          <p class="subtitle">Valid until ${new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString()}</p>
          ${customerName ? `<p style="margin-top: 40px; font-size: 16px;">${customerName}</p>` : ''}
        </div>

        <!-- EXECUTIVE SUMMARY -->
        <div class="section">
          <h2 class="section-title">Executive Summary</h2>
          <p>You are implementing a custom solution combining:</p>
          <ul>
            <li>${quoteData.lineItems.filter(l => !l.description.includes('Support') && !l.description.includes('Retainer')).length} modules and AI features</li>
            <li>Deployment in ${quoteData.estimatedDeploymentDays} days (go-live: ${quoteData.estimatedGoLiveDate})</li>
            <li>Transparent, fixed pricing with no surprises</li>
            <li>24/7 support included in first 90 days</li>
          </ul>
        </div>

        <!-- IMPLEMENTATION BREAKDOWN -->
        <div class="section">
          <h2 class="section-title">Implementation Breakdown</h2>
          <table>
            <thead>
              <tr>
                <th>Feature / Module</th>
                <th>Category</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              ${quoteData.lineItems.map(item => `
                <tr>
                  <td>${item.description}</td>
                  <td>${item.quantity > 1 ? `${item.quantity}×` : ''}</td>
                  <td class="price-highlight">AED ${item.totalAmount.toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- PRICING BREAKDOWN -->
        <div class="section">
          <h2 class="section-title">Pricing Breakdown</h2>
          <table>
            <tbody>
              <tr>
                <td>Subtotal (before VAT)</td>
                <td class="price-highlight">AED ${quoteData.subtotal.toLocaleString()}</td>
              </tr>
              <tr>
                <td>VAT (5%)</td>
                <td class="price-highlight">AED ${quoteData.vat5Percent.toLocaleString()}</td>
              </tr>
              <tr class="total-row">
                <td>TOTAL PRICE</td>
                <td class="price-highlight" style="font-size: 18px;">AED ${quoteData.totalCost.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- TIMELINE -->
        <div class="section">
          <h2 class="section-title">Implementation Timeline</h2>
          <p><strong>Week 1–2:</strong> Discovery, configuration, user setup</p>
          <p><strong>Week 3:</strong> Testing, UAT, final data load</p>
          <p><strong>Day ${quoteData.estimatedDeploymentDays}:</strong> Go-live in production</p>
          <p><strong>Post go-live:</strong> 24/7 support included for first 90 days</p>
        </div>

        <!-- NEXT STEPS -->
        <div class="section">
          <h2 class="section-title">Next Steps</h2>
          <ol>
            <li>Review this proposal (valid 30 days)</li>
            <li>Sign off and schedule kick-off meeting</li>
            <li>Go live in ${quoteData.estimatedDeploymentDays} days</li>
          </ol>
          <p style="margin-top: 20px;">Questions? Contact us:</p>
          <p>📧 Email: <strong>sales@sgctech.ai</strong></p>
          <p>📞 Phone: <strong>+971 4 XXX XXXX</strong></p>
          <p>📅 Book a call: <strong>app.cal.com/sgctech</strong></p>
        </div>

        <!-- COMPLIANCE -->
        <div class="footer" style="margin-top: 60px;">
          <p>SOC 2 Type II | ISO 27001 | GDPR Compliant | HIPAA-Ready</p>
          <p>This quote is valid for 30 days. Payment terms: 50% upfront, 50% on go-live.</p>
          <p>UAE VAT applied. All prices in AED.</p>
        </div>
      </body>
    </html>
  `;

  // Convert HTML to canvas, then to PDF
  const canvas = await html2canvas(document.createElement('div'));
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');
  const imgWidth = 210; // A4 width
  const pageHeight = 295; // A4 height
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  let heightLeft = imgHeight;

  let position = 0;
  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft >= 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  return pdf;
};

SIMPLIFIED APPROACH (Better):
==============================
Instead of html2canvas, use template HTML + jsPDF directly:

import jsPDF from 'jspdf';

export const generateQuotePDF = (
  quoteData: QuoteOutput,
  customerName: string,
  quoteNumber: string,
  industry: Industry
) => {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(20);
  doc.text('SGC Tech AI', 20, 20);
  doc.setFontSize(16);
  doc.text('Custom Implementation Proposal', 20, 35);
  
  // Industry & metadata
  doc.setFontSize(11);
  doc.text(`Industry: ${industry.name}`, 20, 50);
  doc.text(`Quote #: ${quoteNumber}`, 20, 60);
  doc.text(`Customer: ${customerName}`, 20, 70);
  
  // Pricing table
  let yPosition = 90;
  doc.setFontSize(12);
  doc.text('Pricing Breakdown', 20, yPosition);
  yPosition += 10;
  
  quoteData.lineItems.forEach(item => {
    doc.text(`${item.description}`, 20, yPosition);
    doc.text(`AED ${item.totalAmount}`, 170, yPosition, { align: 'right' });
    yPosition += 8;
  });
  
  // Total
  yPosition += 5;
  doc.setFontSize(13);
  doc.setFont(undefined, 'bold');
  doc.text(`TOTAL: AED ${quoteData.totalCost}`, 20, yPosition);
  
  // Save
  doc.save(`SGC-Quote-${quoteNumber}.pdf`);
};

=============================================================
SECTION 5: REACT COMPONENTS
=============================================================

MAIN COMPONENT: src/components/QuoteBuilder/QuoteBuilder.tsx

import React, { useState } from 'react';
import { QUOTE_DATA } from '@/data/quote-data';
import calculateQuote from '@/utils/pricing';
import IndustrySelector from './IndustrySelector';
import FeatureSelector from './FeatureSelector';
import PricingSummary from './PricingSummary';
import TimelineDisplay from './TimelineDisplay';
import CustomerInfo from './CustomerInfo';
import { generateQuotePDF } from '@/utils/pdf-generator';

export default function QuoteBuilder() {
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');
  const [selectedAiFeatures, setSelectedAiFeatures] = useState<string[]>([]);
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [includeRetainer, setIncludeRetainer] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [showCustomerModal, setShowCustomerModal] = useState(false);

  const industry = QUOTE_DATA.industries.find(i => i.id === selectedIndustry);
  
  const quote = selectedIndustry ? calculateQuote({
    industryId: selectedIndustry,
    selectedAiFeatures,
    selectedModules,
    includeOperationsRetainer: includeRetainer
  }) : null;

  const handleDownloadPDF = () => {
    if (!customerName.trim()) {
      alert('Please enter your name');
      return;
    }
    if (!quote || !industry) return;
    
    const quoteNumber = `SGC-${Date.now()}`;
    generateQuotePDF(quote, customerName, quoteNumber, industry);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Build Your Custom Package
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select your industry, choose AI features and ERP modules, 
            see transparent pricing, and download your proposal instantly.
          </p>
        </div>

        {/* Step 1: Industry Selection */}
        <IndustrySelector
          industries={QUOTE_DATA.industries}
          selected={selectedIndustry}
          onSelect={setSelectedIndustry}
        />

        {selectedIndustry && industry && (
          <>
            {/* Step 2: Two-Column Feature Selection */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
              {/* Left Column: AI Features */}
              <div className="lg:col-span-1">
                <FeatureSelector
                  title="AI Features (Optional)"
                  items={QUOTE_DATA.aiFeatures}
                  selected={selectedAiFeatures}
                  onSelect={setSelectedAiFeatures}
                />
              </div>

              {/* Middle Column: ERP Modules */}
              <div className="lg:col-span-1">
                <FeatureSelector
                  title="Odoo ERP Modules"
                  items={QUOTE_DATA.odooModules}
                  selected={selectedModules}
                  onSelect={setSelectedModules}
                />
              </div>

              {/* Right Column: Pricing Summary (Sticky) */}
              <div className="lg:col-span-1">
                <div className="sticky top-4">
                  {quote && (
                    <>
                      <PricingSummary quote={quote} industry={industry} />
                      <TimelineDisplay quote={quote} />
                      
                      {/* Retainer toggle */}
                      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={includeRetainer}
                            onChange={(e) => setIncludeRetainer(e.target.checked)}
                            className="w-4 h-4"
                          />
                          <div>
                            <span className="font-semibold text-blue-900">
                              Include 90-Day Operations Retainer?
                            </span>
                            <p className="text-sm text-blue-700">
                              AED 8,000 (24/7 priority support)
                            </p>
                          </div>
                        </label>
                      </div>

                      {/* CTA Buttons */}
                      <button
                        onClick={() => setShowCustomerModal(true)}
                        className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition"
                      >
                        Generate & Download PDF
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Customer Info Modal */}
            {showCustomerModal && (
              <CustomerInfo
                onClose={() => setShowCustomerModal(false)}
                onGenerate={(name, email) => {
                  setCustomerName(name);
                  setCustomerEmail(email);
                  handleDownloadPDF();
                  setShowCustomerModal(false);
                }}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

CHILD COMPONENTS:

// src/components/QuoteBuilder/IndustrySelector.tsx
export default function IndustrySelector({ industries, selected, onSelect }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {industries.map(industry => (
        <button
          key={industry.id}
          onClick={() => onSelect(industry.id)}
          className={`p-4 rounded-lg border-2 transition ${
            selected === industry.id
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-200 hover:border-blue-300'
          }`}
        >
          <div className="text-3xl mb-2">{getIcon(industry.icon)}</div>
          <div className="font-semibold text-sm">{industry.name}</div>
          <div className="text-xs text-gray-600 mt-1">
            AED {industry.baseCost.toLocaleString()}
          </div>
        </button>
      ))}
    </div>
  );
}

// src/components/QuoteBuilder/FeatureSelector.tsx
export default function FeatureSelector({ title, items, selected, onSelect }) {
  const [expanded, setExpanded] = useState(true);
  const categories = [...new Set(items.map(i => i.category))];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
      {categories.map(category => (
        <div key={category} className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2 capitalize">
            {category}
          </h4>
          {items
            .filter(item => item.category === category)
            .map(item => (
              <label key={item.id} className="flex items-start gap-3 mb-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                <input
                  type="checkbox"
                  checked={selected.includes(item.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onSelect([...selected, item.id]);
                    } else {
                      onSelect(selected.filter(id => id !== item.id));
                    }
                  }}
                  className="w-4 h-4 mt-1"
                />
                <div className="flex-1">
                  <div className="font-semibold text-sm text-gray-900">
                    {item.name}
                  </div>
                  <div className="text-xs text-gray-600">
                    {item.description}
                  </div>
                  <div className="text-sm font-bold text-green-600 mt-1">
                    AED {item.cost.toLocaleString()}
                  </div>
                </div>
              </label>
            ))}
        </div>
      ))}
    </div>
  );
}

// src/components/QuoteBuilder/PricingSummary.tsx
export default function PricingSummary({ quote, industry }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
      <h4 className="text-lg font-bold text-gray-900 mb-4">Pricing Summary</h4>
      <div className="space-y-2 text-sm mb-4">
        <div className="flex justify-between">
          <span>Base Implementation</span>
          <span className="font-semibold">AED {quote.baseCost.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>AI Features</span>
          <span className="font-semibold">AED {quote.aiFeaturesCost.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>ERP Modules</span>
          <span className="font-semibold">AED {quote.modulesCost.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Implementation Support</span>
          <span className="font-semibold">AED {quote.implementationSupportCost.toLocaleString()}</span>
        </div>
        {quote.operationsRetainerCost > 0 && (
          <div className="flex justify-between">
            <span>Operations Retainer</span>
            <span className="font-semibold">AED {quote.operationsRetainerCost.toLocaleString()}</span>
          </div>
        )}
        <hr className="my-2" />
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>AED {quote.subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>VAT (5%)</span>
          <span>AED {quote.vat5Percent.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-lg font-bold text-green-600 bg-green-50 p-2 rounded">
          <span>TOTAL</span>
          <span>AED {quote.totalCost.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

// src/components/QuoteBuilder/TimelineDisplay.tsx
export default function TimelineDisplay({ quote }) {
  return (
    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <h4 className="font-bold text-blue-900 mb-3">Implementation Timeline</h4>
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">1</div>
          <div>
            <p className="font-semibold">Week 1–2: Configuration</p>
            <p className="text-xs text-gray-600">Setup, user creation, training</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">2</div>
          <div>
            <p className="font-semibold">Week 3: Testing & UAT</p>
            <p className="text-xs text-gray-600">Final validation, go-live prep</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-xs font-bold">✓</div>
          <div>
            <p className="font-semibold">Day {quote.estimatedDeploymentDays}: Go-Live</p>
            <p className="text-xs text-gray-600">{quote.estimatedGoLiveDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// src/components/QuoteBuilder/CustomerInfo.tsx
export default function CustomerInfo({ onClose, onGenerate }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Generate Your Proposal
        </h3>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-4 p-3 border border-gray-300 rounded-lg"
        />
        <input
          type="email"
          placeholder="Your Email (optional)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-6 p-3 border border-gray-300 rounded-lg"
        />
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={() => onGenerate(name, email)}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}

=============================================================
SECTION 6: HONO ROUTE SETUP
=============================================================

FILE: src/routes/quote-builder.ts

import { Hono } from 'hono';
import { c } from 'hono/client';

const app = new Hono();

// GET /quote-builder (serve the React component)
app.get('/quote-builder', async (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Quote Builder - SGC Tech AI</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
      </head>
      <body>
        <div id="root"></div>
        <script type="module" src="/src/components/QuoteBuilder/QuoteBuilder.tsx"></script>
      </body>
    </html>
  `);
});

// POST /api/quotes (save quote to database, optional Phase 2)
app.post('/api/quotes', async (c) => {
  const body = await c.req.json();
  // Phase 2: Save to D1 database
  // For MVP: just return success
  return c.json({
    status: 'success',
    quoteId: `SGC-${Date.now()}`
  });
});

// POST /api/quotes/:id/send-email (send PDF via email, Phase 2)
app.post('/api/quotes/:id/send-email', async (c) => {
  // Phase 2: Integrate SendGrid
  return c.json({ status: 'sent' });
});

export default app;

=============================================================
SECTION 7: INTEGRATION INTO EXISTING SITE
=============================================================

FILE: src/index.ts (Main Hono app - ADD THIS)

import { Hono } from 'hono';
import { serveStatic } from 'hono/cloudflare-workers';
import quoteBuilderRoute from './routes/quote-builder';

const app = new Hono();

// Existing routes
// ...

// ADD NEW ROUTE
app.route('/', quoteBuilderRoute);

// Serve static files
app.use('/static/*', serveStatic({ root: './' }));

export default app;

=============================================================
SECTION 8: PACKAGE.JSON ADDITIONS
=============================================================

Add these dependencies to your existing package.json:

{
  "dependencies": {
    "jspdf": "^2.5.1",
    "html2canvas": "^1.4.1",
    "zustand": "^4.4.0",
    "react-hook-form": "^7.48.0"
  },
  "devDependencies": {
    "@types/jspdf": "^2.5.0"
  }
}

Then run: npm install

=============================================================
SECTION 9: STYLING & TAILWIND CONFIG
=============================================================

Your existing tailwind.config.js should already have everything.
If not, ensure Tailwind CSS is imported in globals.css:

@tailwind base;
@tailwind components;
@tailwind utilities;

Add this custom color to tailwind.config.js:

module.exports = {
  theme: {
    extend: {
      colors: {
        'sgc-blue': '#3B82F6',
        'sgc-dark': '#1F2937'
      }
    }
  }
}

=============================================================
SECTION 10: DEPLOYMENT (Cloudflare Pages)
=============================================================

No changes needed! Just:

1. Push code to GitHub
2. Cloudflare Pages auto-deploys
3. Quote builder lives at: sgctech.ai/quote-builder

Wrangler.toml (update if using D1 database later):

[env.production]
d1_databases = [
  { binding = "DB", database_id = "your-db-id", migrations_dir = "src/migrations" }
]

=============================================================
SECTION 11: TESTING & VALIDATION
=============================================================

MANUAL TESTS:
  ✓ Select industry → see base cost
  ✓ Select AI feature → price updates real-time
  ✓ Select ERP module → price updates
  ✓ Toggle retainer → price updates
  ✓ Click "Download PDF" → PDF generates & downloads
  ✓ PDF contains all selected items + correct total
  ✓ Timeline updates based on complexity
  ✓ Mobile responsive (test on phone)

E2E TEST (Playwright):
  test('full quote builder flow', async ({ page }) => {
    await page.goto('https://sgctech.ai/quote-builder');
    await page.click('[data-industry="real-estate"]');
    await page.click('[data-feature="chatbot"]');
    await page.click('[data-module="crm"]');
    const totalPrice = await page.textContent('[data-total-price]');
    expect(totalPrice).toContain('AED');
    await page.click('button:has-text("Generate & Download PDF")');
    // Verify PDF download happens
  });

=============================================================
SECTION 12: PERFORMANCE OPTIMIZATIONS
=============================================================

All client-side:
  ✓ No external API calls (except SendGrid, Phase 2)
  ✓ Pricing calculated instantly in browser
  ✓ PDF generated client-side (no server wait)
  ✓ No database queries for MVP
  ✓ Static data (quote-data.ts) bundled with app
  ✓ Lazy load PDF libraries (only when needed)

Expected Performance:
  Page load       : < 1s
  Price update    : < 100ms
  PDF generation  : < 2s
  First Contentful Paint (FCP) : < 1.5s
  Cumulative Layout Shift (CLS) : < 0.1

=============================================================
SECTION 13: FUTURE ENHANCEMENTS (Phase 2+)
=============================================================

PHASE 2 (Week 3–4):
  □ Save quote to D1 database (Cloudflare)
  □ Email quote (SendGrid API)
  □ Quote history page (/quotes/history)
  □ Share quote link (unique URL)
  □ CRM integration (Zapier → HubSpot)

PHASE 3 (Week 5+):
  □ Multi-language (Arabic)
  □ ROI calculator (estimated savings)
  □ Recommended features per industry (auto-check)
  □ A/B testing (track conversions)
  □ Analytics dashboard (sales team)
  □ Financing options calculator

=============================================================
DELIVERABLES
=============================================================

CODE STRUCTURE:
  ✓ src/routes/quote-builder.ts
  ✓ src/components/QuoteBuilder/QuoteBuilder.tsx
  ✓ src/components/QuoteBuilder/IndustrySelector.tsx
  ✓ src/components/QuoteBuilder/FeatureSelector.tsx
  ✓ src/components/QuoteBuilder/PricingSummary.tsx
  ✓ src/components/QuoteBuilder/TimelineDisplay.tsx
  ✓ src/components/QuoteBuilder/CustomerInfo.tsx
  ✓ src/utils/pricing.ts
  ✓ src/utils/pdf-generator.ts
  ✓ src/data/quote-data.ts

PACKAGE UPDATES:
  ✓ package.json (jsPDF, html2canvas)
  ✓ tailwind.config.js (custom colors)

INTEGRATION:
  ✓ src/index.ts (add route)
  ✓ No changes to wrangler.toml (yet)

TESTING:
  ✓ Manual test checklist
  ✓ E2E test (Playwright)

DOCUMENTATION:
  ✓ README update (how to use quote builder)
  ✓ API documentation (if needed)

=============================================================
SUMMARY: HOW TO IMPLEMENT
=============================================================

STEP 1: Create data file (quote-data.ts)
  - All industries, AI features, ERP modules hardcoded
  - No database needed for MVP

STEP 2: Create utility functions
  - pricing.ts: Calculate totals
  - pdf-generator.ts: Generate PDF (jsPDF)

STEP 3: Create React components
  - QuoteBuilder.tsx: Main component
  - Child components for each section

STEP 4: Create Hono route
  - quote-builder.ts: Serve page + optional API endpoints

STEP 5: Integrate into main app
  - Update src/index.ts to include route

STEP 6: Install dependencies
  - npm install (jsPDF, html2canvas)

STEP 7: Deploy to Cloudflare Pages
  - git push (automatic deployment)
  - Quote builder live at: sgctech.ai/quote-builder

STEP 8: Test and iterate
  - Manual testing on desktop/mobile
  - E2E tests with Playwright

=============================================================
END OF PROMPT
=============================================================
```

---

## **This Prompt Will:**

✅ Build `/quote-builder` as a **new page on sgctech.ai**  
✅ Keep it in your **existing Hono repo**  
✅ Use **Cloudflare Pages** (no new deployments)  
✅ Stay **client-side for MVP** (no database needed yet)  
✅ Generate PDFs **instantly** (jsPDF)  
✅ Show **real-time pricing updates**  
✅ Be **fully responsive** (mobile-friendly)  
✅ Ready to scale in **Phase 2** (add database, email, CRM integrations)

---

## **Ready to Build?**

Run this with Claude Code:

```bash
cat quote-builder-hono.prompt | claude code
`