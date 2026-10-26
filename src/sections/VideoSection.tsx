import { useEffect, useRef, useState } from 'react'
import { Stamp, TapeStrip } from '../collage'
import { asset } from '../lib/asset'
import type { Section } from '../content/types'

/**
 * Plays when the section comes up and pauses on blackout. If the file is not
 * in /public/media yet, the screen says which one is missing rather than
 * showing a broken player.
 */
export function VideoSection({ section, paused }: { section: Section; paused: boolean }) {
  const video = useRef<HTMLVideoElement>(null)
  const [failed, setFailed] = useState(false)
  const [blocked, setBlocked] = useState(false)
  const src = section.props.src

  useEffect(() => {
    const element = video.current
    if (!element) return
    if (paused) {
      element.pause()
      return
    }
    // The presenter has just pressed a key, so autoplay with sound is allowed.
    // If the browser refuses anyway, offer a play button rather than silence.
    element.play().then(
      () => setBlocked(false),
      () => setBlocked(true),
    )
  }, [paused])

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 20,
        display: 'grid',
        placeContent: 'center',
        justifyItems: 'center',
        gap: '1rem',
        padding: 'clamp(1.5rem, 4vw, 4rem)',
      }}
    >
      <div className="hero" style={{ position: 'relative', width: 'min(86%, 70rem)' }}>
        <TapeStrip seed={`${section.id}:tape-l`} length="8rem" style={{ top: '-1.2rem', left: '6%' }} />
        <TapeStrip seed={`${section.id}:tape-r`} length="8rem" style={{ bottom: '-1.2rem', right: '6%' }} />
        {src && !failed ? (
          <video
            ref={video}
            src={asset(src)}
            playsInline
            controls={blocked}
            onError={() => setFailed(true)}
            style={{
              display: 'block',
              width: '100%',
              aspectRatio: '16 / 9',
              background: 'var(--color-ink)',
              boxShadow: '0.4rem 0.5rem 0 color-mix(in srgb, var(--color-ink) 25%, transparent)',
            }}
          />
        ) : (
          <div
            style={{
              display: 'grid',
              placeContent: 'center',
              gap: '0.75rem',
              width: '100%',
              aspectRatio: '16 / 9',
              background: 'color-mix(in srgb, var(--color-sepia) 55%, var(--color-cream))',
              color: 'var(--color-ink)',
              fontFamily: 'var(--font-type)',
              fontSize: 'var(--text-stamp)',
              letterSpacing: '0.14em',
              textAlign: 'center',
            }}
          >
            <span>video not in the build</span>
            <span style={{ opacity: 0.8 }}>{src ?? 'no file named'}</span>
          </div>
        )}
      </div>
      {section.props.caption ? <Stamp seed={section.id}>{section.props.caption}</Stamp> : null}
    </div>
  )
}
