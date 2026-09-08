import { PROJECT, nextActor, type ProjectStage } from '@/data/sampleData'

export type TriagePersonaKey = 'customer' | 'tm' | 'est'
export type Tier = 'now' | 'week' | 'watch' | 'calm'
export type BoardStage = 'leads' | 'progress' | 'complete'

export interface Evidence {
  when: string
  what: string
}

/**
 * Every action a persona is responsible for, owned by exactly one persona.
 * Replaces the earlier generic 6-signal model — each row's `signal` now maps
 * directly to one concrete action on one concrete desk.
 */
export type SignalKey =
  // Customer
  | 'upload-plans'
  | 'approve-substitutions'
  | 'credit-application'
  | 'approve-quote'
  | 'report-bid-outcome'
  | 'reapprove-expired-pricing'
  | 'schedule-delivery'
  // Territory Manager
  | 'review-submitted-quote'
  | 'requote-expired-pricing'
  | 'resolve-flagged-items'
  | 'follow-up-idle-quote'
  | 'approve-sales-order'
  | 'review-at-risk-account'
  // Commercial Services
  | 'accept-decline-takeoff'
  | 'flag-missing-docs'
  | 'assign-estimator'
  | 'build-assembly-spec'
  | 'compile-submittal'
  // Commercial Services — Roofing (taper design workflow)
  | 'accept-decline-taper-request'
  | 'build-taper-design-spec'
  // No action owed
  | 'none'

export interface TriageProject {
  num: string
  name: string
  city: string
  contractor: string
  days: number
  bidLabel: string
  status: string
  template: 'IRRIGATION' | 'AQUATICS' | 'WATER FEATURE' | 'ROOFING'
  vis: 'Public' | 'Private'
  stage: BoardStage
  signal: SignalKey
  tier: Tier
  evidence: Evidence[]
  /** Public discovery lead in a customer's search radius — not yet invited or interested. */
  leadType?: 'discovery' | 'request'
  /** Company ids (see `customers.ts`) that see this in New Leads. */
  discoveryFor?: string[]
}

export interface SignalCopy {
  chip: string
  why: string
  act: string
  csq: string
  owner: TriagePersonaKey | null
}

export const SIGNALS: Record<SignalKey, SignalCopy> = {
  'upload-plans': {
    chip: 'Plans needed', why: 'Plans or specs not yet uploaded', act: 'Upload plans/specs', owner: 'customer',
    csq: "Commercial Services can't start the takeoff without them — the clock on your bid date is already running.",
  },
  'approve-substitutions': {
    chip: 'Substitution pending', why: 'Item substitution awaiting your OK', act: 'Approve or reject substitution', owner: 'customer',
    csq: 'The original item is on backorder. Your call keeps the order moving instead of stalling at the warehouse.',
  },
  'credit-application': {
    chip: 'Credit application', why: 'Credit application incomplete', act: 'Complete credit application', owner: 'customer',
    csq: "Nothing ships on terms until this clears — it's the last thing standing between a quote and an order.",
  },
  'approve-quote': {
    chip: 'Quote ready', why: 'Draft quote ready for your review', act: 'Review and approve quote', owner: 'customer',
    csq: 'Your rep is holding pricing until you weigh in — every day here is a day off your bid prep.',
  },
  'report-bid-outcome': {
    chip: 'Outcome needed', why: 'Bid outcome not yet reported', act: 'Report bid outcome', owner: 'customer',
    csq: "Heritage can't plan material or pricing for your next job until this one's closed out.",
  },
  'reapprove-expired-pricing': {
    chip: 'Pricing expired', why: 'Quoted pricing has expired', act: 'Re-approve expired pricing', owner: 'customer',
    csq: 'Costs move. The longer this sits, the more likely the number changes on you.',
  },
  'schedule-delivery': {
    chip: 'Delivery to schedule', why: 'First delivery not yet scheduled', act: 'Schedule first delivery', owner: 'customer',
    csq: "Material's ready to ship — the job can't start until a date's on the calendar.",
  },
  'review-submitted-quote': {
    chip: 'Quote to review', why: 'Quote submitted — customer is waiting', act: 'Review submitted quote', owner: 'tm',
    csq: "Commercial Services built it and handed it off. Every hour it sits here is an hour the customer doesn't have pricing.",
  },
  'requote-expired-pricing': {
    chip: 'Pricing expired', why: 'Quoted pricing has expired', act: 'Re-quote expired pricing', owner: 'tm',
    csq: "The customer can't approve a number that's no longer valid — this blocks everything downstream.",
  },
  'resolve-flagged-items': {
    chip: 'Items flagged', why: 'Line items flagged for review', act: 'Resolve flagged line items', owner: 'tm',
    csq: "The quote can't go back out until these are cleared — margin or spec issues don't fix themselves.",
  },
  'follow-up-idle-quote': {
    chip: 'Quote gone quiet', why: 'Quote shared — customer gone idle', act: 'Follow up on idle quote', owner: 'tm',
    csq: "Silence isn't a no. It's usually a maybe that needs a nudge before it becomes someone else's order.",
  },
  'approve-sales-order': {
    chip: 'Order to approve', why: 'Sales order pending your approval', act: 'Approve pending sales order', owner: 'tm',
    csq: "The customer's ready to buy. This is the only thing standing between an approved quote and a booked order.",
  },
  'review-at-risk-account': {
    chip: 'Account at risk', why: 'Account volume trending down', act: 'Review at-risk account', owner: 'tm',
    csq: 'Declining volume rarely reverses on its own — a check-in now costs less than a lost account later.',
  },
  'accept-decline-takeoff': {
    chip: 'New request', why: 'Takeoff request awaiting response', act: 'Accept or decline takeoff request', owner: 'est',
    csq: 'Nothing else can happen on this job until intake is triaged.',
  },
  'flag-missing-docs': {
    chip: 'Docs incomplete', why: 'Plans, specs, or addenda missing', act: 'Flag missing plans/specs', owner: 'est',
    csq: "Guessing at scope now means rework later — flag it before it's queued for takeoff.",
  },
  'assign-estimator': {
    chip: 'Needs assignment', why: 'Accepted request not yet assigned', act: 'Assign to estimator', owner: 'est',
    csq: "It's accepted but idle — nothing moves until it's on someone's desk.",
  },
  'build-assembly-spec': {
    chip: 'Spec in progress', why: 'Assembly or system spec not yet built', act: 'Build assembly/system spec', owner: 'est',
    csq: "The quote can't be priced until the spec defines what's actually being bid.",
  },
  'compile-submittal': {
    chip: 'Submittal owed', why: 'Submittal package requested, not compiled', act: 'Compile submittal package', owner: 'est',
    csq: "The contractor needs this to include in their own bid — it's on the clock same as the quote.",
  },
  'accept-decline-taper-request': {
    chip: 'New request', why: 'Taper design request awaiting response', act: 'Accept or decline taper request', owner: 'est',
    csq: 'Nothing else can happen on this roof until intake is triaged.',
  },
  'build-taper-design-spec': {
    chip: 'Taper design in progress', why: 'Taper design spec not yet created', act: 'Create & upload taper design spec', owner: 'est',
    csq: "The quote can't be priced until slope and drainage are defined by the taper layout.",
  },
  none: { chip: 'On track', why: 'Moving as expected', act: 'Open project', csq: '', owner: null },
}

