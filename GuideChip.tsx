import { useAppStore } from '@/state/appStore'
import { nextActor, PERSONA_META } from '@/data/sampleData'

function useGuideTip(): string {
  const view = useAppStore((s) => s.view)
  const persona = useAppStore((s) => s.persona)
  const projectCreated = useAppStore((s) => s.projectCreated)
  const stage = useAppStore((s) => s.stage)
  const modificationRequested = useAppStore((s) => s.modificationRequested)

  if (view === 'home') {
    return persona === 'customer'
      ? 'Find the "My Projects" panel below to reach your project dashboard.'
      : 'Click "Projects" in the nav to see your queue.'
  }
  if (view === 'wizard') {
    return 'Fill in project info, then add what you have — watch the suggestions and turnaround tracker respond.'
  }
  if (view === 'dashboard') {
    if (!projectCreated) return 'Click "+ New Project" to start the intake wizard as the customer.'
    const actor = nextActor(stage, modificationRequested)
    if (actor === persona) return 'Riverside Office Park needs your attention — open it from the list below.'
    return actor
      ? `Riverside Office Park is currently with ${PERSONA_META[actor].label} — switch personas to follow along.`
      : 'Riverside Office Park is complete — browse the other demo projects or reset to replay.'
  }
  if (view === 'project') {
    const actor = nextActor(stage, modificationRequested)
    if (actor === persona) return 'Check the tab that needs action — Overview shows exactly what to do next.'
    return actor
      ? `Waiting on ${PERSONA_META[actor].label}. Switch personas (top right) to act on their behalf.`
      : 'This project is complete. Try "Reset demo" (top left) to replay the story.'
  }
  return ''
}

export function GuideChip() {
  const tip = useGuideTip()

  return (
    <details className="group fixed bottom-3 right-3 z-40">
      <summary className="flex cursor-pointer list-none items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-500 shadow-sm hover:text-grids-navy">
        <span className="text-sm">💡</span> Guide
      </summary>
      <div className="mt-2 w-64 rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-600 shadow-lg">
        {tip}
      </div>
    </details>
  )
}
