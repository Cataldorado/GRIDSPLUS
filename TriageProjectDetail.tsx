import { useEffect, useMemo } from 'react'
import { useAppStore } from '@/state/appStore'
import { PROJECT } from '@/data/sampleData'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import {
  buildRiversideRecord,
  clock,
  SIGNALS,
  STATIC_PROJECTS,
  TIERS,
} from '@/data/triageData'
import { effectiveBoardStage, isDiscoveryLead, leadActionsFor } from '@/data/leadActions'
import { contactForContractor, deriveFiles, deriveQuoteSummary, designTakeoffForProject, takeoffAssignmentForProject, TEMPLATE_SPECS } from '@/data/triageDetailData'
import { findGridsTmProject, gridsTmToTriage } from '@/data/gridsTmBridge'
import { findTedRoofingProject, tedRoofingToTriage } from '@/data/tedRoofingBridge'
import { companyForContractor } from '@/data/customers'
import {
  findOpportunity,
  getOpportunitiesForProject,
  opportunityQuoteSummary,
} from '@/data/projectOpportunities'
import { ProjectAccessCard } from './ProjectAccessCard'
import { BidderOpportunityTabs } from './BidderOpportunityTabs'
import { DesignTakeoffCard } from './DesignTakeoffCard'
import { ProjectMessageBoard } from './ProjectMessageBoard'

const TIER_BADGE_TONE = { now: 'warning', week: 'warning', watch: 'neutral', calm: 'success' } as const

