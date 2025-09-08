import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Comparaelprecio - Compara precios entre Amazon, Carrefour y MediaMarkt",
  description: "Consulta historiales de precios de productos en Amazon, Carrefour y MediaMarkt. Análisis con IA y comparativas de precios en tiempo real.",
  keywords: ["comparar precios", "Amazon", "Carrefour", "MediaMarkt", "historial precios", "ofertas"],
  openGraph: {
    title: "Comparaelprecio - Compara precios entre tiendas",
    description: "Consulta historiales de precios de productos en Amazon, Carrefour y MediaMarkt",
    type: "website",
    locale: "es_ES",
  },
  twitter: {
    card: "summary_large_image",
    title: "Comparaelprecio - Compara precios entre tiendas",
    description: "Consulta historiales de precios de productos en Amazon, Carrefour y MediaMarkt",
  },
  alternates: {
    canonical: "https://comparaelprecio.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
      </body>
    </html>
  );
}