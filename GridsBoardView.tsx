import { useMemo, useState } from 'react'
import type { LeadDisposition } from '@/data/leadActions'
import type { Persona } from '@/data/sampleData'
import {
  displayGridsOpportunityStatus,
  effectiveGridsBoardColumn,
  showGridsDiscoveryActions,
} from '@/data/gridsLeadActions'
import type { GridsBoardColumn, GridsTmProject } from '@/data/gridsTmProjects'
import { GRIDS_BOARD_COLUMNS } from '@/data/gridsTmProjects'
import { GridsBoardCard } from './GridsBoardCard'

interface Props {
  projects: GridsTmProject[]
  persona: Persona
  leadDisposition: Record<string, LeadDisposition>
  templateFilter: string
  onOpenProject: (p: GridsTmProject) => void
  onArchive: (p: GridsTmProject) => void
  onInvite: (p: GridsTmProject) => void
  onInterested: (p: GridsTmProject) => void
  onNotInterested: (p: GridsTmProject) => void
  onRequestSubmittal: (p: GridsTmProject) => void
}

export function GridsBoardView({
  projects,
  persona,
  leadDisposition,
  templateFilter,
  onOpenProject,
  onArchive,
  onInvite,
  onInterested,
  onNotInterested,
  onRequestSubmittal,
}: Props) {
  const [phaseFilter, setPhaseFilter] = useState('All Phases')
  const [columnTemplate, setColumnTemplate] = useState(templateFilter)

  const byColumn = useMemo(() => {
    const map: Record<GridsBoardColumn, GridsTmProject[]> = {
      'new-leads': [],
      'requires-attention': [],
      'in-progress': [],
      complete: [],
    }
    for (const p of projects) {
      const column = effectiveGridsBoardColumn(p, leadDisposition)
      if (!column) continue
      if (columnTemplate !== 'All Templates' && p.template !== columnTemplate && column === 'new-leads') continue
      const status = displayGridsOpportunityStatus(p, leadDisposition)
      if (column === 'complete' && phaseFilter === 'Committed' && status !== 'COMMITTED') continue
      if (column === 'complete' && phaseFilter === 'Lost' && status !== 'LOST BY CUSTOMER') continue
      map[column].push(p)
    }
    return map
  }, [projects, leadDisposition, columnTemplate, phaseFilter])

  return (
    <div className="grid grid-cols-4 gap-0 border-t border-slate-300">
      {GRIDS_BOARD_COLUMNS.map((col) => {
        const items = byColumn[col.key]
        return (
          <section key={col.key} className="min-w-0 border-r border-slate-300 last:border-r-0">
            <div
              className="flex flex-wrap items-center gap-2 px-2 py-2 text-white"
              style={{ background: '#1a2744' }}
            >
              <h2 className="m-0 text-[13px] font-bold">
                {col.title} ({items.length})
              </h2>
              {col.filter && col.key === 'new-leads' && (
                <select
                  value={columnTemplate}
                  onChange={(e) => setColumnTemplate(e.target.value)}
                  className="ml-auto rounded border-0 bg-white/15 px-1.5 py-0.5 text-[10px] text-white"
                >
                  {col.filter.options.map((o) => (
                    <option key={o} value={o} className="text-slate-900">{o}</option>
                  ))}
                </select>
              )}
              {col.filter && col.key === 'complete' && (
                <select
                  value={phaseFilter}
                  onChange={(e) => setPhaseFilter(e.target.value)}
                  className="ml-auto rounded border-0 bg-white/15 px-1.5 py-0.5 text-[10px] text-white"
                >
                  {col.filter.options.map((o) => (
                    <option key={o} value={o} className="text-slate-900">{o}</option>
                  ))}
                </select>
              )}
              {col.archiveLink && (
                <button type="button" className="text-[10px] font-semibold text-orange-300 hover:underline">
                  View Archive
                </button>
              )}
            </div>
            <div className="min-h-[420px] space-y-2.5 bg-[#e8e8e8] p-2">
              {items.map((p) => {
                const discovery = showGridsDiscoveryActions(p, leadDisposition)
                const opportunityStatus = displayGridsOpportunityStatus(p, leadDisposition)
                return (
                  <GridsBoardCard
                    key={p.num}
                    project={p}
                    persona={persona}
                    opportunityStatus={opportunityStatus}
                    showDiscoveryActions={discovery}
                    onOpen={() => onOpenProject(p)}
                    actions={{
                      onArchive: () => onArchive(p),
                      onInvite: () => onInvite(p),
                      onInterested: () => onInterested(p),
                      onNotInterested: () => onNotInterested(p),
                      onRequestSubmittal: p.showRequestSubmittal ? () => onRequestSubmittal(p) : undefined,
                    }}
                  />
                )
              })}
              {items.length === 0 && (
                <p className="px-2 py-8 text-center text-[11px] text-slate-500">No projects</p>
              )}
            </div>
          </section>
        )
      })}
    </div>
  )
}
