import { useAppStore } from '@/state/appStore'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { PROJECT } from '@/data/sampleData'

export function WorkflowTab() {
  const persona = useAppStore((s) => s.persona)
  const stage = useAppStore((s) => s.stage)
  const completeEstimate = useAppStore((s) => s.completeEstimate)

  const inProgress = stage === 'estimating'

  return (
    <div className="space-y-4">
      <Card>
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Backend workflow</div>
        <p className="mt-1 max-w-lg text-sm text-slate-500">
          GiddyUp is the estimate engine behind GRIDS+ — loosely coupled, not rebuilt. It only ever
          appears here as a status card; the full GiddyUp UI is out of scope for this prototype.
        </p>

        <div className="mt-4 rounded-lg border border-slate-200 p-4">
          <div className="flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 rounded-full ${inProgress ? 'animate-pulse bg-amber-500' : 'bg-emerald-500'}`}
            />
            <Badge tone={inProgress ? 'warning' : 'success'}>
              {inProgress ? 'Estimate in progress' : 'Estimate complete'}
            </Badge>
          </div>
          <div className="mt-3 space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Assignee</span>
              <span className="font-medium text-slate-800">{PROJECT.estimator.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Workflow engine</span>
              <span className="font-medium text-slate-800">GiddyUp (backend)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Project</span>
              <span className="font-medium text-slate-800">{PROJECT.id}</span>
            </div>
          </div>
        </div>

        {persona === 'estimator' && inProgress && (
          <div className="mt-4 flex justify-end">
            <Button onClick={completeEstimate}>Mark estimate complete →</Button>
          </div>
        )}
        {persona === 'estimator' && !inProgress && (
          <p className="mt-4 text-sm font-medium text-emerald-700">
            ✓ Estimate handed off to {PROJECT.tm.name} for quote prep.
          </p>
        )}
      </Card>
    </div>
  )
}
