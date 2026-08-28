import { useDroppable } from '@dnd-kit/core'
import Box from '@liveramp/motif/core/Box'
import Chip from '@liveramp/motif/core/Chip'
import type { CanvasZoneKind, SegmentDraft } from '../../types/segment'
import { useSegment } from '../../app/SegmentContext'
import { RuleGroupCard } from './RuleGroupCard'
import { RuleRow } from './RuleRow'
import { OrOperatorToggle } from './OrOperatorToggle'

const ZONE_COLOR: Record<CanvasZoneKind, { border: string; chipBg: string; chipColor: string }> = {
  include: { border: '#2ecc71', chipBg: '#e4f9ec', chipColor: '#1a8f4e' },
  exclude: { border: '#e05a5a', chipBg: '#fbeaea', chipColor: '#b83a3a' },
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
          border: isEmpty ? `1px dashed ${colors.border}` : '1px solid',
          borderColor: isEmpty ? colors.border : isOver ? 'primary.main' : 'divider',
          borderRadius: 1,
          p: isEmpty ? 0 : 2,
          minHeight: 56,
          bgcolor: isOver && isEmpty ? colors.chipBg : 'transparent',
        }}
      >
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
              <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 2 }}>
                <RuleRow
                  row={item}
                  zone={zone}
                  onRemove={() => dispatch({ type: 'REMOVE_ROW', draftId: draft.id, zone, rowId: item.id })}
                />
              </Box>
            )}
          </Box>
        ))}
        {zoneData.items.length > 0 && (
          <OrOperatorToggle
            value={zoneData.operators[zoneData.items.length - 1] ?? 'or'}
            onChange={(operator) =>
              zoneData.items.length > 1 &&
              dispatch({ type: 'SET_ZONE_OPERATOR', draftId: draft.id, zone, index: zoneData.items.length - 1, operator })
            }
          />
        )}
      </Box>
    </Box>
  )
}
