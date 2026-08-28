import Box from '@liveramp/motif/core/Box'
import { ArrowDropDown } from '@liveramp/icons'
import type { LogicOperator } from '../../types/segment'

export function OrOperatorToggle({ value, onToggle }: { value: LogicOperator; onToggle: () => void }) {
  return (
    <Box
      onClick={onToggle}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        cursor: 'pointer',
        color: 'text.secondary',
        fontSize: 13,
        fontWeight: 600,
        textTransform: 'uppercase',
        py: 1,
        userSelect: 'none',
      }}
    >
      {value}
      <ArrowDropDown sx={{ fontSize: 18 }} />
    </Box>
  )
}
