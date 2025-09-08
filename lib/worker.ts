const BASE_URL = "https://amazon-worker.artxeweb.workers.dev";

export interface VerificadorResponse {
  amazon_url: string;
  verificador_url: string;
  titulo: string | null;
  imagen: string | null;
  precios_destacados: Array<{
    tipo: string;
    precio: string;
    fecha: string;
  }>;
  serie_historica: Array<{
    fecha: string;
    precio: number;
  }>;
  has_serie_historica: boolean;
  tienda: string;
}

export interface AmazonProduct {
  brand: string | null;
  asin: string | null;
  price: number | null;
  stock: string | null;
  title: string | null;
  images: string;
  reviews: Array<{
    id: string;
    title: string;
    author: string;
    rating: number;
    content: string;
  }>;
  category: Array<{
    url: string | null;
    name: string | null;
  }>;
  date: string;
  store_url: string | null;
  description: string | null;
  sales_volume: string | null;
  bullet_points: string | null;
  reviews_count: number | null;
  rating: number | null;
  product_details: Record<string, any>;
  product_overview: any[];
  review_ai_summary: string | null;
  technical_details: any[];
}

export interface AmazonResponse {
  ok: boolean;
  asin: string;
  product: AmazonProduct;
}

export interface AnalysisResponse {
  ok: boolean;
  model: string;
  json: {
    recomendacion: "comprar" | "no_comprar" | "depende";
    argumentos: string;
    analisis_precio: {
      precio_actual: number | null;
      min_180d: number | null;
      media_180d: number | null;
      es_buena_oferta: boolean | null;
      motivo_precio: string;
    };
    pros: string[];
    contras: string[];
    resumen: string;
  };
}

export async function getVerificador(url: string): Promise<VerificadorResponse> {
  const response = await fetch(`${BASE_URL}/verificador?url=${encodeURIComponent(url)}`, {
    cache: "force-cache",
    next: { revalidate: 3600 }
  });
  
  if (!response.ok) {
    throw new Error(`Verificador error: ${response.status}`);
  }
  
  return response.json();
}

export async function getAmazon(url: string): Promise<AmazonResponse> {
  const response = await fetch(`${BASE_URL}/amazon?url=${encodeURIComponent(url)}`, {
    cache: "force-cache",
    next: { revalidate: 3600 }
  });
  
  if (!response.ok) {
    throw new Error(`Amazon error: ${response.status}`);
  }
  
  return response.json();
}

export async function analyze(
  product: AmazonProduct,
  verificador: VerificadorResponse,
  customAsk?: string
): Promise<AnalysisResponse> {
  const response = await fetch(`${BASE_URL}/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      product,
      verificador,
      customAsk,
    }),
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Analysis error: ${errorText}`);
  }
  
  return response.json();
}