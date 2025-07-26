import { useConnectionState } from "@livekit/components-react";
import { ConnectionState } from "livekit-client";
import SearchProducts from "./tools/SearchProducts";
import Cart from "./tools/Cart";

export default function ToolContent() {
  const roomState = useConnectionState();

  if (roomState !== ConnectionState.Connected) return null;

  return (
    <div className="w-full m-10 flex flex-col items-center justify-center">
      <Cart />
      <SearchProducts />
    </div>
  );
}