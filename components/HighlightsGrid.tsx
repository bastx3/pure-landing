interface HighlightsGridProps {
  precios: Array<{
    tipo: string;
    precio: string;
    fecha: string;
  }>;
}

export default function HighlightsGrid({ precios }: HighlightsGridProps) {
  if (!precios || precios.length === 0) {
    return (
      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Precios Destacados</h2>
        <p className="text-gray-500">No hay datos de precios disponibles</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Precios Destacados</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {precios.map((precio, index) => (
          <div key={index} className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">{precio.tipo}</div>
            <div className="text-xl font-bold text-green-600 mb-1">
              {precio.precio}
            </div>
            <div className="text-xs text-gray-500">{precio.fecha}</div>
          </div>
        ))}
      </div>
    </div>
  );
}