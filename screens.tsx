import { useState, type ReactNode } from 'react'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import {
  BUSINESS_RISK,
  DOOR_LABEL,
  USER_TYPE_LABEL,
  canOpenApp,
  rosterGroup,
  seesProjects,
  type DemoPersona,
  type DoorModel,
  type UserType,
} from '@/data/decisionDemoData'

export function SignedOutGateScreen({
  onSignInHeritage,
  onSignInRoofHub,
}: {
  onSignInHeritage: () => void
  onSignInRoofHub: () => void
}) {
  return (
    <div className="flex min-h-full flex-col bg-grids-navy text-white">
      <header className="flex items-center gap-2 px-6 py-4 font-bold">
        <span className="flex h-6 w-6 items-center justify-center rounded-sm bg-heritage-green text-[10px]">G+</span>
        GRIDS+
      </header>

      <div className="border-y border-white/10 bg-white/5 px-6 py-1.5 font-mono text-[11px] text-amber-300">
        No session · Pre-auth · Door model doesn't apply yet
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <h1 className="text-2xl font-bold">Sign in to continue</h1>
        <p className="mt-3 max-w-md text-sm text-white/60">
          GRIDS+ is accessed through your Heritage+ or RoofHub account — there's no separate GRIDS+ login.
        </p>
        <div className="mt-6 flex gap-3">
          <Button onClick={onSignInHeritage}>Sign in with Heritage+</Button>
          <Button variant="secondary" onClick={onSignInRoofHub}>
            Sign in with RoofHub
          </Button>
        </div>
        <div className="mt-10 max-w-md rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-left text-xs text-white/50">
          Door model and roster status only take effect after authentication — an anonymous visitor sees this same
          gate regardless of whether GRIDS+ is set to Open or Closed door.
        </div>
      </div>
    </div>
  )
}

export function HeritageEntryScreen({
  persona,
  showCommercialNav,
  onEnterCommercial,
  footerNote,
}: {
  persona: DemoPersona
  showCommercialNav: boolean
  onEnterCommercial: () => void
  footerNote?: string
}) {
  return (
    <div className="flex min-h-full flex-col bg-white">
      <header className="flex flex-wrap items-center gap-5 border-b border-slate-200 px-6 py-3">
        <div className="flex flex-none items-center gap-2 font-extrabold text-grids-navy">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-grids-navy text-sm font-bold text-white">H</div>
          HERITAGE+
        </div>
        <nav className="flex flex-wrap items-center gap-5 text-sm font-medium text-slate-600">
          <span>Shop</span>
          <span>Products</span>
          <span>Orders</span>
          <span>Account</span>
          {showCommercialNav ? (
            <button onClick={onEnterCommercial} className="flex items-center gap-1.5 font-bold text-grids-navy hover:underline">
              <span className="flex h-4 w-4 items-center justify-center rounded-sm bg-heritage-green text-[10px] text-white">
                G
              </span>
              GRIDS+
            </button>
          ) : (
            <span className="flex items-center gap-1 text-slate-300" title="Not available to this account">
              🔒 GRIDS+
            </span>
          )}
        </nav>
        <div className="flex-1" />
        <span className="text-sm text-slate-600">{persona.name}</span>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <h1 className="text-2xl font-bold text-slate-800">Welcome back, {persona.company}</h1>
        <p className="mt-2 max-w-md text-sm text-slate-500">
          Shop products, manage orders, and reorder your essentials at {persona.company}.
        </p>
      </div>

      {footerNote && (
        <div className="bg-slate-900 px-6 py-2 text-center text-xs text-white/80">{footerNote}</div>
      )}
    </div>
  )
}

export function GridsChrome({
  persona,
  annotation,
  onReturnToHeritage,
  children,
}: {
  persona: DemoPersona
  annotation: string
  onReturnToHeritage: () => void
  children: ReactNode
}) {
  return (
    <div className="flex min-h-full flex-col bg-surface">
      <header className="flex flex-wrap items-center gap-4 bg-grids-navy px-6 py-3 text-white">
        <div className="flex flex-none items-center gap-2 font-bold">
          <span className="flex h-6 w-6 items-center justify-center rounded-sm bg-heritage-green text-[10px]">G+</span>
          GRIDS+
        </div>
        <span className="text-white/30">|</span>
        <span className="text-sm text-white/70">{persona.company}</span>
        <nav className="ml-4 flex flex-wrap items-center gap-5 text-sm text-white/80">
          <span>Projects</span>
          <span>Quotes</span>
          <span>Documents</span>
        </nav>
        <div className="flex-1" />
        <div className="flex items-center gap-2 text-xs">
          <button onClick={onReturnToHeritage} className="rounded-full bg-white/10 px-2.5 py-1 hover:bg-white/20">
            Heritage+
          </button>
          <span className="rounded-full bg-white/10 px-2.5 py-1">RoofHub</span>
        </div>
        <span className="text-xs text-white/50">Help</span>
        <span className="text-sm font-semibold">{persona.name}</span>
      </header>

      <div className="border-b border-amber-200 bg-amber-50 px-6 py-1.5 font-mono text-[11px] text-amber-700">
        {annotation}
      </div>

      <div className="flex-1 px-6 py-8">{children}</div>
    </div>
  )
}

