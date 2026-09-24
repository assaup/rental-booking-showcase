import { calculateTotals, validateDates } from "@/shared/cart/model";
import { getSessionUserId } from "@/server/auth";
import { freeQty } from "@/server/availability";
import { bookings } from "@/server/mock/bookings";
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

const processedKeys = new Map<string, { bookingNumber: string }>();

let counter = 4820;
function generateBookingNumber(): string {
  counter += 1;
  return `NR-${counter}`;
}

export async function POST(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) {
    return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
  }
  const idempotencyKey = request.headers.get("Idempotency-Key");
  if (!idempotencyKey) {
    return NextResponse.json(
      { message: "Заголовок обязательный" },
      { status: 400 },
    );
  }
  const key = `${userId}:${idempotencyKey}`;
  const existing = processedKeys.get(key);
  if (existing) {
    return NextResponse.json(existing, { status: 201 });
  }

  let body: unknown
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Некорректные JSON" }, { status: 400 });
  }
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
    const free = freeQty(found, parsed.data.from, parsed.data.to);
    if (free < requestedItem.qty) {
      conflicts.push({
        id: requestedItem.id,
        requested: requestedItem.qty,
        available: Math.max(0, free),
      });
    }
  }
  if (conflicts.length > 0) {
    return NextResponse.json(
      { message: "Некоторые позиции недоступны на выбранные даты", conflicts },
      { status: 409 },
    );
  }
  if (request.headers.get("X-Simulate-Payment-Failure") === "1") {
    return NextResponse.json(
      { message: "Платёж не прошёл. Попробуйте ещё раз." },
      { status: 502 },
    );
  }

  const cartItems = parsed.data.items.map((requested) => {
    const found = equipment.find((e) => e.id === requested.id)!;
    return {
      id: found.id,
      name: found.name,
      category: found.category,
      pricePerDay: found.pricePerDay,
      deposit: found.deposit,
      qty: requested.qty,
    };
  });
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
    userId,
  });

  processedKeys.set(key, result);

  return NextResponse.json(result, { status: 201 });
}

export async function GET() {
  const userId = await getSessionUserId();

  if (!userId) {
    return NextResponse.json({ message: "Не авторизован" }, { status: 401 });
  }

  return NextResponse.json({
    bookings: bookings.filter((b) => b.userId === userId),
  });
}