export function TriageProjectDetail() {
  const num = useAppStore((s) => s.viewingProjectNum)
  const viewingOpportunityId = useAppStore((s) => s.viewingOpportunityId)
  const setViewingOpportunity = useAppStore((s) => s.setViewingOpportunity)
  const setView = useAppStore((s) => s.setView)
  const projectCreated = useAppStore((s) => s.projectCreated)
  const stage = useAppStore((s) => s.stage)
  const modificationRequested = useAppStore((s) => s.modificationRequested)
  const openQuoteDetail = useAppStore((s) => s.openQuoteDetail)
  const persona = useAppStore((s) => s.persona)
  const leadDisposition = useAppStore((s) => s.leadDisposition)
  const expressInterest = useAppStore((s) => s.expressInterest)
  const archiveLead = useAppStore((s) => s.archiveLead)

  const project = useMemo(() => {
    const grids = num ? findGridsTmProject(num) : null
    if (grids) return gridsTmToTriage(grids)
    const ted = num ? findTedRoofingProject(num) : null
    if (ted) return tedRoofingToTriage(ted)
    const data = projectCreated ? [...STATIC_PROJECTS, buildRiversideRecord(stage, modificationRequested)] : STATIC_PROJECTS
    return data.find((p) => p.num === num) ?? null
  }, [num, projectCreated, stage, modificationRequested])

  const isEmployee = persona === 'tm' || persona === 'estimator'
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

  if (!project) {
    return (
      <div>
        <button onClick={() => setView('dashboard')} className="text-xs text-grids-blue">
          ← Back to projects
        </button>
        <Card className="mt-4 py-12 text-center text-sm text-slate-500">Project not found.</Card>
      </div>
    )
  }

  const contractorName = activeOpportunity?.companyName ?? project.contractor
  const statusLabel = activeOpportunity?.opportunityStatus ?? project.status
  const signalKey = activeOpportunity?.signal ?? project.signal
  const tierKey = activeOpportunity?.tier ?? project.tier
  const evidence = activeOpportunity?.evidence ?? project.evidence

  const s = SIGNALS[signalKey]
  const t = TIERS[tierKey]
  const c = clock({ ...project, signal: signalKey, tier: tierKey })
  const contractorContact = contactForContractor(contractorName)
  const specs = TEMPLATE_SPECS[project.template]
  const quote = activeOpportunity
    ? opportunityQuoteSummary(activeOpportunity, project.num)
    : deriveQuoteSummary(project)
  const files = deriveFiles(project)
  const designTakeoff = designTakeoffForProject(project)
  const takeoffAssignment = quote ? null : takeoffAssignmentForProject(project)
  const company = companyForContractor(contractorName)
  const personaKey = persona === 'estimator' ? 'est' : persona
  const discovery =
    isDiscoveryLead(project) && effectiveBoardStage(project, leadDisposition) === 'leads'
  const leadActs = discovery
    ? leadActionsFor(project, personaKey, {
        onExpressInterest: () => {
          expressInterest(project.num)
          setView('dashboard')
        },
        onArchive: () => {
          archiveLead(project.num)
          setView('dashboard')
        },
        onInvite: () => {},
      })
    : []

  return (
    <div>
      <button onClick={() => setView('dashboard')} className="text-xs text-grids-blue">
        ← Back to projects
      </button>

      <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">{project.name}</h1>
          <p className="text-xs text-slate-400">
            {project.num} · {project.vis} · {project.city}
            {!showBidderTabs && contractorName && !contractorName.startsWith('—') && ` · ${contractorName}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone="neutral">{project.template}</Badge>
          <Badge tone={TIER_BADGE_TONE[tierKey]}>{statusLabel}</Badge>
        </div>
      </div>

      {showBidderTabs && activeOpportunity && (
        <BidderOpportunityTabs
          opportunities={opportunities}
          activeId={activeOpportunity.id}
          onSelect={setViewingOpportunity}
        />
      )}

      <div className="mt-5 grid grid-cols-3 gap-4">
        <Card className="col-span-2">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {showBidderTabs ? 'Shared project information' : 'Project information'}
          </div>
          <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <Row label="Bid date" value={project.bidLabel} />
            <Row label="City" value={project.city} />
            <Row label="Template" value={project.template} />
            <Row label="Visibility" value={project.vis} />
            {showBidderTabs && activeOpportunity ? (
              <>
                <Row label="Active bidder" value={activeOpportunity.companyName} />
                <Row label="Opportunity status" value={activeOpportunity.opportunityStatus} />
              </>
            ) : (
              <>
                <Row label="Status" value={project.status} />
                <Row label="Contractor" value={project.contractor} />
              </>
            )}
          </dl>

          {signalKey !== 'none' && (
            <div className="mt-4 rounded-lg border p-3" style={{ borderColor: t.border, background: 'oklch(0.99 0.003 85)' }}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm font-semibold" style={{ color: t.why }}>
                  {s.why}
                </span>
                <span className="font-mono text-xs" style={{ color: t.clock }}>
                  {c.clock} {c.sub}
                </span>
              </div>
              {s.csq && <p className="mt-1 text-xs text-slate-500">{s.csq}</p>}
            </div>
          )}
        </Card>

        <Card>
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {showBidderTabs ? 'Bidder clock' : 'Clock'}
          </div>
          <div className="mt-1 font-mono text-3xl font-bold" style={{ color: t.clock }}>
            {c.clock}
          </div>
          <div className="text-xs text-slate-400">{c.sub}</div>
        </Card>
      </div>

      <Card className="mt-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {showBidderTabs ? 'Contacts — active bidder' : 'Contacts'}
        </div>
        <div className="mt-3 grid grid-cols-3 gap-4">
          {contractorContact ? (
            <ContactCard role="Contractor" company={contractorName} contact={contractorContact} />
          ) : (
            <div className="rounded-lg border border-dashed border-slate-200 p-3 text-xs text-slate-400">
              No contractor contact on file
            </div>
          )}
          <ContactCard
            role="Territory Manager"
            company="Heritage+"
            contact={{ name: PROJECT.tm.name, title: PROJECT.tm.role, email: 'colin.farrelly@heritageplus.com', phone: '(916) 555-0102' }}
          />
          <ContactCard
            role="Commercial Services"
            company="Heritage+"
            contact={{ name: PROJECT.estimator.name, title: PROJECT.estimator.role, email: 'jordan.lee@heritageplus.com', phone: '(916) 555-0119' }}
          />
        </div>
      </Card>

      {persona === 'tm' && (company || discovery) && (
        <ProjectAccessCard projectNum={project.num} company={company} discoveryLead={discovery} />
      )}

      <ProjectMessageBoard
        projectNum={project.num}
        contractorName={contractorName}
        persona={persona}
        showBidderContext={showBidderTabs}
      />

      <Card className="mt-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Specifications</div>
        <p className="mt-1 text-[11px] text-slate-400">Shared across all bidders on this project.</p>
        <dl className="mt-2 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
          {specs.map((row) => (
            <Row key={row.label} label={row.label} value={row.value} />
          ))}
        </dl>
      </Card>

      <DesignTakeoffCard config={designTakeoff} assignment={takeoffAssignment} />

      <Card className="mt-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {showBidderTabs ? 'Quote — active bidder' : 'Related quotes'}
        </div>
        {quote ? (
          <button
            onClick={() => openQuoteDetail(project.num, activeOpportunity?.id)}
            className="mt-2 flex w-full items-center justify-between rounded-lg border border-slate-200 p-3 text-left hover:border-grids-blue hover:bg-grids-blue/5"
          >
            <div>
              <div className="text-sm font-semibold text-slate-800">{quote.label}</div>
              <div className="text-xs text-slate-500">{quote.note}</div>
            </div>
            <div className="flex items-center gap-3">
              <Badge tone="info">{quote.status}</Badge>
              <span className="text-xs font-semibold text-grids-blue">View quote →</span>
            </div>
          </button>
        ) : (
          <p className="mt-2 text-sm text-slate-400">
            {showBidderTabs
              ? 'No quote yet for this bidder — still in takeoff/estimating.'
              : 'No quote yet — still in takeoff/estimating.'}
          </p>
        )}
      </Card>

      <Card className="mt-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Files</div>
        <p className="mt-1 text-[11px] text-slate-400">Drawings and specs shared across all bidders.</p>
        {files.length ? (
          <div className="mt-2 divide-y divide-slate-100">
            {files.map((f) => (
              <div key={f.name} className="flex items-center justify-between py-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">📄</span>
                  <span className="text-slate-700">{f.name}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <Badge tone="neutral">{f.type}</Badge>
                  <span>{f.date}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm text-slate-400">No files attached yet.</p>
        )}
      </Card>

      <Card className="mt-4">
        <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {showBidderTabs ? 'Activity — active bidder' : 'What happened'}
        </div>
        <div className="mt-2 space-y-1.5">
          {evidence.map((e, i) => (
            <div key={i} className="flex gap-2 text-sm">
              <span className="w-24 flex-none font-mono text-xs text-slate-400">{e.when}</span>
              <span className="text-slate-600">{e.what}</span>
            </div>
          ))}
        </div>
      </Card>

      <div className="mt-4 flex flex-wrap gap-2">
        {discovery ? (
          leadActs.map((action) => (
            <Button
              key={action.label}
              variant={action.tone === 'primary' ? 'primary' : 'secondary'}
              onClick={action.onClick}
            >
              {action.label}
            </Button>
          ))
        ) : isEmployee && showBidderTabs ? (
          <>
            <Button variant="primary" disabled title="Demo — + Bidder on board">
              + Bidder
            </Button>
            <Button variant="secondary" disabled>
              Message for this bidder
            </Button>
          </>
        ) : num?.startsWith('#TED-') ? (
          <>
            <Button variant="primary" onClick={() => {}}>
              + Bidder
            </Button>
            <Button variant="secondary" disabled>
              Message for this Project
            </Button>
          </>
        ) : (
          <>
            <Button variant="secondary" disabled>
              Message contractor
            </Button>
            <Button variant="secondary" disabled>
              Archive
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-slate-400">{label}</dt>
      <dd className="text-right font-medium text-slate-700">{value}</dd>
    </div>
  )
}

function ContactCard({
  role,
  company,
  contact,
}: {
  role: string
  company: string
  contact: { name: string; title: string; email: string; phone: string }
}) {
  return (
    <div className="rounded-lg border border-slate-200 p-3">
      <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{role}</div>
      <div className="mt-1 text-sm font-semibold text-slate-800">{contact.name}</div>
      <div className="text-xs text-slate-500">
        {contact.title} · {company}
      </div>
      <div className="mt-1.5 text-xs text-grids-blue">{contact.email}</div>
      <div className="text-xs text-slate-500">{contact.phone}</div>
    </div>
  )
}
