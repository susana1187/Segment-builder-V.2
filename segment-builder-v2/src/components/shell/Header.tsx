import Box from '@liveramp/motif/core/Box'
import IconButton from '@liveramp/motif/core/IconButton'
import { Notifications, HelpOutline, Person } from '@liveramp/icons'

export function Header() {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', px: 3, py: 0.25 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <IconButton size="small" aria-label="Notifications" sx={{ p: 0.5 }}>
          <Notifications sx={{ fontSize: 16 }} />
        </IconButton>
        <IconButton size="small" aria-label="Help" sx={{ p: 0.5 }}>
          <HelpOutline sx={{ fontSize: 16 }} />
        </IconButton>
        <IconButton size="small" aria-label="Account" sx={{ p: 0.5 }}>
          <Person sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>
    </Box>
  )
}
