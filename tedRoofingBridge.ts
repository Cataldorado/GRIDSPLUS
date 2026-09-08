import type { TriageProject } from '@/data/triageData'
import { TED_ROOFING_PROJECTS, type TedRoofingProject } from '@/data/tedRoofingProjects'

const TED_PREFIX = '#TED-'

export function isTedProjectNum(num: string | null): boolean {
  return !!num && num.startsWith(TED_PREFIX)
}

export function tedIdFromNum(num: string): string {
  return num.slice(TED_PREFIX.length)
}

export function findTedRoofingProject(num: string): TedRoofingProject | null {
  if (!isTedProjectNum(num)) return null
  const id = tedIdFromNum(num)
  return TED_ROOFING_PROJECTS.find((p) => p.id === id) ?? null
}

/** Map TED list row into triage detail shape for shared project detail page. */
export function tedRoofingToTriage(p: TedRoofingProject): TriageProject {
  const tier =
    p.status === 'Awaiting Designer' ? 'now' : p.status === 'Branch Review and Price' ? 'week' : 'watch'
  return {
    num: `${TED_PREFIX}${p.id}`,
    name: p.name,
    city: p.location,
    contractor: p.bidders ?? '— no bidder yet',
    days: 14,
    bidLabel: p.bidDate ?? '—',
    status: p.status,
    template: 'ROOFING',
    vis: p.isPublic ? 'Public' : 'Private',
    stage: p.status === 'Awaiting Designer' ? 'leads' : 'progress',
    signal: 'none',
    tier,
    evidence: [
      { when: 'TED', what: 'Roofing project from SRS TED list capture' },
      { when: '—', what: p.isPublic ? 'Public project in region library' : 'Private project' },
      { when: 'status', what: p.status },
    ],
    leadType: p.status === 'Awaiting Designer' && p.isPublic ? 'discovery' : undefined,
    discoveryFor: p.isPublic ? ['summit-roofing-partners'] : undefined,
  }
}
