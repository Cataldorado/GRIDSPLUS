import type { LeadDisposition } from '@/data/leadActions'
import { displayUnifiedOpportunityStatus } from '@/data/unifiedLeadActions'
import type { UnifiedBoardProject } from '@/data/unifiedBoard'
import type { CommercialPlatformTheme } from './platformTheme'

interface Props {
  rows: UnifiedBoardProject[]
  theme: CommercialPlatformTheme
  leadDisposition: Record<string, LeadDisposition>
  compact?: boolean
  onOpenProject: (p: UnifiedBoardProject) => void
  onAddBidder?: (p: UnifiedBoardProject) => void
  canManageBidders?: boolean
}

export function CommercialListTable({ rows, theme, leadDisposition, compact = false, onOpenProject, onAddBidder, canManageBidders }: Props) {
  return (
    <table className="w-full border-collapse text-[13px]">
      <thead>
        <tr className="text-left text-[12px] font-bold text-white" style={{ background: theme.columnHeaderBg }}>
          <th className="w-8 px-2 py-2.5" />
          <th className="px-3 py-2.5">#</th>
          <th className="min-w-[200px] px-3 py-2.5">Project</th>
          {!compact && <th className="min-w-[140px] px-3 py-2.5">Location</th>}
          {!compact && <th className="min-w-[160px] px-3 py-2.5">Bidders / Contractor</th>}
          {!compact && <th className="min-w-[140px] px-3 py-2.5">Status</th>}
          {!compact && <th className="px-3 py-2.5">Template</th>}
          <th className="px-3 py-2.5">Bid Date</th>
          {canManageBidders && !compact && <th className="w-[100px] px-2 py-2.5" />}
        </tr>
      </thead>
      <tbody>
        {rows.map((p, i) => {
          const status = displayUnifiedOpportunityStatus(p, leadDisposition) ?? p.workflowStatus ?? '—'
          return (
            <tr key={p.num} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
              <td className="px-2 py-2 align-middle">
                {p.vis === 'Public' && (
                  <span className="inline-block rounded-sm px-1 py-0.5 text-[9px] font-bold uppercase text-white" style={{ background: theme.accent }}>
                    Public
                  </span>
                )}
              </td>
              <td className="px-3 py-2 align-middle font-mono text-[12px]">{p.referenceNumber}</td>
              <td className="px-3 py-2 align-middle">
                <button type="button" onClick={() => onOpenProject(p)} className="font-semibold hover:underline" style={{ color: theme.link }}>
                  {p.name}
                </button>
                {compact && <div className="text-[11px] text-slate-500">{p.address}</div>}
              </td>
              {!compact && <td className="px-3 py-2 align-middle text-slate-700">{p.address}</td>}
              {!compact && <td className="px-3 py-2 align-middle text-slate-700">{p.contractor ?? '—'}</td>}
              {!compact && <td className="px-3 py-2 align-middle">{status}</td>}
              {!compact && <td className="px-3 py-2 align-middle">{p.template}</td>}
              <td className="px-3 py-2 align-middle text-slate-600">{p.bidLabel}</td>
              {canManageBidders && !compact && (
                <td className="px-2 py-2 align-middle">
                  {onAddBidder && (
                    <button
                      type="button"
                      onClick={() => onAddBidder(p)}
                      className="whitespace-nowrap rounded border border-slate-400 bg-[#4a4a4a] px-2 py-1 text-[11px] font-semibold text-white hover:bg-[#3a3a3a]"
                    >
                      + Bidder
                    </button>
                  )}
                </td>
              )}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
