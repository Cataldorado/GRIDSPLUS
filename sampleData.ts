export type Persona = 'customer' | 'tm' | 'estimator'

export type ProjectStage = 'estimating' | 'estimate_complete' | 'quote_shared' | 'accepted'

export const PROJECT = {
  id: 'PRJ-2026-0847',
  name: 'Riverside Office Park',
  subtitle: 'Irrigation package',
  visibility: 'Private' as const,
  siteAddress: '4400 Riverside Pkwy, Sacramento, CA',
  bidDate: 'Sep 21, 2026',
  createdDate: 'Aug 17, 2026',
  vertical: 'Landscaping',
  subVertical: 'Irrigation',
  customer: {
    company: 'Coast Landscape Inc.',
    contact: 'Marcus Webb',
    persona: 'Connected Contractor',
    registered: true,
  },
  tm: { name: 'Colin Farrelly', role: 'Territory Manager', territory: 'Sacramento Valley' },
  estimator: { name: 'Jordan Lee', role: 'Commercial Services' },
}

export const PERSONA_META: Record<Persona, { label: string; name: string; sub: string }> = {
  customer: { label: 'Customer', name: PROJECT.customer.contact, sub: PROJECT.customer.persona },
  tm: { label: 'Territory Manager', name: PROJECT.tm.name, sub: PROJECT.tm.territory },
  estimator: { label: 'Commercial Services', name: PROJECT.estimator.name, sub: PROJECT.estimator.role },
}

/** Who needs to act next, given current stage — drives "Requires attention" everywhere. */
export function nextActor(stage: ProjectStage, modificationRequested: boolean): Persona | null {
  if (stage === 'estimating') return 'estimator'
  if (stage === 'estimate_complete') return 'tm'
  if (stage === 'quote_shared') return modificationRequested ? 'tm' : 'customer'
  return null
}

export function attentionLabel(stage: ProjectStage, modificationRequested: boolean): string {
  if (stage === 'estimating') return 'New assignment — start takeoff & estimate'
  if (stage === 'estimate_complete') return 'Estimate ready — prep & share quote'
  if (stage === 'quote_shared')
    return modificationRequested ? 'Customer requested a modification' : 'Quote ready for your review'
  return ''
}

export const STAGE_LABEL: Record<ProjectStage, string> = {
  estimating: 'Estimating',
  estimate_complete: 'Estimate complete',
  quote_shared: 'Quote shared',
  accepted: 'Won — purchased',
}

/** What the customer can attach — called out explicitly rather than a generic "upload". */
export interface DocType {
  id: string
  icon: string
  label: string
  hint: string
}

export const DOC_TYPES: DocType[] = [
  { id: 'materials', icon: '📋', label: 'Materials list', hint: 'BOM, spec sheet, CSV' },
  { id: 'design', icon: '📐', label: 'Design documents', hint: 'Site plans, layout PDF' },
  { id: 'architectural', icon: '🏛️', label: 'Architectural drawings', hint: 'Blueprints, elevations' },
  { id: 'survey', icon: '📷', label: 'Site survey / photos', hint: 'Field photos, survey notes' },
]

export type FindingType = 'warning' | 'info'

export interface IntakeFinding {
  id: string
  type: FindingType
  title: string
  detail: string
  fixLabel: string
  fixedDetail: string
  completenessBoost: number
}

export const INTAKE_FINDINGS: IntakeFinding[] = [
  {
    id: 'rotor-pressure',
    type: 'warning',
    title: "Rotor series won't hold at this zone's pressure",
    detail:
      "Zone 3 is spec'd for XR-40 rotors, but your site's static pressure (78 PSI) exceeds their 65 PSI rating — they'd fail early under normal operation.",
    fixLabel: 'Swap to XR-40 HP (high-pressure) rotors',
    fixedDetail: 'Swapped to XR-40 HP rotors — rated for your site pressure.',
    completenessBoost: 10,
  },
  {
    id: 'drip-beds',
    type: 'info',
    title: 'East courtyard beds have no coverage',
    detail:
      'Your upload covers the turf zones but skips the planting beds along the east courtyard — without a dedicated zone, they’d be hand-watered.',
    fixLabel: 'Add a drip zone kit for the beds',
    fixedDetail: 'Drip zone kit added for east courtyard beds.',
    completenessBoost: 10,
  },
  {
    id: 'valve-schedule',
    type: 'info',
    title: "Mainline can't be sized yet",
    detail:
      "We need a valve count and box schedule to size mainline pipe and fittings correctly. Without it, we'll size conservatively — and slower.",
    fixLabel: 'Upload valve count & box schedule',
    fixedDetail: 'Valve schedule added — mainline can be sized precisely.',
    completenessBoost: 10,
  },
]

const BASE_COMPLETENESS = 30
const MAX_DOC_TYPE_CREDIT = 4

export function computeCompleteness(uploadedDocTypes: string[], resolvedFindings: string[]): number {
  const docCredit = Math.min(uploadedDocTypes.length, MAX_DOC_TYPE_CREDIT) * 10
  const fixCredit = resolvedFindings.length * 10
  return Math.min(BASE_COMPLETENESS + docCredit + fixCredit, 100)
}

