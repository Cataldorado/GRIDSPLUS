import type { CompanyUser } from '@/data/customers'

export function isRostered(rosterOverrides: Record<string, boolean>, u: CompanyUser): boolean {
  return rosterOverrides[u.id] ?? u.defaultRostered
}

/**
 * Being on the company roster grants access to every one of that company's projects by default —
 * that's what "roster" means. A per-project override (grant or revoke) always wins over that default,
 * so a TM can hand a non-rostered user access to a single project, or pull a rostered user off just one.
 */
export function hasProjectAccess(
  rosterOverrides: Record<string, boolean>,
  projectAccessOverrides: Record<string, boolean>,
  projectNum: string,
  u: CompanyUser,
): boolean {
  const key = projectAccessKey(projectNum, u.id)
  if (Object.prototype.hasOwnProperty.call(projectAccessOverrides, key)) {
    return projectAccessOverrides[key]
  }
  return isRostered(rosterOverrides, u)
}

export function projectAccessKey(projectNum: string, userId: string): string {
  return `${projectNum}::${userId}`
}