export function ownerOf(p: TriageProject): TriagePersonaKey | null {
  return SIGNALS[p.signal].owner
}

/** Demo customer login company — Marcus Webb / Coast Landscape Inc. */
export const CUSTOMER_COMPANY_ID = 'coast-landscape'

/** Project numbers scoped to the Customer persona (owned / invited jobs). */
export const MINE = [
  '#SUP-26-88532', '#AUT-26-88300', '#AQU-26-70026', '#AUT-26-88410',
  '#SUP-26-88999', '#AQU-26-70455', '#WLF-26-88120', PROJECT.id,
]

export function customerSeesProject(p: TriageProject, companyId = CUSTOMER_COMPANY_ID): boolean {
  if (MINE.includes(p.num)) return true
  if (p.leadType === 'discovery' && p.discoveryFor?.includes(companyId)) return true
  return false
}

/** Public discovery leads — one per rostered contractor company in the demo. */
export const DISCOVERY_LEADS: TriageProject[] = [
  {
    num: '#PUB-26-91001', name: 'Safeway #4521 Groundscape', city: 'Elk Grove, CA', contractor: '— open for bidding',
    days: 5, bidLabel: '9/13/2026', status: 'PUBLIC LEAD', template: 'IRRIGATION', vis: 'Public', stage: 'leads',
    leadType: 'discovery', discoveryFor: ['coast-landscape'], signal: 'none', tier: 'week',
    evidence: [{ when: '3 days ago', what: 'Posted to public discovery' }, { when: '—', what: 'Within your Search Jobs In radius' }, { when: 'in 5 days', what: 'Bid date' }],
  },
  {
    num: '#PUB-26-91002', name: 'UC Davis Med Center — South Campus', city: 'Sacramento, CA', contractor: '— open for bidding',
    days: 12, bidLabel: '9/20/2026', status: 'PUBLIC LEAD', template: 'IRRIGATION', vis: 'Public', stage: 'leads',
    leadType: 'discovery', discoveryFor: ['coast-landscape'], signal: 'none', tier: 'watch',
    evidence: [{ when: 'a week ago', what: 'Posted to public discovery' }, { when: '—', what: 'Within your Search Jobs In radius' }, { when: 'in 12 days', what: 'Bid date' }],
  },
  {
    num: '#PUB-26-91003', name: 'Walgreens Pad Site — Hamburg', city: 'Lexington, KY', contractor: '— open for bidding',
    days: 4, bidLabel: '9/12/2026', status: 'PUBLIC LEAD', template: 'IRRIGATION', vis: 'Public', stage: 'leads',
    leadType: 'discovery', discoveryFor: ['ohio-valley-sitework'], signal: 'none', tier: 'now',
    evidence: [{ when: '2 days ago', what: 'Posted to public discovery' }, { when: '—', what: 'No contractor invited yet' }, { when: 'in 4 days', what: 'Bid date' }],
  },
  {
    num: '#PUB-26-91004', name: 'Target Store #1842 Landscape', city: 'Boulder, CO', contractor: '— open for bidding',
    days: 9, bidLabel: '9/17/2026', status: 'PUBLIC LEAD', template: 'IRRIGATION', vis: 'Public', stage: 'leads',
    leadType: 'discovery', discoveryFor: ['front-range-turf'], signal: 'none', tier: 'week',
    evidence: [{ when: '4 days ago', what: 'Posted to public discovery' }, { when: '—', what: 'Within contractor search radius' }, { when: 'in 9 days', what: 'Bid date' }],
  },
  {
    num: '#PUB-26-91005', name: 'Ocean Medical Center — Ambulatory', city: 'Brick, NJ', contractor: '— open for bidding',
    days: 7, bidLabel: '9/15/2026', status: 'PUBLIC LEAD', template: 'AQUATICS', vis: 'Public', stage: 'leads',
    leadType: 'discovery', discoveryFor: ['garden-state-irrigation'], signal: 'none', tier: 'week',
    evidence: [{ when: '3 days ago', what: 'Posted to public discovery' }, { when: '—', what: 'Aquatics package — plans attached' }, { when: 'in 7 days', what: 'Bid date' }],
  },
  {
    num: '#PUB-26-91006', name: 'FedEx Ground Hub — Roof Section B', city: 'Memphis, TN', contractor: '— open for bidding',
    days: 6, bidLabel: '9/14/2026', status: 'PUBLIC LEAD', template: 'ROOFING', vis: 'Public', stage: 'leads',
    leadType: 'discovery', discoveryFor: ['summit-roofing-partners'], signal: 'none', tier: 'week',
    evidence: [{ when: '5 days ago', what: 'Posted to public discovery' }, { when: '—', what: 'Taper design not started' }, { when: 'in 6 days', what: 'Bid date' }],
  },
  {
    num: '#PUB-26-91007', name: 'Panera Bread — Capital Circle', city: 'Tallahassee, FL', contractor: '— open for bidding',
    days: 14, bidLabel: '9/22/2026', status: 'PUBLIC LEAD', template: 'IRRIGATION', vis: 'Public', stage: 'leads',
    leadType: 'discovery', discoveryFor: ['gulf-coast-grounds'], signal: 'none', tier: 'watch',
    evidence: [{ when: 'a week ago', what: 'Posted to public discovery' }, { when: '—', what: 'Within search radius' }, { when: 'in 14 days', what: 'Bid date' }],
  },
  {
    num: '#PUB-26-91008', name: 'Tractor Supply Co. — Georgetown', city: 'Georgetown, KY', contractor: '— open for bidding',
    days: 8, bidLabel: '9/16/2026', status: 'PUBLIC LEAD', template: 'IRRIGATION', vis: 'Public', stage: 'leads',
    leadType: 'discovery', discoveryFor: ['bluegrass-irrigation'], signal: 'none', tier: 'week',
    evidence: [{ when: '4 days ago', what: 'Posted to public discovery' }, { when: '—', what: 'Site plan uploaded' }, { when: 'in 8 days', what: 'Bid date' }],
  },
  {
    num: '#PUB-26-91009', name: 'IU Health West — Entry Plaza', city: 'Indianapolis, IN', contractor: '— open for bidding',
    days: 10, bidLabel: '9/18/2026', status: 'PUBLIC LEAD', template: 'IRRIGATION', vis: 'Public', stage: 'leads',
    leadType: 'discovery', discoveryFor: ['circle-city-irrigation'], signal: 'none', tier: 'week',
    evidence: [{ when: '6 days ago', what: 'Posted to public discovery' }, { when: '—', what: 'No invite sent yet' }, { when: 'in 10 days', what: 'Bid date' }],
  },
  {
    num: '#PUB-26-91010', name: 'Sprouts Farmers Market — Midtown', city: 'Atlanta, GA', contractor: '— open for bidding',
    days: 11, bidLabel: '9/19/2026', status: 'PUBLIC LEAD', template: 'IRRIGATION', vis: 'Public', stage: 'leads',
    leadType: 'discovery', discoveryFor: ['peachtree-grounds'], signal: 'none', tier: 'week',
    evidence: [{ when: '5 days ago', what: 'Posted to public discovery' }, { when: '—', what: 'Within search radius' }, { when: 'in 11 days', what: 'Bid date' }],
  },
  {
    num: '#PUB-26-91011', name: 'Mariano\'s Fresh Market — Naperville', city: 'Naperville, IL', contractor: '— open for bidding',
    days: 15, bidLabel: '9/23/2026', status: 'PUBLIC LEAD', template: 'IRRIGATION', vis: 'Public', stage: 'leads',
    leadType: 'discovery', discoveryFor: ['prairie-land-group'], signal: 'none', tier: 'watch',
    evidence: [{ when: 'a week ago', what: 'Posted to public discovery' }, { when: '—', what: 'Plans available for review' }, { when: 'in 15 days', what: 'Bid date' }],
  },
  {
    num: '#PUB-26-91012', name: 'Goodwill Superstore — Vincennes', city: 'Vincennes, IN', contractor: '— open for bidding',
    days: 13, bidLabel: '9/21/2026', status: 'PUBLIC LEAD', template: 'IRRIGATION', vis: 'Public', stage: 'leads',
    leadType: 'discovery', discoveryFor: ['wabash-valley-landscape'], signal: 'none', tier: 'watch',
    evidence: [{ when: '6 days ago', what: 'Posted to public discovery' }, { when: '—', what: 'No contractor invited yet' }, { when: 'in 13 days', what: 'Bid date' }],
  },
  {
    num: '#PUB-26-91013', name: 'H-E-B Fuel Station — Kingwood', city: 'Kingwood, TX', contractor: '— open for bidding',
    days: 6, bidLabel: '9/14/2026', status: 'PUBLIC LEAD', template: 'WATER FEATURE', vis: 'Public', stage: 'leads',
    leadType: 'discovery', discoveryFor: ['brazos-site-services'], signal: 'none', tier: 'week',
    evidence: [{ when: '3 days ago', what: 'Posted to public discovery' }, { when: '—', what: 'Fountain package — specs attached' }, { when: 'in 6 days', what: 'Bid date' }],
  },
  {
    num: '#PUB-26-91014', name: 'Lifetime Fitness — Eden Prairie', city: 'Eden Prairie, MN', contractor: '— open for bidding',
    days: 18, bidLabel: '9/26/2026', status: 'PUBLIC LEAD', template: 'IRRIGATION', vis: 'Public', stage: 'leads',
    leadType: 'discovery', discoveryFor: ['twin-cities-green'], signal: 'none', tier: 'watch',
    evidence: [{ when: '8 days ago', what: 'Posted to public discovery' }, { when: '—', what: 'Within search radius' }, { when: 'in 18 days', what: 'Bid date' }],
  },
  {
    num: '#PUB-26-91015', name: 'Nissan Dealership — Cool Springs', city: 'Franklin, TN', contractor: '— open for bidding',
    days: 9, bidLabel: '9/17/2026', status: 'PUBLIC LEAD', template: 'ROOFING', vis: 'Public', stage: 'leads',
    leadType: 'discovery', discoveryFor: ['apex-commercial-roofing'], signal: 'none', tier: 'week',
    evidence: [{ when: '4 days ago', what: 'Posted to public discovery' }, { when: '—', what: 'TPO reroof — public lead' }, { when: 'in 9 days', what: 'Bid date' }],
  },
  {
    num: '#PUB-26-91016', name: 'Dollar General #18442 — Folsom', city: 'Folsom, CA', contractor: '— open for bidding',
    days: 3, bidLabel: '9/11/2026', status: 'PUBLIC LEAD', template: 'IRRIGATION', vis: 'Public', stage: 'leads',
    leadType: 'discovery', discoveryFor: ['coast-landscape'], signal: 'none', tier: 'now',
    evidence: [{ when: 'yesterday', what: 'Posted to public discovery' }, { when: '—', what: 'Within your Search Jobs In radius' }, { when: 'in 3 days', what: 'Bid date' }],
  },
]

