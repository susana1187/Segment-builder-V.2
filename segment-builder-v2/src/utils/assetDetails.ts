import type { CatalogLeaf } from '../types/catalog'

export interface AssetOverviewRow {
  label: string
  value: string
}

export interface AssetDetails {
  breadcrumb: string[]
  isMarketplace: boolean
  cpm?: string
  description: string
  iabCategories: string[][]
  overview: AssetOverviewRow[]
}

function hashSeed(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0
  return h
}

const TYPE_DESCRIPTIONS: Record<CatalogLeaf['type'], (label: string) => string> = {
  segment: (label) =>
    `Audience members matching "${label}". This dataset's performance is verified by Truthset and refreshed weekly.`,
  table: (label) => `Underlying data table "${label}" containing raw records available for attribute-level filtering.`,
  'attribute-numeric': (label) => `Numeric attribute "${label}" that can be filtered using comparison operators.`,
  'attribute-date': (label) => `Date attribute "${label}" that can be filtered using a date range.`,
  'attribute-boolean': (label) => `Boolean attribute "${label}" indicating true/false membership.`,
  'attribute-text': (label) => `Text attribute "${label}" that can be filtered by exact or partial match.`,
}

const IAB_CATEGORY_SETS: string[][] = [
  ['Demographic', 'Education & Occupation', 'Education (Highest Level)', 'College Education'],
  ['Purchase Intent*', 'Consumer Packaged Goods', 'Edible', 'Beverages', 'Coffee & Tea'],
  ['Interest', 'Technology & Computing', 'Consumer Electronics'],
  ['In-Market', 'Travel', 'Air Travel'],
]

export function buildAssetDetails(leaf: CatalogLeaf): AssetDetails {
  const seed = hashSeed(leaf.id)
  const source = leaf.meta?.source ?? 'My Data'
  const isMarketplace = source === 'Marketplace Data'

  const breadcrumb = [source, ...leaf.label.split(/[-_]/).map((s) => s.trim()).filter(Boolean)].slice(0, 4)

  const iabCategories = [IAB_CATEGORY_SETS[seed % IAB_CATEGORY_SETS.length], IAB_CATEGORY_SETS[(seed + 1) % IAB_CATEGORY_SETS.length]]

  const inputRecords = 50_000 + (seed % 900) * 1000
  const overview: AssetOverviewRow[] = [
    { label: 'Segment Type', value: leaf.meta?.segmented ? 'Standard' : 'Attribute' },
    { label: 'Segment ID', value: String(10_000_000 + (seed % 9_000_000)) },
    { label: 'Data Seller', value: isMarketplace ? 'AlarisB2B' : source },
    { label: 'Input Records (Size)', value: inputRecords.toLocaleString() },
    { label: 'iOS Device Reach', value: Math.round(inputRecords * 0.2).toLocaleString() },
    { label: 'Android Device Reach', value: Math.round(inputRecords * 0.11).toLocaleString() },
    { label: 'Cookie Reach', value: Math.round(inputRecords * 0.94).toLocaleString() },
    { label: 'Data Source Method', value: seed % 2 === 0 ? 'Deterministic' : 'Probabilistic' },
    { label: 'Precision Level', value: seed % 3 === 0 ? 'Individual' : 'Household' },
  ]

  return {
    breadcrumb,
    isMarketplace,
    cpm: isMarketplace ? `$${(1 + (seed % 20) / 10).toFixed(2)}` : undefined,
    description: TYPE_DESCRIPTIONS[leaf.type](leaf.label),
    iabCategories,
    overview,
  }
}
