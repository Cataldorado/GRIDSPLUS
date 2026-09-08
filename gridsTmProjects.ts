export type GridsBoardColumn = 'new-leads' | 'requires-attention' | 'in-progress' | 'complete'

export type GridsTemplate = 'IRRIGATION' | 'AQUATICS' | 'WATER FEATURE' | 'ROOFING'

export type GridsOpportunityStatus = 'ACTIVE OPPORTUNITY' | 'COMMITTED' | 'LOST BY CUSTOMER'

export interface GridsTmProject {
  num: string
  name: string
  address: string
  vis: 'Public' | 'Private'
  contractor: string | null
  bidLabel: string
  createdLabel: string
  template: GridsTemplate
  column: GridsBoardColumn
  opportunityStatus: GridsOpportunityStatus | null
  showRequestSubmittal: boolean
}

/** TM board capture — Heritage GRIDS walkthrough Sep 2026. */
export const GRIDS_TM_PROJECTS: GridsTmProject[] = [
  {
    num: '#AUT-26-89442',
    name: 'Garrett Public Library Renovation',
    address: '107 West Houston Street Garrett, IN 46738',
    vis: 'Public',
    contractor: null,
    bidLabel: '10/1/2026 (in 23 days)',
    createdLabel: '19 days ago',
    template: 'IRRIGATION',
    column: 'new-leads',
    opportunityStatus: null,
    showRequestSubmittal: false,
  },
  {
    num: '#AUT-26-89440',
    name: 'Syracuse Public Library',
    address: '114 South Harrison Street Warsaw, IN 46580',
    vis: 'Public',
    contractor: null,
    bidLabel: '9/1/2026 (Overdue By 7 Days)',
    createdLabel: '19 days ago',
    template: 'IRRIGATION',
    column: 'new-leads',
    opportunityStatus: null,
    showRequestSubmittal: false,
  },
  {
    num: '#AUT-26-89414',
    name: 'Apply Changes - Test 04-17 - CC',
    address: '107 W Houston St, Garrett, IN 46738',
    vis: 'Private',
    contractor: 'HERITAGE PLUS TEST ACCOUNT',
    bidLabel: 'N/A',
    createdLabel: '21 days ago',
    template: 'IRRIGATION',
    column: 'in-progress',
    opportunityStatus: 'ACTIVE OPPORTUNITY',
    showRequestSubmittal: false,
  },
  {
    num: '#AQU-25-70011',
    name: '15 Progress Place',
    address: 'Lakewood, NJ',
    vis: 'Private',
    contractor: 'Garden State Irrigation',
    bidLabel: 'N/A',
    createdLabel: '11 months ago',
    template: 'IRRIGATION',
    column: 'complete',
    opportunityStatus: 'COMMITTED',
    showRequestSubmittal: true,
  },
  {
    num: '#HLS-25-67617',
    name: 'Wings Credit Union',
    address: 'Eden Prairie, MN',
    vis: 'Private',
    contractor: 'Twin Cities Green LLC',
    bidLabel: 'N/A',
    createdLabel: '8 months ago',
    template: 'IRRIGATION',
    column: 'complete',
    opportunityStatus: 'LOST BY CUSTOMER',
    showRequestSubmittal: false,
  },
  {
    num: '#AUT-26-88300',
    name: 'Chick-fil-A FSU 04217',
    address: 'Tallahassee, FL',
    vis: 'Private',
    contractor: 'Gulf Coast Grounds',
    bidLabel: '7/28/2026',
    createdLabel: '20 days ago',
    template: 'IRRIGATION',
    column: 'complete',
    opportunityStatus: 'COMMITTED',
    showRequestSubmittal: true,
  },
  {
    num: '#SUP-25-63773',
    name: 'The Home Depot — LAA Expansion',
    address: 'Atlanta, GA',
    vis: 'Private',
    contractor: 'Peachtree Grounds',
    bidLabel: '10/23/2025',
    createdLabel: '10 months ago',
    template: 'IRRIGATION',
    column: 'complete',
    opportunityStatus: 'LOST BY CUSTOMER',
    showRequestSubmittal: false,
  },
]

export const GRIDS_BOARD_COLUMNS: {
  key: GridsBoardColumn
  title: string
  filter?: { label: string; options: string[] }
  archiveLink?: boolean
}[] = [
  { key: 'new-leads', title: 'New Leads', filter: { label: 'All Templates', options: ['All Templates', 'IRRIGATION', 'AQUATICS', 'WATER FEATURE'] } },
  { key: 'requires-attention', title: 'Requires My Attention' },
  { key: 'in-progress', title: 'In Progress' },
  { key: 'complete', title: 'Complete', filter: { label: 'All Phases', options: ['All Phases', 'Committed', 'Lost'] }, archiveLink: true },
]

export const GRIDS_TEMPLATES = ['All Templates', 'IRRIGATION', 'AQUATICS', 'WATER FEATURE', 'ROOFING'] as const

export function matchGridsQuery(p: GridsTmProject, q: string): boolean {
  if (!q.trim()) return true
  const hay = `${p.num} ${p.name} ${p.address} ${p.contractor ?? ''}`.toLowerCase()
  return q.toLowerCase().split(/\s+/).every((w) => hay.includes(w))
}

export function filterGridsByTemplate(projects: GridsTmProject[], template: string): GridsTmProject[] {
  if (template === 'All Templates') return projects
  return projects.filter((p) => p.template === template)
}
