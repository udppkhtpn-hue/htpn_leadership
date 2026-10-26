import { lazy, Suspense } from 'react'
import { useRoute } from './lib/router'
import { Join } from './routes/Join'

/* The projector and the phone load as little as possible: the console, the
   styleguide, the load test and the print view are split out, so a phone on
   4G never downloads the animation library or the collage components. */
const Present = lazy(() =>
  import('./routes/Present').then((m) => ({ default: m.Present })),
)
const PresentationProvider = lazy(() =>
  import('./state/PresentationProvider').then((m) => ({ default: m.PresentationProvider })),
)
const Presenter = lazy(() => import('./routes/Presenter').then((m) => ({ default: m.Presenter })))
const Styleguide = lazy(() => import('./routes/Styleguide').then((m) => ({ default: m.Styleguide })))
const Test = lazy(() => import('./routes/Test').then((m) => ({ default: m.Test })))
const Print = lazy(() => import('./routes/Print').then((m) => ({ default: m.Print })))
const Placeholder = lazy(() => import('./routes/Placeholder').then((m) => ({ default: m.Placeholder })))

function Loading() {
  return (
    <div
      style={{
        minHeight: '100svh',
        display: 'grid',
        placeContent: 'center',
        background: 'var(--color-cream)',
        color: 'var(--color-sepia)',
        fontFamily: 'var(--font-type)',
        fontSize: '0.8rem',
        letterSpacing: '0.14em',
      }}
    >
      loading
    </div>
  )
}

export default function App() {
  const route = useRoute()

  // The phone is the only route loaded eagerly: it has to open fast on a cheap
  // handset over 4G, and it needs none of the collage or animation code.
  if (route === 'join') return <Join />

  return (
    <Suspense fallback={<Loading />}>
      {route === 'present' ? (
        <PresentationProvider>
          <Present />
        </PresentationProvider>
      ) : route === 'presenter' ? (
        <PresentationProvider>
          <Presenter />
        </PresentationProvider>
      ) : route === 'styleguide' ? (
        <Styleguide />
      ) : route === 'test' ? (
        <Test />
      ) : route === 'print' ? (
        <Print />
      ) : (
        <Placeholder
          title="HTPN Lead Live"
          detail="Be the Senior You Needed — leadership is a choice, not a rank."
        />
      )}
    </Suspense>
  )
}
