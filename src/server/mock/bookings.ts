import type { CartItem, CartTotals } from "@/shared/cart/model";

export interface Booking {
  bookingNumber: string;
  createdAt: string;
  from: string;
  to: string;
  items: CartItem[];
  extras: string[];
  contacts: { name: string; phone: string };
  totals: CartTotals;
  userId: string;
}

export const bookings: Booking[] = [];