import { useDroppable } from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import Box from '@liveramp/motif/core/Box'
import Chip from '@liveramp/motif/core/Chip'
import type { CanvasZoneKind, SegmentDraft, SegmentRow } from '../../types/segment'
import { useSegment } from '../../app/SegmentContext'
import { RuleGroupCard } from './RuleGroupCard'
import { RuleRowContent } from './RuleRow'
import { OrOperatorToggle } from './OrOperatorToggle'

const ZONE_COLOR: Record<CanvasZoneKind, { border: string; chipBg: string; chipColor: string }> = {
  include: { border: '#2ecc71', chipBg: '#e4f9ec', chipColor: '#1a8f4e' },
  exclude: { border: '#e05a5a', chipBg: '#fbeaea', chipColor: '#b83a3a' },
}

function TopLevelRow({
  row,
  zone,
  disabled,
  onRemove,
}: {
  row: SegmentRow
  zone: CanvasZoneKind
  disabled?: boolean
  onRemove: () => void
}) {
  // No self-transform here: a DragOverlay ghost already follows the pointer for this drag, so
  // applying useSortable's own transform to the original element too would move both at once.
  const { attributes, listeners, setNodeRef, isDragging, isOver } = useSortable({
    id: row.id,
    data: { type: 'canvas-row', rowId: row.id, sourceZone: zone, zone },
    disabled: disabled ? { droppable: true } : undefined,
  })

  return (
    <RuleRowContent
      row={row}
      onRemove={onRemove}
      containerRef={setNodeRef}
      handleAttributes={attributes}
      handleListeners={listeners}
      isDragging={isDragging}
      isOver={isOver}
    />
  )
}

export function DropZone({ draft, zone, disabled }: { draft: SegmentDraft; zone: CanvasZoneKind; disabled?: boolean }) {
  const { dispatch } = useSegment()
  const zoneData = draft[zone]
  const isEmpty = zoneData.items.length === 0
  const colors = ZONE_COLOR[zone]

  const { setNodeRef, isOver } = useDroppable({ id: `${zone}-zone`, data: { type: 'zone', zone }, disabled })

  return (
    <Box sx={{ mb: 3, opacity: disabled ? 0.5 : 1 }}>
      <Chip
        label={zone === 'include' ? 'Include' : 'Exclude'}
        size="small"
        sx={{ mb: 1, bgcolor: colors.chipBg, color: colors.chipColor, fontWeight: 600 }}
      />
      <Box
        ref={setNodeRef}
        sx={{
          border: '1px dashed',
          borderColor: isOver ? 'primary.main' : colors.border,
          borderRadius: 1,
          p: isEmpty ? 0 : 2,
          minHeight: 56,
          bgcolor: isOver ? colors.chipBg : 'transparent',
          cursor: disabled ? 'not-allowed' : undefined,
        }}
      >
        {disabled && isEmpty && (
          <Box sx={{ px: 2, py: 2, fontSize: 13, color: 'text.secondary' }}>Add an Include rule first</Box>
        )}
        <SortableContext items={zoneData.items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
          {zoneData.items.map((item, index) => (
            <Box key={item.id}>
              {index > 0 && (
                <OrOperatorToggle
                  value={zoneData.operators[index - 1]}
                  onChange={(operator) => dispatch({ type: 'SET_ZONE_OPERATOR', draftId: draft.id, zone, index: index - 1, operator })}
                />
              )}
              {item.kind === 'group' ? (
                <RuleGroupCard group={item} draftId={draft.id} zone={zone} disabled={disabled} />
              ) : (
                <TopLevelRow
                  row={item}
                  zone={zone}
                  disabled={disabled}
                  onRemove={() => dispatch({ type: 'REMOVE_ROW', draftId: draft.id, zone, rowId: item.id })}
                />
              )}
            </Box>
          ))}
        </SortableContext>
        {zoneData.items.length > 1 && (
          <OrOperatorToggle
            value={zoneData.operators[zoneData.items.length - 1] ?? 'or'}
            onChange={(operator) =>
              dispatch({ type: 'SET_ZONE_OPERATOR', draftId: draft.id, zone, index: zoneData.items.length - 1, operator })
            }
          />
        )}
      </Box>
    </Box>
  )
}
