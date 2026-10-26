import { useRoute } from './lib/router'
import { PresentationProvider } from './state/PresentationProvider'
import { Present } from './routes/Present'
import { Presenter } from './routes/Presenter'
import { Join } from './routes/Join'
import { Placeholder } from './routes/Placeholder'
import { Styleguide } from './routes/Styleguide'
import { Test } from './routes/Test'

export default function App() {
  const route = useRoute()

  // Phones never need presentation state, and the index page is just links.
  if (route === 'join') return <Join />
  if (route === 'styleguide') return <Styleguide />
  if (route === 'test') return <Test />
  if (route === 'print')
    return <Placeholder title="Print" detail="A print-friendly version of the static sections, for the backup PDF. Built in Phase 5." />
  if (route === 'home')
    return <Placeholder title="HTPN Lead Live" detail="Be the Senior You Needed — leadership is a choice, not a rank." />

  return (
    <PresentationProvider>
      {route === 'present' ? <Present /> : <Presenter />}
    </PresentationProvider>
  )
}