/** Static, high-fidelity filler dataset — re-authored around the Heritage+ GRIDS+ commercial quoting workflow. */
export const STATIC_PROJECTS: TriageProject[] = [
  { num: '#SUP-26-88532', name: 'Kroger Marketplace #4411 Refresh', city: 'Louisville, KY', contractor: 'Ohio Valley Sitework', days: 1, bidLabel: '8/18/2026', status: 'NEW REQUEST', template: 'IRRIGATION', vis: 'Private', stage: 'leads', signal: 'accept-decline-takeoff', tier: 'now',
    evidence: [{ when: '6 days ago', what: 'Takeoff request submitted by Ohio Valley Sitework' }, { when: '5 days ago', what: 'Commercial Services opened the request' }, { when: 'today', what: 'Still pending accept/decline — bid closes tomorrow' }] },
  { num: '#CPS-25-46436', name: 'Denver Tech Center Plaza', city: 'Denver, CO', contractor: 'Front Range Turf', days: 2, bidLabel: '8/19/2026', status: 'QUOTE DRAFTED', template: 'IRRIGATION', vis: 'Private', stage: 'progress', signal: 'approve-quote', tier: 'now',
    evidence: [{ when: '11 days ago', what: 'Takeoff completed by Commercial Services' }, { when: '9 days ago', what: 'Draft quote shared for review' }, { when: 'today', what: 'Not yet approved with 2 days left' }] },
  { num: '#AQU-26-88651', name: 'Longhorn Steakhouse Stafford', city: 'Stafford, VA', contractor: '— no contractor invited', days: 2, bidLabel: '8/19/2026', status: 'MISSING DOCS', template: 'AQUATICS', vis: 'Public', stage: 'leads', signal: 'upload-plans', tier: 'now',
    evidence: [{ when: '4 days ago', what: 'Project created — no plans attached' }, { when: '—', what: 'Commercial Services flagged the gap' }, { when: 'today', what: 'Takeoff blocked until plans are uploaded' }] },
  { num: '#CPS-26-78694', name: 'Riverbend Apartments Phase 2', city: 'Westminster, CO', contractor: 'Front Range Turf', days: 4, bidLabel: '8/21/2026', status: 'QUOTE SENT', template: 'IRRIGATION', vis: 'Private', stage: 'progress', signal: 'follow-up-idle-quote', tier: 'now',
    evidence: [{ when: '8 days ago', what: 'Quote shared with Front Range Turf' }, { when: '7 days ago', what: 'Quote opened, no response since' }, { when: 'today', what: 'Gone quiet with 4 days to bid' }] },
  { num: '#AQU-26-70026', name: '15 Progress Place', city: 'Lakewood, NJ', contractor: 'Garden State Irrigation', days: -210, bidLabel: '1/19/2026', status: 'ORDER PENDING', template: 'IRRIGATION', vis: 'Private', stage: 'complete', signal: 'approve-sales-order', tier: 'now',
    evidence: [{ when: '9 days ago', what: 'Customer approved the quote' }, { when: '9 days ago', what: 'Sales order created, pending approval' }, { when: 'today', what: 'Booked revenue sitting unapproved' }] },
  { num: '#AUT-26-88300', name: 'Chick-fil-A FSU 04217', city: 'Tallahassee, FL', contractor: 'Gulf Coast Grounds', days: -20, bidLabel: '7/28/2026', status: 'AWARDED', template: 'IRRIGATION', vis: 'Private', stage: 'progress', signal: 'report-bid-outcome', tier: 'now',
    evidence: [{ when: '20 days ago', what: 'Contractor was awarded the job' }, { when: '14 days ago', what: 'Rep asked for the outcome' }, { when: 'today', what: 'Won/Lost still unreported — forecast is wrong until you set it' }] },

  { num: '#WLF-26-88905', name: 'Texas Roadhouse - Frankfort', city: 'Frankfort, KY', contractor: 'Bluegrass Irrigation', days: 11, bidLabel: '8/28/2026', status: 'NEW REQUEST', template: 'IRRIGATION', vis: 'Public', stage: 'leads', signal: 'assign-estimator', tier: 'week',
    evidence: [{ when: '4 days ago', what: 'Takeoff request accepted' }, { when: '—', what: 'Not yet assigned to an estimator' }, { when: 'in 11 days', what: 'Bid date' }] },
  { num: '#AUT-26-88410', name: 'St. Vincent Outpatient Campus', city: 'Indianapolis, IN', contractor: 'Circle City Irrigation', days: 8, bidLabel: '8/25/2026', status: 'IN TAKEOFF', template: 'IRRIGATION', vis: 'Private', stage: 'progress', signal: 'build-assembly-spec', tier: 'week',
    evidence: [{ when: '3 days ago', what: 'Assigned to estimator' }, { when: '2 days ago', what: 'Assembly spec started' }, { when: 'in 8 days', what: 'Bid date' }] },
  { num: '#SUP-26-71204', name: 'Whole Foods — Buckhead', city: 'Atlanta, GA', contractor: 'Peachtree Grounds', days: 18, bidLabel: '9/4/2026', status: 'SUBMITTAL OWED', template: 'IRRIGATION', vis: 'Private', stage: 'progress', signal: 'compile-submittal', tier: 'week',
    evidence: [{ when: '5 days ago', what: 'Contractor requested a submittal package' }, { when: '—', what: 'Not yet compiled' }, { when: 'in 18 days', what: 'Bid date' }] },
  { num: '#SUP-25-63773', name: 'The Home Depot — LAA Expansion', city: 'Atlanta, GA', contractor: 'Peachtree Grounds', days: -298, bidLabel: '10/23/2025', status: 'AT RISK', template: 'IRRIGATION', vis: 'Private', stage: 'complete', signal: 'review-at-risk-account', tier: 'week',
    evidence: [{ when: '10 months ago', what: 'Last order placed' }, { when: '3 months ago', what: 'Order volume began declining' }, { when: 'today', what: 'No activity since — largest account showing risk' }] },
  { num: '#SUP-26-88999', name: 'Costco Wholesale #1188', city: 'Naperville, IL', contractor: 'Prairie Land Group', days: 3, bidLabel: '8/20/2026', status: 'PRICING EXPIRED', template: 'IRRIGATION', vis: 'Private', stage: 'progress', signal: 'reapprove-expired-pricing', tier: 'week',
    evidence: [{ when: '6 days ago', what: 'Quote sent' }, { when: '2 days ago', what: 'Quoted pricing expired' }, { when: 'in 3 days', what: 'Bid date' }] },

  { num: '#AUT-26-88920', name: 'New Center for Health Sciences', city: 'Vincennes, IN', contractor: 'Wabash Valley Landscape', days: 16, bidLabel: '9/2/2026', status: 'CREDIT PENDING', template: 'IRRIGATION', vis: 'Public', stage: 'leads', signal: 'credit-application', tier: 'watch',
    evidence: [{ when: '4 days ago', what: 'New account — credit application started' }, { when: '—', what: 'Not yet completed' }, { when: 'in 16 days', what: 'Bid date' }] },
  { num: '#AUT-26-88919', name: 'Longhorn Steakhouse / Corydon', city: 'Corydon, IN', contractor: '— no contractor invited', days: 16, bidLabel: '9/2/2026', status: 'FLAGGED', template: 'IRRIGATION', vis: 'Public', stage: 'leads', signal: 'resolve-flagged-items', tier: 'watch',
    evidence: [{ when: '4 days ago', what: 'Quote drafted before contractor was invited' }, { when: '—', what: 'One line item flagged for spec review' }, { when: 'in 16 days', what: 'Bid date' }] },
  { num: '#AQU-26-70455', name: 'Lakewood HS Athletic Fields', city: 'Lakewood, NJ', contractor: 'Garden State Irrigation', days: 32, bidLabel: '9/18/2026', status: 'NEW REQUEST', template: 'AQUATICS', vis: 'Public', stage: 'leads', signal: 'none', tier: 'watch',
    evidence: [{ when: '2 days ago', what: 'Takeoff request accepted' }, { when: '—', what: 'Plenty of runway' }, { when: 'in 32 days', what: 'Bid date' }] },
  { num: '#WLF-26-87330', name: 'Publix at Kingwood', city: 'Kingwood, TX', contractor: 'Brazos Site Services', days: 39, bidLabel: '9/25/2026', status: 'IN TAKEOFF', template: 'WATER FEATURE', vis: 'Public', stage: 'leads', signal: 'none', tier: 'watch',
    evidence: [{ when: 'a week ago', what: 'Assigned to estimator' }, { when: '—', what: 'No action needed yet' }, { when: 'in 39 days', what: 'Bid date' }] },

  { num: '#WLF-26-88120', name: 'Baylor Scott & White MOB', city: 'Waco, TX', contractor: 'Brazos Site Services', days: 25, bidLabel: '9/11/2026', status: 'QUOTED', template: 'IRRIGATION', vis: 'Private', stage: 'progress', signal: 'none', tier: 'calm',
    evidence: [{ when: 'a week ago', what: 'Quote approved and sent' }, { when: '—', what: 'Waiting on owner schedule' }, { when: 'in 25 days', what: 'Bid date' }] },
  { num: '#HLS-25-67617', name: 'Wings Credit Union', city: 'Eden Prairie, MN', contractor: 'Twin Cities Green LLC', days: -241, bidLabel: '12/19/2025', status: 'LOST', template: 'IRRIGATION', vis: 'Private', stage: 'complete', signal: 'none', tier: 'calm',
    evidence: [{ when: '8 months ago', what: 'Bid submitted' }, { when: '7 months ago', what: 'Lost — priced by another supplier' }, { when: '—', what: 'Closed out' }] },
  { num: '#AQU-25-70011', name: '15 Progress Place — Phase 1', city: 'Lakewood, NJ', contractor: 'Garden State Irrigation', days: -330, bidLabel: '9/21/2025', status: 'WON', template: 'IRRIGATION', vis: 'Private', stage: 'complete', signal: 'none', tier: 'calm',
    evidence: [{ when: '11 months ago', what: 'Won and shipped' }, { when: '—', what: 'Fully invoiced' }, { when: '—', what: 'Closed out' }] },

  // Roofing — taper design workflow (Commercial Services builds a tapered insulation spec instead of a generic takeoff)
  { num: '#RFG-26-90210', name: 'Kroger Distribution Center Reroof', city: 'Memphis, TN', contractor: 'Summit Roofing Partners', days: 3, bidLabel: '8/22/2026', status: 'NEW REQUEST', template: 'ROOFING', vis: 'Public', stage: 'leads', signal: 'accept-decline-taper-request', tier: 'now',
    evidence: [{ when: '2 days ago', what: 'Taper design request submitted by Summit Roofing Partners' }, { when: '—', what: 'Not yet accepted' }, { when: 'today', what: 'Bid closes in 3 days — still pending triage' }] },
  { num: '#RFG-26-90344', name: 'Costco Warehouse #22 TPO Replacement', city: 'Nashville, TN', contractor: 'Apex Commercial Roofing', days: 9, bidLabel: '8/28/2026', status: 'TAPER DESIGN IN PROGRESS', template: 'ROOFING', vis: 'Private', stage: 'progress', signal: 'build-taper-design-spec', tier: 'week',
    evidence: [{ when: '5 days ago', what: 'Taper design request accepted' }, { when: '3 days ago', what: 'Assigned to estimator' }, { when: 'today', what: 'Taper design spec not yet created' }] },
  { num: '#RFG-26-90187', name: 'Home Depot DC Roof Restoration', city: 'Louisville, KY', contractor: 'Summit Roofing Partners', days: 21, bidLabel: '9/9/2026', status: 'SUBMITTAL OWED', template: 'ROOFING', vis: 'Private', stage: 'progress', signal: 'compile-submittal', tier: 'watch',
    evidence: [{ when: 'a week ago', what: 'Taper design spec completed' }, { when: '4 days ago', what: 'Contractor requested a submittal package' }, { when: 'in 21 days', what: 'Bid date' }] },
  { num: '#RFG-25-88760', name: 'Regional Medical Center Reroof', city: 'Nashville, TN', contractor: 'Apex Commercial Roofing', days: -95, bidLabel: '5/12/2026', status: 'WON', template: 'ROOFING', vis: 'Private', stage: 'complete', signal: 'none', tier: 'calm',
    evidence: [{ when: '4 months ago', what: 'Won and shipped' }, { when: '—', what: 'Fully invoiced' }, { when: '—', what: 'Closed out' }] },

  ...DISCOVERY_LEADS,
]

