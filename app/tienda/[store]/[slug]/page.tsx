import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getVerificador, getAmazon } from "@/lib/worker";
import { detectStore } from "@/lib/store";
import ProductCard from "@/components/ProductCard";
import HighlightsGrid from "@/components/HighlightsGrid";
import PriceHistoryChart from "@/components/PriceHistoryChart";
import DetailsGrid from "@/components/DetailsGrid";
import AiSummary from "@/components/AiSummary";

interface PageProps {
  params: { store: string; slug: string };
  searchParams: { url?: string };
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  if (!searchParams.url) {
    return {
      title: "Producto no encontrado - Comparaelprecio",
      description: "No se pudo encontrar el producto solicitado",
    };
  }

  try {
    const verificador = await getVerificador(searchParams.url);
    const title = verificador.titulo || "Producto";
    
    return {
      title: `${title} - Comparaelprecio`,
      description: `Consulta el historial de precios de ${title} y compara ofertas`,
      openGraph: {
        title: `${title} - Comparaelprecio`,
        description: `Historial de precios y análisis de ${title}`,
        images: verificador.imagen ? [verificador.imagen] : [],
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} - Comparaelprecio`,
        description: `Historial de precios y análisis de ${title}`,
        images: verificador.imagen ? [verificador.imagen] : [],
      },
    };
  } catch {
    return {
      title: "Error al cargar producto - Comparaelprecio",
      description: "No se pudo cargar la información del producto",
    };
  }
}

export default async function ProductPage({ params, searchParams }: PageProps) {
  if (!searchParams.url) {
    notFound();
  }

  try {
    const verificador = await getVerificador(searchParams.url);
    const store = detectStore(searchParams.url);
    
    // Solo llamar a Amazon si es una tienda Amazon
    let amazonData = null;
    if (store === "amazon") {
      try {
        amazonData = await getAmazon(searchParams.url);
      } catch (error) {
        console.error("Error fetching Amazon data:", error);
      }
    }

    return (
      <div className="container py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-600">
          <a href="/" className="hover:text-blue-600">Inicio</a>
          <span className="mx-2">/</span>
          <span className="capitalize">{params.store}</span>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Producto</span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-6">
            <ProductCard 
              verificador={verificador} 
              product={amazonData?.product} 
              store={store}
            />
            
            <HighlightsGrid precios={verificador.precios_destacados} />
            
            {verificador.has_serie_historica && (
              <div className="card">
                <h2 className="text-xl font-semibold mb-4">Historial de Precios</h2>
                <PriceHistoryChart data={verificador.serie_historica} />
              </div>
            )}
            
            {amazonData?.product && (
              <DetailsGrid product={amazonData.product} />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {amazonData?.product && (
              <AiSummary 
                product={amazonData.product} 
                verificador={verificador} 
              />
            )}
          </div>
        </div>

        {/* JSON-LD */}
        {amazonData?.product && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Product",
                name: amazonData.product.title,
                image: amazonData.product.images?.split(",")[0],
                brand: amazonData.product.brand,
                sku: amazonData.product.asin,
                offers: {
                  "@type": "Offer",
                  price: amazonData.product.price,
                  priceCurrency: "EUR",
                  availability: "https://schema.org/InStock",
                },
                aggregateRating: amazonData.product.rating ? {
                  "@type": "AggregateRating",
                  ratingValue: amazonData.product.rating,
                  reviewCount: amazonData.product.reviews_count,
                } : undefined,
              }),
            }}
          />
        )}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Inicio",
                  item: "https://comparaelprecio.com",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: params.store.charAt(0).toUpperCase() + params.store.slice(1),
                  item: `https://comparaelprecio.com/tienda/${params.store}`,
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: verificador.titulo || "Producto",
                },
              ],
            }),
          }}
        />
      </div>
    );
  } catch (error) {
    console.error("Error loading product:", error);
    
    return (
      <div className="container py-8">
        <div className="card text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error al cargar el producto</h1>
          <p className="text-gray-600 mb-6">
            No se pudo obtener la información del producto. Por favor, verifica la URL e inténtalo de nuevo.
          </p>
          <a href="/" className="btn-primary">
            Volver al inicio
          </a>
        </div>
      </div>
    );
  }
}