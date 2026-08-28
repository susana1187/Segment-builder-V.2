// @liveramp/motif and @liveramp/icons are consumed via a `file:` dependency
// pointing at local vendor folders (not published to npm). npm installs these
// as symlinks, but Motif's own transitive deps (chroma-js, @mui/x-data-grid-premium,
// etc.) live only in the vendor folder's nested node_modules, not ours — and a
// symlinked package resolves imports from its *real* path, so Vite can't see our
// hoisted deps for it either. Copying the built output into our own node_modules
// (instead of symlinking) sidesteps both problems.
import { existsSync, rmSync, mkdirSync, cpSync, lstatSync, realpathSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = path.dirname(fileURLToPath(import.meta.url)) + '/..'
const targets = ['@liveramp/motif', '@liveramp/icons']

for (const pkg of targets) {
  const dest = path.join(root, 'node_modules', pkg)
  if (!existsSync(dest)) continue
  if (!lstatSync(dest).isSymbolicLink()) continue
  const real = realpathSync(dest)
  rmSync(dest, { force: true })
  mkdirSync(dest, { recursive: true })
  cpSync(real, dest, { recursive: true, dereference: true })
  console.log(`[link-motif] copied ${pkg} from vendor folder into node_modules`)
}
