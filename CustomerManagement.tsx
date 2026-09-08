import { useMemo, useState } from 'react'
import { useAppStore } from '@/state/appStore'
import { COMPANIES, type Company } from '@/data/customers'
import { STATIC_PROJECTS } from '@/data/triageData'
import { PROJECT } from '@/data/sampleData'
import { isRostered } from '@/data/access'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { InviteCompanyModal } from './customer-management/InviteCompanyModal'

function projectCountFor(companyName: string): number {
  const all = [...STATIC_PROJECTS, ...(companyName === PROJECT.customer.company ? [{ contractor: companyName }] : [])]
  return all.filter((p) => p.contractor === companyName).length
}

export function CustomerManagement() {
  const persona = useAppStore((s) => s.persona)
  const rosterOverrides = useAppStore((s) => s.rosterOverrides)
  const toggleRoster = useAppStore((s) => s.toggleRoster)
  const invitedCompanies = useAppStore((s) => s.invitedCompanies)

  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [showInvite, setShowInvite] = useState(false)
  const [userQuery, setUserQuery] = useState('')

  const allCompanies = useMemo(() => [...COMPANIES, ...invitedCompanies], [invitedCompanies])

  const filtered = useMemo(
    () => allCompanies.filter((c) => c.name.toLowerCase().includes(query.toLowerCase())),
    [allCompanies, query],
  )

  const selected: Company | undefined = allCompanies.find((c) => c.id === selectedId)

  const uq = userQuery.trim().toLowerCase()
  const visibleUsers = selected
    ? selected.users.filter((u) => !uq || u.name.toLowerCase().includes(uq) || u.email.toLowerCase().includes(uq))
    : []

  if (persona !== 'tm') {
    return (
      <Card className="py-12 text-center">
        <p className="text-sm text-slate-500">
          Customer management is available to Territory Managers. Switch to that persona (top right) to search
          companies and manage GRIDS+ access.
        </p>
      </Card>
    )
  }

  if (selected) {
    return (
      <div>
        <button onClick={() => setSelectedId(null)} className="text-xs text-grids-blue">
          ← Back to companies
        </button>
        <div className="mt-2 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">{selected.name}</h1>
            <p className="text-xs text-slate-400">
              {selected.city} · {projectCountFor(selected.name)} project{projectCountFor(selected.name) === 1 ? '' : 's'}
            </p>
          </div>
          <Badge tone="info">
            {selected.users.filter((u) => isRostered(rosterOverrides, u)).length} of {selected.users.length} rostered
          </Badge>
        </div>

        <input
          value={userQuery}
          onChange={(e) => setUserQuery(e.target.value)}
          placeholder="Search users by name or email…"
          className="mt-4 w-full max-w-md rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-grids-blue"
        />

        <Card className="mt-4" padded={false}>
          <div className="divide-y divide-slate-100">
            {visibleUsers.map((u) => {
              const rostered = isRostered(rosterOverrides, u)
              return (
                <div key={u.id} className="flex items-center justify-between p-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-800">{u.name}</span>
                      <Badge tone={rostered ? 'success' : 'neutral'}>{rostered ? 'Rostered' : 'No access'}</Badge>
                    </div>
                    <div className="text-xs text-slate-500">{u.title}</div>
                    <div className="mt-0.5 text-xs text-grids-blue">{u.email}</div>
                    <div className="text-xs text-slate-400">{u.phone}</div>
                  </div>
                  <Button
                    variant={rostered ? 'secondary' : 'primary'}
                    onClick={() => toggleRoster(u.id, u.defaultRostered)}
                  >
                    {rostered ? 'Remove access' : 'Add to All Projects'}
                  </Button>
                </div>
              )
            })}
            {visibleUsers.length === 0 && (
              <p className="p-4 text-sm text-slate-400">No users match “{userQuery}”.</p>
            )}
          </div>
        </Card>
        <p className="mt-2 text-xs text-slate-400">
          Rostered users can see and act on {selected.name}'s projects in GRIDS+ going forward. Removing access
          doesn't affect work already done — only what they can reach next.
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Customer Management</h1>
          <p className="text-sm text-slate-500">Search a company, then roster or remove the individuals who should have GRIDS+ access.</p>
        </div>
        <Button onClick={() => setShowInvite(true)} className="flex-none">
          + Invite company
        </Button>
      </div>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search companies…"
        className="mt-4 w-full max-w-md rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-grids-blue"
      />

      <Card className="mt-4" padded={false}>
        <div className="divide-y divide-slate-100">
          {filtered.map((c) => {
            const rosteredCount = c.users.filter((u) => isRostered(rosterOverrides, u)).length
            return (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedId(c.id)
                  setUserQuery('')
                }}
                className="flex w-full items-center justify-between p-4 text-left hover:bg-slate-50"
              >
                <div>
                  <div className="text-sm font-semibold text-slate-800">{c.name}</div>
                  <div className="text-xs text-slate-400">
                    {c.city} · {projectCountFor(c.name)} project{projectCountFor(c.name) === 1 ? '' : 's'}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge tone={rosteredCount > 0 ? 'success' : 'neutral'}>
                    {rosteredCount} of {c.users.length} rostered
                  </Badge>
                  <span className="text-xs font-semibold text-grids-blue">View users →</span>
                </div>
              </button>
            )
          })}
          {filtered.length === 0 && <p className="p-4 text-sm text-slate-400">No companies match that search.</p>}
        </div>
      </Card>

      {showInvite && (
        <InviteCompanyModal
          onClose={(newCompanyId) => {
            setShowInvite(false)
            if (newCompanyId) {
              setSelectedId(newCompanyId)
              setUserQuery('')
            }
          }}
        />
      )}
    </div>
  )
}
