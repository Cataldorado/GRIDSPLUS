import clsx from 'clsx'
import { useAppStore } from '@/state/appStore'
import { PERSONA_META, type Persona } from '@/data/sampleData'

const PERSONAS: Persona[] = ['customer', 'tm', 'estimator']

export type PersonaSwitcherVariant = 'heritage' | 'dark' | 'roofhub' | 'grids-tm' | 'pill-dark'

interface Props {
  variant?: PersonaSwitcherVariant
  /** Show signed-in name beside the toggle. */
  showName?: boolean
  className?: string
}

export function PersonaSwitcher({ variant = 'heritage', showName = false, className }: Props) {
  const persona = useAppStore((s) => s.persona)
  const setPersona = useAppStore((s) => s.setPersona)

  const track =
    variant === 'dark' || variant === 'roofhub'
      ? 'rounded-lg bg-white/10 p-1'
      : variant === 'grids-tm'
        ? 'rounded border border-slate-300 bg-slate-50 p-0.5'
        : variant === 'pill-dark'
          ? 'rounded-full bg-slate-900/80 p-1'
          : 'rounded-lg bg-slate-50 p-1'

  const active =
    variant === 'dark'
      ? 'bg-white text-grids-navy'
      : variant === 'roofhub'
        ? 'bg-white text-roofhub-red'
      : variant === 'grids-tm'
        ? 'bg-[#1a5fb4] text-white shadow-sm'
        : variant === 'pill-dark'
          ? 'bg-white text-slate-900'
          : 'bg-white text-grids-navy shadow-sm'

  const idle =
    variant === 'dark' || variant === 'roofhub'
      ? 'text-white/75 hover:text-white'
      : variant === 'grids-tm'
        ? 'text-slate-600 hover:bg-white hover:text-slate-900'
        : variant === 'pill-dark'
          ? 'text-white/70 hover:text-white'
          : 'text-slate-500 hover:text-slate-700'

  return (
    <div className={clsx('flex items-center gap-2', className)}>
      <div className={clsx('flex items-center gap-0.5', track)} role="group" aria-label="Switch persona">
        {PERSONAS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPersona(p)}
            title={PERSONA_META[p].label}
            className={clsx(
              'rounded-md px-2 py-1 text-[11px] font-semibold transition-colors',
              persona === p ? active : idle,
            )}
          >
            {PERSONA_META[p].label}
          </button>
        ))}
      </div>
      {showName && (
        <span
          className={clsx(
            'text-[12px] font-semibold',
            variant === 'dark' || variant === 'pill-dark' ? 'text-white/90' : 'text-slate-800',
          )}
        >
          {PERSONA_META[persona].name}
        </span>
      )}
    </div>
  )
}
