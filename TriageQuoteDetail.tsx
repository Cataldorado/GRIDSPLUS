import { useEffect, useMemo } from 'react'
import { useAppStore } from '@/state/appStore'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { buildRiversideRecord, STATIC_PROJECTS } from '@/data/triageData'
import { deriveQuoteLineItems, deriveQuoteSummary, quoteGroupTotals } from '@/data/triageDetailData'
import { findGridsTmProject, gridsTmToTriage } from '@/data/gridsTmBridge'
import { findTedRoofingProject, tedRoofingToTriage } from '@/data/tedRoofingBridge'
import {
  findOpportunity,
  getOpportunitiesForProject,
  opportunityQuoteSummary,
  quoteLineItemsForOpportunity,
} from '@/data/projectOpportunities'
import { QuoteLineItemsTable } from './QuoteLineItemsTable'
import { BidderOpportunityTabs } from './BidderOpportunityTabs'

export function TriageQuoteDetail() {
  const num = useAppStore((s) => s.viewingProjectNum)
  const viewingOpportunityId = useAppStore((s) => s.viewingOpportunityId)
  const setViewingOpportunity = useAppStore((s) => s.setViewingOpportunity)
  const setView = useAppStore((s) => s.setView)
  const openTriageDetail = useAppStore((s) => s.openTriageDetail)
  const projectCreated = useAppStore((s) => s.projectCreated)
  const stage = useAppStore((s) => s.stage)
  const modificationRequested = useAppStore((s) => s.modificationRequested)
  const persona = useAppStore((s) => s.persona)
  const showMargin = persona !== 'customer'
  const isEmployee = persona === 'tm' || persona === 'estimator'

  const project = useMemo(() => {
    const grids = num ? findGridsTmProject(num) : null
    if (grids) return gridsTmToTriage(grids)
    const ted = num ? findTedRoofingProject(num) : null
    if (ted) return tedRoofingToTriage(ted)
    const data = projectCreated ? [...STATIC_PROJECTS, buildRiversideRecord(stage, modificationRequested)] : STATIC_PROJECTS
    return data.find((p) => p.num === num) ?? null
  }, [num, projectCreated, stage, modificationRequested])

  const opportunities = useMemo(() => (project ? getOpportunitiesForProject(project) : []), [project])
  const showBidderTabs = isEmployee && opportunities.length > 1

  const activeOpportunity = useMemo(() => {
    if (!project || !opportunities.length) return null
    return findOpportunity(project, viewingOpportunityId) ?? opportunities[0]
  }, [project, opportunities, viewingOpportunityId])

  useEffect(() => {
    if (!project || !showBidderTabs) return
    const valid = opportunities.some((o) => o.id === viewingOpportunityId)
    if (!valid && opportunities[0]) {
      setViewingOpportunity(opportunities[0].id)
    }
  }, [project, showBidderTabs, opportunities, viewingOpportunityId, setViewingOpportunity])

  const quote = useMemo(() => {
    if (!project) return null
    if (activeOpportunity) return opportunityQuoteSummary(activeOpportunity, project.num)
    return deriveQuoteSummary(project)
  }, [project, activeOpportunity])

  const groups = useMemo(() => {
    if (!project) return null
    if (activeOpportunity) return quoteLineItemsForOpportunity(activeOpportunity, project.template)
    return deriveQuoteLineItems(project)
  }, [project, activeOpportunity])

  if (!project || !quote || !groups) {
    return (
      <div>
        <button onClick={() => setView('dashboard')} className="text-xs text-grids-blue">
          ← Back to projects
        </button>
        <Card className="mt-4 py-12 text-center text-sm text-slate-500">Quote not found.</Card>
      </div>
    )
  }

  const totals = quoteGroupTotals(groups.flatMap((g) => g.items))

  return (
    <div>
      <button onClick={() => openTriageDetail(project.num, activeOpportunity?.id)} className="text-xs text-grids-blue">
        ← Back to {project.name}
      </button>

      <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">{quote.label}</h1>
          <p className="text-xs text-slate-400">
            {project.name} · {project.num}
            {showBidderTabs && activeOpportunity && ` · ${activeOpportunity.companyName}`}
          </p>
        </div>
        <Badge tone="info">{quote.status}</Badge>
      </div>

      {showBidderTabs && activeOpportunity && (
        <BidderOpportunityTabs
          opportunities={opportunities}
          activeId={activeOpportunity.id}
          onSelect={setViewingOpportunity}
        />
      )}

      <Card className="mt-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">{quote.note}</p>
          <div className="text-right">
            <div className="text-xs text-slate-400">{showMargin ? 'Quote GM% · Subtotal' : 'Subtotal'}</div>
            <div className="text-sm font-bold text-slate-800">
              {showMargin && `${totals.avgGm.toFixed(2)}% · `}$
              {totals.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        {showBidderTabs && activeOpportunity && activeOpportunity.priceMultiplier !== 1 && (
          <p className="mt-2 text-[11px] text-amber-700">
            Pricing variant for {activeOpportunity.companyName} — line items scaled to{' '}
            {Math.round(activeOpportunity.priceMultiplier * 100)}% of base estimate.
          </p>
        )}

        <div className="mt-4">
          <QuoteLineItemsTable groups={groups} showMargin={showMargin} />
        </div>

        {!showMargin && <p className="mt-1.5 text-[11px] text-slate-400">Cost and margin details are internal-only.</p>}
      </Card>
    </div>
  )
}
