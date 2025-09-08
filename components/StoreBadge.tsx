import { Store, getStoreConfig } from "@/lib/store";

interface StoreBadgeProps {
  store: Store;
}

export default function StoreBadge({ store }: StoreBadgeProps) {
  const config = getStoreConfig(store);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bgClass} ${config.textClass}`}>
      {config.name}
    </span>
  );
}