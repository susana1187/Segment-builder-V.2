import type { DragEndEvent } from '@dnd-kit/core'
import type { CanvasZoneKind, RuleValueChip, SegmentRow } from '../types/segment'
import type { CatalogLeaf } from '../types/catalog'
import type { SegmentAction } from './segmentReducer'

function catalogLeafToRow(leaf: CatalogLeaf): SegmentRow {
  const isAttribute = leaf.type.startsWith('attribute')
  const values: RuleValueChip[] | undefined = isAttribute
    ? [
        { id: `${leaf.id}-v1`, label: '2' },
        { id: `${leaf.id}-v2`, label: '3' },
        { id: `${leaf.id}-v3`, label: '4' },
      ]
    : undefined

  return {
    id: `row-${leaf.id}-${Date.now()}`,
    kind: 'row',
    rowKind: isAttribute ? 'attribute' : 'asset',
    sourceCatalogId: leaf.id,
    type: leaf.type,
    title: leaf.label,
    meta: leaf.meta,
    operator: isAttribute ? 'is equal to' : undefined,
    values,
  }
}

type DragData =
  | { type: 'catalog-item'; payload: CatalogLeaf }
  | { type: 'canvas-row'; rowId: string; sourceZone: CanvasZoneKind }
  | { type: 'canvas-group'; groupId: string; sourceZone: CanvasZoneKind }

// A drop target is either the zone body itself, a group's own accept-area (for folding a row
// into that specific group), or a top-level sortable row/group (hit when the pointer lands on
// an existing item rather than empty zone space) - all of which carry a `zone` field identifying
// which zone they belong to.
type DropData =
  | { type: 'zone'; zone: CanvasZoneKind }
  | { type: 'group'; groupId: string; zone: CanvasZoneKind }
  | { type: 'canvas-row'; rowId: string; zone: CanvasZoneKind }
  | { type: 'canvas-group'; groupId: string; zone: CanvasZoneKind }

export function resolveDrop(event: DragEndEvent, draftId: string): SegmentAction | null {
  const { active, over } = event
  if (!over) return null

  const dragData = active.data.current as DragData | undefined
  const dropData = over.data.current as DropData | undefined
  if (!dragData || !dropData) return null

  // Dropped directly on an existing group's card -> join it. Dropped directly on an existing
  // standalone row -> group with that specific row. Dropped on the zone's own dashed body (no
  // specific rule under the pointer) -> neither field is set, so insertRow adds a plain
  // standalone item instead of guessing at a group to join.
  const targetGroupId = dropData.type === 'group' || dropData.type === 'canvas-group' ? dropData.groupId : undefined
  const targetRowId = dropData.type === 'canvas-row' ? dropData.rowId : undefined
  const targetZone = dropData.zone

  if (dragData.type === 'catalog-item') {
    const row = catalogLeafToRow(dragData.payload)
    return { type: 'DROP_ITEM_IN_ZONE', draftId, zone: targetZone, row, targetGroupId, targetRowId }
  }

  if (dragData.type === 'canvas-group') {
    // Groups can't nest inside other groups, and a whole group can't wrap into a row-pair group.
    if (dropData.type === 'group' || dropData.type === 'canvas-group' || dropData.type === 'canvas-row') return null
    return { type: 'MOVE_GROUP', draftId, groupId: dragData.groupId, sourceZone: dragData.sourceZone, targetZone }
  }

  // Dropping a row onto its own droppable (no-op self-target) shouldn't wrap it with itself.
  if (dropData.type === 'canvas-row' && dropData.rowId === dragData.rowId) return null

  return {
    type: 'MOVE_ROW',
    draftId,
    rowId: dragData.rowId,
    sourceZone: dragData.sourceZone,
    targetZone,
    targetGroupId,
    targetRowId,
  }
}
