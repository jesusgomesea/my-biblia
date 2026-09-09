import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#fbfaf7',
          color: '#1c1a17',
          fontFamily: 'Georgia, serif',
          fontWeight: 600,
          fontSize: 96,
          letterSpacing: -2,
        }}
      >
        m<span style={{ color: '#7a5c34', margin: '0 4px' }}>·</span>b
      </div>
    ),
    size,
  )
}
