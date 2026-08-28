# Segment Builder V.2

A React + TypeScript + Vite prototype of LiveRamp's Segment Builder, built with the real
`@liveramp/motif` component library and `@liveramp/icons`.

## Features

- Data Catalog Assets tree (segments, tables, attributes) with hover-to-preview asset details
- Drag-and-drop from the catalog into Include/Exclude canvases (dnd-kit)
- Automatic rule-group formation (single row -> RULE GROUP) with AND/OR toggles
- Full drag-and-drop reordering/regrouping of rows already placed on the canvas
- Draft tabs: create, duplicate, rename (double-click), close
- Footer stats bar (segments/rules/datasets/CPM) derived live from canvas state

## Getting started

```bash
npm install
npm run dev
```

`npm install` runs `scripts/link-motif.mjs` automatically (via `postinstall`) to copy the
local `@liveramp/motif` / `@liveramp/icons` packages into `node_modules` — they're consumed
via `file:` dependencies pointing at vendor folders outside this repo, since they aren't
published to a public registry.

## Sharing a static preview

```bash
npx vite build --config vite.config.share.ts
```

Produces a single self-contained `dist-share/index.html` that can be opened directly in a
browser (double-click, no server needed) to preview the current state.
