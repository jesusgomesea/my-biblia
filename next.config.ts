import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Router Cache: navegação entre capítulos já visitados vira zero-latency
  // porque o Next reutiliza o HTML/RSC em cache no cliente antes de bater no
  // servidor. Dez minutos para páginas estáticas é seguro — nossos dados
  // bíblicos mudam raramente e revalidam por 7 dias no fetch.
  experimental: {
    staleTimes: {
      dynamic: 60,
      static: 600,
    },
  },
};

export default nextConfig;
