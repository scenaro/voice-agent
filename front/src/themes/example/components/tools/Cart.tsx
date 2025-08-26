import useTool from ":app/hooks/useTool";
import { useEffect, useState } from "preact/hooks";


export default function Cart() {
  const dataAdd = useTool("data_bucket_cart_add");
  const dataRemove = useTool("data_bucket_cart_remove");
  const dataReplace = useTool("data_bucket_cart_replace");

  const [count, setCount] = useState(0);
  const [cart, setCart] = useState<string[]>([]);

  console.log("cart:", cart);
  useEffect(() => {
    if (dataAdd) {
      console.log("data_bucket_cart_add - data received:", dataAdd);
      // dataAdd contient maintenant directement un array de product_ids
      const newItems = Array.isArray(dataAdd) ? dataAdd : [];
      setCart([...cart, ...newItems]);
      setCount(cart.length + newItems.length);
    }
  }, [dataAdd]);

  useEffect(() => {
    if (dataRemove) {
      console.log("data_bucket_cart_remove - data received:", dataRemove);
      // dataRemove contient maintenant directement un array de product_ids
      const itemsToRemove: string[] = Array.isArray(dataRemove) ? dataRemove : [];
      let newCart = [...cart];
      itemsToRemove.forEach((id: string) => {
        newCart = rmItem(newCart, id);
      });
      setCart(newCart);
      setCount(newCart.length);
    }
  }, [dataRemove]);

  useEffect(() => {
    if (dataReplace) {
      console.log("data_bucket_cart_replace - data received:", dataReplace);
      // dataReplace contient maintenant {product_ids: [...], new_product_ids: [...]}
      const oldIds: string[] = dataReplace.product_ids || [];
      const newIds: string[] = dataReplace.new_product_ids || [];

      let newCart = [...cart];
      // Supprimer les anciens IDs
      oldIds.forEach((id: string) => {
        newCart = rmItem(newCart, id);
      });
      // Ajouter les nouveaux IDs
      newCart = [...newCart, ...newIds];

      setCart(newCart);
      setCount(newCart.length);
    }
  }, [dataReplace]);

  return (
    <div className="m-10 bg-orange-100">
      Panier: {count}
      <ul>
        {cart.map((id, i) => (
          <li key={id + '-' + i}>{id}</li>
        ))}
      </ul>
    </div>
  );
}

// -----------------------------------------------------------------------------

function rmItem(arr: string[], item: string) {
  const index = arr.indexOf(item);
  if (index > -1) {
    arr.splice(index, 1);
  }

  return arr;
}