/** Folds our live Riverside Office Park project into the triage dataset. */
export function buildRiversideRecord(stage: ProjectStage, modificationRequested: boolean): TriageProject {
  const acted = nextActor(stage, modificationRequested)
  const byStage: Record<ProjectStage, { status: string; boardStage: BoardStage; signal: SignalKey; evidence: Evidence[] }> = {
    estimating: {
      status: 'IN TAKEOFF', boardStage: 'leads', signal: 'build-assembly-spec',
      evidence: [
        { when: 'Aug 17', what: 'Project submitted by Marcus Webb' },
        { when: 'Aug 17', what: 'Auto-routed to Jordan Lee, Commercial Services' },
        { when: 'today', what: 'Assembly/system spec still in progress' },
      ],
    },
    estimate_complete: {
      status: 'QUOTE DRAFTED', boardStage: 'progress', signal: 'review-submitted-quote',
      evidence: [
        { when: 'Aug 17', what: 'Project submitted by Marcus Webb' },
        { when: 'today', what: 'Jordan Lee submitted the quote' },
        { when: 'today', what: 'Colin Farrelly has not reviewed it yet' },
      ],
    },
    quote_shared: {
      status: modificationRequested ? 'FLAGGED' : 'QUOTE SENT', boardStage: 'progress',
      signal: modificationRequested ? 'resolve-flagged-items' : 'approve-quote',
      evidence: [
        { when: 'Aug 17', what: 'Colin Farrelly shared Quote 1 with the customer' },
        { when: 'today', what: modificationRequested ? 'Marcus Webb requested a modification' : 'Awaiting customer review' },
        { when: 'today', what: modificationRequested ? 'Revised quote not yet re-shared' : 'Quote expires in 30 days' },
      ],
    },
    accepted: {
      status: 'WON', boardStage: 'complete', signal: 'none',
      evidence: [
        { when: 'Aug 17', what: 'Quote shared with the customer' },
        { when: 'today', what: 'Customer accepted & purchased' },
        { when: 'today', what: 'Order routed to Agility for fulfillment' },
      ],
    },
  }
  const meta = byStage[stage]
  return {
    num: PROJECT.id,
    name: `${PROJECT.name} — ${PROJECT.subtitle}`,
    city: 'Sacramento, CA',
    contractor: PROJECT.customer.company,
    days: 35,
    bidLabel: PROJECT.bidDate,
    status: meta.status,
    template: 'IRRIGATION',
    vis: 'Private',
    stage: meta.boardStage,
    signal: meta.signal,
    tier: acted ? 'now' : 'calm',
    evidence: meta.evidence,
  }
}

