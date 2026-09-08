import { QUOTE_GROUPS, type QuoteGroup } from '@/data/sampleData'
import { SIGNALS, type SignalKey, type TriageProject } from '@/data/triageData'

export interface Contact {
  name: string
  title: string
  email: string
  phone: string
}

export function emailFor(company: string, first: string, last: string): string {
  const domain = company
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .slice(0, 16)
  return `${first.toLowerCase()}.${last.toLowerCase()}@${domain}.com`
}

export const CONTRACTOR_PEOPLE: Record<string, { first: string; last: string; title: string; phone: string }> = {
  'Ohio Valley Sitework': { first: 'Dana', last: 'Whitfield', title: 'Estimating Manager', phone: '(502) 555-0114' },
  'Front Range Turf': { first: 'Marcus', last: 'Ibarra', title: 'Owner', phone: '(303) 555-0177' },
  'Garden State Irrigation': { first: 'Lena', last: 'Kowalski', title: 'Project Manager', phone: '(732) 555-0142' },
  'Gulf Coast Grounds': { first: 'Trevor', last: 'Boudreaux', title: 'Operations Manager', phone: '(850) 555-0199' },
  'Bluegrass Irrigation': { first: 'Alicia', last: 'Fenwick', title: 'Estimator', phone: '(859) 555-0163' },
  'Circle City Irrigation': { first: 'Owen', last: 'Marsh', title: 'Project Manager', phone: '(317) 555-0121' },
  'Peachtree Grounds': { first: 'Renee', last: 'Okafor', title: 'Owner', phone: '(404) 555-0188' },
  'Prairie Land Group': { first: 'Kyle', last: 'Novak', title: 'Estimating Lead', phone: '(630) 555-0155' },
  'Wabash Valley Landscape': { first: 'Priya', last: 'Deshpande', title: 'Project Manager', phone: '(812) 555-0136' },
  'Brazos Site Services': { first: 'Colton', last: 'Ashby', title: 'Owner', phone: '(281) 555-0172' },
  'Twin Cities Green LLC': { first: 'Hannah', last: 'Solberg', title: 'Operations Manager', phone: '(612) 555-0148' },
  'Summit Roofing Partners': { first: 'Gabriel', last: 'Torres', title: 'Estimating Manager', phone: '(901) 555-0163' },
  'Apex Commercial Roofing': { first: 'Nicole', last: 'Bergstrom', title: 'Project Manager', phone: '(615) 555-0128' },
}

export function contactForContractor(contractor: string): Contact | null {
  const person = CONTRACTOR_PEOPLE[contractor]
  if (!person) return null
  return {
    name: `${person.first} ${person.last}`,
    title: person.title,
    email: emailFor(contractor, person.first, person.last),
    phone: person.phone,
  }
}

export interface SpecRow {
  label: string
  value: string
}

export const TEMPLATE_SPECS: Record<TriageProject['template'], SpecRow[]> = {
  IRRIGATION: [
    { label: 'Zone count', value: '14 zones' },
    { label: 'Water source', value: 'Municipal tap, 1.5" meter' },
    { label: 'Controller', value: 'Smart Wi-Fi, 16-station' },
    { label: 'Backflow', value: 'Reduced pressure zone assembly' },
  ],
  AQUATICS: [
    { label: 'Pool type', value: 'Gunite, commercial occupancy' },
    { label: 'Filtration', value: 'Regenerative media, 2-pump' },
    { label: 'Water features', value: '2 deck jets, 1 sheer descent' },
    { label: 'Deck material', value: 'Broom-finish concrete' },
  ],
  'WATER FEATURE': [
    { label: 'Feature type', value: 'Recirculating fountain, tiered basin' },
    { label: 'Pump system', value: 'Variable-speed, 2 HP' },
    { label: 'Lighting', value: 'RGB LED, low-voltage' },
    { label: 'Basin volume', value: '~2,400 gallons' },
  ],
  ROOFING: [
    { label: 'Roof area', value: '42,000 SF' },
    { label: 'Membrane', value: 'TPO, 60 mil, fully adhered' },
    { label: 'Taper design', value: '1/4" per ft to 4 drains' },
    { label: 'Insulation', value: 'Polyiso, R-30 min' },
  ],
}

export interface QuoteSummary {
  label: string
  status: string
  note: string
}

const QUOTE_STATUS_HINTS = ['QUOTE', 'QUOTED', 'FLAGGED', 'ORDER', 'WON', 'LOST', 'AWARDED', 'COMMITTED']

export function deriveQuoteSummary(p: TriageProject): QuoteSummary | null {
  if (!QUOTE_STATUS_HINTS.some((h) => p.status.includes(h))) return null
  return {
    label: `Quote 1 — ${p.num}`,
    status: p.status,
    note: SIGNALS[p.signal]?.why ?? '',
  }
}

