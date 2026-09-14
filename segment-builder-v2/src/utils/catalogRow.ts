import type { CatalogLeaf, CatalogNode } from '../types/catalog'
import type { RuleValueChip } from '../types/segment'

export function flattenCatalogLeaves(nodes: CatalogNode[]): CatalogLeaf[] {
  const leaves: CatalogLeaf[] = []
  for (const node of nodes) {
    if (node.kind === 'leaf') leaves.push(node)
    else leaves.push(...flattenCatalogLeaves(node.children))
  }
  return leaves
}

export function findCatalogLeaf(nodes: CatalogNode[], id: string): CatalogLeaf | null {
  for (const node of nodes) {
    if (node.kind === 'leaf') {
      if (node.id === id) return node
    } else {
      const found = findCatalogLeaf(node.children, id)
      if (found) return found
    }
  }
  return null
}

// Seed sensible per-type defaults for a rule that just started referencing this catalog asset
// (either freshly dropped, or swapped via the rule's own asset picker); the user edits the
// operator and value(s) afterward via the rule row's own controls.
export function defaultAttributeState(leaf: CatalogLeaf): { operator: string; values: RuleValueChip[] } | undefined {
  switch (leaf.type) {
    case 'attribute-numeric':
      return { operator: 'is equal to', values: [{ id: `${leaf.id}-v1`, label: '2' }, { id: `${leaf.id}-v2`, label: '3' }] }
    case 'attribute-text':
      return { operator: 'is equal to', values: [{ id: `${leaf.id}-v1`, label: '' }] }
    case 'attribute-boolean':
      return { operator: 'is', values: [{ id: `${leaf.id}-v1`, label: 'True' }] }
    case 'attribute-date':
      return { operator: 'is on', values: [{ id: `${leaf.id}-v1`, label: new Date().toISOString().slice(0, 10) }] }
    default:
      return undefined
  }
}
