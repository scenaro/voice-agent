// Tools used:
// feature_search_products_search
// feature_search_products_highlight

import __ from ":app/utils/core";
import useTool from ":app/hooks/useTool";
import { cn } from ":app/utils/cn";

__ .on('tool:feature_search_products_search', (data: any) => {
  console.log("feature_search_products_search - data received:", data);
});

__ .on('tool:feature_search_products_highlight', (data: any) => {
  console.log("feature_search_products_highlight - data received:", data);
});

export default function SearchProducts() {
  const dataProducts = useTool("feature_search_products_search");

  if (!dataProducts?.products) return null;

  const products = dataProducts.products;

  const dataHighlight = useTool("feature_search_products_highlight");
  const highlightIds = dataHighlight?.product_ids;

  return (
    <div className="w-full m-10 flex flex-col">
      <h2>Produits</h2>
      {products.map((product: any) => (
        <div key={product.id} className={cn("flex flex-row gap-2 m-2", {
          "bg-blue-100": highlightIds?.includes(product.id),
        })}>
          <div>#{product.id}</div>
          <div>{product.presentation}</div>
        </div>
      ))}
    </div>
  );
}