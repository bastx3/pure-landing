"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { detectStore } from "@/lib/store";

export default function SearchBar() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    try {
      const store = detectStore(url);
      const slug = generateSlug(url);
      const searchParams = new URLSearchParams({ url: url.trim() });
      
      router.push(`/tienda/${store}/${slug}?${searchParams.toString()}`);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Pega aquí la URL del producto (Amazon, Carrefour, MediaMarkt...)"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={loading}
        />
      </div>
      
      <button
        type="submit"
        disabled={loading || !url.trim()}
        className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Analizando..." : "Consultar Precios"}
      </button>
      
      <p className="text-sm text-gray-500">
        Soportamos URLs de Amazon.es, Carrefour.es, MediaMarkt.es y más tiendas
      </p>
    </form>
  );
}

function generateSlug(url: string): string {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.replace("www.", "");
    const pathParts = urlObj.pathname.split("/").filter(Boolean);
    
    // Generar slug basado en la URL
    if (pathParts.length > 0) {
      return pathParts[pathParts.length - 1].slice(0, 50);
    }
    
    return hostname.replace(/\./g, "-");
  } catch {
    return "producto";
  }
}