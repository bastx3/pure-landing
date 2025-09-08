export type Store = "amazon" | "carrefour" | "mediamarkt" | "unknown";

export function detectStore(url: string): Store {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    
    if (hostname.includes("amazon")) return "amazon";
    if (hostname.includes("carrefour")) return "carrefour";
    if (hostname.includes("mediamarkt")) return "mediamarkt";
    
    return "unknown";
  } catch {
    return "unknown";
  }
}

export function getStoreConfig(store: Store) {
  const configs = {
    amazon: {
      name: "Amazon",
      color: "amber",
      bgClass: "bg-amber-100",
      textClass: "text-amber-800",
      borderClass: "border-amber-200",
    },
    carrefour: {
      name: "Carrefour",
      color: "blue",
      bgClass: "bg-blue-100",
      textClass: "text-blue-800",
      borderClass: "border-blue-200",
    },
    mediamarkt: {
      name: "MediaMarkt",
      color: "red",
      bgClass: "bg-red-100",
      textClass: "text-red-800",
      borderClass: "border-red-200",
    },
    unknown: {
      name: "Tienda",
      color: "gray",
      bgClass: "bg-gray-100",
      textClass: "text-gray-800",
      borderClass: "border-gray-200",
    },
  };

  return configs[store];
}