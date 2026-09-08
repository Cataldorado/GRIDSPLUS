import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { useAppStore } from '@/state/appStore'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { DOC_TYPES, estimateTurnaround, INTAKE_FINDINGS, PROJECT, ROUTING_ANSWERS } from '@/data/sampleData'

const STEPS = ['Project Type', 'Project Information', 'Documents', 'Routing', 'Review & Submit']
const TONE_MAP = { warning: 'warning', info: 'info' } as const
const ICON_MAP = { warning: '⚠', info: 'ⓘ' } as const
type Visibility = 'Private' | 'Public'

interface SubCategoryOption {
  title: string
  icon: string
  copy: string
}

interface ProjectTypeOption {
  key: string
  icon: string
  title: string
  copy: string
  disabled?: boolean
  subcategories?: SubCategoryOption[]
}

/** Intake-specific project types — broader than the marketing/dashboard VERTICALS list, since intake needs
 * finer-grained sub-category routing that Home/Dashboard filtering doesn't. */
const PROJECT_TYPE_OPTIONS: ProjectTypeOption[] = [
  {
    key: 'irrigation',
    icon: '💧',
    title: 'Irrigation & Landscape',
    copy: 'Controllers, valves, drip — in stock at Sacramento Valley',
    subcategories: [
      { title: 'Irrigation', icon: '🚿', copy: 'Zones, controllers, drip & spray' },
      { title: 'Nursery & Plant Material', icon: '🌱', copy: 'Plant selection & material sourcing' },
      { title: 'Landscape Construction', icon: '🏗️', copy: 'Grading, planting beds, build-outs' },
      { title: 'Hardscapes', icon: '🪨', copy: 'Pavers, retaining walls, patios' },
    ],
  },
  {
    key: 'roofing',
    icon: '🏠',
    title: 'Roofing Systems',
    copy: 'Commercial roofing materials, shipped branch-direct',
    subcategories: [
      { title: 'Tapered Installation', icon: '📐', copy: 'Insulation tapered to drain' },
      { title: 'Low Slope / Flat Roof', icon: '🏢', copy: 'TPO, EPDM, built-up systems' },
      { title: 'Steep Slope', icon: '⛰️', copy: 'Shingle, tile, metal panel' },
      { title: 'Roof Replacement', icon: '🔄', copy: 'Full tear-off & re-roof' },
    ],
  },
  { key: 'hvac', icon: '❄️', title: 'HVAC & Mechanical', copy: 'Heating, cooling, ventilation for commercial builds', disabled: true },
  { key: 'drywall', icon: '🧱', title: 'Drywall & Gypsum', copy: 'New construction & repairs' },
]

/** Progress shown during intake starts much lower than the post-submission baseline and builds step by step —
 * distinct from computeCompleteness (used once a project exists) so the wizard doesn't feel stalled at 30%. */
const STEP_FLOOR: Record<number, number> = { 1: 8, 2: 15, 3: 55, 4: 75 }

function intakeCompleteness(wizardStep: number, uploadedDocTypes: string[], resolvedFindings: string[]): number {
  const floor = STEP_FLOOR[wizardStep] ?? 0
  const docCredit = wizardStep >= 2 ? Math.min(uploadedDocTypes.length, 4) * 8 : 0
  const fixCredit = wizardStep >= 2 ? resolvedFindings.length * 4 : 0
  return Math.min(floor + docCredit + fixCredit, 100)
}

