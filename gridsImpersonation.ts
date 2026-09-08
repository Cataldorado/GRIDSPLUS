import type { Persona } from '@/data/sampleData'
import { PERSONA_META, PROJECT } from '@/data/sampleData'

export interface GridsAccountSession {
  displayName: string
  email: string
  accountName: string
  accountId: string
  /** TM viewing the board as a contractor user. */
  impersonating: boolean
}

/** TM impersonation capture — Divya Nethi on HPTA (Sep 2026 walkthrough). */
export const GRIDS_TM_IMPERSONATION: GridsAccountSession = {
  displayName: 'Divya Nethi',
  email: 'divya.nethi@srsdistribution.com',
  accountName: 'HERITAGE PLUS TEST ACCOUNT',
  accountId: 'HPTA',
  impersonating: true,
}

export const GRIDS_TM_SELF: GridsAccountSession = {
  displayName: 'Chris Cataldo',
  email: 'Chris.Cataldo@heritagelsg.com',
  accountName: 'Heritage Design Services',
  accountId: 'TM-SAC',
  impersonating: false,
}

export function gridsAccountForPersona(persona: Persona, impersonating: boolean): GridsAccountSession {
  if (persona === 'tm') {
    return impersonating ? GRIDS_TM_IMPERSONATION : GRIDS_TM_SELF
  }
  if (persona === 'estimator') {
    return {
      displayName: PERSONA_META.estimator.name,
      email: 'jordan.lee@heritageplus.com',
      accountName: 'Heritage Commercial Services',
      accountId: 'CS-SAC',
      impersonating: false,
    }
  }
  return {
    displayName: PERSONA_META.customer.name,
    email: 'marcus.webb@coastlandscape.com',
    accountName: PROJECT.customer.company.toUpperCase(),
    accountId: 'COAST',
    impersonating: false,
  }
}
