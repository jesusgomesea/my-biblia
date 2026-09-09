import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Geist, Literata } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const literata = Literata({ variable: "--font-literata", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "my-biblia",
  description:
    "Leia a Bíblia em dezenas de traduções e monte planos de estudo no seu ritmo.",
  applicationName: "my-biblia",
  appleWebApp: {
    capable: true,
    title: "my-biblia",
    statusBarStyle: "default",
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfaf7" },
    { media: "(prefers-color-scheme: dark)", color: "#14130f" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${literata.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <header className="border-b border-borda">
          <nav className="mx-auto flex max-w-5xl items-center gap-6 px-4 py-3">
            <Link href="/" className="font-serif text-lg font-semibold">
              my<span className="text-accent">·</span>biblia
            </Link>
            <div className="flex gap-4 text-sm text-muted">
              <Link href="/biblia" className="hover:text-foreground">
                Bíblia
              </Link>
              <Link href="/planos" className="hover:text-foreground">
                Planos
              </Link>
              <Link href="/marcacoes" className="hover:text-foreground">
                Marcados
              </Link>
              <Link href="/busca" className="hover:text-foreground">
                Buscar
              </Link>
            </div>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
