import { useDroppable } from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
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

function TopLevelRow({ row, zone, onRemove }: { row: SegmentRow; zone: CanvasZoneKind; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging, isOver } = useSortable({
    id: row.id,
    data: { type: 'canvas-row', rowId: row.id, sourceZone: zone, zone },
  })

  return (
    <RuleRowContent
      row={row}
      onRemove={onRemove}
      containerRef={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      handleAttributes={attributes}
      handleListeners={listeners}
      isDragging={isDragging}
      isOver={isOver}
    />
  )
}

export function DropZone({ draft, zone }: { draft: SegmentDraft; zone: CanvasZoneKind }) {
  const { dispatch } = useSegment()
  const zoneData = draft[zone]
  const isEmpty = zoneData.items.length === 0
  const colors = ZONE_COLOR[zone]

  const { setNodeRef, isOver } = useDroppable({ id: `${zone}-zone`, data: { type: 'zone', zone } })

  return (
    <Box sx={{ mb: 3 }}>
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
        }}
      >
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
                <RuleGroupCard group={item} draftId={draft.id} zone={zone} />
              ) : (
                <TopLevelRow
                  row={item}
                  zone={zone}
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
