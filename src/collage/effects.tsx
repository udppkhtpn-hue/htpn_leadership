import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

const EffectsContext = createContext(false)

/** True when heavy motion should be skipped: the OS setting, or the presenter's
 *  "Reduced effects" toggle. Sets data-reduced-effects so CSS idle loops stop
 *  too, not just the JS-driven ones. */
export function EffectsProvider({ reduced, children }: { reduced?: boolean; children: ReactNode }) {
  const [systemReduced, setSystemReduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setSystemReduced(query.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  const value = Boolean(reduced) || systemReduced
  return (
    <EffectsContext.Provider value={value}>
      <div data-reduced-effects={value} style={{ height: '100%' }}>
        {children}
      </div>
    </EffectsContext.Provider>
  )
}

export const useReducedEffects = () => useContext(EffectsContext)
