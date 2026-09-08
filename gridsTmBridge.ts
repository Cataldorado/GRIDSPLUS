import type { TriageProject } from '@/data/triageData'
import { GRIDS_TM_PROJECTS, type GridsTmProject } from '@/data/gridsTmProjects'

const GRIDS_TM_LOOKUP = new Map(
  GRIDS_TM_PROJECTS.flatMap((p) => [[p.num, p], [`#GRIDS-${p.num}`, p]] as const),
)

export function findGridsTmProject(num: string): GridsTmProject | null {
  return GRIDS_TM_LOOKUP.get(num) ?? GRIDS_TM_LOOKUP.get(num.replace(/^#GRIDS-/, '')) ?? null
}

export function gridsTmToTriage(p: GridsTmProject): TriageProject {
  const stage =
    p.column === 'new-leads' ? 'leads' : p.column === 'complete' ? 'complete' : 'progress'
  return {
    num: p.num,
    name: p.name,
    city: p.address,
    contractor: p.contractor ?? '— no contractor invited',
    days: 14,
    bidLabel: p.bidLabel,
    status: p.opportunityStatus ?? (p.vis === 'Public' ? 'PUBLIC LEAD' : 'IN PROGRESS'),
    template: p.template,
    vis: p.vis,
    stage,
    signal: 'none',
    tier: 'watch',
    evidence: [
      { when: 'GRIDS', what: 'TM board capture — Heritage GRIDS' },
      { when: 'created', what: `Project created ${p.createdLabel}` },
      { when: 'template', what: `Project Template: ${p.template}` },
    ],
    leadType: p.column === 'new-leads' && p.vis === 'Public' ? 'discovery' : undefined,
  }
}
