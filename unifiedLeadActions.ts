import type { LeadDisposition } from '@/data/leadActions'
import type { UnifiedBoardColumn, UnifiedBoardProject } from '@/data/unifiedBoard'

export function isUnifiedDiscoveryLead(p: UnifiedBoardProject): boolean {
  return p.vis === 'Public' && p.column === 'new-leads'
}

export function isUnifiedLeadHidden(p: UnifiedBoardProject, disposition: Record<string, LeadDisposition>): boolean {
  return disposition[p.num] === 'archived'
}

export function effectiveUnifiedBoardColumn(
  p: UnifiedBoardProject,
  disposition: Record<string, LeadDisposition>,
): UnifiedBoardColumn | null {
  if (isUnifiedLeadHidden(p, disposition)) return null
  if (disposition[p.num] === 'interested' && isUnifiedDiscoveryLead(p)) return 'in-progress'
  return p.column
}

export function displayUnifiedOpportunityStatus(
  p: UnifiedBoardProject,
  disposition: Record<string, LeadDisposition>,
): string | null {
  if (disposition[p.num] === 'interested') return 'ACTIVE OPPORTUNITY'
  return p.opportunityStatus
}

export function showUnifiedDiscoveryActions(
  p: UnifiedBoardProject,
  disposition: Record<string, LeadDisposition>,
): boolean {
  return isUnifiedDiscoveryLead(p) && !disposition[p.num]
}