export interface SavedView {
  key: string
  label: string
  dot: string
}

export interface PersonaConfig {
  role: string
  name: string
  desk: string
  deskSub: string
  footer: string
  scope: (p: TriageProject) => boolean
  contractorFilter: boolean
  headline: (n: number) => string
  groups: [string, string][]
  views: SavedView[]
}

export const PERSONAS: Record<TriagePersonaKey, PersonaConfig> = {
  customer: {
    role: 'Customer', name: PROJECT.customer.contact, desk: 'Ohio Valley Sitework', deskSub: 'My projects',
    footer: `Signed in as ${PROJECT.customer.contact}`, scope: (p) => customerSeesProject(p), contractorFilter: false,
    headline: (n) => (n ? n + ' waiting on you' : 'Nothing waiting on you'),
    groups: [['Waiting on you', "Heritage can't move until you do"], ['Due this week', 'Comfortable if you start now'], ['No action needed', 'Yours, nothing owed'], ['Closed', 'Done and dusted']],
    views: [
      { key: 'queue', label: 'Waiting on me', dot: 'oklch(0.68 0.17 52)' },
      { key: 'upload-plans', label: 'Plans/specs to upload', dot: 'oklch(0.75 0.13 75)' },
      { key: 'approve-substitutions', label: 'Substitutions to review', dot: 'oklch(0.75 0.13 75)' },
      { key: 'credit-application', label: 'Credit application', dot: 'oklch(0.6 0.14 300)' },
      { key: 'approve-quote', label: 'Quotes to approve', dot: 'oklch(0.68 0.17 52)' },
      { key: 'reapprove-expired-pricing', label: 'Expired pricing', dot: 'oklch(0.56 0.18 25)' },
      { key: 'schedule-delivery', label: 'Deliveries to schedule', dot: 'oklch(0.6 0.1 168)' },
      { key: 'all', label: 'All my projects', dot: 'oklch(0.7 0.01 255)' },
    ],
  },
  tm: {
    role: 'Territory Manager', name: PROJECT.tm.name, desk: 'GRIDS+', deskSub: 'Territory — OH/KY/IN',
    footer: `Signed in as ${PROJECT.tm.name}`, scope: () => true, contractorFilter: true,
    headline: (n) => (n ? n + ' need you today' : 'Nothing needs you today'),
    groups: [['Act today', 'Consequences land inside 48 hours'], ['This week', 'Still fixable with a nudge'], ['Watching', 'No action needed yet — here so nothing hides'], ['Settled', 'Closed out, kept for search']],
    views: [
      { key: 'queue', label: 'My queue', dot: 'oklch(0.68 0.17 52)' },
      { key: 'review-submitted-quote', label: 'Quotes to review', dot: 'oklch(0.68 0.17 52)' },
      { key: 'requote-expired-pricing', label: 'Expired pricing', dot: 'oklch(0.56 0.18 25)' },
      { key: 'resolve-flagged-items', label: 'Flagged line items', dot: 'oklch(0.75 0.13 75)' },
      { key: 'follow-up-idle-quote', label: 'Idle quotes', dot: 'oklch(0.75 0.13 75)' },
      { key: 'approve-sales-order', label: 'Orders to approve', dot: 'oklch(0.6 0.1 168)' },
      { key: 'review-at-risk-account', label: 'At-risk accounts', dot: 'oklch(0.6 0.14 300)' },
      { key: 'all', label: 'All projects', dot: 'oklch(0.7 0.01 255)' },
    ],
  },
  est: {
    role: 'Commercial Services', name: PROJECT.estimator.name, desk: 'GRIDS+', deskSub: 'Commercial Services desk',
    footer: `Signed in as ${PROJECT.estimator.name}`, scope: () => true, contractorFilter: true,
    headline: (n) => (n ? n + ' due on the desk today' : 'Desk is clear today'),
    groups: [['On the clock', 'Bid dates you can still hit'], ["This week's board", 'Schedule it before it turns red'], ['Not started', 'Sized but not queued'], ['Off the board', 'Delivered or closed']],
    views: [
      { key: 'queue', label: 'My queue', dot: 'oklch(0.68 0.17 52)' },
      { key: 'accept-decline-takeoff', label: 'Takeoff requests', dot: 'oklch(0.68 0.17 52)' },
      { key: 'accept-decline-taper-request', label: 'Taper design requests', dot: 'oklch(0.68 0.17 52)' },
      { key: 'flag-missing-docs', label: 'Missing docs', dot: 'oklch(0.56 0.18 25)' },
      { key: 'assign-estimator', label: 'Needs assignment', dot: 'oklch(0.75 0.13 75)' },
      { key: 'build-assembly-spec', label: 'Specs in progress', dot: 'oklch(0.6 0.14 300)' },
      { key: 'build-taper-design-spec', label: 'Taper designs in progress', dot: 'oklch(0.6 0.14 300)' },
      { key: 'compile-submittal', label: 'Submittals owed', dot: 'oklch(0.75 0.13 75)' },
      { key: 'all', label: 'All projects', dot: 'oklch(0.7 0.01 255)' },
    ],
  },
}

