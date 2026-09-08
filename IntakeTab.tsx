import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useAppStore } from '@/state/appStore'
import {
  computeCompleteness,
  DOC_TYPES,
  estimateTurnaround,
  INTAKE_FINDINGS,
  ROUTING_ANSWERS,
} from '@/data/sampleData'

const TONE_MAP = { warning: 'warning', info: 'info' } as const
const ICON_MAP = { warning: '⚠', info: 'ⓘ' } as const

export function IntakeTab() {
  const uploadedDocTypes = useAppStore((s) => s.uploadedDocTypes)
  const resolvedFindings = useAppStore((s) => s.resolvedFindings)
  const completeness = computeCompleteness(uploadedDocTypes, resolvedFindings)

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
            <span>✨</span> Intake summary
          </div>
          <Badge tone="info">{completeness}% complete · {estimateTurnaround(completeness)}</Badge>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {DOC_TYPES.filter((d) => uploadedDocTypes.includes(d.id)).map((d) => (
            <span key={d.id} className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
              {d.icon} {d.label}
            </span>
          ))}
          {uploadedDocTypes.length === 0 && (
            <span className="text-xs text-slate-400">No documents were added during intake.</span>
          )}
        </div>

        <div className="mt-4 space-y-2.5">
          {INTAKE_FINDINGS.map((f) => {
            const resolved = resolvedFindings.includes(f.id)
            return (
              <div
                key={f.id}
                className={`flex items-start gap-3 rounded-lg border p-3 ${resolved ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200'}`}
              >
                <span>{resolved ? '✅' : ICON_MAP[f.type]}</span>
                <div>
                  {!resolved && <Badge tone={TONE_MAP[f.type]}>{f.type === 'warning' ? 'Needs attention' : 'Suggestion'}</Badge>}
                  <p className="mt-1 text-sm font-semibold text-slate-800">{f.title}</p>
                  <p className="mt-0.5 text-sm text-slate-600">{resolved ? f.fixedDetail : f.detail}</p>
                </div>
              </div>
            )
          })}
        </div>
      </Card>

      <Card>
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Routing</div>
        <dl className="mt-2 space-y-2 text-sm">
          <div>
            <dt className="text-slate-400">Project type</dt>
            <dd className="font-medium text-slate-700">{ROUTING_ANSWERS.projectType}</dd>
          </div>
          <div>
            <dt className="text-slate-400">Design</dt>
            <dd className="font-medium text-slate-700">{ROUTING_ANSWERS.design}</dd>
          </div>
          <div>
            <dt className="text-slate-400">Takeoff</dt>
            <dd className="font-medium text-slate-700">{ROUTING_ANSWERS.takeoff}</dd>
          </div>
          <div>
            <dt className="text-slate-400">Auto-route result</dt>
            <dd className="font-medium text-grids-navy">{ROUTING_ANSWERS.autoRoute}</dd>
          </div>
        </dl>
      </Card>
    </div>
  )
}
