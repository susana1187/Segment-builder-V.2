import type { CanvasItem, CanvasZone, LogicOperator, SegmentDraft, SegmentRow } from '../types/segment'
import { estimateCpm } from './hash'

export interface FooterStats {
  segments: number
  rules: number
  datasets: number
  size: string
  cpm: string
}

function countZone(zone: CanvasZone): { segments: number; rules: number; datasets: Set<string> } {
  let segments = 0
  let rules = 0
  const datasets = new Set<string>()

  for (const item of zone.items) {
    const rows = item.kind === 'group' ? item.children : [item]
    for (const row of rows) {
      if (row.rowKind === 'asset') segments += 1
      else rules += 1
      if (row.meta?.source) datasets.add(row.meta.source)
    }
  }

  return { segments, rules, datasets }
}

function parseSize(size?: string): number {
  if (!size) return 0
  const match = size.trim().match(/^([\d.]+)\s*(K|M)?$/i)
  if (!match) return 0
  const value = parseFloat(match[1])
  const unit = match[2]?.toUpperCase()
  if (unit === 'M') return value * 1_000_000
  if (unit === 'K') return value * 1_000
  return value
}

function formatSize(value: number): string {
  if (value <= 0) return '--'
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `${Math.round(value / 1_000)}K`
  return String(Math.round(value))
}

// OR-joined items add reach together; AND-joined items intersect, approximated as the smallest member.
function combine(sizes: number[], operators: LogicOperator[]): number {
  if (sizes.length === 0) return 0
  return operators.some((op) => op === 'and') ? Math.min(...sizes) : sizes.reduce((a, b) => a + b, 0)
}

function itemSize(item: CanvasItem): number {
  if (item.kind === 'row') return parseSize(item.meta?.size)
  return combine(item.children.map((row) => parseSize(row.meta?.size)), item.operators)
}

function zoneSize(zone: CanvasZone): number {
  return combine(zone.items.map(itemSize), zone.operators)
}

function zoneRows(zone: CanvasZone): SegmentRow[] {
  return zone.items.flatMap((item) => (item.kind === 'group' ? item.children : [item]))
}

function averageCpm(rows: SegmentRow[]): number | undefined {
  const cpms = rows
    .map((row) => estimateCpm(row.sourceCatalogId, row.meta?.source))
    .filter((cpm): cpm is number => cpm !== undefined)
  if (cpms.length === 0) return undefined
  return cpms.reduce((a, b) => a + b, 0) / cpms.length
}

export function computeFooterStats(draft: SegmentDraft): FooterStats {
  const include = countZone(draft.include)
  const exclude = countZone(draft.exclude)

  const includeSize = zoneSize(draft.include)
  const excludeSize = zoneSize(draft.exclude)
  const size = includeSize > 0 ? formatSize(Math.max(includeSize - excludeSize, 0)) : '--'

  const cpm = averageCpm(zoneRows(draft.include))

  return {
    segments: include.segments + exclude.segments,
    rules: include.rules + exclude.rules,
    datasets: new Set([...include.datasets, ...exclude.datasets]).size,
    size,
    cpm: cpm !== undefined ? `$${cpm.toFixed(2)}` : '$ --',
  }
}