export function EncouragingEmptyState({
  onContactTm,
  onReturnToHeritage,
}: {
  onContactTm: () => void
  onReturnToHeritage: () => void
}) {
  return (
    <div className="mx-auto max-w-xl py-8 text-center">
      <h1 className="text-2xl font-bold text-slate-800">Commercial design &amp; quoting live here</h1>
      <div className="mt-4 space-y-3 text-left text-sm text-slate-600">
        <p>GRIDS+ is where your team manages commercial design projects, takeoffs, quotes, and orders.</p>
        <p>
          Your Heritage+ account is linked to <strong>Brightview Landscape</strong>, but you are{' '}
          <strong>not set up for commercial work yet</strong>.
        </p>
        <p>If you estimate, bid, or manage commercial projects, ask your Territory Manager to add you to the commercial roster.</p>
      </div>
      <div className="mt-6 flex justify-center gap-3">
        <Button onClick={onContactTm}>Contact my Territory Manager</Button>
        <Button variant="secondary" onClick={onReturnToHeritage}>
          Return to Heritage+
        </Button>
      </div>
    </div>
  )
}

export function AccessDeniedScreen({ onReturnToHeritage }: { onReturnToHeritage: () => void }) {
  return (
    <div className="mx-auto max-w-xl py-8 text-center">
      <h1 className="text-2xl font-bold text-slate-800">You don't have access to GRIDS+</h1>
      <div className="mt-4 space-y-3 text-left text-sm text-slate-600">
        <p>Commercial projects and quotes in GRIDS+ are limited to users your Territory Manager has approved for commercial work.</p>
        <p>Your Heritage+ account does not include commercial access.</p>
      </div>
      <div className="mt-6 flex justify-center">
        <Button onClick={onReturnToHeritage}>Return to Heritage+</Button>
      </div>
    </div>
  )
}

export function ProjectDashboardScreen({ persona }: { persona: DemoPersona }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800">My Projects</h1>
        <Button>+ New Project</Button>
      </div>
      <Card className="mt-4" padded={false}>
        <div className="divide-y divide-slate-100">
          {persona.projects.map((p) => (
            <div key={p.name} className="flex items-center justify-between p-4">
              <span className="text-sm font-semibold text-slate-800">{p.name}</span>
              <div className="flex items-center gap-3">
                <Badge tone={p.status === 'Active' ? 'success' : 'neutral'}>{p.status}</Badge>
                <span className="w-16 text-right text-xs text-slate-400">{p.quotes != null ? `${p.quotes} quotes` : '—'}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export function FirstProjectEmptyScreen({ persona }: { persona: DemoPersona }) {
  return (
    <div className="mx-auto max-w-xl py-8 text-center">
      <h1 className="text-2xl font-bold text-slate-800">Start your first commercial project</h1>
      <div className="mt-4 space-y-2 text-sm text-slate-600">
        <p>
          You're set up for commercial work at <strong>{persona.company}</strong>.
        </p>
        <p>Upload or create your first project to begin takeoff, design, and quoting in GRIDS+.</p>
      </div>
      <div className="mt-6 flex justify-center gap-3">
        <Button>+ New Project</Button>
        <Button variant="secondary">Learn how commercial projects work</Button>
      </div>
    </div>
  )
}

export function DecisionSummaryFooter({ door, userType }: { door: DoorModel; userType: UserType }) {
  const [open, setOpen] = useState(false)
  const risk = BUSINESS_RISK[`${door}-${rosterGroup(userType)}`]

  return (
    <div className="mt-8 rounded-lg border border-slate-200 bg-white text-xs">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-2.5 font-semibold text-slate-600"
      >
        <span>Decision summary</span>
        <span className="text-slate-400">{open ? '▾ hide' : '▸ show'}</span>
      </button>
      {open && (
        <div className="grid grid-cols-2 gap-3 border-t border-slate-100 px-4 py-3 text-slate-600 sm:grid-cols-4">
          <div>
            <div className="text-slate-400">Door model</div>
            <div className="font-semibold text-slate-800">{DOOR_LABEL[door]}</div>
          </div>
          <div>
            <div className="text-slate-400">Roster status</div>
            <div className="font-semibold text-slate-800">{USER_TYPE_LABEL[userType]}</div>
          </div>
          <div>
            <div className="text-slate-400">Can open app?</div>
            <div className="font-semibold text-slate-800">{canOpenApp(door, userType) ? 'Y' : 'N'}</div>
          </div>
          <div>
            <div className="text-slate-400">Sees projects?</div>
            <div className="font-semibold text-slate-800">{seesProjects(userType) ? 'Y' : 'N'}</div>
          </div>
          <div className="col-span-2 sm:col-span-4">
            <div className="text-slate-400">Business risk</div>
            <div className="font-semibold text-slate-800">{risk}</div>
          </div>
        </div>
      )}
    </div>
  )
}
