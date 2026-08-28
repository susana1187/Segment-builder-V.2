import { useState } from 'react'
import { useDraggable } from '@dnd-kit/core'
import Box from '@liveramp/motif/core/Box'
import { ChevronRight, ExpandMore, DragIndicator } from '@liveramp/icons'
import type { CatalogLeaf, CatalogNode } from '../../types/catalog'
import { CatalogFolderIconComponent, CatalogLeafIcon } from './catalogIcons'

type HoverHandler = (leaf: CatalogLeaf | null) => void

function CatalogTreeItem({
  node,
  depth,
  defaultExpanded,
  onHoverLeaf,
}: {
  node: CatalogNode
  depth: number
  defaultExpanded?: boolean
  onHoverLeaf: HoverHandler
}) {
  const [expanded, setExpanded] = useState(!!defaultExpanded)

  if (node.kind === 'folder') {
    return (
      <Box>
        <Box
          onClick={() => setExpanded((e) => !e)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            pl: depth * 2 + 1,
            py: 0.75,
            cursor: 'pointer',
            '&:hover': { bgcolor: 'action.hover' },
          }}
        >
          {node.children.length > 0 ? (
            expanded ? <ExpandMore sx={{ fontSize: 18 }} /> : <ChevronRight sx={{ fontSize: 18 }} />
          ) : (
            <Box sx={{ width: 18 }} />
          )}
          <CatalogFolderIconComponent icon={node.icon} />
          <Box component="span" sx={{ fontSize: 14 }}>
            {node.label}
          </Box>
        </Box>
        {expanded &&
          node.children.map((child) => (
            <CatalogTreeItem key={child.id} node={child} depth={depth + 1} onHoverLeaf={onHoverLeaf} />
          ))}
      </Box>
    )
  }

  return <CatalogLeafRow node={node} depth={depth} onHoverLeaf={onHoverLeaf} />
}

function CatalogLeafRow({
  node,
  depth,
  onHoverLeaf,
}: {
  node: CatalogLeaf
  depth: number
  onHoverLeaf: HoverHandler
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: node.id,
    data: { type: 'catalog-item', payload: node },
  })

  return (
    <Box
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onMouseEnter={() => onHoverLeaf(node)}
      onMouseLeave={() => onHoverLeaf(null)}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        pl: depth * 2 + 1,
        py: 0.75,
        cursor: 'grab',
        opacity: isDragging ? 0.4 : 1,
        '&:hover': { bgcolor: 'action.hover' },
      }}
    >
      <DragIndicator sx={{ fontSize: 16, color: 'text.disabled' }} />
      <CatalogLeafIcon type={node.type} />
      <Box component="span" sx={{ fontSize: 14 }}>
        {node.label}
      </Box>
    </Box>
  )
}

export function CatalogTree({ nodes, onHoverLeaf }: { nodes: CatalogNode[]; onHoverLeaf: HoverHandler }) {
  return (
    <Box>
      {nodes.map((node, index) => (
        <CatalogTreeItem key={node.id} node={node} depth={0} defaultExpanded={index === 0} onHoverLeaf={onHoverLeaf} />
      ))}
    </Box>
  )
}
