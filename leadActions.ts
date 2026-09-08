import type { TriagePersonaKey, TriageProject } from '@/data/triageData'

export type LeadDisposition = 'interested' | 'archived'

export interface LeadCardAction {
  label: string
  tone: 'primary' | 'secondary'
  onClick: () => void
}

export function isDiscoveryLead(p: TriageProject): boolean {
  return p.leadType === 'discovery'
}

export function displayLeadStatus(p: TriageProject, disposition: Record<string, LeadDisposition>): string {
  if (disposition[p.num] === 'interested') return 'ACTIVE OPPORTUNITY'
  return p.status
}

/** Board/list stage after customer interest or TM archive. */
export function effectiveBoardStage(p: TriageProject, disposition: Record<string, LeadDisposition>): TriageProject['stage'] {
  if (disposition[p.num] === 'interested') return 'progress'
  return p.stage
}

export function isLeadHidden(p: TriageProject, disposition: Record<string, LeadDisposition>): boolean {
  return disposition[p.num] === 'archived'
}

export function discoveryLeadChip(personaKey: TriagePersonaKey): string {
  return personaKey === 'customer' ? 'In your radius' : 'Public lead'
}

export function discoveryLeadWhy(personaKey: TriagePersonaKey): string {
  return personaKey === 'customer'
    ? 'Public project — review and show interest'
    : 'Public project — invite contractors or archive'
}

export function leadActionsFor(
  p: TriageProject,
  personaKey: TriagePersonaKey,
  handlers: {
    onExpressInterest: () => void
    onArchive: () => void
    onInvite: () => void
  },
): LeadCardAction[] {
  if (!isDiscoveryLead(p)) return []

  if (personaKey === 'customer') {
    return [
      { label: 'Interested', tone: 'primary', onClick: handlers.onExpressInterest },
      { label: 'Not interested', tone: 'secondary', onClick: handlers.onArchive },
    ]
  }

  return [
    { label: 'Invite', tone: 'primary', onClick: handlers.onInvite },
    { label: 'Archive', tone: 'secondary', onClick: handlers.onArchive },
  ]
}

export const LEAD_ACTION_STYLES = {
  primary: {
    bg: 'oklch(0.68 0.17 52)',
    fg: 'oklch(0.99 0.01 85)',
    shadow: '0 1px 2px oklch(0.55 0.13 52 / .35)',
  },
  secondary: {
    bg: 'white',
    fg: 'oklch(0.42 0.02 255)',
    shadow: 'inset 0 0 0 1px oklch(0.9 0.008 255)',
  },
  invite: {
    bg: 'oklch(0.95 0.035 255)',
    fg: 'oklch(0.42 0.16 255)',
    shadow: 'inset 0 0 0 1px oklch(0.72 0.1 255 / .55)',
  },
} as const
