import { useAppStore } from '@/state/appStore'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { attentionLabel, nextActor, NOTIFICATIONS, PROJECT } from '@/data/sampleData'

export function OverviewTab() {
  const persona = useAppStore((s) => s.persona)
  const stage = useAppStore((s) => s.stage)
  const modificationRequested = useAppStore((s) => s.modificationRequested)
  const setDetailTab = useAppStore((s) => s.setDetailTab)

  const actor = nextActor(stage, modificationRequested)
  const needsMe = actor === persona

  return (
    <div className="space-y-4">
      {needsMe && (
        <Card className="border-2 border-amber-300 bg-amber-50">
          <div className="flex items-center justify-between">
            <div>
              <Badge tone="warning">Requires your attention</Badge>
              <p className="mt-1.5 text-sm font-semibold text-amber-900">
                {attentionLabel(stage, modificationRequested)}
              </p>
            </div>
            <Button onClick={() => setDetailTab(stage === 'estimating' ? 'workflow' : 'quote')}>
              Take action →
            </Button>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Project details</div>
          <dl className="mt-2 space-y-1.5 text-sm">
            <Row label="Site address" value={PROJECT.siteAddress} />
            <Row label="Bid date" value={PROJECT.bidDate} />
            <Row label="Created" value={PROJECT.createdDate} />
            <Row label="Project type" value={PROJECT.subtitle} />
          </dl>
        </Card>
        <Card>
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">People</div>
          <dl className="mt-2 space-y-1.5 text-sm">
            <Row label="Customer" value={`${PROJECT.customer.contact} · ${PROJECT.customer.company}`} />
            <Row label="Territory Manager" value={PROJECT.tm.name} />
            <Row label="Commercial Services" value={PROJECT.estimator.name} />
          </dl>
        </Card>
      </div>

      <Card>
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Activity</div>
        <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
          {NOTIFICATIONS[persona].map((n) => (
            <li key={n}>• {n}</li>
          ))}
        </ul>
      </Card>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-slate-400">{label}</dt>
      <dd className="text-right font-medium text-slate-700">{value}</dd>
    </div>
  )
}
