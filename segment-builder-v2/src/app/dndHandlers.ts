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

type DropData = { type: 'zone'; zone: CanvasZoneKind } | { type: 'group'; groupId: string; zone: CanvasZoneKind }

export function resolveDrop(event: DragEndEvent, draftId: string): SegmentAction | null {
  const { active, over } = event
  if (!over) return null

  const dragData = active.data.current as DragData | undefined
  const dropData = over.data.current as DropData | undefined
  if (!dragData || !dropData) return null

  const targetGroupId = dropData.type === 'group' ? dropData.groupId : undefined

  if (dragData.type === 'catalog-item') {
    const row = catalogLeafToRow(dragData.payload)
    return { type: 'DROP_ITEM_IN_ZONE', draftId, zone: dropData.zone, row, targetGroupId }
  }

  return {
    type: 'MOVE_ROW',
    draftId,
    rowId: dragData.rowId,
    sourceZone: dragData.sourceZone,
    targetZone: dropData.zone,
    targetGroupId,
  }
}
