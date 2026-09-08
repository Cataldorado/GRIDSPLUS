import { useEffect, useMemo, useRef, useState } from 'react'
import { useAppStore } from '@/state/appStore'
import { PROJECT } from '@/data/sampleData'
import {
  buildRiversideRecord,
  clock,
  customerSeesProject,
  GROUP_TITLE_COLORS,
  MATCH,
  ownerOf,
  PERSONAS,
  queueMatch,
  RECS,
  SIGNALS,
  STATIC_PROJECTS,
  TIERS,
  urgencyRank,
  matchQuery,
  matchWindow,
  type BidWindow,
  type SignalKey,
  type TriagePersonaKey,
  type TriageProject,
} from '@/data/triageData'
import {
  discoveryLeadChip,
  discoveryLeadWhy,
  displayLeadStatus,
  effectiveBoardStage,
  isDiscoveryLead,
  isLeadHidden,
  leadActionsFor,
} from '@/data/leadActions'
import { VERTICALS, verticalForTemplate, type VerticalKey } from '@/data/verticals'
import { COMPANIES, PRIMARY_CUSTOMER_USER_ID } from '@/data/customers'
import { isRostered } from '@/data/access'
import { Card } from '@/components/ui/Card'
import { TriageSidebar } from './dashboard/TriageSidebar'
import { TriageHeader, type PressureChip } from './dashboard/TriageHeader'
import { TriageRow, type RowView } from './dashboard/TriageRow'
import { BoardView, type BoardColumn } from './dashboard/BoardView'
import { ListView } from './dashboard/ListView'
import {
  BOARD_COLUMNS_BY_SCOPE,
  DEMO_SCOPE_META,
  isListViewMode,
  isTriageViewMode,
  scopeDefaultViewMode,
  scopeShowsDecisionIntelligence,
  scopeShowsNeedsDecisionSection,
  scopeViewToggle,
  type DashboardViewMode,
} from '@/config/demoScope'

function toDesignPersona(p: 'customer' | 'tm' | 'estimator'): TriagePersonaKey {
  return p === 'estimator' ? 'est' : p
}

/** Two signals per persona surfaced as pressure chips — distinct from the raw "needs you" count. */
const PRESSURE_SIGNALS: Record<TriagePersonaKey, { signal: SignalKey; label: (n: number) => string }[]> = {
  customer: [
    { signal: 'reapprove-expired-pricing', label: (n) => `${n} pricing approval${n === 1 ? '' : 's'} expired` },
    { signal: 'approve-substitutions', label: (n) => `${n} substitution${n === 1 ? '' : 's'} awaiting your OK` },
  ],
  tm: [
    { signal: 'review-at-risk-account', label: (n) => `${n} account${n === 1 ? '' : 's'} trending down` },
    { signal: 'resolve-flagged-items', label: (n) => `${n} flagged line item${n === 1 ? '' : 's'}` },
  ],
  est: [
    { signal: 'flag-missing-docs', label: (n) => `${n} request${n === 1 ? '' : 's'} missing docs` },
    { signal: 'assign-estimator', label: (n) => `${n} request${n === 1 ? '' : 's'} unassigned` },
  ],
}

