import type { ReactNode } from 'react'

/** Compact stroke icons for GRIDS/TED lead card actions (16×16 viewBox). */

function IconBase({ children }: { children: ReactNode }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  )
}

/** Customer: "I'm interested" — filled thumbs up for clarity at 16px */
export function InterestedIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M14 9V5a3 3 0 0 0-5.176-2.016l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14zm-8 9H3V9h3v11z" />
    </svg>
  )
}

/** Customer: dismiss / not interested */
export function NotInterestedIcon() {
  return (
    <IconBase>
      <circle cx="8" cy="8" r="5.25" />
      <path d="M5.75 5.75l4.5 4.5M10.25 5.75l-4.5 4.5" />
    </IconBase>
  )
}

/** TM: move lead off the board */
export function ArchiveIcon() {
  return (
    <IconBase>
      <rect x="3" y="2.5" width="10" height="2.5" rx="0.5" />
      <path d="M4.5 5v7.25a.75.75 0 0 0 .75.75h5.5a.75.75 0 0 0 .75-.75V5" />
      <path d="M6.25 8.25h3.5M6.25 10.25h3.5" />
    </IconBase>
  )
}

/** TM: invite contractor to bid */
export function InviteIcon() {
  return (
    <IconBase>
      <circle cx="6" cy="5" r="2.25" />
      <path d="M2.75 13v-.75c0-1.5 1.35-2.75 3.25-2.75s3.25 1.25 3.25 2.75V13" />
      <path d="M11.5 5.5v4M9.5 7.5h4" />
    </IconBase>
  )
}

/** Request submittal link */
export function SubmittalIcon() {
  return (
    <IconBase>
      <path d="M8.5 2.5v7.25l2-2" />
      <path d="M8.5 9.75l-2-2" />
      <path d="M3.5 9.75v3a.75.75 0 0 0 .75.75h7.5a.75.75 0 0 0 .75-.75v-3" />
    </IconBase>
  )
}
