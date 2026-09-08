import clsx from 'clsx'
import { useAppStore } from '@/state/appStore'
import { PERSONA_META, PROJECT } from '@/data/sampleData'
import { PersonaSwitcher } from './PersonaSwitcher'

const ACTIVE_VIEWS = ['dashboard', 'project', 'wizard', 'triage-detail', 'quote-detail']

export function GridsPlusHeader() {
  const view = useAppStore((s) => s.view)
  const persona = useAppStore((s) => s.persona)
  const setView = useAppStore((s) => s.setView)

  return (
    <header className="sticky top-0 z-30 bg-grids-navy text-white shadow-md">
      <div className="flex w-full items-center gap-5 px-6 py-3">
        <button onClick={() => setView('dashboard')} className="flex flex-none items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-white/15 text-sm font-bold">G+</span>
          <span className="text-lg font-extrabold tracking-tight">GRIDS+</span>
        </button>

        <span className="text-white/25">|</span>
        <span className="hidden text-sm text-white/70 sm:inline">{PROJECT.customer.company}</span>

        <nav className="ml-2 flex items-center gap-1 text-sm font-semibold">
          <button
            onClick={() => setView('dashboard')}
            className={clsx(
              'rounded-md px-3 py-1.5 transition-colors',
              ACTIVE_VIEWS.includes(view) ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white',
            )}
          >
            Projects
          </button>
          <button
            onClick={() => setView('dashboard')}
            className="rounded-md px-3 py-1.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
          >
            Quotes
          </button>
          {persona === 'tm' && (
            <button
              onClick={() => setView('customers')}
              className={clsx(
                'rounded-md px-3 py-1.5 transition-colors',
                view === 'customers' ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white',
              )}
            >
              Customers
            </button>
          )}
        </nav>

        <div className="flex-1" />

        <PersonaSwitcher variant="dark" />

        <span className="hidden text-sm font-semibold text-white/90 sm:inline">{PERSONA_META[persona].name}</span>
      </div>
    </header>
  )
}
