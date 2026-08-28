import Motif from '@liveramp/motif/core/Motif'
import { SegmentProvider } from './app/SegmentContext'
import { AppShell } from './app/AppShell'

function App() {
  return (
    <Motif>
      <SegmentProvider>
        <AppShell />
      </SegmentProvider>
    </Motif>
  )
}

export default App
