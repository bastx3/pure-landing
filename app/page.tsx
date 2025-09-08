import SearchBar from "@/components/SearchBar";

export default function HomePage() {
  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Comparaelprecio
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Consulta historiales de precios en Amazon, Carrefour y MediaMarkt
        </p>
        
        <div className="max-w-2xl mx-auto">
          <SearchBar />
        </div>
        
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="card text-center">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-amber-600 font-bold">A</span>
            </div>
            <h3 className="font-semibold mb-2">Amazon</h3>
            <p className="text-gray-600 text-sm">
              Historial completo de precios y análisis con IA
            </p>
          </div>
          
          <div className="card text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-blue-600 font-bold">C</span>
            </div>
            <h3 className="font-semibold mb-2">Carrefour</h3>
            <p className="text-gray-600 text-sm">
              Seguimiento de precios y ofertas destacadas
            </p>
          </div>
          
          <div className="card text-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-red-600 font-bold">M</span>
            </div>
            <h3 className="font-semibold mb-2">MediaMarkt</h3>
            <p className="text-gray-600 text-sm">
              Comparativa de precios en electrónicos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}