import type { TedRoofingProject, TedRoofingStatus } from '@/data/tedRoofingProjects'

const COLUMNS: TedRoofingStatus[] = ['Awaiting Designer', 'Design In Progress', 'Branch Review and Price']

interface Props {
  rows: TedRoofingProject[]
  onOpenProject: (p: TedRoofingProject) => void
  onAddBidder: (p: TedRoofingProject) => void
  canManageBidders: boolean
}

export function TedBoardView({ rows, onOpenProject, onAddBidder, canManageBidders }: Props) {
  return (
    <div className="grid grid-cols-3 gap-3 p-4">
      {COLUMNS.map((status) => {
        const items = rows.filter((p) => p.status === status)
        return (
          <section key={status} className="min-w-0 rounded border border-slate-200 bg-slate-50">
            <h2 className="border-b border-slate-200 bg-white px-3 py-2 text-[12px] font-bold text-slate-800">
              {status}
              <span className="ml-2 font-mono text-slate-400">{items.length}</span>
            </h2>
            <div className="flex flex-col gap-2 p-2">
              {items.map((p) => (
                <article key={p.id} className="rounded border border-slate-200 bg-white p-2.5 shadow-sm">
                  <div className="flex items-center gap-1.5">
                    {p.isPublic && (
                      <span className="rounded-sm bg-[#c41e3a] px-1 py-0.5 text-[8px] font-bold uppercase text-white">
                        Public
                      </span>
                    )}
                    <span className="font-mono text-[10px] text-slate-500">{p.id}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenProject(p)}
                    className="mt-1 block text-left text-[13px] font-semibold text-[#c41e3a] hover:underline"
                  >
                    {p.name}
                  </button>
                  <div className="mt-0.5 text-[11px] text-slate-600">{p.location}</div>
                  {p.bidders && (
                    <div className="mt-1 truncate text-[11px] text-[#c41e3a]">{p.bidders}</div>
                  )}
                  {canManageBidders && (
                    <button
                      type="button"
                      onClick={() => onAddBidder(p)}
                      className="mt-2 w-full rounded border border-slate-400 bg-[#4a4a4a] py-1 text-[11px] font-semibold text-white"
                    >
                      + Bidder
                    </button>
                  )}
                </article>
              ))}
              {items.length === 0 && (
                <p className="px-2 py-6 text-center text-[11px] text-slate-400">No projects</p>
              )}
            </div>
          </section>
        )
      })}
    </div>
  )
}
