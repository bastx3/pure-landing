import { Metadata } from "next";
import { getVerificador, getAmazon } from "@/lib/worker";
import { detectStore } from "@/lib/store";
import ProductCard from "@/components/ProductCard";
import HighlightsGrid from "@/components/HighlightsGrid";
import PriceHistoryChart from "@/components/PriceHistoryChart";
import DetailsGrid from "@/components/DetailsGrid";
import AiSummary from "@/components/AiSummary";

interface PageProps {
  searchParams: { urlA?: string; urlB?: string };
}

export const metadata: Metadata = {
  title: "Comparar Productos - Comparaelprecio",
  description: "Compara precios e historiales entre dos productos de diferentes tiendas",
  openGraph: {
    title: "Comparar Productos - Comparaelprecio",
    description: "Compara precios e historiales entre dos productos",
  },
};

export default async function ComparePage({ searchParams }: PageProps) {
  const { urlA, urlB } = searchParams;

  if (!urlA || !urlB) {
    return (
      <div className="container py-8">
        <div className="card text-center">
          <h1 className="text-2xl font-bold mb-4">Comparar Productos</h1>
          <p className="text-gray-600 mb-6">
            Para usar esta función, necesitas proporcionar dos URLs de productos en los parámetros urlA y urlB.
          </p>
          <a href="/" className="btn-primary">
            Volver al inicio
          </a>
        </div>
      </div>
    );
  }

  try {
    // Obtener datos de ambos productos en paralelo
    const [verificadorA, verificadorB] = await Promise.all([
      getVerificador(urlA),
      getVerificador(urlB),
    ]);

    const storeA = detectStore(urlA);
    const storeB = detectStore(urlB);

    // Obtener datos de Amazon si corresponde
    const [amazonDataA, amazonDataB] = await Promise.all([
      storeA === "amazon" ? getAmazon(urlA).catch(() => null) : Promise.resolve(null),
      storeB === "amazon" ? getAmazon(urlB).catch(() => null) : Promise.resolve(null),
    ]);

    return (
      <div className="container py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Comparar Productos</h1>
          <p className="text-gray-600">
            Compara precios, historiales y características entre dos productos
          </p>
        </div>

        {/* Comparación lado a lado */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Producto A */}
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-blue-600 mb-4">Producto A</h2>
            </div>
            
            <ProductCard 
              verificador={verificadorA} 
              product={amazonDataA?.product} 
              store={storeA}
            />
            
            <HighlightsGrid precios={verificadorA.precios_destacados} />
            
            {verificadorA.has_serie_historica && (
              <div className="card">
                <h3 className="text-lg font-semibold mb-4">Historial de Precios</h3>
                <PriceHistoryChart data={verificadorA.serie_historica} />
              </div>
            )}
            
            {amazonDataA?.product && (
              <>
                <DetailsGrid product={amazonDataA.product} />
                <AiSummary 
                  product={amazonDataA.product} 
                  verificador={verificadorA} 
                />
              </>
            )}
          </div>

          {/* Producto B */}
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-green-600 mb-4">Producto B</h2>
            </div>
            
            <ProductCard 
              verificador={verificadorB} 
              product={amazonDataB?.product} 
              store={storeB}
            />
            
            <HighlightsGrid precios={verificadorB.precios_destacados} />
            
            {verificadorB.has_serie_historica && (
              <div className="card">
                <h3 className="text-lg font-semibold mb-4">Historial de Precios</h3>
                <PriceHistoryChart data={verificadorB.serie_historica} />
              </div>
            )}
            
            {amazonDataB?.product && (
              <>
                <DetailsGrid product={amazonDataB.product} />
                <AiSummary 
                  product={amazonDataB.product} 
                  verificador={verificadorB} 
                />
              </>
            )}
          </div>
        </div>

        {/* Resumen de comparación */}
        <div className="mt-12 card">
          <h2 className="text-xl font-semibold mb-4">Resumen de Comparación</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-blue-600 mb-2">Producto A</h3>
              <p className="text-sm text-gray-600 mb-2">{verificadorA.titulo}</p>
              <p className="text-lg font-semibold">
                {amazonDataA?.product?.price ? `€${amazonDataA.product.price.toFixed(2)}` : "Precio no disponible"}
              </p>
            </div>
            <div>
              <h3 className="font-medium text-green-600 mb-2">Producto B</h3>
              <p className="text-sm text-gray-600 mb-2">{verificadorB.titulo}</p>
              <p className="text-lg font-semibold">
                {amazonDataB?.product?.price ? `€${amazonDataB.product.price.toFixed(2)}` : "Precio no disponible"}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error comparing products:", error);
    
    return (
      <div className="container py-8">
        <div className="card text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error al comparar productos</h1>
          <p className="text-gray-600 mb-6">
            No se pudieron obtener los datos de uno o ambos productos. Verifica las URLs e inténtalo de nuevo.
          </p>
          <a href="/" className="btn-primary">
            Volver al inicio
          </a>
        </div>
      </div>
    );
  }
}