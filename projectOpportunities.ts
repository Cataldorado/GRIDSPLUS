import type { QuoteGroup } from '@/data/sampleData'
import type { Evidence, SignalKey, Tier, TriageProject } from '@/data/triageData'
import { QUOTE_GROUPS } from '@/data/sampleData'

export type OpportunitySource = 'invited' | 'interested' | 'bidder'

export interface ProjectOpportunity {
  id: string
  /** Short label for tab (company name or abbreviation). */
  tabLabel: string
  companyName: string
  opportunityStatus: string
  source: OpportunitySource
  quoteStatus: string | null
  quoteNote: string
  /** Scales line-item sell prices for demo variance between bidders. */
  priceMultiplier: number
  signal: SignalKey
  tier: Tier
  evidence: Evidence[]
}

/** Per-project bidder/opportunity instances (M6 on shared M3 project). */
export const PROJECT_OPPORTUNITIES: Record<string, ProjectOpportunity[]> = {
  '#AUT-26-89442': [
    {
      id: 'opp-ovs',
      tabLabel: 'Ohio Valley Sitework',
      companyName: 'Ohio Valley Sitework',
      opportunityStatus: 'INVITED',
      source: 'invited',
      quoteStatus: null,
      quoteNote: 'Invited by TM — has not opened the project yet.',
      priceMultiplier: 1,
      signal: 'none',
      tier: 'watch',
      evidence: [
        { when: '3 days ago', what: 'Colin Farrelly invited Ohio Valley Sitework' },
        { when: '—', what: 'No quote started' },
      ],
    },
    {
      id: 'opp-bluegrass',
      tabLabel: 'Bluegrass Irrigation',
      companyName: 'Bluegrass Irrigation',
      opportunityStatus: 'ACTIVE OPPORTUNITY',
      source: 'interested',
      quoteStatus: 'QUOTE DRAFTED',
      quoteNote: 'Customer showed interest — draft quote in TM review queue.',
      priceMultiplier: 1,
      signal: 'review-submitted-quote',
      tier: 'now',
      evidence: [
        { when: '5 days ago', what: 'Bluegrass Irrigation expressed interest' },
        { when: '2 days ago', what: 'Commercial Services completed takeoff' },
        { when: 'today', what: 'Draft quote ready for TM review' },
      ],
    },
    {
      id: 'opp-wabash',
      tabLabel: 'Wabash Valley',
      companyName: 'Wabash Valley Landscape',
      opportunityStatus: 'ACTIVE OPPORTUNITY',
      source: 'interested',
      quoteStatus: 'QUOTE SENT',
      quoteNote: 'Alternate spec package — value-engineered rotor layout.',
      priceMultiplier: 0.92,
      signal: 'follow-up-idle-quote',
      tier: 'week',
      evidence: [
        { when: 'a week ago', what: 'Wabash Valley expressed interest' },
        { when: '4 days ago', what: 'Quote shared — different item mix than Bluegrass' },
        { when: 'today', what: 'Customer has not responded' },
      ],
    },
  ],
  '#AUT-26-89414': [
    {
      id: 'opp-hpta',
      tabLabel: 'HPTA',
      companyName: 'HERITAGE PLUS TEST ACCOUNT',
      opportunityStatus: 'ACTIVE OPPORTUNITY',
      source: 'bidder',
      quoteStatus: 'QUOTE DRAFTED',
      quoteNote: 'Primary bidder on private project.',
      priceMultiplier: 1,
      signal: 'approve-quote',
      tier: 'now',
      evidence: [
        { when: '21 days ago', what: 'Project created for HPTA' },
        { when: 'today', what: 'Awaiting customer quote approval' },
      ],
    },
    {
      id: 'opp-circle',
      tabLabel: 'Circle City',
      companyName: 'Circle City Irrigation',
      opportunityStatus: 'INVITED',
      source: 'invited',
      quoteStatus: null,
      quoteNote: 'Second bidder invited for competitive bid.',
      priceMultiplier: 1,
      signal: 'none',
      tier: 'watch',
      evidence: [
        { when: '2 days ago', what: 'TM invited Circle City as +Bidder' },
        { when: '—', what: 'Not yet accepted' },
      ],
    },
  ],
  '#TED-2613042': [
    {
      id: 'opp-uqc',
      tabLabel: 'Unique Quality',
      companyName: 'UNIQUE QUALITY CONSTRUCTION',
      opportunityStatus: 'ACTIVE OPPORTUNITY',
      source: 'bidder',
      quoteStatus: 'Design In Progress',
      quoteNote: 'Taper design package in progress.',
      priceMultiplier: 1,
      signal: 'build-taper-design-spec',
      tier: 'week',
      evidence: [{ when: 'TED', what: 'Primary bidder on ROCKVILLE ELEMENTARY' }],
    },
    {
      id: 'opp-skyline',
      tabLabel: 'Skyline Roofing',
      companyName: 'SKYLINE ROOFING INC',
      opportunityStatus: 'INVITED',
      source: 'invited',
      quoteStatus: null,
      quoteNote: 'Invited via + Bidder — reviewing plans.',
      priceMultiplier: 1.05,
      signal: 'none',
      tier: 'watch',
      evidence: [{ when: 'yesterday', what: 'Invited as second bidder' }],
    },
  ],
}

