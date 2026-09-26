import { BASE_URL } from "./config";
import { throwApiError } from "./error";
import { type CartItem, type CartTotals } from "@/shared/cart/model";

export interface BookingPayload {
  from: string;
  to: string;
  items: { id: string; qty: number }[];
  extras: string[];
  contacts: { name: string; phone: string };
}

export interface Conflict {
  id: string;
  requested: number;
  available: number;
}
export interface BookingError {
  status: number;
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
export const bookings: Booking[] = [];

export async function createBooking(
  payload: BookingPayload,
  idempotencyKey: string,
  simulateFailure: boolean = false,
): Promise<{ bookingNumber: string }> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Idempotency-Key": idempotencyKey,
  };
  if (simulateFailure) {
    headers["X-Simulate-Payment-Failure"] = "1";
  }

  const res = await fetch(`${BASE_URL}/api/bookings`, {
    method: "POST",
    headers: headers,
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

  const data = await res.json();
  return data.bookings;
}
