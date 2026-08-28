import type { CatalogNode } from '../types/catalog'

const segmentLeaf = (id: string, label: string, source = 'My Data', size = '11K'): CatalogNode => ({
  id,
  kind: 'leaf',
  type: 'segment',
  label,
  meta: { source, segmented: true, size },
})

interface TableAttribute {
  label: string
  type: 'attribute-numeric' | 'attribute-date' | 'attribute-boolean' | 'attribute-text'
}

const tableFolder = (id: string, label: string, attributes: TableAttribute[]): CatalogNode => ({
  id,
  kind: 'folder',
  icon: 'table',
  label,
  children: [
    { id: `${id}-all-members`, kind: 'leaf', type: 'table', label: 'All Table members' },
    ...attributes.map((attr, i) => ({ id: `${id}-attr-${i}`, kind: 'leaf' as const, type: attr.type, label: attr.label })),
  ],
})

export const catalogTree: CatalogNode[] = [
  {
    id: 'recently-used',
    kind: 'folder',
    icon: 'star',
    label: 'Recently Used',
    children: [
      segmentLeaf('recent-segment-1', 'High-Value Customers', 'My Data', '482K'),
      segmentLeaf('recent-segment-2', 'Cart Abandoners - 30 Day', 'My Data', '96K'),
      { id: 'attribute-top', kind: 'leaf', type: 'attribute-numeric', label: 'Lifetime Value' },
      segmentLeaf('recent-segment-3', 'Newsletter Subscribers', 'My Data', '1.2M'),
      segmentLeaf('recent-segment-4', 'Churn Risk - Q3', 'My Data', '58K'),
      segmentLeaf('recent-segment-5', 'Loyalty Members - Gold Tier', 'My Data', '134K'),
      segmentLeaf('recent-segment-6', 'Mobile App Power Users', 'My Data', '221K'),
    ],
  },
  {
    id: 'campaign-2026-ss',
    kind: 'folder',
    icon: 'folder',
    label: 'Campaign_2026_SS',
    children: [
      segmentLeaf('campaign-segment-1', 'Spring Sale VIP List', 'Campaign_2026_SS', '76K'),
      segmentLeaf('campaign-segment-2', 'Retargeting - Display Ads', 'Campaign_2026_SS', '310K'),
    ],
  },
  {
    id: 'migrated-cp2-data',
    kind: 'folder',
    icon: 'folder',
    label: 'Migrated CP2 Data',
    children: [
      segmentLeaf('migrated-segment-1', 'Legacy Loyalty Members', 'Migrated CP2 Data', '405K'),
      segmentLeaf('migrated-segment-2', 'CP2 Email Opt-Ins', 'Migrated CP2 Data', '892K'),
    ],
  },
  {
    id: 'datasets',
    kind: 'folder',
    icon: 'dataset',
    label: 'Datasets',
    children: [
      tableFolder('table-name', 'Customer_Transactions', [
        { label: 'Lifetime Order Count', type: 'attribute-numeric' },
        { label: 'Last Purchase Date', type: 'attribute-date' },
        { label: 'Is Loyalty Member', type: 'attribute-boolean' },
        { label: 'Preferred Store Region', type: 'attribute-text' },
      ]),
      tableFolder('datasets-table-1', 'Web_Analytics_Events', [
        { label: 'Page View Count', type: 'attribute-numeric' },
        { label: 'Last Session Date', type: 'attribute-date' },
        { label: 'Is Returning Visitor', type: 'attribute-boolean' },
        { label: 'Traffic Source', type: 'attribute-text' },
      ]),
      tableFolder('datasets-table-2', 'CRM_Contacts', [
        { label: 'Lead Score', type: 'attribute-numeric' },
        { label: 'Last Contacted Date', type: 'attribute-date' },
        { label: 'Is Marketing Opt-In', type: 'attribute-boolean' },
        { label: 'Lifecycle Stage', type: 'attribute-text' },
      ]),
      tableFolder('datasets-table-3', 'POS_Transactions', [
        { label: 'Transaction Count', type: 'attribute-numeric' },
        { label: 'Last Transaction Date', type: 'attribute-date' },
        { label: 'Is Refunded', type: 'attribute-boolean' },
        { label: 'Store Location', type: 'attribute-text' },
      ]),
    ],
  },
  {
    id: 'built-segments',
    kind: 'folder',
    icon: 'wrench',
    label: 'Built Segments',
    children: [
      segmentLeaf('built-segment-1', 'Lookalike - Top Spenders', 'Built Segments', '640K'),
      segmentLeaf('built-segment-2', 'Website Visitors - Last 7 Days', 'Built Segments', '203K'),
      segmentLeaf('built-segment-3', 'Mobile App Installers', 'Built Segments', '87K'),
    ],
  },
  {
    id: 'my-data',
    kind: 'folder',
    icon: 'person',
    label: 'My Data',
    children: [
      segmentLeaf('my-data-segment-1', 'Uploaded CRM List', 'My Data', '54K'),
      segmentLeaf('my-data-segment-2', 'Email Subscribers - Active', 'My Data', '298K'),
      { id: 'my-data-attribute-1', kind: 'leaf', type: 'attribute-numeric', label: 'Household Income' },
    ],
  },
  {
    id: 'clean-room-data',
    kind: 'folder',
    icon: 'cleanroom',
    label: 'Clean Room Data',
    children: [
      segmentLeaf('clean-room-segment-1', 'Shared Audience - Partner A', 'Clean Room Data', '112K'),
      segmentLeaf('clean-room-segment-2', 'Cross-Channel Overlap', 'Clean Room Data', '38K'),
    ],
  },
  {
    id: 'marketplace-data',
    kind: 'folder',
    icon: 'cart',
    label: 'Marketplace Data',
    children: [
      segmentLeaf('marketplace-segment-1', 'Automotive Intenders', 'Marketplace Data', '1.8M'),
      segmentLeaf('marketplace-segment-2', 'Luxury Travel Shoppers', 'Marketplace Data', '245K'),
    ],
  },
]
