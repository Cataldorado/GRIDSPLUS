import { useMemo, useState } from 'react'
import type { LeadDisposition } from '@/data/leadActions'
import type { Persona } from '@/data/sampleData'
import {
  displayUnifiedOpportunityStatus,
  effectiveUnifiedBoardColumn,
  showUnifiedDiscoveryActions,
} from '@/data/unifiedLeadActions'
import { UNIFIED_BOARD_COLUMNS, type UnifiedBoardColumn, type UnifiedBoardProject } from '@/data/unifiedBoard'
import type { CommercialPlatformTheme } from './platformTheme'
import { CommercialBoardCard } from './CommercialBoardCard'

interface Props {
  projects: UnifiedBoardProject[]
  persona: Persona
  theme: CommercialPlatformTheme
  leadDisposition: Record<string, LeadDisposition>
  templateFilter: string
  compact?: boolean
  onOpenProject: (p: UnifiedBoardProject) => void
  onArchive: (p: UnifiedBoardProject) => void
  onInvite: (p: UnifiedBoardProject) => void
  onAddBidder: (p: UnifiedBoardProject) => void
  onInterested: (p: UnifiedBoardProject) => void
  onNotInterested: (p: UnifiedBoardProject) => void
  onRequestSubmittal: (p: UnifiedBoardProject) => void
}

export function CommercialBoardView({
  projects,
  persona,
  theme,
  leadDisposition,
  templateFilter,
  compact = false,
  onOpenProject,
  onArchive,
  onInvite,
  onAddBidder,
  onInterested,
  onNotInterested,
  onRequestSubmittal,
}: Props) {
  const [phaseFilter, setPhaseFilter] = useState('All Phases')
  const [columnTemplate, setColumnTemplate] = useState(templateFilter)

  const byColumn = useMemo(() => {
    const map: Record<UnifiedBoardColumn, UnifiedBoardProject[]> = {
      'new-leads': [],
      'requires-attention': [],
      'in-progress': [],
      complete: [],
    }
    for (const p of projects) {
      const column = effectiveUnifiedBoardColumn(p, leadDisposition)
      if (!column) continue
      if (columnTemplate !== 'All Templates' && p.template !== columnTemplate && column === 'new-leads') continue
      const status = displayUnifiedOpportunityStatus(p, leadDisposition)
      if (column === 'complete' && phaseFilter === 'Committed' && status !== 'COMMITTED') continue
      if (column === 'complete' && phaseFilter === 'Lost' && status !== 'LOST BY CUSTOMER') continue
      map[column].push(p)
    }
    return map
  }, [projects, leadDisposition, columnTemplate, phaseFilter])

  return (
    <div className="grid grid-cols-4 gap-0 border-t border-slate-300">
      {UNIFIED_BOARD_COLUMNS.map((col) => {
        const items = byColumn[col.key]
        return (
          <section key={col.key} className="min-w-0 border-r border-slate-300 last:border-r-0">
            <div
              className="flex flex-wrap items-center gap-2 px-2 py-2 text-white"
              style={{ background: theme.columnHeaderBg }}
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
                const discovery = showUnifiedDiscoveryActions(p, leadDisposition)
                const opportunityStatus = displayUnifiedOpportunityStatus(p, leadDisposition)
                return (
                  <CommercialBoardCard
                    key={p.num}
                    project={p}
                    persona={persona}
                    theme={theme}
                    compact={compact}
                    opportunityStatus={opportunityStatus}
                    showDiscoveryActions={discovery}
                    onOpen={() => onOpenProject(p)}
                    actions={{
                      onArchive: () => onArchive(p),
                      onInvite: () => onInvite(p),
                      onAddBidder: () => onAddBidder(p),
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
