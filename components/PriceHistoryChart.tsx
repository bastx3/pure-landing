"use client";

interface PriceHistoryChartProps {
  data: Array<{
    fecha: string;
    precio: number;
  }>;
}

export default function PriceHistoryChart({ data }: PriceHistoryChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        Sin datos históricos disponibles
      </div>
    );
  }

  // Preparar datos para el gráfico
  const sortedData = [...data].sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
  const prices = sortedData.map(d => d.precio);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice || 1;

  // Dimensiones del SVG
  const width = 800;
  const height = 300;
  const padding = 40;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;

  // Generar puntos para la línea
  const points = sortedData.map((item, index) => {
    const x = padding + (index / (sortedData.length - 1)) * chartWidth;
    const y = padding + ((maxPrice - item.precio) / priceRange) * chartHeight;
    return { x, y, ...item };
  });

  const pathData = points.map((point, index) => 
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ');

  return (
    <div className="w-full overflow-x-auto">
      <svg width={width} height={height} className="min-w-full">
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#f3f4f6" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width={width} height={height} fill="url(#grid)" />
        
        {/* Ejes */}
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="#6b7280" strokeWidth="2" />
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#6b7280" strokeWidth="2" />
        
        {/* Etiquetas del eje Y */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
          const price = minPrice + ratio * priceRange;
          const y = padding + (1 - ratio) * chartHeight;
          return (
            <g key={index}>
              <line x1={padding - 5} y1={y} x2={padding} y2={y} stroke="#6b7280" strokeWidth="1" />
              <text x={padding - 10} y={y + 4} textAnchor="end" fontSize="12" fill="#6b7280">
                €{price.toFixed(0)}
              </text>
            </g>
          );
        })}
        
        {/* Línea del gráfico */}
        <path d={pathData} fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* Puntos */}
        {points.map((point, index) => (
          <g key={index}>
            <circle cx={point.x} cy={point.y} r="4" fill="#3b82f6" stroke="white" strokeWidth="2" />
            <title>{`${point.fecha}: €${point.precio.toFixed(2)}`}</title>
          </g>
        ))}
        
        {/* Etiquetas del eje X (solo algunas fechas) */}
        {points.filter((_, index) => index % Math.ceil(points.length / 5) === 0).map((point, index) => (
          <text key={index} x={point.x} y={height - padding + 20} textAnchor="middle" fontSize="12" fill="#6b7280">
            {new Date(point.fecha).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
          </text>
        ))}
      </svg>
    </div>
  );
}