const AQUATICS_QUOTE_GROUPS: QuoteGroup[] = [
  {
    name: 'Filtration & Circulation',
    items: [
      { description: 'Regenerative Media Filter, 2-Pump', itemNumber: 'RMF-2PMP', cost: 1850, qty: 1, price: 3200, uom: 'EA', gmPercent: 42.19 },
      { description: 'Variable Speed Pump, 2 HP', itemNumber: 'VSP-2HP', cost: 620, qty: 2, price: 1050, uom: 'EA', gmPercent: 40.95 },
      { description: 'Sand Media, 100lb Bag', itemNumber: 'SND-100', cost: 18, qty: 12, price: 34, uom: 'BAG', gmPercent: 47.06 },
    ],
  },
  {
    name: 'Pool Structure & Deck',
    items: [
      { description: 'Gunite Shell Package', itemNumber: 'GUN-SHELL', cost: 24000, qty: 1, price: 41000, uom: 'EA', gmPercent: 41.46, notes: 'Commercial occupancy spec' },
      { description: 'Deck Jet Fixture', itemNumber: 'DJ-FIX', cost: 340, qty: 2, price: 610, uom: 'EA', gmPercent: 44.26 },
      { description: 'Broom-Finish Concrete', itemNumber: 'CONC-BRM', cost: 6.5, qty: 1800, price: 11.25, uom: 'SF', gmPercent: 42.22 },
    ],
  },
]

const WATER_FEATURE_QUOTE_GROUPS: QuoteGroup[] = [
  {
    name: 'Pump & Plumbing',
    items: [
      { description: 'Variable-Speed Fountain Pump, 2 HP', itemNumber: 'VFP-2HP', cost: 980, qty: 1, price: 1650, uom: 'EA', gmPercent: 40.61 },
      { description: 'PVC Plumbing Kit, Schedule 40', itemNumber: 'PVC-KIT40', cost: 210, qty: 1, price: 375, uom: 'EA', gmPercent: 44.0 },
      { description: 'Basin Liner, EPDM 45mil', itemNumber: 'LNR-EPDM45', cost: 640, qty: 1, price: 1100, uom: 'EA', gmPercent: 41.82 },
    ],
  },
  {
    name: 'Lighting & Controls',
    items: [
      { description: 'RGB LED Fixture, Low-Voltage', itemNumber: 'LED-RGB-LV', cost: 85, qty: 6, price: 155, uom: 'EA', gmPercent: 45.16 },
      { description: 'Feature Controller, Wi-Fi', itemNumber: 'FCTRL-WIFI', cost: 410, qty: 1, price: 720, uom: 'EA', gmPercent: 43.06 },
    ],
  },
]

const ROOFING_QUOTE_GROUPS: QuoteGroup[] = [
  {
    name: 'Membrane & Insulation',
    items: [
      { description: 'TPO Membrane, 60 mil White', itemNumber: 'TPO-60-WHT', cost: 0.85, qty: 42000, price: 1.45, uom: 'SF', gmPercent: 41.38 },
      { description: 'Tapered Polyiso Insulation', itemNumber: 'TAPR-POLYISO', cost: 1.2, qty: 42000, price: 2.05, uom: 'SF', gmPercent: 41.46, notes: 'Cut per taper design layout' },
      { description: 'Cover Board, 1/2" DensDeck', itemNumber: 'DENSDECK-05', cost: 0.55, qty: 42000, price: 0.95, uom: 'SF', gmPercent: 42.11 },
    ],
  },
  {
    name: 'Drainage & Accessories',
    items: [
      { description: 'Roof Drain Assembly, Cast Iron', itemNumber: 'DRAIN-CI-4', cost: 145, qty: 4, price: 260, uom: 'EA', gmPercent: 44.23 },
      { description: 'Edge Metal, Fascia System', itemNumber: 'EDGE-FASCIA', cost: 8.5, qty: 820, price: 14.75, uom: 'LF', gmPercent: 42.37 },
      { description: 'Walk Pad, Reinforced TPO', itemNumber: 'WALKPAD-TPO', cost: 3.2, qty: 400, price: 5.6, uom: 'SF', gmPercent: 42.86 },
    ],
  },
]

const TEMPLATE_QUOTE_CATALOG: Record<TriageProject['template'], QuoteGroup[]> = {
  IRRIGATION: QUOTE_GROUPS,
  AQUATICS: AQUATICS_QUOTE_GROUPS,
  'WATER FEATURE': WATER_FEATURE_QUOTE_GROUPS,
  ROOFING: ROOFING_QUOTE_GROUPS,
}

export function deriveQuoteLineItems(p: TriageProject): QuoteGroup[] | null {
  if (!deriveQuoteSummary(p)) return null
  return TEMPLATE_QUOTE_CATALOG[p.template]
}

export function quoteGroupTotals(items: QuoteGroup['items']) {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0)
  const avgGm = items.reduce((sum, i) => sum + i.gmPercent, 0) / items.length
  return { subtotal, avgGm }
}

export interface ProjectFile {
  name: string
  type: string
  date: string
}

const TEMPLATE_LABEL: Record<TriageProject['template'], string> = {
  IRRIGATION: 'Irrigation',
  AQUATICS: 'Aquatics',
  'WATER FEATURE': 'Water Feature',
  ROOFING: 'Roofing',
}

