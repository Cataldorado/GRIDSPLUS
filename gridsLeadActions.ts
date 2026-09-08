import type { LeadDisposition } from '@/data/leadActions'
import type { GridsBoardColumn, GridsOpportunityStatus, GridsTmProject } from '@/data/gridsTmProjects'

/** Public project sitting in the New Leads column — discovery / radius lead. */
export function isGridsDiscoveryLead(p: GridsTmProject): boolean {
  return p.vis === 'Public' && p.column === 'new-leads'
}

export function isGridsLeadHidden(p: GridsTmProject, disposition: Record<string, LeadDisposition>): boolean {
  return disposition[p.num] === 'archived'
}

/** Column placement after customer interest or TM archive — mirrors Vision effectiveBoardStage. */
export function effectiveGridsBoardColumn(
  p: GridsTmProject,
  disposition: Record<string, LeadDisposition>,
): GridsBoardColumn | null {
  if (isGridsLeadHidden(p, disposition)) return null
  if (disposition[p.num] === 'interested' && isGridsDiscoveryLead(p)) return 'in-progress'
  return p.column
}

export function displayGridsOpportunityStatus(
  p: GridsTmProject,
  disposition: Record<string, LeadDisposition>,
): GridsOpportunityStatus | null {
  if (disposition[p.num] === 'interested') return 'ACTIVE OPPORTUNITY'
  return p.opportunityStatus
}

export function showGridsDiscoveryActions(
  p: GridsTmProject,
  disposition: Record<string, LeadDisposition>,
): boolean {
  return isGridsDiscoveryLead(p) && !disposition[p.num]
}
