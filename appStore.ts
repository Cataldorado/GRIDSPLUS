import { create } from 'zustand'
import type { Persona, ProjectStage } from '@/data/sampleData'
import type { Company } from '@/data/customers'
import type { DemoScope } from '@/config/demoScope'
import type { LeadDisposition } from '@/data/leadActions'
import type { ProjectMessage } from '@/data/projectMessageBoard'
import { authorForPersona } from '@/data/projectMessageBoard'

export type View = 'home' | 'dashboard' | 'wizard' | 'project' | 'triage-detail' | 'quote-detail' | 'customers' | 'decision-demo'
export type DetailTab = 'overview' | 'intake' | 'workflow' | 'quote'
export type HostPlatform = 'heritage' | 'roofhub' | 'grids'

interface AppState {
  view: View
  persona: Persona
  guideOpen: boolean
  viewingProjectNum: string | null
  /** Active bidder/opportunity when viewing project or quote detail (employee). */
  viewingOpportunityId: string | null
  hostPlatform: HostPlatform
  demoScope: DemoScope
  rosterOverrides: Record<string, boolean>
  projectAccessOverrides: Record<string, boolean>
  invitedCompanies: Company[]
  leadDisposition: Record<string, LeadDisposition>
  /** TM impersonating a contractor user on GRIDS board (MVP parity). */
  gridsTmImpersonating: boolean
  /** User-posted project messages (demo session persistence). */
  projectMessageAdds: Record<string, ProjectMessage[]>

  // project lifecycle
  projectCreated: boolean
  stage: ProjectStage
  modificationRequested: boolean

  // intake wizard
  wizardStep: number
  uploadedDocTypes: string[]
  resolvedFindings: string[]
  routingSubmitted: boolean

  // project detail
  detailTab: DetailTab

  setView: (v: View) => void
  setPersona: (p: Persona) => void
  toggleGuide: () => void
  setHostPlatform: (p: HostPlatform) => void
  setDemoScope: (s: DemoScope) => void
  toggleRoster: (userId: string, defaultRostered: boolean) => void
  toggleProjectAccess: (projectNum: string, userId: string, defaultAccess: boolean) => void
  inviteCompany: (company: Company) => void
  expressInterest: (projectNum: string) => void
  archiveLead: (projectNum: string) => void
  setGridsTmImpersonating: (active: boolean) => void
  postProjectMessage: (projectNum: string, body: string, persona: Persona, contractorName: string) => void

  setWizardStep: (i: number) => void
  nextWizardStep: () => void
  backWizardStep: () => void
  toggleDocType: (id: string) => void
  resolveFinding: (id: string) => void
  submitRouting: () => void
  submitIntake: () => void

  setDetailTab: (t: DetailTab) => void
  openProject: (tab?: DetailTab) => void
  openTriageDetail: (num: string, opportunityId?: string) => void
  openQuoteDetail: (num: string, opportunityId?: string) => void
  setViewingOpportunity: (id: string | null) => void

  completeEstimate: () => void
  shareQuote: () => void
  requestModification: () => void
  acceptQuote: () => void

  restart: () => void
}

const WIZARD_STEP_COUNT = 5