const TAPER_SPEC_SIGNALS: SignalKey[] = ['build-taper-design-spec', 'compile-submittal', 'none']

export function deriveFiles(p: TriageProject): ProjectFile[] {
  const files: ProjectFile[] = []
  const templateLabel = TEMPLATE_LABEL[p.template]
  const firstDate = p.evidence[0]?.when ?? '—'
  const lastDate = p.evidence[p.evidence.length - 1]?.when ?? '—'

  if (p.signal !== 'upload-plans') {
    files.push({ name: `${templateLabel} Site Plan.pdf`, type: 'Design', date: firstDate })
  }
  if (p.signal === 'flag-missing-docs') {
    files.push({ name: 'Addendum 1 — missing.pdf', type: 'Missing', date: '—' })
  }
  if (p.template === 'ROOFING' && TAPER_SPEC_SIGNALS.includes(p.signal)) {
    files.push({ name: 'Taper Design Spec.pdf', type: 'Design', date: p.evidence[1]?.when ?? firstDate })
  } else if (p.stage !== 'leads' || p.signal === 'assign-estimator') {
    files.push({ name: 'Product Submittal Package.pdf', type: 'Submittal', date: p.evidence[1]?.when ?? firstDate })
  }
  if (deriveQuoteSummary(p)) {
    files.push({ name: `Quote — ${p.num}.pdf`, type: 'Quote', date: lastDate })
  }
  return files
}

export interface DesignTakeoffLink {
  sectionTitle: string
  itemTitle: string
  itemSubtitle: string
  linkLabel: string
  /** Demo — Procore deep link stub per project. */
  href: string
}

export interface TakeoffAssignment {
  assigneeName: string
  assigneeTitle: string
  assigneeTeam: string
  email: string
  phone: string
  status: string
  assignedSince: string
  notes?: string
}

/** Demo assignee shown when no quote exists yet (pre-estimate phase). */
export function takeoffAssignmentForProject(p: TriageProject): TakeoffAssignment {
  if (p.template === 'ROOFING') {
    return {
      assigneeName: 'Morgan Reyes',
      assigneeTitle: 'Commercial Designer',
      assigneeTeam: 'SRS Commercial Services',
      email: 'morgan.reyes@srsdistribution.com',
      phone: '(901) 555-0134',
      status: p.signal === 'build-taper-design-spec' ? 'Building taper layout' : 'Reviewing roof plans',
      assignedSince: p.evidence[0]?.when ?? '2 days ago',
      notes: 'Tapered insulation layout and drainage slopes for branch pricing.',
    }
  }

  if (p.signal === 'assign-estimator') {
    return {
      assigneeName: 'Jordan Lee',
      assigneeTitle: 'Estimator',
      assigneeTeam: 'Commercial Services',
      email: 'jordan.lee@heritageplus.com',
      phone: '(916) 555-0119',
      status: 'Queued for assignment',
      assignedSince: 'today',
      notes: 'TM routed intake — estimator will be assigned once plans are confirmed.',
    }
  }

  if (p.signal === 'upload-plans') {
    return {
      assigneeName: 'Jordan Lee',
      assigneeTitle: 'Estimator',
      assigneeTeam: 'Commercial Services',
      email: 'jordan.lee@heritageplus.com',
      phone: '(916) 555-0119',
      status: 'Awaiting plans upload',
      assignedSince: p.evidence[0]?.when ?? 'today',
      notes: 'Takeoff will start once contractor uploads site plans.',
    }
  }

  return {
    assigneeName: 'Jordan Lee',
    assigneeTitle: 'Estimator',
    assigneeTeam: 'Commercial Services',
    email: 'jordan.lee@heritageplus.com',
    phone: '(916) 555-0119',
    status: 'Takeoff in progress',
    assignedSince: p.evidence[0]?.when ?? '3 days ago',
    notes: 'Material takeoff and design sheets maintained in Procore.',
  }
}

/** Landscape / irrigation takeoffs in Procore; roofing uses taper design instead. */
export function designTakeoffForProject(p: TriageProject): DesignTakeoffLink {
  const label = TEMPLATE_LABEL[p.template]
  if (p.template === 'ROOFING') {
    return {
      sectionTitle: 'Taper Design',
      itemTitle: `${p.name} — tapered insulation layout`,
      itemSubtitle: 'Drainage slopes and polyiso layout for branch pricing',
      linkLabel: 'View Tapered Design',
      href: `https://app.procore.com/demo/taper-design/${p.num.replace(/[^a-zA-Z0-9]/g, '')}`,
    }
  }
  return {
    sectionTitle: 'Takeoffs',
    itemTitle: `${label} takeoff — ${p.num}`,
    itemSubtitle: 'Material takeoff and design sheets maintained in Procore',
    linkLabel: 'View in Procore',
    href: `https://app.procore.com/demo/takeoff/${p.num.replace(/[^a-zA-Z0-9]/g, '')}`,
  }
}
