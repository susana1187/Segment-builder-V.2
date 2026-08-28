export type CatalogItemType =
  | 'segment'
  | 'table'
  | 'attribute-numeric'
  | 'attribute-date'
  | 'attribute-boolean'
  | 'attribute-text'

export interface CatalogMeta {
  source?: string
  segmented?: boolean
  size?: string
}

export interface CatalogLeaf {
  id: string
  kind: 'leaf'
  type: CatalogItemType
  label: string
  meta?: CatalogMeta
}

export type CatalogFolderIcon = 'star' | 'wrench' | 'person' | 'cleanroom' | 'cart' | 'folder' | 'stack' | 'table' | 'dataset'

export interface CatalogFolder {
  id: string
  kind: 'folder'
  label: string
  icon: CatalogFolderIcon
  children: CatalogNode[]
}

export type CatalogNode = CatalogFolder | CatalogLeaf
