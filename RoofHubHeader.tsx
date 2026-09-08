import clsx from 'clsx'
import { useAppStore } from '@/state/appStore'
import { PERSONA_META } from '@/data/sampleData'
import { PersonaSwitcher } from './PersonaSwitcher'

const ACTIVE_VIEWS = ['dashboard', 'project', 'wizard', 'triage-detail', 'quote-detail']

export function RoofHubHeader() {
  const view = useAppStore((s) => s.view)
  const persona = useAppStore((s) => s.persona)
  const setView = useAppStore((s) => s.setView)

  return (
    <header className="sticky top-0 z-30">
      {/* Top bar — brand mark, Internal tag, order hub, persona, account */}
      <div className="flex w-full items-center gap-4 bg-roofhub-red px-6 py-2.5">
        <button onClick={() => setView('home')} className="flex flex-none items-center gap-1.5">
          <span className="text-xl leading-none">🏠</span>
          <span className="text-lg font-extrabold italic tracking-tight text-white">ROOF HUB</span>
        </button>
        <span className="flex-none rounded-sm bg-white/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
          Internal
        </span>

        <div className="flex-1" />

        <span className="flex flex-none items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-sm font-semibold text-white">
          ⚡ MY ORDER HUB <span className="text-[10px]">⌄</span>
        </span>

        <PersonaSwitcher variant="roofhub" />

        <span className="flex flex-none items-center gap-1.5 text-sm font-semibold text-white">
          👤 {PERSONA_META[persona].name} <span className="text-[10px] text-white/70">⌄</span>
        </span>
      </div>

      {/* Nav row — category links, GRIDS+ entry point via Roof Hub Estimator */}
      <div className="flex w-full items-center gap-6 bg-roofhub-navy px-6 py-2.5 text-sm font-semibold text-slate-300">
        <button onClick={() => setView('home')} className="text-lg leading-none text-white hover:text-slate-200">
          🏠
        </button>
        <button onClick={() => setView('home')} className="flex items-center gap-1 hover:text-white">
          Products <span className="text-[9px] text-slate-500">▾</span>
        </button>
        <button onClick={() => setView('home')} className="hover:text-white">
          Deliveries
        </button>
        <button onClick={() => setView('home')} className="hover:text-white">
          Orders
        </button>
        <button onClick={() => setView('home')} className="hover:text-white">
          Invoices
        </button>
        <button onClick={() => setView('home')} className="hover:text-white">
          Quotes
        </button>
        <button onClick={() => setView('home')} className="hover:text-white">
          Promotions
        </button>
        <button onClick={() => setView('home')} className="border-b-2 border-white pb-0.5 text-white">
          Weather
        </button>
        <button onClick={() => setView('home')} className="flex items-center gap-1 hover:text-white">
          More <span className="text-[9px] text-slate-500">▾</span>
        </button>

        <div className="flex-1" />

        {persona === 'tm' && (
          <button
            onClick={() => setView('customers')}
            className={clsx(
              'flex items-center gap-1 rounded-md px-2 py-1',
              view === 'customers' ? 'bg-white/10 text-white' : 'hover:bg-white/5 hover:text-white',
            )}
          >
            👥 Customers
          </button>
        )}

        <button
          onClick={() => setView('dashboard')}
          className={clsx(
            'flex items-center gap-2 rounded-md px-2 py-1',
            ACTIVE_VIEWS.includes(view) ? 'bg-white/10' : 'hover:bg-white/5',
          )}
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-sm bg-roofhub-gold text-xs">🧮</span>
          <span className="text-left leading-tight">
            <div className="text-[13px] font-extrabold text-white">ROOF HUB</div>
            <div className="-mt-0.5 text-[10px] font-bold tracking-wide text-slate-300">ESTIMATOR</div>
          </span>
        </button>
      </div>
    </header>
  )
}
