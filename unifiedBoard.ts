import type { HostPlatform } from '@/state/appStore'

/** Shared GRIDS+ board lanes — same on Heritage GRIDS and SRS TED. */
export type UnifiedBoardColumn = 'new-leads' | 'requires-attention' | 'in-progress' | 'complete'

export type CommercialVertical = 'landscape' | 'roofing'

export interface UnifiedBoardProject {
  num: string
  referenceNumber: string
  name: string
  address: string
  vis: 'Public' | 'Private'
  contractor: string | null
  bidLabel: string
  createdLabel: string
  /** Days on board — TED capture shows top-right badge. */
  daysOpen: number | null
  template: string
  /** Base lane before lead-disposition overrides. */
  column: UnifiedBoardColumn
  opportunityStatus: string | null
  /** Vertical workflow status shown on card (e.g. Design(s) Published). */
  workflowStatus: string | null
  showRequestSubmittal: boolean
  vertical: CommercialVertical
}

export const UNIFIED_BOARD_COLUMNS: {
  key: UnifiedBoardColumn
  title: string
  filter?: { label: string; options: string[] }
  archiveLink?: boolean
}[] = [
  {
    key: 'new-leads',
    title: 'New Leads',
    filter: { label: 'All Templates', options: ['All Templates', 'IRRIGATION', 'AQUATICS', 'WATER FEATURE', 'ROOFING'] },
  },
  { key: 'requires-attention', title: 'Requires My Attention' },
  { key: 'in-progress', title: 'In Progress' },
  {
    key: 'complete',
    title: 'Complete',
    filter: { label: 'All Phases', options: ['All Phases', 'Committed', 'Lost'] },
    archiveLink: true,
  },
]

export const UNIFIED_TEMPLATE_OPTIONS = ['All Templates', 'IRRIGATION', 'AQUATICS', 'WATER FEATURE', 'ROOFING'] as const

export const UNIFIED_SORT_OPTIONS = [
  { key: 'created-desc', label: 'Date Created (Newest First)' },
  { key: 'created-asc', label: 'Date Created (Oldest First)' },
  { key: 'name-asc', label: 'Project Name (A–Z)' },
  { key: 'bid-date', label: 'Bid Date' },
] as const

export type UnifiedSortKey = (typeof UNIFIED_SORT_OPTIONS)[number]['key']

export function matchUnifiedQuery(p: UnifiedBoardProject, q: string): boolean {
  if (!q.trim()) return true
  const hay = `${p.num} ${p.referenceNumber} ${p.name} ${p.address} ${p.contractor ?? ''} ${p.workflowStatus ?? ''}`.toLowerCase()
  return q.toLowerCase().split(/\s+/).every((w) => hay.includes(w))
}

export function sortUnifiedProjects(projects: UnifiedBoardProject[], sort: UnifiedSortKey): UnifiedBoardProject[] {
  const copy = [...projects]
  switch (sort) {
    case 'name-asc':
      return copy.sort((a, b) => a.name.localeCompare(b.name))
    case 'bid-date':
      return copy.sort((a, b) => a.bidLabel.localeCompare(b.bidLabel))
    case 'created-asc':
      return copy.sort((a, b) => a.createdLabel.localeCompare(b.createdLabel))
    default:
      return copy.sort((a, b) => b.createdLabel.localeCompare(a.createdLabel))
  }
}

export function platformVertical(host: HostPlatform): CommercialVertical {
  return host === 'roofhub' ? 'roofing' : 'landscape'
}
