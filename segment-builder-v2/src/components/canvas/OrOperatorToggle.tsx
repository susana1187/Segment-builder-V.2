import { useState } from 'react'
import Box from '@liveramp/motif/core/Box'
import Menu, { MenuItem } from '@liveramp/motif/core/Menu'
import { ArrowDropDown } from '@liveramp/icons'
import type { LogicOperator } from '../../types/segment'

const OPTIONS: LogicOperator[] = ['or', 'and']

export function OrOperatorToggle({ value, onChange }: { value: LogicOperator; onChange: (value: LogicOperator) => void }) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  function select(option: LogicOperator) {
    setAnchorEl(null)
    if (option !== value) onChange(option)
  }

  return (
    <>
      <Box
        onClick={(e: React.MouseEvent<HTMLElement>) => setAnchorEl(e.currentTarget)}
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
      <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}>
        {OPTIONS.map((option) => (
          <MenuItem key={option} selected={option === value} onClick={() => select(option)}>
            {option.toUpperCase()}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}
