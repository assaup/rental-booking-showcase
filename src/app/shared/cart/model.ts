import { z } from "zod";

export const CartItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  pricePerDay: z.number(),
  deposit: z.number(),
  qty: z.number().int().min(1),
});

export const CartStateSchema = z.object({
  items: z.array(CartItemSchema),
  from: z.string().nullable(),
  to: z.string().nullable(),
});

export type CartItem = z.infer<typeof CartItemSchema>;
export type CartState = z.infer<typeof CartStateSchema>;

export interface CartTotals {
  days: number;
  rent: number; // аренда: сумма (цена × qty × дни)
  deposit: number; // залог: сумма (залог × qty), возвращается
  total: number; // к оплате
}

export function countDays(from: string | null, to: string | null): number {
    if (from === null || to === null) return 0
    
    const date1 = new Date(from);
    const date2 = new Date(to);
    const diff = date2.getTime() - date1.getTime()
    if (diff <= 0) return 0
    const diffDays = diff / (1000 * 60 * 60 * 24);
    return diffDays;
}

export function calculateTotals(state: CartState): CartTotals {
  const days = countDays(state.from, state.to);
  const deposit = state.items.reduce(
    (sum, item) => sum + item.deposit * item.qty, 0
  )
  const rent = state.items.reduce(
    (sum, item) => sum + (item.qty * item.pricePerDay * days), 0
  )
  const total = rent + deposit
  return { days, rent, deposit, total}
}
