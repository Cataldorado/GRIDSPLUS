import type { LeadCardAction } from '@/data/leadActions'
import { LEAD_ACTION_STYLES } from '@/data/leadActions'
import type { Evidence } from '@/data/triageData'

export interface RowView {
  num: string
  name: string
  contractor: string
  city: string
  bidLabel: string
  status: string
  template: string
  visibility: string
  evidence: Evidence[]
  why: string
  consequence: string
  showConsequence: boolean
  clockValue: string
  clockSub: string
  clockFg: string
  spine: string
  border: string
  whyFg: string
  shadow: string
  compact: boolean
  actLabel: string
  actBg: string
  actFg: string
  actShadow: string
  isOpen: boolean
  hasRec: boolean
  recMove: string
  recLine: string
  onAct: () => void
  onExpand: () => void
  onSnooze: () => void
  onRecAct: () => void
  onOpenProject: (() => void) | null
  onTitleClick: () => void
  leadActions?: LeadCardAction[]
}

export function TriageRow({ row }: { row: RowView }) {
  const padY = row.compact ? '8px' : '12px'

  return (
    <>
      <article
        className="mb-[7px] flex items-stretch rounded-[10px] bg-white"
        style={{ border: `1px solid ${row.border}`, boxShadow: row.shadow, animation: 'tri-in .2s ease both' }}
      >
        <div className="w-1 flex-none rounded-l-[10px]" style={{ background: row.spine }} />

        <div className="flex w-[76px] flex-none flex-col justify-center gap-0.5 pl-3" style={{ paddingTop: padY, paddingBottom: padY }}>
          <div className="font-mono text-[15px] font-semibold leading-tight" style={{ letterSpacing: '-.02em', color: row.clockFg }}>
            {row.clockValue}
          </div>
          <div className="text-[10px]" style={{ letterSpacing: '.02em', color: 'oklch(0.58 0.015 255)' }}>
            {row.clockSub}
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col justify-center gap-[3px] px-3.5" style={{ paddingTop: padY, paddingBottom: padY }}>
          <div className="flex min-w-0 items-baseline gap-2">
            <button
              onClick={row.onTitleClick}
              className="overflow-hidden text-ellipsis whitespace-nowrap text-[13.5px] font-semibold hover:underline"
              style={{ letterSpacing: '-.005em' }}
            >
              {row.name}
            </button>
            <span className="flex-none font-mono text-[11px]" style={{ color: 'oklch(0.58 0.015 255)' }}>
              {row.num}
            </span>
          </div>
          <div className="flex min-w-0 items-center gap-[7px] text-[11.5px]" style={{ color: 'oklch(0.52 0.015 255)' }}>
            <span className="overflow-hidden text-ellipsis whitespace-nowrap">{row.contractor}</span>
            <span className="h-[3px] w-[3px] flex-none rounded-full" style={{ background: 'oklch(0.8 0.01 255)' }} />
            <span className="whitespace-nowrap">{row.city}</span>
          </div>
          <div className="mt-0.5 flex min-w-0 items-center gap-[7px]">
            <span className="overflow-hidden text-ellipsis whitespace-nowrap text-[11.5px] font-semibold" style={{ color: row.whyFg }}>
              {row.why}
            </span>
          </div>
          {row.showConsequence && (
            <div className="text-[11.5px] leading-relaxed" style={{ color: 'oklch(0.5 0.015 255)', maxWidth: '62ch' }}>
              {row.consequence}
            </div>
          )}
          {row.hasRec && (
            <div
              className="mt-1.5 flex max-w-[70ch] items-start gap-2.5 rounded-lg px-2.5 py-[7px]"
              style={{ background: 'oklch(0.985 0.012 52)', border: '1px solid oklch(0.93 0.035 52)' }}
            >
              <span className="whitespace-nowrap pt-0.5 text-[9.5px] font-bold uppercase" style={{ letterSpacing: '.08em', color: 'oklch(0.5 0.15 52)' }}>
                Do this
              </span>
              <span className="min-w-0">
                <span className="block text-[11.5px] font-semibold" style={{ color: 'oklch(0.34 0.03 255)' }}>
                  {row.recMove}
                </span>
                <span className="mt-px block text-[11.5px] italic leading-relaxed" style={{ color: 'oklch(0.44 0.02 255)' }}>
                  {row.recLine}
                </span>
              </span>
              <button
                onClick={row.onRecAct}
                className="ml-auto flex-none whitespace-nowrap rounded-md px-2.5 py-1 text-[11px] font-semibold"
                style={{ border: '1px solid oklch(0.9 0.04 52)', background: 'white', color: 'oklch(0.45 0.13 52)' }}
              >
                Log call
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-none items-center gap-1.5 px-3" style={{ paddingTop: padY, paddingBottom: padY }}>
          <button
            onClick={row.onExpand}
            className="rounded-[7px] px-2.5 py-1.5 text-[11.5px] font-medium"
            style={{ border: '1px solid oklch(0.9 0.008 255)', background: 'white', color: 'oklch(0.42 0.02 255)' }}
          >
            {row.isOpen ? 'Hide' : 'Why'}
          </button>
          {!row.leadActions?.length && (
            <button
              onClick={row.onSnooze}
              className="rounded-[7px] px-2.5 py-1.5 text-[11.5px] font-medium"
              style={{ border: '1px solid oklch(0.9 0.008 255)', background: 'white', color: 'oklch(0.42 0.02 255)' }}
            >
              Snooze
            </button>
          )}
          {row.leadActions?.length ? (
            row.leadActions.map((action) => {
              const style =
                action.label === 'Invite' ? LEAD_ACTION_STYLES.invite : LEAD_ACTION_STYLES[action.tone]
              return (
                <button
                  key={action.label}
                  onClick={action.onClick}
                  className="whitespace-nowrap rounded-[7px] px-[13px] py-[7px] text-xs font-semibold"
                  style={{ background: style.bg, color: style.fg, boxShadow: style.shadow }}
                >
                  {action.label}
                </button>
              )
            })
          ) : (
            <button
              onClick={row.onAct}
              className="whitespace-nowrap rounded-[7px] px-[13px] py-[7px] text-xs font-semibold"
              style={{ background: row.actBg, color: row.actFg, boxShadow: row.actShadow }}
            >
              {row.actLabel}
            </button>
          )}
        </div>
      </article>

      {row.isOpen && (
        <div
          className="mb-[10px] ml-1 grid gap-[18px] rounded-[10px] px-4 py-[13px]"
          style={{
            marginTop: '-4px',
            background: 'oklch(0.985 0.003 85)',
            border: '1px solid oklch(0.92 0.006 255)',
            gridTemplateColumns: 'minmax(0,1.3fr) minmax(0,1fr)',
            animation: 'tri-in .18s ease both',
          }}
        >
          <div>
            <div className="mb-[7px] text-[10.5px] font-semibold uppercase" style={{ letterSpacing: '.08em', color: 'oklch(0.55 0.015 255)' }}>
              What happened
            </div>
            {row.evidence.map((e, i) => (
              <div key={i} className="flex items-baseline gap-2 py-[3px] text-xs" style={{ color: 'oklch(0.35 0.02 255)' }}>
                <span className="w-[62px] flex-none font-mono text-[10.5px]" style={{ color: 'oklch(0.6 0.015 255)' }}>
                  {e.when}
                </span>
                <span>{e.what}</span>
              </div>
            ))}
          </div>
          <div>
            <div className="mb-[7px] text-[10.5px] font-semibold uppercase" style={{ letterSpacing: '.08em', color: 'oklch(0.55 0.015 255)' }}>
              Details
            </div>
            <div className="grid gap-x-3 gap-y-1 text-xs" style={{ gridTemplateColumns: 'auto 1fr' }}>
              <span style={{ color: 'oklch(0.55 0.015 255)' }}>Bid date</span>
              <span className="font-mono">{row.bidLabel}</span>
              <span style={{ color: 'oklch(0.55 0.015 255)' }}>Status</span>
              <span>{row.status}</span>
              <span style={{ color: 'oklch(0.55 0.015 255)' }}>Template</span>
              <span>{row.template}</span>
              <span style={{ color: 'oklch(0.55 0.015 255)' }}>Visibility</span>
              <span>{row.visibility}</span>
            </div>
            <div className="mt-[11px] flex flex-wrap gap-1.5">
              <button
                onClick={row.onOpenProject ?? undefined}
                disabled={!row.onOpenProject}
                title={row.onOpenProject ? undefined : 'Demo project — not wired up'}
                className="rounded-[7px] px-2.5 py-1 text-[11.5px] font-medium disabled:opacity-40"
                style={{ border: '1px solid oklch(0.89 0.008 255)', background: 'white', color: 'oklch(0.35 0.02 255)' }}
              >
                Open project
              </button>
              {!row.leadActions?.length && (
                <>
                  <button
                    disabled
                    className="rounded-[7px] px-2.5 py-1 text-[11.5px] font-medium opacity-40"
                    style={{ border: '1px solid oklch(0.89 0.008 255)', background: 'white', color: 'oklch(0.35 0.02 255)' }}
                  >
                    Message contractor
                  </button>
                  <button
                    onClick={row.onAct}
                    className="rounded-[7px] px-2.5 py-1 text-[11.5px] font-medium"
                    style={{ border: '1px solid oklch(0.89 0.008 255)', background: 'white', color: 'oklch(0.35 0.02 255)' }}
                  >
                    Archive
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
