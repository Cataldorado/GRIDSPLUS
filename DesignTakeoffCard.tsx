import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import type { DesignTakeoffLink, TakeoffAssignment } from '@/data/triageDetailData'

interface Props {
  config: DesignTakeoffLink
  assignment?: TakeoffAssignment | null
}

export function DesignTakeoffCard({ config, assignment }: Props) {
  return (
    <Card className="mt-4">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">{config.sectionTitle}</div>
      <p className="mt-1 text-[11px] text-slate-400">Shared across all bidders on this project.</p>
      <div className="mt-2 flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-3">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-slate-800">{config.itemTitle}</div>
          <div className="text-xs text-slate-500">{config.itemSubtitle}</div>
        </div>
        <a
          href={config.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex shrink-0 items-center gap-1.5 rounded-md border border-grids-blue/30 bg-grids-blue/5 px-3 py-1.5 text-xs font-semibold text-grids-blue hover:bg-grids-blue/10"
          title="Demo — opens Procore in a new tab"
        >
          {config.linkLabel}
          <span className="text-[10px] opacity-70" aria-hidden>↗</span>
        </a>
      </div>

      {assignment && (
        <div className="mt-3 rounded-lg border border-amber-200/80 bg-amber-50/50 p-3">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wide text-amber-800/70">
                Assigned to takeoff
              </div>
              <div className="mt-1 text-sm font-semibold text-slate-800">{assignment.assigneeName}</div>
              <div className="text-xs text-slate-600">
                {assignment.assigneeTitle} · {assignment.assigneeTeam}
              </div>
            </div>
            <Badge tone="warning">{assignment.status}</Badge>
          </div>
          {assignment.notes && <p className="mt-2 text-xs text-slate-600">{assignment.notes}</p>}
          <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            <div className="flex justify-between gap-2">
              <dt className="text-slate-400">Assigned</dt>
              <dd className="font-medium text-slate-600">{assignment.assignedSince}</dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-slate-400">Email</dt>
              <dd className="truncate font-medium text-grids-blue">{assignment.email}</dd>
            </div>
          </dl>
        </div>
      )}
    </Card>
  )
}
