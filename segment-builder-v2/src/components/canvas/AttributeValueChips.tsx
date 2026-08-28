import Box from '@liveramp/motif/core/Box'
import Chip from '@liveramp/motif/core/Chip'
import type { RuleValueChip } from '../../types/segment'

export function AttributeValueChips({ operator, values }: { operator?: string; values?: RuleValueChip[] }) {
  if (!operator || !values) return null
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, ml: 1 }}>
      <Box component="span" sx={{ fontSize: 13, color: 'text.secondary' }}>
        {operator}
      </Box>
      {values.map((v) => (
        <Chip key={v.id} label={v.label} size="small" />
      ))}
    </Box>
  )
}
