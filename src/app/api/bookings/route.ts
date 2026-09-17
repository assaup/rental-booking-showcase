import { validateDates } from "@/app/shared/cart/model";
import { NextResponse } from "next/server";
import { z } from "zod";

const BookingRequestSchema = z.object({
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  items: z.array(
    z.object({
      id: z.string(),
      qty: z.number().int().min(1),
    })
  ).min(1),
  extras: z.array(z.string()).default([]),
  contacts: z.object({
    name: z.string().min(2),
    phone: z.string().min(10),
  }),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = BookingRequestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Некорректные данные", issues: parsed.error.issues },
      { status: 400 }
    );
  }
  const dateError = validateDates(parsed.data.from, parsed.data.to)
  if (dateError){
    return NextResponse.json(
        { message: dateError.message, field: dateError.field },
        { status: 400 }
    )
  }

  return NextResponse.json({ bookingNumber: "NR-0001" }, { status: 201 })

}