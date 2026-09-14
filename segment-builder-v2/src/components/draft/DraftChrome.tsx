import { useState } from 'react'
import Box from '@liveramp/motif/core/Box'
import Tabs from '@liveramp/motif/core/Tabs'
import Tab from '@liveramp/motif/core/Tab'
import Button from '@liveramp/motif/core/Button'
import { AutoAwesome, Add, BarChart, Clear } from '@liveramp/icons'
import { useActiveDraft, useSegment } from '../../app/SegmentContext'
import type { SegmentDraft } from '../../types/segment'

function DraftTabLabel({ draft, closable }: { draft: SegmentDraft; closable: boolean }) {
  const { dispatch } = useSegment()
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(draft.label)

  function commit() {
    setEditing(false)
    const label = value.trim()
    if (label && label !== draft.label) {
      dispatch({ type: 'RENAME_DRAFT', draftId: draft.id, label })
    } else {
      setValue(draft.label)
    }
  }

  if (editing) {
    return (
      <Box
        component="input"
        autoFocus
        value={value}
        onFocus={(e: React.FocusEvent<HTMLInputElement>) => e.target.select()}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
        onBlur={commit}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === 'Enter') commit()
          if (e.key === 'Escape') {
            setValue(draft.label)
            setEditing(false)
          }
        }}
        sx={{
          font: 'inherit',
          border: 'none',
          borderBottom: '1px solid',
          borderColor: 'divider',
          outline: 'none',
          width: Math.max(60, value.length * 8),
          bgcolor: 'transparent',
        }}
      />
    )
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <span
        onDoubleClick={(e) => {
          e.stopPropagation()
          setEditing(true)
        }}
      >
        {draft.label}
      </span>
      {closable && (
        <Box
          component="span"
          role="button"
          aria-label={`Close ${draft.label}`}
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation()
            dispatch({ type: 'CLOSE_DRAFT', draftId: draft.id })
          }}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            borderRadius: '50%',
            p: 0.25,
            '&:hover': { bgcolor: 'action.hover' },
          }}
        >
          <Clear sx={{ fontSize: 14 }} />
        </Box>
      )}
    </Box>
  )
}

export function DraftTabs() {
  const { state, dispatch } = useSegment()

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Tabs
        value={state.activeDraftId}
        onChange={(_, value) => dispatch({ type: 'SET_ACTIVE_DRAFT', draftId: value })}
      >
        {state.drafts.map((draft) => (
          <Tab
            key={draft.id}
            value={draft.id}
            label={<DraftTabLabel draft={draft} closable={state.drafts.length > 1} />}
          />
        ))}
      </Tabs>
      <Button
        variant="text"
        size="small"
        startIcon={<Add sx={{ fontSize: 16 }} />}
        onClick={() => dispatch({ type: 'DUPLICATE_DRAFT', draftId: state.activeDraftId })}
      >
        Duplicate Draft
      </Button>
    </Box>
  )
}

export function DraftDetailsButton({ active, onClick }: { active?: boolean; onClick?: () => void }) {
  const draft = useActiveDraft()
  const hasContent = draft.include.items.length > 0 || draft.exclude.items.length > 0

  return (
    <Button
      variant={active ? 'contained' : 'outlined'}
      size="small"
      disabled={!hasContent}
      startIcon={<BarChart sx={{ fontSize: 16 }} />}
      onClick={onClick}
      sx={active ? { bgcolor: '#e4f9ec', color: '#1a8f4e', border: 'none', boxShadow: 'none', '&:hover': { bgcolor: '#d3f2df', border: 'none', boxShadow: 'none' } } : undefined}
    >
      Draft Segment Details
    </Button>
  )
}

export function AskAgentButton({ active, onClick }: { active?: boolean; onClick?: () => void }) {
  return (
    <Button
      variant="contained"
      size="small"
      startIcon={<AutoAwesome sx={{ fontSize: 16 }} />}
      onClick={onClick}
      sx={{
        bgcolor: active ? '#ddd2f7' : '#ede7fb',
        color: '#4a2f9c',
        border: 'none',
        boxShadow: 'none',
        '&:hover': { bgcolor: '#ddd2f7', border: 'none', boxShadow: 'none' },
      }}
    >
      Ask Agent
    </Button>
  )
}
