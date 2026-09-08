import { useState, type ReactNode } from 'react'
import clsx from 'clsx'
import { useAppStore } from '@/state/appStore'
import {
  PERSONAS,
  USER_TYPE_LABEL,
  DOOR_LABEL,
  WALKTHROUGH_STEPS,
  SUMMARY_TEXT,
  annotationFor,
  type DoorModel,
  type UserType,
  type EntryPath,
  type CompareAxis,
} from '@/data/decisionDemoData'
import {
  SignedOutGateScreen,
  HeritageEntryScreen,
  GridsChrome,
  EncouragingEmptyState,
  AccessDeniedScreen,
  ProjectDashboardScreen,
  FirstProjectEmptyScreen,
  DecisionSummaryFooter,
} from './screens'

const DOOR_OPTIONS: DoorModel[] = ['open', 'closed']
const USER_TYPE_OPTIONS: UserType[] = ['not-rostered', 'rostered-has-projects', 'rostered-empty']
const ENTRY_OPTIONS: EntryPath[] = ['from-h+', 'direct']

function GridsScreenFor({
  door,
  userType,
  onReturnToHeritage,
}: {
  door: DoorModel
  userType: UserType
  onReturnToHeritage: () => void
}) {
  const persona = PERSONAS[userType]
  const annotation = annotationFor(door, userType)

  let body
  if (userType === 'not-rostered') {
    body =
      door === 'open' ? (
        <EncouragingEmptyState onContactTm={() => {}} onReturnToHeritage={onReturnToHeritage} />
      ) : (
        <AccessDeniedScreen onReturnToHeritage={onReturnToHeritage} />
      )
  } else if (userType === 'rostered-has-projects') {
    body = <ProjectDashboardScreen persona={persona} />
  } else {
    body = <FirstProjectEmptyScreen persona={persona} />
  }

  return (
    <GridsChrome persona={persona} annotation={annotation} onReturnToHeritage={onReturnToHeritage}>
      {body}
      <DecisionSummaryFooter door={door} userType={userType} />
    </GridsChrome>
  )
}

function SingleView({
  door,
  userType,
  entry,
  transitioned,
  onEnterCommercial,
  onReturnToHeritage,
}: {
  door: DoorModel
  userType: UserType
  entry: EntryPath
  transitioned: boolean
  onEnterCommercial: () => void
  onReturnToHeritage: () => void
}) {
  const persona = PERSONAS[userType]
  const showCommercialNav = !(door === 'closed' && userType === 'not-rostered')

  if (entry === 'from-h+' && !transitioned) {
    return (
      <HeritageEntryScreen
        persona={persona}
        showCommercialNav={showCommercialNav}
        onEnterCommercial={onEnterCommercial}
        footerNote={
          !showCommercialNav ? 'Closed door: Jake would not discover GRIDS+ from Heritage+ navigation.' : undefined
        }
      />
    )
  }

  return <GridsScreenFor door={door} userType={userType} onReturnToHeritage={onReturnToHeritage} />
}

function ComparePane({
  door,
  userType,
  entry,
  onReturnToHeritage,
}: {
  door: DoorModel
  userType: UserType
  entry: EntryPath
  onReturnToHeritage: () => void
}) {
  const persona = PERSONAS[userType]
  const showCommercialNav = !(door === 'closed' && userType === 'not-rostered')

  if (entry === 'from-h+') {
    return (
      <HeritageEntryScreen
        persona={persona}
        showCommercialNav={showCommercialNav}
        onEnterCommercial={() => {}}
        footerNote={
          !showCommercialNav ? 'Closed door: Jake would not discover GRIDS+ from Heritage+ navigation.' : undefined
        }
      />
    )
  }

  return <GridsScreenFor door={door} userType={userType} onReturnToHeritage={onReturnToHeritage} />
}

