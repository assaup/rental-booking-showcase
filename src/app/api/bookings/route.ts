import { calculateTotals, type CartItem, type CartTotals, validateDates } from "@/app/shared/cart/model";
import { equipment } from "@/server/mock/equipment";
import { NextResponse } from "next/server";
import { z } from "zod";

const BookingRequestSchema = z.object({
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  items: z
    .array(
      z.object({
        id: z.string(),
        qty: z.number().int().min(1),
      }),
    )
    .min(1),
  extras: z.array(z.string()).default([]),
  contacts: z.object({
    name: z.string().min(2),
    phone: z.string().min(10),
  }),
});

interface Booking {
  bookingNumber: string;
  createdAt: string;
  from: string;
  to: string;
  items: CartItem[];
  extras: string[];
  contacts: { name: string; phone: string };
  totals: CartTotals;
}

const bookings: Booking[] = [];
const processedKeys = new Map<string, { bookingNumber: string }>();

let counter = 4820;
function generateBookingNumber(): string {
  counter += 1;
  return `NR-${counter}`;
}

export async function POST(request: Request) {
  const idempotencyKey = request.headers.get("Idempotency-Key");
  if (idempotencyKey) {
    const existing = processedKeys.get(idempotencyKey);
    if (existing) {
      return NextResponse.json(existing, { status: 201 });
    }
  }

  const body = await request.json();
  const parsed = BookingRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Некорректные данные", issues: parsed.error.issues },
      { status: 400 },
    );
  }
  const dateError = validateDates(parsed.data.from, parsed.data.to);
  if (dateError) {
    return NextResponse.json(
      { message: dateError.message, field: dateError.field },
      { status: 400 },
    );
  }

  const conflicts: { id: string; requested: number; available: number }[] = [];
  for (const requestedItem of parsed.data.items) {
    const found = equipment.find((item) => item.id === requestedItem.id);

    if (!found) {
      conflicts.push({
        id: requestedItem.id,
        requested: requestedItem.qty,
        available: 0,
      });
      continue;
    }
    if (found.stock < requestedItem.qty) {
      conflicts.push({
        id: requestedItem.id,
        requested: requestedItem.qty,
        available: found.stock,
      });
    }
  }
  if (conflicts.length > 0) {
    return NextResponse.json(
      { message: "Некоторые позиции недоступны на выбранные даты", conflicts },
      { status: 409 },
    );
  }

  

  const cartItems = parsed.data.items.map((requested) => {
    const found = equipment.find((e) => e.id === requested.id)!
    return {
      id: found.id,
      name: found.name,
      category: found.category,
      pricePerDay: found.pricePerDay,
      deposit: found.deposit,
      qty: requested.qty,
    }
  })
  const totals = calculateTotals({
    items: cartItems,
    from: parsed.data.from,
    to: parsed.data.to,
    extras: parsed.data.extras,
  });
  const result = { bookingNumber: generateBookingNumber() };

  bookings.push({
    bookingNumber: result.bookingNumber,
    createdAt: new Date().toISOString(),
    from: parsed.data.from,
    to: parsed.data.to,
    items: cartItems,
    extras: parsed.data.extras,
    contacts: parsed.data.contacts,
    totals,
  });

  if (idempotencyKey) {
    processedKeys.set(idempotencyKey, result);
  }
  return NextResponse.json(result, { status: 201 });
}

export async function GET() {
  return NextResponse.json({ bookings });
}