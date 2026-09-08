import type { TedRoofingProject } from '@/data/tedRoofingProjects'

interface Props {
  rows: TedRoofingProject[]
  onOpenProject: (p: TedRoofingProject) => void
  onAddBidder: (p: TedRoofingProject) => void
  canManageBidders: boolean
}

export function TedListTable({ rows, onOpenProject, onAddBidder, canManageBidders }: Props) {
  if (rows.length === 0) {
    return (
      <div className="px-6 py-16 text-center text-sm text-slate-500">
        No roofing projects match your search. Try clearing filters or unchecking My Projects Only.
      </div>
    )
  }

  return (
    <table className="w-full border-collapse text-[13px]">
      <thead>
        <tr className="bg-[#1a1a1a] text-left text-[12px] font-bold text-white">
          <th className="w-8 px-2 py-2.5" />
          <th className="w-[88px] px-2 py-2.5">#</th>
          <th className="min-w-[200px] px-3 py-2.5">Project</th>
          <th className="min-w-[140px] px-3 py-2.5">Location</th>
          <th className="min-w-[200px] px-3 py-2.5">Bidders</th>
          <th className="min-w-[160px] px-3 py-2.5">Status</th>
          <th className="w-[100px] px-3 py-2.5">Bid Date</th>
          <th className="w-[100px] px-2 py-2.5" />
        </tr>
      </thead>
      <tbody>
        {rows.map((p, i) => (
          <tr
            key={p.id}
            className={i % 2 === 0 ? 'bg-white' : 'bg-[#f5f5f5]'}
          >
            <td className="px-2 py-2 align-middle">
              {p.isPublic && (
                <span
                  className="inline-block rounded-sm px-1 py-0.5 text-[9px] font-bold uppercase leading-none text-white"
                  style={{ background: '#c41e3a' }}
                >
                  Public
                </span>
              )}
            </td>
            <td className="px-2 py-2 align-middle font-mono text-[12px] text-slate-700">{p.id}</td>
            <td className="px-3 py-2 align-middle">
              <button
                type="button"
                onClick={() => onOpenProject(p)}
                className="text-left font-medium text-[#c41e3a] hover:underline"
              >
                {p.name}
              </button>
            </td>
            <td className="px-3 py-2 align-middle text-slate-700">{p.location}</td>
            <td className="px-3 py-2 align-middle">
              {p.bidders ? (
                canManageBidders ? (
                  <button
                    type="button"
                    onClick={() => onAddBidder(p)}
                    className="text-left text-[#c41e3a] hover:underline"
                  >
                    {p.bidders}
                  </button>
                ) : (
                  <span className="text-slate-700">{p.bidders}</span>
                )
              ) : (
                <span className="text-slate-400">—</span>
              )}
            </td>
            <td className="px-3 py-2 align-middle text-slate-800">{p.status}</td>
            <td className="px-3 py-2 align-middle text-slate-600">{p.bidDate ?? ''}</td>
            <td className="px-2 py-2 align-middle">
              {canManageBidders && (
                <button
                  type="button"
                  onClick={() => onAddBidder(p)}
                  className="whitespace-nowrap rounded border border-slate-400 bg-[#4a4a4a] px-2 py-1 text-[11px] font-semibold text-white hover:bg-[#3a3a3a]"
                >
                  + Bidder
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
