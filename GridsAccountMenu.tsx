import { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import type { GridsAccountSession } from '@/data/gridsImpersonation'

interface Props {
  session: GridsAccountSession
  /** TM self menu — Account Dashboard + Invite Contractor cards. */
  showTmNav?: boolean
  onStopImpersonating?: () => void
  onInviteContractor?: () => void
  onAccountDashboard?: () => void
}

export function GridsAccountMenu({
  session,
  showTmNav = false,
  onStopImpersonating,
  onInviteContractor,
  onAccountDashboard,
}: Props) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [open])

  const close = () => setOpen(false)

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded px-1 py-0.5 text-left text-white hover:bg-white/10"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <div className="leading-tight">
          <div className="text-[13px] font-bold">Account</div>
          <div className="text-[11px] font-normal text-white/90">Hello, {session.displayName}!</div>
        </div>
        <span className={clsx('text-[10px] text-white/80 transition-transform', open && 'rotate-180')}>▼</span>
      </button>

      {open && (
        <div
          role="menu"
          className={clsx(
            'absolute right-0 top-full z-50 mt-1 rounded border border-slate-200 bg-white text-slate-900 shadow-lg',
            session.impersonating ? 'min-w-[240px] py-3' : showTmNav ? 'w-[min(420px,calc(100vw-2rem))] p-4' : 'min-w-[240px] p-4',
          )}
        >
          {session.impersonating ? (
            <ImpersonationPanel session={session} onStopImpersonating={onStopImpersonating} onClose={close} />
          ) : showTmNav ? (
            <TmSelfPanel
              session={session}
              onClose={close}
              onInviteContractor={onInviteContractor}
              onAccountDashboard={onAccountDashboard}
            />
          ) : (
            <StandardProfilePanel session={session} onClose={close} />
          )}
        </div>
      )}
    </div>
  )
}

function PersonIcon() {
  return (
    <span
      className="flex h-9 w-9 flex-none items-center justify-center rounded-full text-lg text-white"
      style={{ background: '#e85d04' }}
      aria-hidden
    >
      👤
    </span>
  )
}

function ImpersonationPanel({
  session,
  onStopImpersonating,
  onClose,
}: {
  session: GridsAccountSession
  onStopImpersonating?: () => void
  onClose: () => void
}) {
  return (
    <>
      <div className="flex items-start gap-2.5 px-4">
        <PersonIcon />
        <div className="min-w-0 pt-0.5">
          <div className="text-[13px] font-bold text-slate-900">Hello, {session.displayName}!</div>
          <div className="mt-0.5 text-[12px] text-slate-700">{session.email}</div>
          {onStopImpersonating && (
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                onStopImpersonating()
                onClose()
              }}
              className="mt-1.5 text-[12px] font-medium text-[#1a5fb4] hover:underline"
            >
              Stop Impersonating
            </button>
          )}
        </div>
      </div>

      <div className="my-3 border-t border-slate-200" />

      <div className="px-4">
        <div className="text-[12px] font-bold uppercase tracking-wide text-slate-900">{session.accountName}</div>
        <div className="mt-1 text-[12px] text-slate-800">Account # {session.accountId}</div>
        <button
          type="button"
          role="menuitem"
          className="mt-2 text-[12px] font-medium text-[#1a5fb4] hover:underline"
          onClick={onClose}
        >
          Edit Profile
        </button>
      </div>
    </>
  )
}

function StandardProfilePanel({ session, onClose }: { session: GridsAccountSession; onClose: () => void }) {
  return (
    <div>
      <div className="flex items-start gap-2.5">
        <PersonIcon />
        <div className="min-w-0 pt-0.5">
          <div className="text-[13px] font-bold text-slate-900">Hello, {session.displayName}!</div>
          <div className="mt-0.5 text-[12px] text-slate-700">{session.email}</div>
        </div>
      </div>
      <div className="mt-3 text-[12px] font-medium text-[#1a5fb4]">
        <button type="button" role="menuitem" className="hover:underline" onClick={onClose}>
          Edit Profile
        </button>
        <span className="mx-1.5 text-slate-300">|</span>
        <button type="button" role="menuitem" className="hover:underline" onClick={onClose}>
          Sign Out
        </button>
      </div>
    </div>
  )
}

function TmSelfPanel({
  session,
  onClose,
  onInviteContractor,
  onAccountDashboard,
}: {
  session: GridsAccountSession
  onClose: () => void
  onInviteContractor?: () => void
  onAccountDashboard?: () => void
}) {
  return (
    <div className="flex gap-4">
      <div className="min-w-[168px] flex-none">
        <div className="flex items-start gap-2">
          <PersonIcon />
          <div className="min-w-0">
            <div className="text-[13px] font-bold leading-snug text-slate-900">Hello, {session.displayName}!</div>
            <div className="mt-1 text-[11px] leading-snug text-slate-700">{session.email}</div>
          </div>
        </div>
        <div className="mt-3 text-[12px] font-medium text-[#1a5fb4]">
          <button type="button" role="menuitem" className="hover:underline" onClick={onClose}>
            Edit Profile
          </button>
          <span className="mx-1.5 text-slate-300">|</span>
          <button type="button" role="menuitem" className="hover:underline" onClick={onClose}>
            Sign Out
          </button>
        </div>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <MenuNavCard
          icon="🏠"
          title="Account Dashboard"
          description="Enroll, Edit, and Manage Your Customers' GRIDS Account"
          onClick={() => {
            onAccountDashboard?.()
            onClose()
          }}
        />
        <MenuNavCard
          icon="✈"
          title="Invite Contractor"
          description="Invite new contractors"
          onClick={() => {
            onInviteContractor?.()
            onClose()
          }}
        />
      </div>
    </div>
  )
}

function MenuNavCard({
  icon,
  title,
  description,
  onClick,
}: {
  icon: string
  title: string
  description: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className="flex w-full items-start gap-2.5 rounded border border-slate-200 bg-white p-2.5 text-left transition-colors hover:border-slate-300 hover:bg-slate-50"
    >
      <span className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center text-base text-slate-700" aria-hidden>
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-[12px] font-bold text-slate-900">{title}</span>
        <span className="mt-0.5 block text-[10px] leading-snug text-slate-500">{description}</span>
      </span>
    </button>
  )
}