export interface Rec {
  move: string
  line: string
}

/** Only the actions that genuinely warrant a phone call get a script. */
export const RECS: Partial<Record<SignalKey, Rec>> = {
  'follow-up-idle-quote': { move: 'Call to check on the decision', line: '"Just following up on the quote we sent — any questions before you move forward?"' },
  'review-at-risk-account': { move: 'Call to check in before volume slips further', line: '"Noticed order volume\'s been down the last couple months — everything okay on your end?"' },
}

export interface TierPalette {
  spine: string
  border: string
  why: string
  clock: string
  shadow: string
}

export const TIERS: Record<Tier, TierPalette> = {
  now: { spine: 'oklch(0.56 0.18 25)', border: 'oklch(0.88 0.05 25)', why: 'oklch(0.5 0.17 25)', clock: 'oklch(0.5 0.17 25)', shadow: '0 1px 3px oklch(0.56 0.18 25 / .12)' },
  week: { spine: 'oklch(0.75 0.13 75)', border: 'oklch(0.92 0.02 80)', why: 'oklch(0.5 0.1 70)', clock: 'oklch(0.45 0.09 70)', shadow: '0 1px 2px oklch(0.5 0.02 255 / .05)' },
  watch: { spine: 'oklch(0.86 0.01 255)', border: 'oklch(0.93 0.006 255)', why: 'oklch(0.5 0.015 255)', clock: 'oklch(0.42 0.02 255)', shadow: 'none' },
  calm: { spine: 'oklch(0.7 0.08 168)', border: 'oklch(0.93 0.006 255)', why: 'oklch(0.45 0.08 168)', clock: 'oklch(0.45 0.02 255)', shadow: 'none' },
}

