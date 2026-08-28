import type { SegmentDraft } from '../types/segment'

export interface FooterStats {
  segments: number
  rules: number
  datasets: number
}

function countZone(zone: SegmentDraft['include']): { segments: number; rules: number; datasets: number } {
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

  return { segments, rules, datasets: datasets.size }
}

export function computeFooterStats(draft: SegmentDraft): FooterStats {
  const include = countZone(draft.include)
  const exclude = countZone(draft.exclude)
  return {
    segments: include.segments + exclude.segments,
    rules: include.rules + exclude.rules,
    datasets: include.datasets + exclude.datasets,
  }
}
