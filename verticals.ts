import type { TriageProject } from '@/data/triageData'

export type VerticalKey = 'irrigation' | 'roofing' | 'hvac'

export interface Vertical {
  key: VerticalKey
  icon: string
  title: string
  copy: string
}

/** Same categories marketed on the Heritage+ home page. */
export const VERTICALS: Vertical[] = [
  { key: 'irrigation', icon: '💧', title: 'Irrigation & Landscape', copy: 'Controllers, valves, drip — in stock at Sacramento Valley' },
  { key: 'roofing', icon: '🏠', title: 'Roofing Systems', copy: 'Commercial roofing materials, shipped branch-direct' },
  { key: 'hvac', icon: '❄️', title: 'HVAC & Mechanical', copy: 'Heating, cooling, ventilation for commercial builds' },
]

/** GRIDS+ launched in irrigation/landscape first, with roofing now live too — HVAC has no template yet. */
export function verticalForTemplate(template: TriageProject['template']): VerticalKey {
  if (template === 'ROOFING') return 'roofing'
  return 'irrigation'
}
