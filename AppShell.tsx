import type { ReactNode } from 'react'
import clsx from 'clsx'
import { useAppStore, type HostPlatform } from '@/state/appStore'
import { PersonaSwitcher } from '@/components/layout/PersonaSwitcher'
import { DEMO_SCOPE_META, scopeUsesMvpParityDashboard, type DemoScope } from '@/config/demoScope'
import { GuideChip } from './GuideChip'
import { HeritageHeader } from './HeritageHeader'
import { RoofHubHeader } from './RoofHubHeader'
import { GridsPlusHeader } from './GridsPlusHeader'

const PLATFORMS: { key: HostPlatform; label: string }[] = [
  { key: 'heritage', label: 'Heritage+' },
  { key: 'roofhub', label: 'RoofHub' },
  { key: 'grids', label: 'GRIDS+ only' },
]

const SCOPES: DemoScope[] = ['mvp', 'vision']

export function AppShell({ children }: { children: ReactNode }) {
  const view = useAppStore((s) => s.view)
  const hostPlatform = useAppStore((s) => s.hostPlatform)
  const demoScope = useAppStore((s) => s.demoScope)
  const setHostPlatform = useAppStore((s) => s.setHostPlatform)
  const setDemoScope = useAppStore((s) => s.setDemoScope)
  const restart = useAppStore((s) => s.restart)
  const setView = useAppStore((s) => s.setView)

  const mvpParityDashboard = scopeUsesMvpParityDashboard(demoScope, hostPlatform)
  const hidePlatformHeader = mvpParityDashboard && view === 'dashboard'

  return (
    <div className="min-h-svh bg-surface">
      {!hidePlatformHeader && (
        hostPlatform === 'heritage' ? (
          <HeritageHeader />
        ) : hostPlatform === 'roofhub' ? (
          <RoofHubHeader />
        ) : (
          <GridsPlusHeader />
        )
      )}

      <main
        className={
          view === 'dashboard'
            ? 'w-full px-6 pt-4 pb-20'
            : 'mx-auto max-w-6xl px-6 pt-6 pb-20'
        }
      >
        {children}
      </main>

      <div className="fixed bottom-3 left-3 z-40 flex items-center gap-2">
        <span className="rounded-full bg-slate-900/80 px-2.5 py-1 text-[10px] font-medium tracking-wide text-white/80">
          {DEMO_SCOPE_META[demoScope].banner}
        </span>
        <div className="flex items-center gap-1 rounded-full bg-slate-900/80 p-1 pl-2.5 text-[10px]">
          <span className="font-medium tracking-wide text-white/60">Scope:</span>
          {SCOPES.map((s) => (
            <button
              key={s}
              onClick={() => setDemoScope(s)}
              className={clsx(
                'rounded-full px-2 py-0.5 font-semibold transition-colors',
                demoScope === s ? 'bg-white text-slate-900' : 'text-white/70 hover:text-white',
              )}
            >
              {DEMO_SCOPE_META[s].label}
            </button>
          ))}
        </div>
        {demoScope === 'mvp' && hidePlatformHeader && <PersonaSwitcher variant="pill-dark" />}
        <div className="flex items-center gap-1 rounded-full bg-slate-900/80 p-1 pl-2.5 text-[10px]">
          <span className="font-medium tracking-wide text-white/60">Posted in:</span>
          {PLATFORMS.map((p) => (
            <button
              key={p.key}
              onClick={() => setHostPlatform(p.key)}
              className={clsx(
                'rounded-full px-2 py-0.5 font-semibold transition-colors',
                hostPlatform === p.key ? 'bg-white text-slate-900' : 'text-white/70 hover:text-white',
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
        <button
          onClick={restart}
          className="rounded-full bg-slate-900/80 px-2.5 py-1 text-[10px] font-medium tracking-wide text-white/70 hover:text-white"
        >
          Reset demo
        </button>
        <button
          onClick={() => setView('decision-demo')}
          className="rounded-full bg-slate-900/80 px-2.5 py-1 text-[10px] font-medium tracking-wide text-white/70 hover:text-white"
        >
          WQ-1 Decision Demo →
        </button>
      </div>
      <GuideChip />
    </div>
  )
}