export const GROUP_TITLE_COLORS = ['oklch(0.5 0.17 25)', 'oklch(0.42 0.09 70)', 'oklch(0.42 0.02 255)', 'oklch(0.4 0.07 168)']

const ALL_SIGNAL_KEYS = Object.keys(SIGNALS) as SignalKey[]

/** One predicate per signal (view key === signal id) plus the generic cross-cutting views. */
export const MATCH: Record<string, (p: TriageProject) => boolean> = {
  ...Object.fromEntries(ALL_SIGNAL_KEYS.map((k) => [k, (p: TriageProject) => p.signal === k])),
  closing: (p) => p.days >= 0 && p.days <= 7,
  all: () => true,
}

/** "My queue" is owner-aware: only this persona's own actionable items, inside the urgent tiers. */
export function queueMatch(personaKey: TriagePersonaKey): (p: TriageProject) => boolean {
  return (p) => (p.tier === 'now' || p.tier === 'week') && ownerOf(p) === personaKey
}

export function urgencyRank(a: TriageProject, b: TriageProject): number {
  const up = (p: TriageProject) => p.days >= 0
  if (up(a) !== up(b)) return up(a) ? -1 : 1
  return a.days - b.days
}

export function clock(p: TriageProject): { clock: string; sub: string } {
  if (p.days < 0) {
    const d = Math.abs(p.days)
    return d > 60 ? { clock: Math.round(d / 30) + 'mo', sub: 'overdue' } : { clock: d + 'd', sub: 'overdue' }
  }
  if (p.days === 0) return { clock: 'today', sub: 'bid closes' }
  if (p.days === 1) return { clock: '1d', sub: 'until bid' }
  return { clock: p.days + 'd', sub: 'until bid' }
}

export function matchQuery(p: TriageProject, q: string): boolean {
  if (!q) return true
  const hay = (p.name + ' ' + p.num + ' ' + p.contractor + ' ' + p.city + ' ' + p.status).toLowerCase()
  return q
    .toLowerCase()
    .split(/\s+/)
    .every((w) => hay.includes(w))
}

export type BidWindow = 'any' | '48h' | '7d' | '30d' | 'past'

export function matchWindow(p: TriageProject, w: BidWindow): boolean {
  if (w === 'any') return true
  if (w === '48h') return p.days >= 0 && p.days <= 2
  if (w === '7d') return p.days >= 0 && p.days <= 7
  if (w === '30d') return p.days >= 0 && p.days <= 30
  return p.days < 0
}
