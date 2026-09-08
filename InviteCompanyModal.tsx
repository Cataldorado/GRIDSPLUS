import { useState } from 'react'
import { useAppStore } from '@/state/appStore'
import { COMPANIES, uniqueCompanyId, slugify, type Company, type CompanyUser } from '@/data/customers'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface DraftUser {
  name: string
  title: string
  email: string
  phone: string
}

const EMPTY_USER: DraftUser = { name: '', title: '', email: '', phone: '' }

export function InviteCompanyModal({ onClose }: { onClose: (newCompanyId?: string) => void }) {
  const invitedCompanies = useAppStore((s) => s.invitedCompanies)
  const inviteCompany = useAppStore((s) => s.inviteCompany)

  const [companyName, setCompanyName] = useState('')
  const [city, setCity] = useState('')
  const [users, setUsers] = useState<DraftUser[]>([{ ...EMPTY_USER }])

  const validUserCount = users.filter((u) => u.name.trim() && u.email.trim()).length
  const canSubmit = companyName.trim().length > 0 && city.trim().length > 0 && validUserCount > 0

  function updateUser(i: number, patch: Partial<DraftUser>) {
    setUsers((prev) => prev.map((u, idx) => (idx === i ? { ...u, ...patch } : u)))
  }

  function addUserRow() {
    setUsers((prev) => [...prev, { ...EMPTY_USER }])
  }

  function removeUserRow(i: number) {
    setUsers((prev) => prev.filter((_, idx) => idx !== i))
  }

  function handleSubmit() {
    if (!canSubmit) return
    const existingIds = [...COMPANIES, ...invitedCompanies].map((c) => c.id)
    const id = uniqueCompanyId(companyName, existingIds)
    const companyUsers: CompanyUser[] = users
      .filter((u) => u.name.trim() && u.email.trim())
      .map((u) => ({
        id: `${id}::${slugify(u.name)}`,
        name: u.name.trim(),
        title: u.title.trim() || 'Team Member',
        email: u.email.trim(),
        phone: u.phone.trim() || '—',
        defaultRostered: true,
      }))
    const company: Company = { id, name: companyName.trim(), city: city.trim(), users: companyUsers }
    inviteCompany(company)
    onClose(id)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <Card className="max-h-[90vh] w-full max-w-lg overflow-y-auto">
        <div className="text-sm font-semibold text-slate-800">Invite a company</div>
        <p className="mt-1 text-xs text-slate-500">
          Add a new customer to GRIDS+ and grant one or more of their people access right away.
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-500">Company name</label>
            <input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Cascade Landscape Group"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-grids-blue"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">City</label>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Portland, OR"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-grids-blue"
            />
          </div>
        </div>

        <div className="mt-4 border-t border-slate-100 pt-3">
          <label className="text-xs font-semibold text-slate-500">People to add ({validUserCount} ready)</label>
          <div className="mt-2 space-y-3">
            {users.map((u, i) => (
              <div key={i} className="rounded-lg border border-slate-200 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Person {i + 1}</span>
                  {users.length > 1 && (
                    <button onClick={() => removeUserRow(i)} className="text-xs text-rose-600 hover:underline">
                      Remove
                    </button>
                  )}
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <input
                    value={u.name}
                    onChange={(e) => updateUser(i, { name: e.target.value })}
                    placeholder="Full name"
                    className="rounded-md border border-slate-300 px-2.5 py-1.5 text-sm outline-none focus:border-grids-blue"
                  />
                  <input
                    value={u.title}
                    onChange={(e) => updateUser(i, { title: e.target.value })}
                    placeholder="Title"
                    className="rounded-md border border-slate-300 px-2.5 py-1.5 text-sm outline-none focus:border-grids-blue"
                  />
                  <input
                    value={u.email}
                    onChange={(e) => updateUser(i, { email: e.target.value })}
                    placeholder="Email"
                    className="rounded-md border border-slate-300 px-2.5 py-1.5 text-sm outline-none focus:border-grids-blue"
                  />
                  <input
                    value={u.phone}
                    onChange={(e) => updateUser(i, { phone: e.target.value })}
                    placeholder="Phone"
                    className="rounded-md border border-slate-300 px-2.5 py-1.5 text-sm outline-none focus:border-grids-blue"
                  />
                </div>
              </div>
            ))}
          </div>
          <button onClick={addUserRow} className="mt-2 text-xs font-semibold text-grids-blue hover:underline">
            + Add another person
          </button>
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => onClose()}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit}>
            Invite company
          </Button>
        </div>
      </Card>
    </div>
  )
}
