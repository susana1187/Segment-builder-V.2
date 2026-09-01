import type { CatalogNode } from '../types/catalog'

// A folder whose own label matches keeps all of its children as-is; otherwise it's kept only if
// at least one descendant matches, pruned down to just the matching branches.
export function filterCatalogTree(nodes: CatalogNode[], query: string): CatalogNode[] {
  const q = query.trim().toLowerCase()
  if (!q) return nodes

  function filterNode(node: CatalogNode): CatalogNode | null {
    if (node.kind === 'leaf') {
      return node.label.toLowerCase().includes(q) ? node : null
    }
    if (node.label.toLowerCase().includes(q)) return node
    const children = node.children.map(filterNode).filter((child): child is CatalogNode => child !== null)
    return children.length > 0 ? { ...node, children } : null
  }

  return nodes.map(filterNode).filter((node): node is CatalogNode => node !== null)
}
