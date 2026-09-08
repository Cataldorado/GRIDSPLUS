/** TED (SRS) roofing list statuses captured from walkthrough — Sep 2026 screenshot. */
export type TedRoofingStatus = 'Design In Progress' | 'Awaiting Designer' | 'Branch Review and Price'

export type TedBoardColumn = 'new-leads' | 'requires-attention' | 'in-progress' | 'complete'

export interface TedRoofingProject {
  id: string
  name: string
  location: string
  bidders: string | null
  status: TedRoofingStatus
  /** GRIDS+ unified board lane (overrides status mapping when set). */
  column?: TedBoardColumn
  /** Card status line — e.g. Design(s) Published. */
  workflowStatus?: string
  bidDate: string | null
  isPublic: boolean
  /** For "Date Created (Newest First)" sort */
  createdAt: string
  /** Included when "My Projects Only" is checked (demo: Chris / Summit Roofing Partners bidder). */
  mine: boolean
}

/** Roofing projects — unified board lanes match GRIDS (New Leads · Requires My Attention · In Progress · Complete). */
export const TED_ROOFING_PROJECTS: TedRoofingProject[] = [
  {
    id: '2612088',
    name: 'ERNIE PYLE HALL IU',
    location: 'Bloomington, IN 47405',
    bidders: null,
    status: 'Awaiting Designer',
    column: 'new-leads',
    workflowStatus: 'Design(s) Published',
    bidDate: '8/27/2025 (12 Days Ago)',
    isPublic: true,
    createdAt: '2026-08-19T10:00:00Z',
    mine: false,
  },
  {
    id: '2612087',
    name: 'Indiana University Campus',
    location: 'Bloomington, IN 47405',
    bidders: null,
    status: 'Awaiting Designer',
    column: 'new-leads',
    workflowStatus: 'Design(s) Published',
    bidDate: '8/27/2025 (12 Days Ago)',
    isPublic: true,
    createdAt: '2026-08-19T09:30:00Z',
    mine: false,
  },
  {
    id: '2612086',
    name: 'IN SOUTH SHORE',
    location: 'Portage, IN 46368',
    bidders: null,
    status: 'Awaiting Designer',
    column: 'new-leads',
    workflowStatus: 'Design(s) Published',
    bidDate: '8/27/2025 (12 Days Ago)',
    isPublic: true,
    createdAt: '2026-08-18T14:00:00Z',
    mine: false,
  },
  {
    id: '2613042',
    name: 'ROCKVILLE ELEMENTARY',
    location: 'Rockville, IN',
    bidders: 'UNIQUE QUALITY CONSTRUCTION',
    status: 'Design In Progress',
    column: 'in-progress',
    workflowStatus: 'Design In Progress',
    bidDate: null,
    isPublic: true,
    createdAt: '2026-09-07T14:22:00Z',
    mine: false,
  },
  {
    id: '2613041',
    name: 'Woolsey Baptist',
    location: 'Fayetteville, GA',
    bidders: 'JACO CONTRACTING SOLUTIONS, IN',
    status: 'Awaiting Designer',
    column: 'new-leads',
    bidDate: null,
    isPublic: true,
    createdAt: '2026-09-07T11:05:00Z',
    mine: false,
  },
  {
    id: '2613040',
    name: 'Kimball Junction',
    location: 'Moab, UT',
    bidders: null,
    status: 'Awaiting Designer',
    column: 'new-leads',
    bidDate: null,
    isPublic: true,
    createdAt: '2026-09-06T16:40:00Z',
    mine: false,
  },
  {
    id: '2613039',
    name: '365 NW 47TH',
    location: 'Miami Beach, FL',
    bidders: 'SKYLINE ROOFING INC',
    status: 'Design In Progress',
    column: 'in-progress',
    workflowStatus: 'Design In Progress',
    bidDate: null,
    isPublic: true,
    createdAt: '2026-09-06T09:18:00Z',
    mine: true,
  },
  {
    id: '2613038',
    name: 'Minty Rose',
    location: 'Salt Lake City, UT',
    bidders: 'KARMA ROOFING & CONSTRUCTION LLC',
    status: 'Design In Progress',
    column: 'in-progress',
    workflowStatus: 'Design In Progress',
    bidDate: null,
    isPublic: true,
    createdAt: '2026-09-05T13:55:00Z',
    mine: false,
  },
  {
    id: '2613037',
    name: 'JR ELECTRIC',
    location: 'Novi, MI',
    bidders: 'ALL SEASONS ROOFING LC',
    status: 'Design In Progress',
    column: 'in-progress',
    workflowStatus: 'Design In Progress',
    bidDate: null,
    isPublic: true,
    createdAt: '2026-09-05T10:30:00Z',
    mine: false,
  },
  {
    id: '2613036',
    name: 'Ironheart',
    location: 'Graniteville, SC',
    bidders: 'BENTON ROOFING',
    status: 'Design In Progress',
    column: 'in-progress',
    workflowStatus: 'Design In Progress',
    bidDate: null,
    isPublic: true,
    createdAt: '2026-09-04T15:12:00Z',
    mine: true,
  },
  {
    id: '2613035',
    name: 'Kerrville DPS',
    location: 'Kerrville, TX',
    bidders: null,
    status: 'Design In Progress',
    column: 'in-progress',
    workflowStatus: 'Design In Progress',
    bidDate: null,
    isPublic: false,
    createdAt: '2026-09-04T08:44:00Z',
    mine: false,
  },
  {
    id: '2613032',
    name: 'Huntington Bank Parker and Stroh',
    location: 'Parker, CO',
    bidders: 'RAMPART ROOFING, INC',
    status: 'Design In Progress',
    column: 'in-progress',
    workflowStatus: 'Design In Progress',
    bidDate: null,
    isPublic: false,
    createdAt: '2026-09-03T17:20:00Z',
    mine: false,
  },
  {
    id: '2613030',
    name: 'MUNSTER HIGH SCHOOL',
    location: 'Munster, IN',
    bidders: 'MIDWEST COMMERCIAL ROOFING',
    status: 'Design In Progress',
    column: 'in-progress',
    workflowStatus: 'Design In Progress',
    bidDate: null,
    isPublic: true,
    createdAt: '2026-09-03T12:00:00Z',
    mine: false,
  },
  {
    id: '2613028',
    name: 'Roseville Medical Office',
    location: 'Roseville, MI',
    bidders: 'DETROIT ROOFING GROUP',
    status: 'Branch Review and Price',
    column: 'requires-attention',
    workflowStatus: 'Branch Review and Price',
    bidDate: '9/28/2026',
    isPublic: false,
    createdAt: '2026-09-02T14:30:00Z',
    mine: true,
  },
  {
    id: '2613025',
    name: 'Take 5 Oil Change — Oregon',
    location: 'Oregon, OH',
    bidders: 'OHIO VALLEY ROOFING LLC',
    status: 'Awaiting Designer',
    column: 'new-leads',
    bidDate: null,
    isPublic: true,
    createdAt: '2026-09-01T09:15:00Z',
    mine: false,
  },
]

