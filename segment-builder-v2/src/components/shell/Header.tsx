import Box from '@liveramp/motif/core/Box'
import IconButton from '@liveramp/motif/core/IconButton'
import Typography from '@liveramp/motif/core/Typography'
import { Notifications, HelpOutline, Person } from '@liveramp/icons'

export function Header() {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, py: 2.5 }}>
      <Typography sx={{ fontFamily: "'LiveRamp Sans', sans-serif", fontSize: 36, fontWeight: 500 }}>
        Segment Builder
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton size="small" aria-label="Notifications">
          <Notifications sx={{ fontSize: 20 }} />
        </IconButton>
        <IconButton size="small" aria-label="Help">
          <HelpOutline sx={{ fontSize: 20 }} />
        </IconButton>
        <IconButton size="small" aria-label="Account">
          <Person sx={{ fontSize: 20 }} />
        </IconButton>
      </Box>
    </Box>
  )
}
