import {
  Segment,
  TableChart,
  Tag,
  CalendarToday,
  CheckBox,
  TextFields,
  Star,
  Build,
  Person,
  GNCleanRooms,
  ShoppingCart,
  Folder,
  Layers,
  DataSet,
} from '@liveramp/icons'
import Box from '@liveramp/motif/core/Box'
import type { CatalogFolderIcon, CatalogItemType } from '../../types/catalog'

export function CatalogLeafIcon({ type }: { type: CatalogItemType }) {
  const sx = { fontSize: 18, color: 'text.secondary' }
  switch (type) {
    case 'segment':
      return <Segment sx={sx} />
    case 'table':
      return <TableChart sx={sx} />
    case 'attribute-numeric':
      return <Tag sx={sx} />
    case 'attribute-date':
      return <CalendarToday sx={sx} />
    case 'attribute-boolean':
      return <CheckBox sx={sx} />
    case 'attribute-text':
      return <TextFields sx={sx} />
  }
}

export function CatalogFolderIconComponent({ icon }: { icon: CatalogFolderIcon }) {
  const sx = { fontSize: 18, color: 'text.secondary' }
  switch (icon) {
    case 'star':
      return <Star sx={sx} />
    case 'wrench':
      return <Build sx={sx} />
    case 'person':
      return <Person sx={sx} />
    case 'cleanroom':
      return (
        <Box component="span" sx={{ display: 'inline-flex', color: 'text.secondary' }}>
          <GNCleanRooms size={18} isMonochrome />
        </Box>
      )
    case 'cart':
      return <ShoppingCart sx={sx} />
    case 'stack':
      return <Layers sx={sx} />
    case 'table':
      return <TableChart sx={sx} />
    case 'dataset':
      return <DataSet sx={sx} />
    case 'folder':
    default:
      return <Folder sx={sx} />
  }
}
