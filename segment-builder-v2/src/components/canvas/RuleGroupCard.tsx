import { useDroppable } from '@dnd-kit/core'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import Box from '@liveramp/motif/core/Box'
import IconButton from '@liveramp/motif/core/IconButton'
import { Clear, DragIndicator } from '@liveramp/icons'
import type { CanvasZoneKind, SegmentGroup } from '../../types/segment'
import { useSegment } from '../../app/SegmentContext'
import { RuleRow } from './RuleRow'
import { OrOperatorToggle } from './OrOperatorToggle'

export function RuleGroupCard({ group, draftId, zone }: { group: SegmentGroup; draftId: string; zone: CanvasZoneKind }) {
  const { dispatch } = useSegment()
  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: group.id, data: { type: 'canvas-group', groupId: group.id, sourceZone: zone, zone } })
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: `group-${group.id}`,
    data: { type: 'group', groupId: group.id, zone },
    disabled: isDragging,
  })

  return (
    <Box
      ref={setSortableRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      sx={{ opacity: isDragging ? 0.4 : 1 }}
    >
      <Box
        ref={setDroppableRef}
        sx={{
          border: '1px solid',
          borderColor: isOver ? 'primary.main' : 'divider',
          borderRadius: 1,
          p: 2,
          bgcolor: 'background.paper',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Box component="span" {...attributes} {...listeners} sx={{ display: 'flex', cursor: 'grab', mr: 1 }}>
            <DragIndicator sx={{ fontSize: 16, color: 'text.disabled' }} />
          </Box>
          <Box component="span" sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary', letterSpacing: 0.5 }}>
            RULE GROUP
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton size="small" aria-label="Remove group" onClick={() => dispatch({ type: 'REMOVE_GROUP', draftId, zone, groupId: group.id })}>
            <Clear sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>

        {group.children.map((row, index) => (
          <Box key={row.id}>
            {index > 0 && (
              <OrOperatorToggle
                value={group.operators[index - 1]}
                onChange={(operator) => dispatch({ type: 'SET_GROUP_OPERATOR', draftId, zone, groupId: group.id, index: index - 1, operator })}
              />
            )}
            <RuleRow
              row={row}
              zone={zone}
              nested
              onRemove={() => dispatch({ type: 'REMOVE_ROW', draftId, zone, rowId: row.id })}
            />
          </Box>
        ))}
        {group.children.length > 1 && (
          <OrOperatorToggle
            value={group.operators[group.operators.length - 1] ?? 'or'}
            onChange={(operator) =>
              dispatch({ type: 'SET_GROUP_OPERATOR', draftId, zone, groupId: group.id, index: group.operators.length - 1, operator })
            }
          />
        )}
      </Box>
    </Box>
  )
}
