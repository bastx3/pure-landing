import { VerificadorResponse, AmazonProduct } from "@/lib/worker";
import { Store, getStoreConfig } from "@/lib/store";
import StoreBadge from "./StoreBadge";

interface ProductCardProps {
  verificador: VerificadorResponse;
  product?: AmazonProduct | null;
  store: Store;
}

export default function ProductCard({ verificador, product, store }: ProductCardProps) {
  const title = product?.title || verificador.titulo || "Producto sin título";
  const image = product?.images?.split(",")[0] || verificador.imagen;
  const price = product?.price;
  const rating = product?.rating;
  const reviewsCount = product?.reviews_count;

  return (
    <div className="card">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Imagen */}
        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
          {image ? (
            <img
              src={image}
              alt={title}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span>Sin imagen</span>
            </div>
          )}
        </div>

        {/* Información */}
        <div className="space-y-4">
          <div>
            <StoreBadge store={store} />
            <h1 className="text-2xl font-bold mt-2 leading-tight">
              {title}
            </h1>
          </div>

          {product?.brand && (
            <p className="text-gray-600">
              <span className="font-medium">Marca:</span> {product.brand}
            </p>
          )}

          {price && (
            <div className="text-3xl font-bold text-green-600">
              €{price.toFixed(2)}
            </div>
          )}

          {rating && (
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-lg ${
                      i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-gray-600">
                {rating.toFixed(1)} ({reviewsCount?.toLocaleString()} reseñas)
              </span>
            </div>
          )}

          {product?.stock && (
            <p className="text-sm text-gray-600">
              <span className="font-medium">Stock:</span> {product.stock}
            </p>
          )}

          <div className="pt-4">
            <a
              href={verificador.verificador_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-block"
            >
              Ver en tienda
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}