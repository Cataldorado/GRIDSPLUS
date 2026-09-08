import { useState } from 'react'
import { useAppStore } from '@/state/appStore'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import type { Company, CompanyUser } from '@/data/customers'
import { COMPANIES } from '@/data/customers'
import { hasProjectAccess, isRostered } from '@/data/access'

const ACCESS_COLLAPSED_ROWS = 2 // 4-column grid, so 2 rows = 8 visible before "Show all"
const CANDIDATES_COLLAPSED_HEIGHT = 'max-h-80'

export function ProjectAccessCard({
  projectNum,
  company,
  discoveryLead = false,
}: {
  projectNum: string
  company: Company | null
  discoveryLead?: boolean
}) {
  const rosterOverrides = useAppStore((s) => s.rosterOverrides)
  const projectAccessOverrides = useAppStore((s) => s.projectAccessOverrides)
  const toggleRoster = useAppStore((s) => s.toggleRoster)
  const toggleProjectAccess = useAppStore((s) => s.toggleProjectAccess)

  const [query, setQuery] = useState('')
  const [showAllAccess, setShowAllAccess] = useState(false)

  if (discoveryLead && !company) {
    const q = query.trim().toLowerCase()
    const matches = COMPANIES.filter(
      (c) => !q || c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q),
    )

    return (
      <Card className="mt-4">
        <div className="flex items-center justify-between">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Invite contractors</div>
          <span className="text-xs text-slate-400">Public lead · no invite sent yet</span>
        </div>
        <p className="mt-2 text-sm text-slate-500">
          Search eligible companies near this project and invite them to bid — same flow as GRIDS board **Invite**.
        </p>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search company or city…"
          className="mt-3 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-grids-blue"
        />
        <div className={`mt-2 ${CANDIDATES_COLLAPSED_HEIGHT} overflow-y-auto divide-y divide-slate-100 rounded-md border border-slate-200`}>
          {matches.map((c) => (
            <div key={c.id} className="flex items-center justify-between gap-3 p-2.5">
              <div className="min-w-0">
                <div className="text-sm font-medium text-slate-800">{c.name}</div>
                <div className="text-xs text-slate-500">{c.city}</div>
              </div>
              <Button
                onClick={() => {
                  const primary = c.users[0]
                  if (primary) toggleProjectAccess(projectNum, primary.id, hasProjectAccess(rosterOverrides, projectAccessOverrides, projectNum, primary))
                }}
              >
                Invite
              </Button>
            </div>
          ))}
        </div>
      </Card>
    )
  }

  if (!company) return null

  const hasAccess = (u: CompanyUser) => hasProjectAccess(rosterOverrides, projectAccessOverrides, projectNum, u)
  const rostered = (u: CompanyUser) => isRostered(rosterOverrides, u)

  const withAccess = company.users.filter(hasAccess)
  const q = query.trim().toLowerCase()
  const candidates = company.users
    .filter((u) => !hasAccess(u))
    .filter((u) => !q || u.name.toLowerCase().includes(q) || u.title.toLowerCase().includes(q))

  const accessCollapseLimit = ACCESS_COLLAPSED_ROWS * 4
  const visibleAccess = showAllAccess ? withAccess : withAccess.slice(0, accessCollapseLimit)

  function addToProject(u: CompanyUser) {
    toggleProjectAccess(projectNum, u.id, hasAccess(u))
  }

  return (
    <Card className="mt-4">
      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Project access</div>
        <span className="text-xs text-slate-400">
          {company.name} · {withAccess.length} with access
        </span>
      </div>

      {withAccess.length ? (
        <>
          <div className="mt-3 grid grid-cols-4 gap-3">
            {visibleAccess.map((u) => (
              <div key={u.id} className="flex flex-col rounded-lg border border-slate-200 p-2.5">
                <div className="flex items-start justify-between gap-1">
                  <span className="truncate text-sm font-semibold text-slate-800" title={u.name}>
                    {u.name}
                  </span>
                </div>
                <Badge tone="success" className="mt-1 w-fit">
                  Has access
                </Badge>
                <div className="mt-1 truncate text-xs text-slate-500" title={u.title}>
                  {u.title}
                </div>
                <div className="mt-1 truncate text-xs text-grids-blue" title={u.email}>
                  {u.email}
                </div>
                <Button
                  variant="danger"
                  className="mt-2 w-full px-2 py-1 text-xs"
                  onClick={() => toggleProjectAccess(projectNum, u.id, hasAccess(u))}
                >
                  Remove from project
                </Button>
              </div>
            ))}
          </div>
          {withAccess.length > accessCollapseLimit && (
            <button
              onClick={() => setShowAllAccess((v) => !v)}
              className="mt-2 text-xs font-semibold text-grids-blue hover:underline"
            >
              {showAllAccess ? 'Show fewer' : `Show all ${withAccess.length}`}
            </button>
          )}
        </>
      ) : (
        <p className="mt-2 text-sm text-slate-400">No one has access to this project yet.</p>
      )}

      <div className="mt-4 border-t border-slate-100 pt-3">
        <label className="text-xs font-semibold text-slate-500">
          Add someone from {company.name} ({candidates.length} eligible)
        </label>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or title…"
          className="mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-grids-blue"
        />

        {candidates.length > 0 ? (
          <div className={`mt-2 ${CANDIDATES_COLLAPSED_HEIGHT} overflow-y-auto divide-y divide-slate-100 rounded-md border border-slate-200`}>
            {candidates.map((u) => (
              <div key={u.id} className="flex items-center justify-between gap-3 p-2.5">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium text-slate-800">{u.name}</span>
                    <Badge tone={rostered(u) ? 'success' : 'neutral'}>{rostered(u) ? 'Rostered' : 'Not rostered'}</Badge>
                  </div>
                  <div className="truncate text-xs text-slate-500">{u.title}</div>
                  <div className="truncate text-xs text-grids-blue">{u.email}</div>
                </div>
                <div className="flex flex-none items-center gap-1.5">
                  {!rostered(u) && (
                    <Button variant="secondary" onClick={() => toggleRoster(u.id, u.defaultRostered)}>
                      Add to All Projects
                    </Button>
                  )}
                  <Button onClick={() => addToProject(u)}>Add to project</Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-xs text-slate-400">
            {q ? `No match at ${company.name}.` : `Everyone at ${company.name} already has access.`}
          </p>
        )}
      </div>
    </Card>
  )
}
