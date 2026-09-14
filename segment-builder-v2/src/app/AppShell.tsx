import {
  DndContext,
  DragOverlay,
  PointerSensor,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { useMemo, useState } from 'react'
import Box from '@liveramp/motif/core/Box'
import Typography from '@liveramp/motif/core/Typography'
import TextField from '@liveramp/motif/core/TextField'
import IconButton from '@liveramp/motif/core/IconButton'
import Button from '@liveramp/motif/core/Button'
import { Search, AutoAwesome, BarChart } from '@liveramp/icons'
import { useActiveDraft, useSegment } from './SegmentContext'
import { resolveDrop } from './dndHandlers'
import { catalogTree } from '../data/catalogTree'
import { filterCatalogTree } from '../utils/catalogSearch'
import type { CatalogLeaf } from '../types/catalog'
import type { CanvasZone, SegmentGroup, SegmentRow } from '../types/segment'
import { IconRail } from '../components/shell/IconRail'
import { Header } from '../components/shell/Header'
import { CatalogTree } from '../components/catalog/CatalogTree'
import { AssetInfoPanel } from '../components/catalog/AssetInfoPanel'
import { CatalogLeafIcon } from '../components/catalog/catalogIcons'
import { DraftTabs } from '../components/draft/DraftChrome'
import { CanvasArea } from '../components/canvas/CanvasArea'
import { FooterStatsBar } from '../components/footer/FooterStatsBar'
import { InsightsPanel } from '../components/panels/InsightsPanel'
import { AssistantPanel } from '../components/panels/AssistantPanel'

// Zone and group drop targets are nested (a group sits inside its zone), so a pointer over a
// group is also technically over the zone. Prefer the smallest (most specific) matching rect so
// dropping on a group targets that group, while dropping on empty zone space targets the zone.
const preferSmallestDroppable: CollisionDetection = (args) => {
  const pointerCollisions = pointerWithin(args)
  const collisions = pointerCollisions.length > 0 ? pointerCollisions : rectIntersection(args)
  if (collisions.length <= 1) return collisions

  return [...collisions].sort((a, b) => {
    const rectA = args.droppableRects.get(a.id)
    const rectB = args.droppableRects.get(b.id)
    const areaA = rectA ? rectA.width * rectA.height : Infinity
    const areaB = rectB ? rectB.width * rectB.height : Infinity
    return areaA - areaB
  })
}

function findRowInZone(zone: CanvasZone, rowId: string): SegmentRow | null {
  for (const item of zone.items) {
    if (item.kind === 'row' && item.id === rowId) return item
    if (item.kind === 'group') {
      const found = item.children.find((r) => r.id === rowId)
      if (found) return found
    }
  }
  return null
}

function findGroupInZone(zone: CanvasZone, groupId: string): SegmentGroup | null {
  return zone.items.find((item): item is SegmentGroup => item.kind === 'group' && item.id === groupId) ?? null
}

export function AppShell() {
  const { state, dispatch } = useSegment()
  const draft = useActiveDraft()
  const [activeLeaf, setActiveLeaf] = useState<CatalogLeaf | null>(null)
  const [activeRow, setActiveRow] = useState<SegmentRow | null>(null)
  const [activeGroup, setActiveGroup] = useState<SegmentGroup | null>(null)
  const [hoveredLeaf, setHoveredLeaf] = useState<CatalogLeaf | null>(null)
  const [catalogQuery, setCatalogQuery] = useState('')
  const [activePanel, setActivePanel] = useState<'insights' | 'assistant' | null>(null)
  const filteredCatalog = useMemo(() => filterCatalogTree(catalogTree, catalogQuery), [catalogQuery])
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  function handleDragStart(event: DragStartEvent) {
    const data = event.active.data.current as
      | { type: 'catalog-item'; payload: CatalogLeaf }
      | { type: 'canvas-row'; rowId: string; sourceZone: 'include' | 'exclude' }
      | { type: 'canvas-group'; groupId: string; sourceZone: 'include' | 'exclude' }
      | undefined
    setActiveLeaf(data?.type === 'catalog-item' ? data.payload : null)
    setActiveRow(data?.type === 'canvas-row' ? findRowInZone(draft[data.sourceZone], data.rowId) : null)
    setActiveGroup(data?.type === 'canvas-group' ? findGroupInZone(draft[data.sourceZone], data.groupId) : null)
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveLeaf(null)
    setActiveRow(null)
    setActiveGroup(null)
    const action = resolveDrop(event, state.activeDraftId)
    if (action) dispatch(action)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={preferSmallestDroppable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Box sx={{ display: 'flex', height: '100vh' }}>
        <IconRail />
        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minWidth: 0 }}>
          <Box sx={{ position: 'relative', zIndex: 1, boxShadow: '0 2px 4px rgba(0,0,0,0.06)' }}>
            <Header />
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
              <Box sx={{ width: 344, flexShrink: 0, px: 3, py: 0.75 }}>
                <Typography sx={{ fontFamily: "'LiveRamp Sans', sans-serif", fontSize: 32, fontWeight: 500, lineHeight: 1, position: 'relative', top: -24 }}>
                  Segment Builder
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-end', flexGrow: 1, px: 3, gap: 2, py: 0.75, position: 'relative', top: 6 }}>
                <DraftTabs />
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexGrow: 1, minHeight: 0 }}>
            {activePanel === 'assistant' ? (
              <AssistantPanel onClose={() => setActivePanel(null)} />
            ) : (
              <Box sx={{ width: 344, borderRight: "1px solid", borderColor: "divider", overflow: "auto", flexShrink: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1.5 }}>
                  <Box sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary', letterSpacing: 0.5 }}>
                    DATA CATALOG ASSETS
                  </Box>
                  <IconButton
                    size="small"
                    aria-label="Ask Agent"
                    onClick={() => setActivePanel('assistant')}
                    sx={{ bgcolor: '#ede7fb', color: '#4a2f9c', '&:hover': { bgcolor: '#ddd2f7' } }}
                  >
                    <AutoAwesome sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>
                <Box sx={{ px: 2, pb: 1.5 }}>
                  <TextField
                    size="small"
                    fullWidth
                    placeholder="Search assets"
                    value={catalogQuery}
                    onChange={(e) => setCatalogQuery(e.target.value)}
                    InputProps={{ endAdornment: <Search sx={{ fontSize: 24, color: 'text.disabled', ml: 1 }} /> }}
                  />
                </Box>
                {catalogQuery.trim() && filteredCatalog.length === 0 ? (
                  <Box sx={{ px: 2, py: 1, fontSize: 13, color: 'text.secondary' }}>No assets match "{catalogQuery.trim()}"</Box>
                ) : (
                  <CatalogTree
                    nodes={filteredCatalog}
                    onHoverLeaf={setHoveredLeaf}
                    expandAll={!!catalogQuery.trim()}
                    query={catalogQuery}
                  />
                )}
              </Box>
            )}
            <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minWidth: 0, position: 'relative' }}>
              <Button
                variant={activePanel === 'insights' ? 'contained' : 'outlined'}
                size="small"
                startIcon={<BarChart sx={{ fontSize: 16 }} />}
                disabled={draft.include.items.length === 0 && draft.exclude.items.length === 0}
                onClick={() => setActivePanel((p) => (p === 'insights' ? null : 'insights'))}
                sx={{
                  position: 'absolute',
                  top: 12,
                  right: 24,
                  zIndex: 2,
                  ...(activePanel === 'insights'
                    ? { bgcolor: '#e4f9ec', color: '#1a8f4e', border: 'none', boxShadow: 'none', '&:hover': { bgcolor: '#d3f2df', border: 'none', boxShadow: 'none' } }
                    : {}),
                }}
              >
                Segment Details
              </Button>
              <CanvasArea />
              <FooterStatsBar />
              {hoveredLeaf && <AssetInfoPanel leaf={hoveredLeaf} />}
            </Box>
            {activePanel === 'insights' && <InsightsPanel draft={draft} onClose={() => setActivePanel(null)} />}
          </Box>
        </Box>
      </Box>
      <DragOverlay>
        {activeLeaf && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 1, px: 1.5, py: 1, boxShadow: 3 }}>
            <CatalogLeafIcon type={activeLeaf.type} />
            <Box component="span" sx={{ fontSize: 14 }}>{activeLeaf.label}</Box>
          </Box>
        )}
        {activeRow && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 1, px: 1.5, py: 1, boxShadow: 3 }}>
            <CatalogLeafIcon type={activeRow.type} />
            <Box component="span" sx={{ fontSize: 14, fontWeight: 600 }}>{activeRow.title}</Box>
          </Box>
        )}
        {activeGroup && (
          <Box sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 1, px: 1.5, py: 1, boxShadow: 3 }}>
            <Box sx={{ fontSize: 12, fontWeight: 700, color: 'text.secondary', letterSpacing: 0.5, mb: 0.5 }}>RULE GROUP</Box>
            {activeGroup.children.map((row) => (
              <Box key={row.id} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CatalogLeafIcon type={row.type} />
                <Box component="span" sx={{ fontSize: 14, fontWeight: 600 }}>{row.title}</Box>
              </Box>
            ))}
          </Box>
        )}
      </DragOverlay>
    </DndContext>
  )
}
