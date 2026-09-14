import { useState } from 'react'
import Box from '@liveramp/motif/core/Box'
import Menu, { MenuItem } from '@liveramp/motif/core/Menu'
import { ArrowDropDown } from '@liveramp/icons'

export function OperatorMenu({
  value,
  options,
  onChange,
}: {
  value: string
  options: string[]
  onChange: (value: string) => void
}) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  function select(option: string) {
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
          whiteSpace: 'nowrap',
          userSelect: 'none',
        }}
      >
        {value}
        <ArrowDropDown sx={{ fontSize: 18 }} />
      </Box>
      <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}>
        {options.map((option) => (
          <MenuItem key={option} selected={option === value} onClick={() => select(option)}>
            {option}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}
