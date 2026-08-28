import Box from '@liveramp/motif/core/Box'
import { useActiveDraft } from '../../app/SegmentContext'
import { DropZone } from './DropZone'

export function CanvasArea() {
  const draft = useActiveDraft()
  return (
    <Box sx={{ flexGrow: 1, p: 3, overflow: 'auto', bgcolor: '#FAFAFA' }}>
      <DropZone draft={draft} zone="include" />
      <DropZone draft={draft} zone="exclude" />
    </Box>
  )
}
