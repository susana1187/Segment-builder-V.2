import Box from '@liveramp/motif/core/Box'
import IconButton from '@liveramp/motif/core/IconButton'
import Tooltip from '@liveramp/motif/core/Tooltip'
import { Add, AutoAwesome, Search, GridView, TableChart, Layers, Universe, DockLeft } from '@liveramp/icons'

const items = [
  { icon: Add, label: 'Create', highlight: true },
  { icon: AutoAwesome, label: 'AI Assistant' },
  { icon: Search, label: 'Search' },
  { icon: GridView, label: 'Apps' },
  { icon: TableChart, label: 'Datasets' },
  { icon: Layers, label: 'Stack' },
  { icon: Universe, label: 'Universe' },
  { icon: DockLeft, label: 'Panels' },
]

export function IconRail() {
  return (
    <Box
      sx={{
        width: 56,
        bgcolor: '#0a0a0a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: 2,
        gap: 1,
        flexShrink: 0,
      }}
    >
      <Box component="span" sx={{ color: '#fff', fontWeight: 700, fontSize: 20, mb: 2 }}>
        /L
      </Box>
      {items.map(({ icon: Icon, label, highlight }) => (
        <Tooltip key={label} title={label} placement="right">
          <IconButton
            size="small"
            aria-label={label}
            sx={{
              color: highlight ? '#2ecc71' : '#ffffff99',
              bgcolor: highlight ? '#1a2f22' : 'transparent',
              '&:hover': { color: '#fff' },
            }}
          >
            <Icon sx={{ fontSize: 20 }} />
          </IconButton>
        </Tooltip>
      ))}
    </Box>
  )
}
