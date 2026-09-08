export function TedCalendarPlaceholder({ count }: { count: number }) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const cells = Array.from({ length: 35 }, (_, i) => i + 1)

  return (
    <div className="p-4">
      <p className="mb-3 text-[12px] text-slate-500">
        Calendar view — TED parity shell ({count} projects in current filter). Month grid is illustrative.
      </p>
      <div className="overflow-hidden rounded border border-slate-200">
        <div className="grid grid-cols-7 bg-[#1a1a1a] text-center text-[11px] font-bold text-white">
          {days.map((d) => (
            <div key={d} className="border-r border-white/10 py-2 last:border-r-0">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 bg-white">
          {cells.map((d) => (
            <div
              key={d}
              className="min-h-[72px] border border-slate-100 p-1.5 text-[11px] text-slate-400"
            >
              {d <= 30 ? d : ''}
              {d === 7 && (
                <div className="mt-1 truncate rounded bg-[#c41e3a]/10 px-1 py-0.5 text-[9px] font-medium text-[#c41e3a]">
                  ROCKVILLE ELEMENTARY
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
