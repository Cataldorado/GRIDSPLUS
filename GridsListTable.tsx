import type { LeadDisposition } from '@/data/leadActions'
import { displayGridsOpportunityStatus } from '@/data/gridsLeadActions'
import type { GridsTmProject } from '@/data/gridsTmProjects'

interface Props {
  rows: GridsTmProject[]
  leadDisposition: Record<string, LeadDisposition>
  onOpenProject: (p: GridsTmProject) => void
}

/** GRIDS list view shell — same disposition rules as board. */
export function GridsListTable({ rows, leadDisposition, onOpenProject }: Props) {
  return (
    <table className="w-full border-collapse text-[13px]">
      <thead>
        <tr className="bg-[#1a2744] text-left text-[12px] font-bold text-white">
          <th className="px-3 py-2">#</th>
          <th className="px-3 py-2">Project</th>
          <th className="px-3 py-2">Location</th>
          <th className="px-3 py-2">Visibility</th>
          <th className="px-3 py-2">Status</th>
          <th className="px-3 py-2">Template</th>
          <th className="px-3 py-2">Bid Date</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((p, i) => {
          const status = displayGridsOpportunityStatus(p, leadDisposition)
          return (
            <tr key={p.num} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
              <td className="px-3 py-2 font-mono text-[12px]">{p.num}</td>
              <td className="px-3 py-2">
                <button type="button" onClick={() => onOpenProject(p)} className="font-semibold text-[#1a5fb4] hover:underline">
                  {p.name}
                </button>
              </td>
              <td className="px-3 py-2 text-slate-700">{p.address}</td>
              <td className="px-3 py-2">{p.vis}</td>
              <td className="px-3 py-2">{status ?? '—'}</td>
              <td className="px-3 py-2">{p.template}</td>
              <td className="px-3 py-2">{p.bidLabel}</td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
