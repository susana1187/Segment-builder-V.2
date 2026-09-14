import { useState } from 'react'
import Box from '@liveramp/motif/core/Box'
import Tabs from '@liveramp/motif/core/Tabs'
import Tab from '@liveramp/motif/core/Tab'
import TextField from '@liveramp/motif/core/TextField'
import Switch from '@liveramp/motif/core/Switch'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { BarChart, Search, InfoOutline, ExpandMore } from '@liveramp/icons'
import { SidePanel } from './SidePanel'
import type { SegmentDraft } from '../../types/segment'
import { computeFooterStats } from '../../utils/stats'

const USE_CASES = ['Audience Targeting', 'Measurement & Attribution', 'Lookalike Modeling', 'Retargeting']

const DESTINATION_PLATFORMS = [
  'Facebook - US',
  'X (Twitter)',
  'Yahoo! (fka Verizon Media)',
  'Campaign Analytics',
  'Meta',
  'Cadent (3INFO)',
  'The Trade Desk',
  'Google DV360',
  'Amazon DSP',
]

const SIGNAL_CATEGORIES = [
  { label: 'Purchase intent', value: 84 },
  { label: 'Demographic affinity', value: 71 },
  { label: 'Browsing behavior', value: 63 },
  { label: 'Location patterns', value: 48 },
]

function SectionLabel({ children }: { children: string }) {
  return (
    <Box sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary', letterSpacing: 0.5, mb: 1 }}>{children}</Box>
  )
}

function StatTile({ value, label, caption }: { value: string | number; label: string; caption?: string }) {
  return (
    <Box sx={{ flex: 1, bgcolor: 'action.hover', borderRadius: 1, p: 2, textAlign: 'center' }}>
      <Box sx={{ fontSize: 22, fontWeight: 700 }}>{value}</Box>
      <Box sx={{ fontSize: 13, color: 'text.secondary', mt: 0.5 }}>{label}</Box>
      {caption && (
        <Box sx={{ fontSize: 11, color: 'text.disabled' }}>{caption}</Box>
      )}
    </Box>
  )
}

function DetailsTab() {
  const [useCasesOpen, setUseCasesOpen] = useState(true)
  const [platformQuery, setPlatformQuery] = useState('')
  const filteredPlatforms = DESTINATION_PLATFORMS.filter((p) => p.toLowerCase().includes(platformQuery.trim().toLowerCase()))

  return (
    <Box sx={{ p: 3 }}>
      <SectionLabel>Description</SectionLabel>
      <Box sx={{ fontSize: 14, mb: 3 }}>
        This segment targets audiences based on the configured rules. Add rules to the canvas to refine the segment
        definition and see updated reach estimates.
      </Box>

      <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, mb: 3 }}>
        <Box
          onClick={() => setUseCasesOpen((o) => !o)}
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1.5, cursor: 'pointer' }}
        >
          <Box sx={{ fontSize: 14, fontWeight: 600 }}>Permitted Use Cases</Box>
          <ExpandMore sx={{ fontSize: 20, transform: useCasesOpen ? 'rotate(180deg)' : undefined }} />
        </Box>
        {useCasesOpen && (
          <Box sx={{ px: 2, pb: 2 }}>
            {USE_CASES.map((useCase) => (
              <Box key={useCase} sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: 14, py: 0.5 }}>
                <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'success.main' }} />
                {useCase}
              </Box>
            ))}
          </Box>
        )}
      </Box>

      <SectionLabel>Available Destination Platforms</SectionLabel>
      <TextField
        size="small"
        fullWidth
        placeholder="Search Platforms"
        value={platformQuery}
        onChange={(e) => setPlatformQuery(e.target.value)}
        InputProps={{ startAdornment: <Search sx={{ fontSize: 18, color: 'text.disabled', mr: 1 }} /> }}
        sx={{ mb: 1 }}
      />
      <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
        {filteredPlatforms.map((platform, i) => (
          <Box
            key={platform}
            sx={{
              px: 2,
              py: 1.25,
              fontSize: 14,
              borderTop: i > 0 ? '1px solid' : undefined,
              borderColor: 'divider',
            }}
          >
            {platform}
          </Box>
        ))}
        {filteredPlatforms.length === 0 && (
          <Box sx={{ px: 2, py: 1.25, fontSize: 14, color: 'text.secondary' }}>No platforms match "{platformQuery}"</Box>
        )}
      </Box>
    </Box>
  )
}

