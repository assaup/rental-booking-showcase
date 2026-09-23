import { NextResponse } from "next/server";
import { equipment } from "@/server/mock/equipment";
import { freeQty } from "@/server/availability";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const { searchParams } = new URL(request.url)

  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const found = equipment.find((item) => item.id === id);

  if (!found) {
    return NextResponse.json(
      { message: "Позиция не найдена" },
      { status: 404 },
    );
  }
  const free = from && to ? freeQty(found, from, to) : found.stock;

  return NextResponse.json({ ...found, free });
}
