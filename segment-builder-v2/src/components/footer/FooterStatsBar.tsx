import Box from '@liveramp/motif/core/Box'
import Button from '@liveramp/motif/core/Button'
import IconButton from '@liveramp/motif/core/IconButton'
import { Refresh } from '@liveramp/icons'
import { useActiveDraft } from '../../app/SegmentContext'
import { computeFooterStats } from '../../utils/stats'

function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Box sx={{ fontSize: 20, fontWeight: 700, lineHeight: 1 }}>{value}</Box>
      <Box sx={{ fontSize: 12, color: 'text.secondary', mt: 0.5 }}>{label}</Box>
    </Box>
  )
}

export function FooterStatsBar() {
  const draft = useActiveDraft()
  const stats = computeFooterStats(draft)

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        px: 3,
        py: 2,
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <IconButton size="small" aria-label="Refresh">
        <Refresh sx={{ fontSize: 18 }} />
      </IconButton>
      <Stat value={stats.size} label="Segment Size" />
      <Stat value={stats.segments} label="Segments" />
      <Stat value={stats.rules} label="Rules" />
      <Stat value={stats.datasets} label="Datasets" />
      <Stat value={stats.cpm} label="CPM Cost" />
      <Box sx={{ flexGrow: 1 }} />
      <Button variant="text">Save for Later</Button>
      <Button variant="contained" color="success">
        Build Segment
      </Button>
    </Box>
  )
}
