import { useMemo, useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import type { Persona } from '@/data/sampleData'
import {
  authorForPersona,
  seedMessagesForProject,
  type ProjectMessage,
} from '@/data/projectMessageBoard'
import { useAppStore } from '@/state/appStore'

interface Props {
  projectNum: string
  contractorName: string
  persona: Persona
  showBidderContext?: boolean
}

export function ProjectMessageBoard({ projectNum, contractorName, persona, showBidderContext }: Props) {
  const addedMessages = useAppStore((s) => s.projectMessageAdds[projectNum] ?? [])
  const postProjectMessage = useAppStore((s) => s.postProjectMessage)
  const [draft, setDraft] = useState('')

  const messages = useMemo(() => {
    const seed = seedMessagesForProject(projectNum, contractorName)
    return [...seed, ...addedMessages]
  }, [projectNum, contractorName, addedMessages])

  const handlePost = () => {
    const body = draft.trim()
    if (!body) return
    postProjectMessage(projectNum, body, persona, contractorName)
    setDraft('')
  }

  const postingAs = authorForPersona(persona, contractorName)

  return (
    <Card className="mt-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-400">Project message board</div>
          <p className="mt-1 text-[11px] text-slate-400">
            {showBidderContext
              ? 'Customer and Heritage sales team — visible to active bidder and TM.'
              : 'Customer and sales team communication on this project.'}
          </p>
        </div>
        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
          {messages.length} message{messages.length === 1 ? '' : 's'}
        </span>
      </div>

      <div className="mt-4 max-h-80 space-y-3 overflow-y-auto pr-1">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
      </div>

      <div className="mt-4 border-t border-slate-100 pt-4">
        <label className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
          Post as {postingAs.authorName}
        </label>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={3}
          placeholder="Ask a question or share an update with the project team…"
          className="mt-1.5 w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-grids-blue focus:outline-none focus:ring-1 focus:ring-grids-blue/30"
        />
        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="text-[11px] text-slate-400">
            {persona === 'customer' ? 'Visible to your TM and Commercial Services' : 'Visible to customer on this project'}
          </span>
          <Button variant="primary" onClick={handlePost} disabled={!draft.trim()}>
            Post message
          </Button>
        </div>
      </div>
    </Card>
  )
}

function MessageBubble({ message }: { message: ProjectMessage }) {
  const isSales = message.authorSide === 'sales'

  return (
    <div className={`flex gap-2.5 ${isSales ? 'flex-row-reverse' : ''}`}>
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
          isSales ? 'bg-grids-blue/15 text-grids-blue' : 'bg-slate-200 text-slate-600'
        }`}
        aria-hidden
      >
        {initials(message.authorName)}
      </div>
      <div className={`min-w-0 max-w-[85%] ${isSales ? 'text-right' : ''}`}>
        <div className={`flex flex-wrap items-baseline gap-x-2 gap-y-0.5 ${isSales ? 'justify-end' : ''}`}>
          <span className="text-sm font-semibold text-slate-800">{message.authorName}</span>
          <span className="text-[11px] text-slate-400">{message.authorRole}</span>
        </div>
        <div
          className={`mt-1 rounded-lg px-3 py-2 text-sm text-slate-700 ${
            isSales ? 'rounded-tr-sm bg-grids-blue/10 text-left' : 'rounded-tl-sm bg-slate-50'
          }`}
        >
          {message.body}
        </div>
        <div className={`mt-1 text-[10px] text-slate-400 ${isSales ? 'text-right' : ''}`}>{message.at}</div>
      </div>
    </div>
  )
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}
