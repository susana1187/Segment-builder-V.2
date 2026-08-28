import type { CatalogItemType, CatalogMeta } from './catalog'

export type LogicOperator = 'and' | 'or'

export interface RuleValueChip {
  id: string
  label: string
}

export interface SegmentRow {
  id: string
  kind: 'row'
  rowKind: 'asset' | 'attribute'
  sourceCatalogId: string
  type: CatalogItemType
  title: string
  meta?: CatalogMeta
  operator?: string
  values?: RuleValueChip[]
}

export interface SegmentGroup {
  id: string
  kind: 'group'
  children: SegmentRow[]
  operators: LogicOperator[]
}

export type CanvasItem = SegmentRow | SegmentGroup

export type CanvasZoneKind = 'include' | 'exclude'

export interface CanvasZone {
  kind: CanvasZoneKind
  items: CanvasItem[]
  operators: LogicOperator[]
}

export interface SegmentDraft {
  id: string
  name: string
  label: string
  include: CanvasZone
  exclude: CanvasZone
}
