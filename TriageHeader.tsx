import type { RefObject } from 'react'
import type { DashboardViewMode } from '@/config/demoScope'

export interface PressureChip {
  label: string
  bg: string
  fg: string
  border: string
  dot: string
  pulse: boolean
}

interface Props {
  searchRef: RefObject<HTMLInputElement | null>
  query: string
  onQueryChange: (v: string) => void
  onClearQuery: () => void
  mode: DashboardViewMode
  onSetMode: (m: DashboardViewMode) => void
  viewToggle: {
    left: DashboardViewMode
    right: DashboardViewMode
    leftLabel: string
    rightLabel: string
  } | null
  onSubmitRequest: () => void
  headline: string
  headlineSub: string
  pressureChips: PressureChip[]
  hasNextCall: boolean
  nextCallName: string
  nextCallWho: string
  nextCallMove: string
  nextCallLine: string
  nextCallClock: string
  onNextCallAct: () => void
  clearedCount: number
  dayTotal: number
  progressPct: number
  momentumLine: string
  canUndo: boolean
  lastClearedName: string
  onUndo: () => void
  showDecisionIntelligence: boolean
}

export function TriageHeader({
  searchRef,
  query,
  onQueryChange,
  onClearQuery,
  mode,
  onSetMode,
  onSubmitRequest,
  headline,
  headlineSub,
  pressureChips,
  hasNextCall,
  nextCallName,
  nextCallWho,
  nextCallMove,
  nextCallLine,
  nextCallClock,
  onNextCallAct,
  clearedCount,
  dayTotal,
  progressPct,
  momentumLine,
  canUndo,
  lastClearedName,
  onUndo,
  viewToggle,
  showDecisionIntelligence,
}: Props) {
  return (
    <>
      <header
        className="flex items-center gap-3.5 bg-white px-[22px] py-3"
        style={{ borderBottom: '1px solid oklch(0.91 0.006 255)' }}
      >
        <div
          className="flex max-w-[560px] flex-1 items-center gap-2.5 rounded-[9px] px-2.5 py-2"
          style={{ border: '1.5px solid oklch(0.89 0.008 255)', background: 'oklch(0.985 0.003 85)' }}
        >
          <span
            className="inline-block h-[13px] w-[13px] flex-none rounded-full"
            style={{ border: '1.7px solid oklch(0.58 0.02 255)' }}
          />
          <input
            ref={searchRef}
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Job name, #WLF-26-88905, contractor, city…"
            className="flex-1 border-0 bg-transparent text-[13.5px] outline-none"
            style={{ color: 'oklch(0.27 0.02 255)' }}
          />
          {query && (
            <button
              onClick={onClearQuery}
              className="flex h-[18px] w-[18px] items-center justify-center rounded-full text-[11px] leading-none"
              style={{ background: 'oklch(0.93 0.006 255)', color: 'oklch(0.45 0.02 255)' }}
            >
              ×
            </button>
          )}
        </div>

        <div className="flex gap-0.5 rounded-lg p-0.5" style={{ background: 'oklch(0.95 0.005 255)' }}>
          {viewToggle && (
            <>
              <button
                onClick={() => onSetMode(viewToggle.left)}
                className="rounded-md px-3.5 py-1.5 text-xs font-semibold"
                style={{
                  background: mode === viewToggle.left ? 'white' : 'transparent',
                  color: mode === viewToggle.left ? 'oklch(0.27 0.02 255)' : 'oklch(0.5 0.015 255)',
                  boxShadow: mode === viewToggle.left ? '0 1px 2px oklch(0.5 0.02 255 / .18)' : 'none',
                }}
              >
                {viewToggle.leftLabel}
              </button>
              <button
                onClick={() => onSetMode(viewToggle.right)}
                className="rounded-md px-3.5 py-1.5 text-xs font-semibold"
                style={{
                  background: mode === viewToggle.right ? 'white' : 'transparent',
                  color: mode === viewToggle.right ? 'oklch(0.27 0.02 255)' : 'oklch(0.5 0.015 255)',
                  boxShadow: mode === viewToggle.right ? '0 1px 2px oklch(0.5 0.02 255 / .18)' : 'none',
                }}
              >
                {viewToggle.rightLabel}
              </button>
            </>
          )}
        </div>

        <div className="flex-1" />

        <button
          onClick={onSubmitRequest}
          className="rounded-lg px-[15px] py-2.5 text-[12.5px] font-semibold"
          style={{ background: 'oklch(0.68 0.17 52)', color: 'oklch(0.99 0.01 85)', boxShadow: '0 1px 2px oklch(0.55 0.13 52 / .35)' }}
        >
          Submit Request
        </button>
      </header>

      {showDecisionIntelligence && (
        <section
          className="flex flex-wrap items-stretch gap-y-3.5 gap-x-0 bg-white px-[22px] pb-3 pt-3.5"
          style={{ borderBottom: '1px solid oklch(0.91 0.006 255)' }}
        >
        <div className="min-w-[min(340px,100%)] flex-[1_1_340px]">
          <div className="flex flex-wrap items-baseline gap-2">
            <h1 className="m-0 text-xl font-semibold" style={{ letterSpacing: '-.01em' }}>
              {headline}
            </h1>
            <span className="text-[12.5px]" style={{ color: 'oklch(0.52 0.015 255)' }}>
              {headlineSub}
            </span>
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            {pressureChips.map((c) => (
              <span
                key={c.label}
                className="inline-flex items-center gap-1.5 rounded-full py-[3.5px] pl-1.5 pr-2.5 text-[11.5px] font-medium"
                style={{ background: c.bg, color: c.fg, border: `1px solid ${c.border}` }}
              >
                <span
                  className="h-[5px] w-[5px] rounded-full"
                  style={{ background: c.dot, animation: c.pulse ? 'tri-pulse 1.9s ease-in-out infinite' : 'none' }}
                />
                {c.label}
              </span>
            ))}
          </div>
        </div>

        {hasNextCall && (
          <div
            className="ml-[18px] min-w-[min(300px,100%)] max-w-[340px] flex-[1_1_300px] rounded-[10px] px-3 py-2.5"
            style={{ background: 'oklch(0.985 0.012 52)', border: '1px solid oklch(0.92 0.04 52)' }}
          >
            <div className="mb-1 flex items-center gap-1.5">
              <span className="text-[9.5px] font-bold uppercase" style={{ letterSpacing: '.09em', color: 'oklch(0.5 0.15 52)' }}>
                Recommended next call
              </span>
              <span className="font-mono text-[10.5px]" style={{ color: 'oklch(0.5 0.02 255)' }}>
                {nextCallClock}
              </span>
            </div>
            <div className="overflow-hidden text-ellipsis whitespace-nowrap text-[12.5px] font-semibold leading-tight">
              {nextCallName}
            </div>
            <div className="mt-0.5 overflow-hidden text-ellipsis whitespace-nowrap text-[11.5px]" style={{ color: 'oklch(0.5 0.015 255)' }}>
              {nextCallWho} · {nextCallMove}
            </div>
            <div className="mt-1.5 text-[11.5px] italic leading-relaxed" style={{ color: 'oklch(0.4 0.02 255)' }}>
              {nextCallLine}
            </div>
            <button
              onClick={onNextCallAct}
              className="mt-2 rounded-md px-2.5 py-1.5 text-[11.5px] font-semibold"
              style={{ background: 'oklch(0.68 0.17 52)', color: 'oklch(0.99 0.01 85)' }}
            >
              Log the follow-up
            </button>
          </div>
        )}

        <div
          className="ml-[18px] min-w-[min(212px,100%)] flex-[0_1_212px] pl-[18px]"
          style={{ borderLeft: '1px solid oklch(0.93 0.006 255)' }}
        >
          <div className="flex items-baseline justify-between">
            <span className="text-[10.5px] font-semibold uppercase" style={{ letterSpacing: '.08em', color: 'oklch(0.55 0.015 255)' }}>
              Cleared today
            </span>
            <span className="font-mono text-[12.5px] font-semibold">
              {clearedCount}
              <span style={{ color: 'oklch(0.62 0.015 255)' }}>/{dayTotal}</span>
            </span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full" style={{ background: 'oklch(0.93 0.006 255)' }}>
            <div
              className="h-full rounded-full transition-all duration-[350ms]"
              style={{ background: 'oklch(0.6 0.1 168)', width: `${progressPct}%` }}
            />
          </div>
          <div className="mt-1.5 text-[11px] leading-relaxed" style={{ color: 'oklch(0.52 0.015 255)' }}>
            {momentumLine}
          </div>
          {canUndo && (
            <button
              onClick={onUndo}
              className="mt-1.5 rounded-md px-2 py-1 text-[11px] font-medium"
              style={{ border: '1px solid oklch(0.88 0.008 255)', background: 'oklch(0.985 0.003 85)', color: 'oklch(0.35 0.02 255)' }}
            >
              Undo — {lastClearedName}
            </button>
          )}
        </div>
      </section>
      )}
    </>
  )
}
