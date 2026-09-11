import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Geist, Literata } from "next/font/google";
import MenuUsuario from "@/components/menu-usuario";
import ProvedorSessao from "@/components/provedor-sessao";
import Sincronizador from "@/components/sincronizador";
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
        <ProvedorSessao>
          <Sincronizador />
          <header className="border-b border-borda">
            <div className="mx-auto max-w-5xl px-4 py-3">
              <div className="flex items-center justify-between gap-4">
                <Link href="/" className="font-serif text-lg font-semibold">
                  my<span className="text-accent">·</span>biblia
                </Link>
                {/* Menu em linha no desktop, junto do logo. */}
                <nav
                  aria-label="Principal"
                  className="hidden flex-1 gap-4 pl-2 text-sm text-muted md:flex"
                >
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
                </nav>
                <MenuUsuario />
              </div>
              {/* No mobile, o menu desce para uma segunda linha; scroll
                  horizontal cobre casos extremos, mas os quatro cabem em ~350px. */}
              <nav
                aria-label="Principal"
                className="-mx-4 mt-2 flex gap-5 overflow-x-auto px-4 text-sm text-muted md:hidden"
              >
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
              </nav>
            </div>
          </header>
          <main className="flex-1">{children}</main>
        </ProvedorSessao>
      </body>
    </html>
  );
}
