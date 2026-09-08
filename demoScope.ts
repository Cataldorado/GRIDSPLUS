export type DemoScope = 'vision' | 'mvp'

export type DashboardViewMode = 'triage' | 'list' | 'board' | 'calendar'

export type HostPlatform = 'heritage' | 'roofhub' | 'grids'

export const DEMO_SCOPE_META: Record<
  DemoScope,
  {
    label: string
    banner: string
    dashboardTitle: string
    dashboardSub: string
  }
> = {
  vision: {
    label: 'Vision',
    banner: 'GRIDS+ Phase 0 · Vision prototype',
    dashboardTitle: 'dynamic',
    dashboardSub: 'dynamic',
  },
  mvp: {
    label: 'Phase 1 MVP',
    banner: 'GRIDS+ Phase 1 · MVP (GRIDS/TED parity)',
    dashboardTitle: 'My Projects',
    dashboardSub: 'List and board views · GRIDS/TED parity',
  },
}

/** Board columns shown per scope (keys match Dashboard colDefs). */
export const BOARD_COLUMNS_BY_SCOPE: Record<DemoScope, string[]> = {
  vision: ['leads', 'needs', 'progress', 'complete'],
  mvp: ['leads', 'progress', 'complete'],
}

export function scopeShowsNeedsDecisionSection(scope: DemoScope): boolean {
  return scope === 'vision'
}

export function scopeShowsDecisionIntelligence(scope: DemoScope): boolean {
  return scope === 'vision'
}

export function scopeDefaultViewMode(scope: DemoScope): DashboardViewMode {
  return scope === 'mvp' ? 'list' : 'triage'
}

export function scopeViewToggle(scope: DemoScope): {
  left: DashboardViewMode
  right: DashboardViewMode
  leftLabel: string
  rightLabel: string
} {
  if (scope === 'mvp') {
    return { left: 'list', right: 'board', leftLabel: 'List', rightLabel: 'Board' }
  }
  return { left: 'triage', right: 'board', leftLabel: 'Triage', rightLabel: 'Board' }
}

export function isTriageViewMode(scope: DemoScope, mode: DashboardViewMode): boolean {
  return scope === 'vision' && mode === 'triage'
}

export function isListViewMode(scope: DemoScope, mode: DashboardViewMode): boolean {
  return scope === 'mvp' && mode === 'list'
}

export function isBoardViewMode(mode: DashboardViewMode): boolean {
  return mode === 'board'
}

/** Phase 1 MVP on RoofHub — TED roofing list parity (screenshot capture). */
export function scopeUsesTedRoofingParity(scope: DemoScope, host: HostPlatform): boolean {
  return scope === 'mvp' && host === 'roofhub'
}

/** Phase 1 MVP on Heritage+ / GRIDS+ — GRIDS TM board parity (screenshot capture). */
export function scopeUsesGridsTmParity(scope: DemoScope, host: HostPlatform): boolean {
  return scope === 'mvp' && (host === 'heritage' || host === 'grids')
}

export function scopeUsesMvpParityDashboard(scope: DemoScope, host: HostPlatform): boolean {
  return scopeUsesTedRoofingParity(scope, host) || scopeUsesGridsTmParity(scope, host)
}