export function Dashboard() {
  const persona = useAppStore((s) => s.persona)
  const projectCreated = useAppStore((s) => s.projectCreated)
  const stage = useAppStore((s) => s.stage)
  const modificationRequested = useAppStore((s) => s.modificationRequested)
  const openProject = useAppStore((s) => s.openProject)
  const openTriageDetail = useAppStore((s) => s.openTriageDetail)
  const setView = useAppStore((s) => s.setView)
  const rosterOverrides = useAppStore((s) => s.rosterOverrides)
  const demoScope = useAppStore((s) => s.demoScope)
  const leadDisposition = useAppStore((s) => s.leadDisposition)
  const expressInterest = useAppStore((s) => s.expressInterest)
  const archiveLead = useAppStore((s) => s.archiveLead)

  const isMvp = demoScope === 'mvp'
  const showNeedsDecision = scopeShowsNeedsDecisionSection(demoScope)
  const showDecisionIntelligence = scopeShowsDecisionIntelligence(demoScope)
  const viewToggle = scopeViewToggle(demoScope)

  const goToDetail = (p: TriageProject) => (p.num === PROJECT.id ? openProject('overview') : openTriageDetail(p.num))

  const personaKey = toDesignPersona(persona)
  const pers = PERSONAS[personaKey]

  const [query, setQuery] = useState('')
  const [view, setViewKey] = useState('queue')
  const [contractor, setContractor] = useState('All contractors')
  const [template, setTemplate] = useState('All templates')
  const [vertical, setVertical] = useState<VerticalKey | 'all'>('all')
  const [bidWindow, setBidWindow] = useState<BidWindow>('any')
  const [mode, setMode] = useState<DashboardViewMode>(() => scopeDefaultViewMode(demoScope))
  const [openId, setOpenId] = useState<string | null>(null)
  const [cleared, setCleared] = useState<string[]>([])
  const [last, setLast] = useState<{ num: string; name: string } | null>(null)

  const searchRef = useRef<HTMLInputElement>(null)

  // Persona switch resets the active view and collapses any expanded row.
  useEffect(() => {
    setViewKey('queue')
    setOpenId(null)
  }, [personaKey])

  useEffect(() => {
    setMode(scopeDefaultViewMode(demoScope))
    setOpenId(null)
  }, [demoScope])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return
      if (e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const DATA: TriageProject[] = useMemo(
    () => (projectCreated ? [...STATIC_PROJECTS, buildRiversideRecord(stage, modificationRequested)] : STATIC_PROJECTS),
    [projectCreated, stage, modificationRequested],
  )

  function clear(p: TriageProject, _how: string) {
    setCleared((c) => [...c, p.num])
    setLast({ num: p.num, name: p.name })
    setOpenId(null)
  }
  function undo() {
    setCleared((c) => c.filter((n) => n !== last?.num))
    setLast(null)
  }

  const live = useMemo(
    () => DATA.filter((p) => !cleared.includes(p.num) && !isLeadHidden(p, leadDisposition) && pers.scope(p)),
    [DATA, cleared, leadDisposition, pers],
  )
  const vdef = pers.views.find((v) => v.key === view) ?? pers.views[0]
  const vmatch = vdef.key === 'queue' ? queueMatch(personaKey) : (MATCH[vdef.key] ?? MATCH.all)
  const filtered = useMemo(
    () =>
      live.filter(
        (p) =>
          vmatch(p) &&
          matchQuery(p, query) &&
          matchWindow(p, bidWindow) &&
          (contractor === 'All contractors' || p.contractor === contractor) &&
          (template === 'All templates' || p.template === template) &&
          (vertical === 'all' || verticalForTemplate(p.template) === vertical),
      ),
    [live, vmatch, query, bidWindow, contractor, template, vertical],
  )

  function leadHandlers(p: TriageProject) {
    return {
      onExpressInterest: () => expressInterest(p.num),
      onArchive: () => archiveLead(p.num),
      onInvite: () => openTriageDetail(p.num),
    }
  }

  function deriveRow(p: TriageProject): RowView {
    const discovery = isDiscoveryLead(p) && effectiveBoardStage(p, leadDisposition) === 'leads'
    const s = SIGNALS[p.signal]
    const owner = ownerOf(p)
    const isMine = owner === personaKey
    const t = TIERS[p.tier]
    const c = clock(p)
    const loud = isMine && p.tier === 'now' && !discovery
    const rec = personaKey === 'tm' && isMine && p.tier === 'now' ? RECS[p.signal] : null
    const showConsequence = loud && !!s.csq
    const isRiverside = p.num === PROJECT.id
    const leadActs = discovery ? leadActionsFor(p, personaKey, leadHandlers(p)) : []

    return {
      num: p.num,
      name: p.name,
      contractor: p.contractor,
      city: p.city,
      bidLabel: p.bidLabel,
      status: p.status,
      template: p.template,
      visibility: p.vis,
      evidence: p.evidence,
      why: discovery ? discoveryLeadWhy(personaKey) : isMine || !owner ? s.why : `Waiting on ${PERSONAS[owner].role}`,
      consequence: discovery ? 'Matches GRIDS/TED public discovery — act here or archive to clear your queue.' : s.csq,
      showConsequence: discovery || showConsequence,
      clockValue: c.clock,
      clockSub: c.sub,
      clockFg: t.clock,
      spine: t.spine,
      border: t.border,
      whyFg: t.why,
      shadow: t.shadow,
      compact: false,
      actLabel: discovery ? leadActs[0]?.label ?? 'Open' : isMine || !owner ? s.act : 'View',
      actBg: loud ? 'oklch(0.68 0.17 52)' : 'oklch(0.95 0.035 255)',
      actFg: loud ? 'oklch(0.99 0.01 85)' : 'oklch(0.42 0.16 255)',
      actShadow: loud ? '0 1px 2px oklch(0.55 0.13 52 / .35)' : 'inset 0 0 0 1px oklch(0.72 0.1 255 / .55)',
      isOpen: openId === p.num,
      hasRec: !!rec,
      recMove: rec?.move ?? '',
      recLine: rec?.line ?? '',
      leadActions: leadActs,
      onAct: () => {
        if (discovery && leadActs[0]) return leadActs[0].onClick()
        if (isRiverside) return openProject('overview')
        if (!isMine) return goToDetail(p)
        return clear(p, s.act.toLowerCase())
      },
      onExpand: () => setOpenId((o) => (o === p.num ? null : p.num)),
      onSnooze: () => clear(p, 'snoozed until Monday 8am'),
      onRecAct: () => clear(p, 'follow-up logged'),
      onOpenProject: () => goToDetail(p),
      onTitleClick: () => goToDetail(p),
    }
  }

  const byTier = (tier: TriageProject['tier']) => filtered.filter((p) => p.tier === tier).sort(urgencyRank)
  const groups = (['now', 'week', 'watch', 'calm'] as const)
    .map((k, i) => ({
      key: k,
      title: pers.groups[i][0],
      sub: pers.groups[i][1],
      titleFg: GROUP_TITLE_COLORS[i],
      items: byTier(k),
    }))
    .filter((g) => g.items.length)

  const nowCount = live.filter((p) => p.tier === 'now' && ownerOf(p) === personaKey).length
  const soon = live.filter((p) => p.days >= 0 && p.days <= 2).length
  const dayTotal = DATA.filter((p) => pers.scope(p) && ownerOf(p) === personaKey && (p.tier === 'now' || p.tier === 'week')).length
  const bookTotal = personaKey === 'customer' ? DATA.filter((p) => customerSeesProject(p)).length : 214

  const pressureChips: PressureChip[] = []
  if (soon)
    pressureChips.push({
      label: `${soon} bid${soon === 1 ? '' : 's'} close inside 48 hours`,
      bg: 'oklch(0.965 0.03 25)', fg: 'oklch(0.45 0.16 25)', border: 'oklch(0.9 0.05 25)', dot: 'oklch(0.56 0.18 25)', pulse: true,
    })
  for (const { signal, label } of PRESSURE_SIGNALS[personaKey]) {
    const n = live.filter((p) => p.signal === signal).length
    if (n)
      pressureChips.push({
        label: label(n),
        bg: 'oklch(0.97 0.03 80)', fg: 'oklch(0.42 0.09 70)', border: 'oklch(0.92 0.04 80)', dot: 'oklch(0.75 0.13 75)', pulse: false,
      })
  }
  if (!pressureChips.length)
    pressureChips.push({
      label: 'Nothing urgent in the next 48 hours',
      bg: 'oklch(0.97 0.02 168)', fg: 'oklch(0.38 0.07 168)', border: 'oklch(0.92 0.03 168)', dot: 'oklch(0.6 0.1 168)', pulse: false,
    })

  const topRec =
    personaKey === 'tm'
      ? live.filter((p) => p.tier === 'now' && ownerOf(p) === personaKey && RECS[p.signal]).sort(urgencyRank)[0]
      : null

  const contractorOptions = ['All contractors', ...Array.from(new Set(DATA.map((p) => p.contractor))).filter((c) => c[0] !== '—').sort()]
  const templateOptions = ['All templates', ...Array.from(new Set(DATA.map((p) => p.template))).sort()]
  const verticalCounts: Record<VerticalKey | 'all', number> = {
    all: live.length,
    irrigation: live.filter((p) => verticalForTemplate(p.template) === 'irrigation').length,
    roofing: live.filter((p) => verticalForTemplate(p.template) === 'roofing').length,
    hvac: live.filter((p) => verticalForTemplate(p.template) === 'hvac').length,
  }

  const clearedCount = cleared.length
  const progressPct = Math.round((clearedCount / Math.max(dayTotal, 1)) * 100)
  const momentumLine =
    clearedCount === 0
      ? "Clear the red group and today's book is honest."
      : clearedCount >= dayTotal
        ? 'Book is clean. Nothing outstanding.'
        : `${clearedCount} down, ${Math.max(dayTotal - clearedCount, 0)} to go — top group first.`

  const isEmpty = isTriageViewMode(demoScope, mode) && groups.length === 0
  const listEmpty = filtered.length === 0
  const emptyTitle = query ? 'No project matches that' : 'Queue clear'
  const emptyBody = query
    ? 'Try the project number, the contractor, or the city.'
    : 'Nothing in this view needs a decision right now.'

  const colDefs = [
    { key: 'leads', title: 'New leads', pick: (p: TriageProject) => effectiveBoardStage(p, leadDisposition) === 'leads', dot: 'oklch(0.6 0.09 255)', fg: 'oklch(0.35 0.06 255)', bg: 'oklch(0.98 0.004 255)', border: 'oklch(0.93 0.006 255)', empty: 'No leads match these filters.' },
    { key: 'needs', title: 'Needs you', pick: (p: TriageProject) => effectiveBoardStage(p, leadDisposition) !== 'leads' && p.tier === 'now' && ownerOf(p) === personaKey, dot: 'oklch(0.56 0.18 25)', fg: 'oklch(0.48 0.16 25)', bg: 'oklch(0.975 0.012 25)', border: 'oklch(0.92 0.03 25)', empty: 'Nothing urgent. This column fills itself from what only you can act on — it is never a dead box.' },
    { key: 'progress', title: 'In progress', pick: (p: TriageProject) => effectiveBoardStage(p, leadDisposition) === 'progress', dot: 'oklch(0.7 0.12 75)', fg: 'oklch(0.42 0.09 70)', bg: 'oklch(0.98 0.004 255)', border: 'oklch(0.93 0.006 255)', empty: 'Nothing in flight here.' },
    { key: 'complete', title: 'Complete', pick: (p: TriageProject) => effectiveBoardStage(p, leadDisposition) === 'complete', dot: 'oklch(0.62 0.1 168)', fg: 'oklch(0.4 0.07 168)', bg: 'oklch(0.98 0.004 255)', border: 'oklch(0.93 0.006 255)', empty: 'Nothing closed out yet.' },
  ]
  const columns: BoardColumn[] = colDefs
    .filter((c) => BOARD_COLUMNS_BY_SCOPE[demoScope].includes(c.key))
    .map((c) => {
    const items = filtered.filter(c.pick).sort(urgencyRank)
    return {
      key: c.key, title: c.title, dot: c.dot, fg: c.fg, bg: c.bg, border: c.border,
      count: items.length, isEmpty: items.length === 0, emptyText: c.empty,
      items: items.map((p) => {
        const row = deriveRow(p)
        const discovery = isDiscoveryLead(p) && effectiveBoardStage(p, leadDisposition) === 'leads'
        const leadActs = discovery ? leadActionsFor(p, personaKey, leadHandlers(p)) : undefined
        return {
          num: p.num, name: p.name, contractor: row.contractor, city: p.city,
          chip: discovery ? discoveryLeadChip(personaKey) : row.why,
          chipFg: row.whyFg, clockValue: row.clockValue, clockFg: row.clockFg,
          spine: row.spine, border: row.border, actLabel: row.actLabel, actBg: row.actBg, actFg: row.actFg,
          actShadow: row.actShadow,
          leadActions: leadActs,
          onAct: row.onAct,
          onTitleClick: row.onTitleClick,
        }
      }),
    }
  })

  const displayHeadline = isMvp ? DEMO_SCOPE_META.mvp.dashboardTitle : pers.headline(nowCount)
  const displayHeadlineSub = isMvp
    ? mode === 'list'
      ? 'List view · GRIDS/TED parity'
      : 'Board view · GRIDS/TED parity'
    : query
      ? `matching "${query}"`
      : `${vdef.label} · sorted by what happens if you wait`

  const clearFilters = () => {
    setQuery('')
    setViewKey('queue')
    setContractor('All contractors')
    setTemplate('All templates')
    setBidWindow('any')
    setVertical('all')
  }

  const listRows = filtered
    .sort(urgencyRank)
    .map((p) => {
      const discovery = isDiscoveryLead(p) && effectiveBoardStage(p, leadDisposition) === 'leads'
      return {
        project: p,
        displayStatus: displayLeadStatus(p, leadDisposition),
        onOpen: () => goToDetail(p),
        leadActions: discovery ? leadActionsFor(p, personaKey, leadHandlers(p)) : undefined,
      }
    })

  const projectTypeLabel = vertical === 'all' ? '' : VERTICALS.find((v) => v.key === vertical)?.title ?? ''
  const footerLine = `${filtered.length} of ${bookTotal} projects · filters: ${vdef.label.toLowerCase()}${contractor === 'All contractors' ? '' : ', ' + contractor}${bidWindow === 'any' ? '' : ', bid window'}${projectTypeLabel ? ', ' + projectTypeLabel : ''} · press / to search`

  if (personaKey === 'customer') {
    const marcus = COMPANIES.find((c) => c.id === 'coast-landscape')?.users.find((u) => u.id === PRIMARY_CUSTOMER_USER_ID)
    if (marcus && !isRostered(rosterOverrides, marcus)) {
      return (
        <Card className="mx-auto mt-16 max-w-md py-12 text-center">
          <div className="text-3xl">🔒</div>
          <h1 className="mt-3 text-lg font-bold text-slate-900">Access removed</h1>
          <p className="mt-2 text-sm text-slate-500">
            Your Territory Manager removed {PROJECT.customer.contact}'s access to commercial projects in GRIDS+.
            Contact {PROJECT.tm.name} to be rostered again.
          </p>
        </Card>
      )
    }
  }

  return (
    <div className="-mx-6 grid grid-cols-[246px_minmax(0,1fr)] border-t border-slate-200">
      <TriageSidebar
        desk={pers.desk}
        deskSub={pers.deskSub}
        views={pers.views.map((v) => ({
          ...v,
          count: live.filter(v.key === 'queue' ? queueMatch(personaKey) : (MATCH[v.key] ?? MATCH.all)).length,
          active: v.key === view,
        }))}
        onPickView={(k) => {
          setViewKey(k)
          setOpenId(null)
        }}
        onFocusSearch={() => searchRef.current?.focus()}
        showContractorFilter={pers.contractorFilter}
        contractor={contractor}
        contractorOptions={contractorOptions}
        onContractorChange={setContractor}
        bidWindow={bidWindow}
        onBidWindowChange={(v) => setBidWindow(v as BidWindow)}
        template={template}
        templateOptions={templateOptions}
        onTemplateChange={setTemplate}
        vertical={vertical}
        verticalCounts={verticalCounts}
        onVerticalChange={setVertical}
        persona={pers}
        showNeedsDecision={showNeedsDecision}
      />

      <main className="min-w-0" style={{ background: 'oklch(0.975 0.004 85)' }}>
        <TriageHeader
          searchRef={searchRef}
          query={query}
          onQueryChange={setQuery}
          onClearQuery={() => setQuery('')}
          mode={mode}
          onSetMode={setMode}
          onSubmitRequest={() => setView('wizard')}
          headline={displayHeadline}
          headlineSub={displayHeadlineSub}
          pressureChips={pressureChips}
          hasNextCall={!!topRec}
          nextCallName={topRec?.name ?? ''}
          nextCallWho={topRec?.contractor ?? ''}
          nextCallMove={topRec ? (RECS[topRec.signal]?.move ?? '') : ''}
          nextCallLine={topRec ? (RECS[topRec.signal]?.line ?? '') : ''}
          nextCallClock={topRec ? `${clock(topRec).clock} ${clock(topRec).sub}` : ''}
          onNextCallAct={() => topRec && clear(topRec, 'follow-up logged')}
          clearedCount={clearedCount}
          dayTotal={dayTotal}
          progressPct={progressPct}
          momentumLine={momentumLine}
          canUndo={!!last}
          lastClearedName={last?.name ?? ''}
          onUndo={undo}
          viewToggle={viewToggle}
          showDecisionIntelligence={showDecisionIntelligence}
        />

        <div className="px-[22px] pb-[60px]">
          {isTriageViewMode(demoScope, mode) ? (
            <div>
              {groups.map((g) => (
                <section key={g.key} className="mt-[22px]">
                  <div className="mb-[9px] flex items-center gap-2.5">
                    <h2 className="m-0 text-[12.5px] font-bold" style={{ letterSpacing: '.02em', color: g.titleFg }}>
                      {g.title}
                    </h2>
                    <span className="font-mono text-[11px]" style={{ color: 'oklch(0.55 0.015 255)' }}>
                      {g.items.length}
                    </span>
                    <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-[11.5px]" style={{ color: 'oklch(0.55 0.015 255)' }}>
                      {g.sub}
                    </span>
                  </div>
                  {g.items.map((p) => (
                    <TriageRow key={p.num} row={deriveRow(p)} />
                  ))}
                </section>
              ))}

              {isEmpty && (
                <div className="mx-auto my-[60px] max-w-[420px] rounded-xl border border-slate-200 bg-white px-6 py-[30px] text-center">
                  <div className="mx-auto mb-3 h-[34px] w-[34px] rounded-full" style={{ border: '2px solid oklch(0.6 0.1 168)' }} />
                  <div className="text-[15px] font-semibold">{emptyTitle}</div>
                  <div className="mt-1.5 text-[12.5px] leading-relaxed" style={{ color: 'oklch(0.52 0.015 255)' }}>
                    {emptyBody}
                  </div>
                  <button onClick={clearFilters} className="mt-3.5 rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
                    Clear filters
                  </button>
                </div>
              )}

              <div className="mt-6 border-t border-slate-200 pt-3 text-[11.5px]" style={{ color: 'oklch(0.55 0.015 255)' }}>
                {footerLine}
              </div>
            </div>
          ) : isListViewMode(demoScope, mode) ? (
            <div>
              <ListView
                rows={listRows}
                emptyTitle={query ? 'No project matches that' : 'No projects in this view'}
                emptyBody={query ? 'Try the project number, the contractor, or the city.' : 'Adjust filters or submit a new request.'}
                onClearFilters={clearFilters}
              />
              {!listEmpty && (
                <div className="mt-6 border-t border-slate-200 pt-3 text-[11.5px]" style={{ color: 'oklch(0.55 0.015 255)' }}>
                  {footerLine}
                </div>
              )}
            </div>
          ) : (
            <BoardView columns={columns} />
          )}
        </div>
      </main>
    </div>
  )
}