const TEMPLATE_QUOTES: Record<TriageProject['template'], QuoteGroup[]> = {
  IRRIGATION: QUOTE_GROUPS,
  AQUATICS: QUOTE_GROUPS,
  'WATER FEATURE': QUOTE_GROUPS,
  ROOFING: QUOTE_GROUPS,
}

export function getOpportunitiesForProject(p: TriageProject): ProjectOpportunity[] {
  const mapped = PROJECT_OPPORTUNITIES[p.num]
  if (mapped?.length) return mapped
  if (p.contractor && !p.contractor.startsWith('—')) {
    return [syntheticOpportunityFromProject(p)]
  }
  return []
}

function syntheticOpportunityFromProject(p: TriageProject): ProjectOpportunity {
  const hasQuote = ['QUOTE', 'QUOTED', 'ORDER', 'WON', 'LOST', 'AWARDED', 'COMMITTED'].some((h) =>
    p.status.includes(h),
  )
  return {
    id: 'opp-primary',
    tabLabel: p.contractor.length > 22 ? p.contractor.slice(0, 20) + '…' : p.contractor,
    companyName: p.contractor,
    opportunityStatus: p.status,
    source: 'bidder',
    quoteStatus: hasQuote ? p.status : null,
    quoteNote: hasQuote ? 'Quote on file for this bidder.' : 'No quote yet.',
    priceMultiplier: 1,
    signal: p.signal,
    tier: p.tier,
    evidence: p.evidence,
  }
}

export function findOpportunity(project: TriageProject, opportunityId: string | null): ProjectOpportunity | null {
  const list = getOpportunitiesForProject(project)
  if (!list.length) return null
  if (!opportunityId) return list[0]
  return list.find((o) => o.id === opportunityId) ?? list[0]
}

export function quoteLineItemsForOpportunity(
  opp: ProjectOpportunity,
  template: TriageProject['template'],
): QuoteGroup[] | null {
  if (!opp.quoteStatus) return null
  const base = TEMPLATE_QUOTES[template]
  if (!base) return null
  const m = opp.priceMultiplier
  return base.map((g) => ({
    ...g,
    items: g.items.map((i) => ({
      ...i,
      price: Math.round(i.price * m * 100) / 100,
      notes: m !== 1 && i === g.items[0] ? `Bidder variant (${Math.round(m * 100)}% of base)` : i.notes,
    })),
  }))
}

export function opportunityQuoteSummary(opp: ProjectOpportunity, projectNum: string) {
  if (!opp.quoteStatus) return null
  return {
    label: `Quote — ${opp.companyName}`,
    status: opp.quoteStatus,
    note: opp.quoteNote,
    opportunityId: opp.id,
    projectNum,
  }
}
