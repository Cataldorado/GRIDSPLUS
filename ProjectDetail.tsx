import clsx from 'clsx'
import { useAppStore, type DetailTab } from '@/state/appStore'
import { Badge } from '@/components/ui/Badge'
import { nextActor, PROJECT, STAGE_LABEL, type Persona } from '@/data/sampleData'
import { OverviewTab } from './detail/OverviewTab'
import { IntakeTab } from './detail/IntakeTab'
import { WorkflowTab } from './detail/WorkflowTab'
import { QuoteTab } from './detail/QuoteTab'

const TABS_BY_PERSONA: Record<Persona, { key: DetailTab; label: string }[]> = {
  customer: [
    { key: 'overview', label: 'Overview' },
    { key: 'intake', label: 'Intake' },
    { key: 'quote', label: 'Quote' },
  ],
  tm: [
    { key: 'overview', label: 'Overview' },
    { key: 'workflow', label: 'Workflow' },
    { key: 'quote', label: 'Quote' },
  ],
  estimator: [
    { key: 'overview', label: 'Overview' },
    { key: 'intake', label: 'Intake' },
    { key: 'workflow', label: 'Workflow' },
  ],
}

const STAGES = ['estimating', 'estimate_complete', 'quote_shared', 'accepted'] as const

export function ProjectDetail() {
  const persona = useAppStore((s) => s.persona)
  const stage = useAppStore((s) => s.stage)
  const modificationRequested = useAppStore((s) => s.modificationRequested)
  const detailTab = useAppStore((s) => s.detailTab)
  const setDetailTab = useAppStore((s) => s.setDetailTab)
  const setView = useAppStore((s) => s.setView)

  const tabs = TABS_BY_PERSONA[persona]
  const actor = nextActor(stage, modificationRequested)
  const stageIndex = STAGES.indexOf(stage)

  return (
    <div>
      <button onClick={() => setView('dashboard')} className="text-xs text-grids-blue">
        ← Back to projects
      </button>

      <div className="mt-2 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            {PROJECT.name} · {PROJECT.subtitle}
          </h1>
          <p className="text-xs text-slate-400">
            {PROJECT.id} · Private · {PROJECT.siteAddress}
          </p>
        </div>
        <Badge tone={stage === 'accepted' ? 'success' : actor === persona ? 'warning' : 'info'}>
          {STAGE_LABEL[stage]}
        </Badge>
      </div>

      <div className="mt-4 flex items-center gap-1.5">
        {STAGES.map((s, i) => (
          <div key={s} className="flex flex-1 items-center gap-1.5">
            <div
              className={clsx(
                'h-1.5 flex-1 rounded-full',
                i <= stageIndex ? 'bg-grids-blue' : 'bg-slate-200',
              )}
            />
          </div>
        ))}
      </div>
      <div className="mt-1 flex justify-between text-[10px] font-medium uppercase tracking-wide text-slate-400">
        {STAGES.map((s) => (
          <span key={s}>{STAGE_LABEL[s]}</span>
        ))}
      </div>

      <div className="mt-5 flex gap-1 border-b border-slate-200">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setDetailTab(t.key)}
            className={clsx(
              'relative px-3.5 py-2 text-sm font-semibold',
              detailTab === t.key ? 'text-grids-navy' : 'text-slate-400 hover:text-slate-600',
            )}
          >
            {t.label}
            {detailTab === t.key && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-grids-navy" />}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {detailTab === 'overview' && <OverviewTab />}
        {detailTab === 'intake' && <IntakeTab />}
        {detailTab === 'workflow' && <WorkflowTab />}
        {detailTab === 'quote' && <QuoteTab />}
      </div>
    </div>
  )
}
