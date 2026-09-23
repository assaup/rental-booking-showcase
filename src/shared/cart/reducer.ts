import { type CartItem, type CartState } from "./model";

export type CartAction =
  | { type: "add"; item: Omit<CartItem, "qty"> }
  | { type: "remove"; id: string }
  | { type: "setQty"; id: string; qty: number }
  | { type: "setDates"; from: string | null; to: string | null }
  | { type: "clear" }
  | { type: 'toggleExtra'; id: string}

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "add": {
      const existing = state.items.find((item) => item.id === action.item.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.item.id ? { ...item, qty: item.qty + 1 } : item,
          ),
        };
      } else {
        return {
          ...state,
          items: [...state.items, { ...action.item, qty: 1 }],
        };
      }
    }
    case "remove":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.id),
      };

    case "setQty":
      if (action.qty <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.id !== action.id),
        };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.id ? { ...item, qty: action.qty } : item,
        ),
      };
    case "setDates":
      return {
        ...state,
        from: action.from,
        to: action.to,
      };
    case "clear":
      return {
        ...state,
        items: [],
      };
    case 'toggleExtra': {
      const selected = state.extras.includes(action.id)
      return {
        ...state,
        extras: selected
            ? state.extras.filter((id) => id !== action.id)
            : [ ...state.extras, action.id]
      }
    }

    default:
      return state;
  }
}
