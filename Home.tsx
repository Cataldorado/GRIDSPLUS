import { useAppStore } from '@/state/appStore'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { PERSONA_META } from '@/data/sampleData'

const HERO_STYLES = {
  heritage: {
    title: 'Heritage+ Homepage',
    gradient: 'from-heritage-green to-heritage-green-dark',
    eyebrow: 'Heritage+',
  },
  roofhub: {
    title: 'RoofHub Homepage',
    gradient: 'from-roofhub-red to-roofhub-red-dark',
    eyebrow: 'RoofHub',
  },
  grids: {
    title: 'GRIDS+ Homepage',
    gradient: 'from-grids-navy to-grids-navy-light',
    eyebrow: 'GRIDS+',
  },
} as const

export function Home() {
  const persona = useAppStore((s) => s.persona)
  const hostPlatform = useAppStore((s) => s.hostPlatform)
  const setView = useAppStore((s) => s.setView)

  const hero = HERO_STYLES[hostPlatform]
  const goToProjects = () => setView('dashboard')

  return (
    <div className="space-y-6">
      <div className={`overflow-hidden rounded-2xl bg-gradient-to-br ${hero.gradient} px-8 py-16 text-white`}>
        <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
          {hero.eyebrow} · Welcome back, {PERSONA_META[persona].name.split(' ')[0]}
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">{hero.title}</h1>
      </div>

      <Card className="flex items-center justify-between border-2 border-grids-blue/30 bg-grids-blue/5">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-grids-navy">My Projects</div>
          <h2 className="mt-1 text-lg font-bold text-slate-900">
            {persona === 'customer' ? 'Manage your commercial bids and quotes' : 'Your commercial project queue'}
          </h2>
          <p className="mt-1 max-w-md text-sm text-slate-500">
            {persona === 'customer'
              ? 'Start a new project, track intake and estimating, and review quotes — all in GRIDS+.'
              : 'Track assignments, requires-attention items, and quote status across your territory.'}
          </p>
        </div>
        <Button onClick={goToProjects}>Go to My Projects →</Button>
      </Card>
    </div>
  )
}