export function IntakeWizard() {
  const persona = useAppStore((s) => s.persona)
  const wizardStep = useAppStore((s) => s.wizardStep)
  const setWizardStep = useAppStore((s) => s.setWizardStep)
  const nextWizardStep = useAppStore((s) => s.nextWizardStep)
  const backWizardStep = useAppStore((s) => s.backWizardStep)
  const uploadedDocTypes = useAppStore((s) => s.uploadedDocTypes)
  const toggleDocType = useAppStore((s) => s.toggleDocType)
  const resolvedFindings = useAppStore((s) => s.resolvedFindings)
  const resolveFinding = useAppStore((s) => s.resolveFinding)
  const routingSubmitted = useAppStore((s) => s.routingSubmitted)
  const submitRouting = useAppStore((s) => s.submitRouting)
  const submitIntake = useAppStore((s) => s.submitIntake)
  const setView = useAppStore((s) => s.setView)

  const [scanning, setScanning] = useState(false)
  const [scanned, setScanned] = useState(false)

  const [projectType, setProjectType] = useState<string | null>(null)
  const [subCategory, setSubCategory] = useState<string | null>(null)
  const [projectName, setProjectName] = useState('')
  const [siteAddress, setSiteAddress] = useState('')
  const [bidDate, setBidDate] = useState('')
  const [visibility, setVisibility] = useState<Visibility>('Private')

  useEffect(() => {
    if (uploadedDocTypes.length === 0 || scanned) return
    setScanning(true)
    const t = setTimeout(() => {
      setScanning(false)
      setScanned(true)
    }, 1300)
    return () => clearTimeout(t)
  }, [uploadedDocTypes.length, scanned])

  const completeness = intakeCompleteness(wizardStep, uploadedDocTypes, resolvedFindings)
  const turnaround = estimateTurnaround(completeness)
  const selectedType = PROJECT_TYPE_OPTIONS.find((o) => o.key === projectType)
  const needsSubCategory = !!selectedType?.subcategories

  function autoPopulate() {
    setProjectType('irrigation')
    setSubCategory('Irrigation')
    setProjectName(`${PROJECT.name} · ${PROJECT.subtitle}`)
    setSiteAddress(PROJECT.siteAddress)
    setBidDate(PROJECT.bidDate)
    setVisibility('Private')
    DOC_TYPES.forEach((d) => {
      if (!uploadedDocTypes.includes(d.id)) toggleDocType(d.id)
    })
  }

  return (
    <div>
      <button onClick={() => setView('dashboard')} className="text-xs text-grids-blue">
        ← Cancel and return to projects
      </button>

      <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">New Project</h1>
          <p className="text-sm text-slate-500">
            Step {wizardStep + 1} of {STEPS.length} — {STEPS[wizardStep]}
          </p>
        </div>
        <Button variant="secondary" onClick={autoPopulate}>
          ✨ Auto-populate
        </Button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {STEPS.map((s, i) => (
          <button
            key={s}
            onClick={() => i < wizardStep && setWizardStep(i)}
            className={clsx(
              'flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold',
              i === wizardStep
                ? 'border-grids-navy bg-grids-navy text-white'
                : i < wizardStep
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                  : 'border-slate-200 bg-white text-slate-400',
            )}
          >
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-black/10 text-[10px]">
              {i < wizardStep ? '✓' : i + 1}
            </span>
            {s}
          </button>
        ))}
      </div>

      {/* Turnaround tracker — hidden on the project-type step; shown once real intake progress begins */}
      {wizardStep > 0 && (
        <Card className="mt-4 !p-4">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Your progress</div>
              <div className="text-xl font-bold text-grids-navy">{completeness}% complete</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Estimated turnaround
              </div>
              <div className="text-lg font-bold text-emerald-600">{turnaround}</div>
            </div>
          </div>
          <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-grids-blue to-emerald-500 transition-all duration-700 ease-out"
              style={{ width: `${completeness}%` }}
            />
          </div>
        </Card>
      )}

      <Card className="mt-4">
        {wizardStep === 0 && (
          <>
            <h2 className="font-semibold text-slate-800">Choose project type</h2>
            <p className="mt-0.5 text-sm text-slate-500">Select the primary service area for this project.</p>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {PROJECT_TYPE_OPTIONS.map((opt) => {
                const selected = projectType === opt.key
                return (
                  <button
                    key={opt.key}
                    disabled={opt.disabled}
                    onClick={() => {
                      setProjectType(opt.key)
                      setSubCategory(null)
                    }}
                    className={clsx(
                      'rounded-lg border p-4 text-left transition-colors',
                      opt.disabled
                        ? 'cursor-not-allowed border-slate-200 bg-slate-50 opacity-60'
                        : selected
                          ? 'border-grids-navy bg-grids-navy/5'
                          : 'border-slate-200 hover:border-grids-blue hover:bg-grids-blue/5',
                    )}
                  >
                    <div className="text-2xl">{opt.icon}</div>
                    <div className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                      {opt.title}
                      {selected && <span className="text-grids-navy">✓</span>}
                    </div>
                    <div className="mt-1 text-xs text-slate-400">{opt.disabled ? 'Coming soon' : opt.copy}</div>
                  </button>
                )
              })}
            </div>

            {needsSubCategory && (
              <div className="mt-5 border-t border-slate-100 pt-4">
                <label className="text-xs font-semibold text-slate-500">
                  Choose a sub-category for {selectedType!.title} *
                </label>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  {selectedType!.subcategories!.map((sc) => {
                    const selected = subCategory === sc.title
                    return (
                      <button
                        key={sc.title}
                        onClick={() => setSubCategory(sc.title)}
                        className={clsx(
                          'rounded-lg border p-4 text-left transition-colors',
                          selected
                            ? 'border-grids-navy bg-grids-navy/5'
                            : 'border-slate-200 hover:border-grids-blue hover:bg-grids-blue/5',
                        )}
                      >
                        <div className="text-2xl">{sc.icon}</div>
                        <div className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                          {sc.title}
                          {selected && <span className="text-grids-navy">✓</span>}
                        </div>
                        <div className="mt-1 text-xs text-slate-400">{sc.copy}</div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {wizardStep === 1 && (
          <>
            <h2 className="font-semibold text-slate-800">Project Information</h2>
            <div className="mt-4">
              <label className="text-xs font-semibold text-slate-500">Project name *</label>
              <input
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="e.g. Riverside Apartments Phase 2"
                className="mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-grids-blue"
              />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-500">Site address</label>
                <input
                  value={siteAddress}
                  onChange={(e) => setSiteAddress(e.target.value)}
                  placeholder="Street, city, state"
                  className="mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-grids-blue"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500">Bid date *</label>
                <input
                  value={bidDate}
                  onChange={(e) => setBidDate(e.target.value)}
                  placeholder="📅 MM/DD/YYYY"
                  className="mt-1.5 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-grids-blue"
                />
              </div>
            </div>

            {persona === 'customer' ? (
              <p className="mt-4 text-xs text-slate-400">
                🔒 This project is private to your account — only you, your Territory Manager, and your
                estimator can see it.
              </p>
            ) : (
              <div className="mt-4">
                <label className="text-xs font-semibold text-slate-500">Visibility</label>
                <div className="mt-1.5 flex gap-2">
                  {(['Private', 'Public'] as Visibility[]).map((v) => (
                    <button
                      key={v}
                      onClick={() => setVisibility(v)}
                      className={clsx(
                        'flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-semibold',
                        visibility === v
                          ? 'border-grids-navy bg-grids-navy text-white'
                          : 'border-slate-300 bg-white text-slate-600 hover:border-grids-blue',
                      )}
                    >
                      {v === 'Private' ? '🔒' : '🌐'} {v}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {wizardStep === 2 && (
          <>
            <h2 className="flex items-center gap-1.5 font-semibold text-slate-800">
              <span>✨</span> What do you have?
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">
              Add whatever you've got — each one sharpens the quote and speeds up your turnaround.
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3">
              {DOC_TYPES.map((d) => {
                const added = uploadedDocTypes.includes(d.id)
                return (
                  <button
                    key={d.id}
                    onClick={() => toggleDocType(d.id)}
                    className={clsx(
                      'flex items-start gap-3 rounded-lg border p-3 text-left transition-colors',
                      added
                        ? 'border-emerald-300 bg-emerald-50'
                        : 'border-dashed border-slate-300 hover:border-grids-blue hover:bg-grids-blue/5',
                    )}
                  >
                    <span className="text-xl">{added ? '✅' : d.icon}</span>
                    <div>
                      <div className="text-sm font-semibold text-slate-800">{d.label}</div>
                      <div className="text-xs text-slate-400">{added ? 'Added ✓' : d.hint}</div>
                    </div>
                  </button>
                )
              })}
            </div>

            {scanning && (
              <div className="mt-4 flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-4">
                <div className="h-5 w-5 animate-spin rounded-full border-4 border-grids-blue/20 border-t-grids-blue" />
                <span className="text-sm font-medium text-slate-600">
                  Reviewing what you shared for gaps and compatibility issues…
                </span>
              </div>
            )}

            {scanned && (
              <div className="mt-4 space-y-2.5">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Things worth a look
                </div>
                {INTAKE_FINDINGS.map((f) => {
                  const resolved = resolvedFindings.includes(f.id)
                  return (
                    <div
                      key={f.id}
                      className={clsx(
                        'rounded-lg border p-3.5',
                        resolved ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-white',
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <span>{resolved ? '✅' : ICON_MAP[f.type]}</span>
                        <div className="flex-1">
                          {!resolved && <Badge tone={TONE_MAP[f.type]}>{f.type === 'warning' ? 'Needs attention' : 'Suggestion'}</Badge>}
                          <p className="mt-1 text-sm font-semibold text-slate-800">{f.title}</p>
                          <p className="mt-0.5 text-sm text-slate-500">
                            {resolved ? f.fixedDetail : f.detail}
                          </p>
                          {!resolved && (
                            <Button variant="secondary" className="mt-2.5" onClick={() => resolveFinding(f.id)}>
                              {f.fixLabel}
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}

        {wizardStep === 3 && (
          <>
            <h2 className="font-semibold text-slate-800">Routing questionnaire</h2>
            <p className="mt-0.5 text-sm text-slate-500">Pre-filled from what you shared — confirm or adjust.</p>
            <div className="mt-4 space-y-3">
              <div className="rounded-lg border border-slate-200 p-3">
                <div className="text-xs font-semibold text-slate-500">1. What type of project is this?</div>
                <div className="mt-1 text-sm font-medium text-slate-800">{ROUTING_ANSWERS.projectType}</div>
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <div className="text-xs font-semibold text-slate-500">
                  2. Is there an existing design, or does the project need one?
                </div>
                <div className="mt-1 text-sm font-medium text-slate-800">{ROUTING_ANSWERS.design}</div>
              </div>
              <div className="rounded-lg border border-slate-200 p-3">
                <div className="text-xs font-semibold text-slate-500">
                  3. Is there an existing takeoff, or does the project need one?
                </div>
                <div className="mt-1 text-sm font-medium text-slate-800">{ROUTING_ANSWERS.takeoff}</div>
              </div>
              <div className="rounded-lg border border-grids-blue/40 bg-grids-blue/5 p-3">
                <div className="text-xs font-semibold uppercase tracking-wide text-grids-navy">Auto-route result</div>
                <div className="mt-1 text-sm font-medium text-slate-800">{ROUTING_ANSWERS.autoRoute}</div>
              </div>
            </div>
          </>
        )}

        {wizardStep === 4 && (
          <>
            <h2 className="font-semibold text-slate-800">Review &amp; Submit</h2>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                <div>
                  <div className="font-semibold text-slate-800">
                    {selectedType ? `${selectedType.title}${subCategory ? ` · ${subCategory}` : ''}` : 'No project type selected'}
                  </div>
                  <div className="text-xs text-slate-500">
                    {persona === 'customer' ? 'Private' : visibility}
                  </div>
                </div>
                <button onClick={() => setWizardStep(0)} className="text-xs font-semibold text-grids-blue">
                  Edit
                </button>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                <div>
                  <div className="font-semibold text-slate-800">{projectName || 'No project name yet'}</div>
                  <div className="text-xs text-slate-500">
                    {siteAddress || 'No address yet'} · Bid date {bidDate || '—'}
                  </div>
                </div>
                <button onClick={() => setWizardStep(1)} className="text-xs font-semibold text-grids-blue">
                  Edit
                </button>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                <div>
                  <div className="font-semibold text-slate-800">
                    {completeness}% complete · {turnaround}
                  </div>
                  <div className="text-xs text-slate-500">
                    {uploadedDocTypes.length} doc type{uploadedDocTypes.length === 1 ? '' : 's'} added ·{' '}
                    {resolvedFindings.length}/{INTAKE_FINDINGS.length} suggestions applied
                  </div>
                </div>
                <button onClick={() => setWizardStep(2)} className="text-xs font-semibold text-grids-blue">
                  Edit
                </button>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                <div>
                  <div className="font-semibold text-slate-800">{ROUTING_ANSWERS.autoRoute}</div>
                  <div className="text-xs text-slate-500">Routing confirmed</div>
                </div>
                <button onClick={() => setWizardStep(3)} className="text-xs font-semibold text-grids-blue">
                  Edit
                </button>
              </div>
            </div>
          </>
        )}
      </Card>

      <div className="mt-4 flex items-center justify-between">
        <Button variant="secondary" onClick={backWizardStep} disabled={wizardStep === 0}>
          ← Back
        </Button>
        {wizardStep < STEPS.length - 1 ? (
          <Button
            disabled={
              (wizardStep === 0 && (!projectType || (needsSubCategory && !subCategory))) ||
              (wizardStep === 2 && uploadedDocTypes.length === 0)
            }
            onClick={() => {
              if (wizardStep === 3 && !routingSubmitted) submitRouting()
              nextWizardStep()
            }}
          >
            Next →
          </Button>
        ) : (
          <Button onClick={submitIntake}>Submit Project ✓</Button>
        )}
      </div>
    </div>
  )
}
