export type DoorModel = 'open' | 'closed'
export type UserType = 'not-rostered' | 'rostered-has-projects' | 'rostered-empty'
export type EntryPath = 'from-h+' | 'direct'
export type CompareAxis = 'door' | 'roster'

export interface DemoProject {
  name: string
  status: string
  quotes: number | null
}

export interface DemoPersona {
  name: string
  company: string
  rostered: boolean
  projects: DemoProject[]
}

export const PERSONAS: Record<UserType, DemoPersona> = {
  'not-rostered': { name: 'Jake Porter', company: 'Brightview Landscape', rostered: false, projects: [] },
  'rostered-has-projects': {
    name: 'Maria Estimator',
    company: 'Brightview Landscape',
    rostered: true,
    projects: [
      { name: 'Riverside Phase 2', status: 'Active', quotes: 3 },
      { name: 'Office Park Irrigation', status: 'Draft', quotes: null },
    ],
  },
  'rostered-empty': { name: 'Pat Chen', company: 'Brightview Landscape', rostered: true, projects: [] },
}

export const USER_TYPE_LABEL: Record<UserType, string> = {
  'not-rostered': 'Not on commercial roster',
  'rostered-has-projects': 'On commercial roster · has projects',
  'rostered-empty': 'On commercial roster · no projects yet',
}

export const DOOR_LABEL: Record<DoorModel, string> = {
  open: 'Open Door',
  closed: 'Closed Door',
}

/** Keyed by `${door}-${rosterGroup}` where rosterGroup collapses both rostered user types. */
export const BUSINESS_RISK: Record<string, string> = {
  'open-not-rostered': 'Empty/confused users; TM request volume; must solve roster + onboarding dynamically',
  'open-rostered': 'Lowest friction for commercial users; aligns with "discover then qualify"',
  'closed-not-rostered': 'Strongest gate; risk of blocked customers if roster lag; TM must add before first project',
  'closed-rostered': 'Same commercial UX; shoppers never see GRIDS+ entry',
}

export function rosterGroup(userType: UserType): 'not-rostered' | 'rostered' {
  return userType === 'not-rostered' ? 'not-rostered' : 'rostered'
}

export function canOpenApp(door: DoorModel, userType: UserType): boolean {
  if (door === 'open') return true
  return userType !== 'not-rostered'
}

export function seesProjects(userType: UserType): boolean {
  return userType === 'rostered-has-projects'
}

export function annotationFor(door: DoorModel, userType: UserType): string {
  if (userType === 'not-rostered') {
    return door === 'open'
      ? 'Open door · Not rostered · Can enter app · Roster gate = content'
      : 'Closed door · Not rostered · App blocked'
  }
  if (userType === 'rostered-has-projects') {
    return door === 'open' ? 'Open door · Rostered · Full workflow' : 'Closed door · Rostered · Same as open door for commercial users'
  }
  return door === 'open'
    ? 'Open door · Rostered · Empty board · WQ-2 may add request flows later'
    : 'Closed door · Rostered · Empty board · Same as open door for commercial users'
}

export const WALKTHROUGH_STEPS: {
  label: string
  description: string
}[] = [
  { label: '1. Open vs Closed (not-rostered)', description: 'Open not-rostered vs Closed not-rostered, direct entry' },
  { label: '2. Roster changes it (Open door)', description: 'Open not-rostered vs Open rostered — same door, roster differs' },
  { label: '3. H+ nav visibility', description: 'Closed H+ nav hidden vs Open H+ nav visible (not-rostered)' },
  { label: '4. Rostered + projects', description: 'Identical on both doors' },
  { label: '5. Rostered, empty board', description: 'Identical on both doors' },
  { label: '6. Summary', description: 'Door model only changes who gets in' },
]

export const SUMMARY_TEXT =
  'Door model only changes who gets in and what not-rostered users see — roster and project assignment are separate decisions.'