export const useAppStore = create<AppState>((set, get) => ({
  view: 'home',
  persona: 'customer',
  guideOpen: false,
  viewingProjectNum: null,
  viewingOpportunityId: null,
  hostPlatform: 'heritage',
  demoScope: 'mvp',
  rosterOverrides: {},
  projectAccessOverrides: {},
  invitedCompanies: [],
  leadDisposition: {},
  gridsTmImpersonating: false,
  projectMessageAdds: {},

  projectCreated: false,
  stage: 'estimating',
  modificationRequested: false,

  wizardStep: 0,
  uploadedDocTypes: [],
  resolvedFindings: [],
  routingSubmitted: false,

  detailTab: 'overview',

  setView: (v) => set({ view: v }),
  setPersona: (p) => set({ persona: p, detailTab: 'overview' }),
  toggleGuide: () => set((s) => ({ guideOpen: !s.guideOpen })),
  setHostPlatform: (p) =>
    set((s) => ({
      hostPlatform: p,
      view: p === 'grids' && s.view === 'home' ? 'dashboard' : s.view,
    })),
  setDemoScope: (s) => set({ demoScope: s }),
  toggleRoster: (userId, defaultRostered) =>
    set((s) => ({
      rosterOverrides: { ...s.rosterOverrides, [userId]: !(s.rosterOverrides[userId] ?? defaultRostered) },
    })),
  toggleProjectAccess: (projectNum, userId, defaultAccess) =>
    set((s) => {
      const key = `${projectNum}::${userId}`
      return { projectAccessOverrides: { ...s.projectAccessOverrides, [key]: !(s.projectAccessOverrides[key] ?? defaultAccess) } }
    }),
  inviteCompany: (company) => set((s) => ({ invitedCompanies: [...s.invitedCompanies, company] })),
  expressInterest: (projectNum) =>
    set((s) => ({ leadDisposition: { ...s.leadDisposition, [projectNum]: 'interested' } })),
  archiveLead: (projectNum) =>
    set((s) => ({ leadDisposition: { ...s.leadDisposition, [projectNum]: 'archived' } })),
  setGridsTmImpersonating: (active) => set({ gridsTmImpersonating: active }),
  postProjectMessage: (projectNum, body, persona, contractorName) => {
    const author = authorForPersona(persona, contractorName)
    const msg: ProjectMessage = {
      id: `msg-user-${Date.now()}`,
      ...author,
      body,
      at: 'Just now',
    }
    set((s) => ({
      projectMessageAdds: {
        ...s.projectMessageAdds,
        [projectNum]: [...(s.projectMessageAdds[projectNum] ?? []), msg],
      },
    }))
  },

  setWizardStep: (i) => set({ wizardStep: Math.min(Math.max(i, 0), WIZARD_STEP_COUNT - 1) }),
  nextWizardStep: () => set((s) => ({ wizardStep: Math.min(s.wizardStep + 1, WIZARD_STEP_COUNT - 1) })),
  backWizardStep: () => set((s) => ({ wizardStep: Math.max(s.wizardStep - 1, 0) })),
  toggleDocType: (id) =>
    set((s) => ({
      uploadedDocTypes: s.uploadedDocTypes.includes(id)
        ? s.uploadedDocTypes.filter((d) => d !== id)
        : [...s.uploadedDocTypes, id],
    })),
  resolveFinding: (id) =>
    set((s) => ({
      resolvedFindings: s.resolvedFindings.includes(id) ? s.resolvedFindings : [...s.resolvedFindings, id],
    })),
  submitRouting: () => set({ routingSubmitted: true }),
  submitIntake: () =>
    set({
      projectCreated: true,
      stage: 'estimating',
      view: 'project',
      persona: 'customer',
      detailTab: 'overview',
    }),

  setDetailTab: (t) => set({ detailTab: t }),
  openProject: (tab) => set({ view: 'project', detailTab: tab ?? get().detailTab ?? 'overview' }),
  openTriageDetail: (num, opportunityId) =>
    set({
      view: 'triage-detail',
      viewingProjectNum: num,
      viewingOpportunityId: opportunityId ?? null,
    }),
  openQuoteDetail: (num, opportunityId) =>
    set({
      view: 'quote-detail',
      viewingProjectNum: num,
      viewingOpportunityId: opportunityId ?? get().viewingOpportunityId,
    }),
  setViewingOpportunity: (id) => set({ viewingOpportunityId: id }),

  completeEstimate: () => set({ stage: 'estimate_complete' }),
  shareQuote: () => set({ stage: 'quote_shared', modificationRequested: false }),
  requestModification: () => set({ modificationRequested: true }),
  acceptQuote: () => set({ stage: 'accepted' }),

  restart: () =>
    set({
      view: 'home',
      persona: 'customer',
      viewingProjectNum: null,
      viewingOpportunityId: null,
      hostPlatform: 'heritage',
      demoScope: 'mvp',
      rosterOverrides: {},
      projectAccessOverrides: {},
      invitedCompanies: [],
      leadDisposition: {},
      gridsTmImpersonating: false,
      projectMessageAdds: {},
      projectCreated: false,
      stage: 'estimating',
      modificationRequested: false,
      wizardStep: 0,
      uploadedDocTypes: [],
      resolvedFindings: [],
      routingSubmitted: false,
      detailTab: 'overview',
    }),
}))

export { WIZARD_STEP_COUNT }
