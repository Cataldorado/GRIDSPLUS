import { UNIFIED_TEMPLATE_OPTIONS } from '@/data/unifiedBoard'

export function CommercialFilterBar({
  templateFilter,
  onTemplateFilter,
}: {
  templateFilter: string
  onTemplateFilter: (v: string) => void
}) {
  return (
    <div className="flex flex-wrap items-end gap-3 border-b border-slate-200 bg-white px-4 py-3 text-[12px] text-slate-700">
      <label className="flex flex-col gap-0.5">
        <span className="font-semibold text-slate-800">Template</span>
        <select
          value={templateFilter}
          onChange={(e) => onTemplateFilter(e.target.value)}
          className="rounded border border-slate-300 px-2 py-1 text-[11px]"
        >
          {UNIFIED_TEMPLATE_OPTIONS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </label>
      <fieldset className="flex items-center gap-2">
        <span className="font-semibold text-slate-800">Visibility:</span>
        {['Both', 'Public', 'Private'].map((v, i) => (
          <label key={v} className="flex cursor-pointer items-center gap-1">
            <input type="radio" name="vis" defaultChecked={i === 0} className="accent-[#1a5fb4]" />
            {v}
          </label>
        ))}
      </fieldset>
      <label className="flex flex-col gap-0.5">
        <span className="font-semibold text-slate-800">Region</span>
        <select className="rounded border border-slate-300 px-2 py-1 text-[11px]">
          <option>Any</option>
          <option>Midwest</option>
          <option>Southeast</option>
        </select>
      </label>
      <label className="flex flex-col gap-0.5">
        <span className="font-semibold text-slate-800">Bid Due</span>
        <select className="rounded border border-slate-300 px-2 py-1 text-[11px]">
          <option>All</option>
          <option>Next 7 days</option>
          <option>Overdue</option>
        </select>
      </label>
      <label className="flex flex-col gap-0.5">
        <span className="font-semibold text-slate-800">State</span>
        <input className="w-24 rounded border border-slate-300 px-2 py-1 text-[11px]" placeholder="" />
      </label>
      <label className="flex flex-col gap-0.5">
        <span className="font-semibold text-slate-800">Project Name</span>
        <input className="w-32 rounded border border-slate-300 px-2 py-1 text-[11px]" />
      </label>
      <label className="flex flex-col gap-0.5">
        <span className="font-semibold text-slate-800">Project Number</span>
        <input className="w-28 rounded border border-slate-300 px-2 py-1 text-[11px]" />
      </label>
      <label className="flex flex-col gap-0.5">
        <span className="font-semibold text-slate-800">Agility Account #</span>
        <input className="w-28 rounded border border-slate-300 px-2 py-1 text-[11px]" />
      </label>
      <label className="flex flex-col gap-0.5">
        <span className="font-semibold text-slate-800">City</span>
        <input className="w-24 rounded border border-slate-300 px-2 py-1 text-[11px]" />
      </label>
      <button
        type="button"
        className="mb-0.5 flex h-8 w-8 items-center justify-center rounded text-white"
        style={{ background: '#6b1c2e' }}
        aria-label="Apply filters"
      >
        🔍
      </button>
    </div>
  )
}