export type TedSortKey = 'created-desc' | 'created-asc' | 'name-asc' | 'bid-date'

export const TED_SORT_OPTIONS: { key: TedSortKey; label: string }[] = [
  { key: 'created-desc', label: 'Date Created (Newest First)' },
  { key: 'created-asc', label: 'Date Created (Oldest First)' },
  { key: 'name-asc', label: 'Project Name (A–Z)' },
  { key: 'bid-date', label: 'Bid Date' },
]

export function sortTedProjects(projects: TedRoofingProject[], sort: TedSortKey): TedRoofingProject[] {
  const copy = [...projects]
  switch (sort) {
    case 'created-desc':
      return copy.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    case 'created-asc':
      return copy.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    case 'name-asc':
      return copy.sort((a, b) => a.name.localeCompare(b.name))
    case 'bid-date':
      return copy.sort((a, b) => (a.bidDate ?? '').localeCompare(b.bidDate ?? ''))
    default:
      return copy
  }
}

export function matchTedQuery(p: TedRoofingProject, q: string): boolean {
  if (!q.trim()) return true
  const hay = `${p.id} ${p.name} ${p.location} ${p.bidders ?? ''} ${p.status}`.toLowerCase()
  return q.toLowerCase().split(/\s+/).every((w) => hay.includes(w))
}
