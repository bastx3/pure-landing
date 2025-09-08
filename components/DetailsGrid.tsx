import { AmazonProduct } from "@/lib/worker";

interface DetailsGridProps {
  product: AmazonProduct;
}

export default function DetailsGrid({ product }: DetailsGridProps) {
  const images = product.images ? product.images.split(",").filter(Boolean) : [];

  return (
    <div className="space-y-6">
      {/* Información básica */}
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Detalles del Producto</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {product.asin && (
            <div>
              <span className="font-medium text-gray-700">ASIN:</span>
              <span className="ml-2">{product.asin}</span>
            </div>
          )}
          {product.brand && (
            <div>
              <span className="font-medium text-gray-700">Marca:</span>
              <span className="ml-2">{product.brand}</span>
            </div>
          )}
          {product.sales_volume && (
            <div>
              <span className="font-medium text-gray-700">Ventas:</span>
              <span className="ml-2">{product.sales_volume}</span>
            </div>
          )}
          {product.stock && (
            <div>
              <span className="font-medium text-gray-700">Stock:</span>
              <span className="ml-2">{product.stock}</span>
            </div>
          )}
        </div>
      </div>

      {/* Descripción */}
      {product.description && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Descripción</h2>
          <p className="text-gray-700 leading-relaxed">{product.description}</p>
        </div>
      )}

      {/* Puntos clave */}
      {product.bullet_points && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Características Principales</h2>
          <div className="prose prose-sm max-w-none">
            <div dangerouslySetInnerHTML={{ __html: product.bullet_points }} />
          </div>
        </div>
      )}

      {/* Galería de imágenes */}
      {images.length > 1 && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Galería de Imágenes</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.slice(1).map((image, index) => (
              <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={image}
                  alt={`Imagen ${index + 2}`}
                  className="w-full h-full object-contain hover:scale-105 transition-transform cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detalles técnicos */}
      {product.product_details && Object.keys(product.product_details).length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Detalles Técnicos</h2>
          <div className="space-y-2">
            {Object.entries(product.product_details).map(([key, value]) => (
              <div key={key} className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
                <span className="font-medium text-gray-700">{key}:</span>
                <span className="text-gray-600">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resumen de reseñas con IA */}
      {product.review_ai_summary && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Resumen de Reseñas (IA)</h2>
          <p className="text-gray-700 leading-relaxed">{product.review_ai_summary}</p>
        </div>
      )}

      {/* Categorías */}
      {product.category && product.category.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">Categorías</h2>
          <div className="flex flex-wrap gap-2">
            {product.category.map((cat, index) => (
              <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                {cat.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}