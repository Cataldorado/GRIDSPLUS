import { Fragment } from 'react'
import type { QuoteGroup } from '@/data/sampleData'
import { quoteGroupTotals } from '@/data/triageDetailData'

export function QuoteLineItemsTable({ groups, showMargin }: { groups: QuoteGroup[]; showMargin: boolean }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full text-left text-xs">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            <th className="px-3 py-2 font-semibold">Product Description</th>
            <th className="px-3 py-2 font-semibold">Item #</th>
            {showMargin && <th className="px-3 py-2 font-semibold">Cost</th>}
            <th className="px-3 py-2 font-semibold">Qty</th>
            <th className="px-3 py-2 font-semibold">Price</th>
            <th className="px-3 py-2 font-semibold">UOM</th>
            {showMargin && <th className="px-3 py-2 font-semibold">GM%</th>}
            <th className="px-3 py-2 font-semibold">Ext. Price</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((group) => {
            const { subtotal, avgGm } = quoteGroupTotals(group.items)
            const labelColSpan = showMargin ? 6 : 5
            return (
              <Fragment key={group.name}>
                <tr className="bg-grids-blue/5">
                  <td colSpan={labelColSpan} className="px-3 py-1.5 font-semibold text-grids-navy">
                    {group.name.toUpperCase()} ({group.items.length})
                  </td>
                  {showMargin && (
                    <td className="px-3 py-1.5 text-right font-semibold text-grids-navy">{avgGm.toFixed(2)}% avg</td>
                  )}
                  <td className="px-3 py-1.5 text-right font-semibold text-grids-navy">
                    ${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                </tr>
                {group.items.map((item) => (
                  <tr key={item.itemNumber} className="border-t border-slate-100">
                    <td className="px-3 py-2 text-slate-700">
                      {item.description}
                      {item.notes && <div className="text-[10px] text-grids-blue">{item.notes}</div>}
                    </td>
                    <td className="px-3 py-2 font-mono text-slate-500">{item.itemNumber}</td>
                    {showMargin && <td className="px-3 py-2 text-slate-500">${item.cost.toFixed(2)}</td>}
                    <td className="px-3 py-2 text-slate-700">{item.qty}</td>
                    <td className="px-3 py-2 text-slate-700">${item.price.toFixed(2)}</td>
                    <td className="px-3 py-2 text-slate-500">{item.uom}</td>
                    {showMargin && <td className="px-3 py-2 text-slate-700">{item.gmPercent.toFixed(2)}%</td>}
                    <td className="px-3 py-2 font-semibold text-slate-800">${(item.price * item.qty).toFixed(2)}</td>
                  </tr>
                ))}
              </Fragment>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
