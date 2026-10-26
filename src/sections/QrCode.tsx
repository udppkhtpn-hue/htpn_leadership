import { useEffect, useState } from 'react'
import QRCode from 'qrcode'

/** Renders the join URL as an inline SVG so it stays crisp on a projector. */
export function QrCode({ value, size = 420 }: { value: string; size?: number }) {
  const [svg, setSvg] = useState('')

  useEffect(() => {
    let live = true
    QRCode.toString(value, {
      type: 'svg',
      margin: 1,
      errorCorrectionLevel: 'M',
      color: { dark: '#141210ff', light: '#00000000' },
    })
      .then((markup) => {
        if (live) setSvg(markup)
      })
      .catch(() => setSvg(''))
    return () => {
      live = false
    }
  }, [value])

  return (
    <div
      aria-label={`QR code for ${value}`}
      role="img"
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
