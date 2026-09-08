import clsx from 'clsx'
import type { ProjectOpportunity } from '@/data/projectOpportunities'

const SOURCE_LABEL: Record<ProjectOpportunity['source'], string> = {
  invited: 'Invited',
  interested: 'Interested',
  bidder: 'Bidder',
}

interface Props {
  opportunities: ProjectOpportunity[]
  activeId: string
  onSelect: (id: string) => void
}

export function BidderOpportunityTabs({ opportunities, activeId, onSelect }: Props) {
  const count = opportunities.length

  return (
    <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Bidders on this project
          </div>
          <p className="mt-0.5 text-sm text-slate-700">
            <span className="font-bold text-grids-navy">{count}</span>
            {count === 1 ? ' opportunity' : ' opportunities'} — shared drawings & bid date; quotes differ per customer.
          </p>
        </div>
      </div>

      <div
        className="mt-3 flex gap-1 overflow-x-auto rounded-lg border border-slate-200 bg-white p-1"
        role="tablist"
        aria-label="Select bidder opportunity"
      >
        {opportunities.map((opp) => {
          const active = opp.id === activeId
          return (
            <button
              key={opp.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onSelect(opp.id)}
              className={clsx(
                'flex min-w-[140px] flex-col items-start rounded-md px-3 py-2 text-left transition-colors',
                active ? 'bg-grids-navy text-white shadow-sm' : 'text-slate-700 hover:bg-slate-50',
              )}
            >
              <span className="w-full truncate text-[12px] font-semibold leading-tight">{opp.tabLabel}</span>
              <span className={clsx('mt-0.5 text-[10px] font-medium', active ? 'text-white/80' : 'text-slate-500')}>
                {SOURCE_LABEL[opp.source]} · {opp.opportunityStatus}
              </span>
            </button>
          )
        })}
        <button
          type="button"
          disabled
          title="Demo — use + Bidder on board"
          className="flex min-w-[100px] items-center justify-center rounded-md border border-dashed border-slate-300 px-3 py-2 text-[11px] font-medium text-slate-400"
        >
          + Bidder
        </button>
      </div>
    </div>
  )
}
