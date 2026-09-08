import { AppShell } from '@/components/layout/AppShell'
import { useAppStore } from '@/state/appStore'
import { scopeUsesMvpParityDashboard } from '@/config/demoScope'
import { Home } from '@/pages/Home'
import { Dashboard } from '@/pages/Dashboard'
import { CommercialProjectsDashboard } from '@/pages/commercial/CommercialProjectsDashboard'
import { IntakeWizard } from '@/pages/IntakeWizard'
import { ProjectDetail } from '@/pages/ProjectDetail'
import { TriageProjectDetail } from '@/pages/dashboard/TriageProjectDetail'
import { TriageQuoteDetail } from '@/pages/dashboard/TriageQuoteDetail'
import { CustomerManagement } from '@/pages/CustomerManagement'
import { DecisionDemo } from '@/pages/decision-demo/DecisionDemo'

function App() {
  const view = useAppStore((s) => s.view)
  const demoScope = useAppStore((s) => s.demoScope)
  const hostPlatform = useAppStore((s) => s.hostPlatform)
  const mvpParity = scopeUsesMvpParityDashboard(demoScope, hostPlatform)

  // The decision demo owns its own chrome (Heritage+ appears only on its entry screen), so it
  // bypasses AppShell entirely rather than nesting under the standard GRIDS+ Phase 0 header.
  if (view === 'decision-demo') return <DecisionDemo />

  return (
    <AppShell>
      {view === 'home' && <Home />}
      {view === 'dashboard' && (mvpParity ? <CommercialProjectsDashboard /> : <Dashboard />)}
      {view === 'wizard' && <IntakeWizard />}
      {view === 'project' && <ProjectDetail />}
      {view === 'triage-detail' && <TriageProjectDetail />}
      {view === 'quote-detail' && <TriageQuoteDetail />}
      {view === 'customers' && <CustomerManagement />}
    </AppShell>
  )
}

export default App
