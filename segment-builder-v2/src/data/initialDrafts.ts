import type { SegmentDraft } from '../types/segment'

export function createEmptyDraft(id: string, label: string): SegmentDraft {
  return {
    id,
    name: '',
    label,
    include: { kind: 'include', items: [], operators: [] },
    exclude: { kind: 'exclude', items: [], operators: [] },
  }
}

export const initialDrafts: SegmentDraft[] = [createEmptyDraft('draft-1', 'Draft 1')]
