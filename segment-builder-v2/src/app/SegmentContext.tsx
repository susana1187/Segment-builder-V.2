import { createContext, useContext, useReducer, type ReactNode } from 'react'
import { segmentReducer, type SegmentAction, type SegmentState } from './segmentReducer'
import { initialDrafts } from '../data/initialDrafts'

interface SegmentContextValue {
  state: SegmentState
  dispatch: React.Dispatch<SegmentAction>
}

const SegmentContext = createContext<SegmentContextValue | null>(null)

export function SegmentProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(segmentReducer, {
    drafts: initialDrafts,
    activeDraftId: initialDrafts[0].id,
  })

  return <SegmentContext.Provider value={{ state, dispatch }}>{children}</SegmentContext.Provider>
}

export function useSegment() {
  const ctx = useContext(SegmentContext)
  if (!ctx) throw new Error('useSegment must be used within SegmentProvider')
  return ctx
}

export function useActiveDraft() {
  const { state } = useSegment()
  const draft = state.drafts.find((d) => d.id === state.activeDraftId)
  if (!draft) throw new Error('Active draft not found')
  return draft
}
