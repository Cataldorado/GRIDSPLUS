import { PROJECT } from '@/data/sampleData'
import { CONTRACTOR_PEOPLE, emailFor } from '@/data/triageDetailData'

export interface CompanyUser {
  id: string
  name: string
  title: string
  email: string
  phone: string
  defaultRostered: boolean
}

export interface Company {
  id: string
  name: string
  city: string
  users: CompanyUser[]
}

/** The customer persona's own login — unrostering them demonstrates real access consequences. */
export const PRIMARY_CUSTOMER_USER_ID = 'coast-landscape::marcus-webb'

function primaryUser(company: string, companyId: string): CompanyUser {
  const p = CONTRACTOR_PEOPLE[company]
  return {
    id: `${companyId}::primary`,
    name: `${p.first} ${p.last}`,
    title: p.title,
    email: emailFor(company, p.first, p.last),
    phone: p.phone,
    defaultRostered: true,
  }
}

const FILLER_FIRST_NAMES = [
  'Olivia', 'Liam', 'Ava', 'Noah', 'Emma', 'Ethan', 'Sophia', 'Mason', 'Isabella', 'Lucas',
  'Mia', 'Elijah', 'Charlotte', 'Grace', 'Amelia', 'Benjamin', 'Harper', 'Henry', 'Evelyn', 'Xander',
  'Abigail', 'Micah', 'Emily', 'Daniel', 'Elizabeth', 'Jacob', 'Sofia', 'Logan', 'Avery', 'Jackson',
]

const FILLER_LAST_NAMES = [
  'Nguyen', 'Patel', 'Kim', 'Garcia', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson',
  'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jensen', 'Martin', 'Lee', 'Perez', 'Thompson', 'White',
  'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King',
]

const FILLER_TITLES = [
  'Estimator', 'Project Coordinator', 'Office Manager', 'Field Supervisor', 'Bid Coordinator',
  'Accounts Payable', 'Purchasing Manager', 'Safety Coordinator', 'Operations Coordinator', 'Scheduler',
  'Junior Estimator', 'Contract Administrator', 'Warehouse Manager', 'Crew Foreman', 'Site Superintendent',
  'Business Development', 'Controller', 'Admin Assistant', 'Procurement Specialist', 'Equipment Manager',
]

/** Fills each company's roster out to a realistic size beyond its 1-3 named/seeded contacts. */
function generateRosterFillers(companyId: string, companyName: string, seededCount: number, target: number): CompanyUser[] {
  const filler: CompanyUser[] = []
  const need = Math.max(0, target - seededCount)
  for (let i = 0; i < need; i++) {
    const first = FILLER_FIRST_NAMES[i % FILLER_FIRST_NAMES.length]
    const last = FILLER_LAST_NAMES[(i * 7 + 3) % FILLER_LAST_NAMES.length]
    const title = FILLER_TITLES[(i * 3 + 1) % FILLER_TITLES.length]
    filler.push({
      id: `${companyId}::${first.toLowerCase()}-${last.toLowerCase()}`,
      name: `${first} ${last}`,
      title,
      email: emailFor(companyName, first, last),
      phone: `(${200 + companyId.length * 7}) 555-0${(300 + i).toString().padStart(3, '0')}`,
      defaultRostered: false,
    })
  }
  return filler
}

function withFillers(companyId: string, companyName: string, seeded: CompanyUser[]): CompanyUser[] {
  return [...seeded, ...generateRosterFillers(companyId, companyName, seeded.length, 22)]
}

