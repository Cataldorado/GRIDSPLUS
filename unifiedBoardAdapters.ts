import { GRIDS_TM_PROJECTS, type GridsTmProject } from '@/data/gridsTmProjects'
import { TED_ROOFING_PROJECTS, type TedRoofingProject } from '@/data/tedRoofingProjects'
import type { UnifiedBoardColumn, UnifiedBoardProject } from '@/data/unifiedBoard'

function daysSince(iso: string): number {
  const ms = Date.now() - new Date(iso).getTime()
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)))
}

function relativeCreated(iso: string): string {
  const d = daysSince(iso)
  if (d === 0) return 'today'
  if (d === 1) return '1 day ago'
  return `${d} days ago`
}

function tedColumn(p: TedRoofingProject): UnifiedBoardColumn {
  if (p.column) return p.column
  switch (p.status) {
    case 'Awaiting Designer':
      return 'new-leads'
    case 'Branch Review and Price':
      return 'requires-attention'
    case 'Design In Progress':
      return 'in-progress'
    default:
      return 'in-progress'
  }
}

export function gridsToUnified(p: GridsTmProject): UnifiedBoardProject {
  return {
    num: p.num,
    referenceNumber: p.num.replace(/^#/, ''),
    name: p.name,
    address: p.address,
    vis: p.vis,
    contractor: p.contractor,
    bidLabel: p.bidLabel,
    createdLabel: p.createdLabel,
    daysOpen: null,
    template: p.template,
    column: p.column,
    opportunityStatus: p.opportunityStatus,
    workflowStatus: p.opportunityStatus ?? (p.column === 'new-leads' && p.vis === 'Public' ? 'Public lead' : null),
    showRequestSubmittal: p.showRequestSubmittal,
    vertical: 'landscape',
  }
}

export function tedToUnified(p: TedRoofingProject): UnifiedBoardProject {
  return {
    num: `#TED-${p.id}`,
    referenceNumber: p.id,
    name: p.name,
    address: p.location,
    vis: p.isPublic ? 'Public' : 'Private',
    contractor: p.bidders,
    bidLabel: p.bidDate ?? '—',
    createdLabel: relativeCreated(p.createdAt),
    daysOpen: daysSince(p.createdAt),
    template: 'ROOFING',
    column: tedColumn(p),
    opportunityStatus: p.column === 'complete' ? 'COMMITTED' : null,
    workflowStatus: p.workflowStatus ?? p.status,
    showRequestSubmittal: false,
    vertical: 'roofing',
  }
}

export function loadLandscapeProjects(): UnifiedBoardProject[] {
  return GRIDS_TM_PROJECTS.map(gridsToUnified)
}

export function loadRoofingProjects(): UnifiedBoardProject[] {
  return TED_ROOFING_PROJECTS.map(tedToUnified)
}
