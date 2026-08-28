import type { CanvasZone, CanvasZoneKind, LogicOperator, SegmentDraft, SegmentRow } from '../types/segment'
import { createEmptyDraft } from '../data/initialDrafts'

function insertRow(zone: CanvasZone, row: SegmentRow, targetGroupId?: string): CanvasZone {
  const items = [...zone.items]
  const operators = [...zone.operators]

  // Drop directly onto an existing group -> append as a child row.
  if (targetGroupId) {
    const groupIndex = items.findIndex((i) => i.kind === 'group' && i.id === targetGroupId)
    if (groupIndex !== -1) {
      const group = items[groupIndex]
      if (group.kind === 'group') {
        const newGroup = { ...group, children: [...group.children, row], operators: [...group.operators, 'or' as const] }
        const newItems = [...items]
        newItems[groupIndex] = newGroup
        return { ...zone, items: newItems }
      }
    }
  }

  // Empty zone -> single row.
  if (items.length === 0) {
    return { ...zone, items: [row], operators: [] }
  }

  // Exactly one ungrouped row already -> wrap both into a new group.
  if (items.length === 1 && items[0].kind === 'row') {
    const group = { id: `group-${Date.now()}`, kind: 'group' as const, children: [items[0], row], operators: ['or' as const] }
    return { ...zone, items: [group], operators: [] }
  }

  // Dropped on the zone itself (not a specific group) -> add as its own new top-level rule,
  // joined to whatever's already there, rather than folding into an existing group.
  items.push(row)
  operators.push('or')
  return { ...zone, items, operators }
}

function removeRow(zone: CanvasZone, rowId: string): { zone: CanvasZone; removed: SegmentRow | null } {
  let removed: SegmentRow | null = null
  const items = []

  for (const item of zone.items) {
    if (item.kind === 'row') {
      if (item.id === rowId) {
        removed = item
        continue
      }
      items.push(item)
      continue
    }

    const children = item.children.filter((r) => {
      if (r.id === rowId) {
        removed = r
        return false
      }
      return true
    })
    if (children.length === 0) continue
    // A group with exactly one child left unwraps back into a standalone row.
    if (children.length === 1) {
      items.push(children[0])
      continue
    }
    items.push({ ...item, children, operators: children.slice(1).map(() => 'or' as const) })
  }

  return { zone: { ...zone, items }, removed }
}

export interface SegmentState {
  drafts: SegmentDraft[]
  activeDraftId: string
}

export type SegmentAction =
  | { type: 'SET_SEGMENT_NAME'; draftId: string; name: string }
  | { type: 'RENAME_DRAFT'; draftId: string; label: string }
  | { type: 'SET_ACTIVE_DRAFT'; draftId: string }
  | { type: 'ADD_DRAFT' }
  | { type: 'DUPLICATE_DRAFT'; draftId: string }
  | { type: 'CLOSE_DRAFT'; draftId: string }
  | { type: 'DROP_ITEM_IN_ZONE'; draftId: string; zone: CanvasZoneKind; row: SegmentRow; targetGroupId?: string }
  | {
      type: 'MOVE_ROW'
      draftId: string
      rowId: string
      sourceZone: CanvasZoneKind
      targetZone: CanvasZoneKind
      targetGroupId?: string
    }
  | { type: 'REMOVE_ROW'; draftId: string; zone: CanvasZoneKind; rowId: string }
  | { type: 'REMOVE_GROUP'; draftId: string; zone: CanvasZoneKind; groupId: string }
  | { type: 'SET_ZONE_OPERATOR'; draftId: string; zone: CanvasZoneKind; index: number; operator: LogicOperator }
  | {
      type: 'SET_GROUP_OPERATOR'
      draftId: string
      zone: CanvasZoneKind
      groupId: string
      index: number
      operator: LogicOperator
    }

function mapDraft(state: SegmentState, draftId: string, fn: (d: SegmentDraft) => SegmentDraft): SegmentState {
  return { ...state, drafts: state.drafts.map((d) => (d.id === draftId ? fn(d) : d)) }
}

export function segmentReducer(state: SegmentState, action: SegmentAction): SegmentState {
  switch (action.type) {
    case 'SET_SEGMENT_NAME':
      return mapDraft(state, action.draftId, (d) => ({ ...d, name: action.name }))

    case 'RENAME_DRAFT':
      return mapDraft(state, action.draftId, (d) => ({ ...d, label: action.label }))

    case 'SET_ACTIVE_DRAFT':
      return { ...state, activeDraftId: action.draftId }

    case 'ADD_DRAFT': {
      const id = `draft-${state.drafts.length + 1}-${Date.now()}`
      const draft = createEmptyDraft(id, `Draft ${state.drafts.length + 1}`)
      return { drafts: [...state.drafts, draft], activeDraftId: id }
    }

    case 'DUPLICATE_DRAFT': {
      const source = state.drafts.find((d) => d.id === action.draftId)
      if (!source) return state
      const id = `draft-copy-${Date.now()}`
      const clone: SegmentDraft = {
        ...JSON.parse(JSON.stringify(source)),
        id,
        label: `${source.label} Copy`,
      }
      return { drafts: [...state.drafts, clone], activeDraftId: id }
    }

    case 'CLOSE_DRAFT': {
      if (state.drafts.length <= 1) return state
      const drafts = state.drafts.filter((d) => d.id !== action.draftId)
      const activeDraftId =
        state.activeDraftId === action.draftId ? drafts[drafts.length - 1].id : state.activeDraftId
      return { drafts, activeDraftId }
    }

    case 'DROP_ITEM_IN_ZONE': {
      return mapDraft(state, action.draftId, (draft) => ({
        ...draft,
        [action.zone]: insertRow(draft[action.zone], action.row, action.targetGroupId),
      }))
    }

    case 'MOVE_ROW': {
      return mapDraft(state, action.draftId, (draft) => {
        const { zone: sourceZoneAfterRemoval, removed } = removeRow(draft[action.sourceZone], action.rowId)
        if (!removed) return draft

        const updated: SegmentDraft = { ...draft, [action.sourceZone]: sourceZoneAfterRemoval }
        const targetZoneData = action.targetZone === action.sourceZone ? sourceZoneAfterRemoval : draft[action.targetZone]
        const newTargetZone = insertRow(targetZoneData, removed, action.targetGroupId)
        return { ...updated, [action.targetZone]: newTargetZone }
      })
    }

    case 'REMOVE_ROW': {
      return mapDraft(state, action.draftId, (draft) => ({
        ...draft,
        [action.zone]: removeRow(draft[action.zone], action.rowId).zone,
      }))
    }

    case 'REMOVE_GROUP': {
      return mapDraft(state, action.draftId, (draft) => {
        const zone = draft[action.zone]
        const items = zone.items.filter((i) => i.id !== action.groupId)
        return { ...draft, [action.zone]: { ...zone, items } }
      })
    }

    case 'SET_ZONE_OPERATOR': {
      return mapDraft(state, action.draftId, (draft) => {
        const zone = draft[action.zone]
        const operators = [...zone.operators]
        operators[action.index] = action.operator
        return { ...draft, [action.zone]: { ...zone, operators } }
      })
    }

    case 'SET_GROUP_OPERATOR': {
      return mapDraft(state, action.draftId, (draft) => {
        const zone = draft[action.zone]
        const items = zone.items.map((item) => {
          if (item.kind !== 'group' || item.id !== action.groupId) return item
          const operators = [...item.operators]
          operators[action.index] = action.operator
          return { ...item, operators }
        })
        return { ...draft, [action.zone]: { ...zone, items } }
      })
    }

    default:
      return state
  }
}
