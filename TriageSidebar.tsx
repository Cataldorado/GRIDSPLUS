import type { PersonaConfig, SavedView } from '@/data/triageData'
import { VERTICALS, type VerticalKey } from '@/data/verticals'

interface Props {
  desk: string
  deskSub: string
  views: (SavedView & { count: number; active: boolean })[]
  onPickView: (key: string) => void
  onFocusSearch: () => void
  showContractorFilter: boolean
  contractor: string
  contractorOptions: string[]
  onContractorChange: (v: string) => void
  bidWindow: string
  onBidWindowChange: (v: string) => void
  template: string
  templateOptions: string[]
  onTemplateChange: (v: string) => void
  vertical: VerticalKey | 'all'
  verticalCounts: Record<VerticalKey | 'all', number>
  onVerticalChange: (v: VerticalKey | 'all') => void
  persona: PersonaConfig
  showNeedsDecision: boolean
}

export function TriageSidebar({
  desk,
  deskSub,
  views,
  onPickView,
  onFocusSearch,
  showContractorFilter,
  contractor,
  contractorOptions,
  onContractorChange,
  bidWindow,
  onBidWindowChange,
  template,
  templateOptions,
  onTemplateChange,
  vertical,
  verticalCounts,
  onVerticalChange,
  persona,
  showNeedsDecision,
}: Props) {
  return (
    <aside
      className="sticky top-[71px] flex h-[calc(100vh-71px)] flex-col pb-2.5"
      style={{ background: 'oklch(0.25 0.035 255)' }}
    >
      <div className="flex items-center gap-2.5 px-4 pt-4 pb-3.5">
        <div
          className="grid h-[30px] w-[30px] flex-none place-items-center rounded-[7px] text-[15px] font-bold"
          style={{ border: '1.5px solid oklch(0.72 0.03 255)', color: 'oklch(0.97 0.01 255)' }}
        >
          G
        </div>
        <div className="min-w-0 leading-tight">
          <div
            className="overflow-hidden text-ellipsis whitespace-nowrap text-[12.5px] font-semibold"
            style={{ color: 'oklch(0.97 0.01 255)' }}
          >
            {desk}
          </div>
          <div
            className="overflow-hidden text-ellipsis whitespace-nowrap text-[10.5px]"
            style={{ color: 'oklch(0.68 0.02 255)' }}
          >
            {deskSub}
          </div>
        </div>
      </div>

      <div className="px-2.5 pb-2">
        <button
          onClick={onFocusSearch}
          className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left"
          style={{ background: 'oklch(0.31 0.035 255)', border: '1px solid oklch(0.36 0.035 255)' }}
        >
          <span
            className="inline-block h-[13px] w-[13px] flex-none rounded-full"
            style={{ border: '1.6px solid oklch(0.75 0.02 255)' }}
          />
          <span className="flex-1 text-xs" style={{ color: 'oklch(0.8 0.02 255)' }}>
            Find a project
          </span>
          <span
            className="rounded px-1 font-mono text-[10px]"
            style={{ border: '1px solid oklch(0.4 0.03 255)', color: 'oklch(0.68 0.02 255)' }}
          >
            /
          </span>
        </button>
      </div>

      <div className="flex-1 px-2.5 pt-1.5">
        {showNeedsDecision && (
          <>
            <div
              className="px-2 pb-1.5 pt-1.5 text-[9.5px] font-semibold uppercase"
              style={{ letterSpacing: '.1em', color: 'oklch(0.62 0.02 255)' }}
            >
              Needs a decision
            </div>
            {views.map((v) => (
              <button
                key={v.key}
                onClick={() => onPickView(v.key)}
                className="mb-px flex w-full items-center gap-2 rounded-[7px] px-2.5 py-1.5 text-left"
                style={{ background: v.active ? 'oklch(0.34 0.04 255)' : 'transparent' }}
              >
                <span className="h-[5px] w-[5px] flex-none rounded-full" style={{ background: v.dot }} />
                <span
                  className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-[12.5px]"
                  style={{ color: v.active ? 'oklch(0.98 0.01 255)' : 'oklch(0.84 0.015 255)', fontWeight: v.active ? 600 : 500 }}
                >
                  {v.label}
                </span>
                <span
                  className="font-mono text-[11px]"
                  style={{ color: v.active ? 'oklch(0.9 0.01 255)' : 'oklch(0.66 0.02 255)' }}
                >
                  {v.count}
                </span>
              </button>
            ))}

            <div className="my-3 mx-[9px] h-px" style={{ background: 'oklch(0.32 0.03 255)' }} />
          </>
        )}
        <div
          className="px-2 pb-2 pt-0.5 text-[9.5px] font-semibold uppercase"
          style={{ letterSpacing: '.1em', color: 'oklch(0.62 0.02 255)' }}
        >
          Narrow by
        </div>

        <div className="px-2 pb-2">
          <span className="mb-1.5 block text-[10.5px]" style={{ color: 'oklch(0.7 0.02 255)' }}>
            Project type
          </span>
          <div className="flex flex-col gap-1">
            <button
              onClick={() => onVerticalChange('all')}
              className="flex w-full items-center gap-2 rounded-[7px] px-2 py-1.5 text-left"
              style={{ background: vertical === 'all' ? 'oklch(0.34 0.04 255)' : 'oklch(0.31 0.035 255)' }}
            >
              <span className="flex-1 text-[11.5px]" style={{ color: vertical === 'all' ? 'oklch(0.98 0.01 255)' : 'oklch(0.84 0.015 255)' }}>
                All project types
              </span>
              <span className="font-mono text-[10.5px]" style={{ color: 'oklch(0.66 0.02 255)' }}>
                {verticalCounts.all}
              </span>
            </button>
            {VERTICALS.map((v) => (
              <button
                key={v.key}
                onClick={() => onVerticalChange(v.key)}
                className="flex w-full items-center gap-2 rounded-[7px] px-2 py-1.5 text-left"
                style={{ background: vertical === v.key ? 'oklch(0.34 0.04 255)' : 'oklch(0.31 0.035 255)' }}
              >
                <span className="flex-none text-sm">{v.icon}</span>
                <span
                  className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-[11.5px]"
                  style={{ color: vertical === v.key ? 'oklch(0.98 0.01 255)' : 'oklch(0.84 0.015 255)' }}
                >
                  {v.title}
                </span>
                <span className="font-mono text-[10.5px]" style={{ color: 'oklch(0.66 0.02 255)' }}>
                  {verticalCounts[v.key]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {showContractorFilter && (
          <label className="block px-2 pb-2">
            <span className="mb-1 block text-[10.5px]" style={{ color: 'oklch(0.7 0.02 255)' }}>
              Contractor
            </span>
            <select
              value={contractor}
              onChange={(e) => onContractorChange(e.target.value)}
              className="w-full rounded-md px-1.5 py-1.5 text-[11.5px]"
              style={{ background: 'oklch(0.31 0.035 255)', color: 'oklch(0.93 0.01 255)', border: '1px solid oklch(0.38 0.03 255)' }}
            >
              {contractorOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        )}

        <label className="block px-2 pb-2">
          <span className="mb-1 block text-[10.5px]" style={{ color: 'oklch(0.7 0.02 255)' }}>
            Bid date
          </span>
          <select
            value={bidWindow}
            onChange={(e) => onBidWindowChange(e.target.value)}
            className="w-full rounded-md px-1.5 py-1.5 text-[11.5px]"
            style={{ background: 'oklch(0.31 0.035 255)', color: 'oklch(0.93 0.01 255)', border: '1px solid oklch(0.38 0.03 255)' }}
          >
            <option value="any">Any date</option>
            <option value="48h">Closing in 48 hours</option>
            <option value="7d">Next 7 days</option>
            <option value="30d">Next 30 days</option>
            <option value="past">Bid date passed</option>
          </select>
        </label>

        <label className="block px-2 pb-2.5">
          <span className="mb-1 block text-[10.5px]" style={{ color: 'oklch(0.7 0.02 255)' }}>
            Template
          </span>
          <select
            value={template}
            onChange={(e) => onTemplateChange(e.target.value)}
            className="w-full rounded-md px-1.5 py-1.5 text-[11.5px]"
            style={{ background: 'oklch(0.31 0.035 255)', color: 'oklch(0.93 0.01 255)', border: '1px solid oklch(0.38 0.03 255)' }}
          >
            {templateOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mx-2.5 px-[18px] pb-0.5 pt-2" style={{ borderTop: '1px solid oklch(0.32 0.03 255)' }}>
        <div className="text-[11px] leading-relaxed" style={{ color: 'oklch(0.72 0.02 255)' }}>
          {persona.name}
        </div>
        <div className="text-[10.5px]" style={{ color: 'oklch(0.6 0.02 255)' }}>
          {persona.footer}
        </div>
      </div>
    </aside>
  )
}
