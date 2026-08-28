import { useDraggable } from '@dnd-kit/core'
import Box from '@liveramp/motif/core/Box'
import Chip from '@liveramp/motif/core/Chip'
import IconButton from '@liveramp/motif/core/IconButton'
import { Clear, DragIndicator } from '@liveramp/icons'
import type { CanvasZoneKind, SegmentRow } from '../../types/segment'
import { CatalogLeafIcon } from '../catalog/catalogIcons'
import { AttributeValueChips } from './AttributeValueChips'

export function RuleRow({
  row,
  zone,
  onRemove,
  nested,
}: {
  row: SegmentRow
  zone: CanvasZoneKind
  onRemove: () => void
  nested?: boolean
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `canvas-row-${row.id}`,
    data: { type: 'canvas-row', rowId: row.id, sourceZone: zone },
  })

  return (
    <Box
      ref={setNodeRef}
      {...attributes}
      sx={{
        border: nested ? '1px solid' : 'none',
        borderColor: 'divider',
        borderRadius: 1,
        p: nested ? 1.5 : 0,
        opacity: isDragging ? 0.4 : 1,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box component="span" {...listeners} sx={{ display: 'flex', cursor: 'grab' }}>
          <DragIndicator sx={{ fontSize: 16, color: 'text.disabled' }} />
        </Box>
        <CatalogLeafIcon type={row.type} />
        <Box component="span" sx={{ fontWeight: 600, fontSize: 14 }}>
          {row.title}
        </Box>
        <AttributeValueChips operator={row.operator} values={row.values} />
        <Box sx={{ flexGrow: 1 }} />
        <IconButton size="small" aria-label="Remove" onClick={onRemove}>
          <Clear sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>
      {row.meta && (
        <Box sx={{ display: 'flex', gap: 0.75, mt: 0.75, pl: 4.5 }}>
          {row.meta.source && <Chip label={row.meta.source} size="small" />}
          {row.meta.segmented && <Chip label="Pre-segmented" size="small" />}
          {row.meta.size && <Chip label={`Size: ${row.meta.size}`} size="small" />}
        </Box>
      )}
    </Box>
  )
}
