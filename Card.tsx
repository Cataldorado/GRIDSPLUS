import type { ReactNode, HTMLAttributes } from 'react'
import clsx from 'clsx'

export function Card({
  children,
  className,
  padded = true,
  ...rest
}: {
  children: ReactNode
  className?: string
  padded?: boolean
} & HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        'rounded-xl border border-slate-200 bg-white shadow-sm',
        padded && 'p-6',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