function TestAndControlTab({ draft }: { draft: SegmentDraft }) {
  const [enabled, setEnabled] = useState(false)
  const [splitCount, setSplitCount] = useState(2)
  const [splits, setSplits] = useState<number[]>([50, 50])

  function updateSplitCount(count: number) {
    setSplitCount(count)
    const even = Math.floor(100 / count)
    const values = Array.from({ length: count }, () => even)
    values[values.length - 1] += 100 - even * count
    setSplits(values)
  }

  const total = splits.reduce((a, b) => a + b, 0)
  const suffixes = ['Test', 'Control', 'Control_2', 'Control_3']

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Switch checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
        <Box sx={{ fontSize: 14 }}>Split Segment into</Box>
        <Select
          size="small"
          value={splitCount}
          onChange={(e) => updateSplitCount(Number(e.target.value))}
          disabled={!enabled}
          sx={{ width: 72 }}
        >
          {[2, 3, 4].map((n) => (
            <MenuItem key={n} value={n}>
              {n}
            </MenuItem>
          ))}
        </Select>
        <InfoOutline sx={{ fontSize: 18, color: 'text.disabled' }} />
      </Box>

      {enabled && (
        <Box sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', fontSize: 12, color: 'text.secondary', mb: 1 }}>
            <Box sx={{ flexGrow: 1 }}>Segment name</Box>
            <Box sx={{ width: 90, textAlign: 'right' }}>Split %</Box>
          </Box>
          {splits.map((pct, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <TextField size="small" fullWidth value={`${draft.label.replace(/\s+/g, '_')}_${suffixes[i] ?? `Group_${i + 1}`}`} InputProps={{ readOnly: true }} />
              <TextField
                size="small"
                value={pct}
                onChange={(e) => {
                  const next = [...splits]
                  next[i] = Number(e.target.value) || 0
                  setSplits(next)
                }}
                InputProps={{ endAdornment: <Box sx={{ fontSize: 13, color: 'text.secondary' }}>%</Box> }}
                sx={{ width: 90 }}
              />
            </Box>
          ))}
          <Box sx={{ fontSize: 13, fontWeight: 600, color: total === 100 ? 'success.main' : 'error.main', textAlign: 'right' }}>
            Total: {total}%
          </Box>
        </Box>
      )}
    </Box>
  )
}

function DataOverlapsTab({ draft }: { draft: SegmentDraft }) {
  const [compareId, setCompareId] = useState('')
  const stats = computeFooterStats(draft)

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
        <StatTile value={stats.size} label="Your Segment" />
        <StatTile value={compareId ? '18%' : '0%'} label="Avg Overlap" />
        <StatTile value={compareId ? '82%' : '100%'} label="Unique Reach" />
      </Box>
      <SectionLabel>Compare Against</SectionLabel>
      <Select size="small" fullWidth displayEmpty value={compareId} onChange={(e) => setCompareId(e.target.value)}>
        <MenuItem value="">Add segment to compare...</MenuItem>
        <MenuItem value="high-value">High-Value Customers</MenuItem>
        <MenuItem value="cart">Cart Abandoners - 30 Day</MenuItem>
        <MenuItem value="churn">Churn Risk - Q3</MenuItem>
      </Select>
      {!compareId && (
        <Box sx={{ fontSize: 13, color: 'text.secondary', textAlign: 'center', mt: 4 }}>
          Search and add segments above to see overlap data.
        </Box>
      )}
    </Box>
  )
}

function LookalikeModelingTab({ draft }: { draft: SegmentDraft }) {
  const stats = computeFooterStats(draft)
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
        <StatTile value={stats.segments} label="Seed Audience" caption="top 10% of segment" />
        <StatTile value={stats.segments > 0 ? `${stats.segments * 12}` : 0} label="Model Reach" caption="estimated lookalike pool" />
      </Box>
      <SectionLabel>Model Settings</SectionLabel>
      {[
        ['Similarity', 'High'],
        ['Expansion factor', '12x'],
        ['Identity graph', 'LiveRamp'],
        ['Refresh cadence', 'Weekly'],
      ].map(([label, value]) => (
        <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', py: 1, fontSize: 14 }}>
          <Box sx={{ color: 'text.secondary' }}>{label}</Box>
          <Box sx={{ fontWeight: 600 }}>{value}</Box>
        </Box>
      ))}

      <Box sx={{ mt: 3 }}>
        <SectionLabel>Top Signal Categories</SectionLabel>
        {SIGNAL_CATEGORIES.map((cat) => (
          <Box key={cat.label} sx={{ mb: 1.5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, mb: 0.5 }}>
              <Box>{cat.label}</Box>
              <Box sx={{ fontWeight: 600 }}>{cat.value}%</Box>
            </Box>
            <Box sx={{ height: 6, borderRadius: 3, bgcolor: 'action.hover', overflow: 'hidden' }}>
              <Box sx={{ height: '100%', width: `${cat.value}%`, bgcolor: 'success.main', borderRadius: 3 }} />
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export function InsightsPanel({ draft, onClose }: { draft: SegmentDraft; onClose: () => void }) {
  const [tab, setTab] = useState<'details' | 'test' | 'overlaps' | 'lookalike'>('details')

  return (
    <SidePanel icon={<BarChart sx={{ fontSize: 20 }} />} title="Draft Segment Insights" headerBg="#e4f9ec" onClose={onClose}>
      <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', position: 'sticky', top: 0, bgcolor: 'background.paper', zIndex: 1 }}>
        <Tabs value={tab} onChange={(_, value) => setTab(value)} variant="scrollable">
          <Tab value="details" label="Details" />
          <Tab value="test" label="Test and Control" />
          <Tab value="overlaps" label="Data Overlaps" />
          <Tab value="lookalike" label="Lookalike Modeling" />
        </Tabs>
      </Box>
      {tab === 'details' && <DetailsTab />}
      {tab === 'test' && <TestAndControlTab draft={draft} />}
      {tab === 'overlaps' && <DataOverlapsTab draft={draft} />}
      {tab === 'lookalike' && <LookalikeModelingTab draft={draft} />}
    </SidePanel>
  )
}
