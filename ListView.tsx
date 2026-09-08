import type { TriageProject } from '@/data/triageData'
import type { LeadCardAction } from '@/data/leadActions'
import { LEAD_ACTION_STYLES } from '@/data/leadActions'

export interface ListRow {
  project: TriageProject
  displayStatus?: string
  onOpen: () => void
  leadActions?: LeadCardAction[]
}

interface Props {
  rows: ListRow[]
  emptyTitle: string
  emptyBody: string
  onClearFilters: () => void
}

export function ListView({ rows, emptyTitle, emptyBody, onClearFilters }: Props) {
  if (rows.length === 0) {
    return (
      <div className="mx-auto my-[60px] max-w-[420px] rounded-xl border border-slate-200 bg-white px-6 py-[30px] text-center">
        <div className="text-[15px] font-semibold">{emptyTitle}</div>
        <div className="mt-1.5 text-[12.5px] leading-relaxed text-slate-500">{emptyBody}</div>
        <button
          onClick={onClearFilters}
          className="mt-3.5 rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600"
        >
          Clear filters
        </button>
      </div>
    )
  }

  const showActions = rows.some((r) => r.leadActions?.length)

  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
      <table className="w-full border-collapse text-left text-[13px]">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            <th className="px-4 py-3">Project #</th>
            <th className="px-4 py-3">Project name</th>
            <th className="px-4 py-3">Contractor</th>
            <th className="px-4 py-3">City</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Template</th>
            <th className="px-4 py-3">Bid date</th>
            <th className="px-4 py-3">Visibility</th>
            {showActions && <th className="px-4 py-3">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map(({ project, displayStatus, onOpen, leadActions }) => (
            <tr
              key={project.num}
              className="border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50"
            >
              <td className="cursor-pointer px-4 py-3 font-mono text-[12px] text-slate-600" onClick={onOpen}>
                {project.num}
              </td>
              <td className="cursor-pointer px-4 py-3 font-semibold text-slate-900" onClick={onOpen}>
                {project.name}
              </td>
              <td className="cursor-pointer px-4 py-3 text-slate-700" onClick={onOpen}>{project.contractor}</td>
              <td className="cursor-pointer px-4 py-3 text-slate-600" onClick={onOpen}>{project.city}</td>
              <td className="cursor-pointer px-4 py-3" onClick={onOpen}>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                  {displayStatus ?? project.status}
                </span>
              </td>
              <td className="cursor-pointer px-4 py-3 text-slate-600" onClick={onOpen}>{project.template}</td>
              <td className="cursor-pointer px-4 py-3 text-slate-600" onClick={onOpen}>{project.bidLabel}</td>
              <td className="cursor-pointer px-4 py-3 text-slate-600" onClick={onOpen}>{project.vis}</td>
              {showActions && (
                <td className="px-4 py-3">
                  {leadActions?.length ? (
                    <div className="flex flex-wrap gap-1.5">
                      {leadActions.map((action) => {
                        const style =
                          action.label === 'Invite'
                            ? LEAD_ACTION_STYLES.invite
                            : LEAD_ACTION_STYLES[action.tone]
                        return (
                          <button
                            key={action.label}
                            onClick={(e) => {
                              e.stopPropagation()
                              action.onClick()
                            }}
                            className="rounded-md px-2 py-1 text-[11px] font-semibold"
                            style={{ background: style.bg, color: style.fg, boxShadow: style.shadow }}
                          >
                            {action.label}
                          </button>
                        )
                      })}
                    </div>
                  ) : (
                    <button onClick={onOpen} className="text-[11px] font-medium text-grids-blue hover:underline">
                      Open
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
