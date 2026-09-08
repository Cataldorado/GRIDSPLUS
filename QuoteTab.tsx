import { Fragment, useState } from 'react'
import { useAppStore } from '@/state/appStore'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { PROJECT, QUOTE_GROUPS, quoteAvgGm, quoteSubtotal } from '@/data/sampleData'

export function QuoteTab() {
  const persona = useAppStore((s) => s.persona)
  return persona === 'tm' ? <TMQuoteView /> : <CustomerQuoteView />
}

function TMQuoteView() {
  const stage = useAppStore((s) => s.stage)
  const modificationRequested = useAppStore((s) => s.modificationRequested)
  const shareQuote = useAppStore((s) => s.shareQuote)
  const [showModal, setShowModal] = useState(false)

  if (stage === 'estimating') {
    return (
      <Card className="py-10 text-center">
        <p className="text-sm text-slate-500">
          Waiting on the estimate from {PROJECT.estimator.name} before you can prep this quote.
        </p>
      </Card>
    )
  }

  const shared = stage === 'quote_shared' || stage === 'accepted'

  return (
    <Card>
      {modificationRequested && (
        <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm font-semibold text-amber-800">
          {PROJECT.customer.contact} requested a modification — revise and re-share below.
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-grids-blue">TM prep &amp; share</p>
          <h2 className="mt-1 text-lg font-bold text-slate-900">
            Quote 1 — {PROJECT.name} · {PROJECT.subtitle}
          </h2>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-400">Quote GM% · Subtotal</div>
          <div className="text-sm font-bold text-slate-800">
            {quoteAvgGm.toFixed(2)}% · ${quoteSubtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
        </div>
      </div>

      <div className="mt-3 overflow-hidden rounded-lg border border-slate-200">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-3 py-2 font-semibold">Product Description</th>
              <th className="px-3 py-2 font-semibold">Item #</th>
              <th className="px-3 py-2 font-semibold">Cost</th>
              <th className="px-3 py-2 font-semibold">Qty</th>
              <th className="px-3 py-2 font-semibold">Price</th>
              <th className="px-3 py-2 font-semibold">GM%</th>
              <th className="px-3 py-2 font-semibold">Ext. Price</th>
            </tr>
          </thead>
          <tbody>
            {QUOTE_GROUPS.map((group) => (
              <Fragment key={group.name}>
                <tr className="bg-grids-blue/5">
                  <td colSpan={7} className="px-3 py-1.5 font-semibold text-grids-navy">
                    {group.name.toUpperCase()} ({group.items.length})
                  </td>
                </tr>
                {group.items.map((item) => (
                  <tr key={item.itemNumber} className="border-t border-slate-100">
                    <td className="px-3 py-2 text-slate-700">
                      {item.description}
                      {item.notes && <div className="text-[10px] text-grids-blue">{item.notes}</div>}
                    </td>
                    <td className="px-3 py-2 font-mono text-slate-500">{item.itemNumber}</td>
                    <td className="px-3 py-2 text-slate-500">${item.cost.toFixed(2)}</td>
                    <td className="px-3 py-2 text-slate-700">{item.qty}</td>
                    <td className="px-3 py-2 text-slate-700">${item.price.toFixed(2)}</td>
                    <td className="px-3 py-2 text-slate-700">{item.gmPercent.toFixed(2)}%</td>
                    <td className="px-3 py-2 font-semibold text-slate-800">
                      ${(item.price * item.qty).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-1.5 text-[11px] text-slate-400">
        Internal view — cost and GM% are never shown to the customer.
      </p>

      <div className="mt-5 flex items-center justify-between">
        {!shared || modificationRequested ? (
          <Button onClick={() => setShowModal(true)}>
            {modificationRequested ? 'Re-share with customer →' : 'Share with customer →'}
          </Button>
        ) : (
          <Badge tone="success">Shared with {PROJECT.customer.contact} ✓</Badge>
        )}
        <span className="text-xs text-slate-400">
          {stage === 'accepted' ? 'Customer accepted & purchased ✓' : ''}
        </span>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <Card className="w-full max-w-sm">
            <div className="text-sm font-semibold text-slate-800">Share quote with customer</div>
            <p className="mt-1 text-xs text-slate-500">
              Sends Quote 1 to {PROJECT.customer.contact} at {PROJECT.customer.company}. Cost and GM%
              stay internal.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  shareQuote()
                  setShowModal(false)
                }}
              >
                Confirm &amp; share
              </Button>
            </div>
          </Card>
        </div>
      )}
    </Card>
  )
}

function CustomerQuoteView() {
  const stage = useAppStore((s) => s.stage)
  const modificationRequested = useAppStore((s) => s.modificationRequested)
  const acceptQuote = useAppStore((s) => s.acceptQuote)
  const requestModification = useAppStore((s) => s.requestModification)
  const [justRequested, setJustRequested] = useState(false)

  if (stage === 'accepted') {
    return (
      <Card className="flex flex-col items-center gap-3 py-14 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-600">
          ✓
        </div>
        <h2 className="text-xl font-bold text-slate-900">Quote accepted &amp; purchased</h2>
        <p className="max-w-sm text-sm text-slate-500">
          Order routed to Agility for fulfillment. {PROJECT.tm.name} and {PROJECT.estimator.name} were
          notified automatically.
        </p>
      </Card>
    )
  }

  if (stage === 'estimating' || stage === 'estimate_complete') {
    return (
      <Card className="py-10 text-center">
        <p className="text-sm text-slate-500">
          Your Territory Manager, {PROJECT.tm.name}, is preparing your quote. You'll be notified the
          moment it's ready to review.
        </p>
      </Card>
    )
  }

  if (modificationRequested) {
    return (
      <Card className="py-10 text-center">
        <Badge tone="warning">Modification requested</Badge>
        <p className="mt-2 text-sm text-slate-500">
          {PROJECT.tm.name} is revising your quote — you'll be notified when the updated version is
          ready.
        </p>
      </Card>
    )
  }

  return (
    <Card>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">
          Quote 1 — {PROJECT.name} · {PROJECT.subtitle}
        </h2>
        <Badge tone="info">Expires in 30 days</Badge>
      </div>

      <div className="mt-3 overflow-hidden rounded-lg border border-slate-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs text-slate-500">
            <tr>
              <th className="px-3 py-2 font-semibold">Item</th>
              <th className="px-3 py-2 font-semibold">Qty</th>
              <th className="px-3 py-2 font-semibold">Notes</th>
              <th className="px-3 py-2 text-right font-semibold">Line total</th>
            </tr>
          </thead>
          <tbody>
            {QUOTE_GROUPS.flatMap((g) => g.items).map((item) => (
              <tr key={item.itemNumber} className="border-t border-slate-100">
                <td className="px-3 py-2 text-slate-700">{item.description}</td>
                <td className="px-3 py-2 text-slate-500">
                  {item.qty} {item.uom}
                </td>
                <td className="px-3 py-2 text-xs text-grids-blue">{item.notes ?? '—'}</td>
                <td className="px-3 py-2 text-right font-semibold text-slate-800">
                  ${(item.price * item.qty).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-slate-200 bg-slate-50">
              <td colSpan={3} className="px-3 py-2 text-right text-sm font-semibold text-slate-600">
                Subtotal
              </td>
              <td className="px-3 py-2 text-right text-sm font-bold text-slate-900">
                ${quoteSubtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="mt-4 border-t border-slate-100 pt-4">
        <div className="text-sm font-semibold text-slate-800">Ready to move forward?</div>
        <div className="mt-3 flex gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              requestModification()
              setJustRequested(true)
            }}
          >
            Request modification
          </Button>
          <Button onClick={acceptQuote}>Accept &amp; purchase</Button>
        </div>
        {justRequested && (
          <p className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800">
            Request sent to {PROJECT.tm.name} — a revised quote will appear here once updated.
          </p>
        )}
      </div>
    </Card>
  )
}
