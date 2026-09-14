import Box from '@liveramp/motif/core/Box'
import IconButton from '@liveramp/motif/core/IconButton'
import { Clear } from '@liveramp/icons'
import type { ReactNode } from 'react'

export function SidePanel({
  icon,
  title,
  headerBg,
  onClose,
  children,
}: {
  icon: ReactNode
  title: string
  headerBg?: string
  onClose: () => void
  children: ReactNode
}) {
  return (
    <Box
      sx={{
        width: 680,
        flexShrink: 0,
        bgcolor: 'background.paper',
        borderLeft: '1px solid',
        borderColor: 'divider',
        boxShadow: 3,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 5,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 3,
          py: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: headerBg,
          flexShrink: 0,
        }}
      >
        {icon}
        <Box sx={{ fontSize: 16, fontWeight: 700, flexGrow: 1 }}>{title}</Box>
        <IconButton size="small" aria-label="Close panel" onClick={onClose}>
          <Clear sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>
      <Box sx={{ flexGrow: 1, overflow: 'auto', minHeight: 0, pb: 12 }}>{children}</Box>
    </Box>
  )
}
