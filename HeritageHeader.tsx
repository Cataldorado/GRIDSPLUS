import clsx from 'clsx'
import { useAppStore } from '@/state/appStore'
import { PERSONA_META, PROJECT } from '@/data/sampleData'
import { PersonaSwitcher } from './PersonaSwitcher'

const ACTIVE_VIEWS = ['dashboard', 'project', 'wizard', 'triage-detail', 'quote-detail']

export function HeritageHeader() {
  const view = useAppStore((s) => s.view)
  const persona = useAppStore((s) => s.persona)
  const setView = useAppStore((s) => s.setView)

  return (
    <>
      <div className="flex items-center justify-between bg-heritage-green px-6 py-1.5 text-xs text-white">
        <span>
          <strong className="font-semibold">Your Branch:</strong> SACRAMENTO VALLEY
        </span>
        <span>
          <strong className="font-semibold">Ship-To:</strong> {PROJECT.customer.company.toUpperCase()}
        </span>
      </div>

      <header className="sticky top-0 z-30 bg-white">
        {/* Utility row — logo, search, Ask AI, Buy Again, Account, Cart */}
        <div className="flex w-full items-center gap-5 px-6 py-2.5">
          <button onClick={() => setView('home')} className="flex flex-none items-center gap-2">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-md bg-grids-navy text-base font-bold text-white">
              H
              <span className="absolute -right-1 -top-1 text-[10px] font-bold text-emerald-400">+</span>
            </div>
            <span className="text-lg font-extrabold tracking-tight text-grids-navy">HERITAGE+</span>
          </button>

          <div className="mx-2 h-7 w-px flex-none bg-slate-200" />

          <div className="flex min-w-0 flex-1 items-center">
            <div className="flex w-full max-w-xl items-center overflow-hidden rounded-md border border-slate-300 bg-slate-100">
              <input
                disabled
                placeholder="Search Item #, Keyword, or SKU"
                className="w-full bg-transparent px-3 py-2 text-sm text-slate-500 placeholder:text-slate-400"
              />
              <span className="flex h-full items-center bg-heritage-green px-3 py-2 text-white">🔍</span>
            </div>
          </div>

          <span className="flex flex-none items-center gap-1.5 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-sm font-semibold text-orange-600">
            ✨ Ask AI
          </span>

          <div className="flex flex-none items-center gap-1.5 text-sm text-slate-600">
            <span className="text-lg">📋</span>
            <span className="leading-tight">
              <div className="font-semibold text-slate-800">Buy Again</div>
              <div className="text-xs text-slate-400">Ordered Items</div>
            </span>
          </div>

          <PersonaSwitcher variant="heritage" />

          <div className="flex flex-none items-center gap-1 text-sm text-slate-600">
            <span className="leading-tight">
              <div className="font-semibold text-slate-800">Account</div>
              <div className="text-xs text-slate-400">Hello, {PERSONA_META[persona].name.split(' ')[0]}!</div>
            </span>
            <span className="text-slate-400">⌄</span>
          </div>

          <div className="relative flex flex-none items-center gap-1.5 text-sm font-semibold text-slate-800">
            <span className="absolute -right-1.5 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-orange-500 text-[9px] font-bold text-white">
              1
            </span>
            <span className="text-lg">🛒</span>
            Cart
          </div>
        </div>

        {/* Nav row — category links, GRIDS+ entry point, resources */}
        <div className="flex w-full items-center gap-6 border-y border-slate-200 px-6 py-2.5 text-sm font-medium text-slate-600">
          <button onClick={() => setView('home')} className="flex items-center gap-1 hover:text-slate-900">
            Shop Products <span className="text-[10px] text-slate-400">▾</span>
          </button>
          <button onClick={() => setView('home')} className="flex items-center gap-1 hover:text-slate-900">
            ProDeals <span className="text-[10px] text-slate-400">▾</span>
          </button>
          <button onClick={() => setView('home')} className="flex items-center gap-1 hover:text-slate-900">
            Brands <span className="text-[10px] text-slate-400">▾</span>
          </button>
          <button
            onClick={() => setView('dashboard')}
            className={clsx(
              'flex items-center gap-1.5 font-bold',
              ACTIVE_VIEWS.includes(view) ? 'text-grids-navy' : 'text-slate-700 hover:text-grids-navy',
            )}
          >
            <span className="flex h-4 w-4 items-center justify-center rounded-sm bg-heritage-green text-[10px] text-white">G</span>
            GRIDS
          </button>

          {persona === 'tm' && (
            <button
              onClick={() => setView('customers')}
              className={clsx(
                'flex items-center gap-1 hover:text-grids-navy',
                view === 'customers' ? 'font-bold text-grids-navy' : 'text-slate-700',
              )}
            >
              👥 Customers
            </button>
          )}

          <div className="flex-1" />

          <span className="flex items-center gap-1 text-grids-blue">📍 Find a Branch</span>
          <button onClick={() => setView('home')} className="flex items-center gap-1 hover:text-slate-900">
            Resources <span className="text-[10px] text-slate-400">▾</span>
          </button>
        </div>
      </header>
    </>
  )
}
