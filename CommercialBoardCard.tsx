import type { ReactNode } from 'react'
import clsx from 'clsx'
import type { Persona } from '@/data/sampleData'
import type { UnifiedBoardProject } from '@/data/unifiedBoard'
import {
  ArchiveIcon,
  InterestedIcon,
  InviteIcon,
  NotInterestedIcon,
  SubmittalIcon,
} from '@/components/icons/LeadActionIcons'
import type { CommercialPlatformTheme } from './platformTheme'

const PUBLIC_BLUE = '#1e4a8c'
const PRIVATE_RED = '#7a1f2e'

interface CardActions {
  onArchive: () => void
  onInvite?: () => void
  onAddBidder?: () => void
  onInterested?: () => void
  onNotInterested?: () => void
  onRequestSubmittal?: () => void
}

interface Props {
  project: UnifiedBoardProject
  persona: Persona
  theme: CommercialPlatformTheme
  compact?: boolean
  opportunityStatus: string | null
  showDiscoveryActions: boolean
  onOpen: () => void
  actions: CardActions
}

export function CommercialBoardCard({
  project,
  persona,
  theme,
  compact = false,
  opportunityStatus,
  showDiscoveryActions,
  onOpen,
  actions,
}: Props) {
  const isPublic = project.vis === 'Public'
  const spineColor = isPublic ? PUBLIC_BLUE : PRIVATE_RED
  const inviteLabel = project.vertical === 'roofing' ? 'Add bidder' : 'Invite contractor'

  return (
    <article className="flex overflow-hidden rounded-sm border border-slate-300 bg-white shadow-sm">
      <div
        className="flex w-[26px] flex-none flex-col items-center justify-center gap-1 py-3 text-white"
        style={{ background: spineColor }}
      >
        <span className="text-sm leading-none">{isPublic ? '🔓' : '🔒'}</span>
        <span
          className="text-[9px] font-bold uppercase tracking-wide"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          {project.vis}
        </span>
      </div>

      <div className="min-w-0 flex-1 p-2.5 pb-3">
        <div className="flex items-start justify-between gap-2">
          <button
            type="button"
            onClick={onOpen}
            className="text-left text-[13px] font-bold hover:underline"
            style={{ color: theme.link }}
          >
            {project.name}
            {compact && <span className="font-normal text-slate-600"> {project.num}</span>}
          </button>
          {!compact && project.daysOpen != null && (
            <span className="flex-none rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600">
              {project.daysOpen} Days
            </span>
          )}
        </div>

        <div className="mt-1 text-[11px] leading-snug text-slate-700">{project.address}</div>

        {compact ? (
          <div className="mt-1.5 text-[11px] text-slate-700">
            <span className="font-semibold">Bid Date:</span> {project.bidLabel}
          </div>
        ) : (
          <>
            {project.contractor && (
              <div className="mt-2 text-[11px] text-slate-800">
                <span className="font-semibold">{project.vertical === 'roofing' ? 'Bidders:' : 'Contractor:'}</span>{' '}
                {project.contractor}
              </div>
            )}

            <div className="mt-1.5 space-y-0.5 text-[11px] text-slate-700">
              <div>
                <span className="font-semibold">Bid Date:</span> {project.bidLabel}
              </div>
              {project.workflowStatus && (
                <div>
                  <span className="font-semibold">Status:</span> {project.workflowStatus}
                </div>
              )}
              <div>
                <span className="font-semibold">Reference Number:</span> {project.referenceNumber}
              </div>
              {opportunityStatus && (
                <div>
                  <span className="font-semibold">Opportunity:</span>{' '}
                  <span className={clsx('font-bold', opportunityStatus === 'ACTIVE OPPORTUNITY' && 'text-emerald-700')}>
                    {opportunityStatus}
                  </span>
                </div>
              )}
              <div>
                <span className="font-semibold">Project Template:</span> {project.template}
              </div>
              <div>
                <span className="font-semibold">Project Created:</span> {project.createdLabel}
              </div>
            </div>

            <div className="mt-3 flex justify-end gap-1.5">
              {showDiscoveryActions && persona === 'customer' ? (
                <>
                  {actions.onInterested && (
                    <LeadActionButton label="I'm interested" variant="interested" onClick={actions.onInterested} icon={<InterestedIcon />} />
                  )}
                  {actions.onNotInterested && (
                    <LeadActionButton label="Not interested" variant="not-interested" onClick={actions.onNotInterested} icon={<NotInterestedIcon />} />
                  )}
                </>
              ) : persona === 'estimator' ? (
                project.showRequestSubmittal && actions.onRequestSubmittal ? (
                  <LeadActionButton label="Request submittal" variant="submittal" accent={theme.accent} onClick={actions.onRequestSubmittal} icon={<SubmittalIcon />} />
                ) : null
              ) : (
                <>
                  <LeadActionButton label="Archive" variant="archive" accent={theme.accent} onClick={actions.onArchive} icon={<ArchiveIcon />} />
                  {showDiscoveryActions && persona === 'tm' && project.vertical === 'landscape' && actions.onInvite && (
                    <LeadActionButton label={inviteLabel} variant="invite" accent={theme.accent} onClick={actions.onInvite} icon={<InviteIcon />} />
                  )}
                  {showDiscoveryActions && persona === 'tm' && project.vertical === 'roofing' && actions.onAddBidder && (
                    <LeadActionButton label={inviteLabel} variant="invite" accent={theme.accent} onClick={actions.onAddBidder} icon={<AddBidderIcon />} />
                  )}
                </>
              )}
              {persona !== 'customer' && project.showRequestSubmittal && actions.onRequestSubmittal && persona !== 'estimator' && (
                <LeadActionButton label="Request submittal" variant="submittal" accent={theme.accent} onClick={actions.onRequestSubmittal} icon={<SubmittalIcon />} />
              )}
              {!showDiscoveryActions && persona === 'tm' && project.vertical === 'roofing' && actions.onAddBidder && (
                <LeadActionButton label="Add bidder" variant="invite" accent={theme.accent} onClick={actions.onAddBidder} icon={<AddBidderIcon />} />
              )}
            </div>
          </>
        )}
      </div>
    </article>
  )
}

function AddBidderIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M8 3.5v9M3.5 8h9" strokeLinecap="round" />
    </svg>
  )
}

const VARIANT_STYLES = {
  interested: { bg: '#16a34a', ring: 'ring-green-600/30' },
  'not-interested': { bg: '#64748b', ring: 'ring-slate-500/30' },
  archive: { bg: '#78716c', ring: 'ring-stone-500/30' },
  invite: { bg: '', ring: 'ring-orange-500/30' },
  submittal: { bg: '#c9a227', ring: 'ring-amber-500/30' },
} as const

function LeadActionButton({
  label,
  variant,
  accent,
  icon,
  onClick,
}: {
  label: string
  variant: keyof typeof VARIANT_STYLES
  accent?: string
  icon: ReactNode
  onClick: () => void
}) {
  const { bg, ring } = VARIANT_STYLES[variant]
  const background = variant === 'invite' ? accent ?? '#e85d04' : bg

  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className={clsx(
        'group relative flex h-8 w-8 items-center justify-center rounded-full text-white shadow-sm',
        'ring-2 ring-transparent transition-all hover:scale-105 hover:opacity-95 hover:ring-2',
        ring,
      )}
      style={{ background }}
    >
      {icon}
      <span className="pointer-events-none absolute -bottom-7 left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded bg-slate-900 px-1.5 py-0.5 text-[9px] font-medium text-white group-hover:block group-focus-visible:block">
        {label}
      </span>
    </button>
  )
}
