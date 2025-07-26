import { useEffect, useState } from "react";
import __ from ":app/utils/core";

// Hook for tool result, example usage:
//
// import { useTool } from ":app/hooks/useTool";
//
// export default function Products() {
//   const data = useTool("feature_search_products_search");
//
//   return (
//     <div>
//       <h3>Produits recommandés</h3>
//       {data ? (
//         <pre>{JSON.stringify(data, null, 2)}</pre>
//       ) : (
//         <div>Aucun produit à afficher pour le moment.</div>
//       )}
//     </div>
//   );
// }

/**
 * Hook to listen to a tool and get the data received from it.
 * Data received from data channel, the event is emitted through
 * the global event emitter (__) by Agent.tsx (prefixed by "tool:").
 * Use this hook to listen to the data received from the tool in your component.
 *
 * @param topic string The topic to listen to (must be a existing tool, not prefixed by "tool:")
 * @returns The data received from the tool
 */
export default function useTool<T = any>(topic: string): T | null {
  const [result, setResult] = useState<T | null>(null);

  useEffect(() => {
    const handler = (data: T) => {
      console.log("useTool - data received:", data);
      setResult(data);
    };

    __.on('tool:' + topic, handler);

    // Clean on unmount
    return () => {
      __.off('tool:' + topic, handler);
    };
  }, [topic]); // Automatically reconnect if the topic changes

  return result;
}