function CompareView({
  door,
  userType,
  entry,
  axis,
  onReturnToHeritage,
}: {
  door: DoorModel
  userType: UserType
  entry: EntryPath
  axis: CompareAxis
  onReturnToHeritage: () => void
}) {
  const left = axis === 'door' ? { door: 'open' as DoorModel, userType } : { door, userType: 'not-rostered' as UserType }
  const right =
    axis === 'door' ? { door: 'closed' as DoorModel, userType } : { door, userType: 'rostered-has-projects' as UserType }

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="overflow-hidden rounded-lg border border-slate-200">
        <div className="bg-slate-100 px-4 py-1.5 text-center text-xs font-semibold text-slate-500">
          {axis === 'door' ? DOOR_LABEL[left.door] : USER_TYPE_LABEL[left.userType]}
        </div>
        <ComparePane door={left.door} userType={left.userType} entry={entry} onReturnToHeritage={onReturnToHeritage} />
      </div>
      <div className="overflow-hidden rounded-lg border border-slate-200">
        <div className="bg-slate-100 px-4 py-1.5 text-center text-xs font-semibold text-slate-500">
          {axis === 'door' ? DOOR_LABEL[right.door] : USER_TYPE_LABEL[right.userType]}
        </div>
        <ComparePane door={right.door} userType={right.userType} entry={entry} onReturnToHeritage={onReturnToHeritage} />
      </div>
    </div>
  )
}

function SummaryScreen() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center py-20 text-center">
      <span className="rounded-full bg-heritage-green/10 px-3 py-1 text-xs font-semibold text-heritage-green">
        Step 6 · Summary
      </span>
      <h1 className="mt-4 text-3xl font-bold text-slate-800">{SUMMARY_TEXT}</h1>
      <p className="mt-4 text-sm text-slate-500">
        Roster and project assignment stay the same regardless of door model — only entry (Open vs Closed) and what a
        not-rostered user sees change.
      </p>
    </div>
  )
}

