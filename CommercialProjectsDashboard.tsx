import { useMemo, useState } from 'react'
import clsx from 'clsx'
import { PersonaSwitcher } from '@/components/layout/PersonaSwitcher'
import { useAppStore } from '@/state/appStore'
import { gridsAccountForPersona } from '@/data/gridsImpersonation'
import { isUnifiedLeadHidden } from '@/data/unifiedLeadActions'
import { loadLandscapeProjects, loadRoofingProjects } from '@/data/unifiedBoardAdapters'
import {
  matchUnifiedQuery,
  sortUnifiedProjects,
  UNIFIED_SORT_OPTIONS,
  type UnifiedBoardProject,
  type UnifiedSortKey,
} from '@/data/unifiedBoard'
import { GridsAccountMenu } from '@/pages/grids/GridsAccountMenu'
import { TedCalendarPlaceholder } from '@/pages/ted/TedCalendarPlaceholder'
import { CommercialBoardView } from './CommercialBoardView'
import { CommercialFilterBar } from './CommercialFilterBar'
import { CommercialListTable } from './CommercialListTable'
import { themeForPlatform } from './platformTheme'

export type CommercialViewMode = 'list' | 'calendar' | 'board'

export function CommercialProjectsDashboard() {
  const setView = useAppStore((s) => s.setView)
  const hostPlatform = useAppStore((s) => s.hostPlatform)
  const persona = useAppStore((s) => s.persona)
  const openTriageDetail = useAppStore((s) => s.openTriageDetail)
  const archiveLead = useAppStore((s) => s.archiveLead)
  const expressInterest = useAppStore((s) => s.expressInterest)
  const leadDisposition = useAppStore((s) => s.leadDisposition)
  const gridsTmImpersonating = useAppStore((s) => s.gridsTmImpersonating)
  const setGridsTmImpersonating = useAppStore((s) => s.setGridsTmImpersonating)

  const theme = themeForPlatform(hostPlatform)
  const isRoofing = hostPlatform === 'roofhub'
  const toolbarOnDark = isRoofing

  const [viewMode, setViewMode] = useState<CommercialViewMode>('board')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<UnifiedSortKey>('created-desc')
  const [templateFilter, setTemplateFilter] = useState('All Templates')
  const [contractorFilter, setContractorFilter] = useState('')
  const [myProjectsOnly, setMyProjectsOnly] = useState(false)
  const [cardsCompact, setCardsCompact] = useState(true)
  const [advancedOpen, setAdvancedOpen] = useState(false)

  const accountSession = useMemo(
    () => gridsAccountForPersona(persona, persona === 'tm' && gridsTmImpersonating),
    [persona, gridsTmImpersonating],
  )

  const baseProjects = useMemo(
    () => (isRoofing ? loadRoofingProjects() : loadLandscapeProjects()),
    [isRoofing],
  )

  const projects = useMemo(() => {
    let list = baseProjects.filter((p) => matchUnifiedQuery(p, query))
    if (templateFilter !== 'All Templates') list = list.filter((p) => p.template === templateFilter)
    if (contractorFilter.trim()) {
      const q = contractorFilter.toLowerCase()
      list = list.filter((p) => (p.contractor ?? '').toLowerCase().includes(q))
    }
    if (myProjectsOnly && isRoofing) {
      list = list.filter((p) => p.num.includes('2613039') || p.num.includes('2613036') || p.num.includes('2613028'))
    }
    if (persona === 'customer') {
      list = list.filter((p) => {
        if (isUnifiedLeadHidden(p, leadDisposition)) return false
        if (p.vis !== 'Public') return false
        if (leadDisposition[p.num] === 'interested') return true
        return p.column === 'new-leads'
      })
    } else if (persona === 'estimator') {
      list = list.filter((p) => p.column !== 'new-leads' || p.vis !== 'Public')
    }
    return sortUnifiedProjects(list, sort)
  }, [baseProjects, query, templateFilter, contractorFilter, myProjectsOnly, isRoofing, persona, leadDisposition, sort])

  const visibleProjects = useMemo(
    () => projects.filter((p) => !isUnifiedLeadHidden(p, leadDisposition)),
    [projects, leadDisposition],
  )

  const isEmployee = persona === 'tm' || persona === 'estimator'

  const openProject = (p: UnifiedBoardProject) => openTriageDetail(p.num)

  const handleContractorSelect = (value: string) => {
    if (value === 'HPTA') {
      setGridsTmImpersonating(true)
      setContractorFilter('HERITAGE PLUS TEST ACCOUNT')
    } else if (value === 'Garden State Irrigation') {
      setGridsTmImpersonating(false)
      setContractorFilter('Garden State Irrigation')
    } else {
      setGridsTmImpersonating(false)
      setContractorFilter('')
    }
  }

  return (
    <div className="-mx-6 flex min-h-[calc(100svh-5rem)] flex-col bg-white">
      {/* Account bar — shared GRIDS+ chrome */}
      <div className="flex items-center justify-end gap-3 px-4 py-2 text-white" style={{ background: theme.headerBg }}>
        <button
          type="button"
          onClick={() => setView('wizard')}
          className="rounded px-4 py-1.5 text-[12px] font-bold text-white shadow-sm hover:opacity-95"
          style={{ background: theme.accent }}
        >
          {theme.submitCta}
        </button>
        <GridsAccountMenu
          session={accountSession}
          showTmNav={persona === 'tm'}
          onStopImpersonating={
            persona === 'tm' && gridsTmImpersonating ? () => setGridsTmImpersonating(false) : undefined
          }
          onInviteContractor={() => setView('customers')}
          onAccountDashboard={() => setView('customers')}
        />
      </div>

      {/* Brand + toolbar */}
      <div
        className={clsx('border-b px-3 py-2', toolbarOnDark ? 'text-white' : 'border-slate-300 bg-white text-slate-800')}
        style={toolbarOnDark ? { background: theme.toolbarBg } : undefined}
      >
        <div className="flex flex-wrap items-center gap-2">
          <div
            className="flex h-9 w-9 items-center justify-center rounded text-lg font-black text-white"
            style={{ background: theme.headerBg }}
          >
            {theme.logoMark}
          </div>
          <span className={clsx('text-[13px] font-bold', toolbarOnDark ? 'text-white' : 'text-slate-800')}>
            {theme.brandLabel}
          </span>

          {!isRoofing && (
            <>
              <input
                placeholder="Impersonate A User"
                defaultValue={gridsTmImpersonating && persona === 'tm' ? 'Divya Nethi' : ''}
                className="w-[140px] rounded border border-slate-300 px-2 py-1 text-[11px]"
                onFocus={() => persona === 'tm' && setGridsTmImpersonating(true)}
              />
              <select
                className="rounded border border-slate-300 px-2 py-1 text-[11px] text-slate-700"
                value={
                  contractorFilter === 'HERITAGE PLUS TEST ACCOUNT'
                    ? 'HPTA'
                    : contractorFilter === 'Garden State Irrigation'
                      ? 'Garden State Irrigation'
                      : ''
                }
                onChange={(e) => handleContractorSelect(e.target.value)}
              >
                <option value="">Select A Contractor To Filter</option>
                <option value="HPTA">HERITAGE PLUS TEST ACCOUNT</option>
                <option value="Garden State Irrigation">Garden State Irrigation</option>
              </select>
              <input
                value={contractorFilter}
                onChange={(e) => setContractorFilter(e.target.value)}
                placeholder="Impersonate a Contractor"
                className="w-[150px] rounded border border-slate-300 px-2 py-1 text-[11px]"
              />
            </>
          )}

          <div className="flex-1" />

          {!isRoofing && (
            <button
              type="button"
              onClick={() => setCardsCompact((v) => !v)}
              className="flex items-center gap-1 rounded px-3 py-1 text-[11px] font-bold text-white"
              style={{ background: theme.accent }}
            >
              {cardsCompact ? 'Expand' : 'Collapse'}
              <span aria-hidden>{cardsCompact ? '»' : '«'}</span>
            </button>
          )}

          <ViewToggle mode={viewMode} onChange={setViewMode} theme={theme} onDark={toolbarOnDark} />

          <div
            className={clsx(
              'flex min-w-[200px] flex-1 items-center overflow-hidden rounded border-2',
              toolbarOnDark ? 'border-white/20 bg-white' : 'border-[#e85d04] bg-white',
            )}
          >
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by Project Name/Number"
              className="min-w-0 flex-1 border-0 px-2 py-1 text-[12px] outline-none"
            />
            {isRoofing && (
              <button
                type="button"
                onClick={() => setAdvancedOpen((v) => !v)}
                className={clsx(
                  'border-l border-slate-200 px-2 py-1 text-[10px] font-bold uppercase',
                  advancedOpen ? 'bg-slate-100 text-slate-800' : 'bg-white',
                )}
                style={!advancedOpen ? { color: theme.accent } : undefined}
              >
                Advanced
              </button>
            )}
            <button type="button" className="border-l border-slate-200 bg-white px-2 text-slate-500">🔍</button>
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as UnifiedSortKey)}
            className="max-w-[220px] rounded border border-slate-300 bg-white px-2 py-1 text-[11px] text-slate-800"
          >
            {UNIFIED_SORT_OPTIONS.map((o) => (
              <option key={o.key} value={o.key}>{o.label}</option>
            ))}
          </select>

          <label className={clsx('flex cursor-pointer items-center gap-1.5 text-[11px] font-medium', toolbarOnDark && 'text-white')}>
            <input type="checkbox" checked={myProjectsOnly} onChange={(e) => setMyProjectsOnly(e.target.checked)} />
            My Projects Only
          </label>

          <PersonaSwitcher variant={toolbarOnDark ? 'dark' : 'grids-tm'} />
        </div>
      </div>

      {(viewMode === 'board' || advancedOpen) && (
        <CommercialFilterBar templateFilter={templateFilter} onTemplateFilter={setTemplateFilter} />
      )}

      <div className="flex-1 overflow-auto">
        {viewMode === 'list' && (
          <CommercialListTable
            rows={visibleProjects}
            theme={theme}
            leadDisposition={leadDisposition}
            compact={cardsCompact}
            onOpenProject={openProject}
            onAddBidder={openProject}
            canManageBidders={isEmployee}
          />
        )}
        {viewMode === 'calendar' && <TedCalendarPlaceholder count={visibleProjects.length} />}
        {viewMode === 'board' && (
          <CommercialBoardView
            projects={visibleProjects}
            persona={persona}
            theme={theme}
            leadDisposition={leadDisposition}
            templateFilter={templateFilter}
            compact={cardsCompact}
            onOpenProject={openProject}
            onArchive={(p) => archiveLead(p.num)}
            onInvite={openProject}
            onAddBidder={openProject}
            onInterested={(p) => expressInterest(p.num)}
            onNotInterested={(p) => archiveLead(p.num)}
            onRequestSubmittal={openProject}
          />
        )}
      </div>

      <footer
        className={clsx(
          'border-t px-4 py-1.5 text-center text-[10px]',
          theme.showGiddyupFooter ? 'bg-black text-white/80' : 'border-slate-300 bg-[#f0f0f0] text-slate-500',
        )}
      >
        {theme.showGiddyupFooter ? (
          <div className="flex items-center justify-center gap-6">
            <span className="font-bold text-white">{theme.footerBrand}</span>
            <span className="font-semibold italic text-white/90">giddyup</span>
            <span>© 2026 CutterCroix LLC™</span>
          </div>
        ) : (
          <span>{theme.footerBrand} · GRIDS+ unified commercial projects</span>
        )}
      </footer>
    </div>
  )
}

function ViewToggle({
  mode,
  onChange,
  theme,
  onDark,
}: {
  mode: CommercialViewMode
  onChange: (m: CommercialViewMode) => void
  theme: ReturnType<typeof themeForPlatform>
  onDark: boolean
}) {
  const items: { key: CommercialViewMode; label: string; icon: string }[] = [
    { key: 'list', label: 'List View', icon: '☰' },
    { key: 'calendar', label: 'Calendar View', icon: '📅' },
    { key: 'board', label: 'Board View', icon: '▦' },
  ]
  return (
    <div className={clsx('flex overflow-hidden rounded border', onDark ? 'border-white/25' : 'border-slate-300')}>
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          onClick={() => onChange(item.key)}
          className={clsx(
            'flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-semibold transition-colors',
            mode === item.key
              ? onDark
                ? 'bg-white'
                : 'bg-white shadow-sm'
              : onDark
                ? 'text-white hover:bg-white/10'
                : 'text-slate-600 hover:bg-slate-50',
          )}
          style={mode === item.key && onDark ? { color: theme.headerBg } : mode === item.key ? { color: theme.link } : undefined}
        >
          <span>{item.icon}</span>
          {item.label}
        </button>
      ))}
    </div>
  )
}
