import type { LeadCardAction } from '@/data/leadActions'
import { LEAD_ACTION_STYLES } from '@/data/leadActions'

export interface BoardCardView {
  num: string
  name: string
  contractor: string
  city: string
  chip: string
  chipFg: string
  clockValue: string
  clockFg: string
  spine: string
  border: string
  actLabel: string
  actBg: string
  actFg: string
  actShadow: string
  onAct: () => void
  leadActions?: LeadCardAction[]
  onTitleClick: () => void
}

export interface BoardColumn {
  key: string
  title: string
  dot: string
  fg: string
  bg: string
  border: string
  count: number
  isEmpty: boolean
  emptyText: string
  items: BoardCardView[]
}

function actionStyle(tone: LeadCardAction['tone'], invite = false) {
  if (invite && tone === 'primary') return LEAD_ACTION_STYLES.invite
  return LEAD_ACTION_STYLES[tone]
}

export function BoardView({ columns }: { columns: BoardColumn[] }) {
  const gridClass =
    columns.length === 3 ? 'grid-cols-3' : columns.length === 2 ? 'grid-cols-2' : 'grid-cols-4'

  return (
    <div className={`grid ${gridClass} items-start gap-3.5 pt-4`}>
      {columns.map((col) => (
        <section key={col.key} className="min-w-0">
          <div className="flex items-center gap-2 px-0.5 pb-[9px]">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: col.dot }} />
            <h2 className="m-0 text-[12.5px] font-bold" style={{ letterSpacing: '.01em', color: col.fg }}>
              {col.title}
            </h2>
            <span className="font-mono text-[11px]" style={{ color: 'oklch(0.55 0.015 255)' }}>
              {col.count}
            </span>
          </div>
          <div
            className="flex min-h-[120px] flex-col gap-2 rounded-[10px] p-2"
            style={{ background: col.bg, border: `1px solid ${col.border}` }}
          >
            {col.items.map((p) => (
              <article
                key={p.num}
                className="flex overflow-hidden rounded-[9px] bg-white"
                style={{ border: `1px solid ${p.border}`, boxShadow: '0 1px 2px oklch(0.5 0.02 255 / .06)' }}
              >
                <div className="w-[3.5px] flex-none" style={{ background: p.spine }} />
                <div className="min-w-0 flex-1 p-2.5">
                  <div className="mb-1.5 flex items-center justify-between gap-1.5">
                    <span
                      className="overflow-hidden text-ellipsis whitespace-nowrap text-[10px] font-semibold uppercase"
                      style={{ letterSpacing: '.05em', color: p.chipFg }}
                    >
                      {p.chip}
                    </span>
                    <span className="flex-none font-mono text-[10.5px] font-semibold" style={{ color: p.clockFg }}>
                      {p.clockValue}
                    </span>
                  </div>
                  <button
                    onClick={p.onTitleClick}
                    className="block w-full overflow-hidden text-ellipsis whitespace-nowrap text-left text-[12.5px] font-semibold leading-tight hover:underline"
                  >
                    {p.name}
                  </button>
                  <div className="mt-px font-mono text-[10.5px]" style={{ color: 'oklch(0.58 0.015 255)' }}>
                    {p.num}
                  </div>
                  <div
                    className="mt-1.5 overflow-hidden text-ellipsis whitespace-nowrap text-[11px] leading-snug"
                    style={{ color: 'oklch(0.52 0.015 255)' }}
                  >
                    {p.contractor} · {p.city}
                  </div>
                  {p.leadActions?.length ? (
                    <div className="mt-2.5 grid grid-cols-2 gap-1.5">
                      {p.leadActions.map((action) => {
                        const style = actionStyle(action.tone, action.label === 'Invite')
                        return (
                          <button
                            key={action.label}
                            onClick={action.onClick}
                            className="rounded-[7px] px-2 py-1.5 text-[11px] font-semibold"
                            style={{ background: style.bg, color: style.fg, boxShadow: style.shadow }}
                          >
                            {action.label}
                          </button>
                        )
                      })}
                    </div>
                  ) : (
                    <button
                      onClick={p.onAct}
                      className="mt-2.5 w-full rounded-[7px] px-2.5 py-1.5 text-[11.5px] font-semibold"
                      style={{ background: p.actBg, color: p.actFg, boxShadow: p.actShadow }}
                    >
                      {p.actLabel}
                    </button>
                  )}
                </div>
              </article>
            ))}
            {col.isEmpty && (
              <div className="px-3 py-5 text-center text-[11.5px] leading-relaxed" style={{ color: 'oklch(0.58 0.015 255)' }}>
                {col.emptyText}
              </div>
            )}
          </div>
        </section>
      ))}
    </div>
  )
}
