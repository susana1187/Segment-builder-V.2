import { useEffect, useRef, useState } from 'react'
import Box from '@liveramp/motif/core/Box'
import Select from '@liveramp/motif/core/Select'
import { catalogTree } from '../../data/catalogTree'
import { findCatalogLeaf } from '../../utils/catalogRow'
import { CatalogFolderIconComponent, CatalogLeafIcon } from '../catalog/catalogIcons'
import type { CatalogLeaf, CatalogNode } from '../../types/catalog'

interface TreeNode {
  id: string
  name: string
  children?: TreeNode[]
  icon?: React.ReactNode
}

function toTreeNode(node: CatalogNode): TreeNode {
  return node.kind === 'leaf'
    ? { id: node.id, name: node.label, icon: <CatalogLeafIcon type={node.type} /> }
    : { id: node.id, name: node.label, icon: <CatalogFolderIconComponent icon={node.icon} />, children: node.children.map(toTreeNode) }
}

const TREE_DATA: TreeNode[] = catalogTree.map(toTreeNode)

export function RuleAssetPicker({
  title,
  onSelect,
}: {
  title: string
  currentId: string
  onSelect: (leaf: CatalogLeaf) => void
}) {
  const [editing, setEditing] = useState(false)
  const wasInsideTreeRef = useRef(false)

  // MUI's Autocomplete fires onClose for internal tree navigation too (expanding/collapsing a
  // folder), not just genuine dismissal, and by the time onClose fires the popup's DOM may
  // already be gone - so a pointerdown capture listener records whether the interaction started
  // inside the tree *before* anything unmounts, and onClose consults that instead of the (by
  // then possibly stale) DOM.
  useEffect(() => {
    if (!editing) return
    function handlePointerDown(ev: PointerEvent) {
      const target = ev.target as Node | null
      const treeView = document.querySelector('[data-testid="treeView"]')
      wasInsideTreeRef.current = !!(treeView && target && treeView.contains(target))
    }
    document.addEventListener('pointerdown', handlePointerDown, true)
    return () => document.removeEventListener('pointerdown', handlePointerDown, true)
  }, [editing])

  if (!editing) {
    return (
      <Box
        component="span"
        onClick={() => setEditing(true)}
        sx={{
          fontWeight: 600,
          fontSize: 14,
          cursor: 'pointer',
          '&:hover': { textDecoration: 'underline' },
        }}
      >
        {title}
      </Box>
    )
  }

  return (
    <Box sx={{ flexShrink: 0 }} onClick={(e: React.MouseEvent) => e.stopPropagation()}>
      <Select
        size="small"
        autoFocus
        openOnFocus
        options={[]}
        treeData={TREE_DATA}
        sx={{ width: 304 }}
        getOptionLabel={(node: TreeNode) => node.name}
        value={null}
        placeholder="Search assets"
        onChange={(_e: React.SyntheticEvent, value: unknown) => {
          const node = value as TreeNode | null
          // Branch nodes (folders) are just navigation - only a leaf pick should commit and close.
          if (!node || node.children) return
          const leaf = findCatalogLeaf(catalogTree, node.id)
          if (leaf) onSelect(leaf)
          setEditing(false)
        }}
        onClose={() => {
          if (wasInsideTreeRef.current) return
          setEditing(false)
        }}
      />
    </Box>
  )
}
