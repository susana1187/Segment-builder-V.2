import { useState } from 'react'
import Box from '@liveramp/motif/core/Box'
import Chip from '@liveramp/motif/core/Chip'
import Typography from '@liveramp/motif/core/Typography'
import Divider from '@liveramp/motif/core/Divider'
import { ExpandMore, ExpandLess, ShoppingCart } from '@liveramp/icons'
import type { CatalogLeaf } from '../../types/catalog'
import { buildAssetDetails } from '../../utils/assetDetails'
import { CatalogLeafIcon } from './catalogIcons'

export function AssetInfoPanel({ leaf }: { leaf: CatalogLeaf }) {
  const [overviewOpen, setOverviewOpen] = useState(true)
  const details = buildAssetDetails(leaf)

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        width: 380,
        bgcolor: 'background.paper',
        borderLeft: '1px solid',
        borderRight: '1px solid',
        borderColor: 'divider',
        boxShadow: 3,
        overflow: 'auto',
        p: 3,
        zIndex: 5,
      }}
    >
      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start', mb: 2 }}>
        <Box sx={{ mt: 0.25 }}>
          <CatalogLeafIcon type={leaf.type} />
        </Box>
        <Typography sx={{ fontSize: 20, fontWeight: 600, lineHeight: 1.3 }}>
          {details.breadcrumb.join(' > ')}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
        {details.isMarketplace && (
          <Chip
            label="Marketplace"
            size="small"
            icon={<ShoppingCart sx={{ fontSize: 14 }} />}
            sx={{ bgcolor: '#dfeef7', color: '#2a6f96' }}
          />
        )}
        {details.isMarketplace && <Chip label="3P" size="small" sx={{ bgcolor: '#f4efd2', color: '#8a7418' }} />}
        {details.cpm && <Chip label={`CPM: ${details.cpm}`} size="small" sx={{ bgcolor: '#fbe4e0', color: '#a24a36' }} />}
        {leaf.meta?.size && <Chip label={`Size: ${leaf.meta.size}`} size="small" sx={{ bgcolor: '#e4f9ec', color: '#1a8f4e' }} />}
      </Box>

      <Typography sx={{ fontSize: 13, fontWeight: 700, color: 'text.secondary', mb: 1 }}>Description</Typography>
      <Typography sx={{ fontSize: 14, mb: 3 }}>{details.description}</Typography>

      <Typography sx={{ fontSize: 13, fontWeight: 700, color: 'text.secondary', mb: 1 }}>IAB Categories</Typography>
      {details.iabCategories.map((group, i) => (
        <Typography key={i} sx={{ fontSize: 14, mb: 1 }}>
          {group.join(' | ')}
        </Typography>
      ))}

      <Box sx={{ mt: 2 }}>
        <Box
          onClick={() => setOverviewOpen((o) => !o)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            bgcolor: 'action.hover',
            borderRadius: 1,
            px: 2,
            py: 1.25,
            cursor: 'pointer',
          }}
        >
          <Typography sx={{ fontSize: 15, fontWeight: 600 }}>Asset Overview</Typography>
          {overviewOpen ? <ExpandLess sx={{ fontSize: 20 }} /> : <ExpandMore sx={{ fontSize: 20 }} />}
        </Box>
        {overviewOpen && (
          <Box sx={{ px: 2 }}>
            {details.overview.map((row) => (
              <Box key={row.label}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1.25 }}>
                  <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>{row.label}</Typography>
                  <Typography sx={{ fontSize: 14, fontWeight: 500 }}>{row.value}</Typography>
                </Box>
                <Divider />
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  )
}
