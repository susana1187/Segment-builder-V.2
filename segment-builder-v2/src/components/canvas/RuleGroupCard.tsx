import { useDroppable } from '@dnd-kit/core'
import Box from '@liveramp/motif/core/Box'
import IconButton from '@liveramp/motif/core/IconButton'
import { Clear } from '@liveramp/icons'
import type { CanvasZoneKind, SegmentGroup } from '../../types/segment'
import { useSegment } from '../../app/SegmentContext'
import { RuleRow } from './RuleRow'
import { OrOperatorToggle } from './OrOperatorToggle'

export function RuleGroupCard({ group, draftId, zone }: { group: SegmentGroup; draftId: string; zone: CanvasZoneKind }) {
  const { dispatch } = useSegment()
  const { setNodeRef, isOver } = useDroppable({ id: `group-${group.id}`, data: { type: 'group', groupId: group.id, zone } })

  return (
    <Box
      ref={setNodeRef}
      sx={{
        border: '1px solid',
        borderColor: isOver ? 'primary.main' : 'divider',
        borderRadius: 1,
        p: 2,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
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
      <OrOperatorToggle
        value={group.operators[group.operators.length - 1] ?? 'or'}
        onChange={(operator) =>
          dispatch({ type: 'SET_GROUP_OPERATOR', draftId, zone, groupId: group.id, index: group.operators.length - 1, operator })
        }
      />
    </Box>
  )
}
