"use client";

import { useState } from "react";
import { analyze, AmazonProduct, VerificadorResponse, AnalysisResponse } from "@/lib/worker";

interface AiSummaryProps {
  product: AmazonProduct;
  verificador: VerificadorResponse;
}

export default function AiSummary({ product, verificador }: AiSummaryProps) {
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customAsk, setCustomAsk] = useState("");

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await analyze(product, verificador, customAsk || undefined);
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al generar análisis");
    } finally {
      setLoading(false);
    }
  };

  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case "comprar": return "bg-green-100 text-green-800";
      case "no_comprar": return "bg-red-100 text-red-800";
      case "depende": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRecommendationText = (rec: string) => {
    switch (rec) {
      case "comprar": return "Recomendado";
      case "no_comprar": return "No recomendado";
      case "depende": return "Depende";
      default: return rec;
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Análisis con IA</h2>
      
      {!analysis && (
        <div className="space-y-4">
          <p className="text-gray-600 text-sm">
            Obtén un análisis detallado del producto con recomendaciones basadas en IA
          </p>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pregunta específica (opcional)
            </label>
            <textarea
              value={customAsk}
              onChange={(e) => setCustomAsk(e.target.value)}
              placeholder="¿Es bueno para gaming? ¿Vale la pena el precio? etc."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
              rows={3}
            />
          </div>
          
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50"
          >
            {loading ? "Analizando..." : "Generar Análisis IA"}
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 text-sm">{error}</p>
          <button
            onClick={handleAnalyze}
            className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
          >
            Reintentar
          </button>
        </div>
      )}

      {analysis && (
        <div className="space-y-4">
          {/* Recomendación */}
          <div className="text-center">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRecommendationColor(analysis.json.recomendacion)}`}>
              {getRecommendationText(analysis.json.recomendacion)}
            </span>
          </div>

          {/* Resumen */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Resumen</h3>
            <p className="text-blue-800 text-sm">{analysis.json.resumen}</p>
          </div>

          {/* Argumentos */}
          <div>
            <h3 className="font-semibold mb-2">Argumentos</h3>
            <p className="text-gray-700 text-sm">{analysis.json.argumentos}</p>
          </div>

          {/* Análisis de precio */}
          {analysis.json.analisis_precio && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold mb-3">Análisis de Precio</h3>
              <div className="space-y-2 text-sm">
                {analysis.json.analisis_precio.precio_actual && (
                  <div className="flex justify-between">
                    <span>Precio actual:</span>
                    <span className="font-medium">€{analysis.json.analisis_precio.precio_actual.toFixed(2)}</span>
                  </div>
                )}
                {analysis.json.analisis_precio.min_180d && (
                  <div className="flex justify-between">
                    <span>Mínimo 180d:</span>
                    <span className="font-medium">€{analysis.json.analisis_precio.min_180d.toFixed(2)}</span>
                  </div>
                )}
                {analysis.json.analisis_precio.media_180d && (
                  <div className="flex justify-between">
                    <span>Media 180d:</span>
                    <span className="font-medium">€{analysis.json.analisis_precio.media_180d.toFixed(2)}</span>
                  </div>
                )}
                {analysis.json.analisis_precio.es_buena_oferta !== null && (
                  <div className="flex justify-between">
                    <span>¿Buena oferta?</span>
                    <span className={`font-medium ${analysis.json.analisis_precio.es_buena_oferta ? 'text-green-600' : 'text-red-600'}`}>
                      {analysis.json.analisis_precio.es_buena_oferta ? 'Sí' : 'No'}
                    </span>
                  </div>
                )}
                {analysis.json.analisis_precio.motivo_precio && (
                  <p className="text-gray-600 mt-2">{analysis.json.analisis_precio.motivo_precio}</p>
                )}
              </div>
            </div>
          )}

          {/* Pros y Contras */}
          <div className="grid sm:grid-cols-2 gap-4">
            {analysis.json.pros.length > 0 && (
              <div>
                <h3 className="font-semibold text-green-700 mb-2">✓ Pros</h3>
                <ul className="space-y-1">
                  {analysis.json.pros.map((pro, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {analysis.json.contras.length > 0 && (
              <div>
                <h3 className="font-semibold text-red-700 mb-2">✗ Contras</h3>
                <ul className="space-y-1">
                  {analysis.json.contras.map((contra, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      {contra}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Botón para nuevo análisis */}
          <button
            onClick={() => {
              setAnalysis(null);
              setCustomAsk("");
            }}
            className="btn-secondary w-full text-sm"
          >
            Nuevo Análisis
          </button>
        </div>
      )}
    </div>
  );
}