import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'my-biblia',
    short_name: 'my-biblia',
    description:
      'Leia a Bíblia em dezenas de traduções e monte planos de estudo no seu ritmo.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#fbfaf7',
    theme_color: '#fbfaf7',
    lang: 'pt-BR',
    dir: 'ltr',
    categories: ['books', 'education', 'lifestyle'],
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}