export function DecisionDemo() {
  const setView = useAppStore((s) => s.setView)

  const [loggedIn, setLoggedIn] = useState(true)
  const [door, setDoor] = useState<DoorModel>('open')
  const [userType, setUserType] = useState<UserType>('not-rostered')
  const [entry, setEntry] = useState<EntryPath>('from-h+')
  const [transitioned, setTransitioned] = useState(false)
  const [compare, setCompare] = useState(false)
  const [compareAxis, setCompareAxis] = useState<CompareAxis>('door')
  const [step, setStep] = useState<number | null>(null)

  function selectLoggedIn(v: boolean) {
    setLoggedIn(v)
    resetTransition()
    setStep(null)
  }
  function signInWith(path: EntryPath) {
    setLoggedIn(true)
    setEntry(path)
    resetTransition()
  }

  function resetTransition() {
    setTransitioned(false)
  }

  function selectDoor(d: DoorModel) {
    setDoor(d)
    resetTransition()
    setStep(null)
  }
  function selectUserType(u: UserType) {
    setUserType(u)
    resetTransition()
    setStep(null)
  }
  function selectEntry(e: EntryPath) {
    setEntry(e)
    resetTransition()
    setStep(null)
  }
  function toggleCompare() {
    setCompare((v) => !v)
    setStep(null)
  }
  function onReturnToHeritage() {
    setEntry('from-h+')
    resetTransition()
  }

  function applyStep(n: number) {
    setStep(n)
    setLoggedIn(true)
    if (n === 1) {
      setCompare(true)
      setCompareAxis('door')
      setUserType('not-rostered')
      setEntry('direct')
    } else if (n === 2) {
      setCompare(true)
      setCompareAxis('roster')
      setDoor('open')
      setEntry('direct')
    } else if (n === 3) {
      setCompare(true)
      setCompareAxis('door')
      setUserType('not-rostered')
      setEntry('from-h+')
    } else if (n === 4) {
      setCompare(true)
      setCompareAxis('door')
      setUserType('rostered-has-projects')
      setEntry('direct')
    } else if (n === 5) {
      setCompare(true)
      setCompareAxis('door')
      setUserType('rostered-empty')
      setEntry('direct')
    } else if (n === 6) {
      setCompare(false)
    }
    resetTransition()
  }

  return (
    <div className="min-h-svh bg-surface-alt">
      <div className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 px-6 py-3 backdrop-blur">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <div className="flex flex-none items-center gap-2">
            <span className="rounded-full bg-slate-900 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white">
              Decision demo · WQ-1
            </span>
            <span className="text-[10px] font-medium tracking-wide text-slate-400">Not final UX</span>
          </div>

          <ControlGroup label="Session">
            <ToggleButton active={loggedIn} onClick={() => selectLoggedIn(true)}>
              Logged in
            </ToggleButton>
            <ToggleButton active={!loggedIn} onClick={() => selectLoggedIn(false)}>
              Not logged in
            </ToggleButton>
          </ControlGroup>

          <div className={clsx('flex flex-wrap items-center gap-x-6 gap-y-3', !loggedIn && 'pointer-events-none opacity-40')}>
            <ControlGroup label="Door model">
              {DOOR_OPTIONS.map((d) => (
                <ToggleButton key={d} active={door === d} onClick={() => selectDoor(d)}>
                  {DOOR_LABEL[d]}
                </ToggleButton>
              ))}
            </ControlGroup>

            <ControlGroup label="User type">
              {USER_TYPE_OPTIONS.map((u) => (
                <ToggleButton key={u} active={userType === u} onClick={() => selectUserType(u)}>
                  {PERSONAS[u].name.split(' ')[0]} · {USER_TYPE_LABEL[u]}
                </ToggleButton>
              ))}
            </ControlGroup>

            <ControlGroup label="Entry path">
              {ENTRY_OPTIONS.map((e) => (
                <ToggleButton key={e} active={entry === e} onClick={() => selectEntry(e)}>
                  {e === 'from-h+' ? 'From Heritage+' : 'Direct to GRIDS+'}
                </ToggleButton>
              ))}
            </ControlGroup>

            <ControlGroup label="Compare">
              <ToggleButton active={compare} onClick={toggleCompare}>
                {compare ? 'On' : 'Off'}
              </ToggleButton>
              {compare && (
                <>
                  <ToggleButton active={compareAxis === 'door'} onClick={() => setCompareAxis('door')}>
                    vs. Door
                  </ToggleButton>
                  <ToggleButton active={compareAxis === 'roster'} onClick={() => setCompareAxis('roster')}>
                    vs. Roster
                  </ToggleButton>
                </>
              )}
            </ControlGroup>
          </div>

          <div className="flex-1" />
          <button onClick={() => setView('home')} className="flex-none text-xs font-semibold text-grids-blue hover:underline">
            ← Exit demo
          </button>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-2.5">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Walkthrough:</span>
          {WALKTHROUGH_STEPS.map((s, i) => (
            <button
              key={s.label}
              onClick={() => applyStep(i + 1)}
              title={s.description}
              className={clsx(
                'rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors',
                step === i + 1 ? 'bg-grids-navy text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 py-6">
        {!loggedIn ? (
          <div className="overflow-hidden rounded-lg border border-slate-200">
            <SignedOutGateScreen onSignInHeritage={() => signInWith('from-h+')} onSignInRoofHub={() => signInWith('direct')} />
          </div>
        ) : step === 6 ? (
          <SummaryScreen />
        ) : compare ? (
          <CompareView door={door} userType={userType} entry={entry} axis={compareAxis} onReturnToHeritage={onReturnToHeritage} />
        ) : (
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
            <SingleView
              door={door}
              userType={userType}
              entry={entry}
              transitioned={transitioned}
              onEnterCommercial={() => setTransitioned(true)}
              onReturnToHeritage={onReturnToHeritage}
            />
          </div>
        )}
      </div>
    </div>
  )
}

function ControlGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-none items-center gap-1.5">
      <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</span>
      <div className="flex items-center gap-1">{children}</div>
    </div>
  )
}

function ToggleButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors',
        active ? 'bg-grids-navy text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
      )}
    >
      {children}
    </button>
  )
}