export const COMPANIES: Company[] = [
  {
    id: 'coast-landscape',
    name: PROJECT.customer.company,
    city: 'Sacramento, CA',
    users: withFillers('coast-landscape', PROJECT.customer.company, [
      {
        id: PRIMARY_CUSTOMER_USER_ID,
        name: PROJECT.customer.contact,
        title: 'Owner / Estimator',
        email: 'marcus.webb@coastlandscape.com',
        phone: '(916) 555-0131',
        defaultRostered: true,
      },
      { id: 'coast-landscape::priya-shah', name: 'Priya Shah', title: 'Office Manager', email: 'priya.shah@coastlandscape.com', phone: '(916) 555-0147', defaultRostered: false },
      { id: 'coast-landscape::diego-ramirez', name: 'Diego Ramirez', title: 'Field Supervisor', email: 'diego.ramirez@coastlandscape.com', phone: '(916) 555-0163', defaultRostered: false },
    ]),
  },
  {
    id: 'ohio-valley-sitework',
    name: 'Ohio Valley Sitework',
    city: 'Louisville, KY',
    users: withFillers('ohio-valley-sitework', 'Ohio Valley Sitework', [
      primaryUser('Ohio Valley Sitework', 'ohio-valley-sitework'),
      { id: 'ohio-valley-sitework::trent-wysocki', name: 'Trent Wysocki', title: 'Junior Estimator', email: emailFor('Ohio Valley Sitework', 'Trent', 'Wysocki'), phone: '(502) 555-0198', defaultRostered: false },
    ]),
  },
  {
    id: 'front-range-turf',
    name: 'Front Range Turf',
    city: 'Denver, CO',
    users: withFillers('front-range-turf', 'Front Range Turf', [
      primaryUser('Front Range Turf', 'front-range-turf'),
      { id: 'front-range-turf::sophie-lund', name: 'Sophie Lund', title: 'Bid Coordinator', email: emailFor('Front Range Turf', 'Sophie', 'Lund'), phone: '(303) 555-0142', defaultRostered: false },
    ]),
  },
  {
    id: 'garden-state-irrigation',
    name: 'Garden State Irrigation',
    city: 'Lakewood, NJ',
    users: withFillers('garden-state-irrigation', 'Garden State Irrigation', [
      primaryUser('Garden State Irrigation', 'garden-state-irrigation'),
      { id: 'garden-state-irrigation::andre-philippe', name: 'Andre Philippe', title: 'Estimator', email: emailFor('Garden State Irrigation', 'Andre', 'Philippe'), phone: '(732) 555-0119', defaultRostered: false },
    ]),
  },
  {
    id: 'summit-roofing-partners',
    name: 'Summit Roofing Partners',
    city: 'Memphis, TN',
    users: withFillers('summit-roofing-partners', 'Summit Roofing Partners', [
      primaryUser('Summit Roofing Partners', 'summit-roofing-partners'),
      { id: 'summit-roofing-partners::monica-reyes', name: 'Monica Reyes', title: 'Project Coordinator', email: emailFor('Summit Roofing Partners', 'Monica', 'Reyes'), phone: '(901) 555-0147', defaultRostered: false },
    ]),
  },
  { id: 'gulf-coast-grounds', name: 'Gulf Coast Grounds', city: 'Tallahassee, FL', users: withFillers('gulf-coast-grounds', 'Gulf Coast Grounds', [primaryUser('Gulf Coast Grounds', 'gulf-coast-grounds')]) },
  { id: 'bluegrass-irrigation', name: 'Bluegrass Irrigation', city: 'Frankfort, KY', users: withFillers('bluegrass-irrigation', 'Bluegrass Irrigation', [primaryUser('Bluegrass Irrigation', 'bluegrass-irrigation')]) },
  { id: 'circle-city-irrigation', name: 'Circle City Irrigation', city: 'Indianapolis, IN', users: withFillers('circle-city-irrigation', 'Circle City Irrigation', [primaryUser('Circle City Irrigation', 'circle-city-irrigation')]) },
  { id: 'peachtree-grounds', name: 'Peachtree Grounds', city: 'Atlanta, GA', users: withFillers('peachtree-grounds', 'Peachtree Grounds', [primaryUser('Peachtree Grounds', 'peachtree-grounds')]) },
  { id: 'prairie-land-group', name: 'Prairie Land Group', city: 'Naperville, IL', users: withFillers('prairie-land-group', 'Prairie Land Group', [primaryUser('Prairie Land Group', 'prairie-land-group')]) },
  { id: 'wabash-valley-landscape', name: 'Wabash Valley Landscape', city: 'Vincennes, IN', users: withFillers('wabash-valley-landscape', 'Wabash Valley Landscape', [primaryUser('Wabash Valley Landscape', 'wabash-valley-landscape')]) },
  { id: 'brazos-site-services', name: 'Brazos Site Services', city: 'Kingwood, TX', users: withFillers('brazos-site-services', 'Brazos Site Services', [primaryUser('Brazos Site Services', 'brazos-site-services')]) },
  { id: 'twin-cities-green', name: 'Twin Cities Green LLC', city: 'Eden Prairie, MN', users: withFillers('twin-cities-green', 'Twin Cities Green LLC', [primaryUser('Twin Cities Green LLC', 'twin-cities-green')]) },
  { id: 'apex-commercial-roofing', name: 'Apex Commercial Roofing', city: 'Nashville, TN', users: withFillers('apex-commercial-roofing', 'Apex Commercial Roofing', [primaryUser('Apex Commercial Roofing', 'apex-commercial-roofing')]) },
]

export function companyForContractor(contractor: string): Company | null {
  return COMPANIES.find((c) => c.name === contractor) ?? null
}

export function slugify(s: string): string {
  return (
    s
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'company'
  )
}

/** Appends a numeric suffix if the base slug already collides with an existing company id. */
export function uniqueCompanyId(name: string, existingIds: string[]): string {
  const base = slugify(name)
  if (!existingIds.includes(base)) return base
  let i = 2
  while (existingIds.includes(`${base}-${i}`)) i++
  return `${base}-${i}`
}
