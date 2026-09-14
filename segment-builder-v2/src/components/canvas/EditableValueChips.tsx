import { useState } from 'react'
import Box from '@liveramp/motif/core/Box'
import { Add, Clear } from '@liveramp/icons'
import type { RuleValueChip } from '../../types/segment'

let chipCounter = 0
function newChipId() {
  chipCounter += 1
  return `val-${Date.now()}-${chipCounter}`
}

function EditableChip({
  chip,
  onCommit,
  onRemove,
}: {
  chip: RuleValueChip
  onCommit: (label: string) => void
  onRemove: () => void
}) {
  const [editing, setEditing] = useState(chip.label === '')
  const [value, setValue] = useState(chip.label)

  function commit() {
    setEditing(false)
    const trimmed = value.trim()
    if (trimmed) onCommit(trimmed)
    else onRemove()
  }

  if (editing) {
    return (
      <Box
        component="input"
        autoFocus
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
        onBlur={commit}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === 'Enter') commit()
          if (e.key === 'Escape') {
            if (chip.label === '') onRemove()
            else {
              setValue(chip.label)
              setEditing(false)
            }
          }
        }}
        sx={{
          font: 'inherit',
          fontSize: 11,
          border: '1px solid',
          borderColor: 'primary.main',
          borderRadius: 1,
          width: Math.max(32, value.length * 7 + 12),
          height: 20,
          px: 0.75,
          outline: 'none',
        }}
      />
    )
  }

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        height: 20,
        fontSize: 11,
        pl: 0.75,
        pr: 0.5,
        borderRadius: 10,
        bgcolor: 'action.selected',
        userSelect: 'none',
      }}
    >
      <Box component="span" onClick={() => setEditing(true)} sx={{ cursor: 'pointer', mr: 0.5 }}>
        {chip.label}
      </Box>
      <Box
        component="span"
        aria-label="Remove value"
        onClick={onRemove}
        sx={{ display: 'flex', cursor: 'pointer', color: 'text.disabled' }}
      >
        <Clear sx={{ fontSize: 12 }} />
      </Box>
    </Box>
  )
}

export function EditableValueChips({ values, onChange }: { values: RuleValueChip[]; onChange: (values: RuleValueChip[]) => void }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
      {values.map((chip) => (
        <EditableChip
          key={chip.id}
          chip={chip}
          onCommit={(label) => onChange(values.map((v) => (v.id === chip.id ? { ...v, label } : v)))}
          onRemove={() => onChange(values.filter((v) => v.id !== chip.id))}
        />
      ))}
      <Box
        component="span"
        aria-label="Add value"
        onClick={() => onChange([...values, { id: newChipId(), label: '' }])}
        sx={{ display: 'flex', cursor: 'pointer', color: 'text.disabled' }}
      >
        <Add sx={{ fontSize: 16 }} />
      </Box>
    </Box>
  )
}
