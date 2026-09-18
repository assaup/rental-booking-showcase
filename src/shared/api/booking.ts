import { throwApiError } from "./error";

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

  if (!res.ok) await throwApiError(res)
  return res.json();
  
}


