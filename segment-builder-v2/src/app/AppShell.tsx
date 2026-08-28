import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, type DragEndEvent, type DragStartEvent } from '@dnd-kit/core'
import { useState } from 'react'
import Box from '@liveramp/motif/core/Box'
import { useActiveDraft, useSegment } from './SegmentContext'
import { resolveDrop } from './dndHandlers'
import { catalogTree } from '../data/catalogTree'
import type { CatalogLeaf } from '../types/catalog'
import type { CanvasZone, SegmentRow } from '../types/segment'
import { IconRail } from '../components/shell/IconRail'
import { Header } from '../components/shell/Header'
import { CatalogTree } from '../components/catalog/CatalogTree'
import { AssetInfoPanel } from '../components/catalog/AssetInfoPanel'
import { CatalogLeafIcon } from '../components/catalog/catalogIcons'
import { DraftTabs, SegmentNameField, DraftDetailsButton, AskAgentButton } from '../components/draft/DraftChrome'
import { CanvasArea } from '../components/canvas/CanvasArea'
import { FooterStatsBar } from '../components/footer/FooterStatsBar'

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

export function AppShell() {
  const { state, dispatch } = useSegment()
  const draft = useActiveDraft()
  const [activeLeaf, setActiveLeaf] = useState<CatalogLeaf | null>(null)
  const [activeRow, setActiveRow] = useState<SegmentRow | null>(null)
  const [hoveredLeaf, setHoveredLeaf] = useState<CatalogLeaf | null>(null)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  function handleDragStart(event: DragStartEvent) {
    const data = event.active.data.current as
      | { type: 'catalog-item'; payload: CatalogLeaf }
      | { type: 'canvas-row'; rowId: string; sourceZone: 'include' | 'exclude' }
      | undefined
    if (data?.type === 'catalog-item') {
      setActiveLeaf(data.payload)
      setActiveRow(null)
    } else if (data?.type === 'canvas-row') {
      setActiveRow(findRowInZone(draft[data.sourceZone], data.rowId))
      setActiveLeaf(null)
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveLeaf(null)
    setActiveRow(null)
    const action = resolveDrop(event, state.activeDraftId)
    if (action) dispatch(action)
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <Box sx={{ display: 'flex', height: '100vh' }}>
        <IconRail />
        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minWidth: 0 }}>
          <Box sx={{ position: 'relative', zIndex: 1, boxShadow: '0 2px 4px rgba(0,0,0,0.06)' }}>
            <Header />
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
              <Box sx={{ width: 280, flexShrink: 0, px: 3, pb: 2 }}>
                <SegmentNameField />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexGrow: 1, px: 3, gap: 2 }}>
                <DraftTabs />
                <Box sx={{ display: 'flex', gap: 1, pb: 2 }}>
                  <DraftDetailsButton />
                  <AskAgentButton />
                </Box>
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexGrow: 1, minHeight: 0 }}>
            <Box sx={{ width: 280, borderRight: '1px solid', borderColor: 'divider', overflow: 'auto', flexShrink: 0 }}>
              <Box sx={{ px: 2, py: 1.5, fontSize: 12, fontWeight: 700, color: 'text.secondary', letterSpacing: 0.5 }}>
                DATA CATALOG ASSETS
              </Box>
              <CatalogTree nodes={catalogTree} onHoverLeaf={setHoveredLeaf} />
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minWidth: 0, position: 'relative' }}>
              <CanvasArea />
              <FooterStatsBar />
              {hoveredLeaf && <AssetInfoPanel leaf={hoveredLeaf} />}
            </Box>
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
      </DragOverlay>
    </DndContext>
  )
}