export function estimateTurnaround(completeness: number): string {
  if (completeness >= 80) return '1–2 business days'
  if (completeness >= 50) return '3–4 business days'
  return '5–6 business days'
}

export const ROUTING_ANSWERS = {
  projectType: 'Commercial irrigation',
  design: 'Needs design — no sufficient existing plans',
  takeoff: 'Needs takeoff — no BOM provided',
  autoRoute: 'Commercial Services (takeoff + estimate) · TM notified',
}

export const NOTIFICATIONS: Record<Persona, string[]> = {
  customer: ['Intake submitted · Riverside Office Park ✓', 'Waiting for estimate · add docs to improve ETA'],
  tm: ['New project in territory · Riverside Office Park', 'Monitor routing · Estimator assigned'],
  estimator: ['Assigned · Takeoff + estimate · Riverside', 'Review intake summary before GiddyUp'],
}

export interface QuoteLineItem {
  description: string
  itemNumber: string
  cost: number
  qty: number
  price: number
  uom: string
  gmPercent: number
  notes?: string
}

export interface QuoteGroup {
  name: string
  items: QuoteLineItem[]
}

export const QUOTE_GROUPS: QuoteGroup[] = [
  {
    name: 'Controllers & Valves',
    items: [
      { description: 'Commercial Rotor Zone Kit', itemNumber: 'CRZ-KIT-12', cost: 145.0, qty: 1, price: 525.0, uom: 'EA', gmPercent: 72.38, notes: 'Flagged during intake — swapped to HP rotors' },
      { description: 'Solenoid Valve, 1" FPT 24VAC', itemNumber: 'SV1FPT24', cost: 18.75, qty: 12, price: 72.0, uom: 'EA', gmPercent: 73.96 },
      { description: 'Valve Box, 10" Round w/ Green Lid', itemNumber: 'VB10RND', cost: 9.4, qty: 12, price: 36.0, uom: 'EA', gmPercent: 73.89 },
    ],
  },
  {
    name: 'Drip Zone — Beds',
    items: [
      { description: 'Drip Zone Kit — Beds', itemNumber: 'DZ-KIT-04', cost: 62.0, qty: 1, price: 210.0, uom: 'EA', gmPercent: 70.48, notes: 'Added during intake' },
      { description: 'Drip Emitter, 1 GPH Pressure Comp.', itemNumber: 'DE1GPH', cost: 1.25, qty: 100, price: 4.9, uom: 'EA', gmPercent: 74.4 },
    ],
  },
  {
    name: 'Main Line',
    items: [
      { description: 'Mainline PVC Bundle', itemNumber: 'MPVC-2IN', cost: 0, qty: 0, price: 0, uom: 'EA', gmPercent: 0, notes: 'Pending valve schedule' },
      { description: 'Coupling, 3/4" Slip White PVC', itemNumber: 'C4PC007', cost: 0.42, qty: 20, price: 1.85, uom: 'EA', gmPercent: 77.3 },
    ],
  },
]

export const quoteSubtotal = QUOTE_GROUPS.flatMap((g) => g.items).reduce(
  (sum, item) => sum + item.price * item.qty,
  0,
)

export const quoteAvgGm =
  QUOTE_GROUPS.flatMap((g) => g.items).reduce((sum, i) => sum + i.gmPercent, 0) /
  QUOTE_GROUPS.flatMap((g) => g.items).length

/** Static filler projects so the dashboard reads as a real, populated queue. Not interactive. */
export interface FillerProject {
  id: string
  name: string
  location: string
  contractor: string
  bidDate: string
  bucket: 'New Leads' | 'Requires Attention' | 'In Progress' | 'Complete'
  visibility: 'Public' | 'Private'
}

export const FILLER_PROJECTS: FillerProject[] = [
  { id: 'p_1003', name: 'Courtyard Irrigation Retrofit', location: 'Portland, OR', contractor: 'Acme Grounds Co.', bidDate: 'Sep 7, 2026', bucket: 'New Leads', visibility: 'Public' },
  { id: 'p_1002', name: 'Lobby HVAC Refresh', location: 'San Diego, CA', contractor: 'Sunset Hospitality', bidDate: 'Sep 16, 2026', bucket: 'New Leads', visibility: 'Private' },
  { id: 'p_1005', name: 'Warehouse Drywall Repair', location: 'Phoenix, AZ', contractor: 'Oakwood Industrial', bidDate: 'Aug 24, 2026', bucket: 'Requires Attention', visibility: 'Private' },
  { id: 'p_1001', name: 'HQ Roof Replacement', location: 'Austin, TX', contractor: 'Acme Properties', bidDate: 'Aug 31, 2026', bucket: 'In Progress', visibility: 'Private' },
  { id: 'p_1004', name: 'Pool Resurfacing', location: 'Denver, CO', contractor: 'Blue Ridge Holdings', bidDate: 'Oct 1, 2026', bucket: 'Complete', visibility: 'Private' },
]
