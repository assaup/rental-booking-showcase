import { ApiError, throwApiError } from "./error";
import { CartItem, CartTotals } from "@/app/shared/cart/model";

export interface BookingPayload {
  from: string;
  to: string;
  items: { id: string; qty: number }[];
  extras: string[];
  contacts: { name: string; phone: string };
}

const BASE_URL = "http://localhost:3000";

export interface Conflict {
  id: string;
  requested: number;
  available: number;
}
export interface BookingError {
  message: string;
  conflicts?: Conflict[];
}
export interface Booking {
  bookingNumber: string;
  createdAt: string;
  from: string;
  to: string;
  items: CartItem[];
  extras: string[];
  contacts: { name: string; phone: string };
  totals: CartTotals;
}

export async function createBooking(
  payload: BookingPayload,
  idempotencyKey: string,
): Promise<{ bookingNumber: string }> {
  const res = await fetch(`${BASE_URL}/api/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) await throwApiError(res);
  return res.json();
}

export async function getBookings(cookieHeader: string): Promise<Booking[]> {

  const res = await fetch(`${BASE_URL}/api/bookings`, {
    headers: { Cookie: cookieHeader },
    cache: "no-store",
  });
  
  if (!res.ok) await throwApiError(res);

  const data = await res.json()
  return data.bookings

}
