import type { Persona } from '@/data/sampleData'
import { PROJECT, PERSONA_META } from '@/data/sampleData'
import { contactForContractor } from '@/data/triageDetailData'

export type MessageAuthorSide = 'customer' | 'sales'

export interface ProjectMessage {
  id: string
  authorName: string
  authorSide: MessageAuthorSide
  authorRole: string
  body: string
  at: string
}

const THREADS: Record<string, ProjectMessage[]> = {
  '#AUT-26-89442': [
    {
      id: 'msg-garrett-1',
      authorName: 'Alicia Fenwick',
      authorSide: 'customer',
      authorRole: 'Bluegrass Irrigation · Estimator',
      body: 'Can you confirm zone count on the south lawn? Plans show 12 but the spec sheet says 14.',
      at: '2 days ago · 9:14 AM',
    },
    {
      id: 'msg-garrett-2',
      authorName: 'Jordan Lee',
      authorSide: 'sales',
      authorRole: 'Commercial Services',
      body: 'Good catch — we are counting 14 per Addendum 2. I will note it on the takeoff before quote release.',
      at: '2 days ago · 10:02 AM',
    },
    {
      id: 'msg-garrett-3',
      authorName: 'Colin Farrelly',
      authorSide: 'sales',
      authorRole: 'Territory Manager',
      body: 'Bluegrass and Wabash are both active on this job. Post here if you need TM coordination on bid date.',
      at: 'yesterday · 3:45 PM',
    },
  ],
  '#AUT-26-89414': [
    {
      id: 'msg-hpta-1',
      authorName: 'Owen Marsh',
      authorSide: 'customer',
      authorRole: 'Circle City Irrigation · Project Manager',
      body: 'We uploaded revised site plans this morning — can Commercial Services pick up the takeoff?',
      at: 'today · 8:30 AM',
    },
    {
      id: 'msg-hpta-2',
      authorName: 'Jordan Lee',
      authorSide: 'sales',
      authorRole: 'Commercial Services',
      body: 'Received — takeoff is in progress. Expect a draft quote for TM review by end of week.',
      at: 'today · 9:05 AM',
    },
  ],
  '#TED-2613042': [
    {
      id: 'msg-ted-1',
      authorName: 'Gabriel Torres',
      authorSide: 'customer',
      authorRole: 'Summit Roofing Partners · Estimating Manager',
      body: 'Taper design looks good. Can we get drain locations marked on sheet A-4.2 before you price?',
      at: '3 days ago · 11:20 AM',
    },
    {
      id: 'msg-ted-2',
      authorName: 'Morgan Reyes',
      authorSide: 'sales',
      authorRole: 'Commercial Designer',
      body: 'Updated layout posted — four drains per spec, 1/4" per ft to each. Link in Taper Design section.',
      at: '2 days ago · 2:15 PM',
    },
  ],
}

function defaultThread(contractorName: string): ProjectMessage[] {
  const contractor = contactForContractor(contractorName)
  const customerName = contractor?.name ?? PROJECT.customer.contact
  const customerRole = contractor ? `${contractorName} · ${contractor.title}` : PROJECT.customer.persona

  return [
    {
      id: `msg-default-1-${contractorName}`,
      authorName: customerName,
      authorSide: 'customer',
      authorRole: customerRole,
      body: 'Thanks for setting up the project — let us know when takeoff starts or if anything is missing from our upload.',
      at: '3 days ago · 4:10 PM',
    },
    {
      id: `msg-default-2-${contractorName}`,
      authorName: PROJECT.tm.name,
      authorSide: 'sales',
      authorRole: 'Territory Manager',
      body: 'You are all set. Commercial Services is on the takeoff — use this board for questions during estimating.',
      at: '3 days ago · 4:32 PM',
    },
  ]
}

export function seedMessagesForProject(projectNum: string, contractorName: string): ProjectMessage[] {
  return THREADS[projectNum] ?? defaultThread(contractorName)
}

export function authorForPersona(persona: Persona, contractorName: string): Pick<ProjectMessage, 'authorName' | 'authorSide' | 'authorRole'> {
  if (persona === 'customer') {
    const contractor = contactForContractor(contractorName)
    if (contractor) {
      return {
        authorName: contractor.name,
        authorSide: 'customer',
        authorRole: `${contractorName} · ${contractor.title}`,
      }
    }
    return {
      authorName: PROJECT.customer.contact,
      authorSide: 'customer',
      authorRole: PROJECT.customer.persona,
    }
  }

  const meta = PERSONA_META[persona]
  return {
    authorName: meta.name,
    authorSide: 'sales',
    authorRole: meta.sub,
  }
}
