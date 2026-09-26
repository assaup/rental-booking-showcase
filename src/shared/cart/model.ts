import { z } from "zod";
import { CategorySchema } from "../labels";

export const CartItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  pricePerDay: z.number(),
  deposit: z.number(),
  qty: z.number().int().min(1),
  category: CategorySchema,
});


export const CartStateSchema = z.object({
  items: z.array(CartItemSchema),
  from: z.string().nullable(),
  to: z.string().nullable(),
  extras: z.array(z.string()).default([])
});

export type CartItem = z.infer<typeof CartItemSchema>;
export type CartState = z.infer<typeof CartStateSchema>;

export interface CartTotals {
  days: number;
  rent: number; // аренда: сумма (цена × qty × дни)
  deposit: number; // залог: сумма (залог × qty), возвращается
  total: number; // к оплате
  extras: number;
}

export const EXTRAS = [
  { id: "insurance", name: "Страховка от повреждений", price: 390 },
  { id: "cleaning", name: "Финальная чистка", price: 250 },
] as const;


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
  const extras= state.extras.reduce((sum, id) => {
    const extra = EXTRAS.find((e) => e.id === id)
    return sum + (extra?.price ?? 0)
  }, 0)


  const total = rent + deposit + extras
  return { days, rent, deposit, total, extras }
}


export interface DateRangeError {
  field: 'from' | 'to'
  message: string
}

const MAX_DAYS = 30

export function validateDates(
  from: string | null,
  to: string | null,
): DateRangeError | null {
  if (!from ) return { field : 'from', message: 'Введите дату начала'}
  if (!to ) return { field : 'to', message: 'Введите конечную дату'}

  const today = new Date().toISOString().slice(0,10)
  if (from < today) return { field : 'from', message: 'Дата начала не может быть в прошлом'}
  if (from >= to) return { field : 'to', message: 'Дата возврата должна быть позже даты выдачи'}

  const days = countDays(from, to);
  if (days > MAX_DAYS) return {field: 'from', message: `Максимальный срок аренды — ${MAX_DAYS} дней`}
  return null
}

export const ContactsSchema = z.object({
  name: z.string().min(2, "Укажите имя полностью"),
  phone: z
    .string()
    .regex(/^\+?[0-9\s\-()]{10,18}$/, "Телефон в формате +7 900 000-00-00"),
});

export type Contacts = z.infer<typeof ContactsSchema>;