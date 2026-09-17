"use client";

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from "react";
import { cartReducer, type CartAction } from "./reducer";
import { calculateTotals, CartStateSchema, type CartState, type CartTotals } from "./model";

const INITIAL: CartState = { items: [], from: null, to: null };

interface CartContextValue {
  state: CartState;
  totals: CartTotals;
  dispatch: (action: CartAction) => void;
}
function init(): CartState {
  if (typeof window === "undefined") return INITIAL;

  try {
    const saved = localStorage.getItem("cart");
    if (!saved) return INITIAL;
    const parsed = CartStateSchema.safeParse(JSON.parse(saved));
    return parsed.success ? parsed.data : INITIAL;
  } catch {
    return INITIAL;
  }
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, INITIAL, init);
  const totals = calculateTotals(state);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state));
  }, [state]);

  return (
    <CartContext.Provider value={{ state, totals, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);

  if (context === null) {
    throw new Error("useCart должен использоваться внутри CartProvider");
  }

  return context;
}
