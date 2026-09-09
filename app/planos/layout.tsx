import BarraPlanos from '@/components/barra-planos'

export default function LayoutPlanos({ children }: LayoutProps<'/planos'>) {
  return (
    <div className="grid w-full lg:grid-cols-[320px_1fr]">
      <div className="hidden lg:sticky lg:top-0 lg:block lg:h-screen">
        <BarraPlanos variante="lateral" />
      </div>
      <div className="min-w-0">{children}</div>
    </div>
  )